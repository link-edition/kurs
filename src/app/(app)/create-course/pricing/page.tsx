"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";

export default function Step3Pricing() {
  const { price, setPricing } = useCourseStore();
  const { t } = useLang();
  const router = useRouter();

  const handleNext = () => {
    router.push('/create-course/publish');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-[calc(100vh-140px)] w-full font-body">
      <div className="w-full max-w-3xl">
        <header className="mb-16 text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#cafd00] mb-4 font-headline">{t("step")} 03 {t("of")} 04</div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6 font-headline uppercase italic">{t("pricing")}</h1>
          <p className="text-[#888] max-w-lg mx-auto leading-relaxed text-lg font-light">{t("monetize")}</p>
        </header>

        <div className="bg-[#111] border border-white/5 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="flex justify-center mb-16 relative z-10">
            <div className="bg-[#0a0a0a] p-1.5 rounded-full flex w-full max-w-md border border-white/10 shadow-inner">
              <button 
                onClick={() => setPricing(true, 0, "")}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all font-headline rounded-full ${price === 0 ? 'bg-[#cafd00] text-[#516700] shadow-[0_0_30px_rgba(202,253,0,0.4)]' : 'text-[#555] hover:text-white'}`}
              >
                {t("freeModel")}
              </button>
              <button 
                onClick={() => setPricing(false, 49, "")}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all font-headline rounded-full ${price > 0 ? 'bg-[#cafd00] text-[#516700] shadow-[0_0_30px_rgba(202,253,0,0.4)]' : 'text-[#555] hover:text-white'}`}
              >
                {t("paidModel")}
              </button>
            </div>
          </div>

          <div className="relative z-10 space-y-12">
            {price > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-4">
                  <label className="text-sm uppercase tracking-widest text-[#fedc00] font-black font-headline block ml-1">{t("basePrice")}</label>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 transition-all focus-within:border-[#cafd00]/50 shadow-inner flex items-baseline gap-4">
                    <span className="text-4xl font-headline font-bold text-[#444]">$</span>
                    <input 
                      className="bg-transparent outline-none border-none p-0 text-6xl font-bold tracking-tighter text-white focus:ring-0 w-full placeholder-[#222] font-headline" 
                      placeholder="0" 
                      type="number" 
                      value={price}
                      onChange={(e) => setPricing(false, Number(e.target.value), "")}
                    />
                  </div>
                  <p className="text-xs text-[#555] font-medium leading-relaxed italic mt-2">{t("oneTimePay")}</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm uppercase tracking-widest text-[#fedc00] font-black font-headline block ml-1">{t("promoCodes")}</label>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex items-center transition-all focus-within:border-[#cafd00]/50 shadow-inner">
                    <input className="bg-transparent outline-none border-none focus:ring-0 text-lg text-white font-mono w-full px-4 uppercase placeholder-[#333]" placeholder="EARLYBIRD" type="text"/>
                    <button className="bg-white/5 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#fedc00] hover:text-black transition-all font-headline border border-white/10">
                      {t("apply") || t("applyUz")}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="bg-white/5 text-[9px] text-[#888] px-3 py-1.5 rounded-full border border-white/10 flex items-center font-black tracking-[0.2em] uppercase font-headline">
                      STICH25 <span className="material-symbols-outlined text-[14px] ml-2 cursor-pointer hover:text-white transition-colors">close</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="w-24 h-24 bg-[#cafd00]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#cafd00]/20 shadow-[0_0_40px_rgba(202,253,0,0.1)]">
                    <span className="material-symbols-outlined text-6xl text-[#cafd00]">volunteer_activism</span>
                  </div>
                  <h3 className="text-3xl font-headline font-bold text-white tracking-tight mb-4">{t("freeCourseSelected")}</h3>
                  <p className="text-[#555] text-lg max-w-md mx-auto font-light leading-relaxed">{t("freeCourseDesc")}</p>
              </div>
            )}
          </div>

          <div className="absolute -right-32 -bottom-32 w-80 h-80 bg-[#cafd00]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        </div>

        <footer className="mt-20 flex items-center justify-between border-t border-white/5 pt-10">
          <button onClick={() => router.push('/create-course/curriculum')} className="group flex items-center gap-4 text-[#555] hover:text-white transition-all font-black text-xs uppercase tracking-widest font-headline">
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:-translate-x-2 text-[#cafd00]">arrow_back</span>
            {t("backStep")}
          </button>
          <button onClick={handleNext} className="bg-[#cafd00] text-[#516700] px-14 py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(202,253,0,0.3)] hover:scale-[1.03] hover:brightness-110 active:scale-95 transition-all font-headline flex items-center gap-5">
            {t("nextStep")}
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
