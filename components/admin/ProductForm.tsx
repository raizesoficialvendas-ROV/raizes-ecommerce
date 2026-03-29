"use client";

import { useState, useTransition, useId } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wand2, Truck, Palette, Plus, X, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";
import { createProduct, updateProduct, type ProductFormData } from "@/lib/actions/products";
import { useToastStore } from "@/store/useToastStore";
import type { Category, Product, ColorEntry } from "@/types/database.types";

const SIZES = ["P", "M", "G", "GG", "EGG"];

interface ProductFormProps {
  categories: Category[];
  product?: Product & { categories?: Category | null }; // For edit mode
}

const DEFAULT_SIZES: Record<string, number> = { P: 0, M: 0, G: 0, GG: 0, EGG: 0 };

function getInitialSizes(product?: Product): Record<string, number> {
  if (!product) return { ...DEFAULT_SIZES };
  const meta = product.metadata as Record<string, unknown> | null;
  if (meta?.sizes && typeof meta.sizes === "object") {
    return { ...DEFAULT_SIZES, ...(meta.sizes as Record<string, number>) };
  }
  return { ...DEFAULT_SIZES };
}

function getInitialColors(product?: Product): ColorEntry[] {
  const meta = product?.metadata as Record<string, unknown> | null;
  if (meta?.colors && Array.isArray(meta.colors)) {
    return meta.colors as ColorEntry[];
  }
  return [];
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const toast = useToastStore();
  const [isPending, startTransition] = useTransition();
  const formId = useId();
  const isEdit = Boolean(product);

  const meta = product?.metadata as Record<string, unknown> | null;

  // Form state
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(String(meta?.slug ?? ""));
  const [slugLocked, setSlugLocked] = useState(isEdit);
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ? String(product.price) : "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [status, setStatus] = useState<"draft" | "published">(product?.status ?? "draft");
  const [images, setImages] = useState<string[]>(product?.images_urls ?? []);
  const [sizes, setSizes] = useState<Record<string, number>>(getInitialSizes(product));
  const [tech, setTech] = useState(String(meta?.tech ?? ""));
  const [material, setMaterial] = useState(String(meta?.material ?? ""));
  const [freeShipping, setFreeShipping] = useState(Boolean(meta?.free_shipping));
  const [colors, setColors] = useState<ColorEntry[]>(getInitialColors(product));
  const [expandedColorIdx, setExpandedColorIdx] = useState<number | null>(null);

  // Auto-generate slug from name (when not in edit mode and not locked)
  function handleNameChange(val: string) {
    setName(val);
    if (!slugLocked) {
      setSlug(slugify(val));
    }
  }

  function handleSizeChange(size: string, val: string) {
    const num = parseInt(val, 10);
    setSizes((prev) => ({ ...prev, [size]: isNaN(num) ? 0 : Math.max(0, num) }));
  }

  // ── Color helpers ──────────────────────────────────────────────────────────

  function addColor() {
    const newIdx = colors.length;
    setColors((prev) => [...prev, { name: "", hex: "#1C1C1C", imageIndexes: [] }]);
    setExpandedColorIdx(newIdx);
  }

  function removeColor(idx: number) {
    setColors((prev) => prev.filter((_, i) => i !== idx));
    setExpandedColorIdx(null);
  }

  function updateColorField(idx: number, field: keyof ColorEntry, value: string | number[]) {
    setColors((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  }

  function toggleImageForColor(colorIdx: number, imgIdx: number) {
    setColors((prev) =>
      prev.map((c, i) => {
        if (i !== colorIdx) return c;
        const has = c.imageIndexes.includes(imgIdx);
        const next = has
          ? c.imageIndexes.filter((x) => x !== imgIdx)
          : [...c.imageIndexes, imgIdx].sort((a, b) => a - b);
        return { ...c, imageIndexes: next };
      })
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const priceValue = parseFloat(price.replace(",", "."));
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error("Preço inválido", "Informe um valor numérico positivo.");
      return;
    }

    const formData: ProductFormData = {
      name,
      slug,
      description,
      price: priceValue,
      category_id: categoryId || null,
      images_urls: images,
      status,
      stock_quantity: Object.values(sizes).reduce((a, b) => a + b, 0),
      sizes,
      tech,
      material,
      free_shipping: freeShipping,
      colors: colors.filter((c) => c.name.trim() !== ""),
    };

    startTransition(async () => {
      if (isEdit && product) {
        const { error } = await updateProduct(product.id, formData);
        if (error) {
          toast.error("Erro ao salvar produto", error);
          return;
        }
        toast.success("Produto atualizado!", "As alterações já estão no ar.");
        router.refresh();
      } else {
        const { id, error } = await createProduct(formData);
        if (error || !id) {
          toast.error("Erro ao criar produto", error ?? "Tente novamente.");
          return;
        }
        toast.success("Produto criado!", status === "published" ? "Já disponível na loja." : "Salvo como rascunho.");
        router.push(`/admin/produtos/${id}`);
      }
    });
  }

  // ── Field helpers ──────────────────────────────────────────────────────────

  const Label = ({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) => (
    <label htmlFor={htmlFor} className="block font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-sm text-obsidian font-sans focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-all placeholder:text-stone-400 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} id={formId} className="space-y-8">
      {/* ── Grid principal: 2 colunas em desktop ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* ── Coluna esquerda (col-span-2) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card: Informações Básicas */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 space-y-5">
            <h2 className="font-serif text-base font-semibold text-obsidian tracking-tight">
              Informações Básicas
            </h2>

            <div>
              <Label htmlFor={`${formId}-name`} required>Nome do Produto</Label>
              <input
                id={`${formId}-name`}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="Ex: Camiseta Essencial Preta"
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor={`${formId}-slug`} required>Slug (URL)</Label>
                <button
                  type="button"
                  onClick={() => { setSlug(slugify(name)); setSlugLocked(false); }}
                  className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-gold transition-colors cursor-pointer"
                  title="Regerar slug a partir do nome"
                >
                  <Wand2 size={11} /> Regerar
                </button>
              </div>
              <input
                id={`${formId}-slug`}
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugLocked(true); }}
                required
                placeholder="camiseta-essencial-preta"
                className={inputCls}
              />
              <p className="font-sans text-xs text-stone-400 mt-1">
                Usado na URL do produto: /produtos/ID (o slug fica no metadata).
              </p>
            </div>

            <div>
              <Label htmlFor={`${formId}-desc`} required>Descrição</Label>
              <textarea
                id={`${formId}-desc`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                placeholder="Descreva o produto com uma copy de impacto…"
                className={`${inputCls} resize-none leading-relaxed`}
              />
              <p className="font-sans text-xs text-stone-400 mt-1">
                {description.length} caracteres — use parágrafos separados por linha em branco.
              </p>
            </div>
          </div>

          {/* Card: Imagens */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 space-y-4">
            <h2 className="font-serif text-base font-semibold text-obsidian tracking-tight">
              Imagens
            </h2>
            <ImageUploader
              productId={product?.id}
              value={images}
              onChange={setImages}
              maxImages={15}
            />
          </div>

          {/* Card: Cores */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette size={15} strokeWidth={1.5} className="text-stone-400" />
                <h2 className="font-serif text-base font-semibold text-obsidian tracking-tight">
                  Cores
                </h2>
              </div>
              <button
                type="button"
                onClick={addColor}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer"
              >
                <Plus size={12} /> Adicionar cor
              </button>
            </div>

            {colors.length === 0 && (
              <p className="font-sans text-xs text-stone-400 italic">
                Nenhuma cor cadastrada. Clique em &quot;Adicionar cor&quot; para começar.
              </p>
            )}

            <div className="space-y-3">
              {colors.map((color, colorIdx) => (
                <div key={colorIdx} className="border border-stone-200 rounded-lg overflow-hidden">
                  {/* Header da cor */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-stone-50 cursor-pointer select-none"
                    onClick={() =>
                      setExpandedColorIdx(expandedColorIdx === colorIdx ? null : colorIdx)
                    }
                  >
                    {/* Swatch preview */}
                    <span
                      className="w-5 h-5 rounded-full border border-stone-300 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="flex-1 font-sans text-sm text-obsidian">
                      {color.name || <span className="text-stone-400 italic">Sem nome</span>}
                    </span>
                    <span className="font-mono text-xs text-stone-400">{color.hex}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeColor(colorIdx); }}
                      className="ml-1 p-1 rounded hover:bg-red-50 hover:text-red-500 text-stone-400 transition-colors cursor-pointer"
                      title="Remover cor"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  {/* Corpo expandido */}
                  {expandedColorIdx === colorIdx && (
                    <div className="px-4 py-4 space-y-4 border-t border-stone-100">
                      {/* Picker + nome */}
                      <div className="flex items-end gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider">
                            Cor
                          </label>
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-stone-200 cursor-pointer">
                            <input
                              type="color"
                              value={color.hex}
                              onChange={(e) => updateColorField(colorIdx, "hex", e.target.value)}
                              className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                              title="Escolher cor"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">
                            Nome da cor
                          </label>
                          <input
                            type="text"
                            value={color.name}
                            onChange={(e) => updateColorField(colorIdx, "name", e.target.value)}
                            placeholder="Ex: Preto, Off-White, Navy…"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">
                            Hex
                          </label>
                          <input
                            type="text"
                            value={color.hex}
                            onChange={(e) =>
                              updateColorField(colorIdx, "hex",
                                e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`
                              )
                            }
                            placeholder="#1C1C1C"
                            className={`${inputCls} w-28 font-mono`}
                            maxLength={7}
                          />
                        </div>
                      </div>

                      {/* Associação de imagens */}
                      <div>
                        <p className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                          Imagens desta cor
                          <span className="ml-1 text-stone-400 font-normal normal-case">
                            — clique para associar/desassociar
                          </span>
                        </p>
                        {images.length === 0 ? (
                          <div className="flex items-center gap-2 text-stone-400 py-2">
                            <ImageIcon size={14} />
                            <span className="font-sans text-xs">
                              Faça upload das imagens acima para associá-las a cores.
                            </span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {images.map((url, imgIdx) => {
                              const selected = color.imageIndexes.includes(imgIdx);
                              return (
                                <button
                                  key={imgIdx}
                                  type="button"
                                  onClick={() => toggleImageForColor(colorIdx, imgIdx)}
                                  className={[
                                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                                    selected
                                      ? "border-gold ring-1 ring-gold/40"
                                      : "border-stone-200 hover:border-stone-400 opacity-50 hover:opacity-100",
                                  ].join(" ")}
                                  title={`Imagem ${imgIdx + 1}${selected ? " (associada)" : ""}`}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={url}
                                    alt={`Imagem ${imgIdx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  {selected && (
                                    <div className="absolute top-1 right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center">
                                      <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
                                        <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </div>
                                  )}
                                  <div className="absolute bottom-0 left-0 right-0 bg-obsidian/60 text-white font-sans text-[9px] text-center py-0.5">
                                    #{imgIdx + 1}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card: Tecnologia e Material */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 space-y-5">
            <h2 className="font-serif text-base font-semibold text-obsidian tracking-tight">
              Tecnologia &amp; Material
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`${formId}-tech`}>Tecnologia</Label>
                <input
                  id={`${formId}-tech`}
                  type="text"
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                  placeholder="Ex: Dry-Fit, UV+50, Antimicrobiano"
                  className={inputCls}
                />
              </div>
              <div>
                <Label htmlFor={`${formId}-material`}>Material</Label>
                <input
                  id={`${formId}-material`}
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Ex: 95% Algodão, 5% Elastano"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Coluna direita ── */}
        <div className="space-y-6">

          {/* Card: Preço */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 space-y-5">
            <h2 className="font-serif text-base font-semibold text-obsidian tracking-tight">
              Preço
            </h2>
            <div>
              <Label htmlFor={`${formId}-price`} required>Valor (R$)</Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans text-sm text-stone-400 pointer-events-none">
                  R$
                </span>
                <input
                  id={`${formId}-price`}
                  type="text"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="89,90"
                  className={`${inputCls} pl-10`}
                />
              </div>
              <p className="font-sans text-xs text-stone-400 mt-1">
                Use vírgula ou ponto como separador decimal.
              </p>
            </div>

            {/* Frete grátis toggle */}
            <div className="pt-3 border-t border-stone-100">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <Truck size={14} strokeWidth={1.5} className={freeShipping ? "text-emerald-500" : "text-stone-400 group-hover:text-emerald-500 transition-colors"} />
                  <span className="font-sans text-sm text-stone-600 group-hover:text-obsidian transition-colors">
                    Frete grátis
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={freeShipping}
                    onChange={(e) => setFreeShipping(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-200 peer-checked:bg-emerald-500 rounded-full transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                </div>
              </label>
              <p className="font-sans text-xs text-stone-400 mt-1.5 pl-6">
                O cliente não precisará calcular frete.
              </p>
            </div>
          </div>

          {/* Card: Organização */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 space-y-5">
            <h2 className="font-serif text-base font-semibold text-obsidian tracking-tight">
              Organização
            </h2>
            <div>
              <Label htmlFor={`${formId}-cat`}>Coleção / Categoria</Label>
              <select
                id={`${formId}-cat`}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputCls}
              >
                <option value="">Sem categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor={`${formId}-status`}>Status</Label>
              <div className="flex gap-3">
                {(["draft", "published"] as const).map((s) => (
                  <label
                    key={s}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                      status === s
                        ? s === "published"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-stone-400 bg-stone-100 text-stone-700"
                        : "border-stone-200 bg-white text-stone-400 hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={() => setStatus(s)}
                      className="sr-only"
                    />
                    {s === "published" ? "Publicar" : "Rascunho"}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Estoque por tamanho */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-semibold text-obsidian tracking-tight">
                Estoque
              </h2>
              <span className="font-sans text-xs text-stone-400">
                Total: {Object.values(sizes).reduce((a, b) => a + b, 0)} un.
              </span>
            </div>
            <div className="space-y-2.5">
              {SIZES.map((size) => (
                <div key={size} className="flex items-center gap-3">
                  <span className="font-sans text-sm font-semibold text-stone-600 w-8 shrink-0">
                    {size}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={sizes[size] ?? 0}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-sm text-obsidian font-sans text-center focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-all"
                  />
                  <span className="font-sans text-xs text-stone-400 w-6 shrink-0">un.</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Rodapé do formulário ── */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-lg border border-stone-200 bg-white text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          form={formId}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-obsidian text-ivory text-sm font-semibold hover:bg-obsidian/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending
            ? "Salvando…"
            : isEdit
            ? "Salvar alterações"
            : status === "published"
            ? "Publicar produto"
            : "Criar rascunho"
          }
        </button>
      </div>
    </form>
  );
}
