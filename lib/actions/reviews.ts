"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Review, ReviewInsert, ReviewUpdate } from "@/types/database.types";

/* ─────────────────────────────────────────────
   Tipos públicos
   ───────────────────────────────────────────── */

export interface SubmitReviewData {
  product_id: string;
  author_name: string;
  author_email: string;
  rating: number;
  title?: string;
  body?: string;
  purchase_experience?: number;
  size_fit?: number;
  recommends?: boolean;
  product_variant?: string;
}

export interface ReviewActionResult {
  success: boolean;
  error?: string;
}

/* ─────────────────────────────────────────────
   CLIENT — enviar avaliação (pending)
   ───────────────────────────────────────────── */

export async function submitReview(
  data: SubmitReviewData
): Promise<ReviewActionResult> {
  try {
    const supabase = createAdminClient();
    const insert: ReviewInsert = {
      product_id: data.product_id,
      author_name: data.author_name.trim(),
      author_email: data.author_email.trim().toLowerCase(),
      rating: data.rating,
      title: data.title?.trim() || null,
      body: data.body?.trim() || null,
      purchase_experience: data.purchase_experience ?? null,
      size_fit: data.size_fit ?? null,
      recommends: data.recommends ?? null,
      product_variant: data.product_variant?.trim() || null,
      approved: false,
      verified: false,
    };

    const { error } = await supabase.from("reviews").insert(insert);
    if (error) throw error;

    revalidatePath(`/produtos/${data.product_id}`);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao enviar avaliação";
    return { success: false, error: msg };
  }
}

/* ─────────────────────────────────────────────
   ADMIN — listar todas
   ───────────────────────────────────────────── */

export async function getAllReviews(): Promise<Review[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllReviews]", error);
    return [];
  }
  return data ?? [];
}

/* ─────────────────────────────────────────────
   ADMIN — aprovar / reprovar
   ───────────────────────────────────────────── */

export async function setReviewApproved(
  id: string,
  approved: boolean
): Promise<ReviewActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("reviews")
      .update({ approved } satisfies ReviewUpdate)
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/avaliacoes");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar";
    return { success: false, error: msg };
  }
}

/* ─────────────────────────────────────────────
   ADMIN — editar
   ───────────────────────────────────────────── */

export async function updateReview(
  id: string,
  data: Partial<ReviewUpdate>
): Promise<ReviewActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("reviews")
      .update(data)
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/avaliacoes");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao editar";
    return { success: false, error: msg };
  }
}

/* ─────────────────────────────────────────────
   ADMIN — excluir
   ───────────────────────────────────────────── */

export async function deleteReview(id: string): Promise<ReviewActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/avaliacoes");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao excluir";
    return { success: false, error: msg };
  }
}

/* ─────────────────────────────────────────────
   ADMIN — votar "útil"
   ───────────────────────────────────────────── */

export async function voteHelpful(
  id: string,
  vote: "yes" | "no"
): Promise<ReviewActionResult> {
  try {
    const supabase = createAdminClient();
    const col = vote === "yes" ? "helpful_yes" : "helpful_no";

    // Incrementa via RPC para evitar race condition
    const { data: current } = await supabase
      .from("reviews")
      .select(col)
      .eq("id", id)
      .single();

    const newVal = ((current as Record<string, number> | null)?.[col] ?? 0) + 1;
    const { error } = await supabase
      .from("reviews")
      .update({ [col]: newVal })
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao votar";
    return { success: false, error: msg };
  }
}
