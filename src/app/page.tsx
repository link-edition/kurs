"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { useLang } from "@/lib/lang-context";

export default function LandingPage() {
  const { lang, setLang } = useLang();

  return (
    <div className="bg-[#000000] text-white min-h-screen font-body selection:bg-[#cafd00] selection:text-[#3a4a00] overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        .plasma-glow {
            background: radial-gradient(circle at 50% 50%, rgba(202, 253, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
        }
        .glass-card {
            backdrop-filter: blur(20px);
            background: rgba(38, 38, 38, 0.4);
            border: 1px solid rgba(202, 253, 0, 0.05);
        }
        .kinetic-tilt:hover {
            transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-8px);
        }
        .neon-line-glow {
            box-shadow: 0 0 20px rgba(254, 220, 0, 0.4);
        }
      `}} />

      {/* TopNavBar */}
      <nav className="sticky top-4 z-50 flex justify-between items-center px-8 py-4 bg-black/60 backdrop-blur-xl rounded-full mx-auto w-[95%] max-w-7xl shadow-[0_20px_50px_rgba(202,253,0,0.15)] font-['Space_Grotesk'] tracking-tight border border-white/5">
        <div className="text-2xl font-bold text-white tracking-tighter">Course Architect</div>
        <div className="hidden md:flex gap-8 items-center">
          <Link className="text-[#cafd00] font-bold hover:scale-105 transition-all duration-300" href="#">{lang === 'uz' ? 'Imkoniyatlar' : 'Features'}</Link>
          <Link className="text-white/70 hover:scale-105 hover:text-[#cafd00] transition-all duration-300" href="#">{lang === 'uz' ? 'Ish tartibi' : 'Workflow'}</Link>
          <Link className="text-white/70 hover:scale-105 hover:text-[#cafd00] transition-all duration-300" href="#">{lang === 'uz' ? 'Narxlar' : 'Pricing'}</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'uz' ? 'en' : 'uz')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#cafd00]/30 transition-all group"
          >
            <Globe className="w-4 h-4 text-[#cafd00] group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{lang.toUpperCase()}</span>
          </button>

          <Link href="/dashboard" className="bg-[#cafd00] text-[#516700] px-6 py-2.5 rounded-full font-bold scale-95 active:duration-75 hover:scale-105 transition-all duration-300 shadow-[0_10px_20px_rgba(202,253,0,0.2)]">
            {lang === 'uz' ? 'Boshlash' : 'Get Started'}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#f3ffca]/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#fedc00]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center max-w-5xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1f1f1f] border border-[#f3ffca]/20 text-[#cafd00] font-label text-sm uppercase tracking-widest mb-8">
              {lang === 'uz' ? 'Professional Ta\'lim' : 'Professional Education'}
          </span>
          <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-white mb-10">
              {lang === 'uz' ? (
                <>O'z bilim <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cafd00] to-[#fedc00]">imperiyangizni</span> quring</>
              ) : (
                <>Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cafd00] to-[#fedc00]">knowledge empire</span></>
              )}
          </h1>
          <p className="font-body text-[#ababab] text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
              {lang === 'uz' 
                ? 'Kurslaringizni professional darajaga olib chiqing. Yuqori sifatli va zamonaviy ta\'lim tajribasini yarating.'
                : 'Elevate your courses to a professional level. Create high-quality, modern learning experiences.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/dashboard" className="bg-[#cafd00] text-[#516700] px-10 py-5 rounded-xl text-xl font-extrabold shadow-[0_15px_40px_rgba(202,253,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-500 flex items-center gap-3">
                {lang === 'uz' ? 'Hozir boshlash' : 'Start Building Now'}
                <span className="material-symbols-outlined">rocket_launch</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 relative z-10">
          <div className="max-w-xl">
            <h2 className="font-headline text-5xl font-bold tracking-tight mb-4">
              {lang === 'uz' ? 'Keng Imkoniyatlar' : 'Professional Features'}
            </h2>
            <p className="text-[#ababab] text-lg">
              {lang === 'uz' 
                ? 'Kurslaringizni boshqarish va o\'quvchilarga yetkazish uchun barcha kerakli vositalar bir joyda.'
                : 'All the tools you need to manage and deliver your courses in one place.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          {/* AI Curriculum */}
          <div className="md:col-span-12 glass-card rounded-2xl p-10 relative overflow-hidden kinetic-tilt transition-all duration-500 group min-h-[400px] flex items-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#f3ffca]/5 rounded-full blur-[100px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center w-full">
              <div className="flex-1">
                <div className="w-16 h-16 bg-[#cafd00] rounded-2xl flex items-center justify-center mb-8 shadow-[0_10px_30px_rgba(202,253,0,0.3)]">
                  <span className="material-symbols-outlined text-[#4a5e00] text-3xl">psychology</span>
                </div>
                <h3 className="font-headline text-4xl font-bold mb-4 text-white">
                  {lang === 'uz' ? 'Kurs Strukturasi' : 'Course Structure'}
                </h3>
                <p className="text-[#ababab] max-w-md text-xl leading-relaxed">
                  {lang === 'uz' 
                    ? 'Modullar va darslarni osonlik bilan tartiblang. YouTube videolarini ulash va o\'quv dasturini shakllantirish juda qulay.'
                    : 'Easily organize modules and lessons. Seamless YouTube integration and intuitive curriculum planning.'}
                </p>
              </div>
              <div className="flex-1 w-full bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 p-8">
                 <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-[#cafd00]/20 flex items-center justify-center text-[#cafd00] text-xs font-bold">{i}</div>
                        <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Path to Success */}
      <section className="py-32 px-6 relative overflow-hidden bg-black/50">
        <div className="text-center mb-24">
          <h2 className="font-headline text-5xl font-bold mb-6 text-white">
            {lang === 'uz' ? 'Qanday ishlaydi?' : 'How It Works'}
          </h2>
        </div>
        <div className="max-w-6xl mx-auto relative px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-[#000] rounded-xl border border-white/10 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 hover:border-[#cafd00]/30">
                <span className="text-4xl font-black text-[#cafd00]">01</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-white">{lang === 'uz' ? 'Yaratish' : 'Create'}</h4>
              <p className="text-center text-[#ababab] text-sm">{lang === 'uz' ? 'Yangi loyiha oching va kurs nomini belgilang.' : 'Start a new project and define your course title.'}</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-[#000] rounded-xl border border-white/10 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 hover:border-[#fedc00]/30">
                <span className="text-4xl font-black text-[#fedc00]">02</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-white">{lang === 'uz' ? 'Tartiblash' : 'Organize'}</h4>
              <p className="text-center text-[#ababab] text-sm">{lang === 'uz' ? 'Modullar va video darslarni qo\'shing.' : 'Add your modules and high-quality video lessons.'}</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-[#000] rounded-xl border border-[#f3ffca]/40 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(202,253,0,0.2)] group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500">
                <span className="text-4xl font-black text-white">03</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-white">{lang === 'uz' ? 'Ulashish' : 'Share'}</h4>
              <p className="text-center text-[#ababab] text-sm">{lang === 'uz' ? 'Tayyor kurs linkini o\'quvchilarga yuboring.' : 'Send the course link to your students instantly.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-black via-[#131313] to-[#cafd00]/10 p-16 md:p-32 relative overflow-hidden text-center border border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(202,253,0,0.1),transparent)]"></div>
          <div className="relative z-10">
            <h2 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-white">
              {lang === 'uz' ? 'O\'z kursingizni hozir yarating' : 'Build Your Course Now'}
            </h2>
            <Link href="/dashboard" className="inline-block bg-[#cafd00] text-[#516700] px-12 py-6 rounded-xl text-2xl font-black shadow-[0_20px_50px_rgba(202,253,0,0.3)] hover:scale-110 hover:-translate-y-2 active:scale-95 transition-all duration-500">
                {lang === 'uz' ? 'Boshqaruv paneliga o\'tish' : 'Go to Dashboard'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-12 py-16 flex flex-col items-center border-t border-white/5 bg-[#000000]">
        <div className="text-3xl font-black text-white mb-8 tracking-tighter">Course <span className="text-[#cafd00]">Architect</span></div>
        <p className="text-white/20 font-['Manrope'] text-[10px] uppercase tracking-[0.3em] font-bold">© 2026 Course Architect. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}
