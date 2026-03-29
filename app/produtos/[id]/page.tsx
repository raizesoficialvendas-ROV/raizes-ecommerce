import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductClientSection from "@/components/product/ProductClientSection";
import ProductShowcase from "@/components/product/ProductShowcase";
import type { ShowcaseImage } from "@/components/product/ProductShowcase";
import ProductReviews from "@/components/product/ProductReviews";
import { getProductById, getPublishedProducts } from "@/lib/queries/products";
import { getProductReviews, computeReviewStats } from "@/lib/queries/reviews";
import { getActiveBanner } from "@/lib/actions/banners";
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

  // Banners editoriais (showcase) + reviews em paralelo
  const [s1, s2, s3, s4, reviews] = await Promise.all([
    getActiveBanner("showcase_1"),
    getActiveBanner("showcase_2"),
    getActiveBanner("showcase_3"),
    getActiveBanner("showcase_4"),
    getProductReviews(id),
  ]);
  const reviewStats = computeReviewStats(reviews);
  const showcaseImages: ShowcaseImage[] = [s1, s2, s3, s4].map((b) => ({
    desktop: b?.image_desktop_url ?? null,
    mobile: b?.image_mobile_url ?? null,
  }));

  return (
    <>
      <Navbar />
      <main>

        {/* ── Layout principal: Galeria + Info ── */}
        <section className="raizes-container pt-10 pb-16 md:py-16">
          <ProductClientSection
            product={product}
            allImages={images}
            categoryName={categoryName}
          />
        </section>

        {/* ── Apresentação editorial ── */}
        <ProductShowcase images={images} showcaseImages={showcaseImages} />

        {/* ── Avaliações ── */}
        <section className="raizes-container py-4 md:py-8">
          <ProductReviews
            productId={product.id}
            productName={product.name}
            reviews={reviews}
            stats={reviewStats}
          />
        </section>

        {/* ── Produtos relacionados ── */}
        {related.length > 0 && (
          <section className="section-rhythm bg-stone-50">
            <div className="raizes-container">

              {/* Header */}
              <div className="flex items-end justify-between mb-14 md:mb-16">
                <div>
                  <p className="label-category text-stone-400 mb-4">Você também pode gostar</p>
                  <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tighter text-obsidian leading-tight">
                    Relacionados
                  </h2>
                </div>
                <a
                  href="/colecoes"
                  className="hidden md:inline-flex items-center gap-2 font-sans text-xs font-medium tracking-widest uppercase text-stone-400 hover:text-obsidian transition-colors duration-300"
                >
                  Ver tudo
                </a>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {related.map((rel) => {
                  const img = rel.images_urls?.[0] ??
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&fit=crop";
                  return (
                    <a key={rel.id} href={`/produtos/${rel.id}`} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={rel.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <p className="font-sans text-sm text-obsidian group-hover:text-stone-500 transition-colors duration-300 leading-snug mb-1">
                        {rel.name}
                      </p>
                      <p className="font-sans text-sm text-stone-400">
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
