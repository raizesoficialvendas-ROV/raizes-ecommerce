"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Package,
  ArrowRight,
  Loader2,
  Clock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { useCartStore } from "@/store/useCartStore";
import { useUser } from "@/hooks/useUser";

type PaymentState = "checking" | "paid" | "timeout";

function SucessoContent() {
  const params = useSearchParams();
  const orderId = params.get("pedido");
  const transactionId = params.get("transaction_id");
  const isPendingFallback = params.get("pending") === "true";

  const { trackPurchase } = useMetaPixel();
  const { items, totalWithShipping, clearCart } = useCartStore();
  const { user } = useUser();

  const [state, setState] = useState<PaymentState>(
    isPendingFallback ? "timeout" : "checking"
  );
  const pollCountRef = useRef(0);
  const maxPolls = 24; // 24 × 5s = 2 minutos
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const realtimeChannelRef = useRef<ReturnType<
    ReturnType<typeof createClient>["channel"]
  > | null>(null);
  const realtimeDelayRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (realtimeChannelRef.current) {
      const supabase = createClient();
      supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }
    if (realtimeDelayRef.current) {
      clearTimeout(realtimeDelayRef.current);
      realtimeDelayRef.current = null;
    }
  }, []);

  const markAsPaid = useCallback(() => {
    setState("paid");
    cleanup();

    // Purchase event — browser + CAPI (event_id = orderId para deduplicar com webhook)
    if (orderId) {
      const total = totalWithShipping();
      const userMeta = user?.user_metadata;
      trackPurchase(orderId, items, total, {
        email: user?.email,
        phone: userMeta?.phone,
        name: userMeta?.full_name,
      });
      // Limpa o carrinho após registrar a compra
      clearCart();
    }
  }, [cleanup, trackPurchase, items, totalWithShipping, orderId, user, clearCart]);

  // ── Canal A: Supabase Realtime ──
  useEffect(() => {
    if (!orderId || state !== "checking") return;

    const supabase = createClient();
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newStatus = (payload.new as { status?: string })?.status;
          if (newStatus === "paid" || newStatus === "confirmed") {
            markAsPaid();
          }
        }
      )
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, state, markAsPaid]);

  // ── Canal B: Polling fallback — inicia após 5s para dar chance ao Realtime ──
  useEffect(() => {
    if (!orderId || state !== "checking") return;

    const poll = async () => {
      try {
        const res = await fetch("/api/payments/check-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            ...(transactionId ? { transactionId } : {}),
          }),
        });
        const data = await res.json();

        if (data.paid) {
          markAsPaid();
          return;
        }
      } catch {
        // Silently continue polling
      }

      pollCountRef.current += 1;
      if (pollCountRef.current >= maxPolls) {
        setState("timeout");
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      }
    };

    // Aguarda 5s antes de iniciar o polling (dá chance ao Realtime)
    realtimeDelayRef.current = setTimeout(() => {
      poll(); // Poll imediato
      pollIntervalRef.current = setInterval(poll, 5000);
    }, 5000);

    return () => {
      if (realtimeDelayRef.current) {
        clearTimeout(realtimeDelayRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [orderId, transactionId, state, markAsPaid]);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-obsidian"
        >
          Raízes
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <AnimatePresence mode="wait">
          {/* ── State: Checking ── */}
          {state === "checking" && (
            <motion.div
              key="checking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full text-center space-y-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mx-auto w-16 h-16 border-2 border-stone-200 border-t-obsidian flex items-center justify-center rounded-full"
              />

              <div className="space-y-3">
                <h1 className="font-serif text-2xl text-obsidian">
                  Aguardando confirmação
                </h1>
                <p className="font-sans text-sm text-stone-500 leading-relaxed">
                  Estamos verificando seu pagamento. Isso pode levar alguns
                  instantes — não feche esta página.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-stone-400">
                <ShieldCheck size={14} />
                <span className="font-sans text-xs">
                  Conexão segura com a InfinitePay
                </span>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-obsidian"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── State: Paid ✅ ── */}
          {state === "paid" && (
            <motion.div
              key="paid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-lg w-full text-center space-y-10"
            >
              {/* Celebration animation */}
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="mx-auto w-20 h-20 bg-emerald-50 border border-emerald-200 flex items-center justify-center"
                >
                  <Check
                    size={36}
                    strokeWidth={2}
                    className="text-emerald-600"
                  />
                </motion.div>

                {/* Sparkle decorations */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="absolute top-0 right-1/3 text-gold"
                >
                  <Sparkles size={16} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="absolute bottom-0 left-1/3 text-gold"
                >
                  <Sparkles size={12} />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <h1 className="font-display text-4xl text-obsidian tracking-tight">
                  Pagamento confirmado!
                </h1>
                <p className="font-sans text-sm text-stone-500 leading-relaxed max-w-sm mx-auto">
                  Obrigado por escolher a Raízes. Seu pedido foi confirmado e
                  será preparado com todo carinho e propósito.
                </p>
              </motion.div>

              {orderId && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 text-xs font-mono text-stone-600"
                >
                  <Package size={14} strokeWidth={1.5} />
                  Pedido: {orderId.slice(0, 8).toUpperCase()}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="border border-stone-200 p-6 space-y-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <Mail
                    size={16}
                    strokeWidth={1.5}
                    className="text-stone-400 mt-0.5"
                  />
                  <div>
                    <p className="font-sans text-sm font-medium text-obsidian">
                      Próximos passos
                    </p>
                    <p className="font-sans text-xs text-stone-400 mt-1 leading-relaxed">
                      Você receberá um e-mail de confirmação com os detalhes do
                      pedido. Assim que for despachado, enviaremos o código de
                      rastreio.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* CTA Principal — Minhas Compras */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-4"
              >
                <Link
                  href="/conta/pedidos"
                  className="btn-primary inline-flex items-center gap-3 justify-center text-base py-4"
                >
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  Acessar Minhas Compras
                  <ArrowRight size={16} strokeWidth={1.5} />
                </Link>
                <Link
                  href="/"
                  className="font-sans text-xs text-stone-400 hover:text-obsidian transition-colors"
                >
                  Continuar explorando a loja
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* ── State: Timeout ── */}
          {state === "timeout" && (
            <motion.div
              key="timeout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md w-full text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="mx-auto w-16 h-16 bg-amber-100 flex items-center justify-center"
              >
                <Clock size={28} strokeWidth={1.5} className="text-amber-600" />
              </motion.div>

              <div className="space-y-3">
                <h1 className="font-serif text-2xl text-obsidian">
                  Pagamento em processamento
                </h1>
                <p className="font-sans text-sm text-stone-500 leading-relaxed">
                  Seu pedido foi registrado! Se o pagamento já foi realizado,
                  pode levar alguns minutos para a confirmação. Você receberá
                  um e-mail assim que for processado.
                </p>
              </div>

              {orderId && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-xs font-mono text-stone-600">
                  <Package size={14} strokeWidth={1.5} />
                  Pedido: {orderId.slice(0, 8).toUpperCase()}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Link
                  href="/conta/pedidos"
                  className="btn-primary inline-flex items-center gap-2 justify-center"
                >
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  Acessar Minhas Compras
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
                <button
                  onClick={() => {
                    pollCountRef.current = 0;
                    setState("checking");
                  }}
                  className="font-sans text-xs text-stone-400 hover:text-obsidian transition-colors"
                >
                  Verificar novamente
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function CheckoutSucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-stone-400" />
        </div>
      }
    >
      <SucessoContent />
    </Suspense>
  );
}
