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
      {/* ── Background Image com Parallax ── */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 w-full h-[115%] -top-[7.5%]"
      >
        {banner?.image_desktop_url ? (
          <>
            <Image
              src={banner.image_desktop_url}
              alt="Capa Raízes"
              fill
              priority
              sizes="100vw"
              className={`object-cover object-center ${banner.image_mobile_url ? 'hidden md:block' : ''}`}
            />
            {banner.image_mobile_url && (
              <Image
                src={banner.image_mobile_url}
                alt="Capa Raízes Mobile"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center md:hidden"
              />
            )}
          </>
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1800&q=85&fit=crop"
            alt="Homem vestindo camiseta essencial Raízes em ambiente urbano"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        {/* Overlay gradiente duplo — escurece de baixo para cima para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-obsidian/30" />
        {/* Overlay lateral sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/30 via-transparent to-transparent" />
      </motion.div>

      {/* ── Conteúdo Principal ── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28"
      >
        <div className="raizes-container">
          <div className="max-w-3xl">

            {/* Badge de categoria */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="label-category text-linen/70 mb-6"
            >
              Coleção Essenciais · Verão 2026
            </motion.p>

            {/* Headline principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-serif !text-linen font-normal leading-[1.08] tracking-tighter mb-7"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              A Camiseta Essencial
              <br />
              <em className="not-italic !text-linen/65">para a Rotina</em>
              <br />
              do Cristão.
            </motion.h1>

            {/* Subtexto */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-sans text-linen/60 text-base md:text-lg font-light leading-[1.7] max-w-xl mb-12"
            >
              Funcional, atemporal e versátil. Feita para quem busca
              excelência em todas as ocasiões — do culto ao cotidiano.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link href="/colecoes/essenciais" className="btn-primary group">
                Explorar coleção
                <ArrowRight
                  size={15}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link href="/sobre" className="btn-outline border-linen/40 text-linen hover:bg-linen hover:text-obsidian">
                Nossa história
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
