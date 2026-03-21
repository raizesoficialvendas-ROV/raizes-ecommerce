import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Minha Conta", template: "%s | Raízes" },
};

export default async function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/conta/pedidos");
  }

  const displayName =
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "Cliente";

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="raizes-container flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-serif text-xl tracking-tight text-obsidian"
          >
            Raízes
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/conta/pedidos"
              className="font-sans text-xs font-medium tracking-widest uppercase text-stone-600 hover:text-obsidian transition-colors"
            >
              Meus Pedidos
            </Link>
            <Link
              href="/"
              className="font-sans text-xs text-stone-400 hover:text-obsidian transition-colors"
            >
              Voltar à Loja
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="raizes-container py-12 md:py-16">
        <div className="mb-10">
          <p className="font-sans text-xs text-stone-400 uppercase tracking-widest mb-2">
            Minha Conta
          </p>
          <h1 className="font-serif text-3xl text-obsidian tracking-tight">
            Olá, {displayName}
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
