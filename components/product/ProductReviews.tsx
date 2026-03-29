"use client";

import { useState, useMemo, useTransition } from "react";
import { Star, ThumbsUp, ThumbsDown, Share2, ChevronDown, Camera } from "lucide-react";
import { submitReview, voteHelpful } from "@/lib/actions/reviews";
import type { Review } from "@/types/database.types";
import type { ReviewStats } from "@/lib/queries/reviews";

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

function StarRating({
  value,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
}: {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || value) : value;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = display >= i + 1;
        return (
          <span
            key={i}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(i + 1)}
            style={{ cursor: interactive ? "pointer" : "default" }}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              className={filled ? "text-obsidian fill-obsidian" : "text-stone-300"}
            />
          </span>
        );
      })}
    </div>
  );
}

function SliderBar({ value, min, max }: { value: number; min: number; max: number }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative w-full h-1.5 bg-stone-200 rounded-full">
      <div
        className="absolute left-0 top-0 h-full bg-obsidian rounded-full"
        style={{ width: `${pct}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-obsidian rounded-full border-2 border-white shadow-sm"
        style={{ left: `calc(${pct}% - 7px)` }}
      />
    </div>
  );
}

function DistributionBar({ count, total }: { count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-obsidian rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="w-10 h-10 rounded-full bg-obsidian flex items-center justify-center flex-shrink-0">
      <span className="font-sans text-xs font-bold text-ivory tracking-wider">{initials}</span>
    </div>
  );
}

function RadioScale({
  label,
  leftLabel,
  rightLabel,
  midLabel,
  value,
  onChange,
  steps = 5,
}: {
  label: string;
  leftLabel: string;
  rightLabel: string;
  midLabel?: string;
  value: number | null;
  onChange: (v: number) => void;
  steps?: number;
}) {
  return (
    <div>
      <p className="font-sans text-sm font-medium text-obsidian mb-3">{label}</p>
      <div className="flex items-center gap-2.5">
        {Array.from({ length: steps }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={[
              "w-5 h-5 rounded-full border-2 transition-all duration-150 flex-shrink-0",
              value === i + 1
                ? "bg-obsidian border-obsidian scale-110"
                : "bg-white border-stone-300 hover:border-stone-500",
            ].join(" ")}
            aria-label={`${label}: ${i + 1}`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="font-sans text-[11px] text-stone-400">{leftLabel}</span>
        {midLabel && (
          <span className="font-sans text-[11px] text-stone-400">{midLabel}</span>
        )}
        <span className="font-sans text-[11px] text-stone-400">{rightLabel}</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Seção: Resumo de notas
   ────────────────────────────────────────────── */

function ReviewSummary({ stats }: { stats: ReviewStats }) {
  return (
    <div className="py-10 border-b border-stone-200">
      {/* Média central */}
      <div className="flex flex-col items-center mb-8">
        <p className="font-serif text-6xl font-normal text-obsidian leading-none mb-2">
          {stats.average.toFixed(1).replace(".", ",")}
        </p>
        <StarRating value={Math.round(stats.average)} size={20} />
        <p className="font-sans text-sm text-stone-500 mt-2">
          Baseado em {stats.total} {stats.total === 1 ? "Avaliação" : "Avaliações"}
        </p>
      </div>

      {/* Barras de distribuição */}
      <div className="max-w-sm mx-auto space-y-2 mb-8">
        {([5, 4, 3, 2, 1] as const).map((star) => (
          <div key={star} className="flex items-center gap-3">
            <StarRating value={star} max={5} size={11} />
            <DistributionBar count={stats.distribution[star]} total={stats.total} />
            <span className="font-sans text-xs text-stone-500 w-6 text-right">
              ({stats.distribution[star]})
            </span>
          </div>
        ))}
      </div>

      {/* Badges de recomendação */}
      {stats.recommendPct > 0 && (
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2 bg-obsidian text-ivory px-4 py-1.5">
            <span className="font-sans text-sm font-bold">{stats.recommendPct}%</span>
          </div>
          <span className="font-sans text-sm text-stone-600">
            Revisores recomendariam este produto
          </span>
        </div>
      )}

      {/* Médias deslizantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto">
        {stats.avgSizeFit !== null && (
          <div>
            <p className="font-sans text-xs font-semibold text-stone-600 uppercase tracking-widest mb-3">
              Como ficou o tamanho do produto?
            </p>
            <SliderBar value={stats.avgSizeFit} min={1} max={5} />
            <div className="flex justify-between mt-2">
              <span className="font-sans text-[11px] text-stone-400">Muito pequeno</span>
              <span className="font-sans text-[11px] text-stone-400">Muito grande</span>
            </div>
          </div>
        )}
        {stats.avgPurchaseExp !== null && (
          <div>
            <p className="font-sans text-xs font-semibold text-stone-600 uppercase tracking-widest mb-3">
              Como foi a sua experiência de compra?
            </p>
            <SliderBar value={stats.avgPurchaseExp} min={1} max={5} />
            <div className="flex justify-between mt-2">
              <span className="font-sans text-[11px] text-stone-400">Ruim</span>
              <span className="font-sans text-[11px] text-stone-400">Excelente</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Formulário de nova avaliação
   ────────────────────────────────────────────── */

function ReviewForm({
  productId,
  productName,
  onSuccess,
}: {
  productId: string;
  productName: string;
  onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [purchaseExp, setPurchaseExp] = useState<number | null>(null);
  const [sizeFit, setSizeFit] = useState<number | null>(null);
  const [recommends, setRecommends] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    "w-full border border-stone-200 bg-white font-sans text-sm text-obsidian px-4 py-3 focus:outline-none focus:border-obsidian transition-colors placeholder:text-stone-400";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Selecione uma nota de 1 a 5 estrelas."); return; }
    if (!name.trim()) { setError("Informe seu nome."); return; }
    if (!email.trim()) { setError("Informe seu e-mail."); return; }
    setError(null);

    startTransition(async () => {
      const result = await submitReview({
        product_id: productId,
        author_name: name,
        author_email: email,
        rating,
        title: title || undefined,
        body: body || undefined,
        purchase_experience: purchaseExp ?? undefined,
        size_fit: sizeFit ?? undefined,
        recommends: recommends ?? undefined,
      });
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error ?? "Erro ao enviar avaliação.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-8 border-b border-stone-200">
      <h3 className="font-serif text-xl font-normal text-obsidian tracking-tight">
        Escrever avaliação para: <em className="not-italic text-stone-500">{productName}</em>
      </h3>

      {/* Nome + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 block">
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="joao.silva@example.com"
            className={inputCls}
            required
          />
        </div>
      </div>

      {/* Estrelas */}
      <div>
        <label className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2 block">
          Avaliação
        </label>
        <StarRating value={rating} size={28} interactive onChange={setRating} />
      </div>

      {/* Título */}
      <div>
        <label className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 block">
          Título da avaliação
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Dê sua opinião um título"
          className={inputCls}
        />
      </div>

      {/* Corpo */}
      <div>
        <label className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 block">
          Como foi sua experiência geral usando o item?
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Conte sobre o produto, qualidade, conforto..."
          rows={6}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Escalas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <RadioScale
          label="Como foi a sua experiência de compra?"
          leftLabel="Ruim"
          midLabel="Boa"
          rightLabel="Excelente"
          value={purchaseExp}
          onChange={setPurchaseExp}
        />
        <RadioScale
          label="Como ficou o tamanho do produto?"
          leftLabel="Muito pequeno"
          midLabel="Ideal"
          rightLabel="Muito grande"
          value={sizeFit}
          onChange={setSizeFit}
        />
      </div>

      {/* Recomendar */}
      <div>
        <p className="font-sans text-sm font-medium text-obsidian mb-3">
          Você recomenda este produto?
        </p>
        <div className="flex items-center gap-6">
          {[
            { label: "Sim", val: true },
            { label: "Não", val: false },
          ].map(({ label, val }) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="recommends"
                checked={recommends === val}
                onChange={() => setRecommends(val)}
                className="w-4 h-4 accent-obsidian"
              />
              <span className="font-sans text-sm text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Erro */}
      {error && (
        <p className="font-sans text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">
          {error}
        </p>
      )}

      {/* Ações */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-stone-300 font-sans text-xs font-semibold text-stone-600 uppercase tracking-widest hover:bg-stone-50 transition-colors"
        >
          <Camera size={13} />
          Add Photos
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-obsidian text-ivory font-sans text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Enviando…" : "Enviar"}
        </button>
      </div>
    </form>
  );
}

/* ──────────────────────────────────────────────
   Card de avaliação individual
   ────────────────────────────────────────────── */

function ReviewCard({ review }: { review: Review }) {
  const [helpfulState, setHelpfulState] = useState({
    yes: review.helpful_yes,
    no: review.helpful_no,
    voted: false,
  });
  const [, startTransition] = useTransition();

  function handleVote(type: "yes" | "no") {
    if (helpfulState.voted) return;
    setHelpfulState((s) => ({
      ...s,
      yes: type === "yes" ? s.yes + 1 : s.yes,
      no: type === "no" ? s.no + 1 : s.no,
      voted: true,
    }));
    startTransition(async () => { await voteHelpful(review.id, type); });
  }

  const date = new Date(review.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="py-7 border-b border-stone-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <AuthorAvatar name={review.author_name} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sans text-sm font-semibold text-obsidian">
                {review.author_name}
              </span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 font-sans text-[11px] text-stone-500">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 flex items-center justify-center">
                    <svg viewBox="0 0 8 6" fill="none" className="w-2 h-2">
                      <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Comprador verificado
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base">🇧🇷</span>
              <span className="font-sans text-xs text-stone-400">Brasil</span>
            </div>
          </div>
        </div>
        <span className="font-sans text-xs text-stone-400 flex-shrink-0">{date}</span>
      </div>

      {/* Estrelas + título */}
      <div className="flex items-center gap-2 mb-1">
        <StarRating value={review.rating} size={14} />
        {review.title && (
          <span className="font-sans text-sm font-semibold text-obsidian">{review.title}</span>
        )}
      </div>

      {/* Corpo */}
      {review.body && (
        <p className="font-sans text-sm text-stone-600 leading-[1.75] mt-2 mb-4">
          {review.body}
        </p>
      )}

      {/* Sliders de experiência */}
      {(review.purchase_experience !== null || review.size_fit !== null) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4 max-w-lg">
          {review.purchase_experience !== null && (
            <div>
              <p className="font-sans text-[11px] font-semibold text-stone-500 uppercase tracking-widest mb-2">
                Como foi a sua experiência de compra?
              </p>
              <SliderBar value={review.purchase_experience} min={1} max={5} />
              <div className="flex justify-between mt-1">
                <span className="font-sans text-[10px] text-stone-400">Ruim</span>
                <span className="font-sans text-[10px] text-stone-400">Excelente</span>
              </div>
            </div>
          )}
          {review.size_fit !== null && (
            <div>
              <p className="font-sans text-[11px] font-semibold text-stone-500 uppercase tracking-widest mb-2">
                Como ficou o tamanho do produto?
              </p>
              <SliderBar value={review.size_fit} min={1} max={5} />
              <div className="flex justify-between mt-1">
                <span className="font-sans text-[10px] text-stone-400">Muito pequeno</span>
                <span className="font-sans text-[10px] text-stone-400">Muito grande</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Variante */}
      {review.product_variant && (
        <p className="font-sans text-xs text-stone-400 mt-2">{review.product_variant}</p>
      )}

      {/* Footer: Compartilhar + Útil? */}
      <div className="flex items-center justify-between mt-4">
        <button className="inline-flex items-center gap-1.5 font-sans text-xs text-stone-500 hover:text-obsidian transition-colors">
          <Share2 size={12} />
          Compartilhar
        </button>
        <div className="flex items-center gap-3 font-sans text-xs text-stone-500">
          <span>Este comentário foi útil?</span>
          <button
            onClick={() => handleVote("yes")}
            disabled={helpfulState.voted}
            className="inline-flex items-center gap-1 hover:text-obsidian transition-colors disabled:opacity-50"
          >
            <ThumbsUp size={12} /> {helpfulState.yes}
          </button>
          <button
            onClick={() => handleVote("no")}
            disabled={helpfulState.voted}
            className="inline-flex items-center gap-1 hover:text-obsidian transition-colors disabled:opacity-50"
          >
            <ThumbsDown size={12} /> {helpfulState.no}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Componente principal exportado
   ────────────────────────────────────────────── */

export interface ProductReviewsProps {
  productId: string;
  productName: string;
  reviews: Review[];
  stats: ReviewStats;
}

const SORT_OPTIONS = [
  { label: "Mais recente", value: "recent" },
  { label: "Melhor avaliado", value: "best" },
  { label: "Pior avaliado", value: "worst" },
];

export default function ProductReviews({
  productId,
  productName,
  reviews,
  stats,
}: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Extrai keywords únicas dos títulos/corpos das reviews
  const filterTags = useMemo(() => {
    const keywords = new Set<string>();
    reviews.forEach((r) => {
      if (r.title) {
        r.title
          .split(/[\s,.!?]+/)
          .filter((w) => w.length > 3)
          .forEach((w) => keywords.add(w));
      }
    });
    return Array.from(keywords).slice(0, 8);
  }, [reviews]);

  const sorted = useMemo(() => {
    let result = [...reviews];
    if (activeFilter) {
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(activeFilter.toLowerCase()) ||
          r.body?.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }
    if (sortBy === "best") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "worst") result.sort((a, b) => a.rating - b.rating);
    else result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return result;
  }, [reviews, sortBy, activeFilter]);

  if (submitted) {
    return (
      <section className="py-16 border-t border-stone-200">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 16 12" fill="none" className="w-5 h-5">
              <path d="M1 6l4 4 10-9" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="font-serif text-2xl font-normal text-obsidian mb-2">Obrigado pela avaliação!</h3>
          <p className="font-sans text-sm text-stone-500 leading-relaxed">
            Sua avaliação foi enviada e será publicada após revisão da nossa equipe.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 border-t border-stone-200">

      {/* ── Título da seção ── */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-obsidian tracking-tight">
          Avaliações
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-obsidian border border-obsidian px-4 py-2.5 hover:bg-obsidian hover:text-ivory transition-all duration-200"
          >
            ✏ Escreva uma Avaliação
          </button>
        )}
      </div>

      {/* ── Resumo ── */}
      {stats.total > 0 && <ReviewSummary stats={stats} />}

      {/* ── Formulário ── */}
      {showForm && (
        <ReviewForm
          productId={productId}
          productName={productName}
          onSuccess={() => setSubmitted(true)}
        />
      )}

      {/* ── Sem avaliações ── */}
      {stats.total === 0 && !showForm && (
        <div className="py-12 text-center">
          <p className="font-sans text-sm text-stone-400">
            Nenhuma avaliação ainda. Seja o primeiro a avaliar!
          </p>
        </div>
      )}

      {/* ── Filtros e ordenação ── */}
      {stats.total > 0 && (
        <div className="py-6 border-b border-stone-200">
          {/* Tags de filtro */}
          {filterTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-5">
              <span className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-widest mr-1">
                Filtrar:
              </span>
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
                  className={[
                    "font-sans text-xs px-3 py-1.5 border transition-all duration-150",
                    activeFilter === tag
                      ? "bg-obsidian text-ivory border-obsidian"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400",
                  ].join(" ")}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Ordenação */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown((p) => !p)}
                className="inline-flex items-center gap-2 font-sans text-xs text-stone-600 border border-stone-200 px-4 py-2 hover:border-stone-400 transition-colors bg-white"
              >
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                <ChevronDown size={12} />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-stone-200 shadow-lg z-20">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                      className={[
                        "w-full text-left px-4 py-2.5 font-sans text-xs transition-colors",
                        sortBy === opt.value
                          ? "bg-stone-100 text-obsidian font-semibold"
                          : "text-stone-600 hover:bg-stone-50",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="font-sans text-xs text-stone-400">
              {sorted.length} {sorted.length === 1 ? "avaliação" : "avaliações"}
            </span>
          </div>
        </div>
      )}

      {/* ── Lista de reviews ── */}
      <div>
        {sorted.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
