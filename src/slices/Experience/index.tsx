"use client";

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdAdd, MdRemove } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

/**
 * Props for `Experience`.
 */
export type ExperienceProps = SliceComponentProps<Content.ExperienceSlice>;

/**
 * Component for "Experience" Slices.
 */
const Experience = ({ slice }: ExperienceProps): JSX.Element => {
  const component = useRef(null);
  const [currentItem, setCurrentItem] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    setCurrentItem(currentItem === index ? null : index);
  };

  // Refs untuk setiap item accordion (konten yang terbuka/tertutup)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Refs untuk setiap item wrapper (untuk animasi blur/reveal)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]); // <-- Ref per item

  // Logika Accordion (Buka/Tutup) - TIDAK BERUBAH
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      contentRefs.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            height: currentItem === index ? "auto" : 0,
            opacity: currentItem === index ? 1 : 0,
            duration: 0.4,
            ease: "power3.inOut",
          });
        }
      });
    }, component);
    return () => ctx.revert();
  }, [currentItem]);

  // Logika Blur/Reveal Per Item (TRIGGER PER ITEM)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Loop melalui setiap item ref
      itemRefs.current.forEach((el) => {
        if (el) {
          gsap.fromTo(el, 
            {
              // MULAI: Buram dan tak terlihat
              opacity: 0,
              filter: "blur(20px)", 
            },
            {
              // AKHIR: Jernih dan terlihat penuh
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.0, // Cepat, tidak bergantung jarak scroll
              ease: "power1.out",
              
              scrollTrigger: {
                trigger: el, // <-- TRIGGER ADALAH ITEM INDIVIDU
                start: "top bottom-=100", // Mulai ketika 100px sebelum item muncul di bawah
                toggleActions: "play none none reverse", // Memastikan efek terulang saat scroll naik
              }
            }
          );
        }
      });
    }, component);
    return () => ctx.revert(); 
  }, [slice.items.length]);


  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <Heading as="h2" size="lg">
        {slice.primary.heading}
      </Heading>
      <div 
        className="mt-8 flex flex-col gap-4 md:mt-16"
      >
        {slice.items.map((item, index) => (
          <div 
            key={index} 
            className="border-b border-slate-700 pb-4 experience-item-wrapper"
            // REF BARU: Mengaitkan ref ke item individu untuk ScrollTrigger
            ref={(el) => { itemRefs.current[index] = el; }} 
          >
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => handleItemClick(index)}
            >
              <div className="flex flex-col">
                <Heading as="h3" size="sm">
                  {item.title}
                </Heading>
                <div className="mt-1 flex w-fit items-center gap-1 text-2xl font-semibold tracking-tight text-slate-400">
                  <span>{item.time_period}</span>{" "}
                  <span className="text-3xl font-extralight">/</span>{" "}
                  <span>{item.institution}</span>
                </div>
              </div>
              <span className="text-3xl text-slate-400">
                {currentItem === index ? <MdRemove /> : <MdAdd />}
              </span>
            </div>

            <div
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              className="h-0 overflow-hidden opacity-0"
              style={{ height: 0 }}
            >
              <div className="prose prose-lg prose-invert mt-4">
                <PrismicRichText field={item.description} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Bounded>
  );
};

export default Experience;