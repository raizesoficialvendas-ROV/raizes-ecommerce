"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/types/database.types";

export default function HeroSection({ banner }: { banner?: Banner | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax suave na imagem de fundo
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  // Fade-out do conteúdo ao rolar
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-8%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[640px] overflow-hidden bg-obsidian"
    >
      {/* ── Background Video & Parallax Poster ── */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 w-full h-[115%] -top-[7.5%]"
      >
        {/* Placeholder image that loads instantly before the video */}
        <Image
          src="/assets/imagemframe.webp"
          alt="Homem vestindo camiseta essencial Raízes em ambiente urbano"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center bg-obsidian"
        />
        
        {/* Autoplaying background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/videofundo.mp4" type="video/mp4" />
        </video>

        {/* Overlay gradiente duplo — escurece de baixo para cima para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-obsidian/30" />
        {/* Overlay lateral sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/30 via-transparent to-transparent" />
      </motion.div>

      {/* ── Conteúdo Principal ── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24"
      >
        <div className="raizes-container">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">

            {/* Headline principal */
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-serif text-linen font-normal leading-[1.1] tracking-tight mb-5"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3.25rem)" }}
            >
              A Camiseta Essencial
              <br />
              <em className="not-italic text-linen/55">para a Rotina do Cristão.</em>
            </motion.h1>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link href="#produtos" className="btn-primary group">
                Explorar coleção
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </div>

          {/* Indicador de scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-10 right-8 hidden md:flex flex-col items-center gap-3"
          >
            <span className="label-category text-linen/30 rotate-90 origin-center">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-linen/40 to-transparent"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
