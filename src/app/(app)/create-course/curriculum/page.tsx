"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Step2Curriculum() {
  const { modules, addModule, addLesson } = useCourseStore();
  const router = useRouter();

  const [newModuleName, setNewModuleName] = useState("");
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  
  // Temporary state for the right sidebar form
  const [editForm, setEditForm] = useState({ title: "", videoUrl: "", description: "", isFree: false, moduleId: "" });

  const handleAddModule = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newModuleName) {
      addModule({ id: Date.now().toString(), title: newModuleName, lessons: [] });
      setNewModuleName("");
    }
  };

  const startAddingLesson = (moduleId: string) => {
    setEditingLessonId("new");
    setEditForm({ title: "New Lesson", videoUrl: "", description: "", isFree: false, moduleId });
  };

  const handleSaveLesson = () => {
    if (editingLessonId === "new" && editForm.moduleId) {
      addLesson(editForm.moduleId, { 
        id: Date.now().toString(), 
        title: editForm.title || "Untitled Lesson", 
        videoUrl: editForm.videoUrl, 
        content: editForm.description, 
        isFree: editForm.isFree 
      });
    }
    setEditingLessonId(null);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden font-body animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Left side: Curriculum List */}
      <div className="flex-1 px-16 pt-12 overflow-y-auto no-scrollbar pb-40">
        <header className="flex items-end justify-between mb-20">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#cafd00] mb-4 block">Step 02 / 04</span>
            <h1 className="text-7xl font-headline font-bold tracking-tighter mb-6 text-white italic">Curriculum</h1>
            <p className="text-[#ababab] max-w-md text-lg leading-relaxed font-light">Design your course journey. <span className="text-[#fedc00]/80">Modules</span> act as chapters, while <span className="text-[#cafd00]/80">lessons</span> are core learning moments.</p>
          </div>
          <button className="bg-[#cafd00] text-[#516700] px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-[0_0_30px_rgba(202,253,0,0.3)] hover:scale-105 transition-all duration-300">
            <span className="material-symbols-outlined font-bold">add</span>
            Add Module
          </button>
        </header>

        <div className="space-y-16 max-w-4xl mx-auto">
          <input 
            placeholder="+ Add new module (Press Enter to save)" 
            className="w-full bg-transparent border-0 border-b border-[#333] rounded-none px-0 text-white placeholder-[#444] text-lg focus:ring-0 focus:border-[#cafd00] transition-colors h-14 font-headline focus:outline-none"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            onKeyDown={handleAddModule}
          />

          <div className="space-y-16 mt-12">
            {modules.map((module, mIdx) => (
              <section key={module.id} className="group">
                <div className="flex items-center justify-between mb-8 group-hover:translate-x-2 transition-transform duration-500">
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-black text-[#cafd00]/30 tracking-[0.4em]">0{mIdx + 1}</span>
                    <h3 className="text-2xl font-headline font-bold text-white tracking-tight">{module.title}</h3>
                  </div>
                  <button onClick={() => startAddingLesson(module.id)} className="text-[10px] font-black uppercase tracking-[0.2em] text-[#919191] hover:text-[#cafd00] transition-colors flex items-center gap-2 group/btn">
                    <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">add_circle</span>
                    Add Lesson
                  </button>
                </div>
                
                <div className="space-y-4">
                  {module.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} onClick={() => { setEditingLessonId("edit"); setEditForm({ title: lesson.title, videoUrl: lesson.videoUrl || "", description: lesson.content || "", isFree: lesson.isFree || false, moduleId: module.id }); }} className="bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] flex items-center justify-between p-6 rounded-2xl hover:border-[#cafd00]/20 hover:bg-white/5 transition-all duration-500 cursor-pointer group/lesson relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-1 bg-[#cafd00] shadow-[2px_0_10px_#cafd00] opacity-0 group-hover/lesson:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-6">
                        <span className="material-symbols-outlined text-[#333] group-hover/lesson:text-[#cafd00] transition-colors duration-500">drag_indicator</span>
                        <span className="text-base font-bold text-white tracking-tight">{mIdx + 1}.{lIdx + 1} {" "}{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-4 opacity-0 group-hover/lesson:opacity-100 transition-all duration-300 translate-x-4 group-hover/lesson:translate-x-0">
                        {lesson.isFree && <span className="text-[9px] font-black uppercase tracking-widest text-[#516700] px-3 py-1 bg-[#cafd00] rounded-full shadow-[0_0_10px_rgba(202,253,0,0.2)]">FREE</span>}
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#516700] px-3 py-1 bg-[#cafd00] rounded-full shadow-[0_0_10px_rgba(202,253,0,0.2)]">VIDEO</span>
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors border border-white/5">
                          <span className="material-symbols-outlined text-[#919191]">edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {module.lessons.length === 0 && (
                    <div onClick={() => startAddingLesson(module.id)} className="bg-transparent border border-dashed border-[#333] flex items-center p-6 rounded-2xl hover:border-[#cafd00]/50 hover:bg-white/5 transition-all duration-500 cursor-pointer group/add">
                      <span className="material-symbols-outlined text-[#444] group-hover/add:text-[#cafd00] mr-4 transition-colors">add</span>
                      <span className="text-sm font-bold text-[#666] group-hover/add:text-white transition-colors tracking-tight mt-0.5">Add first lesson</span>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className="fixed bottom-0 right-0 left-64 h-24 bg-black/90 backdrop-blur-xl border-t border-[#cafd00]/5 px-12 flex items-center justify-between z-30">
          <button onClick={() => router.push('/create-course')} className="flex items-center gap-3 text-[#919191] hover:text-white font-bold text-xs uppercase tracking-widest transition-all group">
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2 text-[#cafd00]">arrow_back</span>
            Back to Basics
          </button>
          <button onClick={() => router.push('/create-course/pricing')} className="bg-[#cafd00] text-[#516700] px-10 py-4 rounded-full text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:shadow-[0_0_40px_rgba(202,253,0,0.4)] hover:scale-[1.03] transition-all duration-300">
            Pricing & Launch
            <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </button>
        </footer>
      </div>

      {/* Slide-out Panel Logic using local state */}
      {editingLessonId && (
        <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto" onClick={() => setEditingLessonId(null)}></div>
          
          <aside className="h-full w-[500px] bg-black border-l border-[#cafd00]/10 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col pointer-events-auto z-10 relative animate-in slide-in-from-right">
            <header className="p-10 pb-6 flex items-start justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#cafd00] mb-3">Lesson settings</p>
                <h2 className="text-3xl font-headline font-bold text-white leading-tight">Edit Lesson:<br/>{editForm.title}</h2>
              </div>
              <button onClick={() => setEditingLessonId(null)} className="w-12 h-12 flex items-center justify-center text-[#919191] hover:text-white transition-colors bg-white/5 rounded-full border border-[rgba(202,253,0,0.1)]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto px-10 space-y-10 no-scrollbar pb-32">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#919191] ml-1">Title</label>
                <div className="relative">
                  <input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full bg-white/5 border border-[rgba(202,253,0,0.1)] focus:border-[#cafd00]/30 focus:outline-none rounded-2xl py-4 px-5 text-sm text-white placeholder-[#444] transition-all font-body" type="text"/>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#919191] ml-1">Video URL</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#cafd00]/40 text-xl">video_library</span>
                  <input value={editForm.videoUrl} onChange={(e) => setEditForm({...editForm, videoUrl: e.target.value})} className="w-full bg-white/5 border border-[rgba(202,253,0,0.1)] focus:border-[#cafd00]/30 focus:outline-none rounded-2xl py-4 pl-12 text-sm text-white placeholder-[#444] transition-all font-body" placeholder="e.g. https://youtube.com/..." type="text"/>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#919191] ml-1">Description</label>
                <div className="bg-white/5 rounded-2xl overflow-hidden border border-[rgba(202,253,0,0.1)] focus-within:border-[#cafd00]/20 transition-all">
                  <div className="px-5 py-3 border-b border-[rgba(202,253,0,0.1)] flex gap-5 text-[#666] bg-white/5">
                    <span className="material-symbols-outlined text-sm cursor-pointer hover:text-[#cafd00] transition-colors">format_bold</span>
                    <span className="material-symbols-outlined text-sm cursor-pointer hover:text-[#cafd00] transition-colors">format_italic</span>
                    <span className="material-symbols-outlined text-sm cursor-pointer hover:text-[#cafd00] transition-colors">link</span>
                  </div>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full bg-transparent border-none focus:outline-none text-sm text-[#e5e1e4] p-5 resize-none placeholder-[#444] font-body" placeholder="Write a brief overview..." rows={5}></textarea>
                </div>
              </div>

              <div onClick={() => setEditForm({...editForm, isFree: !editForm.isFree})} className="p-6 bg-white/5 rounded-2xl border border-[rgba(202,253,0,0.1)] flex items-center justify-between group hover:bg-white/10 transition-colors cursor-pointer">
                <div>
                  <p className="text-sm font-bold text-white tracking-tight">Free Preview</p>
                  <p className="text-[11px] text-[#666] mt-1">Public access without purchase.</p>
                </div>
                <button className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-all shadow-[0_0_15px_rgba(202,253,0,0.3)] ${editForm.isFree ? 'bg-[#cafd00]' : 'bg-[#333]'}`}>
                  <div className={`absolute w-4 h-4 rounded-full transition-all ${editForm.isFree ? 'bg-[#516700] right-1' : 'bg-[#666] left-1'}`}></div>
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-video relative group border-2 border-[#111]">
                <img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ11xQqoLghRJfV-Xdr3kt7oAAfdOewDW1X62YrX7PjXBwlvqYMOdsEOrEp4YnwXf854fGjmON5XBlcOYbInl9_WfudXwcTVV_B-iR6HD_PXJIewqsErULM8-vrQNkikoF-Bnj0-CCPxJL_edTL8-tXJawjPRs7UKM88GCjuHYrN8NgyVFTKI0OhTaS79y0LEffyIWZcjtSYGtp2ojwykK34hsE5omZZXIHcBnQB2eT-xP19SAfrFHNlhb_ajkWXwBWos9_vENhDo"/>
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/30 transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-[#cafd00] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(202,253,0,0.5)] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[#516700] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  </div>
                </div>
              </div>
            </div>

            <footer className="p-10 border-t border-[rgba(202,253,0,0.1)] bg-black/80 backdrop-blur-md">
              <button onClick={handleSaveLesson} className="w-full bg-[#cafd00] text-[#516700] py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:shadow-[0_0_40px_rgba(202,253,0,0.4)] hover:brightness-110 transition-all duration-300">
                Save Lesson Changes
              </button>
            </footer>
          </aside>
        </div>
      )}
    </div>
  );
}
