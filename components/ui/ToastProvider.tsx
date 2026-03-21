"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToastStore, type ToastType } from "@/store/useToastStore";

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-emerald-500 shrink-0" />,
  error:   <XCircle     size={18} className="text-red-500    shrink-0" />,
  warning: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
  info:    <Info         size={18} className="text-blue-500  shrink-0" />,
};

const BORDER: Record<ToastType, string> = {
  success: "border-l-emerald-500",
  error:   "border-l-red-500",
  warning: "border-l-amber-500",
  info:    "border-l-blue-500",
};

export default function ToastProvider() {
  const { toasts, remove } = useToastStore();

  // Acessibilidade: anuncia toasts para screen readers
  useEffect(() => {}, [toasts]);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 48, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 48, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`
              pointer-events-auto relative flex items-start gap-3
              min-w-[300px] max-w-[420px]
              bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.14)]
              border border-stone-200 border-l-4 ${BORDER[toast.type]}
              px-4 py-3.5
            `}
            role="alert"
          >
            {ICONS[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-semibold text-obsidian leading-snug">
                {toast.title}
              </p>
              {toast.message && (
                <p className="font-sans text-xs text-stone-500 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => remove(toast.id)}
              className="ml-1 mt-0.5 shrink-0 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              aria-label="Fechar notificação"
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
