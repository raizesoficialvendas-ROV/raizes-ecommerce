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
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/conta/pedidos";

  const [mode, setMode] = useState<Mode>("login");
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(redirect);
    });
  }, [router, redirect]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmittingRef.current) return;  // bloqueia duplo envio
    isSubmittingRef.current = true;
    setError(null);

    startTransition(async () => {
      try {
        const supabase = createClient();

      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) {
          setError("E-mail ou senha inválidos.");
          return;
        }
      } else {
        const siteUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_SITE_URL ?? "https://raizesoficial.com.br";

        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${siteUrl}/login?redirect=${encodeURIComponent(redirect)}`,
          },
        });

        if (authError) {
          const msg = authError.message?.toLowerCase() ?? "";
          if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("user already")) {
            setError("Este e-mail já possui uma conta. Faça login.");
            setMode("login");
          } else if (authError.status === 429 || msg.includes("rate limit")) {
            setError("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
          } else {
            // Exibe a mensagem real do Supabase para facilitar diagnóstico
            setError(`Erro ao criar conta: ${authError.message}`);
          }
          return;
        }

        // Se o Supabase retornar session null, pode ser por delay ou por exigeência de confirmação.
        // Já que a confirmação está desativada globalmente, fazemos um signIn logo em seguida.
        if (data?.user && !data?.session) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError || !signInData.session) {
            // Se continuou dando erro, então de fato a conta precisa ser ativada
            setEmailSent(true);
            return;
          }
        }
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = redirect;
      }, 800);
      } finally {
        isSubmittingRef.current = false;
      }
    });
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Header minimalista */}
      <header className="border-b border-stone-200/60 bg-ivory/80 backdrop-blur-sm">
        <div className="raizes-container flex items-center justify-between h-[72px]">
          <Link
            href="/"
            className="font-serif text-xl tracking-tighter text-obsidian select-none"
          >
            Raízes
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 font-sans text-xs font-medium tracking-widest uppercase text-stone-400 hover:text-obsidian transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Voltar à loja
          </Link>
        </div>
      </header>

      {/* Conteúdo central */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm space-y-8"
        >
          {/* Ícone + Título */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="mx-auto w-14 h-14 bg-obsidian flex items-center justify-center"
            >
              {success ? (
                <Check size={22} strokeWidth={2} className="text-ivory" />
              ) : (
                <User size={22} strokeWidth={1.5} className="text-ivory" />
              )}
            </motion.div>

            <AnimatePresence mode="wait">
              {emailSent ? (
                <motion.div
                  key="email-sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  <h1 className="font-serif text-2xl text-obsidian tracking-tight">
                    Confirme seu e-mail
                  </h1>
                  <p className="font-sans text-sm text-stone-400 leading-relaxed">
                    Enviamos um link de confirmação para{" "}
                    <strong className="text-obsidian">{email}</strong>.<br />
                    Clique no link para ativar sua conta e acessar suas compras.
                  </p>
                </motion.div>
              ) : success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  <h1 className="font-serif text-2xl text-obsidian tracking-tight">
                    Bem-vindo de volta!
                  </h1>
                  <p className="font-sans text-sm text-stone-400">
                    Redirecionando...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form-header"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <h1 className="font-serif text-2xl text-obsidian tracking-tight">
                    {mode === "login"
                      ? "Acesse sua conta"
                      : "Crie sua conta"}
                  </h1>
                  <p className="font-sans text-sm text-stone-400 leading-relaxed">
                    {mode === "login"
                      ? "Entre para acompanhar seus pedidos e ter uma experiência completa."
                      : "Rápido e seguro — só precisamos do essencial."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Formulário */}
          {!success && !emailSent && (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Campo Nome (apenas registro) */}
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
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                      />
                      <input
                        type="text"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={mode === "register"}
                        className="w-full pl-10 pr-4 py-3.5 border border-stone-200 text-sm font-sans text-obsidian focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300 bg-transparent"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3.5 border border-stone-200 text-sm font-sans text-obsidian focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300 bg-transparent"
                />
              </div>

              {/* Senha */}
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
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
                  className="w-full pl-10 pr-12 py-3.5 border border-stone-200 text-sm font-sans text-obsidian focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-obsidian transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Erro */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2.5"
                >
                  {error}
                </motion.p>
              )}

              {/* Botão de submit */}
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full justify-center"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {mode === "login" ? "Entrando..." : "Criando conta..."}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Entrar" : "Criar conta"}
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </>
                )}
              </button>

              {/* Toggle login/registro */}
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

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 pt-6 border-t border-stone-100">
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-stone-400" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
