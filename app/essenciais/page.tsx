import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Essenciais" };

export default function EssenciaisPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="raizes-container py-16 md:py-24 max-w-2xl">
          <p className="label-category text-stone-400 mb-4">Linha</p>
          <h1 className="font-serif text-5xl md:text-6xl font-normal tracking-tighter text-obsidian mb-8">
            Essenciais
          </h1>
          <div className="w-8 h-px bg-stone-300 mb-8" />
          <p className="font-sans text-base text-stone-500 leading-relaxed">
            Os Essenciais Raízes foram criados para quem não abre mão de
            qualidade no dia a dia. Peças versáteis, atemporais e feitas com
            tecidos de alta performance — do culto ao cotidiano.
          </p>
          <p className="font-sans text-sm text-stone-400 mt-8">
            Em breve: coleção completa disponível aqui.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
