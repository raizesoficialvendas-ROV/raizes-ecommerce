import { getAdminBanners } from "@/lib/actions/banners";
import BannersManager from "@/components/admin/BannersManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Banners" };

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-normal text-obsidian tracking-tight">Banners</h1>
        <p className="font-sans text-sm text-stone-500 mt-1">
          Gerencie as imagens das áreas de destaque do site para desktop e mobile.
        </p>
      </div>

      <div className="max-w-4xl">
        <BannersManager initialBanners={banners} />
      </div>
    </div>
  );
}
