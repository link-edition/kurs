"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang-context";

export function Sidebar() {
  const pathname = usePathname();
  const { t, lang, setLang } = useLang();

  const links = [
    { name: t("analytics"), href: "/dashboard", icon: "dashboard" },
    { name: t("library"), href: "/library", icon: "video_library" },
    { name: t("createCourse"), href: "/create-course", icon: "add_circle" },
  ];

  return (
    <aside className="bg-black border-r border-[#cafd00]/10 font-body antialiased tracking-tight h-screen w-64 fixed left-0 top-0 overflow-y-auto flex flex-col p-6 space-y-8 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#cafd00] flex items-center justify-center">
          <span className="material-symbols-outlined text-[#516700] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-white font-headline">Course Architect</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#fedc00] font-bold">Kinetic Edition</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 mt-8">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 font-bold rounded-full transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-[#cafd00] text-[#516700] scale-[0.98] active:opacity-80"
                  : "text-[#919191] hover:text-[#cafd00] hover:bg-white/5"
              )}
            >
              <span className="material-symbols-outlined text-lg">{link.icon}</span>
              <span className="text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-[#cafd00]/10 mt-auto space-y-1">
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#919191] hover:text-white transition-all duration-200 hover:bg-white/5 rounded-full">
          <span className="material-symbols-outlined text-lg">settings</span>
          <span className="text-sm">{t("settings")}</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#919191] hover:text-white transition-all duration-200 hover:bg-white/5 rounded-full">
          <span className="material-symbols-outlined text-lg">help_outline</span>
          <span className="text-sm">{t("help")}</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 p-4 bg-[#121212] rounded-2xl border border-[#cafd00]/10 group hover:border-[#cafd00]/30 transition-colors cursor-pointer mt-4">
        <div className="w-10 h-10 rounded-full bg-[#cafd00]/10 flex items-center justify-center text-sm font-bold text-[#cafd00] border border-[#cafd00]/20">AD</div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate">{t("admin")}</p>
          <p className="text-xs text-[#cafd00] truncate font-bold uppercase tracking-wider">{t("manager")}</p>
        </div>
      </div>
    </aside>
  );
}
