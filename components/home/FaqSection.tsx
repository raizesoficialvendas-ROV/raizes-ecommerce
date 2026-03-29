"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Os tecidos da Raízes são realmente diferentes?",
    answer:
      "Trabalhamos com 100% algodão leve e respirável, com toque macio e modelagem clássica. Sem promessas exageradas sobre o tecido. O que faz a Raízes diferente é a intenção de cada peça: honesta, confortável e carregada de significado. Você compra pela mensagem e recebe uma camiseta que cumpre o que promete.",
  },
  {
    question: "O que significa 'Moda com Alma'?",
    answer:
      "Significa que cada peça da Raízes foi criada com intenção. Não seguimos tendências de temporada. Pensamos para quem quer que sua aparência reflita seus valores e seu caráter. Versículo, símbolo ou silêncio: cada detalhe comunica algo que vai além da roupa.",
  },
  {
    question: "As peças desbotam com o tempo?",
    answer:
      "Não. Cuidamos do processo de tingimento para que as cores se mantenham com o uso e as lavagens normais. Lavando corretamente, a durabilidade é muito boa. Qualquer problema antes do esperado e nós cuidamos da troca.",
  },
  {
    question: "Como devo lavar minhas peças Raízes?",
    answer:
      "Lave à máquina em ciclo delicado com água fria, de preferência pelo avesso. Evite amaciante, pois ele desgasta as fibras com o tempo. Seque à sombra, estendido, sem centrífuga. Simples assim.",
  },
  {
    question: "As camisetas amassam facilmente?",
    answer:
      "Não muito. O corte clássico e o algodão leve fazem com que as peças caiam bem no corpo com pouquíssimas marcas. Para o dia a dia de quem não tem tempo a perder, é exatamente o que você precisa.",
  },
  {
    question: "Posso usar as peças para atividades físicas e culto no mesmo dia?",
    answer:
      "Sim, e esse é exatamente o propósito. Nossas camisetas foram feitas para transitar entre os diferentes momentos do dia sem precisar trocar. O algodão respirável mantém o conforto, e o corte clássico garante uma aparência cuidada em qualquer ambiente.",
  },
  {
    question: "Qual o prazo de entrega?",
    answer:
      "Após a confirmação do pagamento, seu pedido é despachado em até 1 dia útil. O prazo de entrega varia conforme sua região: capitais entre 2 e 5 dias úteis, interior entre 5 e 10 dias úteis. Você recebe o código de rastreamento por e-mail assim que o pedido for postado.",
  },
  {
    question: "A Raízes aceita trocas e devoluções?",
    answer:
      "Sim. Você tem até 30 dias a partir do recebimento para solicitar troca por tamanho ou devolução por qualquer motivo. A peça deve estar sem uso, com etiqueta e na embalagem original. Basta entrar em contato via e-mail e cuidamos de tudo.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section id="faq" className="section-rhythm bg-ivory border-t border-stone-100">
      <div className="raizes-container max-w-3xl">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-14 md:mb-16 text-center"
        >
          <p className="label-category text-stone-400 mb-5">Dúvidas</p>
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tighter text-obsidian leading-tight">
            Perguntas Frequentes
          </h2>
        </motion.div>

        {/* ── Accordion ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col divide-y divide-stone-200"
        >
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <div key={i}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3 flex-1 min-w-0">
                    <HelpCircle
                      size={16}
                      strokeWidth={1.5}
                      className="shrink-0 text-stone-400 group-hover:text-obsidian transition-colors duration-250"
                    />
                    <span
                      className={[
                        "font-sans text-sm md:text-base leading-snug transition-colors duration-250",
                        isOpen
                          ? "font-semibold text-obsidian underline underline-offset-2"
                          : "font-medium text-obsidian group-hover:text-stone-600",
                      ].join(" ")}
                    >
                      {faq.question}
                    </span>
                  </span>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="shrink-0"
                  >
                    <ChevronDown
                      size={18}
                      strokeWidth={1.5}
                      className="text-stone-400 group-hover:text-obsidian transition-colors duration-250"
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-sm text-stone-500 leading-relaxed pb-6 pl-7">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
