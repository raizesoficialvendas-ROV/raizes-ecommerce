"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ManifestoSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* ── Coluna de Imagem ── */}
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-lg overflow-hidden order-1 md:order-1"
          >
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&fit=crop&crop=face"
              alt="Homem cristão moderno vestindo Raízes"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          {/* ── Coluna de Texto ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col justify-center order-2 md:order-2"
          >
            <span className="!font-sans text-xs sm:text-sm text-gray-500 uppercase tracking-widest font-semibold mb-4">
              Manifesto
            </span>

            <h2 className="!font-sans text-4xl lg:text-5xl !font-bold text-gray-900 leading-tight">
              A excelência não é arrogância — é gratidão.
            </h2>

            <div className="mt-6 space-y-4">
              <p className="!font-sans text-base lg:text-lg text-gray-600 leading-relaxed">
                Cuidar da sua aparência não é vaidade. É uma forma de honrar o que foi dado a você. Raízes nasceu para vestir pessoas que levam a vida a sério — no trabalho, na família, na fé.
              </p>
              <p className="!font-sans text-base lg:text-lg text-gray-600 leading-relaxed">
                Cada costura é intencional. Cada cor, escolhida para durar. Porque acreditamos que quem tem raízes profundas não precisa de modismos passageiros.
              </p>
            </div>

            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 mt-8 !font-sans text-sm font-bold uppercase text-black hover:text-gray-600 transition-colors group w-fit"
            >
              Nossa história
              <ArrowRight
                size={16}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
