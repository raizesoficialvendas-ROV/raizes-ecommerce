"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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

  const mainImage =
    product.images_urls && product.images_urls.length > 0
      ? product.images_urls[0]
      : `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&fit=crop`;

  const hoverImage =
    product.images_urls && product.images_urls.length > 1
      ? product.images_urls[1]
      : null;

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
      className="group flex-none w-[300px] md:w-[340px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Imagem com bordas arredondadas e shadow hover ── */}
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
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 300px, 340px"
          priority={priority}
          className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.05]${hoverImage ? ' group-hover:opacity-0' : ''}`}
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${product.name} — vista alternativa`}
            fill
            sizes="(max-width: 768px) 300px, 340px"
            className="object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-700 ease-out"
          />
        )}
      </Link>

      {/* ── Info: Nome e Preço ── */}
      <div className="pt-4 px-1">
        <Link href={`/produtos/${product.id}`} className="block group/link">
          <h3 className="font-sans text-sm font-medium text-obsidian tracking-wide leading-relaxed group-hover/link:text-stone-400 transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        <p className="font-sans text-sm text-stone-400 mt-1.5 font-light">
          {formatCurrency(product.price)}
        </p>
      </div>
    </motion.article>
  );
}
