/**
 * lib/meta/capi.ts
 * ─────────────────────────────────────────────────────────────────
 * Helpers SERVER-SIDE para a Meta Conversions API (CAPI).
 *
 * ⚠️  Este arquivo NUNCA deve ser importado por componentes client-side
 *     (`"use client"`). O Access Token fica exclusivamente aqui.
 * ─────────────────────────────────────────────────────────────────
 */

import crypto from "crypto";

// ── Tipos ──────────────────────────────────────────────────────────

export interface CAPIUserData {
  em?: string;          // e-mail (plain — será hashado aqui)
  ph?: string;          // telefone (plain — será hashado)
  fn?: string;          // first name (plain — será hashado)
  ln?: string;          // last name (plain — será hashado)
  ct?: string;          // cidade (plain — será hashado)
  st?: string;          // estado/UF (plain — será hashado)
  zp?: string;          // CEP (plain — será hashado)
  country?: string;     // país — não hashado (ex: "br")
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;         // cookie _fbp
  fbc?: string;         // cookie _fbc
  external_id?: string; // ID interno do usuário (não precisa hash)
}

export interface CAPICustomData {
  value?: number;
  currency?: string;    // ex: "BRL"
  content_ids?: string[];
  content_name?: string;
  content_type?: string; // "product" ou "product_group"
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  num_items?: number;
  order_id?: string;
}

export interface CAPIEventPayload {
  eventName: string;
  eventId: string;           // UUID para deduplicação com browser
  eventSourceUrl: string;    // URL canônica da página
  userData: CAPIUserData;
  customData?: CAPICustomData;
  actionSource?: string;     // "website" | "system_generated"
}

// ── SHA-256 Hash ───────────────────────────────────────────────────

/**
 * Normaliza e faz SHA-256 de um valor de PII.
 * Retorna undefined se o valor for falsy.
 */
export function hashPII(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Hash de telefone: remove tudo que não é dígito, adiciona código Brasil
 * se necessário, e hasheia.
 */
export function hashPhone(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) {
    digits = "55" + digits; // adiciona código do Brasil
  }
  return crypto.createHash("sha256").update(digits).digest("hex");
}

/**
 * Hash de CEP: remove hífen e espaços.
 */
export function hashCEP(cep: string | undefined | null): string | undefined {
  if (!cep) return undefined;
  const normalized = cep.replace(/\D/g, "").trim();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

// ── Build User Data com hashes ─────────────────────────────────────

export function buildHashedUserData(raw: CAPIUserData): Record<string, string | undefined> {
  const [firstName, ...rest] = (raw.fn ?? "").split(" ");
  const lastName = rest.join(" ");

  return {
    em: hashPII(raw.em),
    ph: hashPhone(raw.ph),
    fn: hashPII(firstName || raw.fn),
    ln: hashPII(lastName || raw.ln),
    ct: hashPII(raw.ct),
    st: hashPII(raw.st),
    zp: hashCEP(raw.zp),
    country: raw.country ?? "br",
    client_ip_address: raw.client_ip_address,
    client_user_agent: raw.client_user_agent,
    fbp: raw.fbp,
    fbc: raw.fbc,
    ...(raw.external_id ? { external_id: raw.external_id } : {}),
  };
}

// ── Send CAPI Event ────────────────────────────────────────────────

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID!;
const ACCESS_TOKEN = process.env.META_PIXEL_ACCESS_TOKEN!;
const CAPI_URL = `https://graph.facebook.com/v20.0/${PIXEL_ID}/events`;

/**
 * Envia um evento para a Meta Conversions API.
 * Deve ser chamado SOMENTE de contextos server-side (API Routes, Server Actions, webhooks).
 */
export async function sendCAPIEvent(payload: CAPIEventPayload): Promise<{ success: boolean; error?: string }> {
  try {
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      console.warn("[CAPI] NEXT_PUBLIC_META_PIXEL_ID ou META_PIXEL_ACCESS_TOKEN não configurado.");
      return { success: false, error: "missing_config" };
    }

    const hashedUserData = buildHashedUserData(payload.userData);

    // Remove campos undefined para não poluir o payload
    const cleanUserData = Object.fromEntries(
      Object.entries(hashedUserData).filter(([, v]) => v !== undefined)
    );

    const event = {
      event_name: payload.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: payload.eventId,
      event_source_url: payload.eventSourceUrl,
      action_source: payload.actionSource ?? "website",
      user_data: cleanUserData,
      ...(payload.customData ? { custom_data: payload.customData } : {}),
    };

    const body = {
      data: [event],
      // test_event_code: "TEST12345", // Descomente para testar no Events Manager
    };

    const res = await fetch(`${CAPI_URL}?access_token=${ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[CAPI] Erro ao enviar evento:", errText);
      return { success: false, error: errText };
    }

    const result = await res.json();
    console.log(`[CAPI] Evento '${payload.eventName}' enviado. events_received: ${result.events_received}`);
    return { success: true };
  } catch (err) {
    console.error("[CAPI] Exceção ao enviar evento:", err);
    return { success: false, error: String(err) };
  }
}
