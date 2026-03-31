"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourseById } from "@/app/actions/get-dashboard";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonUrl, setNewLessonUrl] = useState("");

  useEffect(() => {
    getCourseById(courseId).then((data) => {
      setCourse(data);
      if (data?.modules?.length > 0) {
        setActiveModule(data.modules[0].id);
        if (data.modules[0].lessons?.length > 0) {
          setActiveLesson(data.modules[0].lessons[0]);
        }
      }
      setLoading(false);
    });
  }, [courseId]);

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#cafd00]/20 border-t-[#cafd00] rounded-full animate-spin"></div>
          <p className="text-[#919191] text-sm font-bold uppercase tracking-widest">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-[#333] mb-4">error</span>
          <h2 className="text-2xl font-bold text-white font-headline">Course not found</h2>
          <Link href="/library" className="mt-4 inline-block text-[#cafd00] hover:underline text-sm">← Back to Library</Link>
        </div>
      </div>
    );
  }

  const embedUrl = activeLesson ? getYouTubeEmbedUrl(activeLesson.video_url) : null;

  return (
    <div className="flex flex-col min-h-screen bg-black font-body">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-8 bg-black/80 backdrop-blur-xl border-b border-[#cafd00]/5">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/library")} className="text-[#919191] hover:text-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <div className="h-4 w-px bg-[#333]"></div>
          <h1 className="text-sm font-bold text-white tracking-tight font-headline">{course.title}</h1>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#cafd00] bg-[#cafd00]/10 px-3 py-1 rounded-full border border-[#cafd00]/20">
            {course.is_free ? "Free" : `$${course.price}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/create-course`} className="px-5 py-2 text-xs font-bold border border-[#333] text-[#919191] rounded-full hover:border-[#cafd00]/20 hover:text-white transition-all">
            Edit Structure
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Modules & Lessons */}
        <aside className="w-80 border-r border-[#cafd00]/5 bg-[#0a0a0a] flex flex-col overflow-y-auto no-scrollbar shrink-0">
          <div className="p-6 border-b border-[#cafd00]/5">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#cafd00]/60">Course Content</p>
            <p className="text-xs text-[#666] mt-1">{course.modules?.length || 0} modules</p>
          </div>

          <div className="flex-1 py-4">
            {course.modules?.length === 0 && (
              <div className="px-6 py-12 text-center">
                <span className="material-symbols-outlined text-4xl text-[#333] block mb-3">library_books</span>
                <p className="text-xs text-[#666]">No modules yet. Edit the course to add content.</p>
              </div>
            )}

            {course.modules?.map((mod: any, mIndex: number) => (
              <div key={mod.id} className="mb-1">
                {/* Module Header */}
                <button
                  onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-6 h-6 rounded-full bg-[#cafd00]/10 flex items-center justify-center text-[9px] font-black text-[#cafd00] shrink-0">
                      {mIndex + 1}
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">{mod.title}</span>
                  </div>
                  <span className={`material-symbols-outlined text-[#666] text-sm transition-transform ${activeModule === mod.id ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {/* Lessons */}
                {activeModule === mod.id && (
                  <div className="pb-2">
                    {mod.lessons?.map((lesson: any, lIndex: number) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-center gap-3 px-6 py-3 transition-all text-left group ${activeLesson?.id === lesson.id ? 'bg-[#cafd00]/10 border-l-2 border-[#cafd00]' : 'hover:bg-white/5 border-l-2 border-transparent'}`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${activeLesson?.id === lesson.id ? 'bg-[#cafd00] text-[#516700]' : 'bg-white/5 text-[#666]'}`}>
                          {lIndex + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${activeLesson?.id === lesson.id ? 'text-[#cafd00]' : 'text-[#919191] group-hover:text-white'} transition-colors`}>
                            {lesson.title}
                          </p>
                          {lesson.is_free && (
                            <span className="text-[9px] text-[#666] uppercase tracking-widest">Free Preview</span>
                          )}
                        </div>
                        {lesson.video_url && (
                          <span className="material-symbols-outlined text-sm text-[#666]">play_circle</span>
                        )}
                      </button>
                    ))}

                    {/* Add Lesson button */}
                    {showAddLesson === mod.id ? (
                      <div className="mx-4 mt-2 p-4 bg-[#111] rounded-2xl border border-[#cafd00]/10 space-y-3">
                        <input
                          type="text"
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                          placeholder="Dars nomi"
                          className="w-full bg-transparent border-b border-[#333] text-white text-sm py-2 focus:outline-none focus:border-[#cafd00] placeholder-[#555] transition-colors"
                        />
                        <input
                          type="text"
                          value={newLessonUrl}
                          onChange={(e) => setNewLessonUrl(e.target.value)}
                          placeholder="YouTube URL (ixtiyoriy)"
                          className="w-full bg-transparent border-b border-[#333] text-white text-sm py-2 focus:outline-none focus:border-[#cafd00] placeholder-[#555] transition-colors"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              setShowAddLesson(null);
                              setNewLessonTitle("");
                              setNewLessonUrl("");
                              alert("Dars qo'shish funksiyasi tez orada API orqali ulanadi!");
                            }}
                            className="flex-1 bg-[#cafd00] text-[#516700] py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setShowAddLesson(null)}
                            className="px-3 py-2 text-[#666] hover:text-white transition-colors text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddLesson(mod.id)}
                        className="w-full flex items-center gap-2 px-6 py-3 text-[#666] hover:text-[#cafd00] transition-colors text-xs"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Lesson
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content — Video Player */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeLesson ? (
            <>
              {/* Video Area */}
              <div className="relative bg-black" style={{ aspectRatio: '16/9', maxHeight: '65vh' }}>
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-[#0a0a0a]">
                    <div className="w-24 h-24 rounded-full bg-[#cafd00]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-[#cafd00]/30">videocam_off</span>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold font-headline">No video attached</p>
                      <p className="text-[#666] text-sm mt-1">Add a YouTube URL to this lesson to preview it here.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-[#111] px-6 py-3 rounded-2xl border border-[#333] max-w-md w-full mx-8">
                      <span className="material-symbols-outlined text-[#cafd00]/40">link</span>
                      <input
                        type="text"
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1 bg-transparent text-sm text-white placeholder-[#444] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#cafd00]/50">Now Playing</span>
                    {activeLesson.is_free && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#fedc00] bg-[#fedc00]/10 px-2 py-0.5 rounded-full border border-[#fedc00]/20">Free Preview</span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-white font-headline tracking-tight">{activeLesson.title}</h2>
                  {activeLesson.content && (
                    <p className="text-[#919191] leading-relaxed max-w-3xl">{activeLesson.content}</p>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#333] text-[#919191] hover:text-white hover:border-[#cafd00]/20 transition-all text-xs font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">skip_previous</span>
                    Previous
                  </button>
                  <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#cafd00] text-[#516700] hover:brightness-110 transition-all text-xs font-black uppercase tracking-widest">
                    Next Lesson
                    <span className="material-symbols-outlined text-sm">skip_next</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No lesson selected */
            <div className="flex-1 flex flex-col items-center justify-center gap-8 p-12">
              <div className="w-32 h-32 rounded-full bg-[#cafd00]/5 border border-[#cafd00]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-[#cafd00]/20">play_lesson</span>
              </div>
              <div className="text-center max-w-md">
                <h2 className="text-3xl font-bold text-white font-headline tracking-tight mb-3">Select a Lesson</h2>
                <p className="text-[#666] leading-relaxed">Choose a lesson from the left panel to start watching. You can expand modules to see all lessons inside.</p>
              </div>
              <div className="flex gap-4">
                <Link href="/library" className="px-6 py-3 rounded-full border border-[#333] text-[#919191] hover:text-white hover:border-[#cafd00]/20 transition-all text-xs font-bold uppercase tracking-widest">
                  ← Back to Library
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
