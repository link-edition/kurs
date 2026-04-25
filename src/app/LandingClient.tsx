"use client";

import Link from "next/link";
import { ArrowRight, Menu, Globe } from "lucide-react";
import { useLang } from "@/lib/lang-context";

export default function LandingPage() {
  const { t, lang, setLang } = useLang();

  return (
    <div className="bg-background text-foreground min-h-screen font-body selection:bg-[#cafd00] selection:text-[#3a4a00] overflow-x-hidden transition-colors duration-500">
      
      <style dangerouslySetInnerHTML={{__html: `
        .plasma-glow {
            background: radial-gradient(circle at 50% 50%, rgba(202, 253, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
        }
        .glass-card {
            backdrop-filter: blur(20px);
            background: var(--card-bg-fallback, rgba(38, 38, 38, 0.4));
            border: 1px solid var(--border);
        }
        . kinetic-tilt:hover {
            transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-8px);
        }
        .neon-line-glow {
            box-shadow: 0 0 20px rgba(254, 220, 0, 0.4);
        }
      `}} />

      {/* TopNavBar */}
      <nav className="sticky top-4 z-50 flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 bg-background/60 dark:bg-black/60 backdrop-blur-xl rounded-full mx-auto w-[95%] max-w-7xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(202,253,0,0.15)] font-['Space_Grotesk'] tracking-tight border border-border">
        <div className="text-lg sm:text-2xl font-bold text-foreground tracking-tighter">Course Architect</div>
        <div className="hidden md:flex gap-10 items-center">
          <Link className="text-muted-foreground hover:text-[#cafd00] font-bold transition-all duration-300" href="#features">{lang === 'uz' ? 'Imkoniyatlar' : 'Features'}</Link>
          <Link className="text-muted-foreground hover:text-[#cafd00] font-bold transition-all duration-300" href="#workflow">{lang === 'uz' ? 'Ish tartibi' : 'Workflow'}</Link>
          <Link className="text-muted-foreground hover:text-[#cafd00] font-bold transition-all duration-300" href="#pricing">{lang === 'uz' ? 'Narxlar' : 'Pricing'}</Link>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Language Switcher */}
          <button 
            onClick={() => setLang(lang === 'uz' ? 'en' : 'uz')}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-muted border border-border hover:border-[#cafd00]/50 transition-all group hover:bg-muted/80"
          >
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#cafd00] group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">{lang.toUpperCase()}</span>
          </button>

          <Link href="/login" className="hidden sm:inline text-muted-foreground hover:text-[#cafd00] font-bold transition-all duration-300 text-sm">
            {lang === 'uz' ? 'Kirish' : 'Sign In'}
          </Link>

          <Link href="/dashboard" className="bg-[#cafd00] text-[#516700] px-4 sm:px-8 py-2 sm:py-3 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider scale-95 active:duration-75 hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(202,253,0,0.25)]">
            {lang === 'uz' ? 'Boshlash' : 'Get Started'}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-screen flex flex-col items-center justify-center pt-16 sm:pt-20 px-4 sm:px-6 overflow-hidden">
        {/* Floating 3D Shapes */}
        <div className="absolute top-20 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-[#f3ffca]/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#fedc00]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center max-w-5xl">
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-muted border border-[#f3ffca]/20 text-[#cafd00] dark:text-[#cafd00] font-label text-xs sm:text-sm uppercase tracking-widest mb-6 sm:mb-8">
              {lang === 'uz' ? 'Ta\'lim Kelajagi' : 'The Future of Education'}
          </span>
          <h1 className="font-headline text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[1.1] text-foreground mb-6 sm:mb-10">
              {lang === 'uz' ? (
                <>O'z bilim <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cafd00] to-[#fedc00]">imperiyangizni</span> quring</>
              ) : (
                <>Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cafd00] to-[#fedc00]">knowledge empire</span></>
              )}
          </h1>
          <p className="font-body text-muted-foreground text-base sm:text-xl md:text-2xl max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              {lang === 'uz' 
                ? 'Kurslaringizni professional darajaga olib chiqing. O\'quvchilaringiz uchun eng qulay va zamonaviy ta\'lim muhitini yarating.'
                : 'Take your courses to a professional level. Create the most convenient and modern learning environment for your students.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link href="/register" className="bg-[#cafd00] text-[#516700] px-8 sm:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-xl font-extrabold shadow-[0_15px_40px_rgba(202,253,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-500 flex items-center gap-3">
                {lang === 'uz' ? 'Bepul boshlash' : 'Start Building for Free'}
                <span className="material-symbols-outlined">rocket_launch</span>
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-[#cafd00] font-bold transition-all text-sm sm:text-base">
                {lang === 'uz' ? 'Hisobingiz bormi? Kirish →' : 'Already have an account? Sign In →'}
            </Link>
          </div>
        </div>

      </section>

      {/* Bento Grid Showcase */}
      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 relative z-10">
          <div className="max-w-xl">
            <h2 className="font-headline text-5xl font-bold tracking-tight mb-4">
              {lang === 'uz' ? 'Raqamli Dunyoni Boshqaring' : 'Master the Digital Domain'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {lang === 'uz' 
                ? 'O\'z tajribangizni butun dunyo bo\'ylab tarqatish, daromad keltirish va masshtablash uchun kerak bo\'lgan barcha vositalar.'
                : 'Every tool you need to architect, monetize, and scale your expertise across the globe.'}
            </p>
          </div>
          <div className="text-[#cafd00] font-label uppercase tracking-widest text-sm font-bold border-b-2 border-[#cafd00] pb-2 cursor-pointer">
            {lang === 'uz' ? 'Barcha imkoniyatlar' : 'Explore All Features'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 h-auto md:h-[800px] relative z-10">
          {/* Course Management */}
          <div className="md:col-span-8 md:row-span-1 glass-card rounded-xl p-10 relative overflow-hidden kinetic-tilt transition-all duration-500 shadow-[0_40px_80px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f3ffca]/5 rounded-full blur-[80px] group-hover:bg-[#f3ffca]/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 bg-[#cafd00] rounded-lg flex items-center justify-center mb-8 shadow-[0_10px_30px_rgba(202,253,0,0.3)]">
                  <span className="material-symbols-outlined text-[#4a5e00]">edit_note</span>
                </div>
                <h3 className="font-headline text-3xl font-bold mb-4 text-foreground">
                  {lang === 'uz' ? 'Kurslarni oson boshqarish' : 'Easy Course Management'}
                </h3>
                <p className="text-muted-foreground max-w-sm text-lg">
                  {lang === 'uz' 
                    ? 'Kurslaringizni modullar va darslarga ajrating. Hamma narsa bir joyda va tushunarli tartibda bo\'ladi.'
                    : 'Organize your courses into modules and lessons. Everything in one place and perfectly structured.'}
                </p>
              </div>
              <div className="mt-12 flex gap-4">
                <span className="px-4 py-2 rounded-full bg-muted text-xs font-bold text-[#cafd00] border border-border uppercase tracking-wider">{lang === 'uz' ? 'Modullar' : 'Modules'}</span>
                <span className="px-4 py-2 rounded-full bg-muted text-xs font-bold text-[#cafd00] border border-border uppercase tracking-wider">{lang === 'uz' ? 'Darslar' : 'Lessons'}</span>
              </div>
            </div>
            <img alt="Interface" className="absolute -bottom-10 -right-10 w-1/2 rounded-xl opacity-20 mix-blend-screen group-hover:scale-110 transition-transform duration-700 pointer-events-none" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" />
          </div>

          {/* Student Interaction */}
          <div className="md:col-span-4 md:row-span-2 glass-card rounded-xl p-10 relative overflow-hidden kinetic-tilt transition-all duration-500 shadow-[0_40px_80px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] group border-l border-[#fedc00]/20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#fedc00]/5 rounded-full blur-[100px]"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 bg-[#fedc00] rounded-lg flex items-center justify-center mb-8 shadow-[0_10px_30px_rgba(254,220,0,0.3)]">
                <span className="material-symbols-outlined text-[#5b4e00]">group</span>
              </div>
              <h3 className="font-headline text-3xl font-bold mb-4 text-foreground">
                {lang === 'uz' ? 'O\'quvchilar bilan ishlash' : 'Student Interaction'}
              </h3>
              <p className="text-muted-foreground text-lg mb-12">
                {lang === 'uz' 
                  ? 'O\'quvchilaringiz ro\'yxatini shakllantiring va ularning kursdagi faolligini kuzating.'
                  : 'Build your student list and monitor their activity within the courses.'}
              </p>
              <div className="mt-auto space-y-4">
                <div className="bg-muted p-4 rounded-xl border border-border">
                  <div className="text-xs text-muted-foreground mb-1">{lang === 'uz' ? 'Faol o\'quvchilar' : 'Active Students'}</div>
                  <div className="text-2xl font-bold text-foreground">Real-time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Integration */}
          <div className="md:col-span-8 md:row-span-1 glass-card rounded-xl p-10 relative overflow-hidden kinetic-tilt transition-all duration-500 shadow-[0_40px_80px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] group border-t border-[#00ffcc]/10">
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#00ffcc]/5 to-transparent"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="w-14 h-14 bg-[#00ffcc] rounded-lg flex items-center justify-center mb-8 shadow-[0_10px_30px_rgba(0,255,204,0.3)]">
                  <span className="material-symbols-outlined text-[#004d3d]">play_circle</span>
                </div>
                <h3 className="font-headline text-3xl font-bold mb-4 text-foreground">
                   {lang === 'uz' ? 'Video darslar' : 'Video Lessons'}
                </h3>
                <p className="text-muted-foreground max-w-sm text-lg">
                  {lang === 'uz' 
                    ? 'YouTube platformasidagi videolaringizni to\'g\'ridan-to\'g\'ri dars sifatida ulang va ulashishni boshlang.'
                    : 'Connect your YouTube videos directly as lessons and start sharing your knowledge.'}
                </p>
              </div>
              <div className="w-full md:w-64 aspect-video rounded-xl bg-muted border border-border flex items-center justify-center group-hover:border-[#00ffcc]/40 transition-colors">
                <span className="material-symbols-outlined text-4xl opacity-20 group-hover:text-[#00ffcc] group-hover:opacity-100 transition-all">brand_awareness</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Flow */}
      <section className="py-32 px-6 relative overflow-hidden" id="workflow">
        <div className="text-center mb-20">
          <h2 className="font-headline text-5xl font-bold mb-6 text-foreground">
            {lang === 'uz' ? 'Qanday ishlaydi?' : 'How it works?'}
          </h2>
          <p className="text-muted-foreground text-xl">
            {lang === 'uz' ? 'Kurs yaratishdan to uni o\'quvchiga yetkazishgacha bo\'lgan oddiy yo\'l.' : 'A simple path from creating a course to delivering it to your students.'}
          </p>
        </div>
        <div className="max-w-6xl mx-auto relative px-10">
          {/* Glowing Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#f3ffca]/20 via-[#fedc00] to-[#f3ffca]/20 -translate-y-1/2 hidden lg:block neon-line-glow"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-card rounded-xl border border-border flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 hover:border-[#cafd00]/30 cursor-default">
                <span className="text-4xl font-black text-[#cafd00]">01</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-foreground">{lang === 'uz' ? 'Kurs yarating' : 'Create Course'}</h4>
              <p className="text-center text-muted-foreground text-sm">{lang === 'uz' ? 'O\'z kursingizni nomlang va asosiy ma\'lumotlarni to\'ldiring.' : 'Name your course and fill in the basic information.'}</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-card rounded-xl border border-border flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 hover:border-[#fedc00]/30 cursor-default">
                <span className="text-4xl font-black text-[#fedc00]">02</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-foreground">{lang === 'uz' ? 'Darslar qo\'shing' : 'Add Lessons'}</h4>
              <p className="text-center text-muted-foreground text-sm">{lang === 'uz' ? 'Modullar yarating va videolarni (YouTube orqali) ulab chiqing.' : 'Create modules and connect your videos via YouTube.'}</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-card rounded-xl border border-border flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 hover:border-[#cafd00]/30 cursor-default">
                <span className="text-4xl font-black text-[#cafd00]">03</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-foreground">{lang === 'uz' ? 'Linkni yuboring' : 'Share Link'}</h4>
              <p className="text-center text-muted-foreground text-sm">{lang === 'uz' ? 'Tayyor o\'quvchi sahifasining linkini nusxalab, bilimingizni ulashing.' : 'Copy the student link and share your knowledge.'}</p>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-card rounded-xl border border-[#f3ffca]/40 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(202,253,0,0.2)] group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 cursor-default">
                <span className="text-4xl font-black text-foreground">04</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-foreground">{lang === 'uz' ? 'Boshqaring' : 'Manage'}</h4>
              <p className="text-center text-muted-foreground text-sm">{lang === 'uz' ? 'Saytingizni rivojlantiring va o\'quvchilaringizning darslarni ko\'rishini nazorat qiling.' : 'Keep improving and monitor your student progress.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-card via-card to-[#cafd00]/10 p-16 md:p-32 relative overflow-hidden text-center border border-border shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(202, 253, 0, 0.15),transparent)]"></div>
          <div className="relative z-10">
            <h2 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-foreground">
              {lang === 'uz' ? 'O\'z bilimlaringiz bilan bo\'lishing' : 'Share your expertise with the world'}
            </h2>
            <p className="font-body text-muted-foreground text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
                {lang === 'uz' 
                  ? 'Kurslaringizni yaratishni hoziroq boshlang. Biz sizga darslaringizni eng sifatli va tushunarli tarzda o\'quvchilaringizga yetkazishingizda yordam beramiz.'
                  : 'Start building your course today. We help you deliver your knowledge in the most premium and effective way possible.'}
            </p>
            <Link href="/dashboard" className="inline-block bg-[#cafd00] text-[#516700] px-12 py-6 rounded-xl text-2xl font-black shadow-[0_20px_50px_rgba(202,253,0,0.3)] hover:scale-110 hover:-translate-y-2 active:scale-95 transition-all duration-500">
                {lang === 'uz' ? 'Boshlash' : 'Get Started'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-12 py-24 flex flex-col items-center border-t border-border bg-background rounded-t-[3rem] shadow-[0_-20px_80px_rgba(0,0,0,0.05)] dark:shadow-[0_-20px_80px_rgba(0,0,0,0.8)]">
        <div className="text-4xl font-black text-foreground mb-8">Course Architect</div>
        <div className="flex flex-wrap justify-center gap-10 mb-16 font-['Manrope'] text-sm uppercase tracking-widest font-bold">
          <Link className="text-muted-foreground hover:text-[#cafd00] transition-colors kinetic-tilt hover:translate-y-[-4px]" href="#">{lang === 'uz' ? 'Maxfiylik' : 'Privacy'}</Link>
          <Link className="text-muted-foreground hover:text-[#cafd00] transition-colors kinetic-tilt hover:translate-y-[-4px]" href="#">{lang === 'uz' ? 'Shartlar' : 'Terms'}</Link>
          <Link className="text-muted-foreground hover:text-[#cafd00] transition-colors kinetic-tilt hover:translate-y-[-4px]" href="#">Twitter</Link>
          <Link className="text-muted-foreground hover:text-[#cafd00] transition-colors kinetic-tilt hover:translate-y-[-4px]" href="#">Discord</Link>
        </div>
        <p className="text-muted-foreground font-['Manrope'] text-[10px] uppercase tracking-[0.3em] font-bold">© 2026 Course Architect. Built for the Infinite.</p>
      </footer>
    </div>
  );
}
