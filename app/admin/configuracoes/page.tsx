import type { Metadata } from "next";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata: Metadata = { title: "Configurações" };

export default function AdminConfiguracoesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-normal text-obsidian tracking-tight">
          Configurações
        </h1>
        <p className="font-sans text-sm text-stone-500 mt-1">
          Gerencie as configurações de acesso ao painel administrativo.
        </p>
      </div>

      <div className="max-w-xl space-y-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
