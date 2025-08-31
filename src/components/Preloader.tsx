"use client";

import { useState } from "react";
// PERBAIKAN: Mengimpor tipe `Variants` dari framer-motion
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState(0);

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

  // PERBAIKAN: Menambahkan tipe `Variants` secara eksplisit untuk memberitahu Vercel
  const curtainLeftVariant: Variants = {
    closed: { y: 0 },
    open: {
      y: "-100%",
      transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] },
    },
  };
  
  // PERBAIKAN: Menambahkan tipe `Variants` secara eksplisit untuk memberitahu Vercel
  const curtainRightVariant: Variants = {
    closed: { y: 0 },
    open: {
      y: "100%",
      transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] },
    },
  };

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => setIsLoading(false)}
    >
      {isLoading && (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundColor: "#0d1117" }}
            animate={stage >= 1 ? { backgroundColor: "#FFFFFF" } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />

          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <AnimatePresence mode="wait">
              {stage === 0 && (
                <motion.svg
                  key="fz"
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  onAnimationComplete={() => setStage(1)}
                >
                  {/* F */}
                  <motion.line x1="40" y1="40" x2="40" y2="110" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  <motion.line x1="40" y1="40" x2="80" y2="40" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  <motion.line x1="40" y1="75" x2="70" y2="75" stroke="#FFFFFF" strokeWidth="5" variants={pathVariants} />
                  {/* z */}
                  <motion.line x1="90" y1="70" x2="120" y2="70" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                  <motion.line x1="90" y1="110" x2="120" y2="110" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                  <motion.line x1="120" y1="70" x2="90" y2="110" stroke="#FFFFFF" strokeWidth="4" variants={pathVariants} />
                </motion.svg>
              )}

              {stage === 1 && (
                <motion.svg
                  key="checkmark"
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  onAnimationComplete={() => setStage(2)}
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

          <div className="absolute inset-0 flex">
            <motion.div
              className="h-full w-1/2 bg-[#FFFFFF]"
              variants={curtainLeftVariant}
              initial="closed"
              animate={stage >= 2 ? "open" : "closed"}
            />
            <motion.div
              className="h-full w-1/2 bg-[#FFFFFF]"
              variants={curtainRightVariant}
              initial="closed"
              animate={stage >= 2 ? "open" : "closed"}
              onAnimationComplete={() => setIsLoading(false)}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

