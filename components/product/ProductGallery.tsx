"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";

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

  return (
    <>
      <div className="flex gap-3 lg:gap-4">
        {/* ── Thumbnails (vertical, desktop) ── */}
        {safeImages.length > 1 && (
          <div className="hidden md:flex flex-col gap-2.5 w-16 shrink-0">
            {safeImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver imagem ${i + 1}`}
                className={[
                  "relative aspect-[3/4] w-full overflow-hidden transition-all duration-300",
                  i === activeIndex
                    ? "ring-1 ring-obsidian opacity-100"
                    : "opacity-40 hover:opacity-70",
                ].join(" ")}
              >
                <Image
                  src={src}
                  alt={`${productName} — miniatura ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover object-center"
                />
              </button>
            ))}
          </div>
        )}

        {/* ── Imagem principal ── */}
        <div className="flex-1">
          <div
            className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 cursor-zoom-in group"
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
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Zoom hint */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-ivory/80 backdrop-blur-sm px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn size={12} strokeWidth={1.5} className="text-stone-500" />
              <span className="font-sans text-[10px] text-stone-500 tracking-wider">Ampliar</span>
            </div>
          </div>

          {/* ── Dots mobile ── */}
          {safeImages.length > 1 && (
            <div className="flex md:hidden items-center justify-center gap-2 mt-4">
              {safeImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Imagem ${i + 1}`}
                  className={[
                    "transition-all duration-300",
                    i === activeIndex ? "w-5 h-1 bg-obsidian" : "w-1.5 h-1 bg-stone-300",
                  ].join(" ")}
                />
              ))}
            </div>
          )}
        </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
