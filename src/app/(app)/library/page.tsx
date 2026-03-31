"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LibraryPage() {
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
    <div className="p-12 space-y-12 max-w-[1400px] w-full mx-auto relative z-10">
      <header className="space-y-4">
        <h1 className="text-5xl font-bold text-white font-headline tracking-tighter">Mening kutubxonam</h1>
        <p className="text-[#919191] text-lg max-w-2xl font-light">
          Chop etilgan kurslaringizni shu yerdan boshqaring. O&apos;quvchilarga link yuboring.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course: any) => (
          <div key={course.id} className="bg-[#262626]/40 backdrop-blur-xl border border-[#cafd00]/10 rounded-3xl overflow-hidden group hover:border-[#cafd00]/30 transition-all duration-500">
            <div className="aspect-video bg-[#111] relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,253,0,0.1)_0%,transparent_70%)]"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-[#cafd00]/20">menu_book</span>
               </div>
               <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-[#fedc00] uppercase tracking-widest">
                 {course.is_free ? 'Bepul' : `$${course.price}`}
               </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white font-headline tracking-tight group-hover:text-[#cafd00] transition-colors">{course.title}</h3>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#666]">
                 <span>{course.modules_count} modul · {course.lessons_count} dars</span>
              </div>

              {/* Share Link for Students */}
              <button
                onClick={() => copyLink(course.id)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all border ${
                  copied === course.id
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-[#cafd00]/10 border-[#cafd00]/20 text-[#cafd00] hover:bg-[#cafd00]/20'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {copied === course.id ? 'check_circle' : 'share'}
                </span>
                {copied === course.id ? 'Link nusxalandi!' : "O'quvchiga link yuborish"}
              </button>

              <div className="flex gap-2">
                <Link href={`/courses/${course.id}`} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-all text-center">
                  Tahrirlash
                </Link>
                <Link href={`/learn/${course.id}`} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#919191] transition-all text-center flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-xs">visibility</span>
                  Ko&apos;rish
                </Link>
              </div>
            </div>
          </div>
        ))}

        <Link href="/create-course" className="border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center min-h-[400px] hover:border-[#cafd00]/20 transition-all group">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[#cafd00]/20 group-hover:scale-110 transition-all">
               <span className="material-symbols-outlined text-white/20 group-hover:text-[#cafd00]">add</span>
            </div>
            <span className="mt-6 text-[11px] font-bold uppercase tracking-widest text-[#666]">Yangi kurs yaratish</span>
        </Link>
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20 bg-[#111]/50 rounded-3xl border border-dashed border-white/5">
             <span className="material-symbols-outlined text-6xl text-[#333] mb-4">folder_off</span>
             <h3 className="text-xl font-bold text-white mb-2">Kutubxona bo&apos;sh</h3>
             <p className="text-[#666] text-sm">Birinchi kursingizni yuklab ko&apos;ring.</p>
        </div>
      )}
    </div>
  );
}
