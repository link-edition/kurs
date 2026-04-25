"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { publishCourseAction } from "@/app/actions/publish-course";
import { useLang } from "@/lib/lang-context";
import { cn } from "@/lib/utils";

export default function Step4Publish() {
  const { title, subtitle, categoryId, description, imageUrl, price, isFree, modules, reset } = useCourseStore();
  const { t } = useLang();
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const listener = () => handlePublish();
    window.addEventListener('trigger-publish', listener);
    return () => window.removeEventListener('trigger-publish', listener);
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    const result = await publishCourseAction({
      title, subtitle, categoryId, description, imageUrl, price, isFree, modules
    });

    if (result?.success) {
      reset();
      router.push('/dashboard');
    } else {
      alert((t("error") || "Xatolik") + ": " + result?.error);
      setIsPublishing(false);
    }
  };

  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  return (
    <div className="flex-1 p-4 sm:p-8 lg:p-16 relative animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-screen w-full font-body bg-background transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 sm:mb-24">
          <div className="flex items-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
            <span className="px-3 sm:px-5 py-1 sm:py-1.5 bg-[#cafd00] text-[#516700] rounded-full text-[9px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-black font-headline shadow-[0_10px_20px_rgba(202,253,0,0.2)] shrink-0">{t("step")} 04</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none mb-6 sm:mb-8 font-headline uppercase italic">
            TEKSHIRUV VA<br/><span className="text-[#cafd00]">CHOP ETISH</span>
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed font-light">
            Sizning loyihangiz tayyor. Barcha ma'lumotlarni so'nggi bor ko'zdan kechirib, dunyo bilan baham ko'ring.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 mb-12 sm:mb-24">
          <div className="md:col-span-8 bg-card border border-border rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 group transition-all duration-700 hover:border-[#cafd00]/20 shadow-sm dark:shadow-xl">
            <label className="block text-[10px] sm:text-sm uppercase tracking-widest font-black text-[#a58d00] dark:text-[#fedc00] mb-6 sm:mb-12 font-headline">{t("foundation")}</label>
            <div className="space-y-6 sm:space-y-8">
              <div className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-headline leading-tight uppercase italic">{title || "Nomsiz Kurs"}</div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                <span className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-[13px] text-foreground font-bold border border-border bg-muted/50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-inner uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[#cafd00] text-xl sm:text-2xl">category</span>
                  <span className="capitalize italic">{categoryId || "Kategoriya tanlanmagan"}</span>
                </span>
                <span className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-[13px] text-foreground font-bold border border-border bg-muted/50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-inner uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[#cafd00] text-xl sm:text-2xl">language</span>
                  <span className="italic">{t("uzbek") || "O'zbek"} (Global)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-card border border-border rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 flex flex-col justify-between hover:border-[#cafd00]/20 transition-all duration-700 shadow-sm dark:shadow-xl">
            <label className="block text-[10px] sm:text-sm uppercase tracking-widest font-black text-[#a58d00] dark:text-[#fedc00] mb-6 sm:mb-12 font-headline">{t("pricing")}</label>
            <div>
              <div className="text-4xl sm:text-6xl font-black text-foreground font-headline mb-2 sm:mb-4 tracking-tighter uppercase italic">{price === 0 ? t("free") : `${price} $`}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-6 sm:mb-10 opacity-40">{t("oneTimePay")}</div>
              
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8 border-t border-border relative z-10">
                <div className="flex justify-between items-center text-[9px] sm:text-[10px] uppercase font-black tracking-widest">
                  <span className="text-muted-foreground/40">Xizmat haqi</span>
                  <span className="text-[#cafd00]">0%</span>
                </div>
                <div className="flex justify-between items-center text-[9px] sm:text-[10px] uppercase font-black tracking-widest">
                  <span className="text-muted-foreground/40">Marketplace</span>
                  <span className="text-[#cafd00]">Yoqilgan</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-card border border-border rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 flex flex-col justify-between hover:border-[#cafd00]/20 transition-all duration-700 shadow-sm dark:shadow-xl">
            <label className="block text-[10px] sm:text-sm uppercase tracking-widest font-black text-[#a58d00] dark:text-[#fedc00] mb-6 sm:mb-12 font-headline">Statistika</label>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-5xl sm:text-7xl font-black text-foreground font-headline tracking-tighter leading-none mb-1 sm:mb-2">{modules.length}</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-muted-foreground font-black ml-1 opacity-40">{t("modules")}</div>
              </div>
              <div className="h-10 sm:h-14 w-px bg-border mx-4 sm:mx-6"></div>
              <div>
                <div className="text-5xl sm:text-7xl font-black text-foreground font-headline tracking-tighter leading-none mb-1 sm:mb-2">{totalLessons}</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-muted-foreground font-black ml-1 opacity-40">{t("lessons")}</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 bg-card border border-border rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 hover:border-[#cafd00]/20 transition-all duration-700 shadow-sm dark:shadow-xl group/tech overflow-hidden">
            <label className="block text-[10px] sm:text-sm uppercase tracking-widest font-black text-[#a58d00] dark:text-[#fedc00] mb-6 sm:mb-12 font-headline">XUSUSIYATLAR VA SIFAT</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="space-y-2 sm:space-y-4 group/item cursor-help">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl sm:text-4xl font-black group-hover/item:scale-125 transition-transform duration-500">video_library</span>
                <div>
                  <div className="text-xs sm:text-sm font-black text-foreground mb-1 group-hover/item:text-[#cafd00] transition-colors uppercase italic">4K Striming</div>
                  <div className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-tight opacity-40">Maksimal sifatli yetkazish</div>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-4 group/item cursor-help">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl sm:text-4xl font-black group-hover/item:scale-125 transition-transform duration-500">description</span>
                <div>
                  <div className="text-xs sm:text-sm font-black text-foreground mb-1 group-hover/item:text-[#cafd00] transition-colors uppercase italic">O'quv assetlari</div>
                  <div className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-tight opacity-40">Barcha fayllar ochiq</div>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-4 group/item cursor-help">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl sm:text-4xl font-black group-hover/item:scale-125 transition-transform duration-500">all_inclusive</span>
                <div>
                  <div className="text-xs sm:text-sm font-black text-foreground mb-1 group-hover/item:text-[#cafd00] transition-colors uppercase italic">Cheksiz kirish</div>
                  <div className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-tight opacity-40">Muddat cheklovi yo'q</div>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-4 group/item cursor-help">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl sm:text-4xl font-black group-hover/item:scale-125 transition-transform duration-500">workspace_premium</span>
                <div>
                  <div className="text-xs sm:text-sm font-black text-foreground mb-1 group-hover/item:text-[#cafd00] transition-colors uppercase italic">Oltin Sertifikat</div>
                  <div className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-tight opacity-40">Rasmiy tasdiqnoma</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-20 sm:mb-40">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground font-headline uppercase italic">O'QUV PLANI CHIZMASI</h2>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {modules.map((module, i) => (
              <div key={module.id} className="group flex items-center justify-between p-6 sm:p-10 bg-card border border-border rounded-[24px] sm:rounded-[40px] hover:bg-muted/50 transition-all duration-500 cursor-pointer hover:border-[#cafd00]/30 shadow-sm dark:shadow-xl relative overflow-hidden">
                <div className="flex items-center space-x-6 sm:space-x-12 relative z-10">
                  <span className="text-sm sm:text-2xl font-black text-muted-foreground/10 group-hover:text-[#cafd00] transition-colors font-headline tracking-widest">0{i + 1}</span>
                  <div className="truncate">
                    <div className="text-xl sm:text-3xl font-black text-foreground font-headline group-hover:text-[#cafd00] transition-colors mb-2 leading-none truncate uppercase italic">{module.title}</div>
                    <div className="text-[9px] sm:text-xs text-muted-foreground font-black tracking-[0.2em] uppercase opacity-40">{module.lessons.length} {t("lessons")}</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-muted-foreground/10 group-hover:text-[#cafd00] text-2xl sm:text-5xl transition-all mr-1 sm:mr-2 shrink-0 relative z-10">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        <div className="relative py-16 sm:py-32 flex flex-col items-center justify-center border-t border-border mb-16 sm:mb-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 sm:w-64 h-px bg-gradient-to-r from-transparent via-[#cafd00] to-transparent"></div>
          
          <div className="text-center mb-12 sm:mb-20">
            <p className="text-[9px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.6em] font-black text-[#a58d00] dark:text-[#cafd00] mb-4 sm:mb-8 font-headline animate-pulse">TAYYORGARLIK YAKUNLANDI</p>
            <p className="text-foreground text-xl sm:text-4xl font-light max-w-3xl mx-auto leading-[1.4] italic px-4">
              Sizning ijodingiz mahsuli bo'lgan ushbu kurs barcha talablarimizga javob beradi. Uni dunyoga e'lon qilish vaqti keldi.
            </p>
          </div>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="group relative px-10 sm:px-24 py-8 sm:py-16 bg-[#cafd00] text-[#516700] rounded-[40px] sm:rounded-[60px] transition-all duration-700 hover:scale-[1.05] active:scale-95 shadow-[0_30px_80px_rgba(202,253,0,0.3)] active:shadow-inner disabled:opacity-50 w-full sm:w-auto overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-center space-x-6 sm:space-x-12">
              <span className="text-2xl sm:text-6xl font-black uppercase tracking-tighter font-headline leading-none italic">
                {isPublishing ? "CHOP ETILMOQDA..." : "CHOP ETISH"}
              </span>
              <span className={`material-symbols-outlined text-4xl sm:text-7xl transition-all duration-700 ${isPublishing ? 'animate-spin' : 'group-hover:translate-x-4 group-hover:-translate-y-4'}`}>rocket_launch</span>
            </div>
          </button>
          
          <div className="mt-12 sm:mt-24 flex items-center space-x-10 sm:space-x-20 opacity-30 hover:opacity-100 transition-opacity">
            <button onClick={() => router.push('/create-course')} className="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-muted-foreground hover:text-[#cafd00] transition-colors font-headline">{t("backStep")}</button>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-border"></div>
            <button onClick={() => router.push('/dashboard')} className="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-muted-foreground hover:text-[#cafd00] transition-colors font-headline">Loyihadan chiqish</button>
          </div>
        </div>
      </div>
    </div>
  );
}
