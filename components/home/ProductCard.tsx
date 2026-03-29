"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, Star } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import type { Product, ColorEntry } from "@/types/database.types";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
  grid?: boolean;
  reviewAvg?: number;
  reviewCount?: number;
}

export default function ProductCard({
  product,
  index = 0,
  priority = false,
  grid = false,
  reviewAvg,
  reviewCount,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCartStore();

  const meta = product.metadata as Record<string, unknown> | null;
  const tech = meta?.tech ? String(meta.tech) : null;
  const material = meta?.material ? String(meta.material) : null;
  const freeShipping = meta?.free_shipping === true;
  const originalPrice = meta?.original_price ? Number(meta.original_price) : null;
  const isBestSeller = meta?.best_seller === true;
  const colors = useMemo<ColorEntry[]>(() => {
    if (meta?.colors && Array.isArray(meta.colors)) return meta.colors as ColorEntry[];
    return [];
  }, [meta]);

  const allImages = product.images_urls ?? [];

  // Cor selecionada: índice no array colors (null = sem cores)
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(
    colors.length > 0 ? 0 : null
  );

  // Imagens filtradas pela cor ativa
  const activeImages = useMemo<string[]>(() => {
    if (selectedColorIdx === null || colors.length === 0) return allImages;
    const c = colors[selectedColorIdx];
    if (!c || c.imageIndexes.length === 0) return allImages;
    const filtered = c.imageIndexes.filter((i) => i < allImages.length).map((i) => allImages[i]);
    return filtered.length > 0 ? filtered : allImages;
  }, [selectedColorIdx, colors, allImages]);

  const mainImage =
    activeImages.length > 0
      ? activeImages[0]
      : `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&fit=crop`;

  const hoverImage = activeImages.length > 1 ? activeImages[1] : null;

  const discountPct =
    originalPrice && originalPrice > product.price
      ? Math.round((1 - product.price / originalPrice) * 100)
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      className={`product-card group cursor-pointer ${
        grid ? "w-full" : "flex-none w-[260px] md:w-[300px]"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Área da Imagem ── */}
      <Link
        href={`/produtos/${product.id}`}
        className="block relative aspect-[4/5] overflow-hidden bg-stone-100 rounded-lg"
        style={{
          transition: "box-shadow 0.3s ease",
          boxShadow: hovered
            ? "0 8px 28px rgba(0,0,0,0.14)"
            : "0 1px 6px rgba(0,0,0,0.06)",
          borderRadius: "8px",
        }}
      >
        {/* Imagem principal */}
        <Image
          key={mainImage}
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 260px, 300px"
          priority={priority}
          className={`object-cover object-center transition-all duration-500 ease-out${
            hoverImage ? " group-hover:opacity-0" : ""
          }`}
          style={{ mixBlendMode: "multiply" }}
        />
        {/* Imagem de hover */}
        {hoverImage && (
          <Image
            key={hoverImage}
            src={hoverImage}
            alt={`${product.name} — vista alternativa`}
            fill
            sizes="(max-width: 768px) 260px, 300px"
            className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            style={{ mixBlendMode: "multiply" }}
          />
        )}

        {/* ── Badges: top-right ── */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          {isBestSeller && (
            <span className="text-[#F8F5F0] text-[10px] font-semibold uppercase tracking-widest leading-tight drop-shadow-sm">
              Best Seller
            </span>
          )}
          {discountPct && (
            <span className="text-[#F8F5F0] text-[10px] font-semibold uppercase tracking-widest leading-tight drop-shadow-sm">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* ── Tech badge: top-left ── */}
        {tech && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {tech.split(",").map((t) => (
              <span
                key={t.trim()}
                className="font-sans text-[9px] font-semibold tracking-widest uppercase text-[#F8F5F0] leading-none drop-shadow-sm"
              >
                {t.trim()}
              </span>
            ))}
          </div>
        )}

        {/* ── Quick add ── */}
        <button
          className="absolute bottom-0 left-0 right-0 bg-obsidian/90 backdrop-blur-sm text-white font-sans text-[11px] font-bold tracking-widest uppercase py-3 px-4 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
          onClick={(e) => {
            e.preventDefault();
            addItem(product, 1);
          }}
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          <ShoppingBag size={12} strokeWidth={2} />
          COMPRA RÁPIDA
        </button>
      </Link>

      {/* ── Info ── */}
      <div className="pt-3 flex flex-col gap-1">
        {/* Título */}
        <Link href={`/produtos/${product.id}`} className="block">
          <h3 className="!font-sans text-[14px] !font-medium text-[#111827] leading-snug truncate hover:text-[#6B7280] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* ── Swatches de cores ── */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {colors.map((color, idx) => (
              <button
                key={idx}
                type="button"
                title={color.name}
                aria-label={`Cor: ${color.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColorIdx(idx);
                }}
                className={[
                  "w-4 h-4 rounded-full border transition-all duration-150 focus-visible:outline-none",
                  selectedColorIdx === idx
                    ? "border-obsidian scale-110 shadow-sm ring-1 ring-obsidian/20 ring-offset-1"
                    : "border-stone-300 hover:border-stone-500 hover:scale-110",
                ].join(" ")}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {colors.length > 1 && (
              <span className="font-sans text-[10px] text-stone-400 leading-none ml-0.5">
                {colors.length} cores
              </span>
            )}
          </div>
        )}

        {/* Material */}
        {material && (
          <p className="font-sans text-[11px] font-normal text-[#6B7280] uppercase tracking-wide leading-none">
            {material}
          </p>
        )}

        {/* Avaliações */}
        {reviewCount && reviewCount > 0 && reviewAvg ? (
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-sans text-[11px] font-semibold text-[#111827] leading-none">
              {reviewAvg.toFixed(1)}
            </span>
            <span className="font-sans text-[11px] text-[#6B7280] leading-none">
              ({reviewCount.toLocaleString("pt-BR")})
            </span>
          </div>
        ) : null}

        {/* Preços */}
        <div className="flex items-baseline gap-2 mt-0.5">
          {originalPrice && originalPrice > product.price && (
            <span className="font-sans text-[12px] text-[#6B7280] line-through font-normal leading-none">
              {formatCurrency(originalPrice)}
            </span>
          )}
          <span className="font-sans text-[15px] font-bold text-[#111827] leading-none">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Frete Grátis */}
        {freeShipping && (
          <div className="flex items-center gap-1 mt-0.5">
            <Truck size={10} strokeWidth={2} className="text-emerald-600 shrink-0" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wide text-emerald-600 leading-none">
              Frete Grátis
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}
