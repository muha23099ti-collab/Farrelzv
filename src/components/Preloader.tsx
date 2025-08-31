"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // Durasi total preloader

    return () => clearTimeout(timer);
  }, []);

  // Varian animasi untuk SVG "Fz"
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
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

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0d1117]"
        >
          <motion.svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            variants={svgVariants}
            initial="hidden"
            animate="visible"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
