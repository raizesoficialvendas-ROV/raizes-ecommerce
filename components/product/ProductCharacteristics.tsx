"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── SVG Icons ──────────────────────────────────────────── */

function NaoDesbotaIcon() {
  return (
    <svg viewBox="0 0 1080 1080" fill="currentColor" aria-hidden="true" className="w-full h-full">
      <path d="M540,286.01H255.75v507.97h568.5v-507.97h-284.25ZM540,793.99c0-140.27-113.71-253.99-253.99-253.99,140.27,0,253.99-113.71,253.99-253.99,0,140.27,113.71,253.99,253.99,253.99-140.27,0-253.99,113.71-253.99,253.99Z" />
    </svg>
  );
}

function LeveMaciaIcon() {
  return (
    <svg viewBox="0 0 1080 1080" fill="currentColor" aria-hidden="true" className="w-full h-full">
      <path d="M682.29,316.57c-78.58,0-142.29-30.44-142.29-30.44v141.63s63.71,30.44,142.29,30.44,142.29-30.44,142.29-30.44v-141.63s-63.71,30.44-142.29,30.44Z" />
      <path d="M255.42,652.24v141.63s63.71-30.44,142.29-30.44,142.29,30.44,142.29,30.44v-141.63s-63.71-30.44-142.29-30.44-142.29,30.44-142.29,30.44Z" />
      <path d="M540,468.83v.72s-63.71-30.44-142.29-30.44-142.29,30.44-142.29,30.44v141.63s63.71-30.44,142.29-30.44,142.29,30.44,142.29,30.44v-.72s63.71,30.44,142.29,30.44,142.29-30.44,142.29-30.44v-141.63s-63.71,30.44-142.29,30.44-142.29-30.44-142.29-30.44Z" />
    </svg>
  );
}

function SustentavelIcon() {
  return (
    <svg viewBox="0 0 1080 1080" fill="currentColor" aria-hidden="true" className="w-full h-full">
      <path d="M791.48,542.66c-138.89,0-251.48,112.59-251.48,251.48,0-138.89-112.59-251.48-251.48-251.48h-32.77c0,138.89,112.59,251.48,251.48,251.48h65.54c138.89,0,251.48-112.59,251.48-251.48h0s-32.77,0-32.77,0Z" />
      <path d="M532.53,632.11v-218.52h18.03v215.43l64.53-64.53c56.21-56.21,56.21-147.34,0-203.55l-75.09-75.09-75.09,75.09c-56.21,56.21-56.21,147.34,0,203.55l67.62,67.62Z" />
    </svg>
  );
}

function AntiOdorIcon() {
  return (
    <svg viewBox="0 0 1080 1080" fill="currentColor" aria-hidden="true" className="w-full h-full">
      <path d="M835.99,780.66l-31.6-28.23c.05-.14.09-.28.14-.42l-128.79-115.07c.02.19.02.39.04.58l-46.58-41.62c-.05-.22-.1-.45-.14-.67l-185.6-165.85c0,.19.02.37.03.56l-39.14-34.98c.01-.17.02-.34.04-.51l-106.96-95.57h-.6l-29.13-26.03-23.68,26.5,31.59,28.23c-7.05,22.11-14.93,55.05-14.93,91.86,0,66.58,25.79,120.56,25.79,120.56h-.61s25.79,53.98,25.79,120.56-25.79,120.56-25.79,120.56h142.53s25.79-53.98,25.79-120.56-25.79-120.56-25.79-120.56h.61s-20.03-41.95-24.78-97.5l46.59,41.64c7.61,33.58,18.23,55.86,18.23,55.86h-.61s25.79,53.98,25.79,120.56-25.79,120.56-25.79,120.56h142.53s25.79-53.98,25.79-120.56c0-3.54-.09-7.02-.23-10.48l39.15,34.98c-4.97,54.83-24.66,96.06-24.66,96.06h132.17l29.13,26.03,23.68-26.5Z" />
      <path d="M428.99,298.88h-78.24l60.42,53.99c7.57-32.53,17.82-53.99,17.82-53.99Z" />
      <path d="M651.01,540s7.35,15.4,14.2,39.87l36.96,33.02,112.13,100.19c2.96-15.88,5.02-33.7,5.02-52.53,0-66.58-25.79-120.56-25.79-120.56h.61s-25.79-53.98-25.79-120.56,25.79-120.56,25.79-120.56h-142.53s-25.79,53.98-25.79,120.56,25.79,120.56,25.79,120.56h-.61Z" />
      <path d="M585.78,419.44c0-66.58,25.79-120.56,25.79-120.56h-142.53s-17.04,35.66-23.42,84.77l160.62,143.53c-7.55-19.83-20.46-60.61-20.46-107.74Z" />
    </svg>
  );
}

