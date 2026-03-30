import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CollectionSection from "@/components/home/CollectionSection";
import ManifestoScrollSection from "@/components/home/ManifestoScrollSection";
import ValueProposition from "@/components/home/ValueProposition";
import FaqSection from "@/components/home/FaqSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getCollectionsForHome } from "@/lib/queries/collections";
import { getActiveBanner } from "@/lib/actions/banners";
import { getProductsReviewStats } from "@/lib/queries/reviews";

export default async function Home() {
  const collections = await getCollectionsForHome();
  const heroBanner = await getActiveBanner("hero");

  // IDs de todos os produtos da homepage para buscar stats em lote
  const allProductIds = collections.flatMap((c) => c.products.map((p) => p.id));
  const reviewStats = await getProductsReviewStats(allProductIds);

  return (
    <>
      <Navbar transparent />
      <main>
        <HeroSection banner={heroBanner} />
        <div id="produtos">
          {collections.map((col, index) => (
            <CollectionSection
              key={col.id}
              collection={col}
              products={col.products}
              sectionIndex={index}
              reviewStats={reviewStats}
            />
          ))}
        </div>
        <ManifestoScrollSection />
        <ValueProposition />
        <FaqSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
