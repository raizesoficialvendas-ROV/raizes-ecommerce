import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Review } from "@/types/database.types";

/* ─────────────────────────────────────────────
   Busca reviews aprovadas de um produto
   ───────────────────────────────────────────── */
export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[getProductReviews]", err);
    return [];
  }
}

/* ─────────────────────────────────────────────
   Estatísticas de reviews para um produto
   ───────────────────────────────────────────── */
export interface ReviewStats {
  total: number;
  average: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>; // count por estrela
  recommendPct: number;
  avgPurchaseExp: number | null;
  avgSizeFit: number | null;
}

export function computeReviewStats(reviews: Review[]): ReviewStats {
  const total = reviews.length;
  if (total === 0) {
    return {
      total: 0,
      average: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      recommendPct: 0,
      avgPurchaseExp: null,
      avgSizeFit: null,
    };
  }

  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let ratingSum = 0;
  let recommendYes = 0;
  let recommendCount = 0;
  let peSum = 0; let peCount = 0;
  let sfSum = 0; let sfCount = 0;

  for (const r of reviews) {
    dist[r.rating] = (dist[r.rating] ?? 0) + 1;
    ratingSum += r.rating;
    if (r.recommends !== null) {
      recommendCount++;
      if (r.recommends) recommendYes++;
    }
    if (r.purchase_experience !== null) {
      peSum += r.purchase_experience;
      peCount++;
    }
    if (r.size_fit !== null) {
      sfSum += r.size_fit;
      sfCount++;
    }
  }

  return {
    total,
    average: Math.round((ratingSum / total) * 10) / 10,
    distribution: dist as Record<1 | 2 | 3 | 4 | 5, number>,
    recommendPct: recommendCount > 0 ? Math.round((recommendYes / recommendCount) * 100) : 0,
    avgPurchaseExp: peCount > 0 ? peSum / peCount : null,
    avgSizeFit: sfCount > 0 ? sfSum / sfCount : null,
  };
}

/* ─────────────────────────────────────────────
   Estatísticas agregadas para múltiplos produtos
   Retorna: { [productId]: { avg, count } }
   ───────────────────────────────────────────── */
export type ProductsReviewStats = Record<string, { avg: number; count: number }>;

export async function getProductsReviewStats(
  productIds: string[]
): Promise<ProductsReviewStats> {
  if (productIds.length === 0) return {};
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("product_id, rating")
      .in("product_id", productIds)
      .eq("approved", true);

    if (error || !data) return {};

    const map: Record<string, { sum: number; count: number }> = {};
    for (const row of data) {
      if (!map[row.product_id]) map[row.product_id] = { sum: 0, count: 0 };
      map[row.product_id].sum += row.rating;
      map[row.product_id].count += 1;
    }

    const result: ProductsReviewStats = {};
    for (const [id, { sum, count }] of Object.entries(map)) {
      result[id] = {
        avg: Math.round((sum / count) * 10) / 10,
        count,
      };
    }
    return result;
  } catch (err) {
    console.error("[getProductsReviewStats]", err);
    return {};
  }
}
