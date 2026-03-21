"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Wand2, GripVertical } from "lucide-react";
import { slugify } from "@/lib/utils";
import {
  createCollection,
  updateCollection,
  deleteCollection,
  reorderCollections,
  type CollectionFormData,
} from "@/lib/actions/collections";
import { useToastStore } from "@/store/useToastStore";
import type { Category } from "@/types/database.types";

interface CollectionManagerProps {
  initialCategories: Category[];
}

export default function CollectionManager({ initialCategories }: CollectionManagerProps) {
  const toast = useToastStore();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);
  const [formImage, setFormImage] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Drag & Drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  function openNew() {
    setShowNew(true);
    setEditingId(null);
    resetForm();
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setShowNew(false);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormImage(cat.image_url ?? "");
    setFormDescription(cat.description ?? "");
    setSlugLocked(true);
  }

  function resetForm() {
    setFormName("");
    setFormSlug("");
    setFormImage("");
    setFormDescription("");
    setSlugLocked(false);
  }

  function closeForm() {
    setShowNew(false);
    setEditingId(null);
    resetForm();
  }

  function handleNameChange(val: string) {
    setFormName(val);
    if (!slugLocked) setFormSlug(slugify(val));
  }

  function handleSave() {
    if (!formName.trim()) {
      toast.warning("Nome obrigatório", "Preencha o nome da coleção.");
      return;
    }
    const data: CollectionFormData = {
      name: formName.trim(),
      slug: formSlug || slugify(formName),
      image_url: formImage || null,
      description: formDescription || null,
    };

    startTransition(async () => {
      if (editingId) {
        const { error } = await updateCollection(editingId, data);
        if (error) { toast.error("Erro ao atualizar", error); return; }
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingId
              ? {
                  ...c,
                  name: data.name,
                  slug: data.slug ?? c.slug,
                  image_url: data.image_url ?? null,
                  description: data.description ?? null,
                }
              : c
          )
        );
        toast.success("Coleção atualizada!");
      } else {
        const { error } = await createCollection(data);
        if (error) { toast.error("Erro ao criar coleção", error); return; }
        toast.success("Coleção criada!", "Já aparecerá na homepage e na página de coleções.");
        setCategories((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            name: data.name,
            slug: data.slug!,
            image_url: data.image_url ?? null,
            description: data.description ?? null,
            display_order: prev.length,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }
      closeForm();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const { error } = await deleteCollection(id);
      setConfirmDeleteId(null);
      if (error) { toast.error("Erro ao excluir coleção", error); return; }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Coleção excluída.");
    });
  }

  // ── Drag & Drop handlers ──
  const handleDragStart = useCallback((idx: number) => {
    dragItem.current = idx;
    setDragIdx(idx);
  }, []);

  const handleDragEnter = useCallback((idx: number) => {
    dragOverItem.current = idx;
  }, []);

  const handleDragEnd = useCallback(() => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    setDragIdx(null);

    if (from === null || to === null || from === to) return;

    const updated = [...categories];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setCategories(updated);

    // Persist new order
    const ids = updated.map((c) => c.id);
    startTransition(async () => {
      const { error } = await reorderCollections(ids);
      if (error) {
        toast.error("Erro ao reordenar", error);
        setCategories(initialCategories);
      } else {
        toast.success("Ordem atualizada!");
      }
    });

    dragItem.current = null;
    dragOverItem.current = null;
  }, [categories, initialCategories, toast]);

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-sm text-obsidian font-sans focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-all placeholder:text-stone-400";

  return (
    <div className="space-y-6">
      {/* Inline form (new / edit) */}
      {(showNew || editingId) && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-semibold text-obsidian">
              {editingId ? "Editar Coleção" : "Nova Coleção"}
            </h3>
            <button onClick={closeForm} className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Nome <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Best Sellers"
                className={inputCls}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Slug (URL) <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setFormSlug(slugify(formName)); setSlugLocked(false); }}
                  className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-gold transition-colors cursor-pointer"
                >
                  <Wand2 size={11} /> Regerar
                </button>
              </div>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => { setFormSlug(e.target.value); setSlugLocked(true); }}
                placeholder="best-sellers"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Descrição
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Uma breve descrição da coleção para exibir no site..."
                rows={2}
                className={inputCls + " resize-none"}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                URL da Imagem de Capa
              </label>
              <input
                type="url"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                placeholder="https://…"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-obsidian text-ivory text-sm font-medium hover:bg-obsidian/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {editingId ? "Salvar alterações" : "Criar coleção"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <h3 className="font-sans text-sm font-semibold text-obsidian">
              {categories.length} {categories.length === 1 ? "coleção" : "coleções"}
            </h3>
            <p className="font-sans text-[11px] text-stone-400 mt-0.5">
              Arraste para reordenar a exibição na homepage
            </p>
          </div>
          {!showNew && !editingId && (
            <button
              onClick={openNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian text-ivory text-xs font-medium hover:bg-obsidian/90 transition-colors cursor-pointer"
            >
              <Plus size={13} /> Nova
            </button>
          )}
        </div>

        {categories.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-stone-400 font-sans">
            Nenhuma coleção cadastrada ainda.
          </p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {categories.map((cat, idx) => (
              <li
                key={cat.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={[
                  "flex items-center gap-3 px-5 py-3.5 transition-all cursor-grab active:cursor-grabbing",
                  dragIdx === idx
                    ? "opacity-50 bg-stone-50"
                    : "hover:bg-stone-50",
                ].join(" ")}
              >
                {/* Drag handle */}
                <div className="shrink-0 text-stone-300 hover:text-stone-500 transition-colors">
                  <GripVertical size={16} />
                </div>

                {/* Order badge */}
                <div className="shrink-0 w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center">
                  <span className="font-mono text-[10px] font-bold text-stone-400">
                    {idx + 1}
                  </span>
                </div>

                {/* Image preview */}
                <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                  {cat.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 font-serif text-xs">
                      {cat.name[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-semibold text-obsidian truncate">{cat.name}</p>
                  <p className="font-sans text-xs text-stone-400 truncate">
                    /{cat.slug}
                    {cat.description && (
                      <span className="ml-2 text-stone-300">· {cat.description}</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 text-stone-400 hover:text-obsidian rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>

                  {confirmDeleteId === cat.id ? (
                    <span className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={isPending}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded-md hover:bg-stone-200 transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(cat.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
