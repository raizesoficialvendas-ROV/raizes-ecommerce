"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/database.types";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export default function ProductCard({
  product,
  index = 0,
  priority = false,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCartStore();

  const mainImage =
    product.images_urls && product.images_urls.length > 0
      ? product.images_urls[0]
      : `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&fit=crop`;

  const hoverImage =
    product.images_urls && product.images_urls.length > 1
      ? product.images_urls[1]
      : null;

  const meta = product.metadata as Record<string, unknown> | null;
  const tech = meta?.tech ? String(meta.tech) : null;
  const material = meta?.material ? String(meta.material) : null;
  const freeShipping = meta?.free_shipping === true;
  const originalPrice = meta?.original_price ? Number(meta.original_price) : null;
  const isBestSeller = meta?.best_seller === true;

  // Calcula desconto se houver preço original
  const discountPct =
    originalPrice && originalPrice > product.price
      ? Math.round((1 - product.price / originalPrice) * 100)
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="product-card group flex-none w-[260px] md:w-[300px] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Área da Imagem ── */}
      <Link
        href={`/produtos/${product.id}`}
        className="block relative aspect-[4/5] overflow-hidden bg-zinc-100 rounded-sm"
        style={{
          transition: "box-shadow 0.3s ease",
          boxShadow: hovered
            ? "0 8px 28px rgba(0,0,0,0.14)"
            : "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Imagem principal */}
        <Image
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
            src={hoverImage}
            alt={`${product.name} — vista alternativa`}
            fill
            sizes="(max-width: 768px) 260px, 300px"
            className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            style={{ mixBlendMode: "multiply" }}
          />
        )}

        {/* ── Badges: top-right — estilo Insider (branco + borda preta) ── */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          {isBestSeller && (
            <span className="bg-white border border-black text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide leading-tight">
              Best Seller
            </span>
          )}
          {discountPct && (
            <span className="bg-white border border-black text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide leading-tight">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* ── Tech badge: top-left — identidade Raízes (preto + ícone gold) ── */}
        {tech && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {tech.split(",").map((t) => (
              <div
                key={t.trim()}
                className="flex items-center gap-1 bg-black/90 backdrop-blur-sm px-2 py-1"
              >
                <Zap size={9} strokeWidth={2} className="text-gold shrink-0" />
                <span className="font-sans text-[9px] font-semibold tracking-widest uppercase text-white leading-none">
                  {t.trim()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Quick add — barra preta desliza da base no hover ── */}
        <button
          className="absolute bottom-0 left-0 right-0 bg-black text-white font-sans text-[11px] font-bold tracking-widest uppercase py-3 px-4 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
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

        {/* Material (discreto, abaixo do título) */}
        {material && (
          <p className="font-sans text-[11px] font-normal text-[#6B7280] uppercase tracking-wide leading-none">
            {material}
          </p>
        )}

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
