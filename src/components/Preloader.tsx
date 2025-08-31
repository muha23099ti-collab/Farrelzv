"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState(0); // 0: Fz, 1: Ceklis

  // Menggunakan useEffect untuk mengontrol alur animasi
  useEffect(() => {
    // Timer untuk transisi dari Fz ke Ceklis (setelah ~2 detik)
    const toCheckmarkTimer = setTimeout(() => {
      setStage(1);
    }, 2000);

    // Timer untuk memicu animasi keluar/tirai (setelah ~3.5 detik)
    const endLoadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    // Membersihkan timer saat komponen di-unmount
    return () => {
      clearTimeout(toCheckmarkTimer);
      clearTimeout(endLoadingTimer);
    };
  }, []); // Dijalankan hanya sekali

  // Varian untuk menggambar SVG
  const svgParentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };
  
  const pathVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };

  // Varian untuk tirai yang akan membuka saat preloader keluar
  const curtainVariant: Variants = {
    initial: { y: 0 },
    exit: {
      y: (i: number) => (i === 0 ? "100%" : "-100%"), // Kiri ke bawah, Kanan ke atas
      transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1], delay: 0.2 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        // Kontainer utama preloader yang akan dianimasikan saat keluar
        <motion.div 
            key="preloader"
            className="fixed inset-0 z-[1000] flex"
        >
          {/* Tirai Kiri (sebagai bagian dari animasi keluar) */}
          <motion.div
            className="h-full w-1/2 bg-[#0d1117]"
            custom={0}
            variants={curtainVariant}
            initial="initial"
            exit="exit"
          />
          {/* Tirai Kanan (sebagai bagian dari animasi keluar) */}
          <motion.div
            className="h-full w-1/2 bg-[#0d1117]"
            custom={1}
            variants={curtainVariant}
            initial="initial"
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

