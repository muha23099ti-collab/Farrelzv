// File: src/slices/ImageCarousel/index.tsx

"use client";

import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

export type ImageCarouselProps =
  SliceComponentProps<Content.ImageCarouselSlice>;

const ImageCarousel = ({ slice }: ImageCarouselProps): JSX.Element => {
  const hasImages = slice.items?.length > 0;

  // State simpan Data Gambar + Index + Rasio (PENTING BUAT ANIMASI)
  const [selectedImage, setSelectedImage] = useState<{
    data: any;
    index: number;
    aspectRatio: number;
  } | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);

  // --- LOGIC GSAP (SCROLL) ---
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current as HTMLElement | null;
    const track = trackRef.current as HTMLElement | null;
    const progressBar = progressBarRef.current as HTMLElement | null;

    if (!hasImages || !track || !wrapper || !sectionRef.current || !progressBar) return;

    const scrollableWidth = track.scrollWidth - wrapper.offsetWidth;

    if (scrollableWidth <= 0) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 1,
          start: "center center",
          end: () => `+=${scrollableWidth}`,
          invalidateOnRefresh: true,
        }
      });

      tl.to(track, {
        x: () => -scrollableWidth + "px",
        ease: "none",
      }, 0);

      tl.to(progressBar, {
        scaleX: 1,
        ease: "none",
      }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, [hasImages]);

  // Fungsi Buka Lightbox
  const handleImageClick = (imageField: any, index: number) => {
    if (!imageField) return;

    // Hitung Aspect Ratio dari data Prismic (biar animasi tau ukuran target)
    let aspectRatio = 1; // Default square
    if (imageField.dimensions) {
      aspectRatio = imageField.dimensions.width / imageField.dimensions.height;
    }

    setSelectedImage({ data: imageField, index, aspectRatio });
    document.body.style.overflow = "hidden"; // Kunci scroll body
  };

  // Fungsi Tutup Lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // Lepas scroll body
  };

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
        {slice.primary && isFilled.richText(slice.primary.title) && (
          <PrismicRichText field={slice.primary.title} />
        )}
        {slice.primary && isFilled.richText(slice.primary.description) && (
          <PrismicRichText field={slice.primary.description} />
        )}
      </div>

      {/* CAROUSEL WRAPPER */}
      <div ref={wrapperRef} className="overflow-x-hidden relative">
        <ul
          ref={trackRef}
          className="flex items-center gap-8 w-max list-none p-2"
        >
          {slice.items.map((item, index) => (
            <li
              key={index}
              className="relative flex-shrink-0 group cursor-zoom-in z-10"
              onClick={() => handleImageClick(item.carousel_image, index)}
            >
              {/* WRAPPER ANIMASI THUMBNAIL */}
              {/* WRAPPER ANIMASI THUMBNAIL */}
              {/* Kita pisah motion.div dari li biar layoutId nempel ketat sama gambar */}
              <motion.div
                 layoutId={`image-expand-${index}`}
                 className="rounded-lg overflow-hidden"
                 whileHover={{ scale: 1.02 }}
                 transition={{ duration: 0.3 }}
              >
                {isFilled.image(item.carousel_image) && (
                  <div className="pointer-events-none"> 
                    <PrismicNextImage
                      field={item.carousel_image}
                      className="h-[400px] w-auto object-cover"
                      imgixParams={{ h: 400 }}
                    />
                  </div>
                )}
              </motion.div>
            </li>
          ))}
        </ul>

        {/* Progress Bar */}
        <div className="w-full h-[2px] bg-slate-200 mt-8 overflow-hidden rounded-full">
          <div 
            ref={progressBarRef}
            className="h-full bg-slate-800 origin-left scale-x-0"
          />
        </div>
      </div>

      {/* LIGHTBOX MODAL (PORTAL) */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedImage && (
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center"
            >
              {/* 1. BACKGROUND DIMMING (Terpisah biar opacity-nya smooth) */}
              <motion.div 
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }} // Sedikit lebih lambat biar dramatis
                onClick={closeLightbox}
              />

              {/* Tombol Close */}
              <button 
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50"
                onClick={closeLightbox}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* 2. CONTAINER GAMBAR FULL */}
              {/* 'pointer-events-none' di container biar klik nembus ke background untuk close */}
              <div 
                className="relative w-full h-full p-4 md:p-10 flex items-center justify-center pointer-events-none"
              >
                 {/* 3. ANIMATED IMAGE WRAPPER */}
                 <motion.div
                    layoutId={`image-expand-${selectedImage.index}`}
                    
                    // Settings Transisi "Magic Motion"
                    transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                        mass: 0.5
                    }}
                    
                    // KUNCI SMOOTH: Paksa aspect ratio kotak ini SAMA dengan gambar aslinya
                    // Jadi Framer Motion tau bentuk akhirnya sebelum gambar load
                    style={{ 
                      aspectRatio: selectedImage.aspectRatio,
                    }}
                    
                    className="relative w-auto h-auto max-w-full max-h-full rounded-md overflow-hidden shadow-2xl cursor-default pointer-events-auto bg-slate-800"
                    onClick={(e) => e.stopPropagation()}
                 >
                    <PrismicNextImage 
                        field={selectedImage.data} 
                        className="object-contain w-full h-full"
                        // Kita load gambar High Res (1600px)
                        // Priority true biar Next.js load secepat kilat
                        priority 
                        imgixParams={{ w: 1600 }} 
                    />
                 </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default ImageCarousel;