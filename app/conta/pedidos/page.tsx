import { createClient } from "@/lib/supabase/server";
import { getUserOrders } from "@/lib/queries/orders";
import { formatCurrency, formatDate, getOrderStatusLabel } from "@/lib/utils";
import { getProductMainImage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Package,
  Truck,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";

export const metadata: Metadata = { title: "Meus Pedidos" };

const STATUS_CONFIG: Record<
  string,
  { icon: typeof Package; color: string; bgColor: string }
> = {
  pending: {
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
  },
  paid: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  confirmed: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  processing: {
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  shipped: {
    icon: Truck,
    color: "text-violet-600",
    bgColor: "bg-violet-50 border-violet-200",
  },
  delivered: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
};

export default async function ContaPedidosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const orders = await getUserOrders(user.id);

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-16 h-16 bg-stone-100 flex items-center justify-center">
          <ShoppingBag size={24} className="text-stone-300" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-obsidian">
            Nenhum pedido ainda
          </h2>
          <p className="font-sans text-sm text-stone-400 max-w-sm">
            Quando você fizer seu primeiro pedido, ele aparecerá aqui com todos
            os detalhes e acompanhamento.
          </p>
        </div>
        <Link href="/colecoes" className="btn-primary inline-flex items-center gap-2">
          Explorar coleções
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-sans text-sm text-stone-500">
          {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
          const StatusIcon = config.icon;
          const statusLabel = getOrderStatusLabel(order.status);

          return (
            <div
              key={order.id}
              className="bg-white border border-stone-200 overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-stone-100">
                <div className="flex items-center gap-4">
                  <div className="font-mono text-xs text-stone-400">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div className="font-sans text-xs text-stone-400">
                    {formatDate(order.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border ${config.bgColor} ${config.color}`}
                  >
                    <StatusIcon size={12} />
                    {statusLabel}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 bg-stone-100 overflow-hidden shrink-0">
                        <Image
                          src={getProductMainImage(
                            item.products?.images_urls
                          )}
                          alt={item.products?.name ?? "Produto"}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div>
                        <p className="font-sans text-sm text-obsidian leading-tight">
                          {item.products?.name ?? "Produto"}
                        </p>
                        <p className="font-sans text-xs text-stone-400 mt-0.5">
                          {item.size && `${item.size} · `}
                          Qtd: {item.quantity} ·{" "}
                          {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-stone-50 border-t border-stone-100">
                <div className="flex items-center gap-4">
                  <div className="font-sans text-sm font-medium text-obsidian">
                    Total: {formatCurrency(order.total_amount)}
                  </div>
                  {order.shipping_cost > 0 && (
                    <div className="font-sans text-xs text-stone-400">
                      (Frete: {formatCurrency(order.shipping_cost)})
                    </div>
                  )}
                </div>

                {/* Tracking Code */}
                {order.tracking_code && (
                  <a
                    href={`https://www.linkcorreios.com.br/?id=${order.tracking_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium hover:bg-violet-100 transition-colors"
                  >
                    <Truck size={12} />
                    Rastrear: {order.tracking_code}
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
