"use client";

import { useEffect, useRef, useCallback } from "react";
import type { RefObject } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Configuração dos frames
   ───────────────────────────────────────────────────────────── */
const TOTAL_FRAMES = 212;

// Pasta: /public/assets/manifesto-frames/
// Nomeação esperada: ezgif-frame-001.jpg … ezgif-frame-212.jpg
function frameSrc(n: number): string {
  return `/assets/manifesto-frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;
}

/* ─────────────────────────────────────────────────────────────
   Componente principal
   ───────────────────────────────────────────────────────────── */
export default function ManifestoScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const imagesRef    = useRef<(HTMLImageElement | null)[]>(
    Array(TOTAL_FRAMES).fill(null)
  );
  const currentFrameRef = useRef(0);
  const rafRef          = useRef<number | null>(null);

  /* ── Desenha um frame no canvas com cover-fit ── */
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[idx];
    if (!img?.complete || img.naturalWidth === 0) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    if (W === 0 || H === 0) return;

    // Redimensiona o canvas apenas quando necessário (evita limpar sem motivo)
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width  = W;
      canvas.height = H;
    }

    // Cálculo de cover-fit (equivalente ao object-fit: cover)
    const iR = img.naturalWidth  / img.naturalHeight;
    const cR = W / H;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (iR > cR) {
      // Imagem mais larga: corta as laterais
      sw = img.naturalHeight * cR;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      // Imagem mais alta: corta topo/base
      sh = img.naturalWidth / cR;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  }, []);

  /* ── Pré-carrega todos os frames progressivamente ── */
  useEffect(() => {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img   = new window.Image();
      const index = i;
      img.onload  = () => {
        imagesRef.current[index] = img;
        // Exibe o primeiro frame assim que ele carrega
        if (index === 0) drawFrame(0);
      };
      img.src = frameSrc(i + 1);
    }
  }, [drawFrame]);

  /* ── Mapeia scroll → índice do frame ── */
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

  /* ── Redesenha ao redimensionar a janela ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      // Invalida as dimensões para forçar redimensionamento no próximo draw
      canvas.width  = 0;
      canvas.height = 0;
      drawFrame(currentFrameRef.current);
    });

    ro.observe(canvas);
    return () => ro.disconnect();
  }, [drawFrame]);

  /* ────────────────────────────────────────────────────────── */
  return (
    /*
      Container alto: 400 vh → área rolável = 300 vh ≈ 3 240 px (a 1 080 px)
      → ~15 px por frame → suave ao scroll do mouse e no touch
    */
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>

      {/* Painel fixo enquanto o usuário rola dentro do container */}
      <div className="sticky top-0 h-screen overflow-hidden bg-obsidian">

        {/* Canvas — exibe os frames */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: "contents" }}
          aria-hidden
        />

        {/* Gradiente inferior para legibilidade do texto */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.22) 42%, transparent 68%)",
          }}
        />

        {/* ── Overlay de texto ── */}
        <div className="absolute bottom-0 left-0 right-0 pb-14 md:pb-20">
          <div className="raizes-container px-6 md:px-16 lg:px-24">
            <p className="label-category text-stone-500 mb-6">Manifesto</p>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.08] mb-6">
              Homens de Fé,
              <br />
              <em className="not-italic text-stone-400">Família</em>
              <br />
              e Propósito.
            </h2>

            <div className="w-8 h-px bg-white/20 mb-8" />

            <ul className="space-y-1 mb-8">
              {[
                "Homens que protegem a família.",
                "Homens que trabalham com propósito.",
                "Homens que permanecem firmes.",
              ].map((line) => (
                <li
                  key={line}
                  className="font-sans text-sm text-stone-400 leading-[1.7] flex items-center gap-3"
                >
                  <span className="w-1 h-1 flex-none bg-stone-600" />
                  {line}
                </li>
              ))}
            </ul>

            <p className="font-sans text-sm text-stone-400 leading-[1.7] mb-10">
              Vista aquilo que você acredita.{" "}
              <span className="text-white font-medium">Vista propósito.</span>
            </p>

            <Link
              href="/sobre"
              className="inline-flex items-center gap-3 font-sans text-xs font-medium tracking-widest uppercase text-white hover:text-stone-300 transition-colors duration-300 group"
            >
              Nossa história
              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Barra de progresso do scroll */}
        <ScrollProgressBar containerRef={containerRef} />

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Barra de progresso fina na base do painel
   ───────────────────────────────────────────────────────────── */
function ScrollProgressBar({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bar       = barRef.current;
    if (!container || !bar) return;

    const onScroll = () => {
      const rect       = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const scrolled   = Math.max(0, -rect.top);
      const progress   = Math.min(1, scrolled / scrollable);
      bar.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return (
    <div
      ref={barRef}
      className="absolute bottom-0 left-0 h-[1.5px] w-full bg-white/35 origin-left"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
