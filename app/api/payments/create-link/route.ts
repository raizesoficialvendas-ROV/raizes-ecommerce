import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * ── InfinitePay — Criar link de checkout ──
 *
 * Recebe { orderId } do frontend (usuário autenticado).
 * Busca o pedido real no banco, monta o payload com valor em centavos,
 * chama a API pública da InfinitePay e retorna o checkout_link.
 *
 * NUNCA confia em valores vindos do frontend.
 */

const INFINITEPAY_CHECKOUT_URL =
  "https://api.infinitepay.io/invoices/public/checkout/links";

export async function POST(req: NextRequest) {
  try {
    // 1. Validar autenticação
    const supabaseAuth = await createServerClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Autenticação necessária." },
        { status: 401 }
      );
    }

    // 2. Ler orderId do body
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId é obrigatório." },
        { status: 400 }
      );
    }

    // 3. Buscar pedido real no banco (via admin — bypassa RLS)
    const supabase = createAdminClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Pedido não encontrado." },
        { status: 404 }
      );
    }

    // 4. Verificar se já tem link gerado
    if (order.payment_link) {
      return NextResponse.json({ checkoutUrl: order.payment_link });
    }

    // 5. Obter handle do env
    const handle = process.env.INFINITEPAY_HANDLE;
    if (!handle) {
      console.error("[Payments] INFINITEPAY_HANDLE não configurado.");
      return NextResponse.json(
        { error: "Gateway de pagamento não configurado." },
        { status: 500 }
      );
    }

    // 6. Montar payload — valor em CENTAVOS
    const totalCentavos = Math.round(order.total_amount * 100);
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Buscar itens do pedido para a descrição
    const { data: items } = await supabase
      .from("order_items")
      .select("quantity, unit_price, size, products(name)")
      .eq("order_id", orderId);

    const description =
      items
        ?.map(
          (i) =>
            `${(i.products as { name: string } | null)?.name ?? "Produto"} ${i.size ? `(${i.size})` : ""} x${i.quantity}`
        )
        .join(", ") ?? `Pedido Raízes #${orderId.slice(0, 8)}`;

    // Telefone: apenas dígitos SEM +55 (formato que a InfinitePay aceita)
    // Guia: "phone_number": "11999999999"
    const rawPhone = (order.customer_phone ?? "").replace(/\D/g, "");
    // Remove prefixo 55 se já existir, pois a InfinitePay não quer o DDI
    const phone = rawPhone.startsWith("55") && rawPhone.length > 11
      ? rawPhone.slice(2)
      : rawPhone;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {
      handle,
      items: [
        {
          quantity: 1,
          price: totalCentavos,
          description: description.slice(0, 200),
        },
      ],
      order_nsu: orderId,
      redirect_url: `${siteUrl}/checkout/sucesso?pedido=${orderId}`,
      customer: {
        name: order.customer_name ?? user.user_metadata?.full_name ?? "Cliente",
        email: order.customer_email ?? user.email ?? "",
        ...(phone.length >= 10 ? { phone_number: phone } : {}),
      },
    };

    // Só envia webhook_url se for um domínio público (InfinitePay rejeita localhost)
    if (!siteUrl.includes("localhost") && !siteUrl.includes("127.0.0.1")) {
      payload.webhook_url = `${siteUrl}/api/payments/webhook`;
    }

    // 7. Chamar InfinitePay
    const response = await fetch(INFINITEPAY_CHECKOUT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[InfinitePay]", response.status, text);
      // Surfaça o erro real para debugging (truncado a 300 chars)
      return NextResponse.json(
        {
          error: `InfinitePay respondeu ${response.status}: ${text.slice(0, 300)}`,
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    // 8. Extrair checkout_link e slug
    const checkoutUrl: string | undefined =
      data.checkout_link ?? data.url ?? data.link;
    const checkoutSlug: string | null = data.slug ?? data.id ?? null;

    if (!checkoutUrl) {
      console.error("[InfinitePay] Resposta inesperada:", data);
      return NextResponse.json(
        { error: "Resposta inesperada do gateway." },
        { status: 502 }
      );
    }

    // 9. Salvar no pedido
    await supabase
      .from("orders")
      .update({
        payment_link: checkoutUrl,
        checkout_slug: checkoutSlug,
      })
      .eq("id", orderId);

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("[Payments Create Link]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
