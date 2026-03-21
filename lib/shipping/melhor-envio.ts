/**
 * ── Melhor Envio — Criação de envio ──
 *
 * Após o pagamento ser confirmado, esta função adiciona o envio
 * ao carrinho do Melhor Envio. O envio aparece como "Aguardando pagamento"
 * no painel do ME, onde o operador pode pagar a etiqueta e gerar o rastreio.
 *
 * Fluxo ME completo:
 *   1. POST /me/cart           → Adiciona ao carrinho (esta função)
 *   2. POST /me/shipment/checkout → Paga a etiqueta (feito no painel ME)
 *   3. POST /me/shipment/generate → Gera a etiqueta (feito no painel ME)
 */

// Dimensões padrão por peça de vestuário (cm / kg)
const GARMENT = { width: 30, height: 5, length: 40, weight: 0.3 };

// Mapa de nomes de serviço para IDs do Melhor Envio (fallback)
const SERVICE_NAME_MAP: Record<string, number> = {
  PAC: 1,
  SEDEX: 2,
  ".Package": 3,
  ".Com": 4,
  "Mini Envios": 17,
};

// ── ViaCEP: resolve endereço a partir do CEP ────────────────────────────────

interface ViaCepResult {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

/** Cache simples em memória (process-lifetime) para evitar chamadas repetidas */
const viaCepCache = new Map<string, ViaCepResult>();

async function lookupCep(cep: string): Promise<ViaCepResult | null> {
  const clean = cep.replace(/\D/g, "");
  if (clean.length !== 8) return null;

  const cached = viaCepCache.get(clean);
  if (cached) return cached;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ViaCepResult;
    if (data.erro) return null;
    viaCepCache.set(clean, data);
    return data;
  } catch {
    return null;
  }
}

export interface OrderForShipment {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_cpf: string | null;
  address_cep: string | null;
  address_street: string | null;
  address_number: string | null;
  address_complement: string | null;
  address_neighborhood: string | null;
  address_city: string | null;
  address_state: string | null;
  shipping_service: string | null;
  shipping_cost: number;
  total_amount: number;
  order_items: {
    quantity: number;
    unit_price: number;
    products: { name: string } | null;
  }[];
}

/**
 * Extrai o ID do serviço ME a partir do campo shipping_service.
 * Formato novo: "1:PAC" → retorna 1
 * Formato legado: "PAC" → busca no mapa → retorna 1
 */
function parseServiceId(shippingService: string | null): number | null {
  if (!shippingService) return null;

  // Formato "id:name"
  if (shippingService.includes(":")) {
    const id = parseInt(shippingService.split(":")[0], 10);
    return isNaN(id) ? null : id;
  }

  // Fallback: busca pelo nome
  return SERVICE_NAME_MAP[shippingService] ?? null;
}

