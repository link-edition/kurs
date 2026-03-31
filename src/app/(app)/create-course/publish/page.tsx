"use client";

import { useCourseStore } from "@/store/course-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Step4Publish() {
  const { title, categoryId, price, modules } = useCourseStore();
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/dashboard');
  };

  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  return (
    <div className="flex-1 p-12 lg:p-20 relative animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-screen w-full font-body">
      <div className="max-w-5xl mx-auto">
        <header className="mb-24">
          <div className="flex items-center space-x-4 mb-6">
            <span className="px-4 py-1 bg-[#cafd00] text-[#516700] rounded-full text-[11px] uppercase tracking-[0.2em] font-black font-headline">Step 04</span>
            <div className="h-[1px] w-12 bg-[#cafd00]/20"></div>
            <span className="text-[#fedc00] text-sm font-bold uppercase tracking-wider font-headline">Ready for Deployment</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.05em] text-white leading-none mb-8 font-headline uppercase italic">
            Final Review.
          </h1>
          <p className="text-xl text-[#919191] max-w-2xl leading-relaxed font-light">
            Examine the monolithic structure of your curriculum one last time. Ensure every module, lesson, and pricing tier aligns with your architectural vision.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          <div className="md:col-span-8 bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] rounded-2xl p-10 group transition-all duration-500 hover:border-[#cafd00]/20 shadow-[0_0_40px_-10px_rgba(202,253,0,0.1)]">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#fedc00] mb-12 font-headline">Core Identity</label>
            <div className="space-y-6">
              <div className="text-4xl font-bold tracking-tight text-white font-headline">{title || "Untitled Course"}</div>
              <div className="flex items-center space-x-6">
                <span className="flex items-center space-x-2 text-sm text-[#919191] font-medium border border-[#cafd00]/10 px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-[#cafd00] text-xl">category</span>
                  <span className="capitalize">{categoryId || "Uncategorized"}</span>
                </span>
                <span className="flex items-center space-x-2 text-sm text-[#919191] font-medium border border-[#cafd00]/10 px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-[#cafd00] text-xl">language</span>
                  <span>English (Global)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] rounded-2xl p-10 flex flex-col justify-between hover:border-[#cafd00]/20 transition-all">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#fedc00] mb-12 font-headline">Investment Model</label>
            <div>
              <div className="text-5xl font-black text-white font-headline mb-2">{price === 0 ? "Free" : `$${price}`}</div>
              <div className="text-sm text-[#919191] font-medium">One-time Lifetime Access</div>
              <div className="mt-8 space-y-3 pt-6 border-t border-[rgba(202,253,0,0.1)]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#919191]">Transaction Fee</span>
                  <span className="text-[#cafd00] font-bold">2.5%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#919191]">Hosting Included</span>
                  <span className="text-[#cafd00] font-bold">Unlimited</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] rounded-2xl p-10 flex flex-col justify-between hover:border-[#cafd00]/20 transition-all">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#fedc00] mb-12 font-headline">Curriculum Volume</label>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-6xl font-black text-white font-headline">{modules.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#919191] font-black">Modules</div>
              </div>
              <div className="h-12 w-[1px] bg-white/10 mx-4"></div>
              <div>
                <div className="text-6xl font-black text-white font-headline">{totalLessons}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#919191] font-black">Lessons</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] rounded-2xl p-10 hover:border-[#cafd00]/20 transition-all">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#fedc00] mb-12 font-headline">Integrated Resources</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <span className="material-symbols-outlined text-[#cafd00] text-2xl">video_library</span>
                <div>
                  <div className="text-sm font-bold text-white">Video</div>
                  <div className="text-[9px] text-[#919191] uppercase font-black tracking-wider">Primary Content</div>
                </div>
              </div>
              <div className="space-y-3">
                <span className="material-symbols-outlined text-[#cafd00] text-2xl">description</span>
                <div>
                  <div className="text-sm font-bold text-white">Assets</div>
                  <div className="text-[9px] text-[#919191] uppercase font-black tracking-wider">PDF & Guides</div>
                </div>
              </div>
              <div className="space-y-3">
                <span className="material-symbols-outlined text-[#cafd00] text-2xl">quiz</span>
                <div>
                  <div className="text-sm font-bold text-white">Quizzes</div>
                  <div className="text-[9px] text-[#919191] uppercase font-black tracking-wider">Assessments</div>
                </div>
              </div>
              <div className="space-y-3">
                <span className="material-symbols-outlined text-[#cafd00] text-2xl">code</span>
                <div>
                  <div className="text-sm font-bold text-white">Included</div>
                  <div className="text-[9px] text-[#919191] uppercase font-black tracking-wider">GitHub Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-32">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white font-headline uppercase italic">Curriculum Blueprint</h2>
            <button className="text-xs font-black text-[#fedc00] hover:text-[#cafd00] transition-colors uppercase tracking-[0.2em]">Expand All</button>
          </div>
          <div className="space-y-4">
            {modules.map((module, i) => (
              <div key={module.id} className="group flex items-center justify-between p-6 bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] rounded-xl hover:bg-[#cafd00]/5 transition-all duration-300 cursor-pointer hover:border-[#cafd00]/20">
                <div className="flex items-center space-x-6">
                  <span className="text-sm font-black text-[#666] group-hover:text-[#cafd00] transition-colors font-headline">0{i + 1}</span>
                  <div>
                    <div className="text-lg font-bold text-white font-headline group-hover:text-[#cafd00] transition-colors">{module.title}</div>
                    <div className="text-xs text-[#919191] font-medium">{module.lessons.length} Lessons</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#666] group-hover:text-[#cafd00]">chevron_right</span>
              </div>
            ))}
            {modules.length === 0 && (
              <div className="text-center py-10 opacity-50">
                <span className="material-symbols-outlined text-4xl mb-4">inventory_2</span>
                <p>No modules created yet.</p>
              </div>
            )}
          </div>
        </section>

        <div className="relative py-24 flex flex-col items-center justify-center border-t border-[rgba(202,253,0,0.1)]">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] font-black text-[#fedc00] mb-4">Final Validation Complete</p>
            <p className="text-[#919191] text-lg font-light max-w-md mx-auto">Your course is ready to be launched to the <span className="text-white font-bold">monolith network</span>.</p>
          </div>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="group relative px-20 py-10 bg-[#cafd00] text-[#516700] rounded-full transition-all duration-500 hover:scale-[1.05] active:scale-95 shadow-[0_0_40px_-10px_rgba(202,253,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative flex items-center space-x-6">
              <span className="text-3xl font-black uppercase tracking-tighter font-headline">
                {isPublishing ? "Publishing..." : "Publish Course"}
              </span>
              <span className={`material-symbols-outlined text-4xl transition-all duration-500 ${isPublishing ? 'animate-pulse' : 'group-hover:translate-x-4 group-hover:-translate-y-4'}`}>rocket_launch</span>
            </div>
          </button>
          
          <div className="mt-12 flex items-center space-x-12">
            <button className="text-[11px] uppercase tracking-[0.2em] font-black text-[#919191] hover:text-[#cafd00] transition-colors">Preview as Student</button>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <button onClick={() => router.push('/create-course')} className="text-[11px] uppercase tracking-[0.2em] font-black text-[#919191] hover:text-[#cafd00] transition-colors">Edit Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
