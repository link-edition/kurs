"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { TopNav } from "@/components/TopNav";

export function DashboardClient({ stats, courses }: { stats: any, courses: any[] }) {
  const { t, lang } = useLang();

  return (
    <>
      <TopNav />

      <div className="p-12 space-y-16 max-w-[1400px] w-full mx-auto relative z-10">
        <section className="space-y-2">
          <h2 className="text-6xl font-bold tracking-tighter leading-none text-white font-headline">{t("dashboard")}</h2>
          <p className="text-[#919191] text-lg max-w-2xl font-light">
            {t("welcomeBack")}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Revenue */}
          <div className="bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-500 cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#cafd00]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#cafd00]">payments</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#919191] bg-white/5 px-3 py-1 rounded-full border border-white/10"> 0% </span>
            </div>
            <p className="text-[#fedc00] text-xs font-bold uppercase tracking-[0.2em] mb-1">{t("totalRevenue")}</p>
            <h3 className="text-4xl font-bold tracking-tight text-white font-headline">${stats.totalRevenue}</h3>
          </div>

          {/* Students */}
          <div className="bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-500 cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#cafd00]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#cafd00]">group</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#919191] bg-white/5 px-3 py-1 rounded-full border border-white/10"> 0% </span>
            </div>
            <p className="text-[#fedc00] text-xs font-bold uppercase tracking-[0.2em] mb-1">{t("activeStudents")}</p>
            <h3 className="text-4xl font-bold tracking-tight text-white font-headline">{stats.totalStudents}</h3>
          </div>

          {/* Courses */}
          <div className="bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-500 cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#cafd00]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#cafd00]">menu_book</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#919191] bg-white/5 px-3 py-1 rounded-full border border-white/10"> {lang === 'uz' ? 'FAOL' : 'ACTIVE'} </span>
            </div>
            <p className="text-[#fedc00] text-xs font-bold uppercase tracking-[0.2em] mb-1">{t("coursesCreated")}</p>
            <h3 className="text-4xl font-bold tracking-tight text-white font-headline">{stats.totalCourses}</h3>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-bold tracking-tight text-white font-headline">{t("recentCourses")}</h4>
            <Link href="/create-course" className="bg-[#cafd00] text-black px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_10px_30px_rgba(202,253,0,0.3)]">
              <span className="material-symbols-outlined text-lg font-black">add</span>
              {t("newProject")}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Existing Courses */}
            {courses.map((course: any) => (
              <div key={course.id} className="group relative bg-[#111111] border border-white/5 rounded-[32px] p-8 space-y-6 hover:border-[#cafd00]/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="aspect-square bg-black rounded-2xl overflow-hidden border border-white/5 relative">
                  {course.image_url ? (
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                      <span className="material-symbols-outlined text-5xl">menu_book</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                    <span className="text-[9px] font-black text-[#cafd00] uppercase tracking-widest">{course.is_free ? t("free") : `$${course.price}`}</span>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[#444] uppercase tracking-widest">{course.modules_count} {t("modules")}</p>
                    <h5 className="text-xl font-bold text-white tracking-tight group-hover:text-[#cafd00] transition-colors">{course.title}</h5>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/courses/${course.id}`} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all border border-white/5">
                      {t("edit")}
                    </Link>
                    <Link href={`/preview/${course.id}`} className="flex-1 bg-black hover:bg-[#111] text-[#666] hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all border border-white/5">
                      {t("view")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Bright Add New Button */}
            <Link href="/create-course" className="group relative bg-[#cafd00]/5 border-2 border-dashed border-[#cafd00]/20 rounded-[32px] p-8 flex flex-col items-center justify-center gap-6 min-h-[400px] hover:border-[#cafd00] hover:bg-[#cafd00]/10 transition-all duration-500 active:scale-[0.98] cursor-pointer shadow-[0_0_50px_rgba(202,253,0,0.05)]">
               <div className="w-20 h-20 rounded-full bg-[#cafd00] text-black flex items-center justify-center shadow-[0_20px_40px_rgba(202,253,0,0.3)] transition-transform duration-500 group-hover:scale-110">
                 <span className="material-symbols-outlined text-4xl font-black">add</span>
               </div>
               <div className="text-center">
                 <p className="text-xl font-black text-[#cafd00] uppercase tracking-tighter mix-blend-difference leading-none">{t("newProject")}</p>
                 <p className="text-[10px] font-bold text-[#cafd00]/50 uppercase tracking-[0.2em] mt-2">Dars arxitekturasini boshlang</p>
               </div>
            </Link>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold tracking-tight text-white font-headline">{t("revenuePerf")}</h4>
              <p className="text-[#919191] text-sm">{t("revenueSub")}</p>
            </div>
          </div>
          <div className="w-full h-[400px] bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] rounded-2xl p-8 relative overflow-hidden">
            <svg className="w-full h-full preserve-3d" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#cafd00" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#cafd00" stopOpacity="0"></stop>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#cafd00"></stop>
                  <stop offset="100%" stopColor="#fedc00"></stop>
                </linearGradient>
              </defs>
              <line stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
              <line stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150"></line>
              <line stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250"></line>
              <path d="M0,250 L0,200 C100,180 150,220 250,150 C350,80 450,120 550,60 C650,0 750,180 850,120 C950,60 1000,80 1000,80 L1000,250 Z" fill="url(#chartGradient)"></path>
              <path d="M0,200 C100,180 150,220 250,150 C350,80 450,120 550,60 C650,0 750,180 850,120 C950,60 1000,80 1000,80" fill="none" stroke="url(#lineGradient)" strokeLinecap="round" strokeWidth="4"></path>
            </svg>
          </div>
        </section>
      </div>
      
      <footer className="mt-24 px-12 py-12 border-t border-[#cafd00]/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#919191]/50 relative z-10 w-full">
        <span>© 2026 Course Architect</span>
        <div className="flex gap-8">
          <Link className="hover:text-[#cafd00] transition-colors" href="#">{lang === 'uz' ? 'Maxfiylik siyosati' : 'Privacy Policy'}</Link>
          <Link className="hover:text-[#cafd00] transition-colors" href="#">{lang === 'uz' ? 'Xizmat holati' : 'Service Status'}</Link>
        </div>
      </footer>
    </>
  );
}
