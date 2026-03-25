"use client";

import { useState, useTransition } from "react";
import {
  Package,
  Truck,
  Clock,
  CheckCircle2,
  Send,
  Loader2,
  Filter,
  Search,
  Copy,
  MapPin,
  User,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  XCircle,
  RotateCcw,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency, formatDate, getOrderStatusLabel } from "@/lib/utils";
import { updateOrderTracking, updateOrderStatus, retryMelhorEnvioShipment, deleteOrder } from "@/lib/actions/orders";
import { useToastStore } from "@/store/useToastStore";

// ── Types ──

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  size: string | null;
  products: { id: string; name: string; images_urls: string[] | null; price: number } | null;
}

interface Order {
  id: string;
  user_id: string | null;
  status: string;
  total_amount: number;
  shipping_cost: number;
  tracking_code: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  address_cep: string | null;
  address_street: string | null;
  address_number: string | null;
  address_complement: string | null;
  address_neighborhood: string | null;
  address_city: string | null;
  address_state: string | null;
  shipping_service: string | null;
  payment_link: string | null;
  payment_id: string | null;
  melhor_envio_shipment_id: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

type FilterTab = "all" | "pending" | "paid" | "shipped";

// ── Status Config ──

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  pending:    { label: "Aguardando",   color: "text-amber-700",   bgColor: "bg-amber-50 border-amber-200"   },
  paid:       { label: "Pago",         color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  confirmed:  { label: "Confirmado",   color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  processing: { label: "Preparando",   color: "text-blue-700",    bgColor: "bg-blue-50 border-blue-200"     },
  shipped:    { label: "Enviado",      color: "text-violet-700",  bgColor: "bg-violet-50 border-violet-200" },
  delivered:  { label: "Entregue",     color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  cancelled:  { label: "Cancelado",    color: "text-red-700",     bgColor: "bg-red-50 border-red-200"       },
  refunded:   { label: "Reembolsado",  color: "text-stone-600",   bgColor: "bg-stone-100 border-stone-300"  },
};

const FILTER_TABS: { key: FilterTab; label: string; icon: typeof Package }[] = [
  { key: "all",     label: "Todos",              icon: Package      },
  { key: "pending", label: "Aguardando Pagamento", icon: Clock      },
  { key: "paid",    label: "Para Enviar",         icon: CheckCircle2 },
  { key: "shipped", label: "Enviados",            icon: Truck        },
];

// ── Component ──

export default function AdminOrdersClient({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const toast = useToastStore();

  // ── Filtering ──

  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (filter === "pending" && order.status !== "pending") return false;
    if (filter === "paid" && !["paid", "confirmed", "processing"].includes(order.status))
      return false;
    if (filter === "shipped" && !["shipped", "delivered"].includes(order.status))
      return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        (order.customer_name?.toLowerCase().includes(q) ?? false) ||
        (order.customer_email?.toLowerCase().includes(q) ?? false) ||
        (order.tracking_code?.toLowerCase().includes(q) ?? false)
      );
    }

    return true;
  });

