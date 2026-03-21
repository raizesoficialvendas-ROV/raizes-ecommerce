import Link from "next/link";
import { Plus } from "lucide-react";
import ProductTable from "@/components/admin/ProductTable";
import { getAdminProducts } from "@/lib/actions/products";
import type { Metadata } from "next";
import type { ProductWithCategory } from "@/types/database.types";

export const metadata: Metadata = { title: "Produtos" };

export default async function AdminProdutosPage() {
  const products = (await getAdminProducts()) as ProductWithCategory[];

  const published = products.filter((p) => p.status === "published").length;
  const drafts = products.filter((p) => p.status === "draft").length;
  const lowStock = products.filter((p) => p.stock_quantity <= 5 && p.stock_quantity > 0).length;
  const outOfStock = products.filter((p) => p.stock_quantity === 0).length;

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-normal text-obsidian tracking-tight">Produtos</h1>
          <p className="font-sans text-sm text-stone-500 mt-1">
            Gerencie o catálogo de produtos da loja.
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-obsidian text-ivory text-sm font-medium rounded-lg hover:bg-obsidian/90 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Novo Produto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total",        value: products.length, color: "text-obsidian" },
          { label: "Publicados",   value: published,        color: "text-emerald-600" },
          { label: "Rascunhos",    value: drafts,           color: "text-stone-500" },
          { label: "Estoque Baixo",value: lowStock + outOfStock, color: outOfStock > 0 ? "text-red-500" : "text-amber-500" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-stone-200 px-5 py-4"
          >
            <p className="font-sans text-xs text-stone-400 uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className={`font-serif text-3xl font-normal ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <ProductTable products={products} />
    </div>
  );
}
