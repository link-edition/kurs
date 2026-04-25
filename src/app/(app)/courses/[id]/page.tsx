"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { t, lang } = useLang();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Add Module state
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [lessonImage, setLessonImage] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Add Lesson state
  const [addLessonModuleId, setAddLessonModuleId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonUrl, setNewLessonUrl] = useState("");
  const [newLessonAttachments, setNewLessonAttachments] = useState<any[]>([]);
  const [addingLesson, setAddingLesson] = useState(false);

  // Course Settings state
  const [showCourseSettings, setShowCourseSettings] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState("");
  const [updatingCourse, setUpdatingCourse] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      if (!data.error) {
        setCourse(data);
        setEditTitle(data.title);
        setEditImage(data.image_url || "");
        if (data?.modules?.length > 0 && expandedModules.size === 0) {
          setExpandedModules(new Set([data.modules[0].id]));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [courseId, expandedModules.size]);

  useEffect(() => { 
    fetchCourse(); 
  }, [fetchCourse]);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
  };

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    setAddingModule(true);
    try {
      const res = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, title: newModuleTitle.trim() })
      });
      if (res.ok) {
        setNewModuleTitle("");
        setShowAddModule(false);
        fetchCourse();
      }
    } catch (e) { console.error(e); }
    setAddingModule(false);
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm(t("confirmDeleteModule") || "Bu modulni o'chirmoqchimisiz?")) return;
    try {
      await fetch('/api/modules', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId })
      });
      fetchCourse();
    } catch (e) { console.error(e); }
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim() || !addLessonModuleId) return;
    setAddingLesson(true);
    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: addLessonModuleId,
          title: newLessonTitle.trim(),
          videoUrl: newLessonUrl.trim() || null,
          imageUrl: lessonImage,
          attachments: newLessonAttachments
        })
      });
      if (res.ok) {
        setNewLessonTitle("");
        setNewLessonUrl("");
        setNewLessonAttachments([]);
        setLessonImage(null);
        setAddLessonModuleId(null);
        fetchCourse();
      }
    } catch (e) { console.error(e); }
    setAddingLesson(false);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm(t("confirmDeleteLesson") || "Bu darsni o'chirmoqchimisiz?")) return;
    try {
      await fetch('/api/lessons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId })
      });
      if (activeLesson?.id === lessonId) setActiveLesson(null);
      fetchCourse();
    } catch (e) { console.error(e); }
  };

  const handleUpdateCourse = async () => {
    if (!editTitle.trim()) return;
    setUpdatingCourse(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editTitle.trim(), 
          thumbnail: editImage.trim() 
        })
      });
      
      const data = await res.json();
      
      if (res.ok && !data.error) {
        setCourse(data);
        setEditTitle(data.title);
        setEditImage(data.image_url || "");
        setShowCourseSettings(false);
      } else {
        alert(data.error || "Saqlashda xatolik yuz berdi");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingCourse(false);
    }
  };

  const handleCourseThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'thumbnail');
      setUpdatingCourse(true);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if(data.url) setEditImage(data.url);
      } catch (e) { console.error(e); }
      setUpdatingCourse(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <div className="h-20 bg-card border-b border-border flex items-center px-10 gap-6">
           <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
           <div className="w-48 h-6 bg-muted/60 rounded animate-pulse" />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-[420px] border-r border-border p-8 space-y-8 bg-card">
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 bg-muted/40 rounded" />
              <div className="w-32 h-10 bg-muted/60 rounded-2xl" />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <div className="w-full h-16 rounded-[28px] bg-muted/20" />
                <div className="pl-6 space-y-2">
                  <div className="w-full h-14 rounded-[24px] bg-muted/10" />
                </div>
              </div>
            ))}
          </aside>
          <main className="flex-1 p-12 space-y-12 bg-background">
            <div className="aspect-video w-full rounded-[48px] bg-muted/10 animate-pulse shadow-xl" />
            <div className="space-y-6">
              <div className="w-1/3 h-10 bg-muted animate-pulse rounded-xl" />
              <div className="w-full h-1 bg-border" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh] bg-background">
        <div className="text-center space-y-6">
          <span className="material-symbols-outlined text-7xl text-muted-foreground opacity-20">error_outline</span>
          <h2 className="text-3xl font-black text-foreground font-headline tracking-tighter">{lang === 'uz' ? 'Kurs topilmadi' : 'Course not found'}</h2>
          <Link href="/library" className="inline-block bg-muted px-8 py-3 rounded-2xl text-[#cafd00] hover:bg-muted/80 transition-all font-bold">← {lang === 'uz' ? 'Kutubxonaga qaytish' : 'Back to Library'}</Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;
  const embedUrl = activeLesson?.video_url ? `https://www.youtube.com/embed/${getYouTubeId(activeLesson.video_url)}` : null;


  return (
    <div className="flex flex-col h-screen overflow-hidden font-body antialiased bg-background text-foreground transition-colors duration-500 text-left">
      {/* ===== TOP BAR ===== */}
      <header className="h-14 sm:h-16 lg:h-20 flex items-center justify-between px-3 sm:px-6 lg:px-10 bg-card/80 backdrop-blur-xl border-b border-border shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          {/* Mobile sidebar toggle */}
          <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="lg:hidden w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shadow-inner">
            <span className="material-symbols-outlined text-lg">menu</span>
          </button>
          <button onClick={() => router.push("/library")} className="hidden sm:flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-2xl bg-muted hover:bg-muted/80 transition-all group active:scale-95 border border-border">
            <span className="material-symbols-outlined text-muted-foreground text-lg sm:text-xl group-hover:text-foreground transition-colors">arrow_back</span>
            <span className="text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors hidden md:block">{t("library")}</span>
          </button>
          <div className="h-8 w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-sm sm:text-lg lg:text-2xl font-black text-foreground tracking-tighter font-headline truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none uppercase italic">{course.title}</h1>
            <button 
              onClick={() => setShowCourseSettings(true)}
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-[#cafd00] transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">settings</span>
            </button>
          </div>
          <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest px-2 sm:px-4 py-1 sm:py-1.5 rounded-full border text-[#cafd00] bg-[#cafd00]/10 border-[#cafd00]/20 hidden sm:inline">
            {course.is_free ? t("free") : `$${course.price}`}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em]">
          <span className="text-muted-foreground">{course.modules?.length || 0} <span className="opacity-40">{t("modules")}</span></span>
          <span className="opacity-10">/</span>
          <span className="text-muted-foreground">{totalLessons} <span className="opacity-40">{t("lessons")}</span></span>
        </div>
      </header>

      {/* Course Settings Modal */}
      {showCourseSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-card border border-border rounded-[40px] p-10 space-y-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#cafd00]"></div>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-foreground tracking-tighter font-headline uppercase italic">{t("settings")}</h2>
              <button onClick={() => setShowCourseSettings(false)} className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 ml-2">Kurs muqovasi (Thumbnail)</label>
                <div 
                  onClick={() => document.getElementById('course-thumb-input')?.click()}
                  className="group relative aspect-video bg-muted border-2 border-dashed border-border rounded-[32px] overflow-hidden cursor-pointer hover:border-[#cafd00] transition-all"
                >
                  {editImage && editImage.trim() !== "" ? (
                    <img src={editImage} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform brightness-100 dark:brightness-75 dark:group-hover:brightness-100" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground opacity-40">
                      <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
                      <span className="text-[10px] font-bold uppercase">RASM YUKLASH</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                    <span className="text-[10px] font-black text-[#cafd00] uppercase tracking-widest">{lang === 'uz' ? "O'ZGARTIRISH" : "CHANGE"}</span>
                  </div>
                  <input type="file" id="course-thumb-input" className="hidden" accept="image/*" onChange={handleCourseThumbnailUpload} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 ml-2">Kurs nomi</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-muted border border-border focus:border-[#cafd00]/40 text-foreground px-6 py-4 rounded-3xl focus:outline-none font-bold text-lg transition-all"
                  placeholder={lang === 'uz' ? "Kiriting..." : "Enter..."}
                />
              </div>
            </div>

            <button
              onClick={handleUpdateCourse}
              disabled={updatingCourse || !editTitle.trim()}
              className="w-full bg-[#cafd00] text-[#516700] py-5 rounded-[24px] text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_20px_40px_rgba(202,253,0,0.2)] disabled:opacity-30 disabled:scale-100"
            >
              {updatingCourse ? t("saving") : (lang === 'uz' ? "SAQLASH" : "SAVE CHANGES")}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-30 bg-black/70" onClick={() => setMobileSidebarOpen(false)} />
        )}
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative w-[300px] lg:w-[380px] xl:w-[420px] border-r border-border bg-card flex flex-col shrink-0 overflow-hidden z-40 lg:z-10 shadow-2xl transition-transform duration-300 h-full`}>
          {/* Sidebar Header */}
          <div className="p-4 sm:p-6 lg:p-8 border-b border-border flex items-center justify-between bg-card dark:bg-card backdrop-blur-md">
            <div>
              <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[#cafd00] mb-1">{t("curriculum")}</p>
              <p className="text-[11px] sm:text-[13px] text-muted-foreground font-bold">{course.modules?.length || 0} {t("modules")} · {totalLessons} {t("lessons")}</p>
            </div>
            <button
              onClick={() => setShowAddModule(true)}
              className="flex items-center gap-2 sm:gap-3 pr-4 sm:pr-6 pl-1 sm:pl-1.5 rounded-xl sm:rounded-2xl bg-[#cafd00] text-[#516700] hover:scale-[1.05] active:scale-95 transition-all shadow-[0_10px_30px_rgba(202,253,0,0.2)] group"
            >
              <div className="w-8 sm:w-11 h-8 sm:h-11 rounded-lg sm:rounded-xl bg-black/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg sm:text-2xl font-black">add</span>
              </div>
              <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest hidden sm:inline">{lang === 'uz' ? "Modul qo'shish" : "Add Module"}</span>
            </button>
          </div>

          {/* Add Module Form */}
          {showAddModule && (
            <div className="p-6 border-b border-border bg-card animate-in fade-in slide-in-from-top-6 duration-500">
              <div className="space-y-5">
                <input
                  autoFocus
                  type="text"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                  placeholder={t("moduleName")}
                  className="w-full bg-muted border border-border focus:border-[#cafd00]/40 text-foreground text-lg px-6 py-4 rounded-3xl focus:outline-none placeholder-muted-foreground/30 transition-all font-bold"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleAddModule}
                    disabled={addingModule || !newModuleTitle.trim()}
                    className="flex-1 bg-[#cafd00] text-[#516700] py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                  >
                    {addingModule ? t("saving") : t("addModule")}
                  </button>
                  <button
                    onClick={() => { setShowAddModule(false); setNewModuleTitle(""); }}
                    className="px-6 py-4 text-muted-foreground hover:text-foreground transition-colors text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-muted active:scale-95"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto py-6 custom-scrollbar px-4 space-y-6">
            {(!course.modules || course.modules.length === 0) && !showAddModule && (
              <div className="px-10 py-32 text-center">
                <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/5 rotate-12">
                  <span className="material-symbols-outlined text-4xl text-[#222]">folder_special</span>
                </div>
                <p className="text-xl font-black text-[#444] mb-3 tracking-tighter">{t("noModules")}</p>
                <p className="text-sm text-[#333] mb-10 leading-relaxed font-bold">{t("startBuilding")}</p>
                <button onClick={() => setShowAddModule(true)} className="bg-white/5 text-[#cafd00] border-2 border-[#cafd00]/20 px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:bg-[#cafd00]/10 transition-all active:scale-95">
                  {t("addFirst")}
                </button>
              </div>
            )}

            {course.modules?.map((module: any, mIdx: number) => (
              <div key={module.id} className="group/module">
                {/* Module Header */}
                <div className={cn(
                  "flex items-center justify-between p-5 rounded-[28px] transition-all cursor-pointer group mb-2 text-left",
                  expandedModules.has(module.id) ? "bg-muted shadow-2xl border border-border" : "hover:bg-muted/50 border border-transparent"
                )}>
                  <div className="flex items-center gap-5 flex-1 overflow-hidden" onClick={() => toggleModule(module.id)}>
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      expandedModules.has(module.id) ? "bg-[#cafd00] text-black" : "bg-muted text-muted-foreground"
                    )}>
                      <span className="text-sm font-black">{mIdx + 1}</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1 group-hover:text-foreground transition-colors">{t("module")}</p>
                      <h3 className="text-lg font-black text-foreground truncate font-headline group-hover:text-foreground transition-colors tracking-tight uppercase italic">{module.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.id); }}
                      className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-muted-foreground flex items-center justify-center transition-all bg-background/20"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>

                {/* Lessons */}
                {expandedModules.has(module.id) && (
                  <div className="mt-3 ml-6 space-y-3 border-l-2 border-border pl-6 pb-6 animate-in fade-in slide-in-from-left-6 duration-500">
                    {module.lessons?.map((lesson: any, lIdx: number) => (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={cn(
                          "group relative flex items-center gap-5 p-5 rounded-[24px] cursor-pointer transition-all border-2",
                          activeLesson?.id === lesson.id 
                            ? "bg-[#cafd00]/10 border-[#cafd00]/50 shadow-[0_10px_40px_rgba(202,253,0,0.25)] translate-x-2 animate-in slide-in-from-left-2 duration-300" 
                            : "bg-background border-border hover:bg-muted hover:border-[#cafd00]/30"
                        )}
                      >
                        <div className="relative shrink-0">
                          {lesson.video_url ? (
                            <div className="w-24 h-16 rounded-[18px] overflow-hidden border border-border group-hover:border-[#cafd00]/40 transition-all duration-500 shadow-inner">
                              {(getYouTubeThumbnail(lesson.video_url) && getYouTubeThumbnail(lesson.video_url) !== "") ? (
                                <img 
                                  src={getYouTubeThumbnail(lesson.video_url) || ""} 
                                  alt="" 
                                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 brightness-100 dark:brightness-75 dark:group-hover:brightness-100"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <span className="material-symbols-outlined text-muted-foreground opacity-20">play_circle</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                                <span className="material-symbols-outlined text-[#cafd00] text-2xl font-black">play_arrow</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-24 h-16 rounded-[18px] bg-muted border border-border flex items-center justify-center group-hover:bg-muted transition-colors">
                              <span className="material-symbols-outlined text-muted-foreground opacity-20 group-hover:opacity-40 transition-opacity">videocam_off</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className={cn(
                            "text-lg font-black truncate transition-all tracking-tight uppercase italic leading-none mb-1",
                            activeLesson?.id === lesson.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                          )}>{lesson.title}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#cafd00]">{t("free")}</span>
                            {activeLesson?.id === lesson.id && (
                              <div className="flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#cafd00] animate-pulse"></span>
                                <span className="text-[9px] font-black text-[#cafd00] uppercase tracking-widest leading-none">Ijroda</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                          className="w-10 h-10 rounded-xl hover:bg-muted text-muted-foreground group-hover:text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all bg-card shadow-sm"
                        >
                          <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      </div>
                    ))}

                    {/* Add Lesson Form */}
                    {addLessonModuleId === module.id ? (
                      <div className="p-6 bg-card rounded-[32px] border border-border animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
                        <div className="space-y-6">
                          <div className="space-y-5">
                            {/* Dars nomi */}
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">1. Dars nomi</label>
                               <input
                                autoFocus
                                type="text"
                                value={newLessonTitle}
                                onChange={(e) => setNewLessonTitle(e.target.value)}
                                placeholder={lang === 'uz' ? "Dars nomini kiriting..." : "Enter lesson name..."}
                                className="w-full bg-muted border border-border focus:border-[#cafd00] text-foreground text-lg px-6 py-5 rounded-[28px] focus:outline-none font-bold placeholder-muted-foreground/30 transition-all uppercase italic"
                              />
                            </div>

                            {/* YouTube Havolasi */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">2. YouTube Havolasi (Ixtiyoriy)</label>
                              <input
                                type="text"
                                value={newLessonUrl}
                                onChange={(e) => setNewLessonUrl(e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-muted border border-border focus:border-[#cafd00] text-foreground text-base px-6 py-5 rounded-[28px] focus:outline-none font-bold placeholder-muted-foreground/30 transition-all"
                              />
                            </div>

                            {/* Video Fayl Yuklash */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">3. Yoki Video Fayl Yuklash</label>
                              <div className="relative group">
                                <button 
                                  onClick={() => document.getElementById('lesson-video-input')?.click()}
                                  className="w-full bg-muted/50 border-2 border-dashed border-border hover:border-[#cafd00] hover:bg-[#cafd00]/5 text-foreground py-5 rounded-[28px] flex items-center justify-center gap-4 transition-all"
                                >
                                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-hover:bg-[#cafd00]/20">
                                    <span className="material-symbols-outlined text-xl">{uploadingFile ? 'sync' : 'video_library'}</span>
                                  </div>
                                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                                    {newLessonUrl && !newLessonUrl.includes('http') ? (lang === 'uz' ? 'Video yuklandi' : 'Video uploaded') : (lang === 'uz' ? 'Kompyuterdan video tanlash' : 'Select video from computer')}
                                  </span>
                                </button>
                                <input 
                                  type="file" id="lesson-video-input" className="hidden" accept="video/*" 
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if(file) {
                                      const formData = new FormData();
                                      formData.append('file', file);
                                      formData.append('type', 'video');
                                      setUploadingFile(true);
                                      try {
                                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                        const data = await res.json();
                                        if(data.url) setNewLessonUrl(data.url);
                                      } catch (e) { console.error(e); }
                                      setUploadingFile(false);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            
                            {/* PDF / Fayllar Bo'limi */}
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">4. PDF / Qo'shimcha fayllar</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder={lang === 'uz' ? "Fayl nomi (masalan: Taqdimot)..." : "File name..."}
                                  id="att-name"
                                  className="w-full bg-muted border border-border text-foreground px-6 py-5 rounded-[28px] text-sm placeholder-muted-foreground/30 focus:border-[#cafd00] outline-none transition-all pr-[140px]"
                                />
                                <button 
                                  onClick={() => document.getElementById('att-file-input')?.click()}
                                  className="absolute right-2 top-2 bottom-2 bg-[#cafd00] px-6 rounded-[22px] text-[#516700] hover:brightness-110 flex items-center gap-2 transition-all active:scale-95 shadow-xl font-black text-[10px] uppercase"
                                >
                                  <span className="material-symbols-outlined text-lg">upload</span>
                                  {lang === 'uz' ? "TANLASH" : "CHOOSE"}
                                </button>
                              </div>
                              <input 
                                type="file" id="att-file-input" className="hidden" 
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  const nameInput = document.getElementById('att-name') as HTMLInputElement;
                                  if(file) {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('type', 'attachment');
                                    setUploadingFile(true);
                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                    const data = await res.json();
                                    if(data.url) {
                                      setNewLessonAttachments([...newLessonAttachments, { 
                                        name: nameInput.value || file.name, 
                                        url: data.url, 
                                        type: file.type.includes('pdf') ? 'pdf' : 'file' 
                                      }]);
                                      nameInput.value = '';
                                    }
                                    setUploadingFile(false);
                                  }
                                }}
                              />
                              <div className="flex flex-wrap gap-2 pt-1">
                                {newLessonAttachments.map((att, i) => (
                                  <div key={i} className="bg-muted px-4 py-2 rounded-full text-[10px] font-bold text-foreground flex items-center gap-3 border border-border animate-in fade-in slide-in-from-left-2 transition-all">
                                    <span className="material-symbols-outlined text-sm text-[#cafd00]">description</span>
                                    <span>{att.name}</span>
                                    <button onClick={() => setNewLessonAttachments(newLessonAttachments.filter((_, idx) => idx !== i))} className="text-red-500 font-extrabold hover:scale-125 transition-transform px-1">×</button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <button
                              onClick={handleAddLesson}
                              disabled={addingLesson || !newLessonTitle.trim() || uploadingFile}
                              className="flex-1 bg-[#cafd00] text-[#516700] py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-30"
                            >
                              {addingLesson ? t("saving") : (lang === 'uz' ? "Darsni Qo'shish" : "Add Lesson")}
                            </button>
                            <button
                              onClick={() => { setAddLessonModuleId(null); setNewLessonTitle(""); setNewLessonUrl(""); setLessonImage(null); }}
                              className="px-8 py-5 text-muted-foreground hover:text-foreground transition-colors text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-muted"
                            >
                              {t("cancel")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddLessonModuleId(module.id)}
                        className="w-full flex items-center gap-5 p-5 rounded-[28px] bg-muted/20 border-2 border-dashed border-border text-muted-foreground hover:border-[#cafd00]/30 hover:text-[#cafd00] hover:bg-[#cafd00]/5 transition-all group shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-[#cafd00]/10 transition-colors shadow-inner">
                          <span className="material-symbols-outlined text-2xl font-black">add</span>
                        </div>
                        <span className="text-sm font-black uppercase tracking-[0.2em]">{t("addLesson")}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="h-20"></div>
          </div>
        </aside>

        {/* ===== RIGHT CONTENT AREA ===== */}
        <main className="flex-1 bg-background relative overflow-hidden flex flex-col">
          {activeLesson ? (
            <div className="flex-1 flex flex-col p-4 sm:p-8 lg:p-12 overflow-y-auto custom-scrollbar">
              <div className="max-w-6xl w-full mx-auto space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Video Player */}
                <div className="relative aspect-video bg-black rounded-[24px] sm:rounded-[48px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.8)] border-2 sm:border-4 border-border group ring-1 ring-border/10">
                  {activeLesson.video_url ? (
                    <iframe
                      src={`${embedUrl}?autoplay=1&modestbranding=1&rel=0`}
                      className="w-full h-full pointer-events-auto"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center border-2 sm:border-4 border-dashed border-border/20 m-4 sm:m-8 rounded-[16px] sm:rounded-[40px]">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center mb-4 sm:mb-8 border border-border animate-pulse">
                        <span className="material-symbols-outlined text-3xl sm:text-5xl text-muted-foreground opacity-20">play_disabled</span>
                      </div>
                      <p className="text-xl sm:text-3xl font-black text-foreground mb-2 sm:mb-3 tracking-tighter uppercase italic">{t("noVideo")}</p>
                      <p className="text-muted-foreground text-sm sm:text-lg font-bold">{t("pasteUrl")}</p>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 right-0 p-6 sm:p-12 pt-16 sm:pt-32 bg-gradient-to-b from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-[#cafd00] mb-2 sm:mb-3">{t("nowPlaying")}</p>
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none uppercase italic">{activeLesson.title}</h2>
                  </div>
                </div>

                {/* Lesson Info */}
                <div className="flex flex-col md:flex-row md:items-end justify-between py-6 sm:py-10 border-b border-border gap-6">
                  <div className="space-y-3 sm:space-y-4 text-left">
                    <div className="flex items-center gap-3 sm:gap-4">
                       <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#cafd00]/10 border border-[#cafd00]/20 text-[#cafd00] text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{t("free")}</span>
                       <span className="text-muted-foreground/20 font-black">/</span>
                       <span className="text-muted-foreground text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-none">Architect Edition</span>
                    </div>
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-foreground tracking-tighter leading-none uppercase italic">{activeLesson.title}</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-2">
                     <button className="flex items-center justify-center gap-3 sm:gap-4 bg-muted hover:bg-muted/80 px-6 sm:px-10 py-3 sm:py-5 rounded-[16px] sm:rounded-[24px] text-[10px] sm:text-[11px] font-black text-foreground border border-border transition-all active:scale-95 uppercase tracking-widest">
                       <span className="material-symbols-outlined text-lg sm:text-xl">description</span>
                       Notes
                     </button>
                     <button className="flex items-center justify-center gap-3 sm:gap-4 bg-[#cafd00] hover:brightness-110 px-8 sm:px-12 py-3 sm:py-5 rounded-[16px] sm:rounded-[24px] text-[10px] sm:text-[11px] font-black text-[#516700] transition-all active:scale-95 shadow-[0_10px_30px_rgba(202,253,0,0.3)] uppercase tracking-widest">
                       Next Lesson
                       <span className="material-symbols-outlined text-lg sm:text-xl font-black">arrow_forward</span>
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 sm:p-20 select-none animate-in fade-in zoom-in-95 duration-1000">
              <div className="text-center space-y-8 sm:space-y-12 group">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[#cafd00]/10 blur-[150px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                  <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-[32px] sm:rounded-[64px] bg-muted border border-border flex items-center justify-center mx-auto mb-4 group-hover:border-[#cafd00]/40 group-hover:bg-[#cafd00]/5 transition-all duration-700 -rotate-12 group-hover:rotate-0 shadow-2xl relative z-10">
                    <span className="material-symbols-outlined text-5xl sm:text-7xl text-muted-foreground opacity-10 group-hover:text-[#cafd00] group-hover:opacity-100 transition-all duration-700 font-black scale-[1.3] drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-5xl sm:text-8xl lg:text-[120px] font-black text-muted-foreground/10 group-hover:text-foreground transition-all duration-1000 font-headline leading-none uppercase italic tracking-tighter">{t("selectLesson")}</h2>
                  <p className="text-base sm:text-2xl text-muted-foreground max-w-xl mx-auto font-bold leading-relaxed group-hover:text-muted-foreground transition-all duration-700 tracking-tight uppercase">{t("selectDesc")}</p>
                </div>
                <div className="pt-8 sm:pt-16">
                   <div className="inline-flex items-center gap-3 sm:gap-5 px-6 sm:px-12 py-3 sm:py-5 bg-muted/40 rounded-[20px] sm:rounded-[30px] border border-border text-[8px] sm:text-[11px] font-black uppercase tracking-[0.4em] sm:tracking-[0.8em] text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-all duration-1000 opacity-50 group-hover:opacity-100 italic">
                     READY TO ARCHITECT YOUR DREAM COURSE
                   </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
