// File: src/slices/ImageCarousel/index.tsx

"use client";

import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type ImageCarouselProps =
  SliceComponentProps<Content.ImageCarouselSlice>;

const ImageCarousel = ({ slice }: ImageCarouselProps): JSX.Element => {
  // FIX 1: Pake Optional Chaining (?.) biar ga crash kalau items undefined
  const hasImages = slice.items?.length > 0;

  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);

  useLayoutEffect(() => {
    // FIX 2: Register Plugin DI DALAM useLayoutEffect
    // Biar dia cuma jalan di Browser, bukan di Server (SSR)
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current as HTMLElement | null;
    const track = trackRef.current as HTMLElement | null;
    const progressBar = progressBarRef.current as HTMLElement | null;

    // Cek elemen lengkap
    if (!hasImages || !track || !wrapper || !sectionRef.current || !progressBar) return;

    // Hitung lebar scroll
    const scrollableWidth = track.scrollWidth - wrapper.offsetWidth;

    // Kalau ga perlu scroll, stop
    if (scrollableWidth <= 0) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 1,
          start: "center center",
          end: () => `+=${scrollableWidth}`,
          invalidateOnRefresh: true, // Tambahan biar aman pas resize
        }
      });

      // Animasi Geser Gambar
      tl.to(track, {
        x: () => -scrollableWidth + "px",
        ease: "none",
      }, 0);

      // Animasi Progress Bar
      tl.to(progressBar, {
        scaleX: 1,
        ease: "none",
      }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, [hasImages]);

  // Jika tidak ada gambar, render section kosong atau return null biar aman
  if (!hasImages) return <section data-slice-type={slice.slice_type} />;

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-6 md:py-8"
    >
      {/* JUDUL & DESKRIPSI */}
      <div className="max-w-prose mb-4"> 
        {/* FIX 3: Tambahin pengecekan slice.primary sebelum akses title/desc */}
        {slice.primary && isFilled.richText(slice.primary.title) && (
          <PrismicRichText field={slice.primary.title} />
        )}
        {slice.primary && isFilled.richText(slice.primary.description) && (
          <PrismicRichText field={slice.primary.description} />
        )}
      </div>

      {/* CAROUSEL WRAPPER */}
      <div ref={wrapperRef} className="overflow-x-hidden relative">
        {/* TRACK GAMBAR */}
        <ul
          ref={trackRef}
          className="flex items-center gap-8 w-max list-none"
        >
          {slice.items.map((item, index) => (
            <li
              key={index}
              className="relative flex-shrink-0"
            >
              {/* Cek field gambar ada isinya ga */}
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

        {/* SCROLL BAR UI */}
        <div className="w-full h-[2px] bg-slate-200 mt-8 overflow-hidden rounded-full">
          <div 
            ref={progressBarRef}
            className="h-full bg-slate-800 origin-left scale-x-0"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;