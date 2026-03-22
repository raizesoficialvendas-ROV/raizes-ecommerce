"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="py-28 md:py-36 bg-white overflow-hidden">
      <div className="raizes-container">
        <div className="max-w-xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="label-category text-stone-400 mb-5">
              Comunidade
            </p>

            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian mb-5 leading-tight">
              Seja o primeiro a saber.
            </h2>

            <p className="font-sans text-sm text-stone-500 leading-[1.75] mb-10 max-w-sm mx-auto">
              Novos lançamentos, conteúdo sobre estilo e propósito, e acesso
              antecipado às coleções — direto no seu e-mail.
            </p>

            {/* Form — pill style */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="seu@email.com"
                required
                className="w-full flex-1 bg-[#F5F3F0] border border-stone-200 rounded-full px-6 py-4 font-sans text-sm text-obsidian placeholder:text-stone-400 focus:outline-none focus:border-obsidian transition-all duration-300 hover:border-stone-300"
              />
              <button
                type="submit"
                className="btn-primary shrink-0"
              >
                Inscrever
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </form>

            <p className="font-sans text-[11px] text-stone-400 mt-5 tracking-wide">
              Sem spam. Cancele quando quiser.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
