"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState(0); // 0: Fz, 1: Ceklis, 2: Tirai

  // Varian untuk mengontrol urutan munculnya garis-garis SVG
  const svgParentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  // Varian animasi untuk menggambar garis SVG
  const pathVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  // Varian untuk tirai (kedua sisi bergerak ke atas)
  const curtainVariant: Variants = {
    closed: { y: 0 },
    open: {
      y: "-100%", // Bergerak ke atas
      transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] },
    },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
          {/* Latar belakang hitam solid yang tidak berubah */}
          <motion.div
            className="absolute inset-0 bg-[#0d1117]"
          />

          {/* Kontainer SVG di tengah */}
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <AnimatePresence mode="wait">
              {/* Tahap 0: Animasi Fz */}
              {stage === 0 && (
                <motion.svg
                  key="fz"
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                  variants={svgParentVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  onAnimationComplete={() => setStage(1)} // Pindah ke tahap 1 setelah Fz selesai
                >
                  {/* Huruf "F" */}
                  <motion.line x1="40" y1="40" x2="40" y2="110" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  <motion.line x1="40" y1="40" x2="80" y2="40" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  <motion.line x1="40" y1="75" x2="70" y2="75" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  {/* Huruf "z" */}
                  <motion.line x1="90" y1="70" x2="120" y2="70" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                  <motion.line x1="90" y1="110" x2="120" y2="110" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                  <motion.line x1="120" y1="70" x2="90" y2="110" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                </motion.svg>
              )}

              {/* Tahap 1: Animasi Ceklis */}
              {stage === 1 && (
                <motion.svg
                  key="checkmark"
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  onAnimationComplete={() => setStage(2)} // Pindah ke tahap 2 (tirai) setelah ceklis selesai
                >
                  <motion.path
                    d="M30 80 L65 115 L120 40"
                    fill="transparent"
                    stroke="#FFFFFF" // Warna garis ceklis putih
                    strokeWidth="8"
                    variants={pathVariants}
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>

          {/* Lapisan Tirai */}
          <div className="absolute inset-0 flex pointer-events-none">
            <motion.div
              className="h-full w-1/2 bg-[#0d1117]"
              variants={curtainVariant} // Menggunakan varian yang sama
              initial="closed"
              animate={stage >= 2 ? "open" : "closed"}
            />
            <motion.div
              className="h-full w-1/2 bg-[#0d1117]"
              variants={curtainVariant} // Menggunakan varian yang sama
              initial="closed"
              animate={stage >= 2 ? "open" : "closed"}
              onAnimationComplete={() => {
                if (stage === 2) {
                  setIsLoading(false); // Hilangkan preloader setelah tirai terbuka
                }
              }}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

