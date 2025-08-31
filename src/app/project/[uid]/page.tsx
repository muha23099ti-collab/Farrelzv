// File: src/app/page.tsx

import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { notFound } from "next/navigation";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page() {
  const client = createClient();

  // Kita gunakan .catch() untuk menangani jika dokumen tidak ada
  const page = await client.getSingle("homepage").catch(() => null);

  // Jika halaman tidak ada, panggil notFound() agar Next.js menampilkan halaman 404
  if (!page) {
    notFound();
  }

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("homepage").catch(() => null);

  // Beri nilai default jika page tidak ada
  return {
    title: page?.data.meta_title || "Homepage",
    description: page?.data.meta_description || "Welcome to my portfolio.",
  };
}