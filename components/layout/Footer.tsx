import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  Loja: [
    { label: "Coleções", href: "/colecoes" },
    { label: "Lançamentos", href: "/lancamentos" },
    { label: "Minhas Compras", href: "/conta/pedidos" },
    { label: "Sale", href: "/sale" },
  ],
  Empresa: [
    { label: "Sobre nós", href: "/sobre" },
    { label: "Manifesto", href: "/manifesto" },
    { label: "Imprensa", href: "/imprensa" },
    { label: "Contato", href: "/contato" },
  ],
  Ajuda: [
    { label: "FAQ", href: "/faq" },
    { label: "Trocas e devoluções", href: "/trocas" },
    { label: "Rastreamento", href: "/rastreamento" },
    { label: "Guia de tamanhos", href: "/tamanhos" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-obsidian text-ivory border-t border-stone-800">
      <div className="raizes-container py-20 md:py-28">

        {/* ── Grid principal ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-2xl tracking-tighter block mb-6">
              Raízes
            </Link>
            <p className="font-sans text-xs text-stone-500 leading-relaxed max-w-[180px]">
              Vestuário premium para o cristão moderno. Funcionalidade, propósito e atemporalidade.
            </p>
            {/* Social */}
            <div className="flex items-center gap-5 mt-7">
              <a
                href="https://instagram.com/raizes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-stone-600 hover:text-ivory transition-colors duration-300"
              >
                <Instagram size={17} strokeWidth={1.5} />
              </a>
              <a
                href="https://youtube.com/@raizes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-stone-600 hover:text-ivory transition-colors duration-300"
              >
                <Youtube size={17} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="label-category text-stone-600 mb-6">{category}</p>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-xs text-stone-500 hover:text-ivory transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-stone-800/60">
          <p className="font-sans text-[11px] text-stone-700 tracking-wide">
            © {new Date().getFullYear()} Raízes. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacidade" className="font-sans text-[11px] text-stone-700 hover:text-stone-400 transition-colors duration-300">
              Privacidade
            </Link>
            <Link href="/termos" className="font-sans text-[11px] text-stone-700 hover:text-stone-400 transition-colors duration-300">
              Termos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
