import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllCollections } from "@/lib/queries/collections";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Coleções" };

export default async function ColecoesPage() {
  const collections = await getAllCollections();

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="raizes-container py-16 md:py-24">
          <p className="label-category text-stone-400 mb-4">Explore</p>
          <h1 className="font-serif text-5xl md:text-6xl font-normal tracking-tighter text-obsidian mb-6">
            Coleções
          </h1>
          <p className="font-sans text-base text-stone-400 leading-relaxed max-w-xl mb-16">
            Cada coleção foi pensada para um momento da sua jornada.
            Peças que unem propósito, funcionalidade e design atemporal.
          </p>

          {collections.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-sans text-sm text-stone-400">
                Em breve, novas coleções estarão disponíveis.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {collections.map((col, idx) => {
                const coverImage =
                  col.image_url ??
                  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80&fit=crop";

                return (
                  <Link
                    key={col.id}
                    href={`/colecoes/${col.slug}`}
                    className="group relative block overflow-hidden bg-stone-100"
                  >
                    {/* Imagem de capa */}
                    <div
                      className={[
                        "relative overflow-hidden",
                        idx === 0 ? "aspect-[4/5] md:aspect-[16/10]" : "aspect-[4/5] md:aspect-[4/3]",
                      ].join(" ")}
                    >
                      <Image
                        src={coverImage}
                        alt={col.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={idx < 2}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/20 to-transparent" />
                    </div>

                    {/* Conteúdo sobre a imagem */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                      <div>
                        <p className="font-sans text-[10px] font-medium tracking-widest uppercase text-ivory/60 mb-2">
                          {col.product_count}{" "}
                          {col.product_count === 1 ? "peça" : "peças"}
                        </p>
                        <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-tighter text-ivory mb-2">
                          {col.name}
                        </h2>
                        {col.description && (
                          <p className="font-sans text-sm text-ivory/60 leading-relaxed max-w-sm mb-4">
                            {col.description}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-2 font-sans text-xs font-medium tracking-widest uppercase text-ivory/80 group-hover:text-ivory transition-colors">
                          Explorar coleção
                          <ArrowRight
                            size={13}
                            strokeWidth={1.5}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
