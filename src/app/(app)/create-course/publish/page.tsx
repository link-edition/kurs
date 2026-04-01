"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { publishCourseAction } from "@/app/actions/publish-course";
import { useLang } from "@/lib/lang-context";

export default function Step4Publish() {
  const { title, subtitle, categoryId, description, imageUrl, price, isFree, modules, reset } = useCourseStore();
  const { t } = useLang();
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    const result = await publishCourseAction({
      title, subtitle, categoryId, description, imageUrl, price, isFree, modules
    });

    if (result?.success) {
      reset();
      router.push('/dashboard');
    } else {
      alert(t("error") + ": " + result?.error);
      setIsPublishing(false);
    }
  };

  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  return (
    <div className="flex-1 p-6 md:p-12 lg:p-20 relative animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-screen w-full font-body">
      <div className="max-w-6xl mx-auto">
        <header className="mb-24">
          <div className="flex items-center space-x-6 mb-6">
            <span className="px-5 py-1.5 bg-[#cafd00] text-[#516700] rounded-full text-[11px] uppercase tracking-[0.3em] font-black font-headline shadow-[0_0_20px_rgba(202,253,0,0.3)]">{t("step")} 04</span>
            <div className="h-px flex-1 bg-white/10 opacity-20"></div>
            <span className="text-[#fedc00] text-sm font-bold uppercase tracking-widest font-headline">{t("publish")}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.05em] text-white leading-none mb-8 font-headline uppercase italic">
            Review.<br/><span className="text-[#888]">{t("andLaunch")}</span>
          </h1>
          <p className="text-xl text-[#888] max-w-2xl leading-relaxed font-light">
            {t("foundationDesc")}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          <div className="md:col-span-8 bg-[#111] border border-white/5 rounded-[40px] p-10 md:p-14 group transition-all duration-700 hover:border-[#cafd00]/20 shadow-3xl">
            <label className="block text-sm uppercase tracking-widest font-black text-[#fedc00] mb-12 font-headline">{t("foundation")}</label>
            <div className="space-y-8">
              <div className="text-5xl font-bold tracking-tight text-white font-headline leading-tight">{title || "Untitled Course"}</div>
              <div className="flex flex-wrap items-center gap-6">
                <span className="flex items-center space-x-3 text-[13px] text-white font-bold border border-white/10 bg-white/5 px-6 py-3 rounded-2xl shadow-inner">
                  <span className="material-symbols-outlined text-[#cafd00] text-2xl">category</span>
                  <span className="capitalize">{categoryId || "Uncategorized"}</span>
                </span>
                <span className="flex items-center space-x-3 text-[13px] text-white font-bold border border-white/10 bg-white/5 px-6 py-3 rounded-2xl shadow-inner">
                  <span className="material-symbols-outlined text-[#cafd00] text-2xl">language</span>
                  <span>{t("uzbek")} (Global)</span>
                </span>
                <span className="flex items-center space-x-3 text-[13px] text-white font-bold border border-white/10 bg-white/5 px-6 py-3 rounded-2xl shadow-inner">
                  <span className="material-symbols-outlined text-[#cafd00] text-2xl">visibility</span>
                  <span>{t("publicMode")}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#111] border border-white/5 rounded-[40px] p-10 md:p-14 flex flex-col justify-between hover:border-[#cafd00]/20 transition-all duration-700 shadow-3xl">
            <label className="block text-sm uppercase tracking-widest font-black text-[#fedc00] mb-12 font-headline">{t("pricing")}</label>
            <div>
              <div className="text-6xl font-black text-white font-headline mb-4 tracking-tighter">{price === 0 ? t("free") : `${price} $`}</div>
              <div className="text-xs text-[#555] font-black uppercase tracking-widest mb-10">{t("oneTimePay")}</div>
              
              <div className="space-y-4 pt-8 border-t border-white/5 relative z-10">
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                  <span className="text-[#444]">Processing Fee</span>
                  <span className="text-[#cafd00]">0% (Launch)</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                  <span className="text-[#444]">Marketplace</span>
                  <span className="text-[#cafd00]">Enabled</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#111] border border-white/5 rounded-[40px] p-10 md:p-14 flex flex-col justify-between hover:border-[#cafd00]/20 transition-all duration-700 shadow-3xl">
            <label className="block text-sm uppercase tracking-widest font-black text-[#fedc00] mb-12 font-headline">{t("structureSummary")}</label>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-7xl font-black text-white font-headline tracking-tighter leading-none mb-2">{modules.length}</div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#555] font-black ml-1">{t("modules")}</div>
              </div>
              <div className="h-14 w-px bg-white/10 mx-6"></div>
              <div>
                <div className="text-7xl font-black text-white font-headline tracking-tighter leading-none mb-2">{totalLessons}</div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#555] font-black ml-1">{t("lessons")}</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 bg-[#111] border border-white/5 rounded-[40px] p-10 md:p-14 hover:border-[#cafd00]/20 transition-all duration-700 shadow-3xl">
            <label className="block text-sm uppercase tracking-widest font-black text-[#fedc00] mb-12 font-headline">Distribution Details</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl">video_library</span>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Streaming</div>
                  <div className="text-[9px] text-[#555] uppercase font-black tracking-widest">4K Delivery</div>
                </div>
              </div>
              <div className="space-y-4 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl">description</span>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Resources</div>
                  <div className="text-[9px] text-[#555] uppercase font-black tracking-widest">PDF Assets</div>
                </div>
              </div>
              <div className="space-y-4 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl">quiz</span>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Assessment</div>
                  <div className="text-[9px] text-[#555] uppercase font-black tracking-widest">Global Ranking</div>
                </div>
              </div>
              <div className="space-y-4 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl">code</span>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Dev Support</div>
                  <div className="text-[9px] text-[#555] uppercase font-black tracking-widest">Git Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-40">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white font-headline uppercase italic">{t("curriculum")} Blueprint</h2>
          </div>
          <div className="space-y-6">
            {modules.map((module, i) => (
              <div key={module.id} className="group flex items-center justify-between p-10 bg-[#111] border border-white/5 rounded-[32px] hover:bg-[#cafd00]/5 transition-all duration-500 cursor-pointer hover:border-[#cafd00]/30 shadow-xl">
                <div className="flex items-center space-x-10">
                  <span className="text-lg font-black text-[#222] group-hover:text-[#cafd00] transition-colors font-headline tracking-widest">0{i + 1}</span>
                  <div>
                    <div className="text-2xl font-bold text-white font-headline group-hover:text-[#cafd00] transition-colors mb-2 leading-none">{module.title}</div>
                    <div className="text-xs text-[#555] font-black tracking-[0.2em] uppercase">{module.lessons.length} {t("lessons")}</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#222] group-hover:text-[#cafd00] text-4xl transition-all mr-2">chevron_right</span>
              </div>
            ))}
            {modules.length === 0 && (
              <div className="text-center py-24 bg-[#0a0a0a] border border-dashed border-[#222] rounded-[32px] opacity-40">
                <span className="material-symbols-outlined text-6xl mb-6">inventory_2</span>
                <p className="text-2xl font-light italic">{t("noModules")}</p>
              </div>
            )}
          </div>
        </section>

        <div className="relative py-32 flex flex-col items-center justify-center border-t border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#cafd00] to-transparent"></div>
          
          <div className="text-center mb-20 scroll-mt-20">
            <p className="text-xs uppercase tracking-[0.5em] font-black text-[#fedc00] mb-8 shadow-sm">Protocol Finalized</p>
            <p className="text-[#888] text-3xl font-light max-w-2xl mx-auto leading-relaxed italic">
              Your architectural masterpiece is ready to be launched to the digital universe.
            </p>
          </div>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="group relative px-24 py-14 bg-[#cafd00] text-[#516700] rounded-[50px] transition-all duration-700 hover:scale-[1.05] active:scale-95 shadow-[0_30px_70px_-20px_rgba(202,253,0,0.5)] active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative flex items-center space-x-10">
              <span className="text-5xl font-black uppercase tracking-tighter font-headline leading-none">
                {isPublishing ? "Initiating..." : "Deploy Course"}
              </span>
              <span className={`material-symbols-outlined text-6xl transition-all duration-700 ${isPublishing ? 'animate-pulse' : 'group-hover:translate-x-6 group-hover:-translate-y-6'}`}>rocket_launch</span>
            </div>
            
            <div className="absolute -inset-1 rounded-[50px] border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <div className="mt-20 flex items-center space-x-20">
            <button onClick={() => router.push('/create-course')} className="text-xs font-black uppercase tracking-[0.4em] text-[#555] hover:text-[#cafd00] transition-colors">{t("backStep")}</button>
            <div className="w-2 h-2 rounded-full bg-white/10"></div>
            <button className="text-xs font-black uppercase tracking-[0.4em] text-[#555] hover:text-[#cafd00] transition-colors">{t("saveDraft")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
