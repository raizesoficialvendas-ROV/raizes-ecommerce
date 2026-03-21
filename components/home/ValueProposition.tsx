"use client";

import { motion } from "framer-motion";
import { Layers, Clock, Compass } from "lucide-react";

const PILLARS = [
  {
    icon: Layers,
    label: "Funcionalidade",
    headline: "Tecido que trabalha por você.",
    body: "Tecnologia Dry Fit com proteção UV50+ e regulação térmica. Peças feitas para acompanhar a intensidade da sua rotina — sem perder a elegância de quem tem um chamado.",
    detail: "Dry Fit · UV50+ · Thermoregulation",
  },
  {
    icon: Clock,
    label: "Atemporalidade",
    headline: "Compre uma vez. Use para sempre.",
    body: "Cores sóbrias, cortes clássicos e acabamento impecável. Enquanto a moda passa, Raízes permanece — porque foi construída para durar tanto quanto os valores que representa.",
    detail: "Design perene · Sem modismos",
  },
  {
    icon: Compass,
    label: "Propósito",
    headline: "Cada peça carrega uma intenção.",
    body: "Produção responsável, materiais selecionados e uma missão clara: vestir quem busca excelência em todas as áreas da vida. Aparência que reflete caráter.",
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
    <section className="py-24 md:py-36 bg-obsidian overflow-hidden">
      <div className="raizes-container">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-20 md:mb-24 max-w-lg"
        >
          <p className="label-category text-stone-600 mb-4">
            Por que Raízes
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tighter text-ivory leading-tight">
            Três pilares.{" "}
            <em className="not-italic text-stone-500">
              Uma filosofia.
            </em>
          </h2>
        </motion.div>

        {/* ── Grid de pilares ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-px bg-transparent md:bg-stone-800/30"
        >
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.label}
                variants={itemVariants}
                className="bg-obsidian p-8 md:p-10 flex flex-col gap-6 border-b border-stone-800 md:border-b-0 last:border-b-0"
              >
                {/* Ícone */}
                <div className="flex items-center justify-between">
                  <Icon
                    size={22}
                    strokeWidth={1.25}
                    className="text-stone-400"
                  />
                  <span className="label-category text-stone-700">
                    {pillar.label}
                  </span>
                </div>

                {/* Divisor */}
                <div className="w-8 h-px bg-stone-700" />

                {/* Headline */}
                <h3 className="font-serif text-xl md:text-2xl font-normal text-ivory tracking-tight leading-snug">
                  {pillar.headline}
                </h3>

                {/* Body */}
                <p className="font-sans text-sm text-stone-500 leading-relaxed flex-1">
                  {pillar.body}
                </p>

                {/* Detail badge */}
                <p className="font-sans text-[10px] font-medium tracking-widest uppercase text-stone-600 pt-2 border-t border-stone-800">
                  {pillar.detail}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
