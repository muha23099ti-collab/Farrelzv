"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [stage, setStage] = useState(0); // 0: Gambar Fz, 1: Gambar Ceklis, 2: Buka Tirai, 3: Selesai

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
      transition: { duration: 0.3 },
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

  // Varian untuk tirai kiri (bergerak ke atas)
  const curtainLeftVariant = {
    closed: { y: 0 },
    open: {
      y: "-100%",
      transition: { duration: 1.0, ease: [0.85, 0, 0.15, 1] },
    },
  };

  // Varian untuk tirai kanan (bergerak ke bawah)
  const curtainRightVariant = {
    closed: { y: 0 },
    open: {
      y: "100%",
      transition: { duration: 1.0, ease: [0.85, 0, 0.15, 1] },
    },
  };


  return (
    <AnimatePresence>
      {stage < 3 && ( // Tampilkan preloader selama stage belum selesai
        <div className="pointer-events-none fixed inset-0 z-[1000] overflow-hidden">
          {/* Lapisan Tirai (2 bagian) */}
          <div className="absolute inset-0 flex">
             <motion.div
              className="h-full w-1/2 bg-[#161b22]"
              variants={curtainLeftVariant}
              initial="closed"
              animate={stage >= 2 ? "open" : "closed"}
              transition={{ ...curtainLeftVariant.open.transition, delay: 0 }}
            />
             <motion.div
              className="h-full w-1/2 bg-[#161b22]"
              variants={curtainRightVariant}
              initial="closed"
              animate={stage >= 2 ? "open" : "closed"}
              onAnimationComplete={() => {
                if (stage === 2) {
                  setTimeout(() => setStage(3), 500); // Tunggu tirai selesai, lalu hilangkan preloader
                }
              }}
              transition={{ ...curtainRightVariant.open.transition, delay: 0 }}
            />
          </div>

          {/* Kontainer untuk SVG */}
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <AnimatePresence mode="wait">
              {stage === 0 ? (
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
                    x1="120"
                    y1="70"
                    x2="90"
                    y2="110"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    variants={pathVariants}
                    onAnimationComplete={() => setTimeout(() => setStage(1), 300)} // Jeda sebelum ganti
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
                    onAnimationComplete={() => setTimeout(() => setStage(2), 300)} // Jeda sebelum tirai
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

