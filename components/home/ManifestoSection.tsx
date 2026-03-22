"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ManifestoSection() {
  return (
    <section className="bg-white overflow-hidden">

      {/* ── Espaço superior generoso ── */}
      <div className="h-24 md:h-32 lg:h-40" />

      <div className="md:grid md:grid-cols-2 items-stretch">

        {/* ── Coluna de Imagem ── */}
        <div className="relative order-2 md:order-1 p-4 md:p-8 min-h-[480px] md:min-h-[600px]">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full h-full rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 4px 32px 0 rgba(10,10,10,0.12)" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&fit=crop&crop=face"
              alt="Homem cristão moderno vestindo Raízes"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-stone-900/5 rounded-2xl" />
          </motion.div>
        </div>

        {/* ── Coluna de Texto ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col justify-center order-1 md:order-2 bg-[#F9F9F7]
                     px-10 sm:px-14 md:px-16 lg:px-20 xl:px-24
                     py-16 md:py-24"
        >
          <p className="label-category text-stone-400 mb-7">Manifesto</p>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal tracking-tighter text-obsidian leading-[1.1] mb-10">
            A excelência não é
            <br />
            <em className="not-italic text-stone-400">arrogância —</em>
            <br />
            é gratidão.
          </h2>

          <div className="space-y-5 mb-12">
            <p className="font-sans text-sm md:text-[0.9375rem] text-stone-500 leading-[1.75]">
              Cuidar da sua aparência não é vaidade. É uma forma de honrar o
              que foi dado a você. Raízes nasceu para vestir pessoas que
              levam a vida a sério — no trabalho, na família, na fé.
            </p>
            <p className="font-sans text-sm md:text-[0.9375rem] text-stone-500 leading-[1.75]">
              Cada costura é intencional. Cada cor, escolhida para durar.
              Porque acreditamos que quem tem raízes profundas não precisa
              de modismos passageiros.
            </p>
          </div>

          <div className="w-10 h-px bg-stone-200 mb-12" />

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

      {/* ── Espaço inferior generoso ── */}
      <div className="h-24 md:h-32 lg:h-40" />

    </section>
  );
}
