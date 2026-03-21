import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <p className="label-category text-stone-400 mb-6">404</p>
      <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tighter text-obsidian mb-4">
        Página não encontrada.
      </h1>
      <div className="w-10 h-px bg-stone-300 my-6 mx-auto" />
      <p className="font-sans text-sm text-stone-500 leading-relaxed max-w-sm mb-10">
        A página que você está procurando não existe ou foi movida.
        Talvez valha a pena explorar nossa coleção.
      </p>
      <Link href="/" className="btn-outline inline-flex gap-2">
        <ArrowLeft size={14} strokeWidth={1.5} />
        Voltar ao início
      </Link>
    </div>
  );
}
