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
    { id: "step-4", name: t("publish"), href: "/create-course/publish" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-black w-full relative font-body tracking-tight">
      <header className="fixed top-0 right-0 left-64 h-20 flex justify-between items-center px-12 z-40 bg-black/80 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-10">
          <span className="text-xl font-black text-white tracking-[-0.03em] font-headline uppercase italic">
            Course <span className="text-[#cafd00]">Architect</span>
          </span>
          <div className="h-4 w-px bg-white/10"></div>
          <nav className="flex gap-10">
            {steps.map((step) => {
              const isActive = step.href === "/create-course" ? pathname === "/create-course" : pathname.startsWith(step.href);
              return (
                <Link
                  key={step.id}
                  href={step.href}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] pb-1 transition-all",
                    isActive
                      ? "text-[#cafd00] border-b-2 border-[#cafd00] shadow-[0_4px_10px_rgba(202,253,0,0.2)]"
                      : "text-[#555] hover:text-white"
                  )}
                >
                  {step.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[#555] hover:text-[#fedc00] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-white/5">
            <span className="material-symbols-outlined text-xl">help_outline</span>
          </button>
          <button className="px-8 py-2.5 text-[10px] font-black uppercase tracking-widest border border-white/10 text-[#888] rounded-full hover:bg-white/5 hover:border-[#cafd00]/20 hover:text-white transition-all shadow-xl">
            {t("saveDraft")}
          </button>
          <button onClick={() => router.push('/dashboard')} className="text-[#555] hover:text-white transition-colors flex items-center justify-center pl-6 border-l border-white/10 group">
            <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">close</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full bg-black pt-20">
        {children}
      </div>
    </div>
  );
}
