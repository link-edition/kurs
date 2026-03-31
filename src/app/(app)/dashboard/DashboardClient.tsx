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
            <Link href="/create-course" className="bg-[#cafd00] text-[#516700] px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              {t("newProject")}
            </Link>
          </div>
          <div className="bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#cafd00]/5">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fedc00]">{t("courseTitle")}</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fedc00]">{t("structure")}</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fedc00] text-right">{t("createdDate")}</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fedc00] text-right">{t("price")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {courses.length > 0 ? (
                  courses.map((course: any) => (
                    <tr key={course.id} className="hover:bg-[#cafd00]/5 transition-colors group cursor-pointer">
                      <td className="px-8 py-6">
                        <Link href={`/courses/${course.id}`} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#333333] border border-[rgba(202,253,0,0.1)] flex items-center justify-center text-[10px] font-bold text-[#cafd00]">
                            {course.title.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-white group-hover:text-[#cafd00] transition-colors">{course.title}</span>
                        </Link>
                      </td>
                      <td className="px-8 py-6"><span className="text-sm text-[#919191] font-headline">{course.modules_count} {t("modules")}</span></td>
                      <td className="px-8 py-6 text-right"><span className="text-sm text-[#919191]">{new Date(course.created_at).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'en-US')}</span></td>
                      <td className="px-8 py-6 text-right"><span className="text-sm font-bold text-[#cafd00]">${course.price}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <span className="material-symbols-outlined text-5xl">folder_off</span>
                        <p className="text-sm font-bold uppercase tracking-widest text-[#919191]">{t("noCourses")}</p>
                        <Link href="/create-course" className="text-[#cafd00] hover:underline text-xs">{t("createFirst")}</Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
