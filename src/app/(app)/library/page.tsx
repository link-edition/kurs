"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";

export default function LibraryPage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCourses = () => {
    setLoading(true);
    fetch('/api/catalog')
      .then(res => res.json())
      .then(data => { setCourses(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const copyLink = (courseId: string) => {
    const url = `${window.location.origin}/learn/${courseId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(courseId);
      setTimeout(() => setCopied(null), 2000);
    });
  };

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
        setIsEditModalOpen(false);
        fetchCourses();
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

  if (loading && courses.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-background">
        <div className="w-10 h-10 border-2 border-[#cafd00]/20 border-t-[#cafd00] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1400px] w-full mx-auto relative z-10 bg-background text-foreground">
      <header className="space-y-4 text-left">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#cafd00] transition-colors group">
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{lang === 'uz' ? 'Dashboardga qaytish' : 'Back to Dashboard'}</span>
        </Link>
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-foreground font-headline tracking-tighter leading-tight uppercase italic underline decoration-[#cafd00]/30 underline-offset-8">
            {lang === 'uz' ? 'Mening kurslarim.' : 'My Library.'}
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl font-medium">
            {t("libDesc")}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course: any) => (
          <div key={course.id} className="group relative bg-card border border-border rounded-[40px] p-6 space-y-6 hover:border-[#cafd00]/50 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col">
            {/* Settings Icon - Absolute top right */}
            <button 
              onClick={() => openEditModal(course)}
              className="absolute top-4 left-4 z-20 w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:text-[#cafd00] transition-all shadow-md hover:rotate-90 duration-500"
            >
              <span className="material-symbols-outlined text-2xl">settings</span>
            </button>

            <div className="aspect-video bg-muted/20 rounded-[28px] overflow-hidden border border-border relative">
              {course.image_url ? (
                <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-100 dark:brightness-75 dark:group-hover:brightness-100" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center opacity-40 bg-muted/10">
                  <span className="material-symbols-outlined text-5xl text-foreground">menu_book</span>
                </div>
              )}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-background/80 dark:bg-black/60 backdrop-blur-md border border-border shadow-sm">
                <span className="text-[10px] font-black text-[#cafd00] uppercase tracking-widest">{course.is_free ? (lang === 'uz' ? 'BEPUL' : 'FREE') : `$${course.price}`}</span>
              </div>
            </div>

            <div className="space-y-5 text-left px-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-50">{course.modules_count || 0} {lang === 'uz' ? 'MODUL' : 'MODULES'} · {course.lessons_count || 0} {lang === 'uz' ? 'DARS' : 'LESSONS'}</p>
                <h5 className="text-xl font-black text-foreground tracking-tight group-hover:text-[#cafd00] transition-colors line-clamp-1 uppercase italic leading-none">{course.title}</h5>
              </div>
              
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => copyLink(course.id)}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all border shadow-lg active:scale-95 ${
                    copied === course.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500'
                      : 'bg-[#cafd00] border-[#cafd00] text-[#516700] hover:brightness-110 shadow-[0_10px_20px_-5px_rgba(202,253,0,0.3)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {copied === course.id ? 'check_circle' : 'bolt'}
                  </span>
                  {copied === course.id ? (lang === 'uz' ? 'NUSXALANDI!' : 'COPIED!') : (lang === 'uz' ? 'LINK YUBORISH' : 'SEND LINK')}
                </button>

                <div className="flex gap-3">
                  <Link href={`/courses/${course.id}`} className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-center transition-all border border-border active:scale-95">
                    {lang === 'uz' ? 'TAHRIRLASH' : 'EDIT'}
                  </Link>
                  <Link href={`/learn/${course.id}`} className="flex-1 bg-foreground text-background hover:opacity-90 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-center transition-all border border-border flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-black/5 dark:shadow-none">
                    <span className="material-symbols-outlined text-lg font-black">visibility</span>
                    {lang === 'uz' ? 'KO\'RISH' : 'VIEW'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Prominent Add Button (Neon yellow design as requested) */}
        <Link href="/create-course" className="group relative bg-[#cafd00]/5 dark:bg-[#cafd00]/5 border-2 border-dashed border-[#cafd00]/20 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 min-h-[280px] hover:border-[#cafd00]/60 transition-all duration-500 active:scale-[0.98] cursor-pointer">
           <div className="w-14 h-14 rounded-full bg-[#cafd00] text-[#516700] flex items-center justify-center shadow-[0_15px_30px_rgba(202,253,0,0.3)] transition-transform duration-500 group-hover:scale-110">
             <span className="material-symbols-outlined text-3xl font-black">add</span>
           </div>
           <div className="text-center">
             <p className="text-xl font-black text-[#cafd00] uppercase tracking-tighter leading-none mb-1">{lang === 'uz' ? 'YANGI KURS' : 'NEW COURSE'}</p>
             <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] font-body">{lang === 'uz' ? 'DARS ARXIVIDAGI YANGI LOYIHA' : 'NEW PROJECT IN LIBRARY'}</p>
           </div>
        </Link>
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-20 bg-muted/50 rounded-[32px] border-2 border-dashed border-border">
             <span className="material-symbols-outlined text-6xl text-muted-foreground mb-4 opacity-20">folder_special</span>
             <h3 className="text-xl font-bold text-foreground mb-2 font-headline">{t("libEmpty")}</h3>
             <p className="text-muted-foreground text-sm font-medium">{t("uploadFirst")}</p>
        </div>
      )}

      {/* Edit Course Modal */}
      {isEditModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsEditModalOpen(false)}></div>
          
          <div className="relative w-full max-w-lg bg-card border border-border rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
            <div className="p-8 space-y-8 overflow-y-auto">
              <header className="flex justify-between items-start">
                <div>
                  <label className="text-[10px] items-center gap-2 uppercase tracking-[0.3em] font-black text-[#fedc00] mb-2 flex font-headline">
                    <span className="material-symbols-outlined text-sm">architecture</span> 
                    {lang === 'uz' ? 'Sozlamalar' : 'Settings'}
                  </label>
                  <h2 className="text-3xl font-black text-foreground tracking-tighter leading-none font-headline uppercase italic">{lang === 'uz' ? 'Tahrirlash.' : 'Edit.'}</h2>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </header>

              <div className="space-y-6">
                {/* Image Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative aspect-[16/9] bg-muted rounded-2xl overflow-hidden border border-border cursor-pointer hover:border-[#cafd00]/30 transition-all duration-500"
                >
                  {editingCourse.image_url ? (
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
                    <span className="text-[8px] font-black text-[#cafd00] uppercase tracking-widest">{lang === 'uz' ? 'Rasm almashtirish' : 'Change image'}</span>
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
                    className="w-full bg-muted/30 border border-border px-6 py-4 rounded-2xl text-lg font-black text-foreground placeholder-muted-foreground/30 focus:border-[#cafd00]/50 transition-all font-headline focus:outline-none shadow-sm"
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
                      <label className="text-[9px] uppercase tracking-[0.2em] text-[#fedc00] font-black font-headline">{lang === 'uz' ? 'Narxi ($)' : 'Price ($)'}</label>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-bold text-[#fedc00] font-headline">$</span>
                        <input 
                          type="number" 
                          value={editingCourse.price || ''}
                          onChange={(e) => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-transparent border-none pl-5 pr-0 py-2 text-xl font-bold text-foreground placeholder-muted-foreground focus:ring-0 border-b border-[#fedc00]/30 focus:border-[#fedc00] transition-all font-headline focus:outline-none"
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
                      {lang === 'uz' ? 'Saqlash' : 'Save'}
                    </>
                  )}
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
