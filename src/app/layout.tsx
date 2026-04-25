import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { LangProvider } from "@/lib/lang-context";
import { AuthProvider } from "@/lib/auth-context";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

import "./globals.css";

import { ThemeProvider } from "@/lib/theme-context";

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
    <html lang="uz" translate="no" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} antialiased min-h-screen bg-background text-foreground font-body selection:bg-[#cafd00] selection:text-[#516700] flex flex-col transition-colors duration-300`}
      >
        <ThemeProvider>
          <AuthProvider>
            <LangProvider>
              {children}
            </LangProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
