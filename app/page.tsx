import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CollectionSection from "@/components/home/CollectionSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import ValueProposition from "@/components/home/ValueProposition";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getCollectionsForHome } from "@/lib/queries/collections";

export default async function Home() {
  const collections = await getCollectionsForHome();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        {collections.map((col) => (
          <CollectionSection
            key={col.id}
            collection={col}
            products={col.products}
          />
        ))}
        <ManifestoSection />
        <ValueProposition />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
