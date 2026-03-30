"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Layers, Clock, Compass, ArrowRight } from "lucide-react";

const PILLARS = [
  {
    icon: Layers,
    label: "Funcionalidade",
    headline: "Tecido que trabalha por você.",
    body: "Algodão leve e respirável que abraça sem apertar. Macio na pele, fresco nos momentos mais longos e discreto o suficiente para não pedir atenção. Para quem carrega mais dentro do que no tecido, o conforto é apenas o começo.",
    detail: "100% Algodão · Gola Redonda",
  },
  {
    icon: Clock,
    label: "Atemporalidade",
    headline: "Compre uma vez. Use para sempre.",
    body: "Cores sóbrias, cortes clássicos e acabamento cuidadoso. Enquanto as tendências passam, Raízes permanece. Construída para durar tanto quanto os valores que carrega.",
    detail: "Design perene · Sem modismos",
  },
  {
    icon: Compass,
    label: "Propósito",
    headline: "Cada peça carrega uma intenção.",
    body: "Uma peça não é apenas o que você veste, é o que você declara. Cada detalhe foi pensado para quem quer que sua aparência fale antes mesmo das palavras. Identidade, fé e propósito visíveis sem precisar explicar.",
    detail: "Produção consciente · Impacto real",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function ValueProposition() {
  return (
    <section className="section-rhythm bg-obsidian overflow-hidden">
      <div className="raizes-container">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:mb-20 max-w-lg"
        >
          <p className="label-category text-stone-600 mb-5">
            Por que Raízes
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tighter text-ivory leading-tight">
            Três pilares.{" "}
            <em className="not-italic text-stone-500">
              Uma filosofia.
            </em>
          </h2>
        </motion.div>

        {/* ── Grid de pilares — com gap e cards arredondados ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-800/20"
        >
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.label}
                variants={itemVariants}
                className="bg-obsidian p-10 md:p-12 flex flex-col gap-8 border-b border-stone-800 md:border-b-0 last:border-b-0"
              >
                {/* Ícone + label */}
                <div className="flex items-center justify-between">
                  <Icon
                    size={22}
                    strokeWidth={1.25}
                    className="text-stone-500"
                  />
                  <span className="label-category text-stone-700">
                    {pillar.label}
                  </span>
                </div>

                {/* Divisor */}
                <div className="w-8 h-px bg-stone-800" />

                {/* Headline */}
                <h3 className="font-serif text-xl md:text-2xl font-normal text-ivory tracking-tighter leading-snug">
                  {pillar.headline}
                </h3>

                {/* Body */}
                <p className="font-sans text-sm text-stone-500 leading-[1.75] flex-1">
                  {pillar.body}
                </p>

                {/* Detail badge */}
                <p className="font-sans text-[10px] font-medium tracking-widest uppercase text-stone-700 pt-4 border-t border-stone-800/80">
                  {pillar.detail}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 md:mt-20 flex justify-center"
        >
          <Link
            href="/#produtos"
            className="group inline-flex items-center gap-4 px-10 py-4 border border-stone-700 hover:border-stone-400 text-stone-400 hover:text-ivory font-sans text-[10px] font-light tracking-[0.28em] uppercase transition-all duration-500"
          >
            Explorar Catálogo
            <ArrowRight
              size={12}
              strokeWidth={1}
              className="transition-transform duration-500 group-hover:translate-x-1.5"
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
