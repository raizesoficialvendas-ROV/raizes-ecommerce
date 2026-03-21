import { getAdminCollections } from "@/lib/actions/collections";
import ProductForm from "@/components/admin/ProductForm";
import type { Metadata } from "next";
import type { Category } from "@/types/database.types";

export const metadata: Metadata = { title: "Novo Produto" };

export default async function NovoProdutoPage() {
  const categories = (await getAdminCollections()) as Category[];

  return (
    <div>
      <div className="mb-8">
        <p className="font-sans text-xs text-stone-400 uppercase tracking-widest mb-1">Produtos</p>
        <h1 className="font-serif text-2xl font-normal text-obsidian tracking-tight">
          Novo Produto
        </h1>
        <p className="font-sans text-sm text-stone-500 mt-1">
          Preencha os campos abaixo para adicionar um novo produto ao catálogo.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
