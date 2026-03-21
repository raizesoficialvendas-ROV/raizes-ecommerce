import { getAllOrders } from "@/lib/actions/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pedidos" };

export default async function AdminPedidosPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-normal text-obsidian tracking-tight">
          Gestão de Vendas
        </h1>
        <p className="font-sans text-sm text-stone-500 mt-1">
          Gerencie pedidos, cole códigos de rastreio e atualize status em 1 clique.
        </p>
      </div>

      <AdminOrdersClient
        initialOrders={JSON.parse(JSON.stringify(orders ?? []))}
      />
    </div>
  );
}
