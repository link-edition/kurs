"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { useAuth } from "@/lib/auth-context";
import { TopNav } from "@/components/TopNav";

export function DashboardClient({ stats, courses: initialCourses }: { stats: any, courses: any[] }) {
  const router = useRouter();
  const { t, lang } = useLang();
  const { user } = useAuth();
  
  // Local state for courses to allow immediate updates
  const [courses, setCourses] = useState(initialCourses);

  // Sync local state when props change (from router.refresh())
  useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);
  
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
        router.refresh();
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

  const greeting = user?.name 
    ? (lang === 'uz' ? `Salom, ${user.name}! ` : `Hello, ${user.name}! `) 
    : '';

  return (
    <>
      <TopNav />

      <div className="p-4 sm:p-6 md:p-8 lg:p-12 space-y-8 sm:space-y-12 lg:space-y-16 max-w-[1400px] w-full mx-auto relative z-10">
        <section className="space-y-2 pt-2 sm:pt-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none text-foreground font-headline uppercase italic tracking-tighter">{t("dashboard")}</h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl font-light">
            {greeting}{t("welcomeBack")}
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Revenue */}
          <div className="bg-card backdrop-blur-[20px] border border-border p-5 sm:p-6 lg:p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-500 cursor-default shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="p-2.5 sm:p-3 bg-[#cafd00]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#cafd00] text-lg sm:text-2xl">payments</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 sm:px-3 py-1 rounded-full border border-border"> 0% </span>
            </div>
            <p className="text-[#a58d00] dark:text-[#fedc00] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1">{t("totalRevenue")}</p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-headline uppercase italic">${stats.totalRevenue}</h3>
          </div>

          {/* Students */}
          <div className="bg-card backdrop-blur-[20px] border border-border p-5 sm:p-6 lg:p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-500 cursor-default shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="p-2.5 sm:p-3 bg-[#cafd00]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#cafd00] text-lg sm:text-2xl">group</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 sm:px-3 py-1 rounded-full border border-border"> 0% </span>
            </div>
            <p className="text-[#a58d00] dark:text-[#fedc00] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1">{t("activeStudents")}</p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-headline uppercase italic">{stats.totalStudents}</h3>
          </div>

          {/* Courses */}
          <div className="bg-card backdrop-blur-[20px] border border-border p-5 sm:p-6 lg:p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-500 cursor-default sm:col-span-2 md:col-span-1 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="p-2.5 sm:p-3 bg-[#cafd00]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#cafd00] text-lg sm:text-2xl">menu_book</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 sm:px-3 py-1 rounded-full border border-border"> {lang === 'uz' ? 'FAOL' : 'ACTIVE'} </span>
            </div>
            <p className="text-[#a58d00] dark:text-[#fedc00] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1">{t("coursesCreated")}</p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-headline uppercase italic">{stats.totalCourses}</h3>
          </div>
        </section>

        <section className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-headline uppercase italic">{t("recentCourses")}</h4>
            <Link href="/create-course" className="bg-[#cafd00] text-[#516700] px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_10px_30px_rgba(202,253,0,0.3)] shrink-0">
              <span className="material-symbols-outlined text-base font-black">add</span>
              {t("newProject")}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Existing Courses */}
            {courses.map((course: any) => (
              <div key={course.id} className="group relative bg-card border border-border rounded-[32px] p-5 space-y-5 hover:border-[#cafd00]/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col">
                {/* Settings Icon */}
                <button 
                  onClick={() => openEditModal(course)}
                  className="absolute top-4 left-4 z-20 w-9 h-9 rounded-xl bg-card/60 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:text-[#cafd00] transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                </button>

                <div className="aspect-video bg-muted rounded-2xl overflow-hidden border border-border relative">
                  {course.image_url && course.image_url.trim() !== "" ? (
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-100 dark:brightness-75 dark:group-hover:brightness-100" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-40 bg-muted/20">
                      <span className="material-symbols-outlined text-4xl font-light text-foreground">menu_book</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/80 dark:bg-black/40 backdrop-blur-md border border-border">
                    <span className="text-[9px] font-black text-[#516700] dark:text-[#cafd00] uppercase tracking-widest">{course.is_free ? t("free") : `$${course.price}`}</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1 opacity-50">{course.modules_count} {t("modules")}</p>
                    <h5 className="text-lg font-black text-foreground tracking-tight group-hover:text-[#cafd00] transition-colors line-clamp-1 uppercase italic">{course.title}</h5>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Link href={`/courses/${course.id}`} className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all border border-border">
                      {t("edit")}
                    </Link>
                    <Link href={`/learn/${course.id}`} className="flex-1 bg-foreground text-background hover:opacity-90 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all shadow-lg shadow-black/5 dark:shadow-none">
                      {t("view")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Bright Add New Button */}
            <Link href="/create-course" className="group relative bg-[#cafd00]/5 border-2 border-dashed border-[#cafd00]/10 rounded-[24px] sm:rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 min-h-[250px] sm:min-h-[300px] hover:border-[#cafd00] hover:bg-[#cafd00]/10 transition-all duration-500 active:scale-[0.98] cursor-pointer shadow-[0_0_50px_rgba(202,253,0,0.05)]">
               <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-[#cafd00] text-[#516700] flex items-center justify-center shadow-[0_20px_40px_rgba(202,253,0,0.3)] transition-transform duration-500 group-hover:scale-110">
                 <span className="material-symbols-outlined text-2xl sm:text-3xl font-black">add</span>
               </div>
               <div className="text-center">
                 <p className="text-base sm:text-lg font-black text-[#8a8a00] dark:text-[#cafd00] uppercase tracking-tighter leading-none">{t("newProject")}</p>
                 <p className="text-[9px] font-bold text-[#8a8a00]/50 dark:text-[#cafd00]/50 uppercase tracking-[0.2em] mt-1">
                   {lang === 'uz' ? 'Dars arxitekturasini boshlang' : 'Start building your course'}
                 </p>
               </div>
            </Link>
          </div>
        </section>

        <section className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
            <div>
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-headline uppercase italic">{t("revenuePerf")}</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">{t("revenueSub")}</p>
            </div>
          </div>
          <div className="w-full h-[250px] sm:h-[300px] lg:h-[400px] bg-card backdrop-blur-[20px] border border-border rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <svg className="w-full h-full preserve-3d" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#cafd00" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#cafd00" stopOpacity="0"></stop>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#cafd00"></stop>
                  <stop offset="100%" stopColor="#a58d00"></stop>
                </linearGradient>
              </defs>
              <line stroke="currentColor" className="text-border" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
              <line stroke="currentColor" className="text-border" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150"></line>
              <line stroke="currentColor" className="text-border" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250"></line>
              <path d="M0,250 L0,200 C100,180 150,220 250,150 C350,80 450,120 550,60 C650,0 750,180 850,120 C950,60 1000,80 1000,80 L1000,250 Z" fill="url(#chartGradient)"></path>
              <path d="M0,200 C100,180 150,220 250,150 C350,80 450,120 550,60 C650,0 750,180 850,120 C950,60 1000,80 1000,80" fill="none" stroke="url(#lineGradient)" strokeLinecap="round" strokeWidth="4"></path>
            </svg>
          </div>
        </section>
      </div>
      
      <footer className="mt-12 sm:mt-16 lg:mt-24 px-4 sm:px-8 lg:px-12 py-8 sm:py-12 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 relative z-10 w-full">
        <span>© 2026 Course Architect</span>
        <div className="flex gap-4 sm:gap-8">
          <Link className="hover:text-[#cafd00] transition-colors" href="#">{lang === 'uz' ? 'Maxfiylik siyosati' : 'Privacy Policy'}</Link>
          <Link className="hover:text-[#cafd00] transition-colors" href="#">{lang === 'uz' ? 'Xizmat holati' : 'Service Status'}</Link>
        </div>
      </footer>

      {/* Edit Course Modal */}
      {isEditModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsEditModalOpen(false)}></div>
          
          <div className="relative w-full max-w-lg bg-card border border-border rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col font-body">
            <div className="p-5 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto">
              <header className="flex justify-between items-start">
                <div>
                  <label className="text-[10px] items-center gap-2 uppercase tracking-[0.3em] font-black text-[#a58d00] dark:text-[#fedc00] mb-2 flex font-headline">
                    <span className="material-symbols-outlined text-sm">architecture</span> 
                    {lang === 'uz' ? 'Sozlamalar' : 'Settings'}
                  </label>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tighter leading-none font-headline uppercase italic">
                    {lang === 'uz' ? 'Tahrirlash.' : 'Edit.'}
                  </h2>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </header>

              <div className="space-y-5 sm:space-y-6">
                {/* Image Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative aspect-[16/9] bg-muted rounded-2xl overflow-hidden border border-border cursor-pointer hover:border-[#cafd00]/30 transition-all duration-500 shadow-inner"
                >
                  {editingCourse.image_url && editingCourse.image_url.trim() !== "" ? (
                    <img src={editingCourse.image_url} alt="Thumbnail preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-100 dark:brightness-50 dark:group-hover:brightness-75" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="material-symbols-outlined text-3xl text-muted-foreground">add_photo_alternate</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-background/20 dark:bg-black/40 backdrop-blur-[2px]">
                    <div className="w-10 h-10 rounded-full bg-[#cafd00] text-black flex items-center justify-center mb-1 shadow-[0_10px_20px_rgba(202,253,0,0.3)]">
                      <span className="material-symbols-outlined text-xl font-black">upload</span>
                    </div>
                    <span className="text-[8px] font-black text-[#cafd00] uppercase tracking-widest">
                      {lang === 'uz' ? 'Rasm almashtirish' : 'Change image'}
                    </span>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                {/* Title Input */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-black font-headline ml-1">
                    {lang === 'uz' ? 'Kurs nomi' : 'Course title'}
                  </label>
                  <input 
                    type="text" 
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full bg-muted border border-border px-6 py-4 rounded-2xl text-lg font-black text-foreground placeholder-muted-foreground focus:border-[#cafd00]/50 transition-all font-headline focus:outline-none shadow-sm"
                    placeholder={lang === 'uz' ? 'Kiriting...' : 'Enter...'}
                  />
                </div>

                {/* Status Toggle & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black font-headline">Status</label>
                    <div className="flex bg-muted p-1 rounded-xl border border-border">
                      <button 
                        onClick={() => setEditingCourse({ ...editingCourse, is_free: true, price: 0 })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${editingCourse.is_free ? 'bg-[#cafd00] text-black shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {lang === 'uz' ? 'Bepul' : 'Free'}
                      </button>
                      <button 
                        onClick={() => setEditingCourse({ ...editingCourse, is_free: false })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!editingCourse.is_free ? 'bg-[#fedc00] text-black shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {lang === 'uz' ? 'Pullik' : 'Paid'}
                      </button>
                    </div>
                  </div>

                  {!editingCourse.is_free && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-[#a58d00] dark:text-[#fedc00] font-black font-headline">{lang === 'uz' ? 'Narxi ($)' : 'Price ($)'}</label>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-bold text-[#a58d00] dark:text-[#fedc00] font-headline">$</span>
                        <input 
                          type="number" 
                          value={editingCourse.price || ''}
                          onChange={(e) => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-transparent border-none pl-5 pr-0 py-2 text-lg sm:text-xl font-bold text-foreground placeholder-muted-foreground focus:ring-0 border-b border-border focus:border-[#fedc00] transition-all font-headline focus:outline-none"
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
                  className="w-full bg-[#cafd00] text-[#516700] py-4 sm:py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_15px_30px_-5px_rgba(202,253,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">verified</span>
                      {lang === 'uz' ? 'Saqlash' : 'Save'}
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
