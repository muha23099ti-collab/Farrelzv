// src/slices/ButtonSlice/index.tsx

import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next"; // Gunakan PrismicNextLink untuk handle link
import Bounded from "@/components/Bounded"; // Kita pakai Bounded agar konsisten

// Pastikan nama type-nya sesuai (misal: "ButtonSliceSlice")
// Cek nama yang benar di file `prismicio-types.d.ts` setelah kamu save di Slicemachine
export type ButtonSliceSlice = SliceComponentProps<Content.ButtonSliceSlice>; 

const ButtonSlice = ({ slice }: ButtonSliceSlice): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-8" // Beri sedikit spasi
    >
      <div className="flex justify-center">
        <PrismicNextLink
          field={slice.primary.button_link}
          className="rounded-full bg-yellow-400 px-5 py-3 text-xl font-medium text-slate-900 transition-transform duration-200 ease-in-out hover:scale-105"
        >
          {slice.primary.button_text}
        </PrismicNextLink>
      </div>
    </Bounded>
  );
};

export default ButtonSlice;