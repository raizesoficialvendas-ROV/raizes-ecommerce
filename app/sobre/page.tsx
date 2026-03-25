import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre a Raízes",
  description:
    "Conheça a história, a missão e os valores por trás da Raízes. Uma marca construída sobre fé, família e propósito.",
};

const VALORES = [
  {
    num: "01",
    titulo: "Fé acima de tudo.",
    corpo:
      "A Raízes não é uma marca religiosa. É uma marca de homens que vivem pela fé. Há diferença. Enquanto religiosos ostentam rótulos, homens de fé expressam convicção. Cada peça que criamos parte desta distinção: não decoração, intenção.",
  },
  {
    num: "02",
    titulo: "Família como alicerce.",
    corpo:
      "O homem que veste Raízes entende que sua identidade está antes de tudo na sua herança e no seu legado. Pai, filho, esposo, líder. Esses papéis não se desconectam da aparência. Eles a informam. Por isso construímos peças que acompanham quem cuida.",
  },
  {
    num: "03",
    titulo: "Propósito como bússola.",
    corpo:
      "Nada que fazemos aqui é por acidente. O corte de cada camiseta, a escolha de cada tecido, a paleta de cada coleção: tudo parte de uma pergunta que não nos cansa de fazer. Esta peça ajuda o homem que a veste a viver melhor o seu chamado? Se a resposta for não, voltamos ao começo.",
  },
];

const DIFERENCIAIS = [
  {
    label: "Tecnologia têxtil",
    titulo: "O tecido que não te decepciona.",
    corpo:
      "Nosso algodão passa por processo de Fiação Penteada de Alta Precisão, que remove fibras curtas e irregulares. O resultado é um fio mais liso, mais resistente e significativamente mais macio ao toque. Associado à tecnologia antimicrobiana integrada ao fio (não um tratamento superficial), o tecido inibe a proliferação bacteriana e controla o odor, lavagem após lavagem, ano após ano.",
  },
  {
    label: "Modelagem CAD",
    titulo: "Caimento que não é coincidência.",
    corpo:
      "Cada molde da Raízes é desenvolvido com Modelagem Digital CAD, o mesmo processo utilizado por marcas de luxo europeu. Isso garante que o caimento seja consistente em todos os tamanhos, do P ao GG, sem as distorções de escala que arruínam grande parte das camisetas do mercado. Você compra um M e recebe exatamente o que esperava.",
  },
  {
    label: "Cor que permanece",
    titulo: "Pigmentos que não desbotam.",
    corpo:
      "Utilizamos tintura a fio com pigmentos de alta solidez, fixados antes da tecelagem. Não é estamparia. Não é tingimento superficial. A cor é parte do fio, o que garante resistência ao desbotamento por no mínimo dois anos de uso e lavagem regulares. Nossa garantia não é marketing: é compromisso.",
  },
  {
    label: "Design atemporal",
    titulo: "Criado para não envelhecer.",
    corpo:
      "Não seguimos temporadas de moda. Não lançamos coleções sazonais que ficam obsoletas em seis meses. Cada peça da Raízes foi desenhada para ser igualmente relevante hoje, em três anos e em dez. Cores sóbrias, cortes clássicos, acabamento impecável. Isso é o oposto do descartável.",
  },
];

