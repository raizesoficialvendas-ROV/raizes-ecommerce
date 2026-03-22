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

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="product-card group flex-none w-[300px] md:w-[340px] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Imagem ── */}
      <Link
        href={`/produtos/${product.id}`}
        className="block relative aspect-[3/4] overflow-hidden bg-[#F4F2EF] rounded-2xl transition-all duration-500"
        style={{
          boxShadow: hovered
            ? "0 12px 40px 0 rgba(10,10,10,0.16)"
            : "0 1px 8px 0 rgba(10,10,10,0.07)",
          transform: hovered ? "translateY(-4px)" : "translateY(0px)",
        }}
      >
        {/* Imagem principal */}
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 300px, 340px"
          priority={priority}
          className={`product-card-img object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.04]${hoverImage ? ' group-hover:opacity-0' : ''}`}
        />
        {/* Imagem de hover */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${product.name} — vista alternativa`}
            fill
            sizes="(max-width: 768px) 300px, 340px"
            className="product-card-img object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700 ease-out"
          />
        )}

        {/* ── Badge de tecnologia — design original (retangular, obsidian, ícone Zap) ── */}
        {tech && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-obsidian/90 backdrop-blur-sm px-2.5 py-1.5">
            <Zap size={10} strokeWidth={2} className="text-gold" />
            <span className="font-sans text-[9px] font-semibold tracking-widest uppercase text-ivory">
              {tech}
            </span>
          </div>
        )}

        {/* ── Quick add — aparece no hover na base da imagem ── */}
        <button
          className="absolute bottom-0 left-0 right-0 bg-obsidian/95 backdrop-blur-sm text-ivory font-sans text-[11px] font-medium tracking-widest uppercase py-3 px-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          onClick={(e) => {
            e.preventDefault();
            addItem(product, 1);
          }}
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          <ShoppingBag size={13} strokeWidth={1.5} />
          Adicionar à sacola
        </button>
      </Link>

      {/* ── Info ── */}
      <div className="pt-4 px-1 pb-1">
        <Link href={`/produtos/${product.id}`} className="block group/link">
          <h3 className="font-sans text-[15px] font-bold text-[#141414] tracking-tight mb-1.5 group-hover/link:text-stone-500 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            {/* Se houver preço antigo, viria aqui. Por enquanto formatamos o preço atual */}
            <p className="font-sans text-[15px] font-bold text-[#141414] leading-none">
              {formatCurrency(product.price)}
            </p>
          </div>
          {material && (
            <p className="font-sans text-[10.5px] font-medium tracking-wide uppercase text-stone-500 leading-none">
              {material}
            </p>
          )}
        </div>

        {freeShipping && (
          <div className="flex items-center gap-1 mt-1">
            <Truck size={10} strokeWidth={1.8} className="text-emerald-600" />
            <span className="font-sans text-[10px] font-semibold tracking-wider uppercase text-emerald-600">
              Frete Grátis
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}
