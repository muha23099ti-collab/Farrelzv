// src/components/TextPressure.tsx

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  className?: string;
  minFontSize?: number;
}

// Helper function
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const TextPressure: React.FC<TextPressureProps> = ({
  text = "Compressa",
  fontFamily = "Compressa VF",
  fontUrl = "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#FFFFFF",
  strokeColor = "#FF0000",
  className = "",
  minFontSize = 24,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  // --- OPTIMISASI 1: Cache posisi karakter ---
  // Kita akan menyimpan posisi setiap huruf di sini agar tidak perlu dihitung ulang di setiap frame.
  const charPositionsRef = useRef<{ x: number; y: number; width: number; height: number }[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  // --- OPTIMISASI 2: Memoize `chars` array ---
  // Mencegah array dibuat ulang jika `text` tidak berubah.
  const chars = useMemo(() => text.split(""), [text]);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = Math.max(containerW / (chars.length / 2), minFontSize);
    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }

      // --- OPTIMISASI 3: Hitung dan simpan posisi huruf di sini ---
      // Ini hanya berjalan saat ukuran berubah, bukan di setiap frame.
      charPositionsRef.current = spansRef.current.map(span => {
        if (!span) return { x: 0, y: 0, width: 0, height: 0 };
        const rect = span.getBoundingClientRect();
        return {
          x: rect.left, // Gunakan `left` bukan `x` untuk kompatibilitas
          y: rect.top, // Gunakan `top` bukan `y`
          width: rect.width,
          height: rect.height,
        };
      });
    });
  }, [chars.length, minFontSize, scale, text]); // dependensi diperbarui

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true }); // passive: true untuk performa scroll

    // Inisialisasi posisi mouse
    if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const initialPos = { x: left + width / 2, y: top + height / 2 };
        mouseRef.current = initialPos;
        cursorRef.current = initialPos;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [setSize]);

  useEffect(() => {
    let rafId: number;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) * 0.07; // Lerp lebih halus
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) * 0.07;

      if (titleRef.current && charPositionsRef.current.length > 0) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        // --- OPTIMISASI 4: Gunakan posisi yang sudah disimpan ---
        spansRef.current.forEach((span, i) => {
          if (!span) return;

          // Baca posisi dari cache, JANGAN panggil getBoundingClientRect() di sini!
          const rect = charPositionsRef.current[i];
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const d = dist(mouseRef.current, charCenter);

          const getAttr = (distance: number, minVal: number, maxVal: number) => {
            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
            return Math.max(minVal, val + minVal);
          };

          const wdth = width ? Math.floor(getAttr(d, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : "0";
          const alphaVal = alpha ? getAttr(d, 0, 1).toFixed(2) : "1";

          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
          if (alpha) { // Hanya update opacity jika memang digunakan
            span.style.opacity = alphaVal;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha]); // dependensi chars.length dihapus, karena tidak relevan untuk loop animasi

  const dynamicClassName = [className, flex ? "flex" : "", stroke ? "stroke" : ""].filter(Boolean).join(" ");
  
  // Render JSX tetap sama
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent'
      }}
    >
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
          font-display: swap; /* Performa font */
        }
        /* ... sisa style ... */
        .flex { justify-content: space-between; display: flex; }
        .stroke span { position: relative; color: ${textColor}; }
        .stroke span::after { content: attr(data-char); position: absolute; left: 0; top: 0; color: transparent; z-index: -1; -webkit-text-stroke-width: 3px; -webkit-text-stroke-color: ${strokeColor}; }
        .text-pressure-title { color: ${textColor}; }
      `}</style>

      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%'
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={el => { spansRef.current[i] = el; }}
            data-char={char}
            style={{ display: 'inline-block', color: stroke ? undefined : textColor }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;