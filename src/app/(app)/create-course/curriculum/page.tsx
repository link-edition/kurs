"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/lib/lang-context";
import { cn } from "@/lib/utils";

export default function Step2Curriculum() {
  const { modules, addModule, addLesson } = useCourseStore();
  const { t } = useLang();
  const router = useRouter();

  const [newModuleName, setNewModuleName] = useState("");
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    id: string;
    title: string;
    videoUrl: string;
    description: string;
    isFree: boolean;
    moduleId: string;
    attachments: any[];
  }>({ id: "", title: "", videoUrl: "", description: "", isFree: false, moduleId: "", attachments: [] });

  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const videoInputRef = useState<any>(null); // or useRef
  const fileInputRef = useState<any>(null); // or useRef

  const handleAddModule = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newModuleName.trim()) {
      addModule({ id: Date.now().toString(), title: newModuleName.trim(), lessons: [] });
      setNewModuleName("");
    }
  };

  const startAddingLesson = (moduleId: string) => {
    setEditingLessonId("new");
    setEditForm({ id: Date.now().toString(), title: "", videoUrl: "", description: "", isFree: false, moduleId, attachments: [] });
  };

  const { updateLesson } = useCourseStore();

  const handleSaveLesson = () => {
    if (editForm.title.trim() && editForm.moduleId) {
      if (editingLessonId === "new") {
        addLesson(editForm.moduleId, {
          id: editForm.id,
          title: editForm.title.trim(),
          videoUrl: editForm.videoUrl,
          content: editForm.description,
          isFree: editForm.isFree,
          attachments: editForm.attachments
        });
      } else {
        updateLesson(editForm.moduleId, editForm.id, {
          title: editForm.title.trim(),
          videoUrl: editForm.videoUrl,
          content: editForm.description,
          isFree: editForm.isFree,
          attachments: editForm.attachments
        });
      }
    }
    setEditingLessonId(null);
  };

  const handleUpload = async (file: File, type: 'video' | 'attachment') => {
    const isVideo = type === 'video';
    if (isVideo) setUploadingVideo(true); else setUploadingFile(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        if (isVideo) {
          setEditForm(prev => ({ ...prev, videoUrl: data.url }));
        } else {
          setEditForm(prev => ({ ...prev, attachments: [...prev.attachments, { name: file.name, url: data.url, type: file.type.includes('pdf') ? 'pdf' : 'file' }] }));
        }
      }
    } catch (err) { console.error(err); }
    
    if (isVideo) setUploadingVideo(false); else setUploadingFile(false);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] overflow-hidden font-body animate-in fade-in slide-in-from-bottom-2 duration-700 bg-background transition-colors duration-300">

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32 px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10">
        <header className="mb-8 sm:mb-12">
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#cafd00] mb-2 sm:mb-4 block">
            {t("step")} 02 {t("of")} 04
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-2 sm:mb-4 font-headline uppercase italic">
            {t("curriculum")}
          </h1>
          <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-relaxed font-light">
            {t("designJourney")}. {t("modulesDesc")}
          </p>
        </header>

        {/* Add Module Input */}
        <div className="bg-card border border-border rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm dark:shadow-xl">
          <label className="text-xs sm:text-sm uppercase tracking-widest text-[#a58d00] dark:text-[#fedc00] font-black font-headline mb-3 sm:mb-4 block">
            {t("addModule")}
          </label>
          <div className="bg-muted border border-border rounded-xl sm:rounded-2xl p-1.5 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 focus-within:border-[#cafd00]/50 transition-all">
            <div className="flex items-center flex-1">
              <span className="material-symbols-outlined text-[#cafd00] text-xl sm:text-2xl ml-2 sm:ml-3 shrink-0">folder_open</span>
              <input
                placeholder={t("moduleName")}
                className="flex-1 bg-transparent border-none px-2 sm:px-3 py-2 sm:py-3 text-base sm:text-lg text-foreground placeholder-muted-foreground focus:ring-0 font-body focus:outline-none"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                onKeyDown={handleAddModule}
              />
            </div>
            <button
              onClick={() => {
                if (newModuleName.trim()) {
                  addModule({ id: Date.now().toString(), title: newModuleName.trim(), lessons: [] });
                  setNewModuleName("");
                }
              }}
              className="bg-[#cafd00] text-[#516700] px-4 sm:px-6 py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest font-headline hover:brightness-110 transition-all font-black"
            >
              {t("add")}
            </button>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4 sm:space-y-6 max-w-4xl">
          {modules.map((module, mIdx) => (
            <div key={module.id} className="bg-card border border-border rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-sm dark:shadow-xl">
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-border gap-3">
                <div className="flex items-center gap-3 sm:gap-5">
                  <span className="text-xs sm:text-sm font-black text-[#cafd00] tracking-[0.2em] sm:tracking-[0.3em] font-headline">0{mIdx + 1}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground font-headline truncate italic uppercase">{module.title}</h3>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-bold bg-muted px-2 sm:px-3 py-1 rounded-full shrink-0 border border-border">
                    {module.lessons.length} {t("lessons")}
                  </span>
                </div>
                <button
                  onClick={() => startAddingLesson(module.id)}
                  className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-[#cafd00] transition-colors font-headline group self-end sm:self-auto"
                >
                  <span className="material-symbols-outlined text-base sm:text-lg group-hover:scale-110 transition-transform">add_circle</span>
                  {t("addLesson")}
                </button>
              </div>

              {/* Lessons */}
              <div className="p-3 sm:p-4 space-y-2">
                {module.lessons.map((lesson, lIdx) => (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      setEditingLessonId("edit");
                      setEditForm({ 
                        id: lesson.id,
                        title: lesson.title, 
                        videoUrl: lesson.videoUrl || "", 
                        description: lesson.content || "", 
                        isFree: lesson.isFree || false, 
                        moduleId: module.id,
                        attachments: lesson.attachments || []
                      });
                    }}
                    className="flex items-center justify-between bg-muted/30 border border-border rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 cursor-pointer hover:border-[#cafd00]/30 hover:bg-[#cafd00]/5 transition-all group/lesson"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 truncate">
                      <span className="text-[10px] sm:text-xs font-black text-muted-foreground/30 group-hover/lesson:text-[#cafd00] transition-colors shrink-0">{mIdx + 1}.{lIdx + 1}</span>
                      <span className="material-symbols-outlined text-muted-foreground/20 group-hover/lesson:text-muted-foreground text-base sm:text-lg shrink-0 hidden sm:inline">drag_indicator</span>
                      <span className="text-sm sm:text-base text-foreground font-bold truncate group-hover/lesson:text-[#cafd00] transition-colors uppercase italic">{lesson.title}</span>
                      {lesson.isFree && (
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#516700] px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#cafd00] rounded-full shrink-0 shadow-sm">
                          {t("free")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 opacity-100 sm:opacity-0 group-hover/lesson:opacity-100 transition-all shrink-0">
                      <span className="material-symbols-outlined text-muted-foreground text-base sm:text-lg hover:text-[#cafd00] transition-colors">edit</span>
                    </div>
                  </div>
                ))}

                {module.lessons.length === 0 && (
                  <div
                    onClick={() => startAddingLesson(module.id)}
                    className="border border-dashed border-border rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3 sm:gap-4 cursor-pointer hover:border-[#cafd00]/40 hover:bg-[#cafd00]/5 transition-all group/empty"
                  >
                    <span className="material-symbols-outlined text-muted-foreground/30 group-hover/empty:text-[#cafd00] transition-colors">add</span>
                    <span className="text-xs sm:text-sm text-muted-foreground group-hover/empty:text-foreground transition-colors">{t("addFirstLesson")}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {modules.length === 0 && (
            <div className="text-center py-12 sm:py-20 border border-dashed border-border rounded-[20px] sm:rounded-[24px] text-muted-foreground/40">
              <span className="material-symbols-outlined text-4xl sm:text-5xl mb-3 sm:mb-4 block opacity-30">folder_off</span>
              <p className="text-base sm:text-lg font-light italic">{t("noModules")}</p>
              <p className="text-xs sm:text-sm mt-2 opacity-60 font-black uppercase tracking-[0.2em]">{t("startBuilding")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Lesson Editor */}
      {editingLessonId && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-500" onClick={() => setEditingLessonId(null)} />
          <aside className="relative h-full w-full sm:max-w-[480px] bg-card border-l border-border flex flex-col z-10 animate-in slide-in-from-right duration-500 shadow-2xl">
            
            <header className="px-6 sm:px-10 py-6 sm:py-8 border-b border-border flex items-start justify-between">
              <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#a58d00] dark:text-[#cafd00] mb-1 sm:mb-2 font-headline">{t("lessonSettings")}</p>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-headline uppercase italic">{editingLessonId === "new" ? t("addLesson") : t("editCourse")}</h2>
              </div>
              <button onClick={() => setEditingLessonId(null)} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors bg-muted rounded-full border border-border">
                <span className="material-symbols-outlined text-lg sm:text-xl">close</span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">
              {/* Title Input */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#a58d00] dark:text-[#fedc00] font-black font-headline ml-1">{t("name")}</label>
                <div className="bg-muted border border-border rounded-xl sm:rounded-2xl p-1.5 sm:p-2 focus-within:border-[#cafd00]/50 transition-all shadow-sm">
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder={t("lessonName")}
                    className="w-full bg-transparent border-none px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg text-foreground placeholder-muted-foreground focus:ring-0 font-body focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Video Section */}
              <div className="space-y-4">
                <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#a58d00] dark:text-[#fedc00] font-black font-headline ml-1">Video havolasi yoki Fayl</label>
                <div className="space-y-4">
                  {/* YouTube URL */}
                  <div className="bg-muted border border-border rounded-xl sm:rounded-2xl p-1.5 sm:p-2 focus-within:border-[#cafd00]/50 transition-all flex items-center gap-2 sm:gap-3 shadow-sm">
                    <span className="material-symbols-outlined text-[#cafd00] text-xl ml-2 sm:ml-3">link</span>
                    <input
                      value={editForm.videoUrl}
                      onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                      placeholder="YouTube URL..."
                      className="flex-1 bg-transparent border-none py-2 sm:py-3 text-sm sm:text-base text-foreground placeholder-muted-foreground focus:ring-0 font-body focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 px-2">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-widest italic">yoki</span>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>

                  {/* Direct Video Upload */}
                  <div 
                    onClick={() => (document.getElementById('video-upload') as HTMLInputElement)?.click()}
                    className="group border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center bg-muted/40 hover:bg-[#cafd00]/5 hover:border-[#cafd00]/40 transition-all cursor-pointer relative overflow-hidden shadow-sm"
                  >
                    <input 
                      id="video-upload" type="file" className="hidden" accept="video/*"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'video')}
                    />
                    {uploadingVideo ? (
                      <div className="w-8 h-8 border-2 border-[#cafd00] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-muted-foreground/30 text-4xl mb-2 group-hover:text-[#cafd00] transition-colors leading-none">cloud_upload</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Video yuklash</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-4">
                <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#a58d00] dark:text-[#fedc00] font-black font-headline ml-1">Materiallar (PDF, Fayllar)</label>
                <div className="space-y-4">
                  <div 
                    onClick={() => (document.getElementById('file-upload-drawer') as HTMLInputElement)?.click()}
                    className="group border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center bg-muted/40 hover:bg-[#cafd00]/5 hover:border-[#cafd00]/40 transition-all cursor-pointer relative overflow-hidden shadow-sm"
                  >
                    <input 
                      id="file-upload-drawer" type="file" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'attachment')}
                    />
                    {uploadingFile ? (
                      <div className="w-8 h-8 border-2 border-[#cafd00] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#cafd00] text-2xl">add_circle</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-[#cafd00] transition-colors">Fayl qo'shish</span>
                      </div>
                    )}
                  </div>

                  {/* List of Attachments */}
                  <div className="grid grid-cols-1 gap-2">
                    {editForm.attachments.map((att, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted border border-border rounded-2xl group/att animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="flex items-center gap-4 truncate">
                          <span className="material-symbols-outlined text-[#cafd00] text-xl">description</span>
                          <span className="text-sm font-bold text-foreground truncate">{att.name}</span>
                        </div>
                        <button 
                          onClick={() => setEditForm(prev => ({ ...prev, attachments: prev.attachments.filter((_, idx) => idx !== i) }))}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#a58d00] dark:text-[#fedc00] font-black font-headline ml-1">{t("shortDescLabel")}</label>
                <div className="bg-muted border border-border rounded-xl sm:rounded-2xl overflow-hidden focus-within:border-[#cafd00]/50 transition-all shadow-sm">
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder={t("placeholderDesc")}
                    rows={4}
                    className="w-full bg-transparent border-none px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-foreground placeholder-muted-foreground focus:ring-0 font-body focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Free Preview Toggle */}
              <div
                onClick={() => setEditForm({ ...editForm, isFree: !editForm.isFree })}
                className="bg-muted border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-muted/80 transition-all shadow-sm"
              >
                <div>
                  <p className="text-sm sm:text-base font-black text-foreground mb-0.5 sm:mb-1">{t("freePreview")}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-black tracking-widest opacity-40">{t("publicAccess")}</p>
                </div>
                <div className={`w-10 h-6 sm:w-12 sm:h-7 rounded-full relative transition-all flex items-center ${editForm.isFree ? 'bg-[#cafd00]' : 'bg-muted-foreground/30'}`}>
                  <div className={`absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-300 shadow-lg ${editForm.isFree ? 'bg-[#516700] right-1' : 'bg-background left-1'}`} />
                </div>
              </div>
            </div>

            <footer className="px-6 sm:px-10 py-6 sm:py-8 border-t border-border mt-auto">
              <button
                onClick={handleSaveLesson}
                className="w-full bg-[#cafd00] text-[#516700] py-4 sm:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all font-headline shadow-[0_15px_30px_rgba(202,253,0,0.2)]"
              >
                {t("saveChanges")}
              </button>
            </footer>
          </aside>
        </div>
      )}

      {/* Fixed Footer Nav */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 h-16 sm:h-20 bg-background/80 backdrop-blur-xl border-t border-border px-4 sm:px-8 lg:px-12 flex items-center justify-between z-30">
        <button onClick={() => router.push('/create-course')} className="flex items-center gap-2 sm:gap-3 text-muted-foreground hover:text-foreground font-black text-xs uppercase tracking-widest transition-all group font-headline">
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2 text-[#cafd00] text-lg sm:text-xl">arrow_back</span>
          <span className="hidden sm:inline">{t("backStep")}</span>
          <span className="sm:hidden">Orqaga</span>
        </button>
        <button onClick={() => router.push('/create-course/pricing')} className="bg-[#cafd00] text-[#516700] px-6 sm:px-10 py-2.5 sm:py-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center gap-2 sm:gap-3 shadow-[0_10px_30px_rgba(202,253,0,0.2)] hover:brightness-105 active:scale-[0.98] transition-all font-headline">
          {t("nextStep")}
          <span className="material-symbols-outlined text-lg sm:text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
