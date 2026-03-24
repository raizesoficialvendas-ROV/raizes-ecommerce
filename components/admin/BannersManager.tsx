"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Trash, Link as LinkIcon, HelpCircle } from "lucide-react";
import { uploadBannerImage, upsertBanner } from "@/lib/actions/banners";
import { useToastStore } from "@/store/useToastStore";
import type { Banner } from "@/types/database.types";

interface BannersManagerProps {
  initialBanners: Banner[];
}

const SECTIONS = [
  {
    id: "hero",
    title: "Banner de Topo (Hero)",
    description: "A primeira imagem que os clientes veem ao entrar no site.",
    dimDesktop: "1920 x 1080 px (Formato 16:9)",
    dimMobile: "1080 x 1920 px (Formato 9:16)",
  },
  {
    id: "manifesto",
    title: "Banner Manifesto",
    description: "Imagem da seção de manifesto (A excelência não é arrogância).",
    dimDesktop: "1200 x 1500 px (Formato 4:5)",
    dimMobile: "1080 x 1350 px (Formato 4:5)",
  },
];

export default function BannersManager({ initialBanners }: BannersManagerProps) {
  const toast = useToastStore();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [banners, setBanners] = useState<Banner[]>(initialBanners);

  const getBannerData = (sectionId: string): Banner => {
    return (
      banners.find((b) => b.section === sectionId) ?? {
        id: "",
        section: sectionId,
        image_desktop_url: null,
        image_mobile_url: null,
        link_url: null,
        active: true,
        created_at: null,
        updated_at: null,
      }
    );
  };

  const updateLocalBanner = (sectionId: string, updates: Partial<Banner>) => {
    setBanners((prev) => {
      const exists = prev.find((b) => b.section === sectionId);
      if (exists) {
        return prev.map((b) => (b.section === sectionId ? { ...b, ...updates } : b));
      }
      return [...prev, { section: sectionId, ...updates } as Banner];
    });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionId: string,
    type: "desktop" | "mobile"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingKey = `${sectionId}-${type}`;
    setLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", sectionId);
      formData.append("type", type);

      const res = await uploadBannerImage(formData);

      if (res.error || !res.url) {
        throw new Error(res.error || "Erro ao fazer upload");
      }

      const updatePayload =
        type === "desktop"
          ? { image_desktop_url: res.url }
          : { image_mobile_url: res.url };

      updateLocalBanner(sectionId, updatePayload);

      // Auto-save to the database immediately
      const currentData = getBannerData(sectionId);
      const resDb = await upsertBanner({
        section: currentData.section,
        image_desktop_url: currentData.image_desktop_url,
        image_mobile_url: currentData.image_mobile_url,
        link_url: currentData.link_url,
        active: currentData.active ?? undefined,
        ...updatePayload, // inject the fresh URL synchronously
      });

      if (resDb.error) throw new Error(resDb.error);

      toast.success("Imagem e banner salvos com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Falha no upload da imagem.");
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleSave = async (sectionId: string) => {
    setLoading((prev) => ({ ...prev, [sectionId]: true }));
    try {
      const data = getBannerData(sectionId);
      const res = await upsertBanner({
        section: data.section,
        image_desktop_url: data.image_desktop_url,
        image_mobile_url: data.image_mobile_url,
        link_url: data.link_url,
        active: data.active ?? undefined,
      });

      if (res.error) throw new Error(res.error);
      toast.success("Banner salvo com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar o banner.");
    } finally {
      setLoading((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  return (
    <div className="space-y-12">
      {SECTIONS.map((sec) => {
        const data = getBannerData(sec.id);
        const isSaving = loading[sec.id] || false;

        return (
          <div
            key={sec.id}
            className="bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-lg font-serif font-medium text-obsidian">
                {sec.title}
              </h2>
              <p className="text-sm text-stone-500 mt-1">{sec.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Uploader Desktop */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-stone-700">
                    Imagem Desktop
                  </label>
                  <div className="group relative flex items-center gap-1 cursor-help text-stone-400">
                    <HelpCircle size={14} />
                    <span className="text-xs">Dimensões</span>
                    <div className="absolute bottom-full right-0 mb-2 w-max px-3 py-2 bg-obsidian text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Ideal: {sec.dimDesktop}
                    </div>
                  </div>
                </div>

                <div className="relative aspect-video bg-stone-50 border-2 border-dashed border-stone-200 rounded-lg overflow-hidden group hover:bg-stone-100 transition-colors">
                  {data.image_desktop_url ? (
                    <>
                      <Image
                        src={data.image_desktop_url}
                        alt="Desktop"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <p className="text-white text-sm font-medium">Trocar Imagem</p>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                      {loading[`${sec.id}-desktop`] ? (
                        <div className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload size={24} className="mb-2" />
                          <span className="text-xs font-medium">Fazer upload</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, sec.id, "desktop")}
                    disabled={loading[`${sec.id}-desktop`]}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Uploader Mobile */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-stone-700">
                    Imagem Mobile
                  </label>
                  <div className="group relative flex items-center gap-1 cursor-help text-stone-400">
                    <HelpCircle size={14} />
                    <span className="text-xs">Dimensões</span>
                    <div className="absolute bottom-full right-0 mb-2 w-max px-3 py-2 bg-obsidian text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Ideal: {sec.dimMobile}
                    </div>
                  </div>
                </div>

                <div className="relative aspect-[9/16] max-h-[250px] mx-auto bg-stone-50 border-2 border-dashed border-stone-200 rounded-lg overflow-hidden group hover:bg-stone-100 transition-colors">
                  {data.image_mobile_url ? (
                    <>
                      <Image
                        src={data.image_mobile_url}
                        alt="Mobile"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <p className="text-white text-sm font-medium">Trocar Imagem</p>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                      {loading[`${sec.id}-mobile`] ? (
                        <div className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload size={24} className="mb-2" />
                          <span className="text-xs font-medium">Fazer upload</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, sec.id, "mobile")}
                    disabled={loading[`${sec.id}-mobile`]}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Campos adicionais */}
            <div className="flex flex-col md:flex-row gap-4 items-end bg-stone-50 p-4 rounded-lg">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-widest mb-1.5">
                  Link de Destino
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <LinkIcon size={16} />
                  </div>
                  <input
                    type="text"
                    value={data.link_url || ""}
                    onChange={(e) =>
                      updateLocalBanner(sec.id, { link_url: e.target.value })
                    }
                    placeholder="Ex: /colecoes/essenciais"
                    className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-obsidian"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 h-10 px-2">
                <input
                  type="checkbox"
                  id={`active-${sec.id}`}
                  checked={data.active !== false}
                  onChange={(e) =>
                    updateLocalBanner(sec.id, { active: e.target.checked })
                  }
                  className="w-4 h-4 text-obsidian rounded focus:ring-obsidian Accent-obsidian"
                />
                <label
                  htmlFor={`active-${sec.id}`}
                  className="text-sm text-stone-700 cursor-pointer"
                >
                  Banner Ativo
                </label>
              </div>

              <button
                onClick={() => handleSave(sec.id)}
                disabled={isSaving}
                className="w-full md:w-auto mt-4 md:mt-0 px-8 py-3 bg-black hover:bg-stone-800 text-white text-sm font-bold tracking-wide rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isSaving ? "Salvando..." : "💾 Salvar Banner"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
