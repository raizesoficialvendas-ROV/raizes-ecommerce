"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  size?: string;
  unitPrice: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpf?: string;
  address: AddressData;
  items: OrderItemInput[];
  shippingCost: number;
  shippingServiceName?: string;
  shippingServiceId?: number;
}

// ── Validate stock ───────────────────────────────────────────────────────────

export async function validateStock(
  items: { productId: string; quantity: number; size?: string }[]
): Promise<{ valid: boolean; errors: string[] }> {
  const supabase = createAdminClient();
  const errors: string[] = [];

  for (const item of items) {
    const { data: product, error } = await supabase
      .from("products")
      .select("name, stock_quantity, metadata")
      .eq("id", item.productId)
      .single();

    if (error || !product) {
      errors.push(`Produto ${item.productId.slice(0, 8)} não encontrado.`);
      continue;
    }

    // Safely parse metadata — pode ser null, undefined ou não ter sizes
    let sizes: Record<string, number> | null = null;
    try {
      const meta = product.metadata as Record<string, unknown> | null;
      if (meta?.sizes && typeof meta.sizes === "object") {
        sizes = meta.sizes as Record<string, number>;
      }
    } catch {
      sizes = null;
    }

    if (item.size && sizes) {
      // Normaliza tamanho (ex: "p" → "P") para match seguro
      const normalizedSize = item.size.toUpperCase();
      const sizeStock = sizes[normalizedSize] ?? sizes[item.size] ?? 0;
      if (sizeStock < item.quantity) {
        errors.push(
          `"${product.name}" (${item.size}): apenas ${sizeStock} em estoque.`
        );
      }
    } else {
      // Fallback: usa estoque total quando não há controle por tamanho
      if (product.stock_quantity < item.quantity) {
        errors.push(
          `"${product.name}": apenas ${product.stock_quantity} em estoque.`
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ── Create order ─────────────────────────────────────────────────────────────

export async function createOrder(
  input: CreateOrderInput
): Promise<{ orderId: string | null; error: string | null }> {
  const supabase = createAdminClient();

  // 1. Validate stock first
  const stockCheck = await validateStock(
    input.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      size: i.size,
    }))
  );

  if (!stockCheck.valid) {
    return { orderId: null, error: stockCheck.errors.join("\n") };
  }

  // 2. Calculate totals
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const totalAmount = subtotal + input.shippingCost;

  // 2.5 Obter user_id do usuário autenticado (se logado)
  let userId: string | null = null;
  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // Se falhar a auth, continua sem user_id (guest checkout)
    userId = null;
  }

  // 3. Create order — vincula ao user se autenticado
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "pending" as const,
      total_amount: totalAmount,
      shipping_cost: input.shippingCost,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,
      customer_cpf: input.customerCpf || null,
      address_cep: input.address.cep.replace(/\D/g, ""),
      address_street: input.address.street,
      address_number: input.address.number,
      address_complement: input.address.complement || null,
      address_neighborhood: input.address.neighborhood,
      address_city: input.address.city,
      address_state: input.address.state,
      shipping_service: input.shippingServiceId && input.shippingServiceName
        ? `${input.shippingServiceId}:${input.shippingServiceName}`
        : input.shippingServiceName || null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[createOrder]", orderError?.message, orderError?.details, orderError?.hint);
    const detail = orderError?.message ?? "Erro desconhecido";
    return { orderId: null, error: `Erro ao criar pedido: ${detail}` };
  }

  // 4. Insert order items
  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    size: item.size || null,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("[createOrder items]", itemsError);
    // Rollback: delete the order
    await supabase.from("orders").delete().eq("id", order.id);
    return { orderId: null, error: "Erro ao salvar itens do pedido." };
  }

  // 5. Decrement stock (com proteção contra metadata nulo)
  for (const item of input.items) {
    const { data: product } = await supabase
      .from("products")
      .select("stock_quantity, metadata")
      .eq("id", item.productId)
      .single();

    if (product) {
      const newTotal = Math.max(0, product.stock_quantity - item.quantity);

      // Parse metadata com segurança
      let meta: Record<string, unknown> = {};
      let sizes: Record<string, number> | null = null;
      try {
        meta = (product.metadata as Record<string, unknown>) ?? {};
        if (meta.sizes && typeof meta.sizes === "object") {
          sizes = { ...(meta.sizes as Record<string, number>) };
        }
      } catch {
        meta = {};
        sizes = null;
      }

      // Decrement size-level stock if applicable
      if (item.size && sizes) {
        const normalizedSize = item.size.toUpperCase();
        const key = normalizedSize in sizes ? normalizedSize : item.size;
        const currentSizeStock = sizes[key] ?? 0;
        sizes[key] = Math.max(0, currentSizeStock - item.quantity);
      }

      await supabase
        .from("products")
        .update({
          stock_quantity: newTotal,
          ...(sizes ? { metadata: { ...meta, sizes } } : {}),
        })
        .eq("id", item.productId);
    }
  }

  revalidatePath("/");
  revalidatePath("/colecoes");
  revalidatePath("/admin/produtos");

  return { orderId: order.id, error: null };
}

// ── Update order status ──────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "paid" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("[updateOrderStatus]", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/pedidos");
  revalidatePath("/conta/pedidos");
  return { success: true, error: null };
}

// ── Update tracking code + mark as shipped ───────────────────────────────────

export async function updateOrderTracking(
  orderId: string,
  trackingCode: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("orders")
    .update({
      tracking_code: trackingCode.trim(),
      status: "shipped" as const,
    })
    .eq("id", orderId);

  if (error) {
    console.error("[updateOrderTracking]", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/pedidos");
  revalidatePath("/conta/pedidos");
  return { success: true, error: null };
}

// ── Retry Melhor Envio shipment creation ─────────────────────────────────────

export async function retryMelhorEnvioShipment(
  orderId: string
): Promise<{ success: boolean; shipmentId: string | null; error: string | null }> {
  const { createMelhorEnvioShipment } = await import("@/lib/shipping/melhor-envio");
  const supabase = createAdminClient();

  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select(`*, order_items(quantity, unit_price, products(name))`)
    .eq("id", orderId)
    .single();

  if (fetchErr || !order) {
    return { success: false, shipmentId: null, error: "Pedido não encontrado" };
  }

  if (order.status === "pending") {
    return { success: false, shipmentId: null, error: "Pedido ainda não foi pago" };
  }

  const { shipmentId, error: meError } = await createMelhorEnvioShipment(order);

  if (shipmentId) {
    // Salvar ID do envio no pedido
    await supabase
      .from("orders")
      .update({ melhor_envio_shipment_id: shipmentId })
      .eq("id", orderId);

    revalidatePath("/admin/pedidos");
    return { success: true, shipmentId, error: null };
  }

  return { success: false, shipmentId: null, error: meError ?? "Erro desconhecido ao criar envio" };
}

// ── Get all orders (admin) ───────────────────────────────────────────────────

export async function getAllOrders() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (
          id,
          name,
          images_urls,
          price
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllOrders]", error.message);
    return [];
  }

  return data;
}
