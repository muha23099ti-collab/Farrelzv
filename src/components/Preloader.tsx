// File: src/components/Preloader.tsx

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePreloaderState } from "@/providers/PreloaderProvider";

// --- (Hapus import Howl) ---

export default function Preloader() {
  // Default loading false dulu biar gak nge-flicker
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const { setLoaded } = usePreloaderState();

  // --- LOGIC BARU: CEK SESSION STORAGE ---
  useEffect(() => {
    // Cek apakah user sudah pernah lihat preloader di sesi ini
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");

    if (hasSeenPreloader) {
      // Kalau sudah pernah lihat, langsung set loaded dan jangan tampilkan preloader
      setLoaded();
      setIsLoading(false);
    } else {
      // Kalau belum, tampilkan preloader
      setIsLoading(true);
      // Tandai bahwa user sudah melihat preloader
      sessionStorage.setItem("hasSeenPreloader", "true");
    }
  }, [setLoaded]);

  // --- HAPUS LOGIC SUARA (useMemo sounds) ---

  const svgParentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

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

  const curtainVariant: Variants = {
    exit: (i: number) => ({
      y: i === 0 ? "100%" : "-100%",
      transition: { duration: 0.7, ease: [0.85, 0, 0.15, 1], delay: 0.2 },
    }),
  };

  // Kalau isLoading false (karena udah pernah visit), render null langsung
  if (!isLoading) return null;

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setLoaded()}>
      {isLoading && (
        <div className="fixed inset-0 z-[1000]">
          <motion.div
            className="absolute inset-0 z-20 grid place-items-center"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <AnimatePresence mode="wait">
              {/* Stage 0: Animasi Logo Fz (TANPA SUARA) */}
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
                  // Hapus onAnimationStart (suara)
                  onAnimationComplete={() => setStage(1)}
                >
                  <motion.line x1="40" y1="40" x2="40" y2="110" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  <motion.line x1="40" y1="40" x2="80" y2="40" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  <motion.line x1="40" y1="75" x2="70" y2="75" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  <motion.line x1="90" y1="70" x2="120" y2="70" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                  <motion.line x1="90" y1="110" x2="120" y2="110" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                  <motion.line x1="120" y1="70" x2="90" y2="110" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                </motion.svg>
              )}

              {/* Stage 1: Animasi Ceklis (TANPA SUARA) */}
              {stage === 1 && (
                <motion.svg
                  key="checkmark"
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  // Hapus onAnimationStart (suara)
                  onAnimationComplete={() => setIsLoading(false)}
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
          </motion.div>

          {/* Container Tirai */}
          <div className="flex h-full w-full">
            <motion.div
              className="h-full w-1/2 bg-[#0d1117]"
              custom={0}
              variants={curtainVariant}
              exit="exit"
            />
            <motion.div
              className="h-full w-1/2 bg-[#0d1117]"
              custom={1}
              variants={curtainVariant}
              exit="exit"
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}