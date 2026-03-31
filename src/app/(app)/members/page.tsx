import Link from "next/link";

export default function MembersPage() {
  const members = [
    { id: 1, name: "Admin", email: "admin@coursearchitect.io", role: "Asoschisi", status: "Faol", joined: "2026-01-15" },
  ];

  return (
    <div className="p-12 space-y-12 max-w-[1400px] w-full mx-auto relative z-10">
      <header className="space-y-4">
        <h1 className="text-5xl font-bold text-white font-headline tracking-tighter">A&apos;zolar</h1>
        <p className="text-[#919191] text-lg max-w-2xl font-light">
          Jamoa a&apos;zolari, o&apos;qituvchilar va o&apos;quvchilarni boshqaring.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#262626]/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#cafd00]/50 mb-1">Jami a&apos;zolar</p>
          <h3 className="text-3xl font-bold text-white">{members.length}</h3>
        </div>
        <div className="bg-[#262626]/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#cafd00]/50 mb-1">Hozir faol</p>
          <h3 className="text-3xl font-bold text-white">1</h3>
        </div>
        <div className="bg-[#262626]/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#cafd00]/50 mb-1">Yuborilgan takliflar</p>
          <h3 className="text-3xl font-bold text-white">0</h3>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-bold tracking-tight text-white font-headline">Jamoa a&apos;zolari</h4>
          <button className="bg-[#cafd00] text-black px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person_add</span>
            Taklif yuborish
          </button>
        </div>
        <div className="bg-[#262626]/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#cafd00]/5">
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#fedc00]">Ism</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#fedc00]">Email</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#fedc00]">Lavozim</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#fedc00]">Holat</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#fedc00] text-right">Qo&apos;shilgan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#cafd00]/10 flex items-center justify-center text-[10px] font-bold text-[#cafd00] border border-[#cafd00]/20">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5"><span className="text-sm text-[#919191]">{member.email}</span></td>
                  <td className="px-6 py-5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#cafd00] bg-[#cafd00]/10 px-2.5 py-1 rounded-full border border-[#cafd00]/20">{member.role}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span className="text-xs text-emerald-400 font-medium">{member.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right"><span className="text-sm text-[#666]">{new Date(member.joined).toLocaleDateString()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-[#111] border border-dashed border-white/5 rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <span className="material-symbols-outlined text-4xl text-[#333] block mb-3">lock</span>
        <h3 className="text-lg font-bold text-white mb-2">Autentifikatsiya tez orada</h3>
        <p className="text-sm text-[#666] leading-relaxed">A&apos;zolarni to&apos;liq boshqarish autentifikatsiya (Clerk/NextAuth) integratsiya qilinganidan so&apos;ng ishga tushadi.</p>
      </section>
    </div>
  );
}
