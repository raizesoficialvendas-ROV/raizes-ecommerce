"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Conteúdo de texto — reutilizado em mobile e desktop
   ───────────────────────────────────────────────────────────── */
function TextContent() {
  return (
    <div className="flex flex-col justify-center">
      <p className="label-category text-stone-400 mb-8">Manifesto</p>

      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal tracking-wide text-obsidian leading-[1.08] mb-10">
        Homens de Fé,
        <br />
        <em className="not-italic text-stone-400">Família</em>
        <br />
        e Propósito.
      </h2>

      <div className="space-y-4 mb-12">
        <p className="font-sans text-sm md:text-base text-stone-500 leading-[1.7]">
          RAÍZES nasceu para homens que vivem pela fé.
        </p>
        <ul className="space-y-2">
          {[
            "Homens que protegem a família.",
            "Homens que trabalham com propósito.",
            "Homens que permanecem firmes.",
          ].map((line) => (
            <li
              key={line}
              className="font-sans text-sm md:text-base text-stone-400 leading-[1.7] flex items-start gap-3"
            >
              <span className="mt-[0.55em] w-1 h-1 flex-none bg-stone-300" />
              {line}
            </li>
          ))}
        </ul>
        <p className="font-sans text-sm md:text-base text-stone-500 leading-[1.7] pt-2">
          Vista aquilo que você acredita.{" "}
          <span className="text-obsidian font-medium">Vista propósito.</span>
        </p>
      </div>

      <div className="w-12 h-px bg-stone-200 mb-12" />

      <Link
        href="/sobre"
        className="inline-flex items-center gap-3 font-sans text-xs font-medium tracking-widest uppercase text-obsidian hover:text-stone-500 transition-colors duration-300 group w-fit"
      >
        Nossa história
        <ArrowRight
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Conteúdo de texto MOBILE — overlay na base do canvas
   Versão compacta, sem listas longas (cabe em ~35vh)
   ───────────────────────────────────────────────────────────── */
function MobileTextOverlay() {
  return (
    <div className="px-6 pb-10 pt-0">
      <p className="label-category text-stone-500 mb-4">Manifesto</p>

      <h2 className="font-serif text-3xl font-normal tracking-wide text-obsidian leading-[1.08] mb-5">
        Homens de Fé,{" "}
        <em className="not-italic text-stone-400">Família</em>
        {" "}e Propósito.
      </h2>

      <p className="font-sans text-sm text-stone-500 leading-[1.7] mb-5">
        RAÍZES nasceu para homens que vivem pela fé, protegem a família e
        permanecem firmes.
      </p>

      <Link
        href="/sobre"
        className="inline-flex items-center gap-3 font-sans text-xs font-medium tracking-widest uppercase text-obsidian group"
      >
        Nossa história
        <ArrowRight
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

/* -----------------------------------------------------------------
   Configuração dos frames
   Pasta: /public/assets/manifesto-frames/
   Nomeação: ezgif-frame-001.jpg a ezgif-frame-240.jpg
----------------------------------------------------------------- */
const TOTAL_FRAMES = 208;

function frameSrc(n: number): string {
  return `/assets/manifesto-frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;
}

/* ─────────────────────────────────────────────────────────────
   Componente principal
   ─── Mobile  : canvas ocupa 100% da tela durante o scroll;
                 texto aparece ABAIXO do container, após a animação
   ─── Desktop : layout 2 colunas original; canvas dentro do
                 quadrado aspect-[3/4 | 4/5]; texto à direita
   ───────────────────────────────────────────────────────────── */
export default function ManifestoScrollSection() {
  const containerRef     = useRef<HTMLDivElement>(null);
  const canvasMobileRef  = useRef<HTMLCanvasElement>(null);
  const canvasDesktopRef = useRef<HTMLCanvasElement>(null);
  const imagesRef        = useRef<(HTMLImageElement | null)[]>(
    Array(TOTAL_FRAMES).fill(null)
  );
  const currentFrameRef = useRef(0);
  const rafRef          = useRef<number | null>(null);

  /* ── Desenha um frame com contain-fit (frame completo, sem cortes) ── */
  const drawToCanvas = useCallback(
    (canvas: HTMLCanvasElement | null, img: HTMLImageElement) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      // canvas oculto (display:none) terá W/H = 0 → skip
      if (W === 0 || H === 0) return;

      // ── DPR: garante resolução nativa em telas retina/mobile ──
      const dpr = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;
      const rW  = Math.round(W * dpr);
      const rH  = Math.round(H * dpr);

      if (canvas.width !== rW || canvas.height !== rH) {
        canvas.width  = rW;
        canvas.height = rH;
      }

      // Limpa com fundo branco (cobre possível letterbox)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, rW, rH);

      // object-fit: contain — escala proporcional para caber inteiro
      const scale = Math.min(rW / img.naturalWidth, rH / img.naturalHeight);
      const dw    = img.naturalWidth  * scale;
      const dh    = img.naturalHeight * scale;
      const dx    = (rW - dw) / 2;
      const dy    = (rH - dh) / 2;

      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
    },
    []
  );

  /* ── Desenha o frame nos dois canvas (mobile + desktop) ── */
  const drawFrame = useCallback(
    (idx: number) => {
      const img = imagesRef.current[idx];
      if (!img?.complete || img.naturalWidth === 0) return;
      drawToCanvas(canvasMobileRef.current, img);
      drawToCanvas(canvasDesktopRef.current, img);
    },
    [drawToCanvas]
  );

  /* ── Pré-carrega progressivamente ── */
  useEffect(() => {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img   = new window.Image();
      const index = i;
      img.onload  = () => {
        imagesRef.current[index] = img;
        if (index === 0) drawFrame(0);
      };
      img.src = frameSrc(i + 1);
    }
  }, [drawFrame]);

  /* ── Scroll → índice do frame ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect       = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const scrolled   = Math.max(0, -rect.top);
      const progress   = Math.min(1, scrolled / scrollable);
      const idx        = Math.min(
        TOTAL_FRAMES - 1,
        Math.round(progress * (TOTAL_FRAMES - 1))
      );

      if (idx !== currentFrameRef.current) {
        currentFrameRef.current = idx;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(idx));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  /* ── Redesenha ao redimensionar qualquer canvas ── */
  useEffect(() => {
    const canvases = [
      canvasMobileRef.current,
      canvasDesktopRef.current,
    ].filter(Boolean) as HTMLCanvasElement[];

    if (canvases.length === 0) return;

    const ro = new ResizeObserver(() => {
      canvases.forEach((c) => {
        c.width  = 0;
        c.height = 0;
      });
      drawFrame(currentFrameRef.current);
    });

    canvases.forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [drawFrame]);

  /* ────────────────────────────────────────────────────────── */
  return (
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-white">

        {/* ── MOBILE: canvas + texto overlay ── */}
        <div className="md:hidden absolute inset-0 flex flex-col">

          {/* Canvas — ~62vh, imagem com contain-fit */}
          <div className="relative w-full flex-shrink-0" style={{ height: "62vh" }}>
            <canvas
              ref={canvasMobileRef}
              className="absolute inset-0 w-full h-full"
              style={{ willChange: "contents" }}
              aria-hidden
            />
          </div>

          {/* Gradiente de transição canvas → texto */}
          <div
            aria-hidden
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: "calc(62vh - 48px)",
              height: "64px",
              background: "linear-gradient(to bottom, transparent, #ffffff)",
            }}
          />

          {/* Texto — abaixo do canvas, sem overflow, sem scroll interno */}
          <div className="flex-1 bg-white overflow-hidden">
            <MobileTextOverlay />
          </div>

        </div>

        {/* ── DESKTOP: layout 2 colunas original ── */}
        <div className="hidden md:flex items-center h-full">
          <div className="w-full py-[clamp(5rem,8vw,9rem)]">
            <div className="raizes-container">
              <div className="grid grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* Coluna esquerda — canvas no quadrado */}
                <div className="relative w-full aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
                  <canvas
                    ref={canvasDesktopRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ willChange: "contents" }}
                    aria-hidden
                  />
                </div>

                {/* Coluna direita — texto completo */}
                <TextContent />

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}