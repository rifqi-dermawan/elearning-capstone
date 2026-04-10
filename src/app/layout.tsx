import type { Metadata } from "next";
import { Inter, Geist, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LearnAI — Platform E-Learning dengan AI",
    template: "%s | LearnAI",
  },
  description:
    "Platform e-learning cerdas yang merekomendasikan materi pembelajaran secara personal berdasarkan histori belajar dan minat topik Anda.",
  keywords: ["e-learning", "AI", "recommendation", "kursus online", "belajar"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
