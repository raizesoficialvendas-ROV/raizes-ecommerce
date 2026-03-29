"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Zap, Truck, ChevronDown, Shield, Repeat, Droplets, Minus, Plus, Star } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import type { Product, ColorEntry } from "@/types/database.types";
import ProductCharacteristics from "./ProductCharacteristics";
import ProductShippingEstimate from "./ProductShippingEstimate";

const SIZES = ["P", "M", "G", "GG"];

const CARE_ICONS = [
  { icon: Droplets, label: "Lavar à mão ou ciclo delicado" },
  { icon: Shield, label: "Não usar alvejante" },
  { icon: Repeat, label: "Secar à sombra" },
];

interface ProductInfoProps {
  product: Product;
  categoryName?: string;
  colors?: ColorEntry[];
  selectedColorIdx?: number | null;
  onColorChange?: (idx: number) => void;
  reviewAvg?: number;
  reviewCount?: number;
}

type AccordionSection = {
  id: string;
  label: string;
  content: ReactNode;
};

export default function ProductInfo({ product, categoryName, colors, selectedColorIdx, onColorChange, reviewAvg, reviewCount }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("descricao");
  const addItem = useCartStore((state) => state.addItem);

  const maxStock = product.stock_quantity ?? 99;

  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQty() {
    setQuantity((q) => Math.min(maxStock, q + 1));
  }

  const meta = product.metadata as Record<string, string> | null;

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem(product, quantity, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const specs = meta
    ? (Object.entries(meta).filter(
        ([k, v]) =>
          !["tech", "material", "slug", "sizes"].includes(k) &&
          typeof v === "string" &&
          v.trim() !== ""
      ) as [string, string][])
    : [];

  const accordionSections: AccordionSection[] = [
    ...(product.description
      ? [
          {
            id: "descricao",
            label: "Descrição",
            content: (
              <p className="font-sans text-sm text-stone-500 leading-[1.9]">
                {product.description}
              </p>
            ),
          },
        ]
      : []),
    ...(meta?.material || meta?.tech || specs.length > 0
      ? [
          {
            id: "tecnologia",
            label: "Tecnologia & Material",
            content: (
              <div>
                {meta?.material && (
                  <div className="flex items-baseline justify-between py-3.5 border-b border-stone-100">
                    <p className="font-sans text-[11px] font-medium text-stone-400 tracking-widest uppercase">
                      Material
                    </p>
                    <p className="font-sans text-sm text-obsidian">{meta.material}</p>
                  </div>
                )}
                {meta?.tech && (
                  <div className="flex items-baseline justify-between py-3.5 border-b border-stone-100">
                    <p className="font-sans text-[11px] font-medium text-stone-400 tracking-widest uppercase">
                      Tecnologia
                    </p>
                    <p className="font-sans text-sm text-obsidian">{meta.tech}</p>
                  </div>
                )}
                {specs.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-baseline justify-between py-3.5 border-b border-stone-100 last:border-b-0"
                  >
                    <p className="font-sans text-[11px] font-medium text-stone-400 tracking-widest uppercase">
                      {key}
                    </p>
                    <p className="font-sans text-sm text-obsidian">{value}</p>
                  </div>
                ))}
              </div>
            ),
          },
        ]
      : []),
    {
      id: "cuidados",
      label: "Cuidados com a peça",
      content: (
        <div className="grid grid-cols-3 gap-2">
          {CARE_ICONS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col gap-3 p-4 bg-stone-50">
              <Icon size={16} strokeWidth={1.25} className="text-stone-400" />
              <span className="font-sans text-[11px] text-stone-500 leading-[1.6]">{label}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* Categoria */}
      {categoryName && (
        <p className="label-category text-stone-400">{categoryName}</p>
      )}

      {/* Nome */}
      <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-[1.15]">
        {product.name}
      </h1>

      {/* Avaliações inline */}
      {reviewCount && reviewCount > 0 && reviewAvg ? (
        <div className="flex items-center gap-1.5 -mt-1">
          {[1,2,3,4,5].map((s) => (
            <Star
              key={s}
              size={12}
              className={s <= Math.round(reviewAvg) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}
            />
          ))}
          <span className="font-sans text-sm font-medium text-obsidian ml-1">
            {reviewAvg.toFixed(1)}
          </span>
          <span className="font-sans text-sm text-stone-400">
            ({reviewCount.toLocaleString("pt-BR")} {reviewCount === 1 ? "avaliação" : "avaliações"})
          </span>
        </div>
      ) : null}

      {/* Preço */}
      <div className="flex items-baseline gap-3">
        <p className="font-sans text-2xl font-light text-obsidian">
          {formatCurrency(product.price * quantity)}
        </p>
        {quantity > 1 ? (
          <p className="font-sans text-xs text-stone-400 tracking-wide">
            {quantity}× {formatCurrency(product.price)}
          </p>
        ) : (
          <p className="font-sans text-xs text-stone-400 tracking-wide">
            ou 6× de {formatCurrency(product.price / 6)} sem juros
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {(product.metadata as Record<string, unknown> | null)?.free_shipping === true && (
          <div className="flex items-center gap-2 w-fit bg-emerald-50 border border-emerald-200 px-3 py-1.5">
            <Truck size={12} strokeWidth={1.8} className="text-emerald-600" />
            <span className="font-sans text-[11px] font-medium tracking-wide uppercase text-emerald-700">
              Frete Grátis
            </span>
          </div>
        )}
        {meta?.tech && (
          <div className="flex items-center gap-2 w-fit bg-stone-100 px-3 py-1.5">
            <Zap size={11} strokeWidth={2} className="text-gold" />
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
      </div>

      <div className="w-8 h-px bg-stone-200" />

      {/* Cores */}
      {colors && colors.length > 0 && (
        <div>
          <p className="font-sans text-xs font-medium tracking-widest uppercase text-stone-600 mb-4">
            Cor
            {selectedColorIdx !== null && selectedColorIdx !== undefined && (
              <span className="ml-2 text-obsidian font-semibold">
                — {colors[selectedColorIdx]?.name}
              </span>
            )}
          </p>
          <div className="flex gap-3 flex-wrap">
            {colors.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onColorChange?.(idx)}
                title={color.name}
                aria-label={`Cor: ${color.name}`}
                className={[
                  "relative w-8 h-8 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                  selectedColorIdx === idx
                    ? "border-obsidian scale-110 shadow-md"
                    : "border-stone-200 hover:border-stone-400 hover:scale-105",
                ].join(" ")}
                style={{ backgroundColor: color.hex }}
              >
                {selectedColorIdx === idx && (
                  <span
                    className="absolute inset-0 rounded-full ring-2 ring-offset-1 ring-obsidian/30"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tamanho */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-sans text-xs font-medium tracking-widest uppercase text-stone-600">
            Tamanho
          </p>
          <button className="font-sans text-xs text-stone-400 hover:text-obsidian transition-colors duration-300 underline-reveal">
            Guia de tamanhos
          </button>
        </div>

        <div className="flex gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => { setSelectedSize(size); setSizeError(false); }}
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

      {/* Quantidade */}
      <div>
        <p className="font-sans text-xs font-medium tracking-widest uppercase text-stone-600 mb-4">
          Quantidade
        </p>
        <div className="flex items-center gap-0">
          <button
            onClick={decreaseQty}
            disabled={quantity <= 1}
            aria-label="Diminuir quantidade"
            className="w-12 h-12 flex items-center justify-center border border-stone-200 text-stone-600 hover:border-obsidian hover:text-obsidian transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-stone-200 disabled:hover:text-stone-600"
          >
            <Minus size={13} strokeWidth={1.8} />
          </button>
          <div className="w-14 h-12 flex items-center justify-center border-y border-stone-200 font-sans text-sm font-medium text-obsidian select-none">
            {quantity}
          </div>
          <button
            onClick={increaseQty}
            disabled={quantity >= maxStock}
            aria-label="Aumentar quantidade"
            className="w-12 h-12 flex items-center justify-center border border-stone-200 text-stone-600 hover:border-obsidian hover:text-obsidian transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-stone-200 disabled:hover:text-stone-600"
          >
            <Plus size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* CTA */}
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

      {/* ── Estimativa de Frete ── */}
      <ProductShippingEstimate />

      {/* ── Características ── */}
      <ProductCharacteristics />

      {/* ── Accordion ── */}
      <div className="border-t border-stone-100 mt-1">
        {accordionSections.map((section) => (
          <div key={section.id} className="border-b border-stone-100">
            <button
              onClick={() =>
                setOpenSection(openSection === section.id ? null : section.id)
              }
              className="w-full flex items-center justify-between py-4 text-left group"
            >
              <span className="label-category text-stone-500 group-hover:text-obsidian transition-colors duration-300">
                {section.label}
              </span>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className={[
                  "text-stone-400 transition-transform duration-300 shrink-0",
                  openSection === section.id ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>
            <AnimatePresence initial={false}>
              {openSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="pb-6">{section.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}