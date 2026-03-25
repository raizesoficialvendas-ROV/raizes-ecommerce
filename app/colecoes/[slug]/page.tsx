import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getCollectionBySlug,
  getCollectionProducts,
} from "@/lib/queries/collections";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Coleção não encontrada" };

  return {
    title: collection.name,
    description:
      collection.description ??
      `Explore a coleção ${collection.name} da Raízes.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) notFound();

  const products = await getCollectionProducts(collection.id);

  const coverImage =
    collection.image_url ??
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=85&fit=crop";

  return (
    <>
      <Navbar />
      {/* -mt-[72px] cancela o espaçador da Navbar para que o Hero da coleção
           seja full-bleed (efeito cinematográfico intencional). */}
      <main className="-mt-[72px]">
        {/* ── Hero da coleção ── */}
        <section className="relative w-full h-[50vh] min-h-[360px] md:h-[60vh] overflow-hidden bg-obsidian">
          <Image
            src={coverImage}
            alt={collection.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/30 to-obsidian/20" />

          <div className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-16">
            <div className="raizes-container">
              <Link
                href="/colecoes"
                className="inline-flex items-center gap-2 font-sans text-xs font-medium tracking-widest uppercase text-ivory/50 hover:text-ivory transition-colors mb-6"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
                Todas as coleções
              </Link>

              <h1
                className="font-serif text-ivory font-normal tracking-tighter leading-[1.08] mb-3"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
              >
                {collection.name}
              </h1>

              {collection.description && (
                <p className="font-sans text-ivory/60 text-base md:text-lg font-light leading-relaxed max-w-lg">
                  {collection.description}
                </p>
              )}

              <p className="font-sans text-[11px] font-medium tracking-widest uppercase text-ivory/40 mt-4">
                {products.length}{" "}
                {products.length === 1 ? "peça" : "peças"}
              </p>
            </div>
          </div>
        </section>

        {/* ── Grid de produtos ── */}
        <section className="py-16 md:py-24 bg-ivory">
          <div className="raizes-container">
            {products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-sans text-sm text-stone-400">
                  Em breve, novas peças serão adicionadas a esta coleção.
                </p>
                <Link
                  href="/colecoes"
                  className="btn-primary inline-flex items-center gap-2 mt-6"
                >
                  Explorar outras coleções
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => {
                  const mainImage =
                    product.images_urls && product.images_urls.length > 0
                      ? product.images_urls[0]
                      : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&fit=crop";

                  const hoverImage =
                    product.images_urls && product.images_urls.length > 1
                      ? product.images_urls[1]
                      : mainImage;

                  const meta = product.metadata as Record<string, unknown> | null;
                  const tech = meta?.tech ? String(meta.tech) : null;
                  const material = meta?.material
                    ? String(meta.material)
                    : null;

                  return (
                    <Link
                      key={product.id}
                      href={`/produtos/${product.id}`}
                      className="group block"
                    >
                      {/* Imagem */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-3">
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-all duration-500 group-hover:opacity-0"
                        />
                        <Image
                          src={hoverImage}
                          alt={`${product.name} — alternativa`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover opacity-0 transition-all duration-500 group-hover:opacity-100"
                        />

                        {/* Badge tech */}
                        {tech && (
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-obsidian/90 backdrop-blur-sm px-2.5 py-1.5">
                            <span className="font-sans text-[9px] font-semibold tracking-widest uppercase text-ivory">
                              {tech}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className="font-sans text-sm font-medium text-obsidian tracking-tight mb-1 group-hover:text-stone-500 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="font-sans text-sm text-obsidian">
                          {formatCurrency(product.price)}
                        </p>
                        {material && (
                          <p className="font-sans text-[10px] tracking-wider uppercase text-stone-400">
                            {material}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
