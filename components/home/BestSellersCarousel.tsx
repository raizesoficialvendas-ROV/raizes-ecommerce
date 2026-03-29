"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, animate } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/database.types";
import type { ProductsReviewStats } from "@/lib/queries/reviews";

interface BestSellersCarouselProps {
  products: Product[];
  reviewStats?: ProductsReviewStats;
}

const CARD_WIDTH = 320;
const CARD_GAP = 24;
const STEP = CARD_WIDTH + CARD_GAP;

export default function BestSellersCarousel({ products, reviewStats }: BestSellersCarouselProps) {
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
    <section className="section-rhythm overflow-hidden bg-stone-50">
      <div className="raizes-container">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <p className="label-category text-stone-400 mb-3">
              Os mais pedidos
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tighter text-obsidian">
              Best Sellers
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {/* Setas de navegação */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => snapTo(currentIndex - 1)}
                disabled={currentIndex === 0}
                aria-label="Anterior"
                className="flex items-center justify-center w-10 h-10 border border-stone-200 text-stone-400 hover:border-obsidian hover:text-obsidian disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => snapTo(currentIndex + 1)}
                disabled={currentIndex >= maxIndex}
                aria-label="Próximo"
                className="flex items-center justify-center w-10 h-10 border border-stone-200 text-stone-400 hover:border-obsidian hover:text-obsidian disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>

            <Link
              href="/colecoes"
              className="underline-reveal font-sans text-xs font-medium tracking-widest uppercase text-stone-400 hover:text-obsidian transition-colors flex items-center gap-2"
            >
              Ver tudo
              <ArrowRight size={13} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
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

            // Snapping inteligente por velocidade ou offset
            if (velocity < -400 || offset < -(STEP / 3)) {
              snapTo(currentIndex + 1);
            } else if (velocity > 400 || offset > STEP / 3) {
              snapTo(currentIndex - 1);
            } else {
              snapTo(currentIndex);
            }
          }}
          className={[
            "flex gap-6 w-max",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              style={{ pointerEvents: isDragging ? "none" : "auto" }}
            >
              <ProductCard
                product={product}
                index={i}
                priority={i < 2}
                reviewAvg={reviewStats?.[product.id]?.avg}
                reviewCount={reviewStats?.[product.id]?.count}
              />
            </div>
          ))}

          {/* CTA final no carrossel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex-none w-[280px] md:w-[320px] flex flex-col items-start justify-end pb-1"
          >
            <div className="aspect-[3/4] w-full bg-stone-100 flex flex-col items-center justify-center gap-6 p-8">
              <div className="divider-luxury" />
              <p className="font-serif text-2xl text-obsidian text-center tracking-tight leading-tight">
                Descubra toda a coleção
              </p>
              <Link
                href="/colecoes"
                className="btn-outline text-xs mt-2"
                style={{ pointerEvents: isDragging ? "none" : "auto" }}
              >
                Ver tudo
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
              "transition-all duration-300",
              i === currentIndex
                ? "w-6 h-1 bg-obsidian"
                : "w-1.5 h-1 bg-stone-300",
            ].join(" ")}
          />
        ))}
      </div>

      {/* ── Link mobile ── */}
      <div className="flex md:hidden justify-center mt-10 raizes-container">
        <Link
          href="/colecoes"
          className="underline-reveal font-sans text-xs font-medium tracking-widest uppercase text-stone-500 flex items-center gap-2"
        >
          Ver toda coleção
          <ArrowRight size={13} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
