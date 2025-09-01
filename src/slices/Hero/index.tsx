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
    if (isLoaded) {
      let ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // PERUBAHAN: Animasi untuk teks dan job title
        tl.fromTo(
          ".hero-content",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9, // Durasi lebih cepat untuk teks
            ease: "power3.out",
          },
        );

        // PERUBAHAN: Animasi untuk puzzle (Shapes)
        tl.fromTo(
          ".shapes-container",
          { opacity: 0, y: 60 }, // Mulai sedikit lebih bawah
          {
            opacity: 1,
            y: 0,
            duration: 1.5, // Durasi lebih lambat agar terasa lebih smooth
            ease: "power3.out",
          },
          "-=0.6", // Mulai animasi ini 0.6 detik sebelum animasi teks selesai
        );
      }, component);
      return () => ctx.revert();
    }
  }, [isLoaded]);

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
      className={!isLoaded ? "opacity-0" : ""}
    >
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="hero-content">
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

        <div className="shapes-container mt-16 w-full h-64 md:h-96">
          <Shapes />
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;