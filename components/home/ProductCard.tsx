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

  const meta = (product.metadata ?? {}) as Record<string, string>;
  const tech = meta.tech ?? "";
  const material = meta.material ?? "";

  // Divide "Dry-fit, Proteção UV 50+, Tech Insider" em badges individuais
  const techBadges = tech
    ? tech.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

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

        {/* ── Badges de Tecnologia — exibidos sobre a imagem ── */}
        {techBadges.length > 0 && (
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
            {techBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase"
                style={{
                  background: "rgba(10,10,10,0.55)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  color: "rgba(248,245,240,0.90)",
                  border: "1px solid rgba(248,245,240,0.12)",
                }}
              >
                ◆ {badge}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* ── Info: Nome, Material e Preço ── */}
      <div className="pt-4 px-1">
        <Link href={`/produtos/${product.id}`} className="block group/link">
          <h3 className="font-sans text-sm font-medium text-obsidian tracking-wide leading-relaxed group-hover/link:text-stone-400 transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1.5">
          <p className="font-sans text-sm text-stone-400 font-light">
            {formatCurrency(product.price)}
          </p>
          {material && (
            <p className="font-sans text-[10px] text-stone-400 tracking-widest uppercase font-medium">
              {material}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
