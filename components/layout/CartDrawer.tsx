"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, ArrowRight, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency, getProductMainImage } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalItems, subtotal } =
    useCartStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Hydration guard — evita mismatch SSR vs Client (Zustand persist)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fecha com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  // Bloqueia scroll quando aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Não renderiza até hidratar — evita flash de conteúdo divergente
  if (!mounted) return null;

  const count = totalItems();
  const price = subtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay ── */}
          <motion.div
            ref={overlayRef}
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-obsidian/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* ── Drawer ── */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[60] w-full max-w-[420px] bg-ivory flex flex-col shadow-luxury-xl"
            aria-label="Sacola de compras"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-obsidian" />
                <h2 className="font-serif text-lg tracking-tight text-obsidian">
                  Sacola
                </h2>
                {count > 0 && (
                  <span className="font-sans text-xs text-stone-400">
                    ({count} {count === 1 ? "item" : "itens"})
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Fechar sacola"
                className="flex items-center justify-center w-9 h-9 text-stone-400 hover:text-obsidian transition-colors"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                /* Empty state */
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center"
                >
                  <ShoppingBag size={36} strokeWidth={1} className="text-stone-300" />
                  <div>
                    <p className="font-serif text-xl text-obsidian mb-2">
                      Sua sacola está vazia.
                    </p>
                    <p className="font-sans text-sm text-stone-400 leading-relaxed">
                      Descubra peças feitas com propósito e adicione seus favoritos.
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-outline text-xs mt-2"
                  >
                    Explorar coleção
                    <ArrowRight size={13} strokeWidth={1.5} />
                  </button>
                </motion.div>
              ) : (
                <ul className="divide-y divide-stone-100">
                  <AnimatePresence initial={false}>
                    {items.map(({ product, quantity, size }) => (
                      <motion.li
                        key={`${product.id}-${size}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex gap-4 px-7 py-5"
                      >
                        {/* Imagem */}
                        <Link
                          href={`/produtos/${product.id}`}
                          onClick={closeCart}
                          className="shrink-0 w-20 h-24 bg-stone-100 overflow-hidden relative"
                        >
                          <Image
                            src={getProductMainImage(product.images_urls)}
                            alt={product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>

                        {/* Detalhes */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <Link
                              href={`/produtos/${product.id}`}
                              onClick={closeCart}
                              className="font-sans text-sm font-medium text-obsidian leading-snug hover:text-stone-500 transition-colors line-clamp-2"
                            >
                              {product.name}
                            </Link>
                            {size && (
                              <p className="font-sans text-xs text-stone-400 mt-0.5">
                                Tamanho: {size}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Qty controls */}
                            <div className="flex items-center gap-2 border border-stone-200">
                              <button
                                onClick={() => updateQuantity(product.id, size, quantity - 1)}
                                aria-label="Diminuir quantidade"
                                className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-obsidian transition-colors"
                              >
                                {quantity === 1 ? (
                                  <Trash2 size={12} strokeWidth={1.5} />
                                ) : (
                                  <Minus size={12} strokeWidth={1.5} />
                                )}
                              </button>
                              <span className="font-sans text-sm w-5 text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(product.id, size, quantity + 1)}
                                aria-label="Aumentar quantidade"
                                className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-obsidian transition-colors"
                              >
                                <Plus size={12} strokeWidth={1.5} />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <p className="font-sans text-sm font-medium text-obsidian">
                                {formatCurrency(product.price * quantity)}
                              </p>
                              <button
                                onClick={() => removeItem(product.id, size)}
                                aria-label="Remover item"
                                className="w-7 h-7 flex items-center justify-center text-stone-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={12} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-stone-200 px-7 py-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-stone-500">Subtotal</span>
                  <span className="font-sans text-sm font-medium text-obsidian">
                    {formatCurrency(price)}
                  </span>
                </div>
                <p className="font-sans text-xs text-stone-400">
                  Frete calculado no checkout.
                </p>

                {/* CTA */}
                <Link
                  href="/checkout/resumo"
                  onClick={closeCart}
                  className="btn-primary w-full justify-center text-center"
                >
                  Finalizar compra
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full font-sans text-xs text-center text-stone-400 hover:text-obsidian underline-reveal transition-colors"
                >
                  Continuar comprando
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
