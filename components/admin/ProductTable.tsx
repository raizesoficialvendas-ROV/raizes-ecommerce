"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil, Trash2, Eye, EyeOff, ChevronDown, ChevronUp,
  ArrowUpRight, Search, Plus
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toggleProductStatus, deleteProduct } from "@/lib/actions/products";
import { useToastStore } from "@/store/useToastStore";
import type { ProductWithCategory } from "@/types/database.types";

const PLACEHOLDER = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&q=80&fit=crop";

interface ProductTableProps {
  products: ProductWithCategory[];
}

type SortKey = "name" | "price" | "stock_quantity" | "status" | "created_at";

export default function ProductTable({ products: initialProducts }: ProductTableProps) {
  const toast = useToastStore();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // ── Sorting ──
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...products]
    .filter((p) =>
      search
        ? p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.categories?.name.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const av = (a as any)[sortKey];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bv = (b as any)[sortKey];
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return sortDir === "asc" ? cmp : -cmp;
    });

  // ── Toggle status ──
  function handleToggle(id: string, current: "draft" | "published") {
    startTransition(async () => {
      const { error } = await toggleProductStatus(id, current);
      if (error) {
        toast.error("Erro ao alterar status", error);
        return;
      }
      const next = current === "published" ? "draft" : "published";
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: next } : p))
      );
      toast.success(
        next === "published" ? "Produto publicado!" : "Produto movido para rascunho.",
        ""
      );
    });
  }

  // ── Delete ──
  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const { error } = await deleteProduct(id);
      setDeletingId(null);
      setConfirmDeleteId(null);
      if (error) {
        toast.error("Erro ao excluir produto", error);
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Produto excluído.", "A operação não pode ser desfeita.");
    });
  }

  // ── Sort icon helper ──
  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
    ) : null;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-all"
          />
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-obsidian text-ivory text-sm font-medium rounded-lg hover:bg-obsidian/90 transition-colors"
        >
          <Plus size={15} />
          Novo Produto
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                {(
                  [
                    { label: "Produto",  key: "name" as SortKey, w: "w-[300px]" },
                    { label: "Preço",    key: "price" as SortKey },
                    { label: "Estoque",  key: "stock_quantity" as SortKey },
                    { label: "Status",   key: "status" as SortKey },
                    { label: "Data",     key: "created_at" as SortKey },
                  ] as { label: string; key: SortKey; w?: string }[]
                ).map(({ label, key, w }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`text-left px-4 py-3 font-sans font-medium text-xs text-stone-500 uppercase tracking-wider cursor-pointer select-none hover:text-obsidian transition-colors ${w ?? ""}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      <SortIcon k={key} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-sans font-medium text-xs text-stone-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <AnimatePresence initial={false}>
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-stone-400 text-sm font-sans">
                      {search ? "Nenhum produto encontrado." : "Nenhum produto cadastrado ainda."}
                    </td>
                  </tr>
                )}
                {sorted.map((product) => {
                  const img = product.images_urls?.[0] ?? PLACEHOLDER;
                  const isDeleting = deletingId === product.id;

                  return (
                    <motion.tr
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: isDeleting ? 0.4 : 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      {/* Produto */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 rounded-md overflow-hidden bg-stone-100 shrink-0">
                            <Image
                              src={img}
                              alt={product.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-sans font-medium text-obsidian truncate max-w-[200px]">
                              {product.name}
                            </p>
                            {product.categories && (
                              <p className="font-sans text-xs text-stone-400 truncate">
                                {product.categories.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Preço */}
                      <td className="px-4 py-3 font-sans text-obsidian font-medium whitespace-nowrap">
                        {formatCurrency(product.price)}
                      </td>

                      {/* Estoque */}
                      <td className="px-4 py-3">
                        <span
                          className={`font-sans text-sm font-medium ${
                            product.stock_quantity === 0
                              ? "text-red-500"
                              : product.stock_quantity <= 5
                              ? "text-amber-500"
                              : "text-emerald-600"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(product.id, product.status)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1.5 cursor-pointer group"
                          title={
                            product.status === "published"
                              ? "Clique para tornar rascunho"
                              : "Clique para publicar"
                          }
                        >
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                              product.status === "published"
                                ? "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"
                                : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
                            }`}
                          >
                            {product.status === "published" ? (
                              <>
                                <Eye size={11} /> Ativo
                              </>
                            ) : (
                              <>
                                <EyeOff size={11} /> Rascunho
                              </>
                            )}
                          </span>
                        </button>
                      </td>

                      {/* Data */}
                      <td className="px-4 py-3 font-sans text-xs text-stone-400 whitespace-nowrap">
                        {new Date(product.created_at).toLocaleDateString("pt-BR")}
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/produtos/${product.id}`}
                            target="_blank"
                            className="p-1.5 text-stone-400 hover:text-obsidian transition-colors rounded-md hover:bg-stone-100"
                            title="Ver no site"
                          >
                            <ArrowUpRight size={15} />
                          </Link>
                          <Link
                            href={`/admin/produtos/${product.id}`}
                            className="p-1.5 text-stone-400 hover:text-obsidian transition-colors rounded-md hover:bg-stone-100"
                            title="Editar produto"
                          >
                            <Pencil size={15} />
                          </Link>

                          {confirmDeleteId === product.id ? (
                            <span className="flex items-center gap-1 ml-1">
                              <button
                                onClick={() => handleDelete(product.id)}
                                disabled={isDeleting}
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded-md hover:bg-stone-200 transition-colors cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(product.id)}
                              className="p-1.5 text-stone-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 cursor-pointer"
                              title="Excluir produto"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {sorted.length > 0 && (
          <div className="px-4 py-3 border-t border-stone-100 bg-stone-50">
            <p className="font-sans text-xs text-stone-400">
              {sorted.length} {sorted.length === 1 ? "produto" : "produtos"}
              {search && ` encontrado${sorted.length === 1 ? "" : "s"}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
