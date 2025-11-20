// File: src/components/BackButton.tsx

"use client";

import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()} // Ini logic "Back to Previous Page"
      className="group inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors duration-300 cursor-pointer w-fit"
    >
      <span className="p-2 rounded-full border border-slate-700 bg-slate-800 group-hover:bg-slate-700 transition-colors">
        <MdArrowBack />
      </span>
      <span className="font-medium">Back Page</span>
    </button>
  );
}