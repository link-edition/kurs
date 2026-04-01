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
    <div className="flex-1 flex items-center justify-center p-12 relative animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-[calc(100vh-140px)] w-full font-body">
      <div className="w-full max-w-2xl">
        <header className="mb-16 text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#cafd00]/80 mb-4 font-headline">{t("step")} 3 {t("of")} 4</div>
          <h1 className="text-6xl font-bold tracking-tighter text-white mb-6 font-headline uppercase italic">{t("pricing")}</h1>
          <p className="text-[#888] max-w-md mx-auto leading-relaxed text-lg font-light">{t("monetize")}</p>
        </header>

        <div className="bg-[#111] border border-white/5 rounded-[32px] p-10 relative overflow-hidden shadow-2xl">
          <div className="flex justify-center mb-16 relative z-10">
            <div className="bg-black/60 p-1.5 rounded-full flex w-80 border border-white/10 shadow-inner">
              <button 
                onClick={() => setPricing(true, 0, "")}
                className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all font-headline ${price === 0 ? 'bg-[#cafd00] text-[#516700] rounded-full shadow-[0_0_30px_rgba(202,253,0,0.4)]' : 'text-[#555] hover:text-white'}`}
              >
                {t("freeModel")}
              </button>
              <button 
                onClick={() => setPricing(false, 49.99, "")}
                className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all font-headline ${price > 0 ? 'bg-[#cafd00] text-[#516700] rounded-full shadow-[0_0_30px_rgba(202,253,0,0.4)]' : 'text-[#555] hover:text-white'}`}
              >
                {t("paidModel")}
              </button>
            </div>
          </div>

          {price > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 animate-in fade-in duration-700">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-[#cafd00] font-black font-headline ml-1">{t("basePrice")}</label>
                <div className="relative flex items-baseline border-b border-[#222] py-4 group hover:border-[#cafd00]/30 transition-all">
                  <span className="text-3xl font-light text-[#444] mr-4 font-headline">$</span>
                  <input 
                    className="bg-transparent outline-none border-none p-0 text-7xl font-bold tracking-tighter text-white focus:ring-0 w-full placeholder-[#222] font-headline" 
                    placeholder="0.00" 
                    type="number" 
                    value={price}
                    onChange={(e) => setPricing(false, Number(e.target.value), "")}
                  />
                </div>
                <p className="text-[11px] text-[#555] font-medium leading-relaxed italic">{t("oneTimePay")}</p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-[#fedc00] font-black font-headline ml-1">{t("promoCodes")}</label>
                <div className="bg-black/40 rounded-2xl p-1.5 flex items-center border border-white/5 transition-all focus-within:border-[#fedc00]/30 shadow-inner">
                  <input className="bg-transparent outline-none border-none focus:ring-0 text-white font-mono text-base w-full px-5 uppercase placeholder-[#333]" placeholder="EARLYBIRD" type="text"/>
                  <button className="bg-white/10 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#fedc00] hover:text-black transition-all font-headline">
                    {t("apply") || "OK"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 opacity-40 hover:opacity-100 transition-opacity">
                  <div className="bg-[#fedc00]/10 text-[9px] text-[#fedc00] px-3 py-1.5 rounded-full border border-[#fedc00]/20 flex items-center font-black tracking-[0.2em] uppercase font-headline">
                    STICH25 <span className="material-symbols-outlined text-[14px] ml-2 cursor-pointer hover:text-white transition-colors">close</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {price === 0 && (
            <div className="text-center py-12 relative z-10 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-[#cafd00]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#cafd00]/20 shadow-[0_0_40px_rgba(202,253,0,0.1)]">
                  <span className="material-symbols-outlined text-6xl text-[#cafd00]">volunteer_activism</span>
                </div>
                <h3 className="text-3xl font-headline font-bold text-white tracking-tight mb-4">{t("freeCourseSelected")}</h3>
                <p className="text-[#555] text-base max-w-md mx-auto font-light leading-relaxed">{t("freeCourseDesc")}</p>
            </div>
          )}

          <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-[#cafd00]/5 blur-[100px] rounded-full pointer-events-none z-0"></div>
        </div>

        <div className="mt-16 flex items-center justify-between animate-in fade-in duration-700 pt-10 border-t border-white/5">
          <button onClick={() => router.push('/create-course/curriculum')} className="group flex items-center gap-4 text-[#555] hover:text-white transition-all font-black text-[11px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:-translate-x-2 text-[#cafd00]">arrow_back</span>
            {t("backStep")}
          </button>
          <div className="flex items-center gap-10">
            <div className="hidden sm:block text-right opacity-40">
              <div className="text-[9px] text-[#888] uppercase tracking-[0.4em] font-headline mb-1">Final Phase</div>
              <div className="text-xs font-bold text-white uppercase tracking-widest">{t("publish")}</div>
            </div>
            <button onClick={handleNext} className="bg-[#cafd00] text-[#516700] px-14 py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(202,253,0,0.3)] hover:scale-[1.03] hover:brightness-110 active:scale-95 transition-all font-headline">
              {t("nextStep")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
