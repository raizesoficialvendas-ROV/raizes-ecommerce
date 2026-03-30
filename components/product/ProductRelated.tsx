"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/database.types";

/* ── Constantes de animação (padrão Apple) ───────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

interface ProductRelatedProps {
  related: Product[];
}

export default function ProductRelated({ related }: ProductRelatedProps) {
  if (!related.length) return null;

  return (
    <section className="section-rhythm bg-stone-50">
      <div className="raizes-container">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.75, ease: EASE }}
          className="flex items-end justify-between mb-14 md:mb-16"
        >
          <div>
            <p className="label-category text-stone-400 mb-4">Você também pode gostar</p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight">
              Relacionados
            </h2>
          </div>
          <a
            href="/colecoes"
            className="hidden md:inline-flex items-center gap-2 font-sans text-xs font-medium tracking-widest uppercase text-stone-400 hover:text-obsidian transition-colors duration-300"
          >
            Ver tudo
          </a>
        </motion.div>

        {/* ── Grid de produtos ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {related.map((rel, i) => {
            const img =
              rel.images_urls?.[0] ??
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&fit=crop";

            return (
              <motion.a
                key={rel.id}
                href={`/produtos/${rel.id}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.75, ease: EASE, delay: i * 0.1 }}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={rel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="font-sans text-sm text-obsidian group-hover:text-stone-500 transition-colors duration-300 leading-snug mb-1">
                  {rel.name}
                </p>
                <p className="font-sans text-sm text-stone-400">
                  {formatCurrency(rel.price)}
                </p>
              </motion.a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
