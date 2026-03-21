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
    <section className="mt-20 md:mt-28 border-t border-stone-200 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

        {/* ── Tecnologia Funcional ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="label-category text-stone-400 mb-4">Tecnologia</p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-tighter text-obsidian mb-6 leading-tight">
            Funcional por{" "}
            <em className="not-italic text-stone-400">design.</em>
          </h2>
          <p className="font-sans text-sm text-stone-500 leading-relaxed mb-8">
            Cada fio foi escolhido com intenção. O tecido{" "}
            <strong className="font-medium text-stone-700">
              {meta?.tech ?? "premium"}
            </strong>{" "}
            regula a temperatura do corpo, bloqueia a radiação UV e mantém a
            forma mesmo após centenas de lavagens. Performance que não se
            anuncia — apenas funciona.
          </p>

          {/* Specs */}
          <div className="space-y-3">
            {meta?.material && (
              <div className="flex items-start gap-3">
                <div className="w-px h-4 bg-stone-300 mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-xs font-medium text-obsidian tracking-wide uppercase mb-0.5">Material</p>
                  <p className="font-sans text-sm text-stone-500">{meta.material}</p>
                </div>
              </div>
            )}
            {meta?.tech && (
              <div className="flex items-start gap-3">
                <div className="w-px h-4 bg-stone-300 mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-xs font-medium text-obsidian tracking-wide uppercase mb-0.5">Tecnologia</p>
                  <p className="font-sans text-sm text-stone-500">{meta.tech}</p>
                </div>
              </div>
            )}
            {specs.map(([key, value]) => (
              <div key={key} className="flex items-start gap-3">
                <div className="w-px h-4 bg-stone-300 mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-xs font-medium text-obsidian tracking-wide uppercase mb-0.5">{key}</p>
                  <p className="font-sans text-sm text-stone-500">{value}</p>
                </div>
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
        >
          <p className="label-category text-stone-400 mb-4">Propósito</p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-tighter text-obsidian mb-6 leading-tight">
            Veste quem tem{" "}
            <em className="not-italic text-stone-400">intenção.</em>
          </h2>
          <p className="font-sans text-sm text-stone-500 leading-relaxed mb-6">
            Esta peça não foi feita para impressionar — foi feita para
            acompanhar. O cristão moderno não precisa gritar para ser visto.
            Uma presença calibrada, um visual intencional, fala antes de
            qualquer palavra.
          </p>
          <p className="font-sans text-sm text-stone-500 leading-relaxed mb-8">
            Da manhã de devoção ao compromisso profissional, do encontro de
            célula ao café casual — {product.name} é a peça que não precisa
            ser trocada porque já está certa.
          </p>

          {/* Instruções de cuidado */}
          <div className="border-t border-stone-100 pt-6">
            <p className="font-sans text-xs font-medium tracking-widest uppercase text-stone-400 mb-4">
              Cuidados com a peça
            </p>
            <div className="flex items-center gap-6">
              {CARE_ICONS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon size={16} strokeWidth={1.25} className="text-stone-400" />
                  <span className="font-sans text-[10px] text-stone-400 leading-tight max-w-[60px]">
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
