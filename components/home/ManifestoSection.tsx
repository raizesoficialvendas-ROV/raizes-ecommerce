"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ManifestoSection() {
  return (
    <section className="py-24 md:py-0 bg-ivory overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">

        {/* ── Coluna de Imagem ── */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative overflow-hidden min-h-[500px] md:min-h-0 order-2 md:order-1"
        >
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&fit=crop&crop=face"
            alt="Homem cristão moderno vestindo Raízes"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-stone-200/10" />
        </motion.div>

        {/* ── Coluna de Texto ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 md:py-24 order-1 md:order-2 bg-ivory"
        >
          <p className="label-category text-stone-400 mb-6">Manifesto</p>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal tracking-tighter text-obsidian leading-[1.1] mb-8">
            A excelência não é
            <br />
            <em className="not-italic text-stone-400">arrogância —</em>
            <br />
            é gratidão.
          </h2>

          <div className="space-y-4 mb-10">
            <p className="font-sans text-sm md:text-base text-stone-500 leading-relaxed">
              Cuidar da sua aparência não é vaidade. É uma forma de honrar o
              que foi dado a você. Raízes nasceu para vestir pessoas que
              levam a vida a sério — no trabalho, na família, na fé.
            </p>
            <p className="font-sans text-sm md:text-base text-stone-500 leading-relaxed">
              Cada costura é intencional. Cada cor, escolhida para durar.
              Porque acreditamos que quem tem raízes profundas não precisa
              de modismos passageiros.
            </p>
          </div>

          <div className="w-10 h-px bg-stone-300 mb-10" />

          <Link
            href="/sobre"
            className="inline-flex items-center gap-3 font-sans text-xs font-medium tracking-widest uppercase text-obsidian hover:text-stone-500 transition-colors group w-fit"
          >
            Nossa história
            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
