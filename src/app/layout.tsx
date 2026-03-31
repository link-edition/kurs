import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { LangProvider } from "@/lib/lang-context";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

import "./globals.css";

export const metadata: Metadata = {
  title: "Course Architect — Kurs yaratish platformasi",
  description: "Professional kurs yaratish va boshqarish platformasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark" translate="no">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} antialiased min-h-screen bg-black text-white font-body selection:bg-[#cafd00] selection:text-[#516700] flex flex-col`}
      >
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
