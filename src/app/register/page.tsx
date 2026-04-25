"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(lang === 'uz' ? 'Parollar mos kelmaydi' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(lang === 'uz' ? 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Ro'yxatdan o'tish xatosi");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#000] flex font-body relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-150px] left-[-200px] w-[500px] h-[500px] bg-[#fedc00]/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-[#cafd00]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#cafd00] flex items-center justify-center shadow-[0_10px_30px_rgba(202,253,0,0.3)]">
                <span className="material-symbols-outlined text-[#516700] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tighter font-headline">Course Architect</span>
            </Link>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter font-headline">
              {lang === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Create Account'}
            </h2>
            <p className="text-[#666] text-base">
              {lang === 'uz' ? 'Yangi hisob oching va ta\'lim dunyosiga qadam qo\'ying.' : 'Create a new account and step into the world of learning.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <span className="material-symbols-outlined text-red-400 text-lg">error</span>
              <p className="text-red-400 text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555] ml-1">
                {lang === 'uz' ? 'To\'liq ism' : 'Full Name'}
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#333] group-focus-within:text-[#cafd00] transition-colors text-xl">person</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'uz' ? 'Ismingiz' : 'Your name'}
                  required
                  className="w-full bg-[#111] border-2 border-white/5 focus:border-[#cafd00]/40 text-white pl-14 pr-6 py-4 sm:py-5 rounded-2xl focus:outline-none font-bold text-base placeholder-[#333] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555] ml-1">Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#333] group-focus-within:text-[#cafd00] transition-colors text-xl">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="w-full bg-[#111] border-2 border-white/5 focus:border-[#cafd00]/40 text-white pl-14 pr-6 py-4 sm:py-5 rounded-2xl focus:outline-none font-bold text-base placeholder-[#333] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555] ml-1">
                {lang === 'uz' ? 'Parol' : 'Password'}
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#333] group-focus-within:text-[#cafd00] transition-colors text-xl">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#111] border-2 border-white/5 focus:border-[#cafd00]/40 text-white pl-14 pr-14 py-4 sm:py-5 rounded-2xl focus:outline-none font-bold text-base placeholder-[#333] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#333] hover:text-[#cafd00] transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555] ml-1">
                {lang === 'uz' ? 'Parolni tasdiqlang' : 'Confirm Password'}
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#333] group-focus-within:text-[#cafd00] transition-colors text-xl">verified_user</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#111] border-2 border-white/5 focus:border-[#cafd00]/40 text-white pl-14 pr-6 py-4 sm:py-5 rounded-2xl focus:outline-none font-bold text-base placeholder-[#333] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#cafd00] text-[#516700] py-4 sm:py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(202,253,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#516700]/30 border-t-[#516700] rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  {lang === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-[#555] text-sm">
              {lang === 'uz' ? 'Hisobingiz bormi?' : 'Already have an account?'}{' '}
              <Link href="/login" className="text-[#cafd00] font-bold hover:underline underline-offset-4 transition-all">
                {lang === 'uz' ? 'Kirish' : 'Sign In'}
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link href="/" className="text-[#333] text-xs font-bold uppercase tracking-widest hover:text-[#cafd00] transition-colors">
              ← {lang === 'uz' ? 'Bosh sahifa' : 'Home'}
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Brand (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#fedc00]/[0.03] via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex justify-end">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#cafd00] flex items-center justify-center shadow-[0_10px_30px_rgba(202,253,0,0.3)] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#516700] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter font-headline">Course Architect</span>
          </Link>
        </div>
        
        <div className="relative z-10 space-y-8 max-w-lg ml-auto text-right">
          <h1 className="text-6xl font-black text-white tracking-tighter leading-[1.1] font-headline">
            {lang === 'uz' ? (
              <>Ta'lim <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fedc00] to-[#cafd00]">kelajagi</span> siz bilan</>
            ) : (
              <>The future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fedc00] to-[#cafd00]">education</span> is you</>
            )}
          </h1>
          <p className="text-[#666] text-lg leading-relaxed">
            {lang === 'uz'
              ? 'Minglab o\'qituvchilar va o\'quvchilar Course Architect platformasini tanlamoqda.'
              : 'Thousands of instructors and students are choosing Course Architect platform.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 justify-end">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'school', label: lang === 'uz' ? 'Kurslar' : 'Courses', val: '150+' },
              { icon: 'group', label: lang === 'uz' ? 'O\'quvchilar' : 'Students', val: '12K+' },
              { icon: 'star', label: lang === 'uz' ? 'Baho' : 'Rating', val: '4.9' },
            ].map((stat) => (
              <div key={stat.icon} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center backdrop-blur-sm">
                <span className="material-symbols-outlined text-[#cafd00] text-lg mb-1 block">{stat.icon}</span>
                <p className="text-white text-lg font-black">{stat.val}</p>
                <p className="text-[#555] text-[9px] font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
