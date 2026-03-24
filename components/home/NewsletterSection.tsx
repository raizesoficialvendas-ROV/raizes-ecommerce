"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="section-rhythm bg-stone-50 overflow-hidden">
      <div className="raizes-container">
        <div className="flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            <p className="label-category text-stone-400 mb-6">
              Comunidade
            </p>

            {/* Divisor decorativo */}
            <div className="w-8 h-px bg-stone-300 mb-10" />

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tighter text-obsidian mb-6 leading-[1.05] max-w-lg">
              Seja o primeiro<br />a saber.
            </h2>

            <p className="font-sans text-sm text-stone-500 leading-[1.8] mb-12 max-w-xs">
              Novos lançamentos, conteúdo sobre estilo e propósito, e acesso
              antecipado às coleções — direto no seu e-mail.
            </p>

            {/* Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col items-center gap-4 w-full max-w-sm"
            >
              <input
                type="email"
                placeholder="seu@email.com"
                required
                className="w-full bg-white border border-stone-200 px-6 py-4 font-sans text-sm text-obsidian placeholder:text-stone-400 focus:outline-none focus:border-obsidian transition-colors duration-300 text-center"
              />
              <button
                type="submit"
                className="btn-primary w-full justify-center"
              >
                Inscrever
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </form>

            <p className="font-sans text-[11px] text-stone-400 mt-6 tracking-wide">
              Sem spam. Cancele quando quiser.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
