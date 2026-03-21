"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Zap, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/database.types";

const SIZES = ["P", "M", "G", "GG"];

interface ProductInfoProps {
  product: Product;
  categoryName?: string;
}

export default function ProductInfo({ product, categoryName }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { addItem } = useCartStore();

  const meta = product.metadata as Record<string, string> | null;

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem(product, 1, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Categoria */}
      {categoryName && (
        <p className="label-category text-stone-400">{categoryName}</p>
      )}

      {/* Nome */}
      <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight">
        {product.name}
      </h1>

      {/* Preço */}
      <div className="flex items-baseline gap-3">
        <p className="font-sans text-2xl font-light text-obsidian">
          {formatCurrency(product.price)}
        </p>
        <p className="font-sans text-xs text-stone-400 tracking-wide">
          ou 6× de {formatCurrency(product.price / 6)} sem juros
        </p>
      </div>

      {/* Frete grátis badge */}
      {(product.metadata as Record<string, unknown> | null)?.free_shipping === true && (
        <div className="flex items-center gap-2 w-fit bg-emerald-50 border border-emerald-200 px-3 py-2">
          <Truck size={13} strokeWidth={1.8} className="text-emerald-600" />
          <span className="font-sans text-xs font-semibold tracking-wide uppercase text-emerald-700">
            Frete Grátis
          </span>
        </div>
      )}

      {/* Tech badge */}
      {meta?.tech && (
        <div className="flex items-center gap-2 w-fit bg-stone-100 px-3 py-2">
          <Zap size={12} strokeWidth={2} className="text-gold" />
          <span className="font-sans text-[11px] font-semibold tracking-widest uppercase text-stone-600">
            {meta.tech}
          </span>
          {meta.material && (
            <>
              <span className="text-stone-300">·</span>
              <span className="font-sans text-[11px] text-stone-400 tracking-wide">
                {meta.material}
              </span>
            </>
          )}
        </div>
      )}

      <div className="w-8 h-px bg-stone-200" />

      {/* Seletor de Tamanho */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans text-xs font-medium tracking-widest uppercase text-stone-600">
            Tamanho
          </p>
          <button className="font-sans text-xs text-stone-400 underline-reveal hover:text-obsidian transition-colors">
            Guia de tamanhos
          </button>
        </div>

        <div className="flex gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => {
                setSelectedSize(size);
                setSizeError(false);
              }}
              aria-label={`Tamanho ${size}`}
              className={[
                "w-12 h-12 font-sans text-sm font-medium transition-all duration-200",
                selectedSize === size
                  ? "bg-obsidian text-ivory border border-obsidian"
                  : sizeError
                  ? "border border-red-300 text-red-400 hover:border-obsidian hover:text-obsidian"
                  : "border border-stone-200 text-stone-600 hover:border-obsidian hover:text-obsidian",
              ].join(" ")}
            >
              {size}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {sizeError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-sans text-xs text-red-400 mt-2"
            >
              Selecione um tamanho antes de continuar.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Botão Adicionar */}
      <motion.button
        onClick={handleAddToCart}
        whileTap={{ scale: 0.98 }}
        className={[
          "btn-primary w-full justify-center text-center relative overflow-hidden transition-colors duration-300",
          added ? "bg-stone-700" : "",
        ].join(" ")}
        aria-label="Adicionar à sacola"
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2"
            >
              <Check size={14} strokeWidth={2} />
              Adicionado à sacola
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              Adicionar à sacola
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Estoque */}
      {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
        <p className="font-sans text-xs text-stone-400 text-center">
          Apenas {product.stock_quantity} unidades disponíveis.
        </p>
      )}

      {/* Descrição curta */}
      {product.description && (
        <p className="font-sans text-sm text-stone-500 leading-relaxed pt-2 border-t border-stone-100">
          {product.description}
        </p>
      )}
    </div>
  );
}
