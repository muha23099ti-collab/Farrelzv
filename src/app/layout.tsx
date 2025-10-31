import "./globals.css";
import clsx from "clsx";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Preloader from "@/components/Preloader";
import { PreloaderProvider } from "@/providers/PreloaderProvider";
import SplashCursor from "@/components/SplashCursor";

const urbanist = Urbanist({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings");

  return {
    title: settings.data.meta_title,
    description: settings.data.meta_description,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-900">
      <body className={clsx(urbanist.className, "relative min-h-screen")}>
        <PreloaderProvider> {/* Hanya PreloaderProvider yang membungkus */}
          <Preloader />
          <Header />
          {children}
          <div className="background-gradient absolute inset-0 -z-50 max-h-screen" />
          <div className="pointer-events-none absolute inset-0 -z-40 h-full bg-[url('/noisetexture.jpg')] opacity-20 mix-blend-soft-light"></div>
          <Footer />
          <PrismicPreview repositoryName={repositoryName} />
        </PreloaderProvider>
      </body>
    </html>
  );
}