import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductDetails from "@/components/product/ProductDetails";
import { getProductById, getPublishedProducts } from "@/lib/queries/products";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/database.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return { title: "Produto não encontrado" };

  return {
    title: product.name,
    description: product.description ?? `Conheça ${product.name} da coleção Raízes.`,
    openGraph: {
      images: product.images_urls?.[0] ? [product.images_urls[0]] : [],
    },
  };
}

export const dynamic = 'force-dynamic';     // sempre renderiza dinamicamente (cookies() requer request context)

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const images = product.images_urls ?? [];
  const meta = product.metadata as Record<string, string> | null;
  const categoryName = (product as Product & { categories?: { name: string } | null })
    ?.categories?.name;

  // Produtos relacionados (mesma categoria, excluindo o atual)
  let related: Product[] = [];
  try {
    const all = await getPublishedProducts({ limit: 5 });
    related = all.filter((p) => p.id !== product.id).slice(0, 4);
  } catch {
    related = [];
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">

        {/* ── Layout principal: Galeria + Info ── */}
        <section className="raizes-container py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24">

            {/* Galeria */}
            <ProductGallery images={images} productName={product.name} />

            {/* Info — sticky no desktop */}
            <div className="md:sticky md:top-[92px] md:self-start">
              <ProductInfo
                product={product}
                categoryName={categoryName}
              />
            </div>
          </div>

          {/* Detalhes abaixo do fold */}
          <ProductDetails product={product} />
        </section>

        {/* ── Produtos relacionados ── */}
        {related.length > 0 && (
          <section className="border-t border-stone-200 py-16 md:py-24">
            <div className="raizes-container">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="label-category text-stone-400 mb-2">Você também pode gostar</p>
                  <h2 className="font-serif text-3xl font-normal tracking-tighter text-obsidian">
                    Relacionados
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((rel) => {
                  const img = rel.images_urls?.[0] ??
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&fit=crop";
                  return (
                    <a key={rel.id} href={`/produtos/${rel.id}`} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={rel.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="font-sans text-sm font-medium text-obsidian group-hover:text-stone-500 transition-colors">
                        {rel.name}
                      </p>
                      <p className="font-sans text-sm text-stone-400 mt-0.5">
                        {formatCurrency(rel.price)}
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
