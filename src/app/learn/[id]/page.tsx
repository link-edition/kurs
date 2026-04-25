"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

type Lang = 'uz' | 'en';
const t: Record<Lang, Record<string, string>> = {
  uz: {
    allCourses: "Barcha kurslar", curriculum: "O'quv dasturi", module: "modul",
    lessons: "dars", free: "Bepul", nowPlaying: "Hozir ijroda",
    noVideo: "Bu darsga video biriktirilmagan", selectLesson: "Darsni tanlang",
    selectDesc: "Chapdan modulni oching va istalgan darsni bosing.",
    prev: "Oldingi", next: "Keyingi dars", courseNotFound: "Kurs topilmadi",
    backAll: "← Barcha kurslarga qaytish", lang: "Til",
    completed: "Tugallangan", markComplete: "Tugallandi deb belgilash",
    markIncomplete: "Bekor qilish", progress: "O'zlashtirildi",
    loginToTrack: "Progressni kuzatish uchun tizimga kiring",
    finish: "Kursni yakunlash",
  },
  en: {
    allCourses: "All Courses", curriculum: "Curriculum", module: "module",
    lessons: "lessons", free: "Free", nowPlaying: "Now Playing",
    noVideo: "No video attached to this lesson", selectLesson: "Select a Lesson",
    selectDesc: "Expand a module from the left and click a lesson.",
    prev: "Previous", next: "Next Lesson", courseNotFound: "Course not found",
    backAll: "← Back to all courses", lang: "Language",
    completed: "Completed", markComplete: "Mark as complete",
    markIncomplete: "Undo", progress: "Progress",
    loginToTrack: "Sign in to track your progress",
    finish: "Finish Course",
  },
};

