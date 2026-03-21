/**
 * Funções utilitárias para queries de produtos
 * Todas as queries usam o Supabase server client (com cookies/session).
 */

import { createClient } from "@/lib/supabase/server";
import type { Product, ProductWithCategory } from "@/types/database.types";

/**
 * Busca produtos publicados com retry automático.
 * Se a primeira tentativa falhar (timeout), tenta uma segunda vez
 * com uma query simplificada (sem join de categories).
 */
export async function getPublishedProducts(options?: {
  categorySlug?: string;
  limit?: number;
  offset?: number;
}): Promise<ProductWithCategory[]> {
  // Tenta a query completa
  try {
    return await _queryProducts(options, true);
  } catch (err) {
    console.warn("[getPublishedProducts] Tentativa 1 falhou, retrying...", err);
  }

  // Retry: query simplificada (sem join)
  try {
    return await _queryProducts(options, false);
  } catch (err) {
    console.error("[getPublishedProducts] Todas as tentativas falharam.", err);
    return [];
  }
}

async function _queryProducts(
  options: { categorySlug?: string; limit?: number; offset?: number } | undefined,
  withCategories: boolean
): Promise<ProductWithCategory[]> {
  const supabase = await createClient();

  const selectClause = withCategories
    ? `*, categories (id, name, slug, image_url)`
    : `*`;

  let query = supabase
    .from("products")
    .select(selectClause)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (options?.categorySlug && withCategories) {
    query = query.eq("categories.slug", options.categorySlug);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit ?? 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ProductWithCategory[];
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug,
          image_url
        )
      `
      )
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (error) {
      console.error("[getProductById]", error.message);
      return null;
    }

    return data as ProductWithCategory;
  } catch {
    return null;
  }
}

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("[getCategories]", error.message);
    return [];
  }

  return data;
}
