"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Check, Loader2 } from "lucide-react";

export interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const EMPTY_ADDRESS: AddressData = {
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

interface Props {
  cep?: string; // Pre-filled from shipping calculator
  onChange: (address: AddressData, isComplete: boolean) => void;
}

const REQUIRED_FIELDS: (keyof AddressData)[] = [
  "cep",
  "street",
  "number",
  "neighborhood",
  "city",
  "state",
];

function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function AddressForm({ cep: initialCep, onChange }: Props) {
  const [address, setAddress] = useState<AddressData>({
    ...EMPTY_ADDRESS,
    cep: initialCep ? maskCep(initialCep) : "",
  });
  const [lookingUp, setLookingUp] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  const filledCount = REQUIRED_FIELDS.filter(
    (f) => address[f].trim().length > 0
  ).length;
  const progress = Math.round((filledCount / REQUIRED_FIELDS.length) * 100);
  const isComplete = filledCount === REQUIRED_FIELDS.length;

  // Notify parent
  useEffect(() => {
    onChange(address, isComplete);
  }, [address, isComplete, onChange]);

  // ViaCEP auto-fill
  const lookupCep = useCallback(async (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;

    setLookingUp(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();

      if (!data.erro) {
        setAddress((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
        setAutoFilled(true);
        // Focus number field after auto-fill
        setTimeout(() => {
          document.getElementById("addr-number")?.focus();
        }, 200);
      }
    } catch {
      // Silently fail — user can fill manually
    } finally {
      setLookingUp(false);
    }
  }, []);

  // Auto-lookup when CEP is complete
  useEffect(() => {
    const clean = address.cep.replace(/\D/g, "");
    if (clean.length === 8) {
      lookupCep(clean);
    }
  }, [address.cep, lookupCep]);

  const updateField = (field: keyof AddressData, value: string) => {
    if (field === "cep") {
      setAddress((prev) => ({ ...prev, cep: maskCep(value) }));
      setAutoFilled(false);
    } else {
      setAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <MapPin size={16} strokeWidth={1.5} className="text-stone-500" />
          <h3 className="font-sans text-sm font-medium text-obsidian">
            Endereço de entrega
          </h3>
        </div>
        {/* Progress pill */}
        <div className="flex items-center gap-2">
          {isComplete && <Check size={14} className="text-emerald-600" />}
          <div className="w-20 h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-obsidian rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {autoFilled && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <Check size={12} />
          Endereço preenchido automaticamente! Confira e complete o número.
        </div>
      )}

      {/* CEP */}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="CEP *"
          value={address.cep}
          onChange={(e) => updateField("cep", e.target.value)}
          className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
          maxLength={9}
        />
        {lookingUp && (
          <Loader2
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 animate-spin"
          />
        )}
      </div>

      {/* Street */}
      <input
        type="text"
        placeholder="Rua / Avenida *"
        value={address.street}
        onChange={(e) => updateField("street", e.target.value)}
        className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
      />

      {/* Number + Complement */}
      <div className="grid grid-cols-2 gap-3">
        <input
          id="addr-number"
          type="text"
          inputMode="numeric"
          placeholder="Número *"
          value={address.number}
          onChange={(e) => updateField("number", e.target.value)}
          className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
        />
        <input
          type="text"
          placeholder="Complemento"
          value={address.complement}
          onChange={(e) => updateField("complement", e.target.value)}
          className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
        />
      </div>

      {/* Neighborhood */}
      <input
        type="text"
        placeholder="Bairro *"
        value={address.neighborhood}
        onChange={(e) => updateField("neighborhood", e.target.value)}
        className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
      />

      {/* City + State */}
      <div className="grid grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Cidade *"
          value={address.city}
          onChange={(e) => updateField("city", e.target.value)}
          className="col-span-2 w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
        />
        <input
          type="text"
          placeholder="UF *"
          value={address.state}
          onChange={(e) =>
            updateField("state", e.target.value.toUpperCase().slice(0, 2))
          }
          className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300 uppercase"
          maxLength={2}
        />
      </div>
    </div>
  );
}
