/**
 * Funções utilitárias para queries de pedidos
 */

import { createClient } from "@/lib/supabase/server";
import type { OrderWithItems } from "@/types/database.types";

export async function getUserOrders(userId: string) {
  const supabase = await createClient();

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
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getUserOrders]", error.message);
    return [];
  }

  return data as OrderWithItems[];
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient();

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
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("[getOrderById]", error.message);
    return null;
  }

  return data as OrderWithItems;
}
