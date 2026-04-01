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
    <div className="flex-1 p-12 lg:p-20 relative animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-screen w-full font-body">
      <div className="max-w-5xl mx-auto">
        <header className="mb-24">
          <div className="flex items-center space-x-4 mb-6">
            <span className="px-4 py-1 bg-[#cafd00] text-[#516700] rounded-full text-[11px] uppercase tracking-[0.2em] font-black font-headline">{t("step")} 04</span>
            <div className="h-[1px] w-12 bg-[#cafd00]/20"></div>
            <span className="text-[#fedc00] text-sm font-bold uppercase tracking-wider font-headline">{t("publish")}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.05em] text-white leading-none mb-8 font-headline uppercase italic">
            Final Review.
          </h1>
          <p className="text-xl text-[#888] max-w-2xl leading-relaxed font-light">
            {t("foundationDesc")}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          <div className="md:col-span-8 bg-[#111] border border-white/5 rounded-[32px] p-10 group transition-all duration-500 hover:border-[#cafd00]/20 shadow-2xl">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#fedc00] mb-12 font-headline">{t("foundation")}</label>
            <div className="space-y-6">
              <div className="text-4xl font-bold tracking-tight text-white font-headline">{title || "Untitled Course"}</div>
              <div className="flex items-center space-x-6">
                <span className="flex items-center space-x-2 text-sm text-[#888] font-medium border border-white/10 px-4 py-2 rounded-full">
                  <span className="material-symbols-outlined text-[#cafd00] text-xl">category</span>
                  <span className="capitalize">{categoryId || "Uncategorized"}</span>
                </span>
                <span className="flex items-center space-x-2 text-sm text-[#888] font-medium border border-white/10 px-4 py-2 rounded-full">
                  <span className="material-symbols-outlined text-[#cafd00] text-xl">language</span>
                  <span>{t("uzbek")} (Global)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#111] border border-white/5 rounded-[32px] p-10 flex flex-col justify-between hover:border-[#cafd00]/20 transition-all shadow-2xl">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#fedc00] mb-12 font-headline">{t("pricing")}</label>
            <div>
              <div className="text-5xl font-black text-white font-headline mb-2">{price === 0 ? t("free") : `${price} $`}</div>
              <div className="text-sm text-[#555] font-medium">{t("oneTimePay")}</div>
              <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#555]">Fee</span>
                  <span className="text-[#cafd00] font-bold">0%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#111] border border-white/5 rounded-[32px] p-10 flex flex-col justify-between hover:border-[#cafd00]/20 transition-all shadow-2xl">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#fedc00] mb-12 font-headline">{t("structure")}</label>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-6xl font-black text-white font-headline">{modules.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#555] font-black">{t("modules")}</div>
              </div>
              <div className="h-12 w-[1px] bg-white/10 mx-4"></div>
              <div>
                <div className="text-6xl font-black text-white font-headline">{totalLessons}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#555] font-black">{t("lessons")}</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 bg-[#111] border border-white/5 rounded-[32px] p-10 hover:border-[#cafd00]/20 transition-all shadow-2xl">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#fedc00] mb-12 font-headline">Features Included</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-3 opacity-60">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl">video_library</span>
                <div>
                  <div className="text-sm font-bold text-white">Video</div>
                </div>
              </div>
              <div className="space-y-3 opacity-60">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl">description</span>
                <div>
                  <div className="text-sm font-bold text-white">Assets</div>
                </div>
              </div>
              <div className="space-y-3 opacity-60">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl">quiz</span>
                <div>
                  <div className="text-sm font-bold text-white">Quizzes</div>
                </div>
              </div>
              <div className="space-y-3 opacity-60">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl">code</span>
                <div>
                  <div className="text-sm font-bold text-white">GitHub</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-32">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white font-headline uppercase italic">{t("curriculum")} Blueprint</h2>
          </div>
          <div className="space-y-4">
            {modules.map((module, i) => (
              <div key={module.id} className="group flex items-center justify-between p-8 bg-[#111] border border-white/5 rounded-[32px] hover:bg-[#cafd00]/5 transition-all duration-300 cursor-pointer hover:border-[#cafd00]/20 shadow-xl">
                <div className="flex items-center space-x-8">
                  <span className="text-sm font-black text-[#333] group-hover:text-[#cafd00] transition-colors font-headline">0{i + 1}</span>
                  <div>
                    <div className="text-2xl font-bold text-white font-headline group-hover:text-[#cafd00] transition-colors">{module.title}</div>
                    <div className="text-xs text-[#555] font-medium tracking-widest uppercase">{module.lessons.length} {t("lessons")}</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#333] group-hover:text-[#cafd00] text-3xl transition-all">chevron_right</span>
              </div>
            ))}
            {modules.length === 0 && (
              <div className="text-center py-20 opacity-30">
                <span className="material-symbols-outlined text-6xl mb-4">inventory_2</span>
                <p className="text-xl font-light italic">{t("noModules")}</p>
              </div>
            )}
          </div>
        </section>

        <div className="relative py-32 flex flex-col items-center justify-center border-t border-white/5">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.5em] font-black text-[#fedc00] mb-6">Validation Complete</p>
            <p className="text-[#888] text-2xl font-light max-w-lg mx-auto leading-relaxed italic">
              Your architectural masterpiece is ready to be launched.
            </p>
          </div>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="group relative px-24 py-12 bg-[#cafd00] text-[#516700] rounded-[40px] transition-all duration-500 hover:scale-[1.05] active:scale-95 shadow-[0_0_60px_-10px_rgba(202,253,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative flex items-center space-x-8">
              <span className="text-4xl font-black uppercase tracking-tighter font-headline">
                {isPublishing ? "Launching..." : "Deploy Course"}
              </span>
              <span className={`material-symbols-outlined text-5xl transition-all duration-500 ${isPublishing ? 'animate-pulse' : 'group-hover:translate-x-4 group-hover:-translate-y-4'}`}>rocket_launch</span>
            </div>
          </button>
          
          <div className="mt-16 flex items-center space-x-16">
            <button onClick={() => router.push('/create-course')} className="text-[11px] uppercase tracking-[0.3em] font-black text-[#555] hover:text-[#cafd00] transition-colors">{t("backStep")}</button>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
            <button className="text-[11px] uppercase tracking-[0.3em] font-black text-[#555] hover:text-[#cafd00] transition-colors">{t("saveDraft")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
