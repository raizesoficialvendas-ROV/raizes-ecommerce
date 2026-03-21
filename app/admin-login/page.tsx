"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sprout, Eye, EyeOff, Loader2 } from "lucide-react";
import type { Metadata } from "next";

// Note: metadata não funciona em Client Components — está no segment config abaixo.
export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("E-mail ou senha inválidos.");
        return;
      }

      router.push("/admin/produtos");
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center mb-4">
            <Sprout size={22} className="text-obsidian" />
          </div>
          <h1 className="font-serif text-2xl font-normal text-ivory tracking-tight">
            Raízes Admin
          </h1>
          <p className="font-sans text-sm text-stone-400 mt-1">
            Painel de administração
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-xs font-medium text-stone-400 uppercase tracking-wider mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@raizes.com.br"
              className="
                w-full px-4 py-3 rounded-lg
                bg-white/5 border border-white/10
                text-ivory placeholder-stone-600
                font-sans text-sm
                focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60
                transition-all
              "
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-medium text-stone-400 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="
                  w-full px-4 py-3 rounded-lg pr-11
                  bg-white/5 border border-white/10
                  text-ivory placeholder-stone-600
                  font-sans text-sm
                  focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60
                  transition-all
                "
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="font-sans text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="
              w-full py-3 rounded-lg
              bg-gold text-obsidian
              font-sans text-sm font-semibold
              hover:bg-gold/90 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
              cursor-pointer
            "
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
