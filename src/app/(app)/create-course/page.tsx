"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/lang-context";
import { cn } from "@/lib/utils";

export default function Step1Basics() {
  const { title, subtitle, categoryId, description, setBasicInfo } = useCourseStore();
  const { t } = useLang();
  const router = useRouter();

  // Custom Category State
  const [isOpen, setIsOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "creative", label: t("catCreative") },
    { id: "engineering", label: t("catEngineering") },
    { id: "business", label: t("catBusiness") },
    { id: "development", label: t("catDevelopment") },
    { id: "others", label: t("others") || "Boshqa..." },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // If "others" is selected and custom category exists, use it
    const finalCategory = categoryId === "others" ? customCategory : categoryId;
    if (categoryId === "others" && !customCategory.trim()) {
        alert("Iltimos, kategoriyani kiriting!");
        return;
    }
    // Note: We don't need to change the store's categoryId yet if we're just storing the "others" state.
    // However, to make sure it's saved, we'll update the store if it's "others".
    if(categoryId === "others") {
        setBasicInfo({ title, subtitle, categoryId: customCategory, description });
    }
    router.push('/create-course/curriculum');
  };

  const selectedCat = categories.find(c => c.id === categoryId) || 
                   (categoryId && !categories.find(c => c.id === categoryId) ? { id: "others", label: t("others") || "Boshqa..." } : null);

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20 w-full animate-in fade-in slide-in-from-bottom-2 duration-700 font-body">
      <header className="mb-14">
        <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#cafd00] mb-4 block">
          {t("step")} 01 {t("dan")} 04
        </span>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none text-white mb-6 font-headline uppercase italic">
          {t("foundation")}
        </h2>
        <p className="text-lg text-[#888] max-w-xl leading-relaxed font-light">
          {t("foundationDesc")}
        </p>
      </header>

      <form onSubmit={handleNext} className="space-y-12">
        <div className="bg-[#111] border border-white/5 rounded-[32px] p-8 md:p-14 shadow-2xl relative overflow-visible">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#cafd00]/5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-20 mb-12">
            <div className="space-y-4 group">
                <label className="text-sm uppercase tracking-widest text-[#fedc00] font-black group-focus-within:text-[#cafd00] transition-colors font-headline" htmlFor="course-title">
                {t("courseTitleLabel")}
                </label>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 transition-all focus-within:border-[#cafd00]/50 shadow-inner">
                <input 
                    id="course-title" 
                    placeholder={t("placeholderTitle")}
                    className="w-full bg-transparent border-none px-4 py-3 text-lg text-white placeholder-[#444] focus:ring-0 transition-all font-body focus:outline-none"
                    value={title}
                    onChange={(e) => setBasicInfo({ title: e.target.value, subtitle, categoryId, description })}
                    required
                />
                </div>
            </div>

            <div className="space-y-4 group">
                <label className="text-sm uppercase tracking-widest text-[#fedc00] font-black group-focus-within:text-[#cafd00] transition-colors font-headline" htmlFor="course-category">
                {t("categoryLabel")}
                </label>
                
                <div className="relative w-full" ref={dropdownRef}>
                    <div 
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-[#141414] shadow-inner h-[62px]",
                            isOpen && "border-[#cafd00]/50 shadow-[0_0_20px_rgba(202,253,0,0.1)]"
                        )}
                    >
                        <span className={cn("text-base font-medium truncate", selectedCat ? "text-white" : "text-[#444]")}>
                            {selectedCat ? selectedCat.label : t("placeholderCategory")}
                        </span>
                        <span className={cn("material-symbols-outlined text-[#555] transition-transform duration-300", isOpen && "rotate-180 text-[#cafd00]")}>
                            expand_more
                        </span>
                    </div>

                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-[100] animate-in fade-in zoom-in-95 duration-200">
                            <div className="py-2">
                                {categories.map((cat) => (
                                    <div 
                                        key={cat.id}
                                        onClick={() => {
                                            setBasicInfo({ title, subtitle, categoryId: cat.id, description });
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "px-6 py-4 flex items-center justify-between cursor-pointer transition-all hover:bg-[#cafd00]/10",
                                            categoryId === cat.id ? "bg-[#cafd00]/5 text-[#cafd00]" : "text-[#888] hover:text-white"
                                        )}
                                    >
                                        <span className="text-sm font-bold font-headline uppercase tracking-widest">{cat.label}</span>
                                        {categoryId === cat.id && <span className="material-symbols-outlined text-sm">check_circle</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </div>

          {categoryId === "others" && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-2 duration-400 w-full relative z-10">
                    <label className="text-[10px] uppercase tracking-widest text-[#fedc00] font-black font-headline block ml-1 mb-2">Custom Category</label>
                    <div className="bg-[#0a0a0a] border border-[#fedc00]/30 rounded-2xl p-2 transition-all focus-within:border-[#fedc00] shadow-[0_0_20px_rgba(254,220,0,0.05)]">
                        <input 
                            placeholder="Kategoriya nomini kiriting..."
                            className="w-full bg-transparent border-none px-4 py-3 text-lg text-white placeholder-[#444] focus:ring-0 font-body focus:outline-none"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            required
                        />
                    </div>
                </div>
            )}

          <div className="space-y-4 group relative z-10">
            <label className="text-sm uppercase tracking-widest text-[#fedc00] font-black group-focus-within:text-[#cafd00] transition-colors font-headline" htmlFor="description">
              {t("shortDescLabel")}
            </label>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 transition-all focus-within:border-[#cafd00]/50 shadow-inner">
              <textarea 
                id="description" 
                placeholder={t("placeholderDesc")}
                className="w-full bg-transparent border-none px-4 py-3 text-lg text-[#ccc] placeholder-[#444] focus:ring-0 transition-all resize-none font-body focus:outline-none" 
                rows={4}
                value={description}
                onChange={(e) => setBasicInfo({ title, subtitle, categoryId, description: e.target.value })}
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-[32px] p-8 md:p-14 shadow-2xl relative overflow-hidden group/cover">

          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-[#cafd00]/5 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-700"></div>
          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-end mb-4">
              <label className="text-sm uppercase tracking-widest text-[#fedc00] font-black font-headline">
                {t("courseCoverLabel")}
              </label>
              <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider italic">
                {t("recommendedSize")}
              </span>
            </div>
            <div className="relative group">
              <div className="relative border-2 border-dashed border-[#222] rounded-[24px] p-12 flex flex-col items-center justify-center bg-[#0a0a0a] group-hover:bg-[#cafd00]/5 group-hover:border-[#cafd00]/50 transition-all cursor-pointer overflow-hidden shadow-inner">
                <div className="w-20 h-20 rounded-full bg-[#cafd00]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-[#cafd00]/20 shadow-[0_0_30px_rgba(202,253,0,0.1)]">
                  <span className="material-symbols-outlined text-[#cafd00] text-4xl">add_photo_alternate</span>
                </div>
                <div className="text-center relative z-10">
                  <h4 className="text-white font-bold text-lg mb-2">
                    {t("dragDrop")} <span className="text-[#cafd00] underline underline-offset-4 decoration-2 decoration-[#cafd00]/50">{t("browseFiles")}</span>
                  </h4>
                  <p className="text-sm text-[#555] tracking-tight">
                    {t("uploadSupport")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-8 rounded-[24px] bg-[#111] border border-white/5 space-y-4 hover:border-[#cafd00]/30 transition-all group/stat shadow-lg">
            <span className="material-symbols-outlined text-[#cafd00] text-3xl opacity-60 group-hover/stat:opacity-100 transition-opacity">schedule</span>
            <div>
              <h5 className="text-xs font-black text-[#fedc00] uppercase tracking-widest mb-1 font-headline">{t("estimatedLength")}</h5>
              <p className="text-[10px] text-[#888] font-medium uppercase tracking-wider">{t("totalPlanning")}</p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-1 px-3 focus-within:border-[#cafd00]/50 overflow-hidden shadow-inner">
               <input className="w-full bg-transparent border-none text-white py-2 focus:ring-0 text-sm placeholder-[#444] font-bold focus:outline-none" placeholder={t("placeholderLength")} type="text"/>
            </div>
          </div>
          <div className="p-8 rounded-[24px] bg-[#111] border border-white/5 space-y-4 hover:border-[#cafd00]/30 transition-all group/stat shadow-lg">
            <span className="material-symbols-outlined text-[#cafd00] text-3xl opacity-60 group-hover/stat:opacity-100 transition-opacity">translate</span>
            <div>
              <h5 className="text-xs font-black text-[#fedc00] uppercase tracking-widest mb-1 font-headline">{t("courseLang")}</h5>
              <p className="text-[10px] text-[#888] font-medium uppercase tracking-wider">{t("primaryMedium")}</p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-1 px-3 focus-within:border-[#cafd00]/50 overflow-hidden shadow-inner">
               <input className="w-full bg-transparent border-none text-white py-2 focus:ring-0 text-sm placeholder-[#444] font-bold focus:outline-none" placeholder={t("placeholderLang")} type="text"/>
            </div>
          </div>
          <div className="p-8 rounded-[24px] bg-[#111] border border-white/5 space-y-4 hover:border-[#cafd00]/30 transition-all group/stat shadow-lg">
            <span className="material-symbols-outlined text-[#cafd00] text-3xl opacity-60 group-hover/stat:opacity-100 transition-opacity">verified</span>
            <div>
              <h5 className="text-xs font-black text-[#fedc00] uppercase tracking-widest mb-1 font-headline">{t("expertiseLevel")}</h5>
              <p className="text-[10px] text-[#888] font-medium uppercase tracking-wider">{t("targetAudience")}</p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-1 px-3 focus-within:border-[#cafd00]/50 overflow-hidden shadow-inner">
               <input className="w-full bg-transparent border-none text-white py-2 focus:ring-0 text-sm placeholder-[#444] font-bold focus:outline-none" placeholder={t("placeholderLevel")} type="text"/>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between pt-10 border-t border-white/5 mt-10">
          <button type="button" onClick={() => router.push('/dashboard')} className="flex items-center gap-3 text-[#888] hover:text-[#fedc00] transition-colors group">
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-2 transition-transform">close</span>
            <span className="text-xs font-black uppercase tracking-[0.2em] font-headline">{t("discardDraft")}</span>
          </button>
          <button type="submit" className="bg-[#cafd00] text-[#516700] px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(202,253,0,0.2)] hover:shadow-[0_20px_40px_rgba(202,253,0,0.4)] hover:-translate-y-1 active:translate-y-0 active:opacity-90 transition-all flex items-center gap-4 font-headline">
            {t("nextStep")}
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
        </footer>
      </form>
    </div>
  );
}
