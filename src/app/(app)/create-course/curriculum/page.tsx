"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/lib/lang-context";

export default function Step2Curriculum() {
  const { modules, addModule, addLesson } = useCourseStore();
  const { t } = useLang();
  const router = useRouter();

  const [newModuleName, setNewModuleName] = useState("");
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", videoUrl: "", description: "", isFree: false, moduleId: "" });

  const handleAddModule = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newModuleName.trim()) {
      addModule({ id: Date.now().toString(), title: newModuleName.trim(), lessons: [] });
      setNewModuleName("");
    }
  };

  const startAddingLesson = (moduleId: string) => {
    setEditingLessonId("new");
    setEditForm({ title: "", videoUrl: "", description: "", isFree: false, moduleId });
  };

  const handleSaveLesson = () => {
    if (editForm.title.trim() && editForm.moduleId) {
      addLesson(editForm.moduleId, {
        id: Date.now().toString(),
        title: editForm.title.trim(),
        videoUrl: editForm.videoUrl,
        content: editForm.description,
        isFree: editForm.isFree
      });
    }
    setEditingLessonId(null);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden font-body animate-in fade-in slide-in-from-bottom-2 duration-700">

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32 px-6 md:px-12 pt-10">
        <header className="mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#cafd00] mb-4 block">
            {t("step")} 02 {t("of")} 04
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4 font-headline uppercase italic">
            {t("curriculum")}
          </h1>
          <p className="text-[#888] max-w-xl text-base leading-relaxed font-light">
            {t("designJourney")}. {t("modulesDesc")}
          </p>
        </header>

        {/* Add Module Input */}
        <div className="bg-[#111] border border-white/5 rounded-[24px] p-6 mb-8 shadow-xl">
          <label className="text-sm uppercase tracking-widest text-[#fedc00] font-black font-headline mb-4 block">
            {t("addModule")}
          </label>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 flex items-center gap-4 focus-within:border-[#cafd00]/50 transition-all">
            <span className="material-symbols-outlined text-[#cafd00]/60 text-2xl ml-3">folder_open</span>
            <input
              placeholder={`${t("moduleName")} — Enter tugmasini bosing`}
              className="flex-1 bg-transparent border-none px-2 py-3 text-lg text-white placeholder-[#444] focus:ring-0 font-body focus:outline-none"
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              onKeyDown={handleAddModule}
            />
            <button
              onClick={() => {
                if (newModuleName.trim()) {
                  addModule({ id: Date.now().toString(), title: newModuleName.trim(), lessons: [] });
                  setNewModuleName("");
                }
              }}
              className="bg-[#cafd00] text-[#516700] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest font-headline hover:brightness-110 transition-all mr-1"
            >
              {t("add")}
            </button>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-6 max-w-4xl">
          {modules.map((module, mIdx) => (
            <div key={module.id} className="bg-[#111] border border-white/5 rounded-[24px] overflow-hidden shadow-xl">
              {/* Module Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                <div className="flex items-center gap-5">
                  <span className="text-sm font-black text-[#cafd00]/50 tracking-[0.3em] font-headline">0{mIdx + 1}</span>
                  <h3 className="text-xl font-bold text-white font-headline">{module.title}</h3>
                  <span className="text-xs text-[#555] font-medium bg-white/5 px-3 py-1 rounded-full">
                    {module.lessons.length} {t("lessons")}
                  </span>
                </div>
                <button
                  onClick={() => startAddingLesson(module.id)}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#888] hover:text-[#cafd00] transition-colors font-headline group"
                >
                  <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
                  {t("addLesson")}
                </button>
              </div>

              {/* Lessons */}
              <div className="p-4 space-y-2">
                {module.lessons.map((lesson, lIdx) => (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      setEditingLessonId("edit");
                      setEditForm({ title: lesson.title, videoUrl: lesson.videoUrl || "", description: lesson.content || "", isFree: lesson.isFree || false, moduleId: module.id });
                    }}
                    className="flex items-center justify-between bg-[#0d0d0d] border border-white/5 rounded-2xl px-6 py-4 cursor-pointer hover:border-[#cafd00]/30 hover:bg-[#cafd00]/5 transition-all group/lesson"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-[#333] group-hover/lesson:text-[#cafd00] transition-colors">{mIdx + 1}.{lIdx + 1}</span>
                      <span className="material-symbols-outlined text-[#333] group-hover/lesson:text-[#555] text-lg">drag_indicator</span>
                      <span className="text-base text-white font-medium">{lesson.title}</span>
                      {lesson.isFree && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#516700] px-2.5 py-1 bg-[#cafd00] rounded-full">
                          {t("free")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover/lesson:opacity-100 transition-all">
                      <span className="material-symbols-outlined text-[#888] text-lg hover:text-[#cafd00] transition-colors">edit</span>
                    </div>
                  </div>
                ))}

                {module.lessons.length === 0 && (
                  <div
                    onClick={() => startAddingLesson(module.id)}
                    className="border border-dashed border-[#222] rounded-2xl px-6 py-5 flex items-center gap-4 cursor-pointer hover:border-[#cafd00]/40 hover:bg-[#cafd00]/5 transition-all group/empty"
                  >
                    <span className="material-symbols-outlined text-[#333] group-hover/empty:text-[#cafd00] transition-colors">add</span>
                    <span className="text-sm text-[#555] group-hover/empty:text-[#888] transition-colors">{t("addFirstLesson")}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {modules.length === 0 && (
            <div className="text-center py-20 border border-dashed border-[#222] rounded-[24px] text-[#555]">
              <span className="material-symbols-outlined text-5xl mb-4 block opacity-40">folder_off</span>
              <p className="text-lg font-light italic opacity-60">{t("noModules")}</p>
              <p className="text-sm mt-2 opacity-40">{t("startBuilding")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Lesson Editor */}
      {editingLessonId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingLessonId(null)} />
          <aside className="relative h-full w-full max-w-[480px] bg-[#0d0d0d] border-l border-white/10 flex flex-col z-10 animate-in slide-in-from-right duration-400 shadow-2xl">
            
            <header className="px-10 py-8 border-b border-white/5 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cafd00] mb-2 font-headline">{t("lessonSettings")}</p>
                <h2 className="text-2xl font-bold text-white font-headline">{editingLessonId === "new" ? t("addLesson") : t("editCourse")}</h2>
              </div>
              <button onClick={() => setEditingLessonId(null)} className="w-10 h-10 flex items-center justify-center text-[#555] hover:text-white transition-colors bg-white/5 rounded-full border border-white/5 hover:border-white/20">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8">
              {/* Title Input */}
              <div className="space-y-3">
                <label className="text-sm uppercase tracking-widest text-[#fedc00] font-black font-headline">{t("name")}</label>
                <div className="bg-black border border-white/10 rounded-2xl p-2 focus-within:border-[#cafd00]/50 transition-all">
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder={t("lessonName")}
                    className="w-full bg-transparent border-none px-4 py-3 text-lg text-white placeholder-[#444] focus:ring-0 font-body focus:outline-none"
                  />
                </div>
              </div>

              {/* Video URL */}
              <div className="space-y-3">
                <label className="text-sm uppercase tracking-widest text-[#fedc00] font-black font-headline">YouTube URL</label>
                <div className="bg-black border border-white/10 rounded-2xl p-2 focus-within:border-[#cafd00]/50 transition-all flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#cafd00]/50 text-xl ml-3">video_library</span>
                  <input
                    value={editForm.videoUrl}
                    onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                    placeholder={t("youtubeUrl")}
                    className="flex-1 bg-transparent border-none py-3 text-base text-white placeholder-[#444] focus:ring-0 font-body focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm uppercase tracking-widest text-[#fedc00] font-black font-headline">{t("shortDescLabel")}</label>
                <div className="bg-black border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#cafd00]/50 transition-all">
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder={t("placeholderDesc")}
                    rows={4}
                    className="w-full bg-transparent border-none px-5 py-4 text-base text-[#ccc] placeholder-[#444] focus:ring-0 font-body focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Free Preview Toggle */}
              <div
                onClick={() => setEditForm({ ...editForm, isFree: !editForm.isFree })}
                className="bg-[#111] border border-white/5 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:border-[#cafd00]/20 transition-all"
              >
                <div>
                  <p className="text-base font-bold text-white mb-1">{t("freePreview")}</p>
                  <p className="text-xs text-[#555]">{t("publicAccess")}</p>
                </div>
                <div className={`w-12 h-7 rounded-full relative transition-all flex items-center ${editForm.isFree ? 'bg-[#cafd00]' : 'bg-[#222]'}`}>
                  <div className={`absolute w-5 h-5 rounded-full transition-all duration-300 ${editForm.isFree ? 'bg-[#516700] right-1' : 'bg-[#555] left-1'}`} />
                </div>
              </div>
            </div>

            <footer className="px-10 py-8 border-t border-white/5">
              <button
                onClick={handleSaveLesson}
                className="w-full bg-[#cafd00] text-[#516700] py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all font-headline shadow-[0_0_30px_rgba(202,253,0,0.2)] hover:shadow-[0_0_50px_rgba(202,253,0,0.4)]"
              >
                {t("saveChanges")}
              </button>
            </footer>
          </aside>
        </div>
      )}

      {/* Fixed Footer Nav */}
      <div className="fixed bottom-0 left-64 right-0 h-20 bg-black/90 backdrop-blur-xl border-t border-white/5 px-12 flex items-center justify-between z-30">
        <button onClick={() => router.push('/create-course')} className="flex items-center gap-3 text-[#555] hover:text-white font-black text-xs uppercase tracking-widest transition-all group font-headline">
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2 text-[#cafd00]">arrow_back</span>
          {t("backStep")}
        </button>
        <button onClick={() => router.push('/create-course/pricing')} className="bg-[#cafd00] text-[#516700] px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:shadow-[0_0_30px_rgba(202,253,0,0.4)] hover:brightness-105 active:scale-[0.98] transition-all font-headline">
          {t("nextStep")}
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
