"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang-context";

export default function LibraryPage() {
  const { t, lang } = useLang();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/catalog')
      .then(res => res.json())
      .then(data => { setCourses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const copyLink = (courseId: string) => {
    const url = `${window.location.origin}/learn/${courseId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(courseId);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#cafd00]/20 border-t-[#cafd00] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-16 max-w-[1400px] w-full mx-auto relative z-10">
      <header className="space-y-4 text-left">
        <h1 className="text-6xl font-black text-white font-headline tracking-tighter leading-none">{t("libraryTitle") || "Mening kutubxonam"}</h1>
        <p className="text-[#919191] text-lg max-w-2xl font-light">
          {t("librarySub") || "Chop etilgan kurslaringizni shu yerdan boshqaring. O'quvchilarga link yuboring."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course: any) => (
          <div key={course.id} className="group relative bg-[#111111] border border-white/5 rounded-[32px] p-8 space-y-6 hover:border-[#cafd00]/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="aspect-square bg-black rounded-2xl overflow-hidden border border-white/5 relative">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                  <span className="material-symbols-outlined text-5xl">menu_book</span>
                </div>
              )}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-[9px] font-black text-[#cafd00] uppercase tracking-widest">{course.is_free ? 'BEPUL' : `$${course.price}`}</span>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#444] uppercase tracking-widest">{course.modules_count || 0} MODUL · {course.lessons_count || 0} DARS</p>
                <h5 className="text-xl font-bold text-white tracking-tight group-hover:text-[#cafd00] transition-colors">{course.title}</h5>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => copyLink(course.id)}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    copied === course.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-[#cafd00]/5 border-[#cafd00]/10 text-[#cafd00] hover:bg-[#cafd00]/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {copied === course.id ? 'check_circle' : 'bolt'}
                  </span>
                  {copied === course.id ? 'LINK NUSXALANDI!' : "O'QUVCHIGA LINK YUBORISH"}
                </button>

                <div className="flex gap-2">
                  <Link href={`/courses/${course.id}`} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all border border-white/5">
                    TAHRIRLASH
                  </Link>
                  <Link href={`/learn/${course.id}`} className="flex-1 bg-black hover:bg-[#111] text-[#666] hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all border border-white/5 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-xs">visibility</span>
                    KO'RISH
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Prominent Add Button (Neon yellow design as requested) */}
        <Link href="/create-course" className="group relative bg-[#cafd00]/5 border-2 border-dashed border-[#cafd00]/20 rounded-[32px] p-8 flex flex-col items-center justify-center gap-6 min-h-[400px] hover:border-[#cafd00] hover:bg-[#cafd00]/10 transition-all duration-500 active:scale-[0.98] cursor-pointer shadow-[0_0_50px_rgba(202,253,0,0.05)]">
           <div className="w-20 h-20 rounded-full bg-[#cafd00] text-black flex items-center justify-center shadow-[0_20px_40px_rgba(202,253,0,0.4)] transition-transform duration-500 group-hover:scale-110">
             <span className="material-symbols-outlined text-4xl font-black">add</span>
           </div>
           <div className="text-center">
             <p className="text-2xl font-black text-[#cafd00] uppercase tracking-tighter leading-none mb-2">YANGI KURS</p>
             <p className="text-[10px] font-bold text-[#444] group-hover:text-[#666] uppercase tracking-[0.3em] transition-colors font-body">DARS ARXITEKTURASINI BOSHLANG</p>
           </div>
        </Link>
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-32 bg-[#111]/50 rounded-[40px] border-2 border-dashed border-white/5">
             <span className="material-symbols-outlined text-7xl text-[#222] mb-6">folder_special</span>
             <h3 className="text-2xl font-bold text-white mb-2 font-headline">{t("libraryEmpty") || "Kutubxona bo'sh"}</h3>
             <p className="text-[#666] text-sm font-medium">{t("startBuilding") || "Birinchi kursingizni yuklab ko'ring."}</p>
        </div>
      )}
    </div>
  );
}
