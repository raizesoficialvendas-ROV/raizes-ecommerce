import Link from "next/link";

const FOOTER_LINKS = {
  Loja: [
    { label: "Coleções", href: "/colecoes" },
    { label: "Lançamentos", href: "/#produtos" },
    { label: "Minhas Compras", href: "/conta/pedidos" },
  ],
  Empresa: [
    { label: "Sobre nós", href: "/sobre" },
    { label: "Contato", href: "/contato" },
  ],
  Ajuda: [
    { label: "FAQ", href: "/#faq" },
    { label: "Trocas e devoluções", href: "/trocas" },
    { label: "Rastreamento", href: "/rastreamento" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-obsidian text-ivory">

      {/* ── Frase de marca — full width ── */}
      <div className="border-t border-stone-800">
        <div className="raizes-container py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <Link href="/" className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tighter text-ivory leading-none hover:text-stone-300 transition-colors duration-500">
              Raízes
            </Link>
            <p className="font-sans text-xs text-stone-500 leading-[1.8] max-w-xs md:text-right">
              Vista aquilo que você acredita.<br />
              <span className="text-stone-600">Fé. Família. Propósito.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Divisor ── */}
      <div className="border-t border-stone-800/60" />

      {/* ── Grid de links ── */}
      <div className="raizes-container py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="label-category text-stone-600 mb-7">{category}</p>
              <ul className="space-y-4">
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
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-stone-800/60">
        <div className="raizes-container py-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

            <p className="font-sans text-[11px] text-stone-700 tracking-wide">
              © {new Date().getFullYear()} Raízes. Todos os direitos reservados.
            </p>

            {/* Legal */}
            <div className="flex items-center gap-6">
              <Link href="/privacidade" className="font-sans text-[11px] text-stone-700 hover:text-stone-400 transition-colors duration-300 tracking-wide">
                Privacidade
              </Link>
              <Link href="/termos" className="font-sans text-[11px] text-stone-700 hover:text-stone-400 transition-colors duration-300 tracking-wide">
                Termos de uso
              </Link>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}


export default function Footer() {
  return (
    <footer className="bg-obsidian text-ivory">

      {/* ── Frase de marca — full width ── */}
      <div className="border-t border-stone-800">
        <div className="raizes-container py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <Link href="/" className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tighter text-ivory leading-none hover:text-stone-300 transition-colors duration-500">
              Raízes
            </Link>
            <p className="font-sans text-xs text-stone-500 leading-[1.8] max-w-xs md:text-right">
              Vista aquilo que você acredita.<br />
              <span className="text-stone-600">Fé. Família. Propósito.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Divisor ── */}
      <div className="border-t border-stone-800/60" />

      {/* ── Grid de links ── */}
      <div className="raizes-container py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="label-category text-stone-600 mb-7">{category}</p>
              <ul className="space-y-4">
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
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-stone-800/60">
        <div className="raizes-container py-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

            {/* Social */}
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com/raizes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-stone-600 hover:text-ivory transition-colors duration-300"
              >
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a
                href="https://youtube.com/@raizes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-stone-600 hover:text-ivory transition-colors duration-300"
              >
                <Youtube size={16} strokeWidth={1.5} />
              </a>
              <span className="w-px h-3 bg-stone-800 mx-1" />
              <p className="font-sans text-[11px] text-stone-700 tracking-wide">
                © {new Date().getFullYear()} Raízes. Todos os direitos reservados.
              </p>
            </div>

            {/* Legal */}
            <div className="flex items-center gap-6">
              <Link href="/privacidade" className="font-sans text-[11px] text-stone-700 hover:text-stone-400 transition-colors duration-300 tracking-wide">
                Privacidade
              </Link>
              <Link href="/termos" className="font-sans text-[11px] text-stone-700 hover:text-stone-400 transition-colors duration-300 tracking-wide">
                Termos de uso
              </Link>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}
