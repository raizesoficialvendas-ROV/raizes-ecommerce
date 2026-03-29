import { getAllReviews } from "@/lib/actions/reviews";
import ReviewsManager from "@/components/admin/ReviewsManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avaliações — Admin Raízes",
};

export default async function AdminAvaliacoesPage() {
  const reviews = await getAllReviews();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-normal text-obsidian tracking-tight">
          Avaliações
        </h1>
        <p className="font-sans text-sm text-stone-500 mt-1">
          Gerencie, aprove e edite as avaliações enviadas pelos clientes.
        </p>
      </div>

      {/* Manager */}
      <ReviewsManager
        initialReviews={JSON.parse(JSON.stringify(reviews))}
      />
    </div>
  );
}
