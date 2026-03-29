"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

/* ── Tipos ──────────────────────────────────────────────── */

export interface ShowcaseImage {
  desktop: string | null;
  mobile: string | null;
}

interface Slide {
  tag: string;
  headline: ReactNode;
  body: ReactNode;
  imageIndex: number;
  reverse: boolean;
}

/* ── Conteúdo editorial Raízes ───────────────────────────── */

const SLIDES: Slide[] = [
  {
    tag: "A COLEÇÃO",
    headline: (
      <>
        Feita para homens{"\n"}de{" "}
        <em className="not-italic font-serif italic">propósito.</em>
      </>
    ),
    body: (
      <p className="font-sans text-[15px] text-stone-500 leading-[1.9]">
        Um homem de fé não precisa gritar para ser visto. Cada peça Raízes
        foi concebida para quem vive com{" "}
        <strong className="text-obsidian font-semibold">intenção</strong>
        : do café da manhã à última oração do dia.
      </p>
    ),
    imageIndex: 0,
    reverse: false,
  },
  {
    tag: "O TECIDO",
    headline: (
      <>
        Conforto para{"\n"}quem tem{" "}
        <em className="not-italic font-serif italic">propósito.</em>
      </>
    ),
    body: (
      <p className="font-sans text-[15px] text-stone-500 leading-[1.9]">
        100% algodão, leve e respirável para cada momento do dia. Uma
        camiseta que simplesmente funciona, para que você possa focar no
        que realmente importa:{" "}
        <strong className="text-obsidian font-semibold">
          família, fé e propósito.
        </strong>
      </p>
    ),
    imageIndex: 1,
    reverse: true,
  },
  {
    tag: "IDENTIDADE",
    headline: (
      <>
        Vista o que{"\n"}você{" "}
        <em className="not-italic font-serif italic">acredita.</em>
      </>
    ),
    body: (
      <p className="font-sans text-[15px] text-stone-500 leading-[1.9]">
        Não é apenas uma camiseta. É uma declaração. Cada detalhe, cada
        símbolo carrega{" "}
        <strong className="text-obsidian font-semibold">
          Fé, Família e Propósito
        </strong>
        , comunicados sem precisar dizer uma palavra.
      </p>
    ),
    imageIndex: 2,
    reverse: false,
  },
  {
    tag: "INSTRUÇÕES DE CUIDADO",
    headline: (
      <>
        Cuide como{"\n"}se fosse{" "}
        <em className="not-italic font-serif italic">sagrado.</em>
      </>
    ),
    body: (
      <p className="font-sans text-[15px] text-stone-500 leading-[1.9]">
        Lavar em{" "}
        <strong className="text-obsidian font-semibold">
          ciclo delicado
        </strong>
        , temperatura máxima 30°C. Secar à sombra. Não usar alvejante.{" "}
        <strong className="text-obsidian font-semibold">
          A peça que cuida de você merece o mesmo respeito.
        </strong>
      </p>
    ),
    imageIndex: 3,
    reverse: true,
  },
];

/* ── Animação ────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Slide ───────────────────────────────────────────────── */

function ShowcaseSlide({
  slide,
  showcaseImages,
  fallbackImages,
}: {
  slide: Slide;
  showcaseImages: ShowcaseImage[];
  fallbackImages: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const showcase = showcaseImages[slide.imageIndex];
  const fallback = fallbackImages[slide.imageIndex % fallbackImages.length];
  const imgDesktop = showcase?.desktop || fallback;
  const imgMobile = showcase?.mobile || imgDesktop;

  const TextCol = (
    <div className="flex items-center justify-center w-full md:w-[45%] px-8 md:px-14 lg:px-20 py-16 md:py-0">
      <div className="max-w-[320px]">
        {/* Tag */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0 }}
          className="font-sans text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400 mb-5"
        >
          {slide.tag}
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
          className="font-serif text-[2rem] md:text-[2.4rem] font-normal tracking-tight text-obsidian leading-[1.2] whitespace-pre-line mb-8"
        >
          {slide.headline}
        </motion.h2>

        {/* Divisor */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.2 }}
          className="w-6 h-px bg-stone-300 mb-8"
        />

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.3 }}
        >
          {slide.body}
        </motion.div>
      </div>
    </div>
  );

  const ImageCol = (
    <div className="relative w-full md:w-[55%] min-h-[480px] md:min-h-0 overflow-hidden">
      {imgDesktop ? (
        <>
          {/* Desktop */}
          <Image
            src={imgDesktop}
            alt=""
            fill
            className="object-cover object-center hidden md:block"
            sizes="55vw"
          />
          {/* Mobile */}
          <Image
            src={imgMobile || imgDesktop}
            alt=""
            fill
            className="object-cover object-center md:hidden"
            sizes="100vw"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-stone-100" />
      )}
    </div>
  );

  return (
    <div
      ref={ref}
      className={[
        "flex flex-col md:min-h-screen border-t border-stone-100",
        slide.reverse ? "md:flex-row-reverse" : "md:flex-row",
      ].join(" ")}
    >
      {ImageCol}
      {TextCol}
    </div>
  );
}

/* ── Export ──────────────────────────────────────────────── */

export default function ProductShowcase({
  images,
  showcaseImages = [],
}: {
  images: string[];
  showcaseImages?: ShowcaseImage[];
}) {
  if (!images || images.length === 0) return null;

  return (
    <section aria-label="Apresentação do produto">
      {SLIDES.map((slide) => (
        <ShowcaseSlide
          key={slide.tag}
          slide={slide}
          showcaseImages={showcaseImages}
          fallbackImages={images}
        />
      ))}
    </section>
  );
}
