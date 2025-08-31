"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState(0); // 0: Fz, 1: Ceklis, 2: Tirai

  // Rangkaian animasi menggunakan setTimeout untuk stabilitas
  useEffect(() => {
    // Pindah ke tahap ceklis setelah animasi Fz selesai
    const toCheckmarkTimer = setTimeout(() => {
      setStage(1);
    }, 2500); // Durasi Fz (kurang lebih)

    // Pindah ke tahap tirai setelah animasi ceklis selesai
    const toCurtainTimer = setTimeout(() => {
      setStage(2);
    }, 4000); // Waktu Fz + durasi Ceklis

    // Hilangkan preloader setelah tirai terbuka
    const exitTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Waktu total + durasi Tirai

    return () => {
      clearTimeout(toCheckmarkTimer);
      clearTimeout(toCurtainTimer);
      clearTimeout(exitTimer);
    };
  }, []);

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

  const curtainLeftVariant: Variants = {
    closed: { y: 0 },
    open: {
      y: "-100%",
      transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] },
    },
  };

  const curtainRightVariant: Variants = {
    closed: { y: 0 },
    open: {
      y: "100%",
      transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] },
    },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
          {/* Latar belakang yang berubah warna */}
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundColor: "#0d1117" }}
            animate={stage >= 1 ? { backgroundColor: "#FFFFFF" } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
                    stroke="#0d1117"
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
              className="h-full w-1-2 bg-[#FFFFFF]"
              variants={curtainLeftVariant}
              initial="closed"
              animate={stage >= 2 ? "open" : "closed"}
            />
            <motion.div
              className="h-full w-1-2 bg-[#FFFFFF]"
              variants={curtainRightVariant}
              initial="closed"
              animate={stage >= 2 ? "open" : "closed"}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

