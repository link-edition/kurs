"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { usePathname } from "next/navigation";

export function TopNav() {
  const { t, lang, setLang } = useLang();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isSettings = pathname === "/settings";

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <header className="bg-card/40 backdrop-blur-2xl text-foreground font-body text-sm font-medium tracking-tight sticky top-0 z-40 flex items-center justify-between h-14 sm:h-16 w-full px-4 sm:px-8 border-b border-border shadow-sm">
      <div className="flex items-center gap-4 sm:gap-8 ml-12 lg:ml-0">
        <span className="text-base sm:text-lg font-bold tracking-tight font-headline hidden sm:block">{t("courseBuilder")}</span>
        {!isSettings && (
          <nav className="flex gap-3 sm:gap-6">
            <Link className="text-[#cafd00] border-b-2 border-[#cafd00] pb-1 font-bold text-xs sm:text-sm" href="/dashboard">{t("analytics")}</Link>
            <Link className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm" href="/library">{t("library")}</Link>
            <Link className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm hidden sm:block" href="/members">{t("members")}</Link>
          </nav>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-border hover:border-[#cafd00]/20 transition-all text-muted-foreground hover:text-[#cafd00]"
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Language Switch */}
        <button
          onClick={() => setLang(lang === "uz" ? "en" : "uz")}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full border border-border hover:border-[#cafd00]/20 transition-all text-xs font-bold text-muted-foreground hover:text-foreground"
        >
          <span className="text-sm">{lang === "uz" ? "🇺🇿" : "🇬🇧"}</span>
          <span className="hidden sm:inline">{lang.toUpperCase()}</span>
        </button>
        <div className="relative group hidden sm:block">
          <span className="material-symbols-outlined text-muted-foreground group-hover:text-[#cafd00] cursor-pointer transition-colors">search</span>
        </div>
        <div className="relative group">
          <span className="material-symbols-outlined text-muted-foreground group-hover:text-[#cafd00] cursor-pointer transition-colors">notifications</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#cafd00]/20 dark:bg-[#cafd00]/10 flex items-center justify-center text-[10px] font-bold text-[#516700] dark:text-[#cafd00] border border-[#cafd00]/30 dark:border-[#cafd00]/20">
          {userInitials}
        </div>
      </div>
    </header>
  );
}