const NUMEROS = [
  { valor: "2 anos", descricao: "de garantia contra desbotamento" },
  { valor: "100%", descricao: "algodão penteado de alta precisão" },
  { valor: "30 dias", descricao: "para troca ou devolução sem burocracia" },
  { valor: "0", descricao: "compromisso com modismos ou tendências passageiras" },
];

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="bg-obsidian">
          <div className="raizes-container py-20 md:py-32">
            <div className="max-w-3xl">
              <p className="label-category text-stone-600 mb-6">Nossa história</p>
              <h1
                className="font-serif text-ivory font-normal tracking-tighter leading-[1.05] mb-8"
                style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
              >
                Raízes nasceu de uma{" "}
                <em className="not-italic text-stone-500">pergunta incômoda.</em>
              </h1>
              <div className="w-10 h-px bg-stone-700 mb-8" />
              <p className="font-sans text-stone-400 text-base md:text-lg leading-relaxed max-w-xl">
                Por que o cristão moderno precisa escolher entre aparência e convicção?
                Por que excelência de caráter raramente encontra excelência no vestuário?
                Foi essa tensão que deu origem à Raízes.
              </p>
            </div>
          </div>
        </section>

        {/* ── A origem ── */}
        <section className="bg-ivory border-b border-stone-100">
          <div className="raizes-container py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
              <div>
                <p className="label-category text-stone-400 mb-5">A origem</p>
                <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight mb-8">
                  Começou com insatisfação.
                  <br />
                  <em className="not-italic text-stone-400">Ficou por convicção.</em>
                </h2>
                <div className="space-y-5">
                  <p className="font-sans text-sm md:text-base text-stone-500 leading-relaxed">
                    Tudo começou com uma frustração legítima. Fundadores que viviam sua fé com
                    seriedade, que investiam em saúde, educação e família, mas que não encontravam
                    roupas à altura da vida que estavam construindo. O mercado evangélico oferecia
                    camisetas com versículos em fontes genéricas e tecidos que desbotavam na segunda
                    lavagem. O mercado de luxo ignorava completamente quem eles eram.
                  </p>
                  <p className="font-sans text-sm md:text-base text-stone-500 leading-relaxed">
                    A resposta não foi reclamar. Foi criar.
                  </p>
                  <p className="font-sans text-sm md:text-base text-stone-500 leading-relaxed">
                    A Raízes foi fundada com uma premissa simples: o cristão moderno merece o mesmo
                    nível de atenção ao detalhe que qualquer outra área da sua vida recebe. Se você
                    estuda sua Bíblia com profundidade, se você é presente na sua família, se você é
                    excelente no seu trabalho, então sua roupa também deveria ser excelente.
                    Não por vaidade. Por integridade.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <blockquote className="border-l-2 border-stone-300 pl-6">
                  <p className="font-serif text-xl md:text-2xl text-obsidian font-normal tracking-tight leading-snug italic">
                    &ldquo;A aparência não define o caráter. Mas o caráter define a aparência.&rdquo;
                  </p>
                  <cite className="font-sans text-xs text-stone-400 tracking-widest uppercase not-italic mt-4 block">
                    Fundadores da Raízes
                  </cite>
                </blockquote>
                <div className="bg-stone-50 border border-stone-200 p-8">
                  <p className="label-category text-stone-400 mb-4">O nome</p>
                  <p className="font-sans text-sm text-stone-500 leading-relaxed">
                    Raízes não é uma metáfora decorativa. É uma declaração de identidade.
                    Homens com raízes não são movidos pelo que está na superfície.
                    Eles conhecem de onde vieram, sabem para onde vão e não trocam seus fundamentos
                    por nenhuma tendência passageira. O nome define o cliente antes de definir a marca.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Números ── */}
        <section className="bg-obsidian">
          <div className="raizes-container py-14 md:py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-800/30">
              {NUMEROS.map((item, i) => (
                <div key={i} className="bg-obsidian px-8 py-10 flex flex-col gap-3">
                  <p className="font-serif text-3xl md:text-4xl font-normal text-ivory tracking-tighter">
                    {item.valor}
                  </p>
                  <p className="font-sans text-xs text-stone-600 leading-relaxed uppercase tracking-wider">
                    {item.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Missão ── */}
        <section className="bg-stone-50 border-b border-stone-100">
          <div className="raizes-container py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <p className="label-category text-stone-400 mb-5">Nossa missão</p>
              <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tighter text-obsidian leading-[1.1] mb-8">
                Vestir homens que levam a vida a sério.
              </h2>
              <div className="w-10 h-px bg-stone-300 mx-auto mb-8" />
              <p className="font-sans text-base text-stone-500 leading-relaxed mb-6">
                Não somos uma marca de roupas com mensagens cristãs. Somos uma marca cristã que
                faz roupas excepcionais. A diferença importa.
              </p>
              <p className="font-sans text-base text-stone-500 leading-relaxed">
                Nossa missão é provar que fé e excelência não são opostos. Que o homem que serve
                a Deus com integridade merece se vestir com a mesma seriedade com que conduz
                todas as outras áreas da sua vida. Cada peça que fazemos é um argumento visual
                para essa tese.
              </p>
            </div>
          </div>
        </section>

        {/* ── Valores ── */}
        <section className="bg-ivory">
          <div className="raizes-container py-16 md:py-24">
            <div className="mb-12 md:mb-16">
              <p className="label-category text-stone-400 mb-5">O que nos move</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight">
                Três valores.<br />
                <em className="not-italic text-stone-400">Uma filosofia inteira.</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {VALORES.map((v) => (
                <div key={v.num} className="border-t-2 border-stone-200 pt-8">
                  <p className="label-category text-stone-300 mb-5">{v.num}</p>
                  <h3 className="font-serif text-xl md:text-2xl font-normal tracking-tight text-obsidian mb-5 leading-snug">
                    {v.titulo}
                  </h3>
                  <p className="font-sans text-sm text-stone-500 leading-relaxed">
                    {v.corpo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── O produto ── */}
        <section className="bg-stone-50 border-t border-stone-100">
          <div className="raizes-container py-16 md:py-24">
            <div className="mb-12 md:mb-16">
              <p className="label-category text-stone-400 mb-5">O produto</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight max-w-lg">
                Excelência que você sente antes de ver.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIFERENCIAIS.map((d, i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-200 p-8 flex flex-col gap-5"
                >
                  <p className="label-category text-stone-400">{d.label}</p>
                  <h3 className="font-serif text-xl font-normal tracking-tight text-obsidian leading-snug">
                    {d.titulo}
                  </h3>
                  <div className="w-6 h-px bg-stone-200" />
                  <p className="font-sans text-sm text-stone-500 leading-relaxed flex-1">
                    {d.corpo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Para quem é ── */}
        <section className="bg-obsidian">
          <div className="raizes-container py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="label-category text-stone-600 mb-5">Para quem é</p>
                <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-ivory leading-tight mb-8">
                  Raízes não é para todo mundo.
                  <br />
                  <em className="not-italic text-stone-500">É para você.</em>
                </h2>
                <p className="font-sans text-stone-400 text-sm leading-relaxed mb-6">
                  Se você leu até aqui, já entende o que somos. Mas queremos ser
                  ainda mais diretos. A Raízes foi feita para o homem que:
                </p>
                <ul className="space-y-4">
                  {[
                    "Leva a fé a sério, mas recusa o estereótipo religioso.",
                    "Cuida da família como prioridade, não como obrigação.",
                    "Trabalha com propósito e entende que aparência é uma forma de respeito.",
                    "Prefere comprar uma peça excelente a dez peças medianas.",
                    "Sabe que o que você veste comunica quem você é, antes mesmo de falar.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="mt-2 w-1.5 h-1.5 bg-stone-600 shrink-0" />
                      <p className="font-sans text-sm text-stone-400 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-stone-900 border border-stone-800 p-10 md:p-12">
                <p className="label-category text-stone-600 mb-6">Nossa promessa</p>
                <p className="font-serif text-2xl md:text-3xl text-ivory font-normal tracking-tighter leading-snug mb-8">
                  Cada peça que fazemos precisa passar por um teste simples.
                </p>
                <p className="font-sans text-stone-400 text-sm leading-relaxed mb-6">
                  Perguntamos: este produto é digno do homem que vai usá-lo? Não apenas
                  visualmente. Na qualidade do tecido, na precisão do corte, na durabilidade
                  ao longo do tempo, na intenção por trás de cada detalhe.
                </p>
                <p className="font-sans text-stone-400 text-sm leading-relaxed">
                  Se a resposta for não, o produto não existe. Simples assim.
                  Não temos pressa para lançar. Temos compromisso com o que lançamos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Manifesto final ── */}
        <section className="bg-ivory border-t border-stone-100">
          <div className="raizes-container py-16 md:py-24">
            <div className="max-w-2xl mx-auto text-center">
              <p className="label-category text-stone-400 mb-6">Manifesto</p>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight mb-10">
                Vista aquilo que você acredita.
              </h2>
              <div className="space-y-5 text-left bg-stone-50 border border-stone-200 p-8 md:p-12 mb-12">
                {[
                  "Acreditamos que o caráter se expressa em tudo, inclusive no que você veste.",
                  "Acreditamos que o cristão moderno não precisa escolher entre fé e excelência.",
                  "Acreditamos que comprar menos e melhor é uma decisão de sabedoria.",
                  "Acreditamos que uma roupa bem feita é uma forma de honrar o chamado que você carrega.",
                  "Acreditamos que Raízes profundas produzem muito fruto.",
                ].map((crença, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="font-sans text-[10px] font-semibold tracking-widest text-stone-300 mt-1 shrink-0 w-5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-sans text-sm md:text-base text-stone-600 leading-relaxed">
                      {crença}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/colecoes"
                className="inline-flex items-center gap-3 bg-obsidian text-ivory font-sans text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-stone-800 transition-colors duration-300 group"
              >
                Explorar as coleções
                <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
