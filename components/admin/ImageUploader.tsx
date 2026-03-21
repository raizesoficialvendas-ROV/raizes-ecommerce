"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, GripVertical, Loader2, AlertCircle } from "lucide-react";
import { uploadProductImage, deleteProductImage } from "@/lib/actions/products";

interface ImageUploaderProps {
  productId?: string;          // ID real para Storage path (undefined em produto novo = usa temp ID)
  value: string[];             // URLs actuais
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export default function ImageUploader({
  productId,
  value,
  onChange,
  maxImages = 8,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // ID temporário para novos produtos (antes de ter o id real do banco)
  const bucketId = productId ?? `temp-${Date.now()}`;

  async function uploadFiles(files: FileList | File[]) {
    const fileArr = Array.from(files);
    const errs: string[] = [];

    // Validações
    const valid = fileArr.filter((f) => {
      if (!ACCEPTED.includes(f.type)) {
        errs.push(`${f.name}: formato inválido (use JPG, PNG, WEBP ou AVIF)`);
        return false;
      }
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errs.push(`${f.name}: arquivo muito grande (máx. ${MAX_FILE_SIZE_MB}MB)`);
        return false;
      }
      return true;
    });

    const remaining = maxImages - value.length;
    if (valid.length > remaining) {
      errs.push(`Máximo de ${maxImages} imagens. Selecione até ${remaining} arquivo(s).`);
      setErrors(errs);
      return;
    }

    if (valid.length === 0) {
      setErrors(errs);
      return;
    }

    setErrors(errs);
    setUploading(true);

    const uploaded: string[] = [];

    for (const file of valid) {
      const { url, error } = await uploadProductImage(file, bucketId);
      if (error || !url) {
        errs.push(`${file.name}: ${error ?? "Erro ao enviar"}`);
        continue;
      }
      uploaded.push(url);
    }

    if (errs.length > 0) setErrors(errs);
    if (uploaded.length > 0) onChange([...value, ...uploaded]);

    setUploading(false);
  }

  function handleRemove(url: string) {
    const match = url.match(/product-images\/(.+)/);
    if (match?.[1]) {
      deleteProductImage(match[1]); // server action — bypass RLS
    }
    onChange(value.filter((u) => u !== url));
  }

  // Drag-to-reorder (simple swap on drop)
  const dragOver = useRef<number | null>(null);
  const dragItem = useRef<number | null>(null);

  function handleDragStart(i: number) { dragItem.current = i; }
  function handleDragEnterItem(i: number) { dragOver.current = i; }
  function handleDropReorder() {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current === dragOver.current) return;
    const next = [...value];
    const [moved] = next.splice(dragItem.current, 1);
    next.splice(dragOver.current, 0, moved);
    onChange(next);
    dragItem.current = null;
    dragOver.current = null;
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]
  );

  return (
    <div>
      {/* Drop zone */}
      {value.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3
            border-2 border-dashed rounded-xl py-8 px-6 cursor-pointer
            transition-all duration-200 select-none
            ${dragging ? "border-gold bg-gold/5" : "border-stone-200 bg-stone-50 hover:border-stone-400 hover:bg-white"}
            ${uploading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {uploading ? (
            <Loader2 size={22} className="text-stone-400 animate-spin" />
          ) : (
            <Upload size={22} className="text-stone-400" />
          )}
          <div className="text-center">
            <p className="font-sans text-sm font-medium text-stone-600">
              {uploading ? "Enviando imagens…" : "Clique ou arraste as imagens aqui"}
            </p>
            <p className="font-sans text-xs text-stone-400 mt-0.5">
              JPG, PNG, WEBP, AVIF · Máx. {MAX_FILE_SIZE_MB}MB cada · Até {maxImages} imagens
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED.join(",")}
            className="sr-only"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            disabled={uploading}
          />
        </div>
      )}

      {/* Erros */}
      {errors.length > 0 && (
        <div className="mt-3 space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="flex items-center gap-1.5 font-sans text-xs text-red-500">
              <AlertCircle size={12} className="shrink-0" />
              {err}
            </p>
          ))}
        </div>
      )}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {value.map((url, i) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnterItem(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropReorder}
              className="relative group aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100 cursor-grab active:cursor-grabbing"
            >
              <Image src={url} alt={`Imagem ${i + 1}`} fill sizes="120px" className="object-cover" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/40 transition-all duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(url); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-white flex items-center justify-center text-obsidian hover:bg-red-50 hover:text-red-500 shadow cursor-pointer"
                  title="Remover imagem"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Index badge */}
              <div className="absolute top-1 left-1 w-5 h-5 rounded-md bg-obsidian/70 flex items-center justify-center">
                <span className="font-sans text-[10px] text-white font-medium">{i + 1}</span>
              </div>

              {/* Drag handle */}
              <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-60 transition-opacity">
                <GripVertical size={14} className="text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <p className="font-sans text-xs text-stone-400 mt-2">
          A primeira imagem será a capa do produto. Arraste para reordenar.
        </p>
      )}
    </div>
  );
}
