"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";

export default function Step1Basics() {
  const { title, subtitle, categoryId, description, setBasicInfo } = useCourseStore();
  const { t } = useLang();
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/create-course/curriculum');
  };

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-12 w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
      <header className="mb-16">
        <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#fedc00] mb-4 block">
          {t("step")} 01 {t("of")} 04
        </span>
        <h2 className="text-6xl font-bold tracking-tighter leading-none text-white mb-6 font-headline italic uppercase">
          {t("foundation")}
        </h2>
        <p className="text-lg text-[#888] max-w-xl leading-relaxed font-light">
          {t("foundationDesc")}
        </p>
      </header>

      <form onSubmit={handleNext} className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-3 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-black group-focus-within:text-[#cafd00] transition-colors" htmlFor="course-title">
              {t("courseTitleLabel")}
            </label>
            <input 
              id="course-title" 
              placeholder={t("placeholderTitle")}
              className="w-full bg-transparent border-none px-0 py-4 text-2xl font-light text-white placeholder-[#444] focus:ring-0 border-b border-[#333] focus:border-[#cafd00] transition-all font-headline focus:outline-none"
              value={title}
              onChange={(e) => setBasicInfo({ title: e.target.value, subtitle, categoryId, description })}
              required
            />
          </div>

          <div className="space-y-3 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-black group-focus-within:text-[#cafd00] transition-colors" htmlFor="course-category">
              {t("categoryLabel")}
            </label>
            <div className="relative">
              <select 
                id="course-category"
                className="w-full bg-transparent border-none px-0 py-4 text-2xl font-light text-white focus:ring-0 border-b border-[#333] focus:border-[#cafd00] transition-all appearance-none cursor-pointer font-headline focus:outline-none group-hover:border-[#555]"
                value={categoryId}
                onChange={(e) => setBasicInfo({ title, subtitle, categoryId: e.target.value, description })}
                required
              >
                <option disabled value="" className="bg-black text-[#555]">
                  {t("placeholderCategory")}
                </option>
                <option className="bg-[#111] py-4" value="creative">{t("catCreative")}</option>
                <option className="bg-[#111] py-4" value="engineering">{t("catEngineering")}</option>
                <option className="bg-[#111] py-4" value="business">{t("catBusiness")}</option>
                <option className="bg-[#111] py-4" value="development">{t("catDevelopment")}</option>
              </select>
              <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none group-focus-within:text-[#cafd00]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 group">
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-black group-focus-within:text-[#cafd00] transition-colors" htmlFor="description">
            {t("shortDescLabel")}
          </label>
          <textarea 
            id="description" 
            placeholder={t("placeholderDesc")}
            className="w-full bg-transparent border-none px-0 py-4 text-2xl font-light text-white placeholder-[#444] focus:ring-0 border-b border-[#333] focus:border-[#cafd00] transition-all resize-none font-headline focus:outline-none" 
            rows={3}
            value={description}
            onChange={(e) => setBasicInfo({ title, subtitle, categoryId, description: e.target.value })}
            required
          ></textarea>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-black">
              {t("courseCoverLabel")}
            </label>
            <span className="text-[10px] text-[#666] font-bold uppercase tracking-wider italic opacity-60">
              {t("recommendedSize")}
            </span>
          </div>
          <div className="relative group">
            <div className="absolute -inset-2 bg-[#cafd00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-2xl"></div>
            <div className="relative border-2 border-dashed border-[#222] rounded-[32px] p-16 flex flex-col items-center justify-center bg-[#0a0a0a] group-hover:bg-[#cafd00]/5 group-hover:border-[#cafd00]/30 transition-all cursor-pointer overflow-hidden shadow-2xl">
              <div className="w-24 h-24 rounded-[32px] bg-[#cafd00]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-[#cafd00]/20 shadow-[0_0_30px_rgba(202,253,0,0.1)]">
                <span className="material-symbols-outlined text-[#cafd00] text-5xl">add_photo_alternate</span>
              </div>
              <div className="text-center relative z-10">
                <h4 className="text-white font-bold text-xl mb-2">
                  {t("dragDrop")} <span className="text-[#cafd00] underline underline-offset-8 decoration-2 decoration-[#cafd00]/30">{t("browseFiles")}</span>
                </h4>
                <p className="text-sm text-[#555] font-medium tracking-tight">
                  {t("uploadSupport")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-8 rounded-[32px] bg-[#111] border border-white/5 space-y-4 hover:border-[#cafd00]/20 transition-all group/stat">
            <span className="material-symbols-outlined text-[#fedc00] text-4xl opacity-40 group-hover/stat:opacity-100 transition-opacity">schedule</span>
            <div>
              <h5 className="text-xs font-black text-white uppercase tracking-widest mb-1">{t("estimatedLength")}</h5>
              <p className="text-[11px] text-[#555] mb-4 font-medium">{t("totalPlanning")}</p>
            </div>
            <input className="w-full bg-transparent border-none border-b border-[#222] text-white py-2 focus:ring-0 focus:border-[#cafd00] text-base transition-all placeholder-[#333] font-bold focus:outline-none" placeholder={t("placeholderLength")} type="text"/>
          </div>
          <div className="p-8 rounded-[32px] bg-[#111] border border-white/5 space-y-4 hover:border-[#cafd00]/20 transition-all group/stat">
            <span className="material-symbols-outlined text-[#fedc00] text-4xl opacity-40 group-hover/stat:opacity-100 transition-opacity">translate</span>
            <div>
              <h5 className="text-xs font-black text-white uppercase tracking-widest mb-1">{t("courseLang")}</h5>
              <p className="text-[11px] text-[#555] mb-4 font-medium">{t("primaryMedium")}</p>
            </div>
            <input className="w-full bg-transparent border-none border-b border-[#222] text-white py-2 focus:ring-0 focus:border-[#cafd00] text-base transition-all placeholder-[#333] font-bold focus:outline-none" placeholder={t("placeholderLang")} type="text"/>
          </div>
          <div className="p-8 rounded-[32px] bg-[#111] border border-white/5 space-y-4 hover:border-[#cafd00]/20 transition-all group/stat">
            <span className="material-symbols-outlined text-[#fedc00] text-4xl opacity-40 group-hover/stat:opacity-100 transition-opacity">verified</span>
            <div>
              <h5 className="text-xs font-black text-white uppercase tracking-widest mb-1">{t("expertiseLevel")}</h5>
              <p className="text-[11px] text-[#555] mb-4 font-medium">{t("targetAudience")}</p>
            </div>
            <input className="w-full bg-transparent border-none border-b border-[#222] text-white py-2 focus:ring-0 focus:border-[#cafd00] text-base transition-all placeholder-[#333] font-bold focus:outline-none" placeholder={t("placeholderLevel")} type="text"/>
          </div>
        </div>

        <footer className="flex items-center justify-between pt-12 border-t border-[#111]">
          <button type="button" className="flex items-center gap-3 text-[#666] hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-2 transition-transform">close</span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">{t("discardDraft")}</span>
          </button>
          <button type="submit" className="bg-[#cafd00] text-[#516700] px-14 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_-5px_rgba(202,253,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(202,253,0,0.5)] hover:-translate-y-1 active:translate-y-0 active:opacity-90 transition-all flex items-center gap-5">
            {t("nextStep")}
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
        </footer>
      </form>
    </div>
  );
}
