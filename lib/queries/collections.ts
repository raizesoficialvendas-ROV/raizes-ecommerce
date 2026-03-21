/**
 * Queries para coleções (categories) — lado do servidor
 */

import { createClient } from "@/lib/supabase/server";
import type { Category, ProductWithCategory } from "@/types/database.types";

/**
 * Busca todas as coleções ordenadas por display_order para exibição na homepage.
 * Inclui apenas coleções que possuem pelo menos um produto publicado.
 */
export async function getCollectionsForHome(): Promise<
  (Category & { products: ProductWithCategory[] })[]
> {
  const supabase = await createClient();

  // Busca coleções ordenadas
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) return [];

  const collections = data as Category[];
  const results: (Category & { products: ProductWithCategory[] })[] = [];

  for (const col of collections) {
    const { data: products } = await supabase
      .from("products")
      .select("*, categories (id, name, slug, image_url)")
      .eq("category_id", col.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(8);

    results.push({
      ...col,
      products: (products ?? []) as ProductWithCategory[],
    });
  }

  return results;
}

/**
 * Busca todas as coleções com contagem de produtos para a página /colecoes
 */
export async function getAllCollections(): Promise<
  (Category & { product_count: number })[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) return [];

  const collections = data as Category[];
  const results: (Category & { product_count: number })[] = [];

  for (const col of collections) {
    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", col.id)
      .eq("status", "published");

    results.push({ ...col, product_count: count ?? 0 });
  }

  return results;
}

/**
 * Busca uma coleção pelo slug
 */
export async function getCollectionBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Category;
}

/**
 * Busca todos os produtos publicados de uma coleção
 */
export async function getCollectionProducts(
  collectionId: string
): Promise<ProductWithCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories (id, name, slug, image_url)")
    .eq("category_id", collectionId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as ProductWithCategory[];
}
