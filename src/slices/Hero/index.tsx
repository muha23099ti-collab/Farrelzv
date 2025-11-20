"use client";

import { useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import gsap from "gsap";
import { Shapes } from "@/slices/Hero/Shapes";
import { usePreloaderState } from "@/providers/PreloaderProvider";
import TextPressure from "@/components/TextPressure";

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

        tl.fromTo(
          ".hero-content",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
        );

        tl.fromTo(
          ".shapes-container",
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power3.out",
          },
          "-=0.6",
        );
      }, component);
      return () => ctx.revert();
    }
  }, [isLoaded]);

  const fullName = `${slice.primary.first_name || ""} ${slice.primary.last_name || ""}`.trim();

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
      className={!isLoaded ? "opacity-0" : ""}
    >
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="hero-content w-full max-w-full"> {/* Tambahkan w-full max-w-full di sini juga untuk keamanan */}
          
          {/* PERBAIKAN DISINI: Tambahkan w-full, max-w-full, dan overflow-hidden */}
          <div
            className="mb-8 w-full max-w-full overflow-hidden text-[clamp(3rem,20vmin,20rem)] font-extrabold leading-none tracking-tighter"
            aria-label={slice.primary.first_name + " " + slice.primary.last_name}
          >
            <TextPressure
              text={fullName}
              textColor="#cbd5e1"
              stroke={true}
              strokeColor="#64748b"
            />
          </div>

          <span className="job-title block bg-gradient-to-tr from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-2xl font-bold uppercase tracking-[.2em] text-transparent md:text-4xl">
            {slice.primary.tag_line}
          </span>
        </div>

        <div className="shapes-container mt-16 h-64 w-full md:h-96">
          <Shapes />
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;