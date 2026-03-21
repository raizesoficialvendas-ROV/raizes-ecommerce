import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createMelhorEnvioShipment } from "@/lib/shipping/melhor-envio";

/**
 * ── InfinitePay — Polling fallback (check-status) ──
 *
 * Se o webhook falhar ou demorar, o frontend chama esta rota
 * em loop (a cada 5s) para verificar o status do pagamento.
 *
 * Fluxo:
 *   1. Busca status do pedido no banco
 *   2. Se ainda pending, consulta InfinitePay payment_check
 *   3. Se paid → atualiza banco, cria envio no Melhor Envio, retorna { paid: true }
 */

const INFINITEPAY_CHECK_URL =
  "https://api.infinitepay.io/invoices/public/checkout/payment_check";

/**
 * Marca o pedido como pago e cria o envio no Melhor Envio.
 * Retorna true se o pedido foi realmente atualizado (era pending).
 */
async function markOrderPaidAndShip(
  orderId: string,
  paymentId: string
): Promise<boolean> {
  const supabase = createAdminClient();

  // Atualiza apenas se status = pending (evita duplicidade)
  const { data: updated } = await supabase
    .from("orders")
    .update({
      status: "paid" as const,
      payment_id: paymentId,
    })
    .eq("id", orderId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  // Se não atualizou nada, já estava pago — não cria envio duplicado
  if (!updated) return false;

  // Criar envio no Melhor Envio (async, não bloqueia o response)
  try {
    const { data: order } = await supabase
      .from("orders")
      .select(
        `*, order_items(quantity, unit_price, products(name))`
      )
      .eq("id", orderId)
      .single();

    if (order) {
      const { shipmentId, error } = await createMelhorEnvioShipment(order);
      if (shipmentId) {
        console.log(`[Check Status] Envio ME ${shipmentId} criado para pedido ${orderId.slice(0, 8)}`);
        // Salvar ID do envio no pedido
        await supabase
          .from("orders")
          .update({ melhor_envio_shipment_id: shipmentId })
          .eq("id", orderId);
      } else if (error) {
        console.error(`[Check Status] ❌ ME shipment FALHOU para ${orderId.slice(0, 8)}: ${error}`);
      }
    }
  } catch (meErr) {
    console.error("[Check Status] Erro ao criar envio ME:", meErr);
  }

  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, transactionId } = body as {
      orderId?: string;
      transactionId?: string;
    };

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId é obrigatório." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Buscar estado atual do pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, checkout_slug, payment_id")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Pedido não encontrado." },
        { status: 404 }
      );
    }

    // Se já está pago no banco (via webhook ou poll anterior), retorna direto
    if (order.status === "paid" || order.status === "confirmed") {
      return NextResponse.json({ paid: true, source: "database" });
    }

    // Se não é mais pending (ex: cancelled), retorna status atual
    if (order.status !== "pending") {
      return NextResponse.json({ paid: false, source: "status_" + order.status });
    }

    // 2. Consultar InfinitePay direto
    const handle = process.env.INFINITEPAY_HANDLE;
    if (!handle || !order.checkout_slug) {
      if (transactionId) {
        await markOrderPaidAndShip(orderId, transactionId);
        return NextResponse.json({
          paid: true,
          source: "transaction_redirect",
        });
      }
      return NextResponse.json({ paid: false, source: "unavailable" });
    }

    try {
      const response = await fetch(INFINITEPAY_CHECK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          handle,
          order_nsu: orderId,
          slug: order.checkout_slug,
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(
          "[Check Status] InfinitePay retornou",
          response.status,
          text
        );

        if (transactionId) {
          await markOrderPaidAndShip(orderId, transactionId);
          return NextResponse.json({
            paid: true,
            source: "transaction_fallback",
          });
        }

        return NextResponse.json({ paid: false, source: "api_error" });
      }

      const data = await response.json();
      const isPaid: boolean =
        data.paid === true ||
        data.status === "paid" ||
        data.status === "approved";

      if (isPaid) {
        const paymentId: string =
          data.payment_id ?? data.id ?? transactionId ?? "";
        await markOrderPaidAndShip(orderId, paymentId);
        return NextResponse.json({ paid: true, source: "infinitepay" });
      }
    } catch (fetchError) {
      console.error("[Check Status] Fetch failed:", fetchError);

      if (transactionId) {
        await markOrderPaidAndShip(orderId, transactionId);
        return NextResponse.json({
          paid: true,
          source: "transaction_fallback",
        });
      }
    }

    return NextResponse.json({ paid: false, source: "pending" });
  } catch (err) {
    console.error("[Check Status]", err);
    return NextResponse.json({ paid: false, error: "internal" });
  }
}
