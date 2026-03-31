"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CreateCourseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const steps = [
    { id: "step-1", name: "Basics", href: "/create-course" },
    { id: "step-2", name: "Curriculum", href: "/create-course/curriculum" },
    { id: "step-3", name: "Pricing", href: "/create-course/pricing" },
    { id: "step-4", name: "Publish", href: "/create-course/publish" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-black w-full relative">
      <header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 z-40 bg-black/80 backdrop-blur-xl border-b border-[#cafd00]/5">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-white tracking-tight font-headline">Course Builder</span>
          <div className="h-4 w-px bg-[#333]"></div>
          <nav className="flex gap-8">
            {steps.map((step) => {
              const isActive = step.href === "/create-course" ? pathname === "/create-course" : pathname.startsWith(step.href);
              return (
                <Link
                  key={step.id}
                  href={step.href}
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest pb-1 transition-all",
                    isActive
                      ? "text-[#cafd00] border-b-2 border-[#cafd00]"
                      : "text-[#919191] hover:text-white"
                  )}
                >
                  {step.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#919191] hover:text-[#fedc00] transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <button className="px-6 py-2 text-xs font-bold border border-[#333] text-[#e5e1e4] rounded-full hover:bg-white/5 hover:border-[#cafd00]/20 hover:text-white transition-all">
            Save Draft
          </button>
          <button onClick={() => router.push('/dashboard')} className="text-[#919191] hover:text-white transition-colors flex items-center justify-center pl-2 border-l border-[#333]">
            <span className="material-symbols-outlined ml-2">close</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full bg-black pt-16">
        {children}
      </div>
    </div>
  );
}
