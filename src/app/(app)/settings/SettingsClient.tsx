"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/lang-context";
import { TopNav } from "@/components/TopNav";

export function SettingsClient() {
  const { t, lang, setLang } = useLang();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
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
        // Success notification or reload
        const updated = await res.json();
        setSettings(updated);
        alert("Sozlamalar saqlandi!");
      }
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, academy_logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-2 border-[#cafd00]/20 border-t-[#cafd00] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <>
      <TopNav />
      <div className="p-12 space-y-12 max-w-[1000px] w-full mx-auto relative z-10 font-body">
        <section className="space-y-4">
          <label className="text-[10px] items-center gap-2 uppercase tracking-[0.3em] font-black text-[#fedc00] mb-2 flex font-headline">
            <span className="material-symbols-outlined text-sm">settings</span> 
            Nazorat Paneli
          </label>
          <h2 className="text-6xl font-bold tracking-tighter leading-none text-white font-headline">SOZLAMALAR.</h2>
          <p className="text-[#919191] text-lg max-w-2xl font-light">
            Platformaning tashqi ko'rinishi, to'lovlar va profil ma'lumotlarini shu yerdan boshqaring.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Navigation Sidebar (Mini) */}
          <div className="md:col-span-3 space-y-2">
             <button className="w-full text-left px-6 py-4 rounded-2xl bg-[#cafd00] text-black font-black text-xs uppercase tracking-widest shadow-lg">Umumiy</button>
             <button className="w-full text-left px-6 py-4 rounded-2xl text-[#666] hover:text-white transition-all font-black text-xs uppercase tracking-widest">To'lovlar</button>
             <button className="w-full text-left px-6 py-4 rounded-2xl text-[#666] hover:text-white transition-all font-black text-xs uppercase tracking-widest">Xavfsizlik</button>
          </div>

          {/* Form Content */}
          <div className="md:col-span-9 space-y-12">
            
            {/* Academy Branding */}
            <div className="bg-[#111] border border-[#cafd00]/10 rounded-[40px] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <span className="material-symbols-outlined text-9xl text-[#cafd00]">architecture</span>
                </div>

                <div className="space-y-6 relative z-10">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Akademiya Brandingi.</h3>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {/* Logo Section */}
                    <div className="flex items-center gap-8">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 rounded-[32px] bg-black border-2 border-dashed border-[#cafd00]/20 flex items-center justify-center cursor-pointer hover:border-[#cafd00] transition-all overflow-hidden group shadow-inner"
                      >
                       {settings.academy_logo ? (
                         <img src={settings.academy_logo} className="w-full h-full object-contain p-2" />
                       ) : (
                         <span className="material-symbols-outlined text-3xl text-[#333] group-hover:text-[#cafd00] transition-colors">add_photo_alternate</span>
                       )}
                       <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white font-bold tracking-tight">Akademiya logotipi</h4>
                        <p className="text-[#666] text-xs max-w-xs">Tavsiya etilgan o'lcham 500x500px (PNG yoki SVG). Bu logotip sayt tepasida ko'rinadi.</p>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[10px] font-black text-[#cafd00] uppercase tracking-widest hover:underline"
                        >
                          Rasm tanlash
                        </button>
                      </div>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#666]">Akademiya nomi</label>
                      <input 
                        type="text" 
                        value={settings.academy_name}
                        onChange={(e) => setSettings({ ...settings, academy_name: e.target.value })}
                        className="w-full bg-black/50 border-none px-6 py-4 rounded-2xl text-white font-bold focus:ring-2 focus:ring-[#cafd00]/50 transition-all text-lg placeholder-[#333]"
                        placeholder="Masalan: Web Academy"
                      />
                    </div>
                  </div>
                </div>
            </div>

            {/* General Settings */}
            <div className="bg-[#111] border border-white/5 rounded-[40px] p-10 space-y-10 shadow-xl">
               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Tizim va Valyuta.</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#666]">Standard Valyuta</label>
                    <select 
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      className="w-full bg-black/50 border-none px-6 py-4 rounded-2xl text-white font-bold focus:ring-2 focus:ring-[#cafd00]/50 transition-all"
                    >
                      <option value="USD">AQSH Dollari ($)</option>
                      <option value="UZS">O'zbek So'mi (so'm)</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#666]">Interfeys tili</label>
                    <select 
                      value={lang}
                      onChange={(e) => setLang(e.target.value as 'uz' | 'en')}
                      className="w-full bg-black/50 border-none px-6 py-4 rounded-2xl text-white font-bold focus:ring-2 focus:ring-[#cafd00]/50 transition-all"
                    >
                      <option value="uz">O'zbekcha</option>
                      <option value="en">English</option>
                    </select>
                 </div>
               </div>
            </div>

            {/* Save Button Container */}
            <div className="flex justify-end pt-8">
               <button 
                 onClick={handleSave}
                 disabled={saving}
                 className="bg-[#cafd00] text-black px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(202,253,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
               >
                 {saving ? (
                   <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                 ) : (
                   <>
                    <span className="material-symbols-outlined text-xl">verified</span>
                    Saqlash
                   </>
                 )}
               </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
