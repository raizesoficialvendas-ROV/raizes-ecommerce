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
import ProductRelated from "@/components/product/ProductRelated";

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
            reviewAvg={reviewStats.total > 0 ? reviewStats.average : undefined}
            reviewCount={reviewStats.total > 0 ? reviewStats.total : undefined}
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
        <ProductRelated related={related} />
      </main>
      <Footer />
    </>
  );
}
