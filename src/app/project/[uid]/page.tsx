import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("homepage").catch(() => null);

  return {
    title: page?.data.meta_title,
    description: page?.data.meta_description,
  };
}

export default async function Page() {
  const client = createClient();

  // Hapus .catch() agar kita bisa menangani error secara eksplisit
  const page = await client.getSingle("homepage").catch(() => {
    // Jika ada error (misal, API key salah atau network error), catat dan kembalikan null
    console.error("Failed to fetch 'homepage' data from Prismic.");
    return null;
  });

  // Jika halaman tidak ada atau gagal dimuat, tampilkan pesan error
  // Ini lebih baik daripada langsung ke halaman 404
  if (!page) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        fontFamily: 'sans-serif'
       }}>
        <h1>Konten Halaman Utama tidak ditemukan.</h1>
        <p style={{marginTop: '1rem'}}></p>
      </div>
    );
  }

  return <SliceZone slices={page.data.slices} components={components} />;
}