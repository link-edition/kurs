"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { useAuth } from "@/lib/auth-context";

export default function MembersPage() {
  const { t, lang } = useLang();
  const { user } = useAuth();

  const members = [
    { id: 1, name: user?.name || "Admin", email: user?.email || "admin@coursearchitect.io", role: lang === 'uz' ? "Asoschisi" : "Owner", status: lang === 'uz' ? "Faol" : "Active", joined: "2026-01-15" },
  ];

  return (
    <div className="p-4 sm:p-8 lg:p-12 space-y-8 sm:space-y-12 max-w-[1400px] w-full mx-auto relative z-10 font-body transition-colors duration-300">
      <header className="space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground font-headline tracking-tighter uppercase italic">{t("membersTitle")}</h1>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl font-light">
          {t("membersDesc")}
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#a58d00] dark:text-[#cafd00] mb-1 opacity-60">{t("totalMembers")}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground font-headline italic uppercase italic">{members.length}</h3>
        </div>
        <div className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#a58d00] dark:text-[#cafd00] mb-1 opacity-60">{t("activeNow")}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground font-headline italic uppercase italic">1</h3>
        </div>
        <div className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#a58d00] dark:text-[#cafd00] mb-1 opacity-60">{t("invitesSent")}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground font-headline italic uppercase italic">0</h3>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h4 className="text-lg sm:text-xl font-black tracking-tight text-foreground font-headline uppercase italic">{t("teamMembers")}</h4>
          <button className="bg-[#cafd00] text-[#516700] px-4 sm:px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 shrink-0 font-headline">
            <span className="material-symbols-outlined text-sm font-black">person_add</span>
            {t("inviteMember")}
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t("name")}</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t("email")}</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t("role")}</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t("status")}</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">{t("joined")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#cafd00] text-[#516700] flex items-center justify-center text-[10px] font-black border border-border">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-foreground font-headline uppercase italic">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5"><span className="text-sm text-muted-foreground font-medium">{member.email}</span></td>
                  <td className="px-6 py-5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#516700] bg-[#cafd00] px-2.5 py-1 rounded-full border border-[#cafd00]/20 font-headline italic">{member.role}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs text-emerald-500 font-black uppercase tracking-widest font-headline italic">{member.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right"><span className="text-sm text-muted-foreground/40 font-mono italic">{new Date(member.joined).toLocaleDateString()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {members.map((member) => (
            <div key={member.id} className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#cafd00] text-[#516700] flex items-center justify-center text-[10px] font-black border border-border">
                  {member.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-black text-foreground font-headline italic uppercase">{member.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#516700] bg-[#cafd00] px-2.5 py-1 rounded-full border border-[#cafd00]/20 font-headline italic">{member.role}</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-emerald-500 font-black uppercase tracking-widest font-headline italic">{member.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 border border-dashed border-border rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-sm">
        <span className="material-symbols-outlined text-3xl sm:text-4xl text-muted-foreground/20 block mb-3">lock</span>
        <h3 className="text-base sm:text-lg font-black text-foreground mb-2 font-headline uppercase italic">{t("authSoon")}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">{t("authDesc")}</p>
        <Link href="/login" className="inline-flex items-center gap-2 mt-4 text-[#a58d00] dark:text-[#cafd00] text-xs font-black uppercase tracking-widest hover:underline underline-offset-4 font-headline">
          <span className="material-symbols-outlined text-sm font-black">login</span>
          {lang === 'uz' ? 'Tizimga kirish' : 'Sign In'}
        </Link>
      </section>
    </div>
  );
}
