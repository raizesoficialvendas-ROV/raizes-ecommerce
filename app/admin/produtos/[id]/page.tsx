import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/actions/products";
import { getAdminCollections } from "@/lib/actions/collections";
import ProductForm from "@/components/admin/ProductForm";
import type { Metadata } from "next";
import type { Category, Product } from "@/types/database.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getAdminProductById(id);
  return { title: product ? `Editar — ${product.name}` : "Produto não encontrado" };
}

export default async function EditarProdutoPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCollections(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <p className="font-sans text-xs text-stone-400 uppercase tracking-widest mb-1">Produtos</p>
        <h1 className="font-serif text-2xl font-normal text-obsidian tracking-tight">
          Editar Produto
        </h1>
        <p className="font-sans text-sm text-stone-500 mt-1">
          Altere os campos desejados e clique em &quot;Salvar alterações&quot;.
        </p>
      </div>

      <ProductForm
        categories={categories as Category[]}
        product={product as Product & { categories?: Category | null }}
      />
    </div>
  );
}
