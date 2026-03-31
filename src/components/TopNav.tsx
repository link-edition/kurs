"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";

export function TopNav() {
  const { t, lang, setLang } = useLang();

  return (
    <header className="bg-black/80 backdrop-blur-xl text-white font-body text-sm font-medium tracking-tight sticky top-0 z-40 flex items-center justify-between h-16 w-full px-8 border-b border-[#cafd00]/5">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold tracking-tight font-headline">{t("courseBuilder")}</span>
        <nav className="flex gap-6">
          <Link className="text-[#cafd00] border-b-2 border-[#cafd00] pb-1 font-bold" href="/dashboard">{t("analytics")}</Link>
          <Link className="text-[#919191] hover:text-white transition-colors" href="/library">{t("library")}</Link>
          <Link className="text-[#919191] hover:text-white transition-colors" href="/members">{t("members")}</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* Language Switch */}
        <button
          onClick={() => setLang(lang === "uz" ? "en" : "uz")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-[#cafd00]/20 transition-all text-xs font-bold text-[#919191] hover:text-white"
        >
          <span className="text-sm">{lang === "uz" ? "🇺🇿" : "🇬🇧"}</span>
          {lang.toUpperCase()}
        </button>
        <div className="relative group">
          <span className="material-symbols-outlined text-[#919191] group-hover:text-[#cafd00] cursor-pointer transition-colors">search</span>
        </div>
        <div className="relative group">
          <span className="material-symbols-outlined text-[#919191] group-hover:text-[#cafd00] cursor-pointer transition-colors">notifications</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#cafd00]/10 flex items-center justify-center text-[10px] font-bold text-[#cafd00] border border-[#cafd00]/20">AD</div>
      </div>
    </header>
  );
}
