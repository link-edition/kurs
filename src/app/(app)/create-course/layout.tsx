"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang-context";

export default function CreateCourseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLang();

  const steps = [
    { id: "step-1", name: t("basics"), href: "/create-course" },
    { id: "step-2", name: t("curriculum"), href: "/create-course/curriculum" },
    { id: "step-3", name: t("pricing"), href: "/create-course/pricing" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background w-full relative font-body tracking-tight transition-colors duration-300">
      <header className="fixed top-0 right-0 left-0 lg:left-64 h-14 sm:h-16 lg:h-20 flex justify-between items-center px-4 sm:px-8 lg:px-12 z-40 bg-background/80 backdrop-blur-2xl border-b border-border">
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-10 ml-12 lg:ml-0">
          <span className="text-base sm:text-lg lg:text-xl font-black text-foreground tracking-[-0.03em] font-headline uppercase italic hidden sm:block">
            Course <span className="text-[#cafd00]">Architect</span>
          </span>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <nav className="flex gap-3 sm:gap-5 lg:gap-10 overflow-x-auto no-scrollbar">
            {steps.map((step) => {
              const isActive = step.href === "/create-course" ? pathname === "/create-course" : pathname.startsWith(step.href);
              return (
                <Link
                  key={step.id}
                  href={step.href}
                  className={cn(
                    "text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] pb-1 transition-all whitespace-nowrap",
                    isActive
                      ? "text-[#cafd00] border-b-2 border-[#cafd00] shadow-[0_4px_10px_rgba(202,253,0,0.2)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {step.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <button className="text-muted-foreground hover:text-[#fedc00] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-muted hidden sm:flex">
            <span className="material-symbols-outlined text-xl">help_outline</span>
          </button>
          {pathname.endsWith('/publish') && (
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('trigger-publish'))}
              className="px-6 py-2 bg-[#cafd00] text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg font-headline flex items-center gap-2"
            >
              Chop etish
              <span className="material-symbols-outlined text-sm font-black">rocket_launch</span>
            </button>
          )}
          <button onClick={() => router.push('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center lg:pl-6 lg:border-l border-border group">
            <span className="material-symbols-outlined text-xl sm:text-2xl group-hover:rotate-90 transition-transform">close</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full bg-background pt-14 sm:pt-16 lg:pt-20">
        {children}
      </div>
    </div>
  );
}
