"use client";

import { useState, useEffect } from "react";
import { Truck, Loader2, MapPin, Package } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";

function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function ShippingCalculator() {
  const {
    items,
    shippingCep,
    shippingOptions,
    selectedShipping,
    setShippingCep,
    setShippingOptions,
    selectShipping,
    allItemsFreeShipping,
  } = useCartStore();

  const isFreeShipping = allItemsFreeShipping();

  // Auto-set frete grátis quando todos os itens qualificam
  useEffect(() => {
    if (isFreeShipping && selectedShipping?.price !== 0) {
      selectShipping({
        id: 0,
        name: "Frete Grátis",
        price: 0,
        deliveryDays: 7,
        company: "Raízes",
      });
    }
  }, [isFreeShipping, selectedShipping, selectShipping]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputCep, setInputCep] = useState(
    shippingCep ? maskCep(shippingCep) : ""
  );

  // Se todos os itens são frete grátis, exibe banner e pula o cálculo
  if (isFreeShipping) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Truck size={16} strokeWidth={1.5} className="text-emerald-600" />
          <h3 className="font-sans text-sm font-medium text-obsidian">
            Entrega
          </h3>
        </div>
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200">
          <Package size={18} strokeWidth={1.5} className="text-emerald-600 shrink-0" />
          <div>
            <p className="font-sans text-sm font-medium text-emerald-800">
              Frete Grátis para todos os itens
            </p>
            <p className="font-sans text-xs text-emerald-600 mt-0.5">
              Sua compra inclui envio gratuito para todo o Brasil.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCalculate = async () => {
    const cleanCep = inputCep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
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
          cep: cleanCep,
          items: items.map((i) => ({ quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Erro ao calcular frete.");
        return;
      }

      if (!data.options?.length) {
        setError("Nenhuma opção de frete disponível para este CEP.");
        return;
      }

      setShippingCep(cleanCep);
      setShippingOptions(data.options);

      // Auto-select cheapest option
      const cheapest = data.options.reduce(
        (a: { price: number }, b: { price: number }) =>
          a.price < b.price ? a : b
      );
      selectShipping(cheapest);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Truck size={16} strokeWidth={1.5} className="text-stone-500" />
        <h3 className="font-sans text-sm font-medium text-obsidian">
          Calcular frete
        </h3>
      </div>

      {/* CEP Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            value={inputCep}
            onChange={(e) => {
              setInputCep(maskCep(e.target.value));
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            className="w-full pl-9 pr-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
            maxLength={9}
          />
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading || inputCep.replace(/\D/g, "").length < 8}
          className="px-4 py-2.5 bg-obsidian text-ivory text-sm font-medium hover:bg-obsidian/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "Calcular"
          )}
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Shipping Options */}
      {shippingOptions.length > 0 && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {shippingOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                selectedShipping?.id === option.id
                  ? "border-obsidian bg-obsidian/[0.02]"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedShipping?.id === option.id
                      ? "border-obsidian"
                      : "border-stone-300"
                  }`}
                >
                  {selectedShipping?.id === option.id && (
                    <div className="w-2 h-2 rounded-full bg-obsidian" />
                  )}
                </div>
                <div>
                  <p className="font-sans text-sm text-obsidian">
                    {option.name}
                  </p>
                  <p className="font-sans text-xs text-stone-400">
                    {option.deliveryDays}{" "}
                    {option.deliveryDays === 1 ? "dia útil" : "dias úteis"}
                  </p>
                </div>
              </div>
              <span className="font-sans text-sm font-medium text-obsidian">
                {formatCurrency(option.price)}
              </span>
              <input
                type="radio"
                name="shipping"
                checked={selectedShipping?.id === option.id}
                onChange={() => selectShipping(option)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
