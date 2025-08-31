"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFzDrawn, setIsFzDrawn] = useState(false); // State baru untuk melacak animasi "Fz"

  useEffect(() => {
    // Timer ini akan menghilangkan loader dari DOM setelah 4.5 detik
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  // Varian animasi untuk SVG
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  // Varian untuk setiap lapisan tirai
  const curtainVariant = {
    initial: { y: 0 },
    exit: {
      y: "-100%",
      transition: { duration: 1.0, ease: [0.85, 0, 0.15, 1] },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="pointer-events-none fixed inset-0 z-[1000] overflow-hidden">
          {/* Lapisan Tirai (3 lapis) */}
          <motion.div
            className="absolute inset-0 bg-[#0A0D11]"
            variants={curtainVariant}
            initial="initial"
            exit="exit"
            transition={{ ...curtainVariant.exit.transition, delay: 3.0 }}
          />
          <motion.div
            className="absolute inset-0 bg-[#0d1117]"
            variants={curtainVariant}
            initial="initial"
            exit="exit"
            transition={{ ...curtainVariant.exit.transition, delay: 2.9 }}
          />
          <motion.div
            className="absolute inset-0 bg-[#161b22]"
            variants={curtainVariant}
            initial="initial"
            exit="exit"
            transition={{ ...curtainVariant.exit.transition, delay: 2.8 }}
          />

          {/* Kontainer untuk SVG */}
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <AnimatePresence mode="wait">
              {!isFzDrawn ? (
                // Tampilkan SVG "Fz"
                <motion.svg
                  key="fz"
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                  variants={svgVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Huruf "F" */}
                  <motion.line x1="40" y1="40" x2="40" y2="110" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  <motion.line x1="40" y1="40" x2="80" y2="40" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  <motion.line x1="40" y1="75" x2="70" y2="75" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  {/* Huruf "z" */}
                  <motion.line x1="90" y1="70" x2="120" y2="70" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                  <motion.line x1="90" y1="110" x2="120" y2="110" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                  <motion.line
                    x1="120" y1="70" x2="90" y2="110" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants}
                    onAnimationComplete={() => {
                      setTimeout(() => setIsFzDrawn(true), 300); // Beri jeda singkat sebelum berubah
                    }}
                  />
                </motion.svg>
              ) : (
                // Tampilkan SVG Ceklis
                <motion.svg
                  key="checkmark"
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  variants={svgVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.path
                    d="M30 60 L50 80 L90 40"
                    fill="transparent"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                    strokeLinecap="round"
                    variants={pathVariants}
                    transition={{ duration: 0.8 }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