export default function StudentCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [lang, setLang] = useState<Lang>("uz");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [progressPercent, setProgressPercent] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang;
    if (saved === "uz" || saved === "en") setLang(saved);
  }, []);

  const L = t[lang];

  // Fetch course
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

  // Fetch progress
  const fetchProgress = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/progress?courseId=${courseId}`);
      const data = await res.json();
      setCompletedLessons(new Set(data.completed || []));
      setProgressPercent(data.percentage || 0);
    } catch { }
  }, [user, courseId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const allLessons = useMemo(() => {
    if (!course?.modules) return [];
    return course.modules.flatMap((mod: any) => mod.lessons || []);
  }, [course]);

  const currentIndex = useMemo(() => {
    if (!activeLesson) return -1;
    return allLessons.findIndex((l: any) => l.id === activeLesson.id);
  }, [activeLesson, allLessons]);

  const toggleComplete = async (lessonId: string) => {
    if (!user) return;
    const isCompleted = completedLessons.has(lessonId);
    const newCompleted = new Set(completedLessons);
    if (isCompleted) newCompleted.delete(lessonId); else newCompleted.add(lessonId);
    setCompletedLessons(newCompleted);
    const total = allLessons.length;
    setProgressPercent(total > 0 ? Math.round((newCompleted.size / total) * 100) : 0);

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, courseId, completed: !isCompleted }),
      });
    } catch { fetchProgress(); }
  };

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
    return match ? match[1] : null;
  };

  // Smart scroll to active lesson
  useEffect(() => {
    if (activeLesson) {
      const element = document.getElementById(`lesson-${activeLesson.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLesson]);

  const totalLessons = allLessons.length;
  const embedUrl = activeLesson?.video_url ? `https://www.youtube.com/embed/${getYouTubeId(activeLesson.video_url)}?rel=0&modestbranding=1&autoplay=1` : null;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalLessons - 1;

  const goPrev = () => {
    if (hasPrev) setActiveLesson(allLessons[currentIndex - 1]);
  };

  const goNext = () => {
    if (hasNext) setActiveLesson(allLessons[currentIndex + 1]);
  };

  if (loading) return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500">
      {/* Header Skeleton */}
      <div className="h-16 lg:h-20 border-b border-border flex items-center justify-between px-8 bg-card/50">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 rounded-2xl bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="w-48 h-4 bg-muted animate-pulse" />
            <div className="w-24 h-2 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32 h-2 bg-muted/50 rounded-full" />
          <div className="w-10 h-10 rounded-2xl bg-muted" />
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton */}
        <aside className="w-[350px] border-r border-border p-8 space-y-8 hidden lg:block bg-card">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-3 bg-muted animate-pulse" />
                  <div className="w-1/2 h-2 bg-muted/50 rounded" />
                </div>
              </div>
              <div className="pl-4 space-y-2">
                <div className="w-full h-12 rounded-[24px] bg-muted/20" />
                <div className="w-full h-12 rounded-[24px] bg-muted/20" />
              </div>
            </div>
          ))}
        </aside>
        
        {/* Main Content Skeleton */}
        <main className="flex-1 p-12 lg:p-20 space-y-12 bg-background">
          <div className="aspect-video w-full rounded-[48px] bg-muted/40 animate-pulse shadow-xl shadow-black/5" />
          <div className="max-w-4xl space-y-8 text-left">
            <div className="space-y-4">
              <div className="w-24 h-4 bg-[#cafd00]/20 rounded-full" />
              <div className="w-2/3 h-12 bg-muted rounded-xl" />
            </div>
            <div className="space-y-4">
              <div className="w-full h-4 bg-muted/30 rounded" />
              <div className="w-full h-4 bg-muted/30 rounded" />
              <div className="w-3/4 h-4 bg-muted/30 rounded" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-8 p-6">
      <div className="w-32 h-32 bg-card rounded-full flex items-center justify-center border border-border shadow-2xl">
        <span className="material-symbols-outlined text-6xl text-muted-foreground">warning</span>
      </div>
      <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">{L.courseNotFound}</h2>
      <Link href="/library" className="px-8 py-4 bg-[#cafd00] text-[#516700] rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">{L.backAll}</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-body selection:bg-[#cafd00] selection:text-black transition-colors duration-500 text-left">
      {/* Dynamic Header */}
      <header className="h-16 lg:h-24 flex items-center justify-between px-4 sm:px-12 bg-card/80 backdrop-blur-3xl border-b border-border sticky top-0 z-[100] transition-all">
        <div className="flex items-center gap-4 lg:gap-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden w-11 h-11 rounded-full bg-muted flex items-center justify-center text-[#cafd00] shadow-inner transition-transform active:scale-90">
            <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
          </button>
          
          <Link href="/library" className="hidden sm:flex items-center gap-3 text-muted-foreground hover:text-[#cafd00] transition-all group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform font-black">arrow_back</span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] font-headline">{L.allCourses}</span>
          </Link>
          
          <div className="h-6 w-px bg-border hidden lg:block"></div>
          <div className="max-w-[150px] sm:max-w-md">
            <h1 className="text-base lg:text-xl font-black text-foreground truncate uppercase italic tracking-tighter font-headline leading-none">{course.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cafd00] animate-pulse"></span>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{progressPercent}% {L.progress}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-10">
          {user && (
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 italic">{currentIndex + 1} / {totalLessons} {L.lessons}</span>
                <span className="text-[12px] font-black text-[#a58d00] dark:text-[#cafd00] font-headline">{progressPercent}%</span>
              </div>
              <div className="w-40 h-2 bg-muted rounded-full overflow-hidden border border-border/50">
                <div className="h-full bg-[#cafd00] transition-all duration-1000 shadow-[0_0_15px_rgba(202,253,0,0.4)]" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
          
          <button onClick={() => router.push('/dashboard')} className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center hover:bg-card hover:border-[#cafd00]/30 transition-all text-muted-foreground hover:text-foreground group shadow-sm active:scale-95">
            <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">close</span>
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)] lg:h-[calc(100vh-96px)] relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && <div className="lg:hidden fixed inset-0 z-[60] bg-background/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSidebarOpen(false)} />}

        {/* Cinematic Sidebar */}
        <aside className={cn(
          "fixed lg:relative z-[70] lg:z-auto h-full w-[300px] sm:w-[380px] bg-card border-r border-border flex flex-col transition-all duration-700 ease-elastic overflow-hidden shadow-2xl dark:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-6 sm:p-8 border-b border-border bg-gradient-to-b from-muted to-transparent relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 relative z-10">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#a58d00] dark:text-[#cafd00] font-headline">{L.curriculum}</p>
              <span className="px-2 py-0.5 bg-background border border-border rounded-full text-[9px] font-black text-muted-foreground italic uppercase">{currentIndex + 1} dars</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground italic leading-tight uppercase font-headline tracking-tighter truncate">{course.subtitle || course.title}</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 no-scrollbar scroll-smooth">
            {course.modules?.map((mod: any, mIndex: number) => (
              <div key={mod.id} className="space-y-4">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-foreground uppercase italic truncate tracking-tighter font-headline leading-none mb-1 opacity-80">0{mIndex + 1}. {mod.title}</p>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">{mod.lessons?.length || 0} {L.lessons}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pl-2">
                  {mod.lessons?.map((lesson: any, lIndex: number) => {
                    const isActive = activeLesson?.id === lesson.id;
                    const isCompleted = completedLessons.has(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        id={`lesson-${lesson.id}`}
                        onClick={() => { setActiveLesson(lesson); setSidebarOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-4 p-3.5 rounded-[20px] transition-all duration-300 text-left border relative group active:scale-95",
                          isActive 
                            ? "bg-[#cafd00] border-[#cafd00] shadow-[0_10px_30px_rgba(202,253,0,0.3)]" 
                            : isCompleted 
                              ? "bg-emerald-500/5 border-emerald-500/10" 
                              : "bg-muted/5 border-transparent hover:border-border hover:bg-muted/20"
                        )}
                      >
                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0",
                          isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-black text-[#cafd00]" : "bg-card text-muted-foreground"
                        )}>
                          {isCompleted ? <span className="material-symbols-outlined text-xs font-black">check</span> : lIndex + 1}
                        </div>
                        <p className={cn(
                          "text-[15px] sm:text-[17px] font-black flex-1 leading-none uppercase font-headline italic tracking-tighter truncate",
                          isActive ? "text-black" : isCompleted ? "text-muted-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>{lesson.title}</p>
                        <span className={cn(
                          "material-symbols-outlined text-xl transition-all",
                          isActive ? "text-black" : "text-muted-foreground/10 group-hover:text-[#cafd00]/40"
                        )}>play_circle</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="h-20"></div>
          </div>
        </aside>

        {/* Main Cinema Area */}
        <main className="flex-1 flex flex-col bg-background relative overflow-hidden">
          {activeLesson ? (
            <>
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Video Player Section */}
                <div className="w-full bg-black relative group/player flex items-center justify-center border-b border-border shadow-2xl z-20" style={{ aspectRatio: '16/9', maxHeight: '68vh' }}>
                  {embedUrl ? (
                    <iframe key={activeLesson.id} src={embedUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-[#030303]">
                      <div className="w-32 h-32 rounded-[40px] bg-white/[0.03] border border-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-7xl text-[#111]">smart_display</span>
                      </div>
                      <p className="text-[#333] text-sm font-black uppercase tracking-[0.5em] font-headline">{L.noVideo}</p>
                    </div>
                  )}
                </div>

                {/* Content Details Removed as per User Request for a Clean Look */}
                <div className="flex-1 bg-background"></div>
              </div>

              {/* Futuristic Controller - Solid Masking */}
              <div className="absolute bottom-0 left-0 right-0 z-[100] pointer-events-none">
                {/* Subtle base shadow */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/40 to-transparent h-24 pointer-events-none"></div>
                
                <div className="relative w-[96%] max-w-5xl mx-auto pb-6 sm:pb-10 px-4">
                  <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
                    <button 
                      onClick={goPrev} disabled={!hasPrev}
                      className="w-14 h-14 sm:w-16 sm:h-16 bg-card border border-border rounded-2xl text-muted-foreground hover:text-[#cafd00] hover:border-[#cafd00]/30 transition-all flex items-center justify-center disabled:opacity-0 active:scale-90 shadow-lg"
                    >
                      <span className="material-symbols-outlined text-2xl">west</span>
                    </button>

                    {user && (
                      <button
                        onClick={() => toggleComplete(activeLesson.id)}
                        className={cn(
                          "h-14 sm:h-16 px-6 sm:px-8 rounded-2xl sm:rounded-3xl border transition-all flex items-center gap-3 active:scale-95 shadow-lg",
                          completedLessons.has(activeLesson.id)
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-card border-border text-muted-foreground hover:text-[#cafd00] hover:border-[#cafd00]/30"
                        )}
                      >
                        <span className="material-symbols-outlined text-xl sm:text-2xl font-black">{completedLessons.has(activeLesson.id) ? 'check_circle' : 'circle'}</span>
                        <span className="hidden md:block text-[10px] sm:text-xs font-black uppercase tracking-widest font-headline">{completedLessons.has(activeLesson.id) ? L.completed : L.markComplete}</span>
                      </button>
                    )}

                    <button 
                      onClick={() => setShowAttachmentsModal(true)}
                      className="flex-1 bg-card border border-border rounded-2xl sm:rounded-full h-14 sm:h-16 flex items-center justify-between px-6 sm:px-10 group hover:border-[#cafd00]/30 transition-all active:scale-[0.98] shadow-lg"
                    >
                       <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined text-[#cafd00] text-2xl group-hover:scale-110 transition-transform">folder_managed</span>
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors font-headline">{lang === 'uz' ? 'MATERIALLAR' : 'MATERIALS'}</span>
                       </div>
                       {activeLesson.attachments?.length > 0 && (
                         <span className="w-5 h-5 rounded-full bg-[#cafd00] text-black text-[9px] font-black flex items-center justify-center shadow-lg">{activeLesson.attachments.length}</span>
                       )}
                    </button>

                    <button 
                      onClick={goNext} disabled={!hasNext}
                      className="min-w-[140px] sm:min-w-[240px] h-14 sm:h-16 bg-[#cafd00] text-[#516700] rounded-2xl sm:rounded-full shadow-xl hover:bg-[#d8ff00] hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-between px-6 sm:px-10 group disabled:opacity-20"
                    >
                      <span className="text-xs sm:text-sm font-black uppercase italic tracking-tighter font-headline">{L.next}</span>
                      <span className="material-symbols-outlined text-3xl font-black group-hover:translate-x-2 transition-transform">east</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10 bg-background transition-colors duration-500">
              <div className="w-48 h-48 bg-card border border-border rounded-full flex items-center justify-center relative shadow-2xl">
                <span className="material-symbols-outlined text-8xl text-muted-foreground opacity-10">smart_display</span>
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase italic tracking-tighter font-headline leading-none">{L.selectLesson}</h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto leading-relaxed uppercase tracking-[0.2em] font-medium opacity-60 font-body">{L.selectDesc}</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Materials Modal (High Impact Design) */}
      {showAttachmentsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowAttachmentsModal(false)}>
           <div className="w-full max-w-2xl bg-card border border-border rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
              <div className="p-8 sm:p-10 border-b border-border flex items-center justify-between bg-muted/20">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground uppercase italic tracking-tighter font-headline leading-none">{lang === 'uz' ? 'DARSLIK ASSETLARI' : 'LESSON ASSETS'}</h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-2 opacity-60 font-headline">{lang === 'uz' ? 'Fayllar va hujjatlar' : 'Files and documents'}</p>
                </div>
                <button onClick={() => setShowAttachmentsModal(false)} className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:rotate-90 transition-all font-black">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar bg-card">
                {activeLesson.attachments?.length > 0 ? activeLesson.attachments.map((att: any, i: number) => (
                  <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 sm:p-6 bg-muted/10 border border-border rounded-[24px] hover:border-[#cafd00]/40 transition-all group active:scale-[0.98]">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-inner group-hover:border-[#cafd00]/30 transition-all">
                        <span className="material-symbols-outlined text-[#cafd00] text-2xl">inventory_2</span>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-black text-foreground group-hover:text-[#cafd00] transition-colors leading-tight font-headline italic uppercase tracking-tight">{att.name}</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase mt-1 opacity-40 font-headline">{att.type || 'Fayl'}</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-[#cafd00] group-hover:text-[#516700] group-hover:border-[#cafd00] transition-all">
                      <span className="material-symbols-outlined text-xl">download</span>
                    </div>
                  </a>
                )) : (
                  <div className="py-20 text-center text-muted-foreground/40 italic uppercase font-black text-xl tracking-tighter">Manbalar mavjud emas</div>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
