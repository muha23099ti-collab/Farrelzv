// File: src/app/page.tsx

import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { notFound } from "next/navigation";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

// Komponen Halaman Utama
export default async function Page() {
  const client = createClient();

  // Mencoba mengambil data, jika gagal atau tidak ada, 'page' akan menjadi null
  const page = await client.getSingle("homepage").catch(() => null);

  // Jika 'page' adalah null, panggil fungsi notFound() untuk render halaman 404
  if (!page) {
    notFound();
  }

  return <SliceZone slices={page.data.slices} components={components} />;
}


// Fungsi untuk Metadata
export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  
  // Mencoba mengambil data, jika gagal atau tidak ada, 'page' akan menjadi null
  const page = await client.getSingle("homepage").catch(() => null);

  // Jika 'page' ditemukan, gunakan meta datanya.
  // Jika tidak, gunakan judul dan deskripsi default.
  return {
    title: page?.data.meta_title ?? "Portfolio",
    description: page?.data.meta_description ?? "Selamat datang di portfolio saya.",
  };
}