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
  const hasImages = isFilled.group(slice.items);

  gsap.registerPlugin(ScrollTrigger);

  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  // 1. REF BARU UNTUK SCROLL BAR
  const progressBarRef = useRef(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current as HTMLElement | null;
    const track = trackRef.current as HTMLElement | null;
    const progressBar = progressBarRef.current as HTMLElement | null;

    // Pastikan progressBar juga ada sebelum jalan
    if (!hasImages || !track || !wrapper || !sectionRef.current || !progressBar) return;

    const scrollableWidth = track.scrollWidth - wrapper.offsetWidth;

    if (scrollableWidth <= 0) return;

    let ctx = gsap.context(() => {
      // KITA GANTI JADI TIMELINE
      // Biar bisa jalanin 2 animasi sekaligus (Geser Gambar + Progress Bar)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 1,
          start: "center center", // Mulai pas di tengah layar
          end: () => `+=${scrollableWidth}`,
        }
      });

      // Animasi 1: Geser Track (Gambar) ke Kiri
      tl.to(track, {
        x: () => -scrollableWidth + "px",
        ease: "none",
      }, 0); // <--- Angka 0 artinya mulai di detik ke-0

      // Animasi 2: Panjangin Progress Bar (ScaleX 0 -> 1)
      tl.to(progressBar, {
        scaleX: 1, // Jadi full width
        ease: "none",
      }, 0); // <--- Angka 0 artinya mulai barengan sama animasi track

    }, sectionRef);

    return () => ctx.revert();
  }, [hasImages]);

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-6 md:py-8"
    >
      {/* JUDUL & DESKRIPSI */}
      <div className="max-w-prose mb-4"> 
        {isFilled.richText(slice.primary.title) && (
          <PrismicRichText field={slice.primary.title} />
        )}
        {isFilled.richText(slice.primary.description) && (
          <PrismicRichText field={slice.primary.description} />
        )}
      </div>

      {/* CAROUSEL WRAPPER */}
      {hasImages && (
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
                <PrismicNextImage
                  field={item.carousel_image}
                  className="h-[400px] w-auto rounded-lg"
                  imgixParams={{ h: 400 }}
                />
              </li>
            ))}
          </ul>

          {/* 2. SCROLL BAR UI */}
          {/* Container abu-abu (jalurnya) */}
          <div className="w-full h-[2px] bg-slate-200 mt-8 overflow-hidden rounded-full">
            {/* Indikator hitam (yang gerak) */}
            <div 
              ref={progressBarRef}
              className="h-full bg-slate-800 origin-left scale-x-0" // Mulai dari scale 0 (kosong)
            />
          </div>

        </div>
      )}
    </section>
  );
};

export default ImageCarousel;