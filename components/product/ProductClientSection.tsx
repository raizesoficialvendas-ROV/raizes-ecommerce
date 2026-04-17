"use client";

import { useState, useMemo, useEffect } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import type { Product, ColorEntry } from "@/types/database.types";
import { useMetaPixel } from "@/hooks/useMetaPixel";

interface ProductClientSectionProps {
  product: Product;
  allImages: string[];
  categoryName?: string;
  reviewAvg?: number;
  reviewCount?: number;
}

export default function ProductClientSection({
  product,
  allImages,
  categoryName,
  reviewAvg,
  reviewCount,
}: ProductClientSectionProps) {
  const { trackViewContent } = useMetaPixel();
  const meta = product.metadata as Record<string, unknown> | null;
  const colors = useMemo<ColorEntry[]>(() => {
    if (meta?.colors && Array.isArray(meta.colors)) {
      return meta.colors as ColorEntry[];
    }
    return [];
  }, [meta]);

  // Dispara ViewContent ao montar (visita de produto)
  useEffect(() => {
    trackViewContent(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Pre-select first color if any colors exist
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(
    colors.length > 0 ? 0 : null
  );

  // Derive filtered images based on selected color
  const galleryImages = useMemo<string[]>(() => {
    if (
      selectedColorIdx === null ||
      colors.length === 0 ||
      !colors[selectedColorIdx] ||
      colors[selectedColorIdx].imageIndexes.length === 0
    ) {
      return allImages;
    }
    const filtered = colors[selectedColorIdx].imageIndexes
      .filter((i) => i < allImages.length)
      .map((i) => allImages[i]);
    return filtered.length > 0 ? filtered : allImages;
  }, [selectedColorIdx, colors, allImages]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-10 md:gap-12 lg:gap-16">
      {/* Galeria — imagens filtradas pela cor selecionada */}
      <ProductGallery images={galleryImages} productName={product.name} />

      {/* Info — sticky no desktop */}
      <div className="md:sticky md:top-[92px] md:self-start">
        <ProductInfo
          product={product}
          categoryName={categoryName}
          colors={colors.length > 0 ? colors : undefined}
          selectedColorIdx={selectedColorIdx}
          onColorChange={setSelectedColorIdx}
          reviewAvg={reviewAvg}
          reviewCount={reviewCount}
        />
      </div>
    </div>
  );
}
