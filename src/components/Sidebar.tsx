"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Create Course", href: "/create-course", icon: "add_circle" },
  ];

  return (
    <aside className="bg-black border-r border-[#cafd00]/10 font-body antialiased tracking-tight h-screen w-64 fixed left-0 top-0 overflow-y-auto flex flex-col p-6 space-y-8 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#cafd00] flex items-center justify-center">
          <span className="material-symbols-outlined text-[#516700] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-white font-headline">Obsidian</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#fedc00] font-bold">Kinetic Edition</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 mt-8">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
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

      <div className="pt-6 border-t border-[#cafd00]/10 mt-auto">
        <Link href="/create-course" className="w-full flex justify-center bg-[#cafd00] text-[#516700] font-bold text-sm py-3 px-4 rounded-full mb-8 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(202,253,0,0.15)]">
            New Project
        </Link>
        <div className="space-y-1">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#919191] hover:text-white transition-all duration-200 hover:bg-white/5 rounded-full">
            <span className="material-symbols-outlined text-lg">settings</span>
            <span className="text-sm">Settings</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#919191] hover:text-white transition-all duration-200 hover:bg-white/5 rounded-full">
            <span className="material-symbols-outlined text-lg">help_outline</span>
            <span className="text-sm">Support</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-[#121212] rounded-2xl border border-[#cafd00]/10 group hover:border-[#cafd00]/30 transition-colors cursor-pointer mt-4">
        <img alt="User Profile" className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATdzPTnZsLkj3Pj5gtBvwnZi7mJVP7deCWzvLvFLC1lrZRaIZPsRv52n60YXuTuEJvUVe7AnaqjTU087NIycE2g8hvJyzjlScZ5Hypu_57rdpOhh9OLNpLf_ZteInq93hSF07Z7Z2DlPQbp8X18ENNcLQ4w0Goyt9S0PorB_3QFFA9pKQiRQA1xwlSsSKGSS2MN9azWHqV-w05qReq-i-7gJd4njgkd8KC1rM4NlcF25UHsD2zEGYSbmuDeAkWsGQ3ZFtxB8HERAk"/>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate">Alex Thorne</p>
          <p className="text-xs text-[#cafd00] truncate font-bold uppercase tracking-wider">Admin</p>
        </div>
      </div>
    </aside>
  );
}
