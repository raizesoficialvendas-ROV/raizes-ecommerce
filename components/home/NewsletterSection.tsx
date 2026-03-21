"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="py-24 md:py-32 bg-linen overflow-hidden">
      <div className="raizes-container">
        <div className="max-w-2xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="label-category text-stone-400 mb-5">
              Comunidade
            </p>

            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian mb-4 leading-tight">
              Seja o primeiro a saber.
            </h2>

            <p className="font-sans text-sm text-stone-500 leading-relaxed mb-10 max-w-sm mx-auto">
              Novos lançamentos, conteúdo sobre estilo e propósito, e acesso
              antecipado às coleções — direto no seu e-mail.
            </p>

            {/* Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="seu@email.com"
                required
                className="w-full flex-1 bg-white border border-stone-200 px-4 py-3.5 font-sans text-sm text-obsidian placeholder:text-stone-400 focus:outline-none focus:border-obsidian transition-colors"
              />
              <button
                type="submit"
                className="btn-primary shrink-0 w-full sm:w-auto"
              >
                Inscrever
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </form>

            <p className="font-sans text-[11px] text-stone-400 mt-4 tracking-wide">
              Sem spam. Cancele quando quiser.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
