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

  // Add Lesson state
  const [addLessonModuleId, setAddLessonModuleId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonUrl, setNewLessonUrl] = useState("");
  const [addingLesson, setAddingLesson] = useState(false);

  // Course Settings state
  const [showCourseSettings, setShowCourseSettings] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState("");
  const [updatingCourse, setUpdatingCourse] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      if (!data.error) {
        setCourse(data);
        setEditTitle(data.title);
        setEditImage(data.thumbnail || "");
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
        })
      });
      if (res.ok) {
        setNewLessonTitle("");
        setNewLessonUrl("");
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
        body: JSON.stringify({ title: editTitle.trim(), thumbnail: editImage.trim() })
      });
      if (res.ok) {
        await fetchCourse();
        setShowCourseSettings(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingCourse(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh] bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#cafd00]/20 border-t-[#cafd00] rounded-full animate-spin"></div>
          <p className="text-[#cafd00] text-xs font-black uppercase tracking-[0.3em] animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh] bg-black">
        <div className="text-center space-y-6">
          <span className="material-symbols-outlined text-7xl text-[#222]">error_outline</span>
          <h2 className="text-3xl font-black text-white font-headline tracking-tighter">Course not found</h2>
          <Link href="/library" className="inline-block bg-white/5 px-8 py-3 rounded-2xl text-[#cafd00] hover:bg-white/10 transition-all font-bold">← Back to Library</Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;
  const embedUrl = activeLesson?.video_url ? `https://www.youtube.com/embed/${getYouTubeId(activeLesson.video_url)}` : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden font-body antialiased bg-black">
      {/* ===== TOP BAR ===== */}
      <header className="h-20 flex items-center justify-between px-10 bg-[#0a0a0a] border-b border-white/5 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/library")} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group active:scale-90">
            <span className="material-symbols-outlined text-[#919191] text-2xl group-hover:text-white transition-colors">arrow_back</span>
          </button>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-white tracking-tighter font-headline">{course.title}</h1>
            <button 
              onClick={() => setShowCourseSettings(true)}
              className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-[#333] hover:text-[#cafd00] transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border text-[#cafd00] bg-[#cafd00]/10 border-[#cafd00]/20 shadow-[0_0_20px_rgba(202,253,0,0.1)]">
            {course.is_free ? t("free") : `$${course.price}`}
          </span>
        </div>
        <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em]">
          <span className="text-[#666]">{course.modules?.length || 0} <span className="text-[#333]">{t("modules")}</span></span>
          <span className="text-[#222]">/</span>
          <span className="text-[#666]">{totalLessons} <span className="text-[#333]">{t("lessons")}</span></span>
        </div>
      </header>

      {/* Course Settings Modal */}
      {showCourseSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-[40px] p-10 space-y-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#cafd00]"></div>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-white tracking-tighter font-headline">{t("settings")}</h2>
              <button onClick={() => setShowCourseSettings(false)} className="w-10 h-10 rounded-full hover:bg-white/5 text-[#444] hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#444] ml-2">Kurs nomi</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-black border-2 border-white/5 focus:border-[#cafd00]/40 text-white px-6 py-4 rounded-3xl focus:outline-none font-bold text-lg transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#444] ml-2">Muqova rasmi (URL)</label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black border-2 border-white/5 focus:border-[#cafd00]/40 text-white px-6 py-4 rounded-3xl focus:outline-none font-bold transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleUpdateCourse}
              disabled={updatingCourse || !editTitle.trim()}
              className="w-full bg-[#cafd00] text-black py-5 rounded-[24px] text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_20px_40px_rgba(202,253,0,0.2)] disabled:opacity-30 disabled:scale-100"
            >
              {updatingCourse ? t("saving") : "SAQLASH"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="w-[420px] border-r border-white/5 bg-[#080808] flex flex-col shrink-0 overflow-hidden relative z-10 shadow-2xl">
          {/* Sidebar Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.5em] text-[#cafd00] mb-1">{t("curriculum")}</p>
              <p className="text-[13px] text-[#444] font-bold">{course.modules?.length || 0} {t("modules")} · {totalLessons} {t("lessons")}</p>
            </div>
            <button
              onClick={() => setShowAddModule(true)}
              className="flex items-center gap-3 pr-6 pl-1.5 rounded-2xl bg-[#cafd00] text-black hover:scale-[1.05] active:scale-95 transition-all shadow-[0_10px_30px_rgba(202,253,0,0.2)] group"
            >
              <div className="w-11 h-11 rounded-xl bg-black/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl font-black">add</span>
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Modul qo&apos;shish</span>
            </button>
          </div>

          {/* Add Module Form */}
          {showAddModule && (
            <div className="p-6 border-b border-white/10 bg-[#0d0d0d] animate-in fade-in slide-in-from-top-6 duration-500">
              <div className="space-y-5">
                <input
                  autoFocus
                  type="text"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                  placeholder={t("moduleName")}
                  className="w-full bg-black border-2 border-white/5 focus:border-[#cafd00]/40 text-white text-lg px-6 py-4 rounded-3xl focus:outline-none placeholder-[#222] transition-all font-bold"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleAddModule}
                    disabled={addingModule || !newModuleTitle.trim()}
                    className="flex-1 bg-[#cafd00] text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                  >
                    {addingModule ? t("saving") : t("addModule")}
                  </button>
                  <button
                    onClick={() => { setShowAddModule(false); setNewModuleTitle(""); }}
                    className="px-6 py-4 text-[#444] hover:text-white transition-colors text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 active:scale-95"
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
                  expandedModules.has(module.id) ? "bg-white/5 shadow-2xl border border-white/5" : "hover:bg-white/[0.03]"
                )}>
                  <div className="flex items-center gap-5 flex-1 overflow-hidden" onClick={() => toggleModule(module.id)}>
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      expandedModules.has(module.id) ? "bg-[#cafd00] text-black" : "bg-white/5 text-[#444]"
                    )}>
                      <span className="text-sm font-black">{mIdx + 1}</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#444] mb-1 group-hover:text-[#666] transition-colors">{t("module")}</p>
                      <h3 className="text-lg font-black text-white truncate font-headline group-hover:text-white transition-colors tracking-tight">{module.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.id); }}
                      className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-[#333] flex items-center justify-center transition-all bg-black/20"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>

                {/* Lessons */}
                {expandedModules.has(module.id) && (
                  <div className="mt-3 ml-6 space-y-3 border-l-2 border-white/5 pl-6 pb-6 animate-in fade-in slide-in-from-left-6 duration-500">
                    {module.lessons?.map((lesson: any, lIdx: number) => (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={cn(
                          "group relative flex items-center gap-5 p-5 rounded-[24px] cursor-pointer transition-all border-2",
                          activeLesson?.id === lesson.id 
                            ? "bg-[#cafd00]/10 border-[#cafd00]/40 shadow-[0_10px_40px_rgba(202,253,0,0.15)] translate-x-2" 
                            : "bg-[#0c0c0c] border-transparent hover:bg-[#111] hover:border-white/5"
                        )}
                      >
                        <div className="relative shrink-0">
                          {lesson.video_url ? (
                            <div className="w-24 h-16 rounded-[18px] overflow-hidden border border-white/5 group-hover:border-[#cafd00]/40 transition-all duration-500">
                              <img 
                                src={getYouTubeThumbnail(lesson.video_url) || ''} 
                                alt="" 
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-[#cafd00] text-2xl font-black">play_arrow</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-24 h-16 rounded-[18px] bg-black border border-white/5 flex items-center justify-center group-hover:bg-white/5 transition-colors">
                              <span className="material-symbols-outlined text-[#222] group-hover:text-[#444]">videocam_off</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className={cn(
                            "text-lg font-black truncate transition-all tracking-tight",
                            activeLesson?.id === lesson.id ? "text-white" : "text-[#666] group-hover:text-white"
                          )}>{lesson.title}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#333] group-hover:text-[#555]">{t("free")}</span>
                            {activeLesson?.id === lesson.id && (
                              <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#cafd00] animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#cafd00] animate-bounce delay-150"></span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                          className="w-10 h-10 rounded-xl hover:bg-white/10 text-[#222] group-hover:text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                        >
                          <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      </div>
                    ))}

                    {/* Add Lesson Form */}
                    {addLessonModuleId === module.id ? (
                      <div className="p-6 bg-[#0d0d0d] rounded-[32px] border-4 border-dashed border-[#cafd00]/10 animate-in fade-in zoom-in-95 duration-300">
                        <div className="space-y-5">
                          <input
                            autoFocus
                            type="text"
                            value={newLessonTitle}
                            onChange={(e) => setNewLessonTitle(e.target.value)}
                            placeholder={t("lessonName")}
                            className="w-full bg-black border-2 border-white/5 focus:border-[#cafd00]/40 text-white text-lg px-6 py-4 rounded-3xl focus:outline-none font-bold placeholder-[#222]"
                          />
                          <input
                            type="text"
                            value={newLessonUrl}
                            onChange={(e) => setNewLessonUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddLesson()}
                            placeholder={t("youtubeUrl")}
                            className="w-full bg-black border-2 border-white/5 focus:border-[#cafd00]/40 text-[#444] text-sm px-6 py-4 rounded-3xl focus:outline-none font-bold"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={handleAddLesson}
                              disabled={addingLesson || !newLessonTitle.trim()}
                              className="flex-1 bg-[#cafd00] text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-30"
                            >
                              {addingLesson ? t("saving") : t("add")}
                            </button>
                            <button
                              onClick={() => { setAddLessonModuleId(null); setNewLessonTitle(""); setNewLessonUrl(""); }}
                              className="px-6 py-4 text-[#444] hover:text-white transition-colors text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 active:scale-95"
                            >
                              {t("cancel")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddLessonModuleId(module.id)}
                        className="w-full flex items-center gap-5 p-5 rounded-[28px] bg-white/[0.01] border-2 border-dashed border-white/5 text-[#333] hover:border-[#cafd00]/30 hover:text-[#cafd00] hover:bg-[#cafd00]/5 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#cafd00]/10 transition-colors">
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
        <main className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col">
          {activeLesson ? (
            <div className="flex-1 flex flex-col p-12 overflow-y-auto custom-scrollbar">
              <div className="max-w-6xl w-full mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Video Player */}
                <div className="relative aspect-video bg-black rounded-[48px] overflow-hidden shadow-[0_60px_150px_rgba(0,0,0,0.8)] border-4 border-white/5 group ring-1 ring-white/10">
                  {activeLesson.video_url ? (
                    <iframe
                      src={`${embedUrl}?autoplay=1&modestbranding=1&rel=0`}
                      className="w-full h-full pointer-events-auto"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center border-4 border-dashed border-white/5 m-8 rounded-[40px]">
                      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 animate-pulse">
                        <span className="material-symbols-outlined text-5xl text-[#222]">play_disabled</span>
                      </div>
                      <p className="text-3xl font-black text-white mb-3 tracking-tighter">{t("noVideo")}</p>
                      <p className="text-[#444] text-lg font-bold">{t("pasteUrl")}</p>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 right-0 p-12 pt-32 bg-gradient-to-b from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#cafd00] mb-3">{t("nowPlaying")}</p>
                    <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none">{activeLesson.title}</h2>
                  </div>
                </div>

                {/* Lesson Info */}
                <div className="flex items-end justify-between py-10 border-b-2 border-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <span className="px-4 py-1.5 rounded-full bg-[#cafd00]/10 border border-[#cafd00]/20 text-[#cafd00] text-[10px] font-black uppercase tracking-widest">{t("free")}</span>
                       <span className="text-[#333] font-black">/</span>
                       <span className="text-[#444] text-[10px] font-black uppercase tracking-widest">Architect Edition</span>
                    </div>
                    <h2 className="text-7xl font-black text-white tracking-tighter leading-none">{activeLesson.title}</h2>
                  </div>
                  <div className="flex gap-6 pb-2">
                     <button className="flex items-center gap-4 bg-white/5 hover:bg-white/10 px-10 py-5 rounded-[24px] text-[11px] font-black text-white border-2 border-white/5 transition-all active:scale-95 uppercase tracking-widest">
                       <span className="material-symbols-outlined text-xl">description</span>
                       Notes
                     </button>
                     <button className="flex items-center gap-4 bg-[#cafd00] hover:brightness-110 px-12 py-5 rounded-[24px] text-[11px] font-black text-black transition-all active:scale-95 shadow-[0_20px_50px_rgba(202,253,0,0.3)] uppercase tracking-widest">
                       Next Lesson
                       <span className="material-symbols-outlined text-xl font-black">arrow_forward</span>
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-20 select-none animate-in fade-in zoom-in-95 duration-1000">
              <div className="text-center space-y-12 group">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[#cafd00]/20 blur-[150px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                  <div className="w-48 h-48 rounded-[64px] bg-white/[0.02] border-2 border-white/5 flex items-center justify-center mx-auto mb-4 group-hover:border-[#cafd00]/40 group-hover:bg-[#cafd00]/5 transition-all duration-700 -rotate-12 group-hover:rotate-0 shadow-2xl relative z-10">
                    <span className="material-symbols-outlined text-7xl text-[#111] group-hover:text-[#cafd00] transition-all duration-700 font-black scale-[1.3] drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <h2 className="text-[120px] font-black text-white/40 tracking-[ -0.05em] mix-blend-overlay group-hover:text-white transition-all duration-1000 font-headline leading-none">{t("selectLesson")}</h2>
                  <p className="text-2xl text-[#333] max-w-2xl mx-auto font-bold leading-relaxed group-hover:text-[#666] transition-all duration-700 tracking-tight">{t("selectDesc")}</p>
                </div>
                <div className="pt-16">
                   <div className="inline-flex items-center gap-5 px-12 py-5 bg-white/[0.01] rounded-[30px] border-2 border-white/5 text-[11px] font-black uppercase tracking-[0.8em] text-[#222] group-hover:text-[#333] transition-all duration-1000 opacity-50 group-hover:opacity-100">
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
