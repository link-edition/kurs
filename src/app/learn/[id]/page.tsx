"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StudentCoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setCourse(data);
          if (data?.modules?.length > 0) {
            setExpandedModules(new Set([data.modules[0].id]));
            if (data.modules[0].lessons?.length > 0) {
              setActiveLesson(data.modules[0].lessons[0]);
            }
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
    return match ? match[1] : null;
  };

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalLessons = course?.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;
  const embedUrl = activeLesson?.video_url ? `https://www.youtube.com/embed/${getYouTubeId(activeLesson.video_url)}?rel=0&modestbranding=1` : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#cafd00]/20 border-t-[#cafd00] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-[#333]">error_outline</span>
          <h2 className="text-xl font-bold text-white">Kurs topilmadi</h2>
          <Link href="/catalog" className="text-[#cafd00] hover:underline text-sm">← Barcha kurslarga qaytish</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body">
      {/* Top Navigation */}
      <header className="h-14 flex items-center justify-between px-6 bg-black/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/catalog" className="flex items-center gap-2 text-[#919191] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Barcha kurslar</span>
          </Link>
          <div className="h-4 w-px bg-white/10"></div>
          <h1 className="text-sm font-bold text-white truncate max-w-[300px]">{course.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-[#666]">
            <span>{course.modules?.length || 0} modul</span>
            <span>·</span>
            <span>{totalLessons} dars</span>
          </div>
          {course.is_free ? (
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Bepul</span>
          ) : (
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#cafd00] bg-[#cafd00]/10 px-3 py-1 rounded-full border border-[#cafd00]/20">${course.price}</span>
          )}
        </div>
      </header>

      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar — Course Content */}
        <aside className="w-[320px] bg-[#060606] border-r border-white/5 flex flex-col overflow-hidden shrink-0">
          <div className="p-5 border-b border-white/5">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#cafd00]/50 mb-0.5">O&apos;quv dasturi</p>
            <p className="text-[11px] text-[#555]">{course.modules?.length || 0} modul · {totalLessons} dars</p>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {course.modules?.map((mod: any, mIndex: number) => (
              <div key={mod.id} className="border-b border-white/[0.03]">
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left"
                >
                  <span className={`material-symbols-outlined text-[#555] text-base transition-transform duration-200 ${expandedModules.has(mod.id) ? 'rotate-90' : ''}`}>
                    chevron_right
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-0.5">{mIndex + 1}-modul</p>
                    <p className="text-sm font-medium text-white truncate">{mod.title}</p>
                  </div>
                  <span className="text-[10px] text-[#444] tabular-nums">{mod.lessons?.length || 0}</span>
                </button>

                {expandedModules.has(mod.id) && (
                  <div className="pb-2">
                    {mod.lessons?.map((lesson: any, lIndex: number) => {
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full flex items-center gap-3 px-5 pl-12 py-3 transition-all text-left ${isActive ? 'bg-[#cafd00]/[0.07] border-l-2 border-[#cafd00]' : 'hover:bg-white/[0.02] border-l-2 border-transparent'}`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isActive ? 'bg-[#cafd00] text-black' : 'bg-white/5 text-[#555]'}`}>
                            {lIndex + 1}
                          </div>
                          <p className={`text-xs truncate flex-1 ${isActive ? 'text-[#cafd00] font-semibold' : 'text-[#888]'}`}>{lesson.title}</p>
                          {lesson.video_url && (
                            <span className={`material-symbols-outlined text-sm ${isActive ? 'text-[#cafd00]' : 'text-[#333]'}`}>play_circle</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main — Video Player */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeLesson ? (
            <>
              <div className="bg-black shrink-0 w-full" style={{ aspectRatio: '16/9', maxHeight: '65vh' }}>
                {embedUrl ? (
                  <iframe
                    key={activeLesson.id}
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#060606]">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-[#333]">videocam_off</span>
                    </div>
                    <p className="text-[#555] text-sm">Bu darsga video biriktirilmagan</p>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6" style={{ scrollbarWidth: 'none' }}>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#cafd00]/40 mb-2">Hozir ijroda</p>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{activeLesson.title}</h2>
                  {activeLesson.content && <p className="text-[#777] mt-3 text-sm leading-relaxed">{activeLesson.content}</p>}
                </div>

                {/* Lesson Navigation */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#333] text-[#919191] hover:text-white hover:border-[#cafd00]/20 transition-all text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">skip_previous</span>
                    Oldingi
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#cafd00] text-black hover:brightness-110 transition-all text-xs font-black uppercase tracking-wider">
                    Keyingi dars
                    <span className="material-symbols-outlined text-sm">skip_next</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-[#222]">slideshow</span>
              </div>
              <div className="text-center max-w-sm">
                <h2 className="text-xl font-bold text-white mb-2">Darsni tanlang</h2>
                <p className="text-[#555] text-sm">Chapdan modulni oching va istalgan darsni bosing.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
