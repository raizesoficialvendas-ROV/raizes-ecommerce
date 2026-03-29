"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Star,
  Check,
  X,
  Trash2,
  Pencil,
  Search,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { setReviewApproved, updateReview, deleteReview } from "@/lib/actions/reviews";
import { useToastStore } from "@/store/useToastStore";
import type { Review, ReviewUpdate } from "@/types/database.types";

/* ── helpers ─────────────────────────────────── */

function StarRow({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < value ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}
        />
      ))}
    </span>
  );
}

function InitialAvatar({ name }: { name: string }) {
  const letter = (name?.trim()[0] ?? "A").toUpperCase();
  const colors = [
    "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
  ];
  const idx = letter.charCodeAt(0) % colors.length;
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${colors[idx]}`}
    >
      {letter}
    </div>
  );
}

/* ── Filter/Sort types ───────────────────────── */

type FilterTab = "all" | "pending" | "approved";
type SortKey = "recent" | "oldest" | "best" | "worst";

/* ── Edit Modal ──────────────────────────────── */

interface EditModalProps {
  review: Review;
  onClose: () => void;
  onSave: (data: Partial<ReviewUpdate>) => void;
  saving: boolean;
}

function EditModal({ review, onClose, onSave, saving }: EditModalProps) {
  const [rating, setRating] = useState(review.rating);
  const [title, setTitle] = useState(review.title ?? "");
  const [body, setBody] = useState(review.body ?? "");
  const [verified, setVerified] = useState(review.verified ?? false);
  const [hovered, setHovered] = useState(0);

  function handleSave() {
    onSave({ rating, title: title.trim() || null, body: body.trim() || null, verified });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-lg text-obsidian tracking-tight">Editar avaliação</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-obsidian transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-2">
            Nota
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
              >
                <Star
                  size={22}
                  className={`transition-colors ${
                    s <= (hovered || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-stone-200 text-stone-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-2">
            Título
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian/30"
            placeholder="Título da avaliação"
          />
        </div>

        {/* Body */}
        <div className="mb-4">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-2">
            Corpo do texto
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian/30 resize-none"
            placeholder="Texto da avaliação..."
          />
        </div>

        {/* Verified */}
        <div className="flex items-center gap-2.5 mb-6">
          <button
            type="button"
            onClick={() => setVerified((v) => !v)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              verified ? "bg-obsidian border-obsidian" : "border-stone-300"
            }`}
          >
            {verified && <Check size={12} className="text-white" />}
          </button>
          <span className="text-sm text-stone-600">Marcar como compra verificada</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-stone-200 rounded-xl py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-obsidian text-ivory rounded-xl py-2.5 text-sm font-medium hover:bg-obsidian/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm ──────────────────────────── */

function DeleteConfirm({ onConfirm, onCancel, deleting }: { onConfirm: () => void; onCancel: () => void; deleting: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10">
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-medium text-obsidian">Excluir avaliação?</h3>
            <p className="text-sm text-stone-500 mt-0.5">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-stone-200 rounded-xl py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {deleting && <Loader2 size={14} className="animate-spin" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Review Card ─────────────────────────────── */

interface ReviewCardProps {
  review: Review;
  onToggleApprove: (r: Review) => void;
  onEdit: (r: Review) => void;
  onDelete: (r: Review) => void;
  pending: boolean;
}

function ReviewCard({ review, onToggleApprove, onEdit, onDelete, pending }: ReviewCardProps) {
  const date = new Date(review.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-5 hover:border-stone-200 transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <InitialAvatar name={review.author_name} />

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-medium text-sm text-obsidian">{review.author_name}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2 py-0.5 rounded-full border border-emerald-100">
                <ShieldCheck size={10} />
                Verificado
              </span>
            )}
            <span
              className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                review.approved
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {review.approved ? "Aprovado" : "Pendente"}
            </span>
            <span className="text-xs text-stone-400 ml-auto">{date}</span>
          </div>

          {/* Stars + email */}
          <div className="flex items-center gap-3 mb-2">
            <StarRow value={review.rating} />
            <span className="text-xs text-stone-400 truncate">{review.author_email}</span>
          </div>

          {/* Title + body */}
          {review.title && (
            <p className="text-sm font-semibold text-obsidian mb-1">{review.title}</p>
          )}
          {review.body && (
            <p className="text-sm text-stone-600 line-clamp-3">{review.body}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-stone-400">
            {review.product_variant && (
              <span>Tamanho: <span className="text-stone-600 font-medium">{review.product_variant}</span></span>
            )}
            {review.recommends !== null && (
              <span>
                {review.recommends
                  ? <span className="text-emerald-600 font-medium">✓ Recomenda</span>
                  : <span className="text-red-500 font-medium">✗ Não recomenda</span>}
              </span>
            )}
            <span className="flex items-center gap-1">
              <ThumbsUp size={11} /> {review.helpful_yes ?? 0}
              <ThumbsDown size={11} className="ml-1" /> {review.helpful_no ?? 0}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Approve / Reject */}
          <button
            onClick={() => onToggleApprove(review)}
            disabled={pending}
            title={review.approved ? "Reprovar" : "Aprovar"}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              review.approved
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            } disabled:opacity-50`}
          >
            {pending ? <Loader2 size={13} className="animate-spin" /> : review.approved ? <X size={14} /> : <Check size={14} />}
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(review)}
            title="Editar"
            className="w-8 h-8 rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 flex items-center justify-center transition-colors"
          >
            <Pencil size={13} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(review)}
            title="Excluir"
            className="w-8 h-8 rounded-lg bg-stone-50 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────── */

