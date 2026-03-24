"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeImages =
    images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=85&fit=crop"];

  function prev() {
    setActiveIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  }
  function next() {
    setActiveIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));
  }

  return (
    <>
      {/* ── Mobile: carousel ── */}
      <div className="md:hidden">
        <div
          className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100"
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image
                src={safeImages[activeIndex]}
                alt={`${productName} — imagem ${activeIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Imagem anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/30 backdrop-blur-md text-white border border-white/20 active:scale-95 transition-transform duration-150"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Próxima imagem"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/30 backdrop-blur-md text-white border border-white/20 active:scale-95 transition-transform duration-150"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
              <div className="absolute bottom-3 right-4">
                <span className="font-sans text-[11px] text-white tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                  {activeIndex + 1}/{safeImages.length}
                </span>
              </div>
            </>
          )}
        </div>

        {safeImages.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 mt-5">
            {safeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Imagem ${i + 1}`}
                className={[
                  "transition-all duration-300",
                  i === activeIndex ? "w-6 h-[3px] bg-obsidian" : "w-[10px] h-[3px] bg-stone-300",
                ].join(" ")}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop: 2-column image grid ── */}
      <div className="hidden md:grid grid-cols-2 gap-2">
        {safeImages.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[3/4] overflow-hidden bg-stone-100 cursor-zoom-in group"
            onClick={() => { setActiveIndex(i); setLightboxOpen(true); }}
          >
            <Image
              src={src}
              alt={`${productName} — imagem ${i + 1}`}
              fill
              priority={i < 2}
              sizes="(max-width: 1400px) 25vw, 350px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 bg-white/75 backdrop-blur-sm px-2 py-1">
              <ZoomIn size={11} strokeWidth={1.5} className="text-stone-600" />
              <span className="font-sans text-[10px] text-stone-600 tracking-wider">Ampliar</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-obsidian/95 flex items-center justify-center p-6 cursor-zoom-out"
          >
            {/* Fechar */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 flex items-center justify-center w-9 h-9 text-ivory/50 hover:text-ivory transition-colors duration-300"
            >
              <X size={20} strokeWidth={1.25} />
            </button>

            {/* Setas lightbox */}
            {safeImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 text-ivory/50 hover:text-ivory transition-colors duration-300"
                >
                  <ChevronLeft size={26} strokeWidth={1.25} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 text-ivory/50 hover:text-ivory transition-colors duration-300"
                >
                  <ChevronRight size={26} strokeWidth={1.25} />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative max-w-2xl w-full aspect-[3/4]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={safeImages[activeIndex]}
                alt={productName}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain"
              />
            </motion.div>

            {safeImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {safeImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                    className={[
                      "transition-all duration-300",
                      i === activeIndex ? "w-5 h-[2px] bg-ivory" : "w-2 h-[2px] bg-ivory/30",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
