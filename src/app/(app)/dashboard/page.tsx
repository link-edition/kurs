"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      {/* TopNavBar */}
      <header className="bg-black/80 backdrop-blur-xl text-white font-body text-sm font-medium tracking-tight sticky z-40 flex items-center justify-between h-16 w-full px-8 border-b border-[#cafd00]/5">
        <div className="flex items-center gap-8">
          <span className="text-lg font-bold tracking-tight font-headline">Course Builder</span>
          <nav className="flex gap-6">
            <Link className="text-[#cafd00] border-b-2 border-[#cafd00] pb-1 font-bold" href="#">Analytics</Link>
            <Link className="text-[#919191] hover:text-white transition-colors" href="#">Library</Link>
            <Link className="text-[#919191] hover:text-white transition-colors" href="#">Members</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="material-symbols-outlined text-[#919191] group-hover:text-[#cafd00] cursor-pointer transition-colors">search</span>
          </div>
          <div className="relative group">
            <span className="material-symbols-outlined text-[#919191] group-hover:text-[#cafd00] cursor-pointer transition-colors">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#fedc00] rounded-full"></span>
          </div>
          <img alt="User Avatar" className="w-8 h-8 rounded-full border border-[rgba(202,253,0,0.1)] grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9lojRLDMO8kPM-98ZWrcznU8m5iUKyupx0UFVgwSDOtOlQxMYsWnLPWP57sfDpK3kVllmFOJb5Ghv-0rfBQSHUoSkaPjg6zQD8tl2Rsch-pwx0iCxguzsG_EUjdFxiFPuAKkS4h2c9Mb6rWj1PWwwL46WmwSxLunpMA6aeqjUKMCDl2to4kwJUCmHt0DBQG69sbPHKrAAi-qPtAUG4XGnYA1w4--YViAUVOJb7K61QE5q1avYRgyMD_LpREyq3TPRyTktO-B-U8E"/>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-12 space-y-16 max-w-[1400px] w-full mx-auto relative z-10">
        <section className="space-y-2">
          <h2 className="text-6xl font-bold tracking-tighter leading-none text-white font-headline">Dashboard</h2>
          <p className="text-[#919191] text-lg max-w-2xl font-light">
            Welcome back, Alex. Your courses generated <span className="text-[#cafd00] font-bold">14% more revenue</span> this month.
          </p>
        </section>

        {/* Info Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-500 cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#cafd00]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#cafd00]">payments</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#cafd00] bg-[#cafd00]/10 px-3 py-1 rounded-full border border-[#cafd00]/20"> +12.4% </span>
            </div>
            <p className="text-[#fedc00] text-xs font-bold uppercase tracking-[0.2em] mb-1">Total Revenue ($)</p>
            <h3 className="text-4xl font-bold tracking-tight text-white font-headline">$124,592</h3>
          </div>

          <div className="bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-500 cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#cafd00]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#cafd00]">group</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#cafd00] bg-[#cafd00]/10 px-3 py-1 rounded-full border border-[#cafd00]/20"> +5.2% </span>
            </div>
            <p className="text-[#fedc00] text-xs font-bold uppercase tracking-[0.2em] mb-1">Active Students</p>
            <h3 className="text-4xl font-bold tracking-tight text-white font-headline">12,840</h3>
          </div>

          <div className="bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-500 cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#cafd00]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#cafd00]">menu_book</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#919191] bg-white/5 px-3 py-1 rounded-full border border-white/10"> Stable </span>
            </div>
            <p className="text-[#fedc00] text-xs font-bold uppercase tracking-[0.2em] mb-1">Courses Created</p>
            <h3 className="text-4xl font-bold tracking-tight text-white font-headline">42</h3>
          </div>
        </section>

        {/* Chart Section */}
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold tracking-tight text-white font-headline">Revenue Performance</h4>
              <p className="text-[#919191] text-sm">30-day sales distribution and engagement metrics</p>
            </div>
            <div className="flex gap-2 bg-[#121212] p-1 rounded-full border border-[rgba(202,253,0,0.1)]">
              <button className="px-6 py-2 bg-[#cafd00] text-[#516700] rounded-full text-xs font-bold">30 Days</button>
              <button className="px-6 py-2 hover:text-white rounded-full text-xs font-bold text-[#919191] transition-colors">90 Days</button>
            </div>
          </div>
          <div className="w-full h-[400px] bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] rounded-2xl p-8 relative overflow-hidden">
            <svg className="w-full h-full preserve-3d" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#cafd00" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#cafd00" stopOpacity="0"></stop>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#cafd00"></stop>
                  <stop offset="100%" stopColor="#fedc00"></stop>
                </linearGradient>
              </defs>
              <line stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
              <line stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150"></line>
              <line stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250"></line>
              <path d="M0,250 L0,200 C100,180 150,220 250,150 C350,80 450,120 550,60 C650,0 750,180 850,120 C950,60 1000,80 1000,80 L1000,250 Z" fill="url(#chartGradient)"></path>
              <path d="M0,200 C100,180 150,220 250,150 C350,80 450,120 550,60 C650,0 750,180 850,120 C950,60 1000,80 1000,80" fill="none" stroke="url(#lineGradient)" strokeLinecap="round" strokeWidth="4"></path>
            </svg>
            <div className="absolute bottom-4 left-8 right-8 flex justify-between text-[10px] font-bold text-[#919191] uppercase tracking-widest">
              <span>Sep 12</span><span>Sep 19</span><span>Sep 26</span><span>Oct 03</span><span>Oct 10</span><span>Oct 12</span>
            </div>
          </div>
        </section>

        {/* Recent Purchases */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-bold tracking-tight text-white font-headline">Recent Purchases</h4>
            <button className="text-sm font-bold text-[#cafd00] flex items-center gap-2 group border border-[#cafd00]/20 px-4 py-2 rounded-full hover:bg-[#cafd00]/10 transition-all">
              View All Activity
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_right_alt</span>
            </button>
          </div>
          <div className="bg-[#262626]/40 backdrop-blur-[20px] border border-[#cafd00]/[0.05] rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#cafd00]/5">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fedc00]">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fedc00]">Course Name</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fedc00] text-right">Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fedc00] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { initials: "JB", name: "julian.b@example.com", course: "Mastering Obsidian Design", date: "Oct 12, 2023", amount: "$199.00" },
                  { initials: "SL", name: "sara.lee@motion.io", course: "Advanced Framer Motion", date: "Oct 11, 2023", amount: "$249.00" },
                  { initials: "MK", name: "m.kramer@design.com", course: "UI System Architecture", date: "Oct 11, 2023", amount: "$399.00" },
                  { initials: "EP", name: "elena.p@webflow.com", course: "Mastering Obsidian Design", date: "Oct 10, 2023", amount: "$199.00" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#cafd00]/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#333333] border border-[rgba(202,253,0,0.1)] flex items-center justify-center text-[10px] font-bold text-[#cafd00]">
                          {row.initials}
                        </div>
                        <span className="text-sm font-medium text-white">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6"><span className="text-sm text-[#919191]">{row.course}</span></td>
                    <td className="px-8 py-6 text-right"><span className="text-sm text-[#919191]">{row.date}</span></td>
                    <td className="px-8 py-6 text-right"><span className="text-sm font-bold text-[#cafd00]">{row.amount}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="mt-24 px-12 py-12 border-t border-[#cafd00]/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#919191]/50 relative z-10 w-full">
        <span>© 2023 Obsidian kinetic precision systems</span>
        <div className="flex gap-8">
          <Link className="hover:text-[#cafd00] transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-[#cafd00] transition-colors" href="#">Service Status</Link>
        </div>
      </footer>
    </>
  );
}
