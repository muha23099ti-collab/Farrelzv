// File: src/app/project/[uid]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link"; // Import Link
import { MdArrowBack } from "react-icons/md"; // Import Icon Panah

import { createClient } from "@/prismicio";
import ContentBody from "@/components/ContentBody";
import Bounded from "@/components/Bounded"; // Kita pake Bounded biar padding-nya sama

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID("project", params.uid)
    .catch(() => notFound());

  return (
    <>
      {/* --- BAGIAN TOMBOL BACK --- */}
      <Bounded className="!pb-0"> {/* !pb-0 biar ga kejauhan sama konten bawahnya */}
        <Link
          href="/projects" // Arahkan ke halaman list project (atau sesuaikan url-nya)
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors duration-300 cursor-pointer w-fit"
        >
          <span className="p-2 rounded-full border border-slate-700 bg-slate-800 group-hover:bg-slate-700 transition-colors">
            <MdArrowBack />
          </span>
          <span className="font-medium">Back to Projects</span>
        </Link>
      </Bounded>
      {/* ------------------------- */}

      <ContentBody page={page} />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getByUID("project", params.uid)
    .catch(() => notFound());

  return {
    title: page.data.meta_title || page.data.title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("project");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}