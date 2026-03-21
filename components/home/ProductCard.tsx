"use client";

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
  const { addItem } = useCartStore();

  const mainImage =
    product.images_urls && product.images_urls.length > 0
      ? product.images_urls[0]
      : `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&fit=crop`;

  const hoverImage =
    product.images_urls && product.images_urls.length > 1
      ? product.images_urls[1]
      : mainImage;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="product-card group flex-none w-[280px] md:w-[320px] cursor-pointer"
    >
      {/* ── Imagem ── */}
      <Link
        href={`/produtos/${product.id}`}
        className="block relative aspect-[3/4] overflow-hidden bg-stone-100"
      >
        {/* Imagem principal */}
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 280px, 320px"
          priority={priority}
          className="product-card-img object-cover object-center group-hover:opacity-0 transition-opacity duration-500"
        />
        {/* Imagem de hover */}
        <Image
          src={hoverImage}
          alt={`${product.name} — vista alternativa`}
          fill
          sizes="(max-width: 768px) 280px, 320px"
          className="product-card-img object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Badge de tecnologia */}
{(() => {
            const meta = product.metadata as Record<string, unknown> | null;
            const tech = meta?.tech ? String(meta.tech) : null;
            return tech ? (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-obsidian/90 backdrop-blur-sm px-2.5 py-1.5">
                <Zap size={10} strokeWidth={2} className="text-gold" />
                <span className="font-sans text-[9px] font-semibold tracking-widest uppercase text-ivory">
                  {tech}
                </span>
              </div>
            ) : null;
          })()}

        {/* Quick add — aparece no hover via CSS */}
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
      <div className="pt-4 pb-1">
        <Link href={`/produtos/${product.id}`} className="block group/link">
          <h3 className="font-sans text-sm font-medium text-obsidian tracking-tight mb-1 group-hover/link:text-stone-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <p className="font-sans text-sm font-normal text-obsidian">
            {formatCurrency(product.price)}
          </p>
{(() => {
              const meta = product.metadata as Record<string, unknown> | null;
              const material = meta?.material ? String(meta.material) : null;
              return material ? (
                <p className="font-sans text-[10px] tracking-wider uppercase text-stone-400">
                  {material}
                </p>
              ) : null;
            })()}
        </div>
        {(() => {
          const meta = product.metadata as Record<string, unknown> | null;
          return meta?.free_shipping === true ? (
            <div className="flex items-center gap-1 mt-1">
              <Truck size={10} strokeWidth={1.8} className="text-emerald-600" />
              <span className="font-sans text-[10px] font-semibold tracking-wider uppercase text-emerald-600">
                Frete Grátis
              </span>
            </div>
          ) : null;
        })()}
      </div>
    </motion.article>
  );
}
