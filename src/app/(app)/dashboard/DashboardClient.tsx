"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useLang } from "@/lib/lang-context";
import { TopNav } from "@/components/TopNav";

export function DashboardClient({ stats, courses: initialCourses }: { stats: any, courses: any[] }) {
  const { t, lang } = useLang();
  
  // Local state for courses to allow immediate updates
  const [courses, setCourses] = useState(initialCourses);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEditModal = (course: any) => {
    setEditingCourse({ ...course });
    setIsEditModalOpen(true);
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/courses/${editingCourse.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingCourse.title,
          thumbnail: editingCourse.image_url,
          price: editingCourse.price,
          isFree: editingCourse.is_free
        }),
      });

      if (response.ok) {
        // Update local state
        setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...editingCourse } : c));
        setIsEditModalOpen(false);
      } else {
        alert("Xatolik yuz berdi");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCourse({ ...editingCourse, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

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
            <Link href="/create-course" className="bg-[#cafd00] text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_10px_30px_rgba(202,253,0,0.3)]">
              <span className="material-symbols-outlined text-base font-black">add</span>
              {t("newProject")}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Existing Courses */}
            {courses.map((course: any) => (
              <div key={course.id} className="group relative bg-[#111111] border border-white/5 rounded-[32px] p-6 space-y-5 hover:border-[#cafd00]/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Settings Icon */}
                <button 
                  onClick={() => openEditModal(course)}
                  className="absolute top-4 left-4 z-20 w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-[#cafd00] hover:bg-white/20 transition-all shadow-lg"
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                </button>

                <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/5 relative">
                  {course.image_url ? (
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                      <span className="material-symbols-outlined text-4xl font-light text-white">menu_book</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                    <span className="text-[8px] font-black text-[#cafd00] uppercase tracking-widest">{course.is_free ? t("free") : `$${course.price}`}</span>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-[#444] uppercase tracking-widest">{course.modules_count} {t("modules")}</p>
                    <h5 className="text-lg font-bold text-white tracking-tight group-hover:text-[#cafd00] transition-colors line-clamp-1">{course.title}</h5>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/courses/${course.id}`} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-center transition-all border border-white/5">
                      {t("edit")}
                    </Link>
                    <Link href={`/preview/${course.id}`} className="flex-1 bg-black hover:bg-[#111] text-[#444] hover:text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-center transition-all border border-white/5">
                      {t("view")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Bright Add New Button */}
            <Link href="/create-course" className="group relative bg-[#cafd00]/5 border-2 border-dashed border-[#cafd00]/10 rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 min-h-[300px] hover:border-[#cafd00] hover:bg-[#cafd00]/10 transition-all duration-500 active:scale-[0.98] cursor-pointer shadow-[0_0_50px_rgba(202,253,0,0.05)]">
               <div className="w-16 h-16 rounded-full bg-[#cafd00] text-black flex items-center justify-center shadow-[0_20px_40px_rgba(202,253,0,0.3)] transition-transform duration-500 group-hover:scale-110">
                 <span className="material-symbols-outlined text-3xl font-black">add</span>
               </div>
               <div className="text-center">
                 <p className="text-lg font-black text-[#cafd00] uppercase tracking-tighter mix-blend-difference leading-none">{t("newProject")}</p>
                 <p className="text-[9px] font-bold text-[#cafd00]/50 uppercase tracking-[0.2em] mt-1">Dars arxitekturasini boshlang</p>
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

      {/* Edit Course Modal */}
      {isEditModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsEditModalOpen(false)}></div>
          
          <div className="relative w-full max-w-lg bg-[#111] border border-[#cafd00]/20 rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col font-body">
            <div className="p-8 space-y-8 overflow-y-auto">
              <header className="flex justify-between items-start">
                <div>
                  <label className="text-[10px] items-center gap-2 uppercase tracking-[0.3em] font-black text-[#fedc00] mb-2 flex font-headline">
                    <span className="material-symbols-outlined text-sm">architecture</span> 
                    Sozlamalar
                  </label>
                  <h2 className="text-3xl font-black text-white tracking-tighter leading-none font-headline uppercase italic">Tahrirlash.</h2>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-[#666] hover:text-white">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </header>

              <div className="space-y-6">
                {/* Image Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative aspect-[16/9] bg-black rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#cafd00]/30 transition-all duration-500"
                >
                  {editingCourse.image_url ? (
                    <img src={editingCourse.image_url} alt="Thumbnail preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-50 group-hover:brightness-75" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <span className="material-symbols-outlined text-3xl text-[#333]">add_photo_alternate</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-10 h-10 rounded-full bg-[#cafd00] text-black flex items-center justify-center mb-1 shadow-[0_10px_20px_rgba(202,253,0,0.3)]">
                      <span className="material-symbols-outlined text-xl font-black">upload</span>
                    </div>
                    <span className="text-[8px] font-black text-[#cafd00] uppercase tracking-widest">Rasm almashtirish</span>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-[#666] font-black font-headline">Kurs nomi</label>
                  <input 
                    type="text" 
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full bg-transparent border-none px-0 py-1.5 text-xl font-bold text-white placeholder-[#333] focus:ring-0 border-b border-[#333] focus:border-[#cafd00] transition-all font-headline focus:outline-none"
                    placeholder="Kiriting..."
                  />
                </div>

                {/* Status Toggle & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-[#666] font-black font-headline">Status</label>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                      <button 
                        onClick={() => setEditingCourse({ ...editingCourse, is_free: true, price: 0 })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${editingCourse.is_free ? 'bg-[#cafd00] text-black shadow-lg' : 'text-[#666] hover:text-white'}`}
                      >
                        Bepul
                      </button>
                      <button 
                        onClick={() => setEditingCourse({ ...editingCourse, is_free: false })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!editingCourse.is_free ? 'bg-[#fedc00] text-black shadow-lg' : 'text-[#666] hover:text-white'}`}
                      >
                        Pullik
                      </button>
                    </div>
                  </div>

                  {!editingCourse.is_free && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-[#fedc00] font-black font-headline">Narxi ($)</label>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-bold text-[#fedc00] font-headline">$</span>
                        <input 
                          type="number" 
                          value={editingCourse.price || ''}
                          onChange={(e) => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-transparent border-none pl-5 pr-0 py-2 text-xl font-bold text-white placeholder-[#333] focus:ring-0 border-b border-[#fedc00]/30 focus:border-[#fedc00] transition-all font-headline focus:outline-none"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <footer className="pt-4">
                <button 
                  onClick={handleUpdateCourse}
                  disabled={isUpdating}
                  className="w-full bg-[#cafd00] text-[#516700] py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_15px_30px_-5px_rgba(202,253,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">verified</span>
                      Saqlash
                    </>
                  )}
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
