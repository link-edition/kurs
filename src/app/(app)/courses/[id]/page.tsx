"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

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

  const fetchCourse = useCallback(() => {
    fetch(`/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setCourse(data);
          if (data?.modules?.length > 0) {
            setExpandedModules(new Set([data.modules[0].id]));
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  useEffect(() => { fetchCourse(); }, [fetchCourse]);

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

  // ===== ADD MODULE =====
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

  // ===== DELETE MODULE =====
  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Bu modulni o'chirmoqchimisiz? Ichidagi barcha darslar ham o'chadi.")) return;
    try {
      await fetch('/api/modules', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId })
      });
      if (activeLesson) {
        const mod = course.modules.find((m: any) => m.id === moduleId);
        if (mod?.lessons?.some((l: any) => l.id === activeLesson.id)) {
          setActiveLesson(null);
        }
      }
      fetchCourse();
    } catch (e) { console.error(e); }
  };

  // ===== ADD LESSON =====
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

  // ===== DELETE LESSON =====
  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Bu darsni o'chirmoqchimisiz?")) return;
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

  const embedUrl = activeLesson?.video_url ? `https://www.youtube.com/embed/${getYouTubeId(activeLesson.video_url)}` : null;

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#cafd00]/20 border-t-[#cafd00] rounded-full animate-spin"></div>
          <p className="text-[#666] text-xs font-bold uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  const { t, lang } = useLang();
  const [showCourseSettings, setShowCourseSettings] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState("");
  const [updatingCourse, setUpdatingCourse] = useState(false);

  useEffect(() => {
    if (course) {
      setEditTitle(course.title);
      setEditImage(course.thumbnail || "");
    }
  }, [course]);

  const handleUpdateCourse = async () => {
    setUpdatingCourse(true);
    try {
      await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, thumbnail: editImage })
      });
      setShowCourseSettings(false);
      fetchCourse();
    } catch (e) { console.error(e); }
    setUpdatingCourse(false);
  };

  const totalLessons = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] overflow-hidden font-body antialiased">
      {/* ===== TOP BAR ===== */}
      <header className="h-16 flex items-center justify-between px-8 bg-[#0a0a0a] border-b border-white/5 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/library")} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group active:scale-95">
            <span className="material-symbols-outlined text-[#919191] text-xl group-hover:text-white transition-colors">arrow_back</span>
          </button>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white tracking-tight font-headline">{course.title}</h1>
            <button 
              onClick={() => setShowCourseSettings(true)}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#444] hover:text-[#cafd00] transition-all"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
            </button>
          </div>
          <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${course.is_free ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]' : 'text-[#cafd00] bg-[#cafd00]/10 border-[#cafd00]/20 shadow-[0_0_15px_rgba(202,253,0,0.1)]'}`}>
            {course.is_free ? t("free") : `$${course.price}`}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
          <span className="text-[#666]">{course.modules?.length || 0} <span className="text-[#444]">{t("modules")}</span></span>
          <span className="text-[#222]">/</span>
          <span className="text-[#666]">{totalLessons} <span className="text-[#444]">{t("lessons")}</span></span>
        </div>
      </header>

      {/* Course Settings Modal */}
      {showCourseSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-[32px] p-8 space-y-6 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#cafd00] to-[#fedc00]"></div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white tracking-tight font-headline">{t("settings")}</h2>
              <button onClick={() => setShowCourseSettings(false)} className="text-[#444] hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Kurs nomi</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-black border border-white/10 focus:border-[#cafd00]/40 text-white px-5 py-3.5 rounded-2xl focus:outline-none font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Muqova rasmi (URL)</label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black border border-white/10 focus:border-[#cafd00]/40 text-white px-5 py-3.5 rounded-2xl focus:outline-none font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleUpdateCourse}
              disabled={updatingCourse || !editTitle.trim()}
              className="w-full bg-[#cafd00] text-black py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_10px_30px_rgba(202,253,0,0.2)] disabled:opacity-30"
            >
              {updatingCourse ? t("saving") : "Saqlash"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="w-[380px] border-r border-white/5 bg-[#080808] flex flex-col shrink-0 overflow-hidden relative z-10 shadow-2xl">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.4em] text-[#cafd00] mb-1">{t("curriculum")}</p>
              <p className="text-[13px] text-[#555] font-medium">{course.modules?.length || 0} {t("modules")} · {totalLessons} {t("lessons")}</p>
            </div>
            <button
              onClick={() => setShowAddModule(true)}
              className="flex items-center gap-3 pr-5 pl-1 rounded-xl bg-[#cafd00] text-black hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(202,253,0,0.15)] group"
              title={t("addModule")}
            >
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl font-bold">add</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest">Modul qo&apos;shish</span>
            </button>
          </div>

          {/* Add Module Form */}
          {showAddModule && (
            <div className="p-5 border-b border-white/10 bg-[#0d0d0d] animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-4">
                <input
                  autoFocus
                  type="text"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                  placeholder={t("moduleName")}
                  className="w-full bg-[#111] border-2 border-white/10 focus:border-[#cafd00]/40 text-white text-base px-5 py-3 rounded-xl focus:outline-none placeholder-[#333] transition-all font-medium"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddModule}
                    disabled={addingModule || !newModuleTitle.trim()}
                    className="flex-1 bg-[#cafd00] text-black py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                  >
                    {addingModule ? t("saving") : t("addModule")}
                  </button>
                  <button
                    onClick={() => { setShowAddModule(false); setNewModuleTitle(""); }}
                    className="px-5 py-3 text-[#666] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 active:scale-95"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar px-3 space-y-4">
            {(!course.modules || course.modules.length === 0) && !showAddModule && (
              <div className="px-8 py-24 text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <span className="material-symbols-outlined text-3xl text-[#333]">folder_open</span>
                </div>
                <p className="text-base font-bold text-[#555] mb-2">{t("noModules")}</p>
                <p className="text-[13px] text-[#444] mb-8 leading-relaxed font-medium">{t("startBuilding")}</p>
                <button onClick={() => setShowAddModule(true)} className="bg-white/5 text-[#cafd00] border border-[#cafd00]/20 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#cafd00]/10 transition-all active:scale-95">
                  {t("addFirst")}
                </button>
              </div>
            )}

            {course.modules?.map((module: any, mIdx: number) => (
              <div key={module.id} className="group/module">
                {/* Module Header */}
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group mb-1",
                  expandedModules.has(module.id) ? "bg-white/5 shadow-lg border border-white/5" : "hover:bg-white/[0.03]"
                )}>
                  <div className="flex items-center gap-4 flex-1 overflow-hidden" onClick={() => toggleModule(module.id)}>
                    <span className={cn(
                      "material-symbols-outlined text-xl transition-transform duration-300",
                      expandedModules.has(module.id) ? "rotate-180 text-white" : "text-[#444]"
                    )}>keyboard_arrow_down</span>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#444] mb-0.5 group-hover:text-[#666] transition-colors">{t("module")} {mIdx + 1}</p>
                      <h3 className="text-base font-bold text-white truncate font-headline group-hover:text-[#cafd00] transition-colors">{module.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-black text-[#333] mr-2 pr-2 border-r border-white/10">{module.lessons?.length || 0}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.id); }}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-[#444] flex items-center justify-center transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>

                {/* Lessons */}
                {expandedModules.has(module.id) && (
                  <div className="mt-2 ml-4 space-y-2 border-l-2 border-white/5 pl-4 pb-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    {module.lessons?.map((lesson: any, lIdx: number) => (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={cn(
                          "group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border border-transparent",
                          activeLesson?.id === lesson.id 
                            ? "bg-[#cafd00]/10 border-[#cafd00]/30 shadow-[0_4px_20px_rgba(202,253,0,0.1)]" 
                            : "bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10"
                        )}
                      >
                        <div className="relative shrink-0">
                          {lesson.video_url ? (
                            <div className="w-20 h-14 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#cafd00]/30 transition-colors">
                              <img 
                                src={getYouTubeThumbnail(lesson.video_url) || ''} 
                                alt="" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white text-lg font-bold">play_arrow</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-20 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                              <span className="material-symbols-outlined text-[#333] group-hover:text-[#666]">videocam_off</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className={cn(
                            "text-base font-bold truncate transition-colors",
                            activeLesson?.id === lesson.id ? "text-white" : "text-[#999] group-hover:text-white"
                          )}>{lesson.title}</p>
                          <div className="flex items-center gap-3 mt-1 opacity-50">
                            <span className="text-[10px] font-black uppercase tracking-widest">{t("free")}</span>
                            {activeLesson?.id === lesson.id && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#cafd00] animate-pulse"></span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                          className="w-8 h-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-[#444] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                    ))}

                    {/* Add Lesson Form */}
                    {addLessonModuleId === module.id ? (
                      <div className="p-5 bg-white/5 rounded-2xl border-2 border-dashed border-[#cafd00]/20 animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-4">
                          <input
                            autoFocus
                            type="text"
                            value={newLessonTitle}
                            onChange={(e) => setNewLessonTitle(e.target.value)}
                            placeholder={t("lessonName")}
                            className="w-full bg-black border border-white/10 focus:border-[#cafd00]/40 text-white text-base px-4 py-3 rounded-xl focus:outline-none font-medium"
                          />
                          <input
                            type="text"
                            value={newLessonUrl}
                            onChange={(e) => setNewLessonUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddLesson()}
                            placeholder={t("youtubeUrl")}
                            className="w-full bg-black border border-white/10 focus:border-[#cafd00]/40 text-[#919191] text-sm px-4 py-3 rounded-xl focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddLesson}
                              disabled={addingLesson || !newLessonTitle.trim()}
                              className="flex-1 bg-[#cafd00] text-black py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                            >
                              {addingLesson ? t("saving") : t("add")}
                            </button>
                            <button
                              onClick={() => { setAddLessonModuleId(null); setNewLessonTitle(""); setNewLessonUrl(""); }}
                              className="px-5 py-3 text-[#666] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 active:scale-95"
                            >
                              {t("cancel")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddLessonModuleId(module.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border-2 border-dashed border-white/5 text-[#444] hover:border-[#cafd00]/20 hover:text-[#cafd00] hover:bg-[#cafd00]/[0.02] transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#cafd00]/10 transition-colors">
                          <span className="material-symbols-outlined text-xl font-bold">add</span>
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{t("addLesson")}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* ===== RIGHT CONTENT AREA ===== */}
        <main className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col">
          {activeLesson ? (
            <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
              <div className="max-w-5xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
                {/* Video Player */}
                <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5 group">
                  {activeLesson.video_url ? (
                    <iframe
                      src={`${embedUrl}?autoplay=1`}
                      className="w-full h-full pointer-events-auto"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 m-4 rounded-2xl">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-[#333]">play_disabled</span>
                      </div>
                      <p className="text-xl font-bold text-white mb-2">{t("noVideo")}</p>
                      <p className="text-[#666] text-sm font-medium">{t("pasteUrl")}</p>
                    </div>
                  )}
                  {/* Glass Overlay on top of iframe (optional, for aesthetics when not hovering) */}
                  <div className="absolute top-0 left-0 right-0 p-8 pt-24 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cafd00] mb-2">{t("nowPlaying")}</p>
                    <h2 className="text-4xl font-bold text-white tracking-tighter drop-shadow-lg">{activeLesson.title}</h2>
                  </div>
                </div>

                {/* Lesson Info */}
                <div className="flex items-center justify-between py-6 border-b border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#444]">{t("free")}</p>
                    <h2 className="text-4xl font-bold text-white text-shadow-glow tracking-tighter">{activeLesson.title}</h2>
                  </div>
                  <div className="flex gap-4">
                     <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl text-sm font-bold text-white border border-white/10 transition-all active:scale-95 grayscale hover:grayscale-0">
                       <span className="material-symbols-outlined">description</span>
                       Notes
                     </button>
                     <button className="flex items-center gap-3 bg-[#cafd00] hover:brightness-110 px-8 py-4 rounded-2xl text-sm font-black text-black transition-all active:scale-95 shadow-[0_10px_30px_rgba(202,253,0,0.2)]">
                       <span className="material-symbols-outlined font-black">check_circle</span>
                       Next
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-20 select-none animate-in fade-in duration-700">
              <div className="text-center space-y-10 group">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[#cafd00]/20 blur-[100px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <div className="w-32 h-32 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 group-hover:border-[#cafd00]/30 group-hover:bg-[#cafd00]/5 transition-all duration-700 rotate-12 group-hover:rotate-0">
                    <span className="material-symbols-outlined text-5xl text-[#222] group-hover:text-[#cafd00] transition-all duration-700 font-bold scale-[1.5]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-8xl font-black text-white/50 tracking-tighter mix-blend-difference group-hover:text-white transition-all duration-700 font-headline leading-none">{t("selectLesson")}</h2>
                  <p className="text-xl text-[#333] max-w-xl mx-auto font-medium leading-relaxed group-hover:text-[#666] transition-all duration-700">{t("selectDesc")}</p>
                </div>
                <div className="pt-12">
                   <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/[0.02] rounded-3xl border border-white/5 text-[10px] font-black uppercase tracking-[0.5em] text-[#222] group-hover:text-[#444] transition-all duration-700">
                     Ready to architect your course?
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

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');
