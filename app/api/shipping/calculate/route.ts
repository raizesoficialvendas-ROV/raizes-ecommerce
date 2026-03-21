import { NextRequest, NextResponse } from "next/server";

// Hardcoded package dimensions per garment (cm / kg)
const GARMENT = { width: 30, height: 5, length: 40, weight: 0.3 };

export async function POST(req: NextRequest) {
  try {
    const { cep, items } = await req.json();

    if (!cep || !items?.length) {
      return NextResponse.json(
        { error: "CEP e itens são obrigatórios" },
        { status: 400 }
      );
    }

    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
    }

    const totalQty = items.reduce(
      (sum: number, i: { quantity: number }) => sum + i.quantity,
      0
    );

    // Scale dimensions based on quantity (stack vertically)
    const pkg = {
      width: GARMENT.width,
      height: Math.min(GARMENT.height * totalQty, 100),
      length: GARMENT.length,
      weight: +(GARMENT.weight * totalQty).toFixed(2),
    };

    const token = process.env.MELHOR_ENVIO_TOKEN;
    if (!token) {
      // DEV fallback: retorna opções mockadas para não travar o fluxo
      console.warn("[Shipping] MELHOR_ENVIO_TOKEN não configurado — usando frete mock.");
      const mockOptions = [
        { id: 1, name: "PAC", price: 18.90, deliveryDays: 8, company: "Correios" },
        { id: 2, name: "SEDEX", price: 32.50, deliveryDays: 3, company: "Correios" },
        { id: 17, name: "Mini Envios", price: 12.40, deliveryDays: 12, company: "Correios" },
      ];
      return NextResponse.json({ options: mockOptions });
    }

    const isSandbox = process.env.MELHOR_ENVIO_SANDBOX === "true";
    const baseUrl = isSandbox
      ? "https://sandbox.melhorenvio.com.br"
      : "https://melhorenvio.com.br";

    const originCep = process.env.ORIGIN_CEP ?? "01001000";

    const response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "Raizes Ecommerce contato@raizes.com.br",
      },
      body: JSON.stringify({
        from: { postal_code: originCep },
        to: { postal_code: cleanCep },
        package: pkg,
        services: "1,2,3,4,17",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Shipping API]", response.status, text);
      return NextResponse.json(
        { error: "Erro ao calcular frete" },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Filter only services that returned successfully with a price
    const options = data
      .filter((s: Record<string, unknown>) => !s.error && s.custom_price)
      .map((s: Record<string, unknown>) => ({
        id: s.id,
        name: s.name,
        price: parseFloat(s.custom_price as string),
        deliveryDays: s.custom_delivery_time,
        company: (s.company as Record<string, string>)?.name ?? s.name,
      }));

    return NextResponse.json({ options });
  } catch (err) {
    console.error("[Shipping Calculate]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
