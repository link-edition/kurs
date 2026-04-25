import { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "Course Architect — O'z bilim imperiyangizni quring",
  description: "Kurslaringizni professional darajaga olib chiqing. O'quvchilaringiz uchun eng qulay va zamonaviy ta'lim muhitini yarating.",
  openGraph: {
    title: "Course Architect | Kinetic Edition",
    description: "Professional kurs yaratish va boshqarish platformasi",
    images: ["/og-hero.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Course Architect",
    description: "Build your knowledge empire.",
    images: ["/og-hero.png"],
  },
};

export default function LandingPage() {
  return <LandingClient />;
}
