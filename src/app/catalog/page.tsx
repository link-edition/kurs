"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CatalogPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/catalog')
      .then(res => res.json())
      .then(data => { setCourses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/catalog" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#cafd00] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#516700] text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <span className="text-sm font-bold tracking-tight">Course Architect</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xs text-[#919191] hover:text-white transition-colors font-medium">
              Boshqaruv paneli →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4">Barcha kurslar</h1>
        <p className="text-[#919191] text-lg max-w-xl">Professional bilim va ko&apos;nikmalarni onlayn o&apos;rganing. Har bir kurs amaliy darslar va video materiallar bilan boyitilgan.</p>
      </section>

      {/* Course Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#cafd00]/20 border-t-[#cafd00] rounded-full animate-spin"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-[#333] block mb-4">school</span>
            <h3 className="text-xl font-bold text-white mb-2">Hozircha kurslar mavjud emas</h3>
            <p className="text-[#666] text-sm">Tez orada yangi kurslar qo&apos;shiladi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Link key={course.id} href={`/learn/${course.id}`} className="group">
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#cafd00]/20 transition-all duration-300">
                  <div className="aspect-video bg-[#0a0a0a] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,253,0,0.05)_0%,transparent_70%)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#cafd00]/10 group-hover:text-[#cafd00]/30 transition-colors">play_circle</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {course.is_free ? (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 backdrop-blur-md">Bepul</span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#cafd00] bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">${course.price}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-white group-hover:text-[#cafd00] transition-colors tracking-tight">{course.title}</h3>
                    {course.subtitle && <p className="text-xs text-[#777] line-clamp-2">{course.subtitle}</p>}
                    <div className="flex items-center gap-3 text-[10px] text-[#555] font-medium uppercase tracking-widest pt-1">
                      <span>{course.modules_count} modul</span>
                      <span className="text-[#333]">·</span>
                      <span>{course.lessons_count} dars</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#444]">
          <span>© 2026 Course Architect</span>
          <span>Professional ta&apos;lim platformasi</span>
        </div>
      </footer>
    </div>
  );
}
