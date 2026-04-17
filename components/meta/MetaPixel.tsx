"use client";

/**
 * components/meta/MetaPixel.tsx
 * ─────────────────────────────────────────────────────────────────
 * Inicializa o Meta Pixel (browser-side) em todas as páginas.
 * Injeta o script fbq com next/script strategy="afterInteractive".
 *
 * Uso: adicionar <MetaPixel /> uma vez no RootLayout (body).
 * ─────────────────────────────────────────────────────────────────
 */

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID!;

// ── Tipos globais para o fbq ───────────────────────────────────────
declare global {
  interface Window {
    fbq: (
      action: string,
      eventName: string,
      params?: Record<string, unknown>,
      options?: Record<string, unknown>
    ) => void;
    _fbq?: unknown;
  }
}

// ── PageView automático em navegações SPA ─────────────────────────
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}

// ── Componente principal ───────────────────────────────────────────
export default function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <>
      {/* Script de inicialização do Meta Pixel */}
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
          `.trim(),
        }}
      />

      {/* Noscript fallback para rastreamento sem JS */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      {/* Tracker de navegação SPA (re-dispara PageView em cada rota) */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
