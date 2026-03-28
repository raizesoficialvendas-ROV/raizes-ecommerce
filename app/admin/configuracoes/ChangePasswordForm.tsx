"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Check, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validações em tempo real
  const hasMinLength = next.length >= 8;
  const hasUppercase = /[A-Z]/.test(next);
  const hasNumber = /[0-9]/.test(next);
  const passwordsMatch = next.length > 0 && next === confirm;
  const isFormValid = hasMinLength && hasUppercase && hasNumber && passwordsMatch && current.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();

    // 1. Reautentica com a senha atual para confirmar identidade
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setError("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });

    if (signInError) {
      setError("Senha atual incorreta. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    // 2. Atualiza para a nova senha
    const { error: updateError } = await supabase.auth.updateUser({
      password: next,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message ?? "Erro ao atualizar senha. Tente novamente.");
      return;
    }

    setSuccess(true);
    setCurrent("");
    setNext("");
    setConfirm("");
    setTimeout(() => setSuccess(false), 5000);
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-stone-100">
        <div className="w-10 h-10 rounded-xl bg-obsidian flex items-center justify-center shrink-0">
          <Lock size={17} className="text-ivory" />
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold text-obsidian">Alterar Senha</h2>
          <p className="font-sans text-xs text-stone-400 mt-0.5">
            Mantenha sua conta protegida com uma senha forte.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        {/* Senha atual */}
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-stone-600 tracking-wide uppercase">
            Senha atual
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Digite sua senha atual"
              required
              autoComplete="current-password"
              className="w-full pr-10 pl-4 py-2.5 bg-stone-50 border border-stone-200 font-sans text-sm text-obsidian placeholder:text-stone-300 focus:ring-1 focus:ring-obsidian focus:border-obsidian outline-none transition rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-obsidian transition-colors"
              aria-label={showCurrent ? "Ocultar senha" : "Mostrar senha"}
            >
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-stone-100" />

        {/* Nova senha */}
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-stone-600 tracking-wide uppercase">
            Nova senha
          </label>
          <div className="relative">
            <input
              type={showNext ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              autoComplete="new-password"
              className="w-full pr-10 pl-4 py-2.5 bg-stone-50 border border-stone-200 font-sans text-sm text-obsidian placeholder:text-stone-300 focus:ring-1 focus:ring-obsidian focus:border-obsidian outline-none transition rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowNext((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-obsidian transition-colors"
              aria-label={showNext ? "Ocultar senha" : "Mostrar senha"}
            >
              {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Indicadores de força */}
          {next.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-2">
              {[
                { ok: hasMinLength, label: "Mínimo 8 caracteres" },
                { ok: hasUppercase, label: "Pelo menos 1 letra maiúscula" },
                { ok: hasNumber,    label: "Pelo menos 1 número" },
              ].map(({ ok, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${ok ? "bg-emerald-100" : "bg-stone-100"}`}>
                    <Check size={10} className={ok ? "text-emerald-600" : "text-stone-300"} strokeWidth={2.5} />
                  </div>
                  <span className={`font-sans text-xs transition-colors ${ok ? "text-emerald-600" : "text-stone-400"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmar nova senha */}
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-stone-600 tracking-wide uppercase">
            Confirmar nova senha
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a nova senha"
              required
              autoComplete="new-password"
              className={[
                "w-full pr-10 pl-4 py-2.5 bg-stone-50 border font-sans text-sm text-obsidian placeholder:text-stone-300 focus:ring-1 outline-none transition rounded-lg",
                confirm.length > 0
                  ? passwordsMatch
                    ? "border-emerald-300 focus:ring-emerald-400 focus:border-emerald-400"
                    : "border-red-300 focus:ring-red-400 focus:border-red-400"
                  : "border-stone-200 focus:ring-obsidian focus:border-obsidian",
              ].join(" ")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-obsidian transition-colors"
              aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirm.length > 0 && !passwordsMatch && (
            <p className="font-sans text-xs text-red-500 mt-1">As senhas não coincidem.</p>
          )}
        </div>

        {/* Feedback de erro */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle size={15} className="text-red-500 shrink-0" />
              <p className="font-sans text-xs text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback de sucesso */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
            >
              <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
              <p className="font-sans text-xs text-emerald-700 font-medium">
                Senha alterada com sucesso! Utilize a nova senha no próximo login.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-obsidian text-ivory font-sans text-sm font-medium rounded-lg hover:bg-obsidian/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Atualizando...
            </>
          ) : success ? (
            <>
              <Check size={15} strokeWidth={2.5} />
              Senha atualizada!
            </>
          ) : (
            <>
              <Lock size={15} />
              Salvar nova senha
            </>
          )}
        </button>
      </form>
    </div>
  );
}
