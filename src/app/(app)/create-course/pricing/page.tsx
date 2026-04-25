"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { cn } from "@/lib/utils";

export default function Step3Pricing() {
  const { price, setPricing } = useCourseStore();
  const { t } = useLang();
  const router = useRouter();

  const handleNext = () => {
    router.push('/create-course/publish');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-[calc(100vh-140px)] w-full font-body bg-background transition-colors duration-300">
      <div className="w-full max-w-3xl">
        <header className="mb-10 sm:mb-16 text-center">
          <div className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#cafd00] mb-3 sm:mb-4 font-headline uppercase">{t("step")} 03 {t("of")} 04</div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-foreground mb-4 sm:mb-6 font-headline uppercase italic">{t("pricing")}</h1>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed text-base sm:text-lg font-light">{t("monetize")}</p>
        </header>

        <div className="bg-card border border-border rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-sm dark:shadow-2xl shadow-[0_10px_50px_rgba(0,0,0,0.05)] dark:shadow-none">
          <div className="flex justify-center mb-10 sm:mb-16 relative z-10">
            <div className="bg-muted p-1.5 rounded-full flex w-full max-w-md border border-border shadow-inner overflow-hidden">
              <button 
                onClick={() => setPricing(true, 0, "")}
                className={cn(
                  "flex-1 py-3 sm:py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all font-headline rounded-full font-black",
                  price === 0 ? 'bg-[#cafd00] text-[#516700] shadow-[0_0_30px_rgba(202,253,0,0.4)]' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t("freeModel")}
              </button>
              <button 
                onClick={() => setPricing(false, 49, "")}
                className={cn(
                  "flex-1 py-3 sm:py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all font-headline rounded-full font-black",
                  price > 0 ? 'bg-[#cafd00] text-[#516700] shadow-[0_0_30px_rgba(202,253,0,0.4)]' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t("paidModel")}
              </button>
            </div>
          </div>

          <div className="relative z-10 space-y-8 sm:space-y-12">
            {price > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-xs sm:text-sm uppercase tracking-widest text-[#a58d00] dark:text-[#fedc00] font-black font-headline block ml-1">{t("basePrice")}</label>
                  <div className="bg-muted border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all focus-within:border-[#cafd00]/50 shadow-inner flex items-baseline gap-2 sm:gap-4 overflow-hidden">
                    <span className="text-2xl sm:text-4xl font-headline font-black text-muted-foreground/30">$</span>
                    <input 
                      className="bg-transparent outline-none border-none p-0 text-4xl sm:text-6xl font-black tracking-tighter text-foreground focus:ring-0 w-full placeholder-muted-foreground/20 font-headline uppercase italic" 
                      placeholder="0" 
                      type="number" 
                      value={price}
                      onChange={(e) => setPricing(false, Number(e.target.value), "")}
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-widest opacity-40 leading-relaxed italic mt-1 sm:mt-2">{t("oneTimePay")}</p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="text-xs sm:text-sm uppercase tracking-widest text-[#a58d00] dark:text-[#fedc00] font-black font-headline block ml-1">{t("promoCodes")}</label>
                  <div className="bg-muted border border-border rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center transition-all focus-within:border-[#cafd00]/50 shadow-inner">
                    <input className="bg-transparent outline-none border-none focus:ring-0 text-sm sm:text-lg text-foreground font-black uppercase tracking-widest w-full px-2 sm:px-4 placeholder-muted-foreground/30" placeholder="EARLYBIRD" type="text"/>
                    <button className="bg-foreground text-background px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-[#fedc00] hover:text-black transition-all font-headline shrink-0">
                      {t("apply") || t("applyUz")}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-4 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="bg-muted text-[8px] text-muted-foreground px-2.5 py-1 sm:py-1.5 rounded-full border border-border flex items-center font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase font-headline">
                      STICH25 <span className="material-symbols-outlined text-[12px] sm:text-[14px] ml-1.5 sm:ml-2 cursor-pointer hover:text-foreground transition-colors">close</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#cafd00]/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-[#cafd00]/20 shadow-[0_0_40px_rgba(202,253,0,0.1)]">
                    <span className="material-symbols-outlined text-4xl sm:text-6xl text-[#cafd00]">volunteer_activism</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-headline font-black text-foreground tracking-tight mb-2 sm:mb-4 uppercase italic">{t("freeCourseSelected")}</h3>
                  <p className="text-muted-foreground text-sm sm:text-lg max-w-sm sm:max-w-md mx-auto font-light leading-relaxed">{t("freeCourseDesc")}</p>
              </div>
            )}
          </div>

          <div className="absolute -right-32 -bottom-32 w-80 h-80 bg-[#cafd00]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        </div>

        <footer className="mt-12 sm:mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border pt-8 sm:pt-10">
          <button onClick={() => router.push('/create-course/curriculum')} className="group flex items-center gap-3 sm:gap-4 text-muted-foreground hover:text-foreground transition-all font-black text-[10px] sm:text-xs uppercase tracking-widest font-headline">
            <span className="material-symbols-outlined text-xl sm:text-2xl transition-transform group-hover:-translate-x-2 text-[#cafd00]">arrow_back</span>
            {t("backStep")}
          </button>
          <button onClick={handleNext} className="w-full sm:w-auto bg-[#cafd00] text-[#516700] px-10 sm:px-14 py-4 sm:py-6 rounded-2xl sm:rounded-3xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-[0_15px_40px_rgba(202,253,0,0.3)] hover:scale-[1.03] hover:brightness-110 active:scale-95 transition-all font-headline flex items-center justify-center gap-3 sm:gap-5">
            {t("nextStep")}
            <span className="material-symbols-outlined text-xl sm:text-2xl font-black">arrow_forward</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
