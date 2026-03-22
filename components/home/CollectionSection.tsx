"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, animate } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product, Category } from "@/types/database.types";

interface CollectionSectionProps {
  collection: Category;
  products: Product[];
  sectionIndex?: number;
}

const CARD_WIDTH = 340;
const CARD_GAP = 28;
const STEP = CARD_WIDTH + CARD_GAP;

export default function CollectionSection({
  collection,
  products,
  sectionIndex = 0,
}: CollectionSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const calc = () =>
      setVisibleCards(Math.floor((window.innerWidth - 64) / STEP));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  /* ── Estado vazio — coleção sem produtos publicados ── */
  if (products.length === 0) {
    return (
      <section className="py-24 md:py-32 overflow-hidden bg-[#FAFAF8]">
        <div className="raizes-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="label-category text-stone-400 mb-4">
                {collection.description ?? "Coleção"}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tighter text-obsidian">
                {collection.name}
              </h2>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="rounded-2xl border border-stone-100 bg-white p-12 md:p-20 flex flex-col items-center justify-center text-center gap-6"
            style={{ boxShadow: "0 2px 16px 0 rgba(10,10,10,0.05)" }}
          >
            <div className="divider-luxury" />
            <p className="font-serif text-2xl md:text-3xl font-normal tracking-wide text-obsidian">
              Em breve
            </p>
            <p className="font-sans text-sm text-stone-400 max-w-xs leading-[1.7]">
              Esta coleção está sendo preparada com propósito.
              Volte em breve para conferir as novidades.
            </p>
            <Link
              href={`/colecoes/${collection.slug}`}
              className="btn-outline text-xs mt-4"
            >
              Saiba mais
              <ArrowRight size={13} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  const totalCards = products.length;
  const maxIndex = Math.max(0, totalCards - Math.max(visibleCards, 1));

  function snapTo(index: number) {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clamped);
    animate(x, -(clamped * STEP), {
      type: "spring",
      stiffness: 200,
      damping: 30,
    });
  }

  return (
    <section className="py-24 md:py-32 overflow-hidden bg-[#FAFAF8]">
      <div className="raizes-container">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <p className="label-category text-stone-400 mb-4">
              {collection.description ?? "Coleção"}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tighter text-obsidian">
              {collection.name}
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {/* Setas de navegação */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => snapTo(currentIndex - 1)}
                disabled={currentIndex === 0}
                aria-label="Anterior"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 text-stone-400 hover:border-obsidian hover:text-obsidian disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => snapTo(currentIndex + 1)}
                disabled={currentIndex >= maxIndex}
                aria-label="Próximo"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 text-stone-400 hover:border-obsidian hover:text-obsidian disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>

            <Link
              href={`/colecoes/${collection.slug}`}
              className="underline-reveal font-sans text-xs font-medium tracking-widest uppercase text-stone-400 hover:text-obsidian transition-colors flex items-center gap-2"
            >
              Ver tudo
              <ArrowRight size={13} strokeWidth={1.5} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Track arrastável ── */}
      <div className="pl-8 md:pl-[max(2rem,calc((100vw-1400px)/2+2rem))]">
        <motion.div
          ref={trackRef}
          style={{ x }}
          drag="x"
          dragConstraints={{
            left: -(maxIndex * STEP),
            right: 0,
          }}
          dragElastic={0.08}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 40 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            const velocity = info.velocity.x;
            const offset = info.offset.x;

            if (velocity < -400 || offset < -(STEP / 3)) {
              snapTo(currentIndex + 1);
            } else if (velocity > 400 || offset > STEP / 3) {
              snapTo(currentIndex - 1);
            } else {
              snapTo(currentIndex);
            }
          }}
          className={[
            "flex gap-7 w-max pb-2",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              style={{ pointerEvents: isDragging ? "none" : "auto" }}
            >
              <ProductCard product={product} index={i} priority={i < 2} />
            </div>
          ))}

          {/* CTA final no carrossel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex-none w-[300px] md:w-[340px] flex flex-col items-start justify-end pb-1"
          >
            <div 
              className="aspect-[3/4] w-full bg-white rounded-2xl flex flex-col items-center justify-center gap-8 p-10"
              style={{ boxShadow: "0 1px 8px 0 rgba(10,10,10,0.07)" }}
            >
              <div className="divider-luxury" />
              <p className="font-serif text-2xl text-obsidian text-center tracking-wide leading-tight">
                Ver toda a coleção
              </p>
              <Link
                href={`/colecoes/${collection.slug}`}
                className="btn-outline text-xs mt-2"
                style={{ pointerEvents: isDragging ? "none" : "auto" }}
              >
                Explorar
                <ArrowRight size={13} strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Dots de progresso (mobile) ── */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-8 raizes-container">
        {Array.from({ length: Math.min(totalCards, 6) }).map((_, i) => (
          <button
            key={i}
            onClick={() => snapTo(i)}
            aria-label={`Ir para produto ${i + 1}`}
            className={[
              "transition-all duration-300 rounded-full",
              i === currentIndex
                ? "w-6 h-1.5 bg-obsidian"
                : "w-1.5 h-1.5 bg-stone-300",
            ].join(" ")}
          />
        ))}
      </div>

      {/* ── Link mobile ── */}
      <div className="flex md:hidden justify-center mt-8 raizes-container">
        <Link
          href={`/colecoes/${collection.slug}`}
          className="underline-reveal font-sans text-xs font-medium tracking-widest uppercase text-stone-500 flex items-center gap-2"
        >
          Ver toda a coleção
          <ArrowRight size={13} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