export interface ReviewsManagerProps {
  initialReviews: Review[];
}

export default function ReviewsManager({ initialReviews }: ReviewsManagerProps) {
  const toast = useToastStore();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Edit
  const [editTarget, setEditTarget] = useState<Review | null>(null);
  const [isSaving, startSave] = useTransition();

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [isDeleting, startDelete] = useTransition();

  /* ── filter + sort ── */
  const visible = useMemo(() => {
    let list = reviews;

    if (filter === "pending") list = list.filter((r) => !r.approved);
    if (filter === "approved") list = list.filter((r) => r.approved);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.author_name.toLowerCase().includes(q) ||
          r.author_email.toLowerCase().includes(q) ||
          (r.title ?? "").toLowerCase().includes(q) ||
          (r.body ?? "").toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sort === "recent") sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (sort === "oldest") sorted.sort((a, b) => a.created_at.localeCompare(b.created_at));
    if (sort === "best")   sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "worst")  sorted.sort((a, b) => a.rating - b.rating);

    return sorted;
  }, [reviews, filter, sort, search]);

  const counts = useMemo(() => ({
    all: reviews.length,
    pending: reviews.filter((r) => !r.approved).length,
    approved: reviews.filter((r) => r.approved).length,
  }), [reviews]);

  /* ── actions ── */
  async function handleToggleApprove(review: Review) {
    setPendingId(review.id);
    const res = await setReviewApproved(review.id, !review.approved);
    setPendingId(null);
    if (res.success) {
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, approved: !review.approved } : r))
      );
      toast.success(review.approved ? "Avaliação reprovada" : "Avaliação aprovada! ✓");
    } else {
      toast.error(res.error ?? "Erro ao atualizar");
    }
  }

  function handleSaveEdit(data: Partial<ReviewUpdate>) {
    if (!editTarget) return;
    const id = editTarget.id;
    startSave(async () => {
      const res = await updateReview(id, data);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...data } : r))
        );
        toast.success("Avaliação atualizada!");
        setEditTarget(null);
      } else {
        toast.error(res.error ?? "Erro ao salvar");
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    startDelete(async () => {
      const res = await deleteReview(id);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast.success("Avaliação excluída");
        setDeleteTarget(null);
      } else {
        toast.error(res.error ?? "Erro ao excluir");
      }
    });
  }

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "all",      label: `Todas (${counts.all})` },
    { key: "pending",  label: `Pendentes (${counts.pending})` },
    { key: "approved", label: `Aprovadas (${counts.approved})` },
  ];

  return (
    <>
      {/* Header tools */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou título…"
            className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian/20 bg-white"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none pl-3 pr-8 py-2.5 border border-stone-200 rounded-xl text-sm text-obsidian bg-white focus:outline-none focus:ring-1 focus:ring-obsidian/20 cursor-pointer"
          >
            <option value="recent">Mais recente</option>
            <option value="oldest">Mais antigo</option>
            <option value="best">Melhor nota</option>
            <option value="worst">Pior nota</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 border-b border-stone-100 pb-0">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
              filter === key
                ? "text-obsidian after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-obsidian"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <Star size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma avaliação encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onToggleApprove={handleToggleApprove}
              onEdit={(r) => setEditTarget(r)}
              onDelete={(r) => setDeleteTarget(r)}
              pending={pendingId === review.id}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {editTarget && (
        <EditModal
          review={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
          saving={isSaving}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={isDeleting}
        />
      )}
    </>
  );
}
