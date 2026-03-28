"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Configuração dos frames
   Pasta: /public/assets/manifesto-frames/
   Nomeação: ezgif-frame-001.jpg … ezgif-frame-212.jpg
   ───────────────────────────────────────────────────────────── */
const TOTAL_FRAMES = 212;

function frameSrc(n: number): string {
  return `/assets/manifesto-frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;
}

/* ─────────────────────────────────────────────────────────────
   Componente principal
   Layout idêntico ao ManifestoSection original:
   - bg-white, section-rhythm, grid 2 colunas
   - Coluna esquerda: aspect-[4/5] com canvas dentro (cover-fit)
   - Coluna direita: texto original inalterado
   - Seção sticky enquanto os 212 frames são percorridos
   ───────────────────────────────────────────────────────────── */
export default function ManifestoScrollSection() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const imagesRef       = useRef<(HTMLImageElement | null)[]>(
    Array(TOTAL_FRAMES).fill(null)
  );
  const currentFrameRef = useRef(0);
  const rafRef          = useRef<number | null>(null);

  /* ── Desenha um frame no canvas com object-fit: cover ── */
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

    if (canvas.width !== W || canvas.height !== H) {
      canvas.width  = W;
      canvas.height = H;
    }

    const iR = img.naturalWidth / img.naturalHeight;
    const cR = W / H;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (iR > cR) {
      sw = img.naturalHeight * cR;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / cR;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  }, []);

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

  /* ── Redesenha ao redimensionar ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
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
      400 vh de altura total → 300 vh de área rolável
      → ~15 px de scroll por frame (suave no mouse e no touch)
    */
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>

      {/* Painel sticky — visualmente idêntico ao ManifestoSection original */}
      <div className="sticky top-0 h-screen bg-white overflow-hidden flex items-center">
        <div className="w-full py-[clamp(5rem,8vw,9rem)]">
          <div className="raizes-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">

              {/* ── Coluna esquerda: canvas no lugar da imagem ── */}
              <div className="relative w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] overflow-hidden order-1 md:order-1">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ willChange: "contents" }}
                  aria-hidden
                />
              </div>

              {/* ── Coluna direita: texto original inalterado ── */}
              <div className="flex flex-col justify-center order-2 md:order-2">
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

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
