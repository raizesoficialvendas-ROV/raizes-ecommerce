"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  CreditCard,
  Check,
  Loader2,
  Package,
  User,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { useUser } from "@/hooks/useUser";
import { formatCurrency, getProductMainImage } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import ShippingCalculator from "@/components/checkout/ShippingCalculator";
import AddressForm, {
  type AddressData,
} from "@/components/checkout/AddressForm";
import { createOrder } from "@/lib/actions/orders";

// Steps (Conta já foi resolvida antes de chegar aqui)
const STEPS = [
  { id: 1, label: "Sacola", icon: ShoppingBag },
  { id: 2, label: "Entrega", icon: Truck },
  { id: 3, label: "Pagamento", icon: CreditCard },
];

export default function CheckoutResumoPage() {
  const router = useRouter();
  const toast = useToastStore();
  const { user, loading: authLoading } = useUser();
  const {
    items,
    subtotal,
    selectedShipping,
    totalWithShipping,
    shippingCep,
    clearCart,
    allItemsFreeShipping,
    refreshProducts,
  } = useCartStore();

  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCpf, setCustomerCpf] = useState("");
  const [address, setAddress] = useState<AddressData | null>(null);
  const [addressComplete, setAddressComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth guard — redireciona para login do checkout se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/checkout/login?redirect=/checkout/resumo");
    }
  }, [authLoading, user, router]);

  // Prefill dados do usuário autenticado
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata;
      if (meta?.full_name && !customerName) setCustomerName(meta.full_name);
      if (user.email && !customerEmail) setCustomerEmail(user.email);
      if (meta?.phone && !customerPhone) setCustomerPhone(meta.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Redirect if cart is empty (after hydration)
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/");
    }
  }, [items.length, router, mounted]);

  // Refresh product data from DB (syncs metadata like free_shipping)
  useEffect(() => {
    async function syncProducts() {
      const supabase = createClient();
      const ids = [...new Set(items.map((i) => i.product.id))];
      if (ids.length === 0) return;
      const { data } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);
      if (data && data.length > 0) refreshProducts(data);
    }
    if (mounted && items.length > 0) {
      syncProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const handleAddressChange = useCallback(
    (addr: AddressData, complete: boolean) => {
      setAddress(addr);
      setAddressComplete(complete);
    },
    []
  );

  const isFree = allItemsFreeShipping();
  const canProceedToStep2 = items.length > 0;
  const cpfDigits = customerCpf.replace(/\D/g, "");
  const canProceedToStep3 =
    (isFree || selectedShipping !== null) &&
    addressComplete &&
    customerName.trim().length > 0 &&
    customerEmail.trim().length > 0 &&
    cpfDigits.length === 11;

  const handleSubmitOrder = async () => {
    if (!address || (!selectedShipping && !isFree)) return;

    setSubmitting(true);

    const shippingCost = isFree ? 0 : (selectedShipping?.price ?? 0);
    const shippingServiceName = isFree ? "Frete Grátis" : (selectedShipping?.name ?? undefined);
    const shippingServiceId = isFree ? undefined : (selectedShipping?.id ?? undefined);

    try {
      // 1. Criar pedido no banco
      const { orderId, error } = await createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerCpf: customerCpf.replace(/\D/g, ""),
        address,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          size: i.size,
          unitPrice: i.product.price,
        })),
        shippingCost,
        shippingServiceName,
        shippingServiceId,
      });

      if (error || !orderId) {
        toast.error("Erro no pedido", error ?? "Tente novamente.");
        setSubmitting(false);
        return;
      }

      // 2. Gerar link de pagamento InfinitePay
      const payRes = await fetch("/api/payments/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const payData = await payRes.json();

      if (!payRes.ok || payData.error) {
        // Mostra o erro real da InfinitePay para debugging
        const errorMsg = payData.error ?? "Erro desconhecido";
        console.error("[Checkout] Erro ao gerar link:", errorMsg);
        toast.error(
          "Erro no pagamento",
          errorMsg
        );
        setSubmitting(false);
        return;
      }

      // 3. Limpar carrinho e redirecionar para InfinitePay
      clearCart();
      window.location.href = payData.checkoutUrl;
    } catch {
      toast.error("Erro inesperado", "Tente novamente em instantes.");
      setSubmitting(false);
    }
  };

  // Loading states
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-stone-400" />
      </div>
    );
  }

  if (!user || items.length === 0) return null;

  const sub = subtotal();
  const total = totalWithShipping();

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <header className="border-b border-stone-200 bg-ivory/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl tracking-tight text-obsidian"
          >
            Raízes
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  onClick={() => s.id < step && setStep(s.id)}
                  disabled={s.id > step}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                    s.id === step
                      ? "bg-obsidian text-ivory"
                      : s.id < step
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {s.id < step ? (
                    <Check size={12} />
                  ) : (
                    <s.icon size={12} strokeWidth={1.5} />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-6 h-px ${
                      s.id < step ? "bg-emerald-300" : "bg-stone-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Main content */}
          <div className="lg:col-span-3 space-y-8">
            <AnimatePresence mode="wait">
              {/* ── Step 1: Cart review ── */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <Package
                      size={20}
                      strokeWidth={1.5}
                      className="text-stone-500"
                    />
                    <h1 className="font-serif text-2xl text-obsidian">
                      Revise sua sacola
                    </h1>
                  </div>

                  <div className="divide-y divide-stone-100 border border-stone-200">
                    {items.map(({ product, quantity, size }) => (
                      <div
                        key={`${product.id}-${size}`}
                        className="flex gap-4 p-4"
                      >
                        <div className="relative w-16 h-20 bg-stone-100 overflow-hidden shrink-0">
                          <Image
                            src={getProductMainImage(product.images_urls)}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-medium text-obsidian line-clamp-1">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 font-sans text-xs text-stone-400">
                            {size && <span>Tam: {size}</span>}
                            <span>Qtd: {quantity}</span>
                          </div>
                        </div>
                        <p className="font-sans text-sm font-medium text-obsidian shrink-0">
                          {formatCurrency(product.price * quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="btn-primary w-full justify-center"
                  >
                    Continuar para entrega
                    <Truck size={14} strokeWidth={1.5} />
                  </button>
                </motion.div>
              )}

              {/* ── Step 2: Shipping + Address ── */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-obsidian transition-colors"
                  >
                    <ArrowLeft size={12} />
                    Voltar para sacola
                  </button>

                  {/* Customer info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <User
                        size={16}
                        strokeWidth={1.5}
                        className="text-stone-500"
                      />
                      <h3 className="font-sans text-sm font-medium text-obsidian">
                        Seus dados
                      </h3>
                    </div>
                    <input
                      type="text"
                      placeholder="Nome completo *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="email"
                        placeholder="E-mail *"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
                      />
                      <input
                        type="tel"
                        placeholder="Telefone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
                      />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="CPF *"
                      value={customerCpf}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                        const masked = digits.length <= 3 ? digits
                          : digits.length <= 6 ? `${digits.slice(0,3)}.${digits.slice(3)}`
                          : digits.length <= 9 ? `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`
                          : `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9)}`;
                        setCustomerCpf(masked);
                      }}
                      className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-obsidian/40 transition-colors placeholder:text-stone-300"
                      maxLength={14}
                    />
                  </div>

                  {/* Shipping calculator */}
                  <ShippingCalculator />

                  {/* Address form */}
                  <AddressForm
                    cep={shippingCep || undefined}
                    onChange={handleAddressChange}
                  />

                  <button
                    onClick={() => setStep(3)}
                    disabled={!canProceedToStep3}
                    className="btn-primary w-full justify-center"
                  >
                    Continuar para pagamento
                    <CreditCard size={14} strokeWidth={1.5} />
                  </button>
                </motion.div>
              )}

              {/* ── Step 3: Payment (InfinitePay) ── */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-obsidian transition-colors"
                  >
                    <ArrowLeft size={12} />
                    Voltar para entrega
                  </button>

                  <div className="flex items-center gap-3">
                    <CreditCard
                      size={20}
                      strokeWidth={1.5}
                      className="text-stone-500"
                    />
                    <h1 className="font-serif text-2xl text-obsidian">
                      Finalizar pedido
                    </h1>
                  </div>

                  {/* Order summary compact */}
                  <div className="border border-stone-200 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <MapPin size={12} />
                      <span>
                        {address?.street}, {address?.number}
                        {address?.complement
                          ? ` - ${address.complement}`
                          : ""}{" "}
                        — {address?.city}/{address?.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <Truck size={12} />
                      <span>
                        {isFree
                          ? "Frete Grátis"
                          : `${selectedShipping?.name} — ${selectedShipping?.deliveryDays} dias úteis`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <User size={12} />
                      <span>
                        {customerName} — {customerEmail}
                      </span>
                    </div>
                  </div>

                  {/* Payment info */}
                  <div className="border border-stone-200 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard
                        size={16}
                        strokeWidth={1.5}
                        className="text-obsidian"
                      />
                      <p className="font-sans text-sm font-medium text-obsidian">
                        Pagamento seguro via InfinitePay
                      </p>
                    </div>
                    <p className="font-sans text-xs text-stone-400 leading-relaxed">
                      Ao confirmar, você será redirecionado para o ambiente
                      seguro da InfinitePay, onde poderá pagar via{" "}
                      <strong>PIX, cartão de crédito ou boleto</strong>.
                    </p>
                  </div>

                  <button
                    onClick={handleSubmitOrder}
                    disabled={submitting}
                    className="btn-primary w-full justify-center text-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Gerando link seguro...
                      </>
                    ) : (
                      <>
                        Confirmar e pagar — {formatCurrency(total)}
                        <ExternalLink size={14} strokeWidth={1.5} />
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Order summary sidebar */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 border border-stone-200 p-6 space-y-4">
              <h2 className="font-serif text-lg text-obsidian">Resumo</h2>

              <div className="space-y-2 text-sm font-sans">
                <div className="flex justify-between text-stone-500">
                  <span>
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)}{" "}
                    {items.reduce((s, i) => s + i.quantity, 0) === 1
                      ? "item"
                      : "itens"}
                    )
                  </span>
                  <span>{formatCurrency(sub)}</span>
                </div>

                <div className="flex justify-between text-stone-500">
                  <span>Frete</span>
                  <span className={isFree ? "text-emerald-600 font-medium" : ""}>
                    {isFree
                      ? "Grátis"
                      : selectedShipping
                        ? formatCurrency(selectedShipping.price)
                        : "—"}
                  </span>
                </div>

                <div className="border-t border-stone-200 pt-2 flex justify-between font-medium text-obsidian">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Mini item list */}
              <div className="pt-2 space-y-2">
                {items.map(({ product, quantity, size }) => (
                  <div
                    key={`${product.id}-${size}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative w-10 h-12 bg-stone-100 shrink-0 overflow-hidden">
                      <Image
                        src={getProductMainImage(product.images_urls)}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-obsidian text-ivory text-[10px] flex items-center justify-center">
                        {quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-obsidian line-clamp-1">
                        {product.name}
                      </p>
                      {size && (
                        <p className="text-[10px] text-stone-400">
                          Tam: {size}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
