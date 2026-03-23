"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Banner, BannerUpdate } from "@/types/database.types";

export interface BannerFormData {
  section: string;
  image_desktop_url?: string | null;
  image_mobile_url?: string | null;
  link_url?: string | null;
  active?: boolean;
}

// ── Upload function for server action ──
export async function uploadBannerImage(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  try {
    const file = formData.get("file") as File;
    const section = formData.get("section") as string;
    const type = formData.get("type") as string; // 'desktop' or 'mobile'

    if (!file || !section) return { url: null, error: "Missing file or section" };

    const supabase = createAdminClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${section}/${type}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("banners")
      .upload(path, file, { upsert: false, contentType: file.type });

    if (error) return { url: null, error: error.message };

    const { data } = supabase.storage.from("banners").getPublicUrl(path);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || "Upload failed" };
  }
}

// ── Fetching banners ──
export async function getAdminBanners(): Promise<Banner[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("banners").select("*").order("section");

  if (error) {
    console.error("[getAdminBanners]", error.message);
    return [];
  }
  return data as Banner[];
}

export async function getActiveBanner(section: string): Promise<Banner | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("section", section)
    .eq("active", true)
    .single();

  if (error) {
    console.error(`[getActiveBanner] ${section}:`, error.message);
    return null;
  }
  return data as Banner;
}

// ── Updating banners ──
export async function updateBanner(
  id: string,
  formData: BannerFormData
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  const update: BannerUpdate = {
    image_desktop_url: formData.image_desktop_url,
    image_mobile_url: formData.image_mobile_url,
    link_url: formData.link_url,
    active: formData.active,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("banners")
    .update(update)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return { error: null };
}

// ── Upsert banner (since sections are unique) ──
export async function upsertBanner(
  formData: BannerFormData
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  // Ensure row exists via upsert by section
  const { data: existing } = await supabase
    .from("banners")
    .select("id")
    .eq("section", formData.section)
    .single();

  let error;
  if (existing) {
    const res = await supabase
      .from("banners")
      .update({
        image_desktop_url: formData.image_desktop_url,
        image_mobile_url: formData.image_mobile_url,
        link_url: formData.link_url,
        active: formData.active !== undefined ? formData.active : true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    error = res.error;
  } else {
    const res = await supabase.from("banners").insert({
      section: formData.section,
      image_desktop_url: formData.image_desktop_url,
      image_mobile_url: formData.image_mobile_url,
      link_url: formData.link_url,
      active: formData.active !== undefined ? formData.active : true,
    });
    error = res.error;
  }

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return { error: null };
}
