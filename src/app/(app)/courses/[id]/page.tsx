"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

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

  if (!course) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-[#333]">error_outline</span>
          <h2 className="text-xl font-bold text-white font-headline">Course not found</h2>
          <Link href="/library" className="text-[#cafd00] hover:underline text-sm">← Back to Library</Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] overflow-hidden">
      {/* ===== TOP BAR ===== */}
      <header className="h-14 flex items-center justify-between px-6 bg-[#0a0a0a] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/library")} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[#919191] text-lg">arrow_back</span>
          </button>
          <div className="h-5 w-px bg-white/10"></div>
          <h1 className="text-sm font-bold text-white tracking-tight">{course.title}</h1>
          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${course.is_free ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-[#cafd00] bg-[#cafd00]/10 border-[#cafd00]/20'}`}>
            {course.is_free ? "Free" : `$${course.price}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#666]">{course.modules?.length || 0} modules</span>
          <span className="text-[#333]">·</span>
          <span className="text-[#666]">{totalLessons} lessons</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="w-[340px] border-r border-white/5 bg-[#080808] flex flex-col shrink-0 overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#cafd00]/50 mb-0.5">Curriculum</p>
              <p className="text-[11px] text-[#555]">{course.modules?.length || 0} modules · {totalLessons} lessons</p>
            </div>
            <button
              onClick={() => setShowAddModule(true)}
              className="w-8 h-8 rounded-lg bg-[#cafd00]/10 hover:bg-[#cafd00]/20 flex items-center justify-center transition-all group"
              title="Add Module"
            >
              <span className="material-symbols-outlined text-[#cafd00] text-lg group-hover:scale-110 transition-transform">add</span>
            </button>
          </div>

          {/* Add Module Form */}
          {showAddModule && (
            <div className="p-4 border-b border-white/5 bg-[#0d0d0d]">
              <div className="space-y-3">
                <input
                  autoFocus
                  type="text"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                  placeholder="Module nomi..."
                  className="w-full bg-[#111] border border-white/10 focus:border-[#cafd00]/40 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none placeholder-[#444] transition-colors"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddModule}
                    disabled={addingModule || !newModuleTitle.trim()}
                    className="flex-1 bg-[#cafd00] text-black py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-30"
                  >
                    {addingModule ? "Saving..." : "Add Module"}
                  </button>
                  <button
                    onClick={() => { setShowAddModule(false); setNewModuleTitle(""); }}
                    className="px-4 py-2 text-[#666] hover:text-white transition-colors text-[11px] rounded-xl hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'none' }}>
            {(!course.modules || course.modules.length === 0) && !showAddModule && (
              <div className="px-5 py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-2xl text-[#333]">folder_open</span>
                </div>
                <p className="text-sm font-medium text-[#555] mb-1">No modules yet</p>
                <p className="text-xs text-[#444] mb-5">Start building your curriculum</p>
                <button onClick={() => setShowAddModule(true)} className="text-[#cafd00] text-xs font-bold hover:underline">
                  + Add first module
                </button>
              </div>
            )}

            {course.modules?.map((mod: any, mIndex: number) => (
              <div key={mod.id} className="border-b border-white/[0.03]">
                {/* Module Header */}
                <div className="flex items-center group">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="flex-1 flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors text-left"
                  >
                    <span className={`material-symbols-outlined text-[#555] text-base transition-transform duration-200 ${expandedModules.has(mod.id) ? 'rotate-90' : ''}`}>
                      chevron_right
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-0.5">Module {mIndex + 1}</p>
                      <p className="text-sm font-medium text-white truncate">{mod.title}</p>
                    </div>
                    <span className="text-[10px] text-[#444] tabular-nums">{mod.lessons?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteModule(mod.id)}
                    className="opacity-0 group-hover:opacity-100 mr-3 w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center transition-all"
                    title="Delete Module"
                  >
                    <span className="material-symbols-outlined text-red-400/60 text-sm">delete</span>
                  </button>
                </div>

                {/* Lessons */}
                {expandedModules.has(mod.id) && (
                  <div className="pb-1">
                    {mod.lessons?.map((lesson: any, lIndex: number) => {
                      const isActive = activeLesson?.id === lesson.id;
                      const thumb = getYouTubeThumbnail(lesson.video_url);
                      return (
                        <div key={lesson.id} className="group/lesson flex items-center">
                          <button
                            onClick={() => setActiveLesson(lesson)}
                            className={`flex-1 flex items-center gap-3 px-5 pl-12 py-2.5 transition-all text-left ${isActive ? 'bg-[#cafd00]/[0.07]' : 'hover:bg-white/[0.02]'}`}
                          >
                            {thumb ? (
                              <img src={thumb} alt="" className="w-12 h-7 rounded object-cover shrink-0 border border-white/5" />
                            ) : (
                              <div className="w-12 h-7 rounded bg-white/5 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[#333] text-xs">play_arrow</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs truncate transition-colors ${isActive ? 'text-[#cafd00] font-semibold' : 'text-[#999]'}`}>
                                {lesson.title}
                              </p>
                            </div>
                            {lesson.video_url && (
                              <span className={`material-symbols-outlined text-sm ${isActive ? 'text-[#cafd00]' : 'text-[#333]'}`}>play_circle</span>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="opacity-0 group-hover/lesson:opacity-100 mr-3 w-6 h-6 rounded hover:bg-red-500/10 flex items-center justify-center transition-all"
                          >
                            <span className="material-symbols-outlined text-red-400/50 text-xs">close</span>
                          </button>
                        </div>
                      );
                    })}

                    {/* Add Lesson */}
                    {addLessonModuleId === mod.id ? (
                      <div className="mx-5 ml-12 mt-1 mb-2 p-3 bg-[#0d0d0d] rounded-xl border border-white/5 space-y-2">
                        <input
                          autoFocus
                          type="text"
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                          placeholder="Dars nomi"
                          className="w-full bg-[#111] border border-white/10 focus:border-[#cafd00]/30 text-white text-xs px-3 py-2 rounded-lg focus:outline-none placeholder-[#444] transition-colors"
                        />
                        <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-lg px-3 py-2">
                          <span className="material-symbols-outlined text-red-500 text-sm">smart_display</span>
                          <input
                            type="text"
                            value={newLessonUrl}
                            onChange={(e) => setNewLessonUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddLesson()}
                            placeholder="YouTube URL (ixtiyoriy)"
                            className="flex-1 bg-transparent text-xs text-white placeholder-[#444] focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddLesson}
                            disabled={addingLesson || !newLessonTitle.trim()}
                            className="flex-1 bg-[#cafd00] text-black py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-30"
                          >
                            {addingLesson ? "..." : "Add Lesson"}
                          </button>
                          <button onClick={() => { setAddLessonModuleId(null); setNewLessonTitle(""); setNewLessonUrl(""); }}
                            className="px-3 py-1.5 text-[#666] hover:text-white text-[10px] rounded-lg hover:bg-white/5 transition-all">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddLessonModuleId(mod.id)}
                        className="flex items-center gap-2 px-5 pl-12 py-2 text-[#555] hover:text-[#cafd00] transition-colors text-[11px] w-full text-left"
                      >
                        <span className="material-symbols-outlined text-sm">add_circle_outline</span>
                        Add Lesson
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 flex flex-col overflow-hidden bg-black">
          {activeLesson ? (
            <>
              {/* Video Player */}
              <div className="bg-black shrink-0" style={{ aspectRatio: '16/9', maxHeight: '60vh' }}>
                {embedUrl && getYouTubeId(activeLesson.video_url) ? (
                  <iframe
                    key={activeLesson.id}
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-[#060606]">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#333]">videocam_off</span>
                    </div>
                    <div className="text-center">
                      <p className="text-white/80 font-medium text-sm mb-1">No video attached</p>
                      <p className="text-[#555] text-xs">Paste a YouTube URL when adding the lesson</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Details */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6" style={{ scrollbarWidth: 'none' }}>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#cafd00]/40 mb-2">Now Playing</p>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{activeLesson.title}</h2>
                  {activeLesson.content && <p className="text-[#777] mt-3 leading-relaxed text-sm">{activeLesson.content}</p>}
                </div>

                {activeLesson.video_url && (
                  <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-4 py-2.5 border border-white/5 max-w-lg">
                    <span className="material-symbols-outlined text-red-500 text-sm">smart_display</span>
                    <span className="text-xs text-[#666] truncate">{activeLesson.video_url}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-[#222]">slideshow</span>
              </div>
              <div className="text-center max-w-sm">
                <h2 className="text-xl font-bold text-white mb-2">Select a Lesson</h2>
                <p className="text-[#555] text-sm leading-relaxed">Choose a lesson from the sidebar or add new modules and lessons to start building your course.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
