"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Truck,
  CreditCard,
  Check,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CHECKOUT_STEPS = [
  { id: 1, label: "Conta", icon: User },
  { id: 2, label: "Sacola", icon: ShoppingBag },
  { id: 3, label: "Entrega", icon: Truck },
  { id: 4, label: "Pagamento", icon: CreditCard },
];

type Mode = "login" | "register";

function CheckoutLoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/checkout/resumo";

  const [mode, setMode] = useState<Mode>("login");
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0);
  const isSubmittingRef = useRef(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Se já estiver logado, redireciona
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(redirect);
    });
  }, [router, redirect]);

  // Cooldown timer — conta regressiva após 429
  useEffect(() => {
    if (rateLimitCooldown <= 0) return;
    cooldownTimerRef.current = setInterval(() => {
      setRateLimitCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, [rateLimitCooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmittingRef.current || rateLimitCooldown > 0) return; // bloqueia duplo envio e cooldown
    isSubmittingRef.current = true;
    setError(null);

    startTransition(async () => {
      try {
        const supabase = createClient();
        const siteUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_SITE_URL ?? "https://raizesoficial.com.br";

        if (mode === "login") {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (authError) {
            const msg = authError.message?.toLowerCase() ?? "";
            if (authError.status === 429 || msg.includes("rate limit")) {
              setRateLimitCooldown(60);
              setError("Muitas tentativas. Tente novamente em 60 segundos.");
            } else {
              setError("E-mail ou senha inválidos.");
            }
            return;
          }
        } else {
          const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name },
              emailRedirectTo: `${siteUrl}/checkout/login?redirect=${encodeURIComponent(redirect)}`,
            },
          });
          if (authError) {
            const msg = authError.message?.toLowerCase() ?? "";
            if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("user already")) {
              setError("Este e-mail já possui uma conta. Faça login.");
              setMode("login");
            } else if (authError.status === 429 || msg.includes("rate limit")) {
              setRateLimitCooldown(60);
              setError("Muitas tentativas. Tente novamente em 60 segundos.");
            } else {
              setError(`Erro ao criar conta: ${authError.message}`);
            }
            return;
          }

          // Confirmação de e-mail desativada, mas por segurança faz login automático
          // caso o Supabase retorne user sem session
          if (data?.user && !data?.session) {
            const { data: signInData, error: signInError } =
              await supabase.auth.signInWithPassword({ email, password });
            if (signInError || !signInData.session) {
              setError("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
              return;
            }
          }
        }

        setSuccess(true);
        setTimeout(() => {
          router.push(redirect);
          router.refresh();
        }, 800);
      } finally {
        isSubmittingRef.current = false;
      }
    });
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 bg-ivory/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl tracking-tight text-obsidian"
          >
            Raízes
          </Link>

          {/* Step indicator — Conta is active */}
          <div className="flex items-center gap-2">
            {CHECKOUT_STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                    s.id === 1
                      ? "bg-obsidian text-ivory"
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  <s.icon size={12} strokeWidth={1.5} />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {idx < CHECKOUT_STEPS.length - 1 && (
                  <div className="w-6 h-px bg-stone-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm space-y-8"
        >
          {/* Badge */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto w-12 h-12 bg-obsidian flex items-center justify-center"
            >
              {success ? (
                <Check size={20} strokeWidth={2} className="text-ivory" />
              ) : (
                <Sparkles size={20} strokeWidth={1.5} className="text-ivory" />
              )}
            </motion.div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  <h1 className="font-serif text-2xl text-obsidian">
                    Bem-vindo!
                  </h1>
                  <p className="font-sans text-sm text-stone-400">
                    Redirecionando para sua sacola...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form-header"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  <h1 className="font-serif text-2xl text-obsidian">
                    {mode === "login"
                      ? "Continue sua compra"
                      : "Crie sua conta"}
                  </h1>
                  <p className="font-sans text-sm text-stone-400">
                    {mode === "login"
                      ? "Entre para finalizar seu pedido com segurança."
                      : "Rápido — só precisamos do essencial."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form */}
          {!success && (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence>
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                      />
                      <input
                        type="text"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={mode === "register"}
                        className="w-full pl-9 pr-3 py-3 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-9 pr-3 py-3 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
                />
              </div>

              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={6}
                  className="w-full pl-9 pr-10 py-3 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-obsidian transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2"
                >
                  {rateLimitCooldown > 0
                    ? `Muitas tentativas. Tente novamente em ${rateLimitCooldown}s.`
                    : error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isPending || rateLimitCooldown > 0}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rateLimitCooldown > 0 ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Aguarde {rateLimitCooldown}s...
                  </>
                ) : isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {mode === "login" ? "Entrando..." : "Criando conta..."}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Entrar e continuar" : "Criar conta e continuar"}
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </>
                )}
              </button>

              {/* Toggle mode */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setError(null);
                  }}
                  className="font-sans text-xs text-stone-400 hover:text-obsidian transition-colors underline-reveal"
                >
                  {mode === "login"
                    ? "Não tem conta? Crie em 10 segundos"
                    : "Já tem conta? Faça login"}
                </button>
              </div>
            </motion.form>
          )}

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-stone-400">
              <Lock size={10} />
              <span className="font-sans text-[10px] tracking-wider uppercase">
                Conexão segura
              </span>
            </div>
            <div className="w-px h-3 bg-stone-200" />
            <span className="font-sans text-[10px] text-stone-400 tracking-wider uppercase">
              Dados protegidos
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function CheckoutLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-stone-400" />
        </div>
      }
    >
      <CheckoutLoginContent />
    </Suspense>
  );
}
