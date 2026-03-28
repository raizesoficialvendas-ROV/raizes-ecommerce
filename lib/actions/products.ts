"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import type { ProductInsert, ProductUpdate, ProductWithCategory, Product, ColorEntry } from "@/types/database.types";

// ── Tipos do formulário ──────────────────────────────────────────────────────

export interface ProductFormData {
  name: string;
  slug?: string;
  description: string;
  price: number;
  category_id: string | null;
  images_urls: string[];
  status: "draft" | "published";
  stock_quantity: number;
  // Tamanhos individuais (armazenados em metadata.sizes)
  sizes: Record<string, number>; // { P: 10, M: 5, G: 3, GG: 0, EGG: 0 }
  // Metadados extras
  tech?: string;
  material?: string;
  free_shipping?: boolean;
  // Variações de cor com imagens associadas
  colors?: ColorEntry[];
}

// ── Helper: Supabase Storage ─────────────────────────────────────────────────

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `products/${productId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export async function deleteProductImage(path: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.storage.from("product-images").remove([path]);
}

// ── CRUD Produtos ────────────────────────────────────────────────────────────

export async function createProduct(
  formData: ProductFormData
): Promise<{ id: string | null; error: string | null }> {
  const supabase = createAdminClient();

  const slug = formData.slug?.trim() || slugify(formData.name);

  // Calcula estoque total somando todos os tamanhos
  const totalStock = Object.values(formData.sizes).reduce((a, b) => a + (b ?? 0), 0);

  const insert: ProductInsert = {
    name: formData.name.trim(),
    description: formData.description.trim() || null,
    price: formData.price,
    category_id: formData.category_id || null,
    images_urls: formData.images_urls,
    status: formData.status,
    stock_quantity: totalStock || formData.stock_quantity,
    metadata: {
      slug,
      sizes: formData.sizes,
      tech: formData.tech?.trim() ?? null,
      material: formData.material?.trim() ?? null,
      free_shipping: formData.free_shipping ?? false,
      colors: formData.colors ?? [],
    },
  };

  const { data, error } = await supabase
    .from("products")
    .insert(insert)
    .select("id")
    .single();

  if (error) return { id: null, error: error.message };

  revalidatePath("/");
  revalidatePath("/colecoes");
  revalidatePath("/essenciais");
  revalidatePath("/admin/produtos");

  return { id: data.id, error: null };
}

export async function updateProduct(
  id: string,
  formData: ProductFormData
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  const slug = formData.slug?.trim() || slugify(formData.name);
  const totalStock = Object.values(formData.sizes).reduce((a, b) => a + (b ?? 0), 0);

  const update: ProductUpdate = {
    name: formData.name.trim(),
    description: formData.description.trim() || null,
    price: formData.price,
    category_id: formData.category_id || null,
    images_urls: formData.images_urls,
    status: formData.status,
    stock_quantity: totalStock || formData.stock_quantity,
    metadata: {
      slug,
      sizes: formData.sizes,
      tech: formData.tech?.trim() ?? null,
      material: formData.material?.trim() ?? null,
      free_shipping: formData.free_shipping ?? false,
      colors: formData.colors ?? [],
    },
  };

  const { error } = await supabase
    .from("products")
    .update(update)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/colecoes");
  revalidatePath(`/produtos/${id}`);
  revalidatePath("/admin/produtos");

  return { error: null };
}

export async function toggleProductStatus(
  id: string,
  currentStatus: "draft" | "published"
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  const newStatus = currentStatus === "published" ? "draft" : "published";
  const { error } = await supabase
    .from("products")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/colecoes");
  revalidatePath("/admin/produtos");

  return { error: null };
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  // Remove imagens do Storage primeiro
  const { data: product } = await supabase
    .from("products")
    .select("images_urls")
    .eq("id", id)
    .single();

  if (product?.images_urls?.length) {
    // Extrai apenas o path relativo (após bucket)
    const paths = product.images_urls.map((url: string) => {
      const match = url.match(/product-images\/(.+)/);
      return match ? match[1] : null;
    }).filter(Boolean) as string[];

    if (paths.length) {
      await supabase.storage.from("product-images").remove(paths);
    }
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/colecoes");
  revalidatePath("/admin/produtos");

  return { error: null };
}

export async function getAdminProducts(): Promise<ProductWithCategory[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(`*, categories(id, name, slug)`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAdminProducts]", error.message);
    return [];
  }

  return (data ?? []) as ProductWithCategory[];
}

export async function getAdminProductById(id: string): Promise<(Product & { categories?: { id: string; name: string; slug: string } | null }) | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(`*, categories(id, name, slug)`)
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Product & { categories?: { id: string; name: string; slug: string } | null };
}
