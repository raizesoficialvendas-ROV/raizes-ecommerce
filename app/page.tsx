import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CollectionSection from "@/components/home/CollectionSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import ValueProposition from "@/components/home/ValueProposition";
import FaqSection from "@/components/home/FaqSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getCollectionsForHome } from "@/lib/queries/collections";
import { getActiveBanner } from "@/lib/actions/banners";

export default async function Home() {
  const collections = await getCollectionsForHome();
  const heroBanner = await getActiveBanner("hero");
  const manifestoBanner = await getActiveBanner("manifesto");

  return (
    <>
      <Navbar transparent />
      <main>
        <HeroSection banner={heroBanner} />
        {collections.map((col, index) => (
          <CollectionSection
            key={col.id}
            collection={col}
            products={col.products}
            sectionIndex={index}
          />
        ))}
        <ManifestoSection banner={manifestoBanner} />
        <ValueProposition />
        <FaqSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