  // ── Counts for tabs ──

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => ["paid", "confirmed", "processing"].includes(o.status)).length,
    shipped: orders.filter((o) => ["shipped", "delivered"].includes(o.status)).length,
  };

  // ── Handlers ──

  const handleMarkAsShipped = (orderId: string) => {
    const trackingCode = trackingInputs[orderId]?.trim();
    if (!trackingCode) {
      toast.error("Rastreio obrigatório", "Cole o código de rastreio antes de marcar como enviado.");
      return;
    }

    setLoadingOrderId(orderId);
    startTransition(async () => {
      const { success, error } = await updateOrderTracking(orderId, trackingCode);
      if (success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: "shipped", tracking_code: trackingCode }
              : o
          )
        );
        setTrackingInputs((prev) => {
          const copy = { ...prev };
          delete copy[orderId];
          return copy;
        });
        toast.success("Pedido enviado!", `Código ${trackingCode} salvo.`);
      } else {
        toast.error("Erro ao atualizar", error ?? "Tente novamente.");
      }
      setLoadingOrderId(null);
    });
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setLoadingOrderId(orderId);
    startTransition(async () => {
      const { success, error } = await updateOrderStatus(
        orderId,
        newStatus as "pending" | "paid" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
      );
      if (success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        toast.success("Status atualizado", `Pedido marcado como ${getOrderStatusLabel(newStatus)}.`);
      } else {
        toast.error("Erro", error ?? "Tente novamente.");
      }
      setLoadingOrderId(null);
    });
  };

  const handleRetryME = (orderId: string) => {
    setLoadingOrderId(orderId);
    startTransition(async () => {
      const { success, shipmentId, error } = await retryMelhorEnvioShipment(orderId);
      if (success && shipmentId) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, melhor_envio_shipment_id: shipmentId }
              : o
          )
        );
        toast.success("Envio ME criado!", `ID: ${shipmentId.slice(0, 8)}`);
      } else {
        toast.error("Erro ao criar envio ME", error ?? "Tente novamente.");
      }
      setLoadingOrderId(null);
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    setDeleteConfirm(null);
    setLoadingOrderId(orderId);
    startTransition(async () => {
      const { success, error } = await deleteOrder(orderId);
      if (success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setExpandedOrder((prev) => (prev === orderId ? null : prev));
        toast.success("Pedido excluído", "O pedido foi removido permanentemente.");
      } else {
        toast.error("Erro ao excluir", error ?? "Tente novamente.");
      }
      setLoadingOrderId(null);
    });
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="space-y-6">
      {/* ── Filter Tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
          {FILTER_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all
                ${
                  filter === key
                    ? "bg-white text-obsidian shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }
              `}
            >
              <Icon size={13} />
              {label}
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === key ? "bg-obsidian text-white" : "bg-stone-200 text-stone-500"
                }`}
              >
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-sans text-obsidian placeholder:text-stone-300 focus:ring-1 focus:ring-obsidian focus:border-obsidian outline-none transition"
          />
        </div>
      </div>

      {/* ── Orders Table ── */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center">
              <Filter size={20} className="text-stone-300" />
            </div>
            <p className="font-sans text-sm text-stone-400">
              {searchQuery ? "Nenhum resultado encontrado." : "Nenhum pedido nesta categoria."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredOrders.map((order) => {
              const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const isExpanded = expandedOrder === order.id;
              const isLoading = loadingOrderId === order.id && isPending;
              const needsShipping = ["paid", "confirmed", "processing"].includes(order.status);
              const currentTracking =
                trackingInputs[order.id] ?? order.tracking_code ?? "";

              return (
                <div key={order.id} className="group">
                  {/* ── Row Principal ── */}
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 px-4 py-3 hover:bg-stone-50/50 transition-colors">
                    {/* ID + Date */}
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="flex items-center gap-3 shrink-0 text-left"
                    >
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-stone-400" />
                      ) : (
                        <ChevronDown size={14} className="text-stone-400" />
                      )}
                      <div>
                        <span className="font-mono text-xs text-stone-500">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="font-sans text-xs text-stone-300 ml-2">
                          {formatDate(order.created_at, {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </button>

                    {/* Customer */}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-obsidian truncate">
                        {order.customer_name ?? "—"}
                      </p>
                      <p className="font-sans text-xs text-stone-400 truncate">
                        {order.customer_email ?? "—"}
                      </p>
                    </div>

                    {/* Items summary */}
                    <div className="font-sans text-xs text-stone-400 shrink-0">
                      {order.order_items.length}{" "}
                      {order.order_items.length === 1 ? "item" : "itens"}
                    </div>

                    {/* Total */}
                    <div className="font-sans text-sm font-medium text-obsidian shrink-0 w-24 text-right">
                      {formatCurrency(order.total_amount)}
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border shrink-0 ${config.bgColor} ${config.color}`}
                    >
                      {config.label}
                    </span>

                    {/* ── Inline Tracking Input (only for orders ready to ship) ── */}
                    {needsShipping && (
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Retry ME shipment button for orders missing it */}
                        {!order.melhor_envio_shipment_id && order.shipping_cost > 0 && (
                          <button
                            onClick={() => handleRetryME(order.id)}
                            disabled={isLoading}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-medium hover:bg-amber-100 disabled:opacity-40 transition-all"
                            title="Criar envio no Melhor Envio"
                          >
                            {isLoading ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <RotateCcw size={11} />
                            )}
                            Criar Envio ME
                          </button>
                        )}
                        {order.melhor_envio_shipment_id && (
                          <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono">
                            ME ✓
                          </span>
                        )}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Cód. rastreio"
                            value={currentTracking}
                            onChange={(e) =>
                              setTrackingInputs((prev) => ({
                                ...prev,
                                [order.id]: e.target.value,
                              }))
                            }
                            className="w-36 px-2.5 py-1.5 bg-stone-50 border border-stone-200 text-xs font-mono text-obsidian placeholder:text-stone-300 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                          />
                        </div>
                        <button
                          onClick={() => handleMarkAsShipped(order.id)}
                          disabled={isLoading || !currentTracking.trim()}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-obsidian text-ivory text-xs font-medium hover:bg-obsidian/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          {isLoading ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Send size={12} />
                          )}
                          Enviar
                        </button>
                      </div>
                    )}

                    {/* Shipped tracking display */}
                    {order.status === "shipped" && order.tracking_code && (
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs text-violet-600 bg-violet-50 px-2 py-1 border border-violet-200">
                          {order.tracking_code}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(order.tracking_code!);
                            toast.success("Copiado!", "Código de rastreio copiado.");
                          }}
                          className="p-1 text-stone-400 hover:text-obsidian transition-colors"
                          title="Copiar código"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── Expanded Details ── */}
                  {isExpanded && (
                    <div className="bg-stone-50/70 border-t border-stone-100 px-6 py-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Customer Info */}
                        <div className="space-y-3">
                          <h4 className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider">
                            Cliente
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-stone-600">
                              <User size={12} className="text-stone-400" />
                              {order.customer_name ?? "—"}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-stone-600">
                              <Mail size={12} className="text-stone-400" />
                              {order.customer_email ?? "—"}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-stone-600">
                              <Phone size={12} className="text-stone-400" />
                              {order.customer_phone ?? "—"}
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-3">
                          <h4 className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider">
                            Endereço
                          </h4>
                          <div className="flex items-start gap-2 text-xs text-stone-600">
                            <MapPin size={12} className="text-stone-400 mt-0.5 shrink-0" />
                            <div>
                              {order.address_street && (
                                <p>
                                  {order.address_street}, {order.address_number}
                                  {order.address_complement && ` — ${order.address_complement}`}
                                </p>
                              )}
                              {order.address_neighborhood && (
                                <p>{order.address_neighborhood}</p>
                              )}
                              {order.address_city && (
                                <p>
                                  {order.address_city} — {order.address_state}
                                </p>
                              )}
                              {order.address_cep && (
                                <p className="font-mono">{order.address_cep}</p>
                              )}
                            </div>
                          </div>
                          {order.shipping_service && (
                            <p className="text-xs text-stone-400">
                              Via: {order.shipping_service} · Frete:{" "}
                              {order.shipping_cost > 0
                                ? formatCurrency(order.shipping_cost)
                                : "Grátis"}
                            </p>
                          )}
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                          <h4 className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider">
                            Itens
                          </h4>
                          <div className="space-y-2">
                            {order.order_items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-xs text-stone-600"
                              >
                                <span className="truncate mr-2">
                                  {item.products?.name ?? "Produto"}{" "}
                                  {item.size && (
                                    <span className="text-stone-400">({item.size})</span>
                                  )}{" "}
                                  ×{item.quantity}
                                </span>
                                <span className="font-medium shrink-0">
                                  {formatCurrency(item.unit_price * item.quantity)}
                                </span>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-medium text-obsidian">
                              <span>Total</span>
                              <span>{formatCurrency(order.total_amount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Actions */}
                      <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-sans text-xs text-stone-400 mr-2">
                            Alterar status:
                          </span>
                          {["paid", "processing", "shipped", "delivered", "cancelled"].map(
                            (s) =>
                              s !== order.status && (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(order.id, s)}
                                  disabled={isLoading}
                                  className={`px-2.5 py-1 text-[10px] font-medium border transition-all hover:opacity-80 disabled:opacity-40 ${
                                    STATUS_CONFIG[s]?.bgColor ?? "bg-stone-100 border-stone-200"
                                  } ${STATUS_CONFIG[s]?.color ?? "text-stone-600"}`}
                                >
                                  {STATUS_CONFIG[s]?.label ?? s}
                                </button>
                              )
                          )}
                        </div>
                        {/* Botão excluir */}
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              id: order.id,
                              name: order.customer_name ?? `#${order.id.slice(0, 8)}`,
                            })
                          }
                          disabled={isLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium hover:bg-red-100 disabled:opacity-40 transition-all ml-auto"
                        >
                          <Trash2 size={11} />
                          Excluir pedido
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* ── Modal de confirmação de exclusão ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          {/* Modal */}
          <div className="relative bg-white border border-stone-200 shadow-xl w-full max-w-md p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="shrink-0 w-10 h-10 bg-red-50 border border-red-200 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-normal text-obsidian tracking-tight mb-1">
                  Excluir pedido permanentemente?
                </h3>
                <p className="font-sans text-xs text-stone-500 leading-relaxed">
                  O pedido de{" "}
                  <strong className="text-obsidian">{deleteConfirm.name}</strong>{" "}
                  (<span className="font-mono">#{deleteConfirm.id.slice(0, 8)}</span>) será
                  removido do banco de dados. Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 border border-stone-200 text-stone-600 font-sans text-xs font-semibold tracking-wide hover:border-stone-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteOrder(deleteConfirm.id)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-sans text-xs font-semibold tracking-wide hover:bg-red-700 transition-colors"
              >
                <Trash2 size={12} />
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
