"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang-context";
import { useAuth } from "@/lib/auth-context";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { name: t("analytics"), href: "/dashboard", icon: "dashboard" },
    { name: t("library"), href: "/library", icon: "video_library" },
    { name: t("createCourse"), href: "/create-course", icon: "add_circle" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#cafd00] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[#516700] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tighter text-foreground font-headline truncate">Course Architect</h1>
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
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 font-bold rounded-full transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-[#cafd00] text-[#516700] scale-[0.98] active:opacity-80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span className="material-symbols-outlined text-lg">{link.icon}</span>
              <span className="text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-border mt-auto space-y-1">
        <Link href="/settings" onClick={() => setIsMobileOpen(false)} className={cn(
          "flex items-center gap-3 px-4 py-3 font-bold rounded-full transition-all duration-200 cursor-pointer",
          pathname === "/settings"
            ? "bg-[#cafd00] text-[#516700] scale-[0.98] active:opacity-80"
            : "text-muted-foreground hover:text-[#cafd00] hover:bg-muted"
        )}>
          <span className="material-symbols-outlined text-lg">settings</span>
          <span className="text-sm">{t("settings")}</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-muted rounded-full">
          <span className="material-symbols-outlined text-lg">help_outline</span>
          <span className="text-sm">{t("help")}</span>
        </Link>
      </div>

      {/* User Profile / Auth */}
      {user ? (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border group hover:border-[#cafd00]/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#cafd00]/10 flex items-center justify-center text-sm font-bold text-[#cafd00] border border-[#cafd00]/20 shrink-0">
              {userInitials}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-[#cafd00] truncate font-bold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-xs font-bold"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            {lang === 'uz' ? 'Chiqish' : 'Logout'}
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          onClick={() => setIsMobileOpen(false)}
          className="mt-4 flex items-center justify-center gap-3 p-4 bg-[#cafd00] rounded-2xl text-[#516700] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(202,253,0,0.2)]"
        >
          <span className="material-symbols-outlined text-lg">login</span>
          {lang === 'uz' ? 'Kirish' : 'Sign In'}
        </Link>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-foreground hover:bg-muted hover:border-[#cafd00]/20 transition-all shadow-xl"
      >
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex bg-card border-r border-border font-body antialiased tracking-tight h-screen w-64 fixed left-0 top-0 overflow-y-auto flex-col p-6 space-y-8 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Slide-in) */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 h-screen w-[280px] bg-card border-r border-border font-body antialiased tracking-tight overflow-y-auto flex flex-col p-6 space-y-8 z-[80] transition-transform duration-300 ease-out shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
