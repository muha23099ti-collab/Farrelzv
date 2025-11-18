// File: src/slices/TextBlock/index.tsx

import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next"; // <-- TAMBAHAN IMPORT
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Button from "@/components/Button";

/**
 * Props for `TextBlock`.
 */
export type TextBlockProps = SliceComponentProps<Content.TextBlockSlice>;

/**
 * Component for "TextBlock" Slices.
 */
const TextBlock = ({ slice }: TextBlockProps): JSX.Element => {
  // Cek apakah ada gambar di repeatable zone (items)
  const hasCarouselImages = isFilled.group(slice.items);

  // Duplikat array gambar untuk efek loop 'infinite'
  // Hanya jika 'items' (grup gambar) diisi di Prismic
  const images = hasCarouselImages ? [...slice.items, ...slice.items] : [];

  return (
    <div className="max-w-none" data-slice-type={slice.slice_type}>
      
      {/* 1. Render Teks Utama (dibuat 'prose' biar rapi) */}
      {isFilled.richText(slice.primary.text) && (
        <div className="max-w-prose">
          <PrismicRichText field={slice.primary.text} />
        </div>
      )}

      {/* 2. Render Image Carousel (HANYA JIKA ADA GAMBAR) */}
      {hasCarouselImages && (
        <div
          className="w-full inline-flex flex-nowrap overflow-hidden mt-8" // Beri jarak atas
          style={{
            // Efek 'fade' di tepi kiri dan kanan
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          {/* List ini yang dianimasikan pakai 'animate-infinite-scroll' dari tailwind.config.ts */}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-infinite-scroll">
            {images.map((item, index) => (
              <li
                key={index}
                // REVISI 2: Ukuran 3x lebih kecil. 
                // Asumsi 1080px -> 360px. Kita set lebar fix 360px.
                className="relative w-[360px] flex-shrink-0"
              >
                <PrismicNextImage
                  // Pastikan API ID di Slice Machine adalah 'carousel_image'
                  field={item.carousel_image} 
                  className="w-full h-auto object-cover rounded-lg aspect-[9/16]" // Aspek rasio dari contoh kamu (1080x1920)
                  imgixParams={{
                    w: 360, // Lebar gambar 360px
                    ar: "9:16", // Paksa aspek rasio 9:16 (vertical)
                    fit: "crop",
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Render Button (Tetap ada di paling bawah) */}
      {isFilled.link(slice.primary.button_link) &&
        slice.primary.button_text && (
          <div className="mt-8 flex justify-start">
            <Button
              linkField={slice.primary.button_link}
              label={slice.primary.button_text}
              className="font-semibold text-slate-900 text-sm py-3 px-4"
              showIcon={false}
            />
          </div>
        )}
    </div>
  );
};

export default TextBlock;