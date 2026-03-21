"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import type { CategoryInsert, CategoryUpdate, Category } from "@/types/database.types";

export interface CollectionFormData {
  name: string;
  slug?: string;
  image_url?: string | null;
  description?: string | null;
  display_order?: number;
}

export async function getAdminCollections() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as Category[];
}

export async function createCollection(
  formData: CollectionFormData
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  const slug = formData.slug?.trim() || slugify(formData.name);

  // Determine next display_order
  const { data: existing } = await supabase
    .from("categories")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder =
    existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

  const insert: CategoryInsert = {
    name: formData.name.trim(),
    slug,
    image_url: formData.image_url ?? null,
    description: formData.description ?? null,
    display_order: formData.display_order ?? nextOrder,
  };

  const { error } = await supabase.from("categories").insert(insert);

  if (error) return { error: error.message };

  revalidatePath("/admin/colecoes");
  revalidatePath("/colecoes");
  revalidatePath("/");
  return { error: null };
}

export async function updateCollection(
  id: string,
  formData: CollectionFormData
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  const update: CategoryUpdate = {
    name: formData.name.trim(),
    slug: formData.slug?.trim() || slugify(formData.name),
    image_url: formData.image_url ?? null,
    description: formData.description ?? null,
  };

  if (formData.display_order !== undefined) {
    update.display_order = formData.display_order;
  }

  const { error } = await supabase
    .from("categories")
    .update(update)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/colecoes");
  revalidatePath("/colecoes");
  revalidatePath("/");
  return { error: null };
}

export async function deleteCollection(
  id: string
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  // Desvincula produtos antes de deletar
  await supabase
    .from("products")
    .update({ category_id: null })
    .eq("category_id", id);

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/colecoes");
  revalidatePath("/colecoes");
  revalidatePath("/");
  return { error: null };
}

/**
 * Reordena as coleções — recebe um array de IDs na nova ordem
 */
export async function reorderCollections(
  orderedIds: string[]
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("categories")
      .update({ display_order: i })
      .eq("id", orderedIds[i]);

    if (error) return { error: error.message };
  }

  revalidatePath("/admin/colecoes");
  revalidatePath("/colecoes");
  revalidatePath("/");
  return { error: null };
}