export async function createMelhorEnvioShipment(
  order: OrderForShipment
): Promise<{ shipmentId: string | null; error: string | null }> {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  if (!token) {
    console.warn("[Melhor Envio] Token não configurado — envio não criado.");
    return { shipmentId: null, error: "MELHOR_ENVIO_TOKEN não configurado" };
  }

  // Parse service ID
  const serviceId = parseServiceId(order.shipping_service);
  if (!serviceId || serviceId === 0) {
    console.log(
      `[Melhor Envio] Serviço "${order.shipping_service}" não requer envio ME (frete grátis ou manual).`
    );
    return { shipmentId: null, error: null }; // Não é erro — frete grátis
  }

  // Validar CPF/CNPJ do remetente
  const storeDocument = process.env.STORE_DOCUMENT;
  if (!storeDocument) {
    console.error("[Melhor Envio] STORE_DOCUMENT não configurado! Adicione o CPF ou CNPJ no .env.local.");
    return {
      shipmentId: null,
      error: "STORE_DOCUMENT (CPF/CNPJ) não configurado no .env.local",
    };
  }

  // Validar endereço de destino
  if (!order.address_cep || !order.address_city) {
    return {
      shipmentId: null,
      error: "Endereço de destino incompleto — envio ME não criado.",
    };
  }

  const isSandbox = process.env.MELHOR_ENVIO_SANDBOX === "true";
  const baseUrl = isSandbox
    ? "https://sandbox.melhorenvio.com.br"
    : "https://melhorenvio.com.br";
  const originCep = (process.env.ORIGIN_CEP ?? "01001000").replace(/\D/g, "");

  // ── Resolver endereço de origem via ViaCEP ─────────────────────────────
  // Garante que cidade/estado/bairro/rua correspondem ao CEP configurado.
  const originAddr = await lookupCep(originCep);
  // IMPORTANTE: usar || (não ??) porque ViaCEP retorna "" para CEPs de cidade
  const fromStreet = process.env.STORE_ADDRESS || originAddr?.logradouro || "Rua Principal";
  const fromDistrict = process.env.STORE_DISTRICT || originAddr?.bairro || "Centro";
  const fromCity = process.env.STORE_CITY || originAddr?.localidade || "São Paulo";
  const fromState = process.env.STORE_STATE || originAddr?.uf || "SP";

  if (!originAddr && !process.env.STORE_CITY) {
    console.warn("[Melhor Envio] ViaCEP falhou e STORE_CITY não está configurado. Usando defaults.");
  }

  // Calcular dimensões do pacote
  const totalQty = order.order_items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const insuranceValue = Math.max(
    order.total_amount - order.shipping_cost,
    1
  );

  // Produtos para o ME
  const products = order.order_items.map((item) => ({
    name: item.products?.name ?? "Produto Raízes",
    quantity: item.quantity,
    unitary_value: item.unit_price,
  }));

  // Garantir que campos obrigatórios do ME nunca fiquem vazios
  const toPhone = (order.customer_phone ?? "").replace(/\D/g, "") || "00000000000";
  const toDocument = (order.customer_cpf ?? "").replace(/\D/g, "") || storeDocument.replace(/\D/g, "");
  const toAddress = order.address_street || "Endereço não informado";
  const toDistrict = order.address_neighborhood || "Centro";

  const payload = {
    service: serviceId,
    from: {
      name: process.env.STORE_NAME || "Raízes",
      phone: (process.env.STORE_PHONE || "11999999999").replace(/\D/g, ""),
      email: process.env.STORE_EMAIL || "contato@raizes.com.br",
      document: storeDocument.replace(/\D/g, ""),
      address: fromStreet,
      number: process.env.STORE_NUMBER || "1",
      district: fromDistrict,
      city: fromCity,
      state_abbr: fromState,
      country_id: "BR",
      postal_code: originCep,
      complement: "",
      note: "",
    },
    to: {
      name: order.customer_name || "Cliente",
      phone: toPhone,
      email: order.customer_email || "",
      document: toDocument,
      address: toAddress,
      number: order.address_number || "S/N",
      district: toDistrict,
      city: order.address_city || "",
      state_abbr: order.address_state || "",
      country_id: "BR",
      postal_code: (order.address_cep ?? "").replace(/\D/g, ""),
      complement: order.address_complement || "",
      note: `Pedido Raízes #${order.id.slice(0, 8)}`,
    },
    products,
    volumes: [
      {
        height: Math.min(GARMENT.height * totalQty, 100),
        width: GARMENT.width,
        length: GARMENT.length,
        weight: +(GARMENT.weight * totalQty).toFixed(2),
      },
    ],
    options: {
      insurance_value: insuranceValue,
      receipt: false,
      own_hand: false,
    },
  };

  try {
    // Adicionar ao carrinho do Melhor Envio
    const response = await fetch(`${baseUrl}/api/v2/me/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "Raizes Ecommerce contato@raizes.com.br",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(
        `[Melhor Envio] Erro ${response.status} ao adicionar ao carrinho:`,
        text
      );
      return {
        shipmentId: null,
        error: `ME respondeu ${response.status}: ${text.slice(0, 200)}`,
      };
    }

    const data = await response.json();
    const shipmentId: string | undefined = data.id;

    if (!shipmentId) {
      console.error("[Melhor Envio] Resposta sem ID:", JSON.stringify(data));
      return {
        shipmentId: null,
        error: "Resposta inesperada do Melhor Envio (sem ID)",
      };
    }

    console.log(
      `[Melhor Envio] ✅ Envio ${shipmentId} criado para pedido ${order.id.slice(0, 8)} (serviço ${serviceId})`
    );

    return { shipmentId, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Melhor Envio] Exceção:", message);
    return { shipmentId: null, error: `Exceção ME: ${message}` };
  }
}
