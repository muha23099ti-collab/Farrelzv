"use client";
import { useEffect, useRef } from "react";
import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Shapes } from "@/slices/Hero/Shapes";
import Bounded from "@/components/Bounded";
import gsap from "gsap";
import { usePreloaderState } from "@/providers/PreloaderProvider";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  const component = useRef(null);
  const { isLoaded } = usePreloaderState();

  useEffect(() => {
    // Jalankan animasi hanya ketika preloader sudah benar-benar selesai
    if (isLoaded) {
      let ctx = gsap.context(() => {
        // Buat timeline animasi agar lebih terstruktur
        gsap
          .timeline()
          .fromTo(
            ".hero-content", // Targetkan pembungkus konten teks
            { opacity: 0, y: 40 }, // Mulai dari transparan dan sedikit di bawah
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
            },
          )
          .fromTo(
            ".shapes-container", // Targetkan pembungkus 3D shapes
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
            },
            "-=0.8", // Mulai animasi ini 0.8 detik sebelum animasi sebelumnya selesai
          );
      }, component);
      return () => ctx.revert(); // cleanup!
    }
  }, [isLoaded]);

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
      // PERBAIKAN UTAMA:
      // Tambahkan kelas opacity-0 jika preloader BELUM selesai.
      // Ini memastikan komponen Hero tidak terlihat saat tirai terbuka.
      // GSAP akan mengambil alih properti opacity saat animasi dimulai.
      className={!isLoaded ? "opacity-0" : ""}
    >
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        {/* Kontainer untuk Teks */}
        <div className="hero-content"> {/* Kelas untuk target animasi */}
          <h1
            className="mb-8 text-[clamp(3rem,20vmin,20rem)] font-extrabold leading-none tracking-tighter"
            aria-label={
              slice.primary.first_name + " " + slice.primary.last_name
            }
          >
            <span className="block text-slate-300 ">
              {slice.primary.first_name}
            </span>
            <span className="-mt-[.2em] block text-slate-500  ">
              {slice.primary.last_name}
            </span>
          </h1>
          <span className="job-title block bg-gradient-to-tr from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-2xl font-bold uppercase tracking-[.2em] text-transparent md:text-4xl">
            {slice.primary.tag_line}
          </span>
        </div>

        {/* Tambahkan kelas "shapes-container" untuk target animasi */}
        <div className="shapes-container mt-16 w-full h-64 md:h-96">
          <Shapes />
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;