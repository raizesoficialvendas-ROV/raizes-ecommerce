import type { Metadata } from "next";

export const metadata: Metadata = { title: "Configurações" };

export default function AdminConfiguracoesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-normal text-obsidian tracking-tight">Configurações</h1>
        <p className="font-sans text-sm text-stone-500 mt-1">
          Configurações gerais da loja e do painel.
        </p>
      </div>

      <div className="max-w-xl space-y-4">
        {[
          { title: "Integração Supabase", desc: "Banco de dados e autenticação configurados via variáveis de ambiente." },
          { title: "Supabase Storage",    desc: "Bucket product-images para upload de imagens dos produtos." },
          { title: "Next.js Cache",       desc: "revalidatePath é chamado automaticamente ao salvar produtos e coleções." },
          { title: "Stripe / Pagamento",  desc: "Integração de pagamento — disponível na Fase 5." },
        ].map(({ title, desc }) => (
          <div key={title} className="bg-white rounded-xl border border-stone-200 px-5 py-4">
            <p className="font-sans text-sm font-semibold text-obsidian">{title}</p>
            <p className="font-sans text-xs text-stone-400 mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
