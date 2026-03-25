import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre a Raízes" };

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="raizes-container py-16 md:py-28">

          {/* Header */}
          <div className="max-w-xl mb-20">
            <p className="label-category text-stone-400 mb-4">Nossa história</p>
            <h1 className="font-serif text-5xl md:text-6xl font-normal tracking-tighter text-obsidian leading-tight mb-8">
              Raízes nasceu de uma convicção.
            </h1>
            <div className="w-8 h-px bg-stone-300 mb-8" />
            <p className="font-sans text-base text-stone-500 leading-relaxed">
              Acreditamos que o cristão moderno merece peças que acompanhem
              a excelência da sua caminhada. Não modismos — fundamentos.
              Não vaidade — intenção.
            </p>
          </div>

          {/* Manifesto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-stone-200 pt-16">
            {[
              {
                num: "01",
                title: "A origem",
                body: "Fundada por criadores que unem fé, design e propósito. Cada coleção começa com uma pergunta: qual é a intenção desta peça na vida de quem a veste?",
              },
              {
                num: "02",
                title: "A missão",
                body: "Vestir pessoas que levam a vida a sério — no trabalho, na família, na fé. Peças que refletem caráter antes de refletir tendências.",
              },
              {
                num: "03",
                title: "O futuro",
                body: "Expandir o que significa excelência no vestuário cristão. Cada lançamento é um capítulo de uma história maior — construída com raízes profundas.",
              },
            ].map((item) => (
              <div key={item.num}>
                <p className="label-category text-stone-300 mb-4">{item.num}</p>
                <h2 className="font-serif text-2xl font-normal tracking-tight text-obsidian mb-4">
                  {item.title}
                </h2>
                <p className="font-sans text-sm text-stone-500 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
