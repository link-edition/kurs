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
        <div className="w-10 h-10 border-2 border-[#cafd00]/20 border-t-[#cafd00] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1400px] w-full mx-auto relative z-10">
      <header className="space-y-2 text-left">
        <h1 className="text-4xl font-black text-white font-headline tracking-tighter leading-tight">{t("libraryTitle") || "Mening kutubxonam"}</h1>
        <p className="text-[#666] text-base max-w-2xl font-medium">
          {t("librarySub") || "Chop etilgan kurslaringizni shu yerdan boshqaring. O'quvchilarga link yuboring."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any) => (
          <div key={course.id} className="group relative bg-[#111] border border-white/5 rounded-3xl p-6 space-y-5 hover:border-[#cafd00]/20 transition-all duration-500">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/5 relative">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-100" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                  <span className="material-symbols-outlined text-4xl">menu_book</span>
                </div>
              )}
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-[8px] font-black text-[#cafd00] uppercase tracking-widest">{course.is_free ? 'BEPUL' : `$${course.price}`}</span>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-[#444] uppercase tracking-widest">{course.modules_count || 0} MODUL · {course.lessons_count || 0} DARS</p>
                <h5 className="text-lg font-bold text-white tracking-tight group-hover:text-[#cafd00] transition-colors line-clamp-1">{course.title}</h5>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => copyLink(course.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                    copied === course.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-[#cafd00]/5 border-[#cafd00]/10 text-[#cafd00] hover:bg-[#cafd00]/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {copied === course.id ? 'check_circle' : 'bolt'}
                  </span>
                  {copied === course.id ? 'NUSXALANDI!' : "LINK YUBORISH"}
                </button>

                <div className="flex gap-2">
                  <Link href={`/courses/${course.id}`} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-center transition-all border border-white/5">
                    TAHRIRLASH
                  </Link>
                  <Link href={`/learn/${course.id}`} className="flex-1 bg-black hover:bg-[#111] text-[#444] hover:text-white py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-center transition-all border border-white/5 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-xs">visibility</span>
                    KO'RISH
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Prominent Add Button (Neon yellow design as requested) */}
        <Link href="/create-course" className="group relative bg-[#cafd00]/5 border-2 border-dashed border-[#cafd00]/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 min-h-[280px] hover:border-[#cafd00]/40 transition-all duration-500 active:scale-[0.98] cursor-pointer">
           <div className="w-14 h-14 rounded-full bg-[#cafd00] text-black flex items-center justify-center shadow-[0_15px_30px_rgba(202,253,0,0.3)] transition-transform duration-500 group-hover:scale-110">
             <span className="material-symbols-outlined text-3xl font-black">add</span>
           </div>
           <div className="text-center">
             <p className="text-xl font-black text-[#cafd00] uppercase tracking-tighter leading-none mb-1">YANGI KURS</p>
             <p className="text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] font-body">DARS ARXIVIDAGI YANGI LOYIHA</p>
           </div>
        </Link>
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-20 bg-[#111]/50 rounded-[32px] border-2 border-dashed border-white/5">
             <span className="material-symbols-outlined text-6xl text-[#222] mb-4">folder_special</span>
             <h3 className="text-xl font-bold text-white mb-2 font-headline">{t("libraryEmpty") || "Kutubxona bo'sh"}</h3>
             <p className="text-[#666] text-sm font-medium">{t("startBuilding") || "Birinchi kursingizni yuklab ko'ring."}</p>
        </div>
      )}
    </div>
  );
}
