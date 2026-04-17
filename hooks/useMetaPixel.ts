"use client";

/**
 * hooks/useMetaPixel.ts
 * ─────────────────────────────────────────────────────────────────
 * Hook combinado para rastreamento de eventos Meta Pixel.
 *
 * Cada função:
 *  1. Dispara fbq() no browser (imediato, via pixel script)
 *  2. Faz POST /api/meta/capi (server-side CAPI, para bypass de ad blockers)
 *  Ambos compartilham o mesmo eventId → Meta deduplica automaticamente.
 * ─────────────────────────────────────────────────────────────────
 */

import { useCallback } from "react";
import type { CartItem } from "@/store/useCartStore";
import type { Product } from "@/types/database.types";

// ── Helper: gera event_id estável único ───────────────────────────

function generateEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para ambientes sem crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ── Helper: dispara CAPI via API Route ────────────────────────────

async function sendToCAPI(payload: {
  eventName: string;
  eventId: string;
  userData?: Record<string, string | undefined>;
  customData?: Record<string, unknown>;
}) {
  try {
    await fetch("/api/meta/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...payload,
        eventSourceUrl: window.location.href,
      }),
    });
  } catch {
    // CAPI é best-effort; não bloqueia o fluxo do usuário
  }
}

// ── Helper: lê cookies _fbp e _fbc ────────────────────────────────

function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const cookies = document.cookie.split(";").reduce<Record<string, string>>((acc, c) => {
    const [k, v] = c.split("=").map((s) => s.trim());
    if (k) acc[k] = v ?? "";
    return acc;
  }, {});
  return {
    fbp: cookies["_fbp"],
    fbc: cookies["_fbc"],
  };
}

// ── O hook ────────────────────────────────────────────────────────

export function useMetaPixel() {
  // ── ViewContent ─────────────────────────────────────────────────
  const trackViewContent = useCallback((product: Product) => {
    const eventId = generateEventId();
    const { fbp, fbc } = getMetaCookies();

    const params = {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      currency: "BRL",
      value: product.price,
    };

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", params, { eventID: eventId });
    }

    sendToCAPI({
      eventName: "ViewContent",
      eventId,
      userData: { fbp, fbc },
      customData: {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        currency: "BRL",
        value: product.price,
      },
    });
  }, []);

  // ── AddToCart ────────────────────────────────────────────────────
  const trackAddToCart = useCallback((product: Product, quantity = 1) => {
    const eventId = generateEventId();
    const { fbp, fbc } = getMetaCookies();

    const params = {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      currency: "BRL",
      value: product.price * quantity,
    };

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToCart", params, { eventID: eventId });
    }

    sendToCAPI({
      eventName: "AddToCart",
      eventId,
      userData: { fbp, fbc },
      customData: {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        currency: "BRL",
        value: product.price * quantity,
        contents: [{ id: product.id, quantity, item_price: product.price }],
        num_items: quantity,
      },
    });
  }, []);

  // ── InitiateCheckout ─────────────────────────────────────────────
  const trackInitiateCheckout = useCallback(
    (items: CartItem[], total: number, userEmail?: string) => {
      const eventId = generateEventId();
      const { fbp, fbc } = getMetaCookies();

      const contentIds = items.map((i) => i.product.id);
      const contents = items.map((i) => ({
        id: i.product.id,
        quantity: i.quantity,
        item_price: i.product.price,
      }));
      const numItems = items.reduce((s, i) => s + i.quantity, 0);

      const params = {
        content_ids: contentIds,
        contents,
        currency: "BRL",
        num_items: numItems,
        value: total,
      };

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "InitiateCheckout", params, { eventID: eventId });
      }

      sendToCAPI({
        eventName: "InitiateCheckout",
        eventId,
        userData: { em: userEmail, fbp, fbc },
        customData: {
          content_ids: contentIds,
          contents,
          currency: "BRL",
          num_items: numItems,
          value: total,
        },
      });
    },
    []
  );

  // ── AddPaymentInfo ───────────────────────────────────────────────
  const trackAddPaymentInfo = useCallback(
    (items: CartItem[], total: number, userEmail?: string) => {
      const eventId = generateEventId();
      const { fbp, fbc } = getMetaCookies();

      const contentIds = items.map((i) => i.product.id);
      const numItems = items.reduce((s, i) => s + i.quantity, 0);

      const params = {
        content_ids: contentIds,
        currency: "BRL",
        num_items: numItems,
        value: total,
      };

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "AddPaymentInfo", params, { eventID: eventId });
      }

      sendToCAPI({
        eventName: "AddPaymentInfo",
        eventId,
        userData: { em: userEmail, fbp, fbc },
        customData: {
          content_ids: contentIds,
          currency: "BRL",
          num_items: numItems,
          value: total,
        },
      });
    },
    []
  );

  // ── Purchase ─────────────────────────────────────────────────────
  /**
   * orderId é usado como eventId para garantir deduplicação perfeita
   * com o evento CAPI disparado pelo webhook do InfinitePay.
   */
  const trackPurchase = useCallback(
    (
      orderId: string,
      items: CartItem[],
      total: number,
      userData?: {
        email?: string;
        phone?: string;
        name?: string;
        city?: string;
        state?: string;
        zipCode?: string;
      }
    ) => {
      const eventId = orderId; // ← chave para deduplicação com CAPI webhook
      const { fbp, fbc } = getMetaCookies();

      const contentIds = items.map((i) => i.product.id);
      const contents = items.map((i) => ({
        id: i.product.id,
        quantity: i.quantity,
        item_price: i.product.price,
      }));
      const numItems = items.reduce((s, i) => s + i.quantity, 0);

      const params = {
        content_ids: contentIds,
        contents,
        currency: "BRL",
        num_items: numItems,
        value: total,
        order_id: orderId,
      };

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Purchase", params, { eventID: eventId });
      }

      sendToCAPI({
        eventName: "Purchase",
        eventId,
        userData: {
          em: userData?.email,
          ph: userData?.phone,
          fn: userData?.name,
          ct: userData?.city,
          st: userData?.state,
          zp: userData?.zipCode,
          fbp,
          fbc,
          country: "br",
        },
        customData: {
          content_ids: contentIds,
          contents,
          currency: "BRL",
          num_items: numItems,
          value: total,
          order_id: orderId,
        },
      });
    },
    []
  );

  return {
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackAddPaymentInfo,
    trackPurchase,
  };
}
