"use client";

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

// Komponen ini harus diletakkan di Layout utama Anda
export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Inisialisasi Lenis
    const lenis = new Lenis({
      duration: 1.2,     // Durasi scroll (semakin tinggi, semakin lambat/smooth)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing khas Lenis
      smoothTouch: false, // Smooth scroll dinonaktifkan di perangkat sentuh untuk performa
      smooth: true,
      direction: 'vertical',
    });

    // 2. Tautkan Lenis ke requestAnimationFrame (loop browser)
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 3. Optional: Agar GSAP bisa bekerja bersama Lenis
    // Karena Anda sudah punya GSAP, ini penting untuk sinkronisasi ScrollTrigger
    // lenis.on('scroll', ScrollTrigger.update); // Kita akan panggil ini di layout jika GSAP dipakai

    return () => {
      lenis.destroy(); // Cleanup saat komponen di-unmount
    };
  }, []);

  return <>{children}</>;
}