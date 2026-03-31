"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function Step1Basics() {
  const { title, subtitle, categoryId, description, setBasicInfo } = useCourseStore();
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/create-course/curriculum');
  };

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-12 w-full animate-in fade-in slide-in-from-bottom-2 duration-700">


      <header className="mb-16">
        <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#fedc00] mb-4 block">Step 01 / 04</span>
        <h2 className="text-6xl font-bold tracking-tighter leading-none text-white mb-6 font-headline italic">Foundation</h2>
        <p className="text-lg text-[#ababab] max-w-xl leading-relaxed">
            Set the core identity of your digital experience. This information will be used for your course landing page and SEO metadata.
        </p>
      </header>

      <form onSubmit={handleNext} className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-3 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#666] font-bold group-focus-within:text-[#cafd00] transition-colors" htmlFor="course-title">Course Title</label>
            <input 
              id="course-title" 
              placeholder="e.g. Architectural Visualization Masterclass" 
              className="w-full bg-transparent border-none px-0 py-4 text-2xl font-light text-white placeholder-[#333] focus:ring-0 border-b border-[#333] focus:border-[#cafd00] transition-all font-headline focus:outline-none"
              value={title}
              onChange={(e) => setBasicInfo({ title: e.target.value, subtitle, categoryId, description })}
              required
            />
          </div>

          <div className="space-y-3 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#666] font-bold group-focus-within:text-[#cafd00] transition-colors" htmlFor="course-category">Category</label>
            <div className="relative">
              <select 
                id="course-category"
                className="w-full bg-transparent border-none px-0 py-4 text-2xl font-light text-white focus:ring-0 border-b border-[#333] focus:border-[#cafd00] transition-all appearance-none cursor-pointer font-headline focus:outline-none"
                value={categoryId}
                onChange={(e) => setBasicInfo({ title, subtitle, categoryId: e.target.value, description })}
                required
              >
                <option disabled value="">Select category...</option>
                <option className="bg-black" value="creative">Creative Arts</option>
                <option className="bg-black" value="engineering">Technical Engineering</option>
                <option className="bg-black" value="business">Business Strategy</option>
                <option className="bg-black" value="development">Personal Development</option>
              </select>
              <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[#333] pointer-events-none group-focus-within:text-[#cafd00]">expand_more</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 group">
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#666] font-bold group-focus-within:text-[#cafd00] transition-colors" htmlFor="description">Short Description</label>
          <textarea 
            id="description" 
            placeholder="Briefly describe what your students will achieve..." 
            className="w-full bg-transparent border-none px-0 py-4 text-2xl font-light text-white placeholder-[#333] focus:ring-0 border-b border-[#333] focus:border-[#cafd00] transition-all resize-none font-headline focus:outline-none" 
            rows={3}
            value={description}
            onChange={(e) => setBasicInfo({ title, subtitle, categoryId, description: e.target.value })}
            required
          ></textarea>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#666] font-bold">Course Cover</label>
            <span className="text-[10px] text-[#666] font-bold uppercase tracking-wider">Recommended: 1920 x 1080px</span>
          </div>
          <div className="relative group">
            <div className="absolute -inset-2 bg-[#cafd00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-2xl"></div>
            <div className="relative border-2 border-dashed border-[#222] rounded-2xl p-16 flex flex-col items-center justify-center bg-[#111]/30 group-hover:bg-[#cafd00]/5 group-hover:border-[#cafd00]/30 transition-all cursor-pointer overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-[#cafd00]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-[#cafd00]/20">
                <span className="material-symbols-outlined text-[#cafd00] text-4xl">add_photo_alternate</span>
              </div>
              <div className="text-center relative z-10">
                <h4 className="text-white font-bold text-lg mb-1">Drag and drop or <span className="text-[#cafd00] underline decoration-[#cafd00]/30 underline-offset-8">browse files</span></h4>
                <p className="text-sm text-[#666] font-medium">Supports JPG, PNG or WebP up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-8 rounded-2xl bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] space-y-4 hover:border-[#cafd00]/20 transition-colors">
            <span className="material-symbols-outlined text-[#fedc00] text-3xl">schedule</span>
            <div>
              <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Estimated Length</h5>
              <p className="text-[11px] text-[#666] mb-4">Total planning duration</p>
            </div>
            <input className="w-full bg-transparent border-none border-b border-[#333] text-white py-2 focus:ring-0 focus:border-[#cafd00] text-sm transition-all placeholder-[#444] font-bold focus:outline-none" placeholder="e.g. 12 hours" type="text"/>
          </div>
          <div className="p-8 rounded-2xl bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] space-y-4 hover:border-[#cafd00]/20 transition-colors">
            <span className="material-symbols-outlined text-[#fedc00] text-3xl">translate</span>
            <div>
              <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Language</h5>
              <p className="text-[11px] text-[#666] mb-4">Primary course medium</p>
            </div>
            <input className="w-full bg-transparent border-none border-b border-[#333] text-white py-2 focus:ring-0 focus:border-[#cafd00] text-sm transition-all placeholder-[#444] font-bold focus:outline-none" placeholder="e.g. English" type="text"/>
          </div>
          <div className="p-8 rounded-2xl bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] space-y-4 hover:border-[#cafd00]/20 transition-colors">
            <span className="material-symbols-outlined text-[#fedc00] text-3xl">verified</span>
            <div>
              <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Expertise Level</h5>
              <p className="text-[11px] text-[#666] mb-4">Targeted audience tier</p>
            </div>
            <input className="w-full bg-transparent border-none border-b border-[#333] text-white py-2 focus:ring-0 focus:border-[#cafd00] text-sm transition-all placeholder-[#444] font-bold focus:outline-none" placeholder="e.g. Intermediate" type="text"/>
          </div>
        </div>

        <footer className="flex items-center justify-between pt-12 border-t border-[#222]">
          <button type="button" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-2 transition-transform">arrow_back</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Discard Draft</span>
          </button>
          <button type="submit" className="bg-[#cafd00] text-[#516700] px-12 py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_-15px_rgba(202,253,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(202,253,0,0.5)] hover:-translate-y-1 active:translate-y-0 active:opacity-90 transition-all flex items-center gap-4">
            Next Step
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </footer>
      </form>
    </div>
  );
}
