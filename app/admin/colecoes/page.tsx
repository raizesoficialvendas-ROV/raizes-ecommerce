import { getAdminCollections } from "@/lib/actions/collections";
import CollectionManager from "@/components/admin/CollectionManager";
import type { Metadata } from "next";
import type { Category } from "@/types/database.types";

export const metadata: Metadata = { title: "Coleções" };

export default async function AdminColecoesPage() {
  const categories = (await getAdminCollections()) as Category[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-normal text-obsidian tracking-tight">Coleções</h1>
        <p className="font-sans text-sm text-stone-500 mt-1">
          Crie e gerencie as coleções que organizam os produtos e alimentam os menus do site.
        </p>
      </div>

      <div className="max-w-2xl">
        <CollectionManager initialCategories={categories} />
      </div>
    </div>
  );
}
