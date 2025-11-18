// File: src/slices/ImageCarousel/index.tsx

"use client";

import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

export type ImageCarouselProps =
  SliceComponentProps<Content.ImageCarouselSlice>;

const ImageCarousel = ({ slice }: ImageCarouselProps): JSX.Element => {
  // SAFETY CHECK: Pake optional chaining (?.) biar aman
  const items = slice.items || [];
  const hasImages = items.length > 0;

  // Kalau ga ada gambar, render section kosong biar ga error
  if (!hasImages) {
    return <section data-slice-type={slice.slice_type} />;
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-6 md:py-8"
    >
      {/* JUDUL & DESKRIPSI */}
      <div className="max-w-prose mb-4">
        {slice.primary && isFilled.richText(slice.primary.title) && (
          <PrismicRichText field={slice.primary.title} />
        )}
        {slice.primary && isFilled.richText(slice.primary.description) && (
          <PrismicRichText field={slice.primary.description} />
        )}
      </div>

      {/* CAROUSEL STATIC (Tanpa Animasi Dulu) */}
      <div className="overflow-x-auto pb-4"> {/* overflow-x-auto biar bisa discroll manual */}
        <ul className="flex items-center gap-8 w-max list-none">
          {items.map((item, index) => (
            <li key={index} className="relative flex-shrink-0">
              {isFilled.image(item.carousel_image) && (
                <PrismicNextImage
                  field={item.carousel_image}
                  className="h-[400px] w-auto rounded-lg"
                  imgixParams={{ h: 400 }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="text-center text-sm text-slate-400 mt-2">
        (Mode Debug: Animasi Dimatikan Sementara)
      </div>
    </section>
  );
};

export default ImageCarousel;