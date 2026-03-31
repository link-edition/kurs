"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";

export default function Step3Pricing() {
  const { price, setPricing } = useCourseStore();
  const router = useRouter();

  const handleNext = () => {
    router.push('/create-course/publish');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-12 relative animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-[calc(100vh-140px)] w-full font-body">
      <div className="w-full max-w-2xl">
        <header className="mb-16 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#cafd00]/60 mb-4 font-headline">Step 3 of 4</div>
          <h1 className="text-5xl font-bold tracking-tighter text-white mb-6 font-headline">Course Pricing</h1>
          <p className="text-[#919191] max-w-md mx-auto leading-relaxed text-sm">Define how you want to monetize your knowledge. Choose between a free access model or a premium paid experience.</p>
        </header>

        <div className="bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] rounded-2xl p-8 relative overflow-hidden">
          <div className="flex justify-center mb-16 relative z-10">
            <div className="bg-black/40 p-1 rounded-full flex w-72 border border-white/5">
              <button 
                onClick={() => setPricing(true, 0, "")}
                className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-widest transition-all font-headline ${price === 0 ? 'bg-[#cafd00] text-[#516700] rounded-full shadow-[0_0_20px_rgba(202,253,0,0.3)]' : 'text-[#919191] hover:text-white'}`}
              >
                Free
              </button>
              <button 
                onClick={() => setPricing(false, 49.99, "")}
                className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-widest transition-all font-headline ${price > 0 ? 'bg-[#cafd00] text-[#516700] rounded-full shadow-[0_0_20px_rgba(202,253,0,0.3)]' : 'text-[#919191] hover:text-white'}`}
              >
                Paid
              </button>
            </div>
          </div>

          {price > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 animate-in fade-in duration-500">
              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-widest text-[#cafd00] font-bold font-headline">Base Price (USD)</label>
                <div className="relative flex items-baseline border-b border-[#cafd00]/20 py-4 group hover:border-[#cafd00] transition-colors">
                  <span className="text-2xl font-light text-[#919191] mr-3 font-headline">$</span>
                  <input 
                    className="bg-transparent outline-none border-none p-0 text-6xl font-bold tracking-tighter text-white focus:ring-0 w-full placeholder-[#333] font-headline" 
                    placeholder="0.00" 
                    type="number" 
                    value={price}
                    onChange={(e) => setPricing(false, Number(e.target.value), "")}
                  />
                </div>
                <p className="text-[12px] text-[#919191]">Students will pay this amount once for lifetime access.</p>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-widest text-[#fedc00] font-bold font-headline">Promo Codes</label>
                <div className="bg-black/30 rounded-xl p-1 flex items-center border border-white/5 transition-all focus-within:border-[#fedc00]/40">
                  <input className="bg-transparent outline-none border-none focus:ring-0 text-white font-mono text-sm w-full px-4 uppercase placeholder-[#444]" placeholder="e.g. EARLYBIRD20" type="text"/>
                  <button className="bg-white/5 text-white px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-tight hover:bg-white/10 transition-colors font-headline">
                    Apply
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="bg-[#fedc00]/10 text-[10px] text-[#fedc00] px-3 py-1.5 rounded-full border border-[#fedc00]/20 flex items-center font-bold tracking-wider uppercase font-headline">
                    LAUNCH25 <span className="material-symbols-outlined text-[14px] ml-2 cursor-pointer hover:text-white transition-colors">close</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {price === 0 && (
            <div className="text-center py-12 relative z-10 animate-in fade-in duration-500">
                <span className="material-symbols-outlined text-6xl text-[#cafd00] mb-4">volunteer_activism</span>
                <h3 className="text-2xl font-headline font-bold text-white tracking-tight mb-2">Free Course Selected</h3>
                <p className="text-[#919191] text-sm max-w-md mx-auto">This course will be available to all students without any charge. Great way to build your audience!</p>
            </div>
          )}

          <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-[#cafd00]/10 blur-[80px] rounded-full pointer-events-none z-0"></div>
        </div>

        <div className="mt-16 flex items-center justify-between animate-in fade-in duration-500 pt-8 border-t border-white/5">
          <button onClick={() => router.push('/create-course/curriculum')} className="group flex items-center space-x-3 text-[#919191] hover:text-white transition-all">
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] font-headline">Back</span>
          </button>
          <div className="flex items-center space-x-8">
            <div className="hidden sm:block text-right">
              <div className="text-[10px] text-[#666] uppercase tracking-widest font-headline">Next Step</div>
              <div className="text-[13px] font-medium text-[#e5e1e4]">Review & Publish</div>
            </div>
            <button onClick={handleNext} className="bg-[#cafd00] text-[#516700] px-12 py-4 rounded-full text-[13px] font-black uppercase tracking-[0.25em] shadow-[0_10px_40px_rgba(202,253,0,0.15)] hover:scale-[1.03] hover:brightness-110 active:scale-95 transition-all font-headline">
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
