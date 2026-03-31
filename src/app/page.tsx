"use client";

import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";

export default function LandingPage() {
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
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-black/60 backdrop-blur-xl rounded-full mt-4 mx-auto w-[95%] max-w-7xl shadow-[0_20px_50px_rgba(202,253,0,0.15)] font-['Space_Grotesk'] tracking-tight">
        <div className="text-2xl font-bold text-white tracking-tighter">Course Architect</div>
        <div className="hidden md:flex gap-8 items-center">
          <Link className="text-[#cafd00] font-bold hover:scale-105 transition-all duration-300" href="#">Features</Link>
          <Link className="text-white/70 hover:scale-105 hover:text-[#cafd00] transition-all duration-300" href="#">Workflow</Link>
          <Link className="text-white/70 hover:scale-105 hover:text-[#cafd00] transition-all duration-300" href="#">Pricing</Link>
        </div>
        <Link href="/dashboard" className="bg-[#cafd00] text-[#516700] px-6 py-2.5 rounded-full font-bold scale-95 active:duration-75 hover:scale-105 transition-all duration-300">
            Try Now
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Floating 3D Shapes (Decorative Background) */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#f3ffca]/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#fedc00]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center max-w-5xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1f1f1f] border border-[#f3ffca]/20 text-[#cafd00] font-label text-sm uppercase tracking-widest mb-8">
              The Future of Education
          </span>
          <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-white mb-10">
              Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cafd00] to-[#fedc00]">knowledge empire</span> in 3D
          </h1>
          <p className="font-body text-[#ababab] text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Break the 2D barrier. Architect immersive, high-conversion learning experiences that defy digital gravity.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/dashboard" className="bg-[#cafd00] text-[#516700] px-10 py-5 rounded-xl text-xl font-extrabold shadow-[0_15px_40px_rgba(202,253,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-500 flex items-center gap-3">
                Start Building for Free
                <span className="material-symbols-outlined">rocket_launch</span>
            </Link>
            <button className="glass-card text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-white/10 transition-all duration-300">
                Watch Demo
            </button>
          </div>
        </div>

      </section>

      {/* Bento Grid Showcase */}
      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 relative z-10">
          <div className="max-w-xl">
            <h2 className="font-headline text-5xl font-bold tracking-tight mb-4">Master the Digital Domain</h2>
            <p className="text-[#ababab] text-lg">Every tool you need to architect, monetize, and scale your expertise across the globe.</p>
          </div>
          <div className="text-[#cafd00] font-label uppercase tracking-widest text-sm font-bold border-b-2 border-[#cafd00] pb-2">Explore All Features</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 h-auto md:h-[800px] relative z-10">
          {/* AI Curriculum */}
          <div className="md:col-span-8 md:row-span-1 glass-card rounded-xl p-10 relative overflow-hidden kinetic-tilt transition-all duration-500 shadow-[0_40px_80px_rgba(0,0,0,0.4)] group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f3ffca]/5 rounded-full blur-[80px] group-hover:bg-[#f3ffca]/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 bg-[#cafd00] rounded-lg flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-[#4a5e00]">psychology</span>
                </div>
                <h3 className="font-headline text-3xl font-bold mb-4 text-white">AI Curriculum Builder</h3>
                <p className="text-[#ababab] max-w-md text-lg">Generate entire course structures from a single prompt. Let AI handle the heavy lifting of lesson planning.</p>
              </div>
              <div className="mt-12 flex gap-4">
                <span className="px-4 py-2 rounded-full bg-[#1f1f1f] text-xs font-bold text-[#f3ffca]">SMART MODULES</span>
                <span className="px-4 py-2 rounded-full bg-[#1f1f1f] text-xs font-bold text-[#f3ffca]">AUTO-FLOW</span>
              </div>
            </div>
            <img alt="AI Interface" className="absolute -bottom-10 -right-10 w-1/2 rounded-xl opacity-40 mix-blend-screen group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6Cl7Z6EcrGPUm9yUpAsIIo8xoa6S-jLQ6Vf10bivcqGEPgHzBN0X9KfqCJQCGhYK5FPHmLHGiLOuvprq7AdJg7Kt83xEnQFgZgx-4gnfZIfrRACyWaLql--xW7JVi03OHDL_cVYOKtj78hDZ4y6TqjyilBYIzaX_HQLhFcTUPg2bbM69BlNkSPXe9yDQMsgdjrBgrJC_Dr98ExLBvTPk6QprwOoXjUNoyfwB1Nsj9zmEV7luuzyoYAVMzR_kpwKbO4xypCwf3AnE" />
          </div>

          {/* Global Monetization */}
          <div className="md:col-span-4 md:row-span-2 glass-card rounded-xl p-10 relative overflow-hidden kinetic-tilt transition-all duration-500 shadow-[0_40px_80px_rgba(0,0,0,0.4)] group border-l border-[#fedc00]/20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#fedc00]/5 rounded-full blur-[100px]"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 bg-[#fedc00] rounded-lg flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-[#5b4e00]">payments</span>
              </div>
              <h3 className="font-headline text-3xl font-bold mb-4 text-white">Global Monetization</h3>
              <p className="text-[#ababab] text-lg mb-10 leading-relaxed">Take payments in 135+ currencies including Crypto. Real-time split payments and automated tax handling across borders.</p>
              <div className="mt-auto space-y-4">
                <div className="bg-[#1f1f1f]/60 p-4 rounded-xl flex items-center justify-between border border-white/5">
                  <span className="text-sm font-bold">Monthly Revenue</span>
                  <span className="text-[#fedc00] font-black text-xl">$42,900</span>
                </div>
                <div className="bg-[#1f1f1f]/60 p-4 rounded-xl flex items-center justify-between border border-white/5">
                  <span className="text-sm font-bold">Active Students</span>
                  <span className="text-[#f3ffca] font-black text-xl">1.2k</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Lessons */}
          <div className="md:col-span-8 md:row-span-1 glass-card rounded-xl p-10 relative overflow-hidden kinetic-tilt transition-all duration-500 shadow-[0_40px_80px_rgba(0,0,0,0.4)] group border-t border-[#a8ffe1]/10">
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center h-full">
              <div className="flex-1">
                <div className="w-14 h-14 bg-[#00fcca] rounded-lg flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-[#005b47]">grid_view</span>
                </div>
                <h3 className="font-headline text-3xl font-bold mb-4 text-white">Interactive Lessons</h3>
                <p className="text-[#ababab] text-lg">Build 3D interactive environments directly in your browser. Engagement rates 4x higher than standard video.</p>
              </div>
              <div className="flex-1 w-full h-full min-h-[200px] bg-gradient-to-br from-[#1f1f1f] to-black rounded-xl border border-white/10 p-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 plasma-glow opacity-30"></div>
                <img alt="Cyber Grid" className="w-full h-full object-cover rounded-lg opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKfLNmRkQ0O5ekX_C8DYpOVFWO8ntf88t5gQF7K1xjgbOvnWkaRQ1Z9r0rDIxzXIoH4Rg6ZX6kIKcHADPv4Y2llQG_BdopClyVSz7sNissZ659wTijuCaX1vE0EEpZ-VlQXwBoRTL7BbjFl7yzcvD9mUbR3wPsO7K2NkkDjg_ZFnovEaicyLt_Sd0KkJW5FoJe6Vhcr9PlmzlWbYGDUpU7fucGr57DD3FagppQShMSc_erWizFN7lpQ28J8D7Hm6R8DTDFGHxApH0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Flow */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="text-center mb-24">
          <h2 className="font-headline text-5xl font-bold mb-6 text-white">Your Path to Legacy</h2>
          <p className="text-[#ababab] text-xl">The four pillars of building a 3D empire.</p>
        </div>
        <div className="max-w-6xl mx-auto relative px-10">
          {/* Glowing Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#f3ffca]/20 via-[#fedc00] to-[#f3ffca]/20 -translate-y-1/2 hidden lg:block neon-line-glow"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-[#000] rounded-xl border border-white/10 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500">
                <span className="text-4xl font-black text-[#cafd00]">01</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-white">Basics</h4>
              <p className="text-center text-[#ababab] text-sm">Define your niche and target persona with AI assistance.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-[#000] rounded-xl border border-white/10 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500">
                <span className="text-4xl font-black text-[#fedc00]">02</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-white">Curriculum</h4>
              <p className="text-center text-[#ababab] text-sm">Architect the learning path in our 3D workspace.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-[#000] rounded-xl border border-white/10 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500">
                <span className="text-4xl font-black text-[#cafd00]">03</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-white">Pricing</h4>
              <p className="text-center text-[#ababab] text-sm">Model your monetization strategy and tiers.</p>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-[#000] rounded-xl border border-[#f3ffca]/40 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(202,253,0,0.2)] group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500">
                <span className="text-4xl font-black text-white">04</span>
              </div>
              <h4 className="font-headline text-xl font-bold mb-3 text-white">Publish</h4>
              <p className="text-center text-[#ababab] text-sm">Launch to a global audience with 1-click scaling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-black via-[#131313] to-[#cafd00]/20 p-16 md:p-32 relative overflow-hidden text-center border border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(202,253,0,0.15),transparent)]"></div>
          <div className="relative z-10">
            <h2 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-white">Ready to launch your legacy?</h2>
            <p className="font-body text-[#ababab] text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
                Join over 15,000 course architects redefining the landscape of modern education. Your empire starts here.
            </p>
            <Link href="/dashboard" className="inline-block bg-[#cafd00] text-[#516700] px-12 py-6 rounded-xl text-2xl font-black shadow-[0_20px_50px_rgba(202,253,0,0.3)] hover:scale-110 hover:-translate-y-2 active:scale-95 transition-all duration-500">
                Go to Dashboard
            </Link>
            <div className="mt-12 text-[#ababab]/60 font-label text-sm uppercase tracking-widest">
                No Credit Card Required • Instant Setup
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-12 py-24 flex flex-col items-center border-t border-white/5 bg-[#000000] rounded-t-[3rem] shadow-[0_-20px_80px_rgba(0,0,0,0.8)]">
        <div className="text-4xl font-black text-white mb-8">Course Architect</div>
        <div className="flex flex-wrap justify-center gap-10 mb-16 font-['Manrope'] text-sm uppercase tracking-widest">
          <Link className="text-white/40 hover:text-[#cafd00] transition-colors kinetic-tilt hover:translate-y-[-4px]" href="#">Privacy</Link>
          <Link className="text-white/40 hover:text-[#cafd00] transition-colors kinetic-tilt hover:translate-y-[-4px]" href="#">Terms</Link>
          <Link className="text-white/40 hover:text-[#cafd00] transition-colors kinetic-tilt hover:translate-y-[-4px]" href="#">Twitter</Link>
          <Link className="text-white/40 hover:text-[#cafd00] transition-colors kinetic-tilt hover:translate-y-[-4px]" href="#">Discord</Link>
        </div>
        <p className="text-white/40 font-['Manrope'] text-xs uppercase tracking-[0.2em]">© 2024 Course Architect. Built in the Void.</p>
      </footer>
    </div>
  );
}
