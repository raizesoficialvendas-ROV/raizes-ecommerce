"use client";


import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Banner } from "@/types/database.types";

export default function ManifestoSection({ banner }: { banner?: Banner | null }) {
  return (
    <section className="section-rhythm bg-white overflow-hidden">
      <div className="raizes-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Coluna de Imagem ── */}
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] overflow-hidden order-1 md:order-1"
          >
            {banner?.image_desktop_url ? (
              <>
                <Image
                  src={banner.image_desktop_url}
                  alt="Manifesto Raízes"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-cover ${banner.image_mobile_url ? 'hidden md:block' : ''}`}
                />
                {banner.image_mobile_url && (
                  <Image
                    src={banner.image_mobile_url}
                    alt="Manifesto Raízes Mobile"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover md:hidden"
                  />
                )}
              </>
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&fit=crop&crop=face"
                alt="Homem cristão moderno vestindo Raízes"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </motion.div>

          {/* ── Coluna de Texto ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col justify-center order-2 md:order-2"
          >
            <p className="label-category text-stone-400 mb-8">Manifesto</p>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal tracking-wide text-obsidian leading-[1.08] mb-10">
              Homens de Fé,
              <br />
              <em className="not-italic text-stone-400">Família</em>
              <br />
              e Propósito.
            </h2>

            <div className="space-y-4 mb-12">
              <p className="font-sans text-sm md:text-base text-stone-500 leading-[1.7]">
                RAÍZES nasceu para homens que vivem pela fé.
              </p>
              <ul className="space-y-2">
                {[
                  "Homens que protegem a família.",
                  "Homens que trabalham com propósito.",
                  "Homens que permanecem firmes.",
                ].map((line) => (
                  <li
                    key={line}
                    className="font-sans text-sm md:text-base text-stone-400 leading-[1.7] flex items-start gap-3"
                  >
                    <span className="mt-[0.55em] w-1 h-1 flex-none bg-stone-300" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="font-sans text-sm md:text-base text-stone-500 leading-[1.7] pt-2">
                Vista aquilo que você acredita.{" "}
                <span className="text-obsidian font-medium">Vista propósito.</span>
              </p>
            </div>

            <div className="w-10 h-px bg-stone-200 mb-12" />

            <div className="flex flex-col items-start gap-2.5">
              <span className="font-sans text-[10px] font-light tracking-[0.22em] uppercase text-stone-400 select-none">
                Role a página
              </span>
              <ChevronDown
                size={15}
                strokeWidth={1}
                className="text-stone-400 animate-bounce"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