function DesamassaIcon() {
  return (
    <svg viewBox="0 0 1080 1080" fill="currentColor" aria-hidden="true" className="w-full h-full">
      <polygon points="551.84 272.77 740.04 460.96 531.44 460.96 730.26 638.62 835.99 638.62 835.99 556.91 835.99 460.96 835.99 272.77 551.84 272.77" />
      <path d="M833.75,778.74l-117.31-104.82-39.51-35.3h0l-198.82-177.65h0l-210.42-188.02-23.67,26.49,181.94,162.57c-89.08,9.56-158.46,84.96-158.46,176.58v.03h356.11l39.76,35.53h-395.88v106.59h515.17l29.65,26.49,23.67-26.49-2.23-2h0Z" />
    </svg>
  );
}

function RegulacaoTermicaIcon() {
  return (
    <svg viewBox="0 0 1080 1080" fill="currentColor" aria-hidden="true" className="w-full h-full">
      <path d="M833.06,500.52h-77.89l58.08-58.08-55.83-55.84-113.91,113.91h-23.64v-23.64l113.91-113.91-55.83-55.84-58.08,58.08v-77.88h-78.96v57.21c-13.13.24-25.94,1.76-38.32,4.47l-26.47-98.8-17.16,4.6,26.46,98.76c-10.71,3.4-21.01,7.71-30.83,12.82l-51.15-88.59-15.39,8.88,51.15,88.6c-9.4,6.03-18.28,12.8-26.49,20.3l-72.33-72.33-12.56,12.56,72.33,72.33c-7.5,8.21-14.27,17.09-20.3,26.5l-88.6-51.15-8.88,15.38,88.59,51.15c-5.1,9.82-9.42,20.12-12.82,30.83l-98.76-26.46-4.6,17.16,98.8,26.47c-2.35,10.73-3.83,21.79-4.34,33.1h-102.3v17.77h102.3c.51,11.31,1.99,22.36,4.34,33.1l-98.8,26.47,4.6,17.16,98.76-26.46c3.4,10.71,7.71,21.01,12.82,30.83l-88.59,51.14,8.88,15.38,88.6-51.15c6.03,9.4,12.8,18.28,20.3,26.5l-72.33,72.33,12.56,12.56,72.33-72.33c8.21,7.5,17.09,14.27,26.49,20.3l-51.15,88.6,15.39,8.88,51.15-88.59c9.82,5.1,20.12,9.42,30.83,12.82l-26.46,98.76,17.16,4.6,26.47-98.8c12.38,2.71,25.19,4.23,38.32,4.47v57.21h78.96v-77.89l58.08,58.08,55.83-55.84-113.91-113.91v-23.64h23.64l113.91,113.91,55.83-55.84-58.08-58.08h77.88v-78.96Z" />
    </svg>
  );
}

/* ─── Data ───────────────────────────────────────────────── */

const CHARACTERISTICS = [
  { label: "Não Desbota",       Icon: NaoDesbotaIcon      },
  { label: "Leve e Macia",      Icon: LeveMaciaIcon       },
  { label: "Sustentável",       Icon: SustentavelIcon     },
  { label: "Toque Macio",      Icon: AntiOdorIcon        },
  { label: "Desamassa\nno Corpo", Icon: DesamassaIcon     },
  { label: "Respirável\ne Leve",  Icon: RegulacaoTermicaIcon },
];

const ITEMS_PER_PAGE = 3;
const TOTAL_PAGES = Math.ceil(CHARACTERISTICS.length / ITEMS_PER_PAGE);

/* ─── Component ──────────────────────────────────────────── */

export default function ProductCharacteristics() {
  const [page, setPage] = useState(0);

  const visible = CHARACTERISTICS.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="py-7 border-t border-stone-100">
      {/* Título */}
      <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-stone-500 mb-6">
        Características do produto
      </p>

      {/* Carrossel */}
      <div className="flex items-center gap-1">

        {/* Seta esquerda */}
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          aria-label="Características anteriores"
          className="shrink-0 p-1 text-stone-400 hover:text-obsidian transition-colors duration-200 disabled:opacity-20 disabled:cursor-default"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>

        {/* Grid de 3 itens */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: page === 0 ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: page === 0 ? 12 : -12 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-3"
            >
              {visible.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 px-2 py-2"
                >
                  <div className="w-11 h-11 text-obsidian">
                    <Icon />
                  </div>
                  <span className="font-sans text-[11px] text-stone-500 text-center leading-[1.5] whitespace-pre-line">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Seta direita */}
        <button
          onClick={() => setPage((p) => Math.min(TOTAL_PAGES - 1, p + 1))}
          disabled={page === TOTAL_PAGES - 1}
          aria-label="Próximas características"
          className="shrink-0 p-1 text-stone-400 hover:text-obsidian transition-colors duration-200 disabled:opacity-20 disabled:cursor-default"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Dots de paginação */}
      {TOTAL_PAGES > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Página ${i + 1}`}
              className={[
                "w-1 h-1 rounded-full transition-all duration-200",
                i === page ? "bg-obsidian scale-125" : "bg-stone-300",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
