"use client";

import { useState } from "react";
import { Truck, MapPin, Loader2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

/* ── Tipos ──────────────────────────────────────────────── */

interface ShippingOption {
  id: number;
  name: string;
  price: number;
  deliveryDays: number;
  company: string;
}

function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/* ── Component ──────────────────────────────────────────── */

export default function ProductShippingEstimate() {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = async () => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) {
      setError("Digite um CEP válido com 8 dígitos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: clean,
          items: [{ quantity: 1 }],
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Erro ao calcular frete.");
        return;
      }

      if (!data.options?.length) {
        setError("Nenhuma opção disponível para este CEP.");
        return;
      }

      setOptions(data.options);
      setCalculated(true);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-stone-100 pt-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Truck size={14} strokeWidth={1.5} className="text-stone-400" />
        <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-stone-500">
          Entrega
        </p>
      </div>

      {/* Input de CEP */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => {
              setCep(maskCep(e.target.value));
              setError(null);
              if (calculated) setCalculated(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            className="w-full pl-9 pr-3 py-2.5 border border-stone-200 text-sm font-sans text-obsidian placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
            maxLength={9}
          />
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading || cep.replace(/\D/g, "").length < 8}
          className="px-5 py-2.5 bg-obsidian text-ivory text-[11px] font-semibold tracking-widest uppercase hover:bg-obsidian/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "Calcular"
          )}
        </button>
      </div>

      {/* Link "Não sei meu CEP" */}
      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 font-sans text-[11px] text-stone-400 underline-reveal hover:text-obsidian transition-colors"
      >
        Não sei meu CEP
      </a>

      {/* Erro */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-sans text-xs text-red-500 mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Resultados */}
      <AnimatePresence>
        {calculated && options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="mt-4 space-y-1.5">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  className="flex items-center justify-between py-2.5 px-3 bg-stone-50 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Package
                      size={13}
                      strokeWidth={1.5}
                      className="text-stone-400 shrink-0"
                    />
                    <div>
                      <p className="font-sans text-[13px] text-obsidian leading-tight">
                        {opt.name}
                      </p>
                      <p className="font-sans text-[11px] text-stone-400 mt-0.5">
                        {opt.deliveryDays}{" "}
                        {opt.deliveryDays === 1
                          ? "dia útil"
                          : "dias úteis"}
                      </p>
                    </div>
                  </div>
                  <span className="font-sans text-[13px] font-medium text-obsidian">
                    {opt.price === 0
                      ? "Grátis"
                      : formatCurrency(opt.price)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
