"use client";

import { motion } from "framer-motion";
import { Shield, Repeat, Droplets } from "lucide-react";
import type { Product } from "@/types/database.types";

interface ProductDetailsProps {
  product: Product;
}

const CARE_ICONS = [
  { icon: Droplets, label: "Lavar à mão ou ciclo delicado" },
  { icon: Shield, label: "Não usar alvejante" },
  { icon: Repeat, label: "Secar à sombra" },
];

export default function ProductDetails({ product }: ProductDetailsProps) {
  const meta = product.metadata as Record<string, string> | null;

  const specs = meta
    ? Object.entries(meta).filter(
        ([k, v]) =>
          !["tech", "material", "slug", "sizes"].includes(k) &&
          typeof v === "string" &&
          v.trim() !== ""
      )
    : [];

  return (
    <section className="mt-24 md:mt-32">

      {/* ── Divisor editorial ── */}
      <div className="flex items-center gap-6 mb-16 md:mb-20">
        <div className="flex-1 h-px bg-stone-100" />
        <p className="label-category text-stone-300">A peça</p>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-28">

        {/* ── Tecnologia Funcional ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col"
        >
          <p className="label-category text-stone-400 mb-8">Tecnologia</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian mb-8 leading-[1.2]">
            Funcional por{" "}
            <em className="not-italic text-stone-400">design.</em>
          </h2>
          <p className="font-sans text-sm text-stone-500 leading-[1.9] mb-10">
            Cada fio foi escolhido com intenção. O tecido{" "}
            <strong className="font-medium text-stone-700">
              {meta?.tech ?? "premium"}
            </strong>{" "}
            regula a temperatura do corpo, bloqueia a radiação UV e mantém a
            forma mesmo após centenas de lavagens. Performance que não se
            anuncia — apenas funciona.
          </p>

          {/* Specs — linhas de tabela */}
          <div className="mt-auto border-t border-stone-100">
            {meta?.material && (
              <div className="flex items-baseline justify-between py-4 border-b border-stone-100">
                <p className="font-sans text-[11px] font-medium text-stone-400 tracking-widest uppercase">Material</p>
                <p className="font-sans text-sm text-obsidian">{meta.material}</p>
              </div>
            )}
            {meta?.tech && (
              <div className="flex items-baseline justify-between py-4 border-b border-stone-100">
                <p className="font-sans text-[11px] font-medium text-stone-400 tracking-widest uppercase">Tecnologia</p>
                <p className="font-sans text-sm text-obsidian">{meta.tech}</p>
              </div>
            )}
            {specs.map(([key, value]) => (
              <div key={key} className="flex items-baseline justify-between py-4 border-b border-stone-100">
                <p className="font-sans text-[11px] font-medium text-stone-400 tracking-widest uppercase">{key}</p>
                <p className="font-sans text-sm text-obsidian">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Propósito da Peça ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col"
        >
          <p className="label-category text-stone-400 mb-8">Propósito</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian mb-8 leading-[1.2]">
            Veste quem tem{" "}
            <em className="not-italic text-stone-400">intenção.</em>
          </h2>
          <p className="font-sans text-sm text-stone-500 leading-[1.9] mb-6">
            Esta peça não foi feita para impressionar — foi feita para
            acompanhar. O cristão moderno não precisa gritar para ser visto.
            Uma presença calibrada, um visual intencional, fala antes de
            qualquer palavra.
          </p>
          <p className="font-sans text-sm text-stone-500 leading-[1.9] mb-12">
            Da manhã de devoção ao compromisso profissional, do encontro de
            célula ao café casual — {product.name} é a peça que não precisa
            ser trocada porque já está certa.
          </p>

          {/* Instruções de cuidado */}
          <div className="mt-auto border-t border-stone-100 pt-8">
            <p className="label-category text-stone-400 mb-7">
              Cuidados com a peça
            </p>
            <div className="grid grid-cols-3 gap-3">
              {CARE_ICONS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col gap-4 p-5 bg-stone-50">
                  <Icon size={18} strokeWidth={1.25} className="text-stone-400" />
                  <span className="font-sans text-[11px] text-stone-500 leading-[1.6]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
