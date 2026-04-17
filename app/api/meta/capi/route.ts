/**
 * app/api/meta/capi/route.ts
 * ─────────────────────────────────────────────────────────────────
 * Proxy server-side para a Meta Conversions API.
 *
 * Recebe eventos do frontend (via useMetaPixel hook) e os repassa
 * para a CAPI com o Access Token, que nunca é exposto ao client.
 *
 * Segurança:
 *  - Não exige sessão admin (eventos são de usuários anônimos também)
 *  - Não executa operações de escrita no banco
 *  - Apenas repassa eventos para a Meta Graph API
 * ─────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { sendCAPIEvent, type CAPIEventPayload } from "@/lib/meta/capi";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { eventName, eventId, userData, customData, eventSourceUrl } = body as Partial<
      CAPIEventPayload & { userData: Record<string, string | undefined> }
    >;

    if (!eventName || !eventId) {
      return NextResponse.json(
        { error: "eventName e eventId são obrigatórios" },
        { status: 400 }
      );
    }

    // Captura IP e User-Agent do request real (para melhorar EMQ)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      undefined;
    const userAgent = req.headers.get("user-agent") ?? undefined;

    const result = await sendCAPIEvent({
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://raizesoficial.com.br"}`,
      actionSource: "website",
      userData: {
        ...userData,
        client_ip_address: ip,
        client_user_agent: userAgent,
      },
      customData,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/meta/capi] Erro:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
