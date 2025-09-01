"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState(0); // 0: Fz, 1: Ceklis

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

  // Varian untuk tirai, sekarang sebagai properti `exit`
  const curtainVariant: Variants = {
    // Properti custom (i) akan menentukan arah: 0 untuk kiri, 1 untuk kanan
    exit: (i: number) => ({
      y: i === 0 ? "100%" : "-100%", // Tirai kiri ke bawah, kanan ke atas
      transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1], delay: 0.2 },
    }),
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setIsLoading(false)}>
      {isLoading && (
        // Wrapper utama yang akan memiliki animasi exit tirai
        <motion.div className="fixed inset-0 z-[1000] flex">
          {/* Tirai Kiri */}
          <motion.div
            className="h-full w-1/2 bg-[#0d1117]"
            custom={0}
            variants={curtainVariant}
            initial={false} // Tidak ada animasi masuk
            exit="exit"
          />
          {/* Tirai Kanan */}
          <motion.div
            className="h-full w-1/2 bg-[#0d1117]"
            custom={1}
            variants={curtainVariant}
            initial={false}
            exit="exit"
          />

          {/* Lapisan Konten SVG di atas segalanya */}
          <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-center">
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
                  onAnimationComplete={() => setStage(1)}
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
                  onAnimationComplete={() => setIsLoading(false)} // Memicu animasi keluar/tirai
                >
                  <motion.path
                    d="M30 80 L65 115 L120 40"
                    fill="transparent"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                    variants={pathVariants}
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

