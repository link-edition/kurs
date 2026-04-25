"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/lang-context";
import { useAuth } from "@/lib/auth-context";
import { TopNav } from "@/components/TopNav";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { t, lang, setLang } = useLang();
  const { user } = useAuth();
  const [settings, setSettings] = useState<any>({ 
    two_factor: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setSettings({ ...settings, ...data });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const updated = await res.json();
        if (updated && !updated.error) setSettings(updated);
        alert(lang === 'uz' ? "Barcha sozlamalar muvaffaqiyatli saqlandi!" : "All settings saved successfully!");
      }
    } catch (error) {
      console.error(error);
      alert(lang === 'uz' ? "Xatolik yuz berdi" : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-background">
      <div className="w-12 h-12 border-4 border-[#cafd00]/20 border-t-[#cafd00] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden transition-colors duration-300">
      <TopNav />
      
      <div className="p-4 sm:p-8 lg:p-12 space-y-8 sm:space-y-12 max-w-[900px] w-full mx-auto relative z-10 font-body animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Header Section */}
        <section className="space-y-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#cafd00]/10 flex items-center justify-center text-[#cafd00] border border-[#cafd00]/20 shadow-[0_0_20px_rgba(202,253,0,0.1)]">
              <span className="material-symbols-outlined font-black">security</span>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground block mb-1">
                {lang === 'uz' ? 'Xavfsizlik Boshqaruvi' : 'Security Management'}
              </label>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none text-foreground font-headline italic uppercase">
                {lang === 'uz' ? 'XAVFSIZLIK' : 'SECURITY'}
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground text-base sm:text-xl max-w-2xl font-light leading-relaxed mx-auto sm:mx-0">
            {lang === 'uz' 
              ? 'Akkauntingiz xavfsizligini ta\'minlash va kirish ma\'lumotlarini boshqarish.'
              : 'Ensuring your account security and managing login credentials.'}
          </p>
        </section>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-card border border-border rounded-[40px] p-8 sm:p-12 space-y-12 shadow-2xl shadow-[0_10px_50px_rgba(0,0,0,0.05)] dark:shadow-none">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-foreground italic uppercase tracking-tighter leading-none">
                {lang === 'uz' ? 'Xavfsizlik va Kirish' : 'Security & Login'}
              </h3>
              <div className="h-1 w-20 bg-[#cafd00] rounded-full"></div>
            </div>

            <div className="space-y-8">
              {/* Password Change */}
              <div className="p-8 bg-muted rounded-[32px] border border-border space-y-6">
                 <div className="flex items-center gap-3 text-red-500 mb-2">
                   <span className="material-symbols-outlined">lock_reset</span>
                   <h4 className="font-black uppercase tracking-[0.2em] text-xs">Parolni Yangilash</h4>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Hozirgi Parol</label>
                     <input type="password" placeholder="********" className="w-full bg-card border border-border px-6 py-4 rounded-2xl text-foreground outline-none focus:border-[#cafd00]/50 transition-all font-mono" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Yangi Parol</label>
                     <input type="password" placeholder="********" className="w-full bg-card border border-border px-6 py-4 rounded-2xl text-foreground outline-none focus:border-[#cafd00]/50 transition-all font-mono" />
                   </div>
                 </div>
              </div>

              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-8 bg-muted rounded-[32px] border border-border group transition-all hover:border-[#cafd00]/30 shadow-inner">
                <div className="flex items-center gap-6">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500", settings.two_factor ? "bg-[#cafd00] text-[#516700]" : "bg-card text-muted-foreground")}>
                     <span className="material-symbols-outlined text-3xl">vibration</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground font-black uppercase tracking-widest text-xs">Ikki bosqichli autentifikatsiya (2FA)</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Tizimga kirishda SMS-kod so&apos;rash</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSettings({ ...settings, two_factor: !settings.two_factor })}
                  className={cn(
                    "w-14 h-8 rounded-full relative transition-all duration-500 border-2",
                    settings.two_factor ? "bg-[#cafd00] border-[#cafd00]" : "bg-background border-border"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-5 h-5 rounded-full transition-all duration-500 shadow-xl",
                    settings.two_factor ? "right-1 bg-[#516700]" : "left-1 bg-muted-foreground/30"
                  )}></div>
                </button>
              </div>

              {/* Active Sessions */}
              <div className="p-8 bg-muted rounded-[32px] border border-border space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="text-foreground font-black uppercase tracking-[0.2em] text-xs">Faol Seanslar</h4>
                     <span className="text-[10px] bg-[#cafd00]/10 text-[#cafd00] px-3 py-1 rounded-full font-black uppercase">Joriy Device</span>
                  </div>
                  <div className="flex items-center gap-4 bg-card/50 p-4 rounded-2xl border border-border/50">
                     <span className="material-symbols-outlined text-4xl text-muted-foreground">laptop_windows</span>
                     <div>
                       <p className="text-sm font-bold text-foreground tracking-tight">Windows (Chrome Browser)</p>
                       <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Oxirgi faollik: Hozir • Tashkent, Uzbekistan</p>
                     </div>
                  </div>
              </div>

              {/* Danger Zone */}
              <div className="p-8 border-2 border-red-500/20 bg-red-500/5 rounded-[32px] space-y-4">
                 <h4 className="text-red-500 font-black uppercase tracking-widest text-xs">Xavfli Hudud</h4>
                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Akkauntingizni butunlay o&apos;chirish. Barcha ma&apos;lumotlar yo&apos;qoladi.</p>
                 <button className="px-6 py-3 rounded-xl border border-red-500/50 text-red-500 text-[10px] font-black hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">AKKAUNTNI O&apos;CHIRISH</button>
              </div>
            </div>
          </div>

          {/* Global Save Button */}
          <div className="flex justify-end pt-10">
             <button 
               onClick={handleSave}
               disabled={saving}
               className="group w-full sm:w-auto relative bg-[#cafd00] text-[#516700] px-12 py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.4em] shadow-[0_30px_60px_rgba(202,253,0,0.3)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 overflow-hidden"
             >
               <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
               {saving ? (
                 <div className="w-6 h-6 border-3 border-[#516700]/20 border-t-[#516700] rounded-full animate-spin"></div>
               ) : (
                 <>
                   <span className="material-symbols-outlined font-black">verified_user</span>
                   {lang === 'uz' ? 'O\'ZGARISHLARNI SAQLASH' : 'SAVE CHANGES'}
                 </>
               )}
             </button>
          </div>
        </div>
      </div>
      <div className="fixed -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-[#cafd00]/5 rounded-full blur-[200px] pointer-events-none -z-10 animate-pulse"></div>
    </div>
  );
}
