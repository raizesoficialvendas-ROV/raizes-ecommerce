import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createMelhorEnvioShipment } from "@/lib/shipping/melhor-envio";

/**
 * ── InfinitePay — Webhook de confirmação ──
 *
 * A InfinitePay chama esta URL após o pagamento ser processado.
 * Identifica o pedido pelo order_nsu, atualiza status para 'paid',
 * e cria automaticamente o envio no Melhor Envio.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[Webhook InfinitePay] Recebido:", JSON.stringify(body));

    const orderNsu: string | undefined =
      body.order_nsu ?? body.nsu ?? body.metadata?.order_nsu;
    const isPaid: boolean =
      body.paid === true ||
      body.status === "paid" ||
      body.status === "approved" ||
      body.payment_status === "paid";

    if (!orderNsu) {
      console.warn("[Webhook] order_nsu não encontrado no payload.");
      return NextResponse.json({ received: true, warning: "no order_nsu" });
    }

    if (!isPaid) {
      console.log("[Webhook] Status não é paid, ignorando:", body.status);
      return NextResponse.json({ received: true, status: "ignored" });
    }

    const supabase = createAdminClient();
    const paymentId: string =
      body.payment_id ?? body.id ?? body.transaction_id ?? "";

    // Atualiza apenas se status = pending (evita duplicidade)
    const { data: updated } = await supabase
      .from("orders")
      .update({
        status: "paid" as const,
        payment_id: paymentId,
      })
      .eq("id", orderNsu)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (!updated) {
      console.log(`[Webhook] Pedido ${orderNsu} já estava pago ou não encontrado.`);
      return NextResponse.json({ received: true, status: "already_paid" });
    }

    console.log(`[Webhook] Pedido ${orderNsu} marcado como paid.`);

    // Criar envio no Melhor Envio automaticamente
    try {
      const { data: order } = await supabase
        .from("orders")
        .select(`*, order_items(quantity, unit_price, products(name))`)
        .eq("id", orderNsu)
        .single();

      if (order) {
        const { shipmentId, error } = await createMelhorEnvioShipment(order);
        if (shipmentId) {
          console.log(`[Webhook] Envio ME ${shipmentId} criado para pedido ${orderNsu.slice(0, 8)}`);
          await supabase
            .from("orders")
            .update({ melhor_envio_shipment_id: shipmentId })
            .eq("id", orderNsu);
        } else if (error) {
          console.error(`[Webhook] ❌ ME shipment FALHOU para ${orderNsu.slice(0, 8)}: ${error}`);
        }
      }
    } catch (meErr) {
      console.error("[Webhook] Erro ao criar envio ME:", meErr);
    }

    return NextResponse.json({ received: true, status: "paid" });
  } catch (err) {
    console.error("[Webhook]", err);
    return NextResponse.json({ received: true, error: "internal" });
  }
}
