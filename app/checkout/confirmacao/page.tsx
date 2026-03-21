"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Package, ArrowRight, Mail } from "lucide-react";

function ConfirmacaoContent() {
  const params = useSearchParams();
  const orderId = params.get("pedido");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="max-w-md w-full text-center space-y-8"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="mx-auto w-16 h-16 bg-emerald-100 flex items-center justify-center"
      >
        <Check size={28} strokeWidth={2} className="text-emerald-600" />
      </motion.div>

      <div className="space-y-3">
        <h1 className="font-serif text-3xl text-obsidian">
          Pedido confirmado!
        </h1>
        <p className="font-sans text-sm text-stone-500 leading-relaxed">
          Obrigado por escolher a Raízes. Seu pedido foi recebido e está sendo
          processado com carinho.
        </p>
      </div>

      {orderId && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-xs font-mono text-stone-600">
          <Package size={14} strokeWidth={1.5} />
          Pedido: {orderId.slice(0, 8).toUpperCase()}
        </div>
      )}

      <div className="border border-stone-200 p-5 space-y-3 text-left">
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
              Você receberá um e-mail com o link de pagamento via InfinitePay.
              Após a confirmação do pagamento, seu pedido será preparado e
              enviado.
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="btn-primary inline-flex items-center gap-2"
      >
        Voltar para a loja
        <ArrowRight size={14} strokeWidth={1.5} />
      </Link>
    </motion.div>
  );
}

export default function ConfirmacaoPage() {
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
        <Suspense
          fallback={
            <div className="text-center text-sm text-stone-400">
              Carregando...
            </div>
          }
        >
          <ConfirmacaoContent />
        </Suspense>
      </main>
    </div>
  );
}
