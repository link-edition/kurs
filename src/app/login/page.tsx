"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Kirish xatosi");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#000] flex font-body relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-[#cafd00]/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#fedc00]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Left Side - Brand (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#cafd00]/[0.03] via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#cafd00] flex items-center justify-center shadow-[0_10px_30px_rgba(202,253,0,0.3)] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#516700] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter font-headline">Course Architect</span>
          </Link>
        </div>
        
        <div className="relative z-10 space-y-8 max-w-lg">
          <h1 className="text-6xl font-black text-white tracking-tighter leading-[1.1] font-headline">
            {lang === 'uz' ? (
              <>Bilimlaringizni <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cafd00] to-[#fedc00]">ulashing</span></>
            ) : (
              <>Share your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cafd00] to-[#fedc00]">knowledge</span></>
            )}
          </h1>
          <p className="text-[#666] text-lg leading-relaxed">
            {lang === 'uz' 
              ? 'Professional kurslar yarating, o\'quvchilaringiz bilan bog\'laning va bilimingizni dunyoga tarqating.'
              : 'Create professional courses, connect with your students and share your knowledge with the world.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex -space-x-3">
            {['#cafd00', '#fedc00', '#00ffcc', '#8b5cf6'].map((color, i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-black text-black" style={{ backgroundColor: color }}>
                {['JD', 'AK', 'MR', 'LN'][i]}
              </div>
            ))}
          </div>
          <p className="text-[#555] text-sm font-bold">
            {lang === 'uz' ? '2,500+ o\'qituvchilar ishonadi' : 'Trusted by 2,500+ instructors'}
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
              {lang === 'uz' ? 'Kirish' : 'Sign In'}
            </h2>
            <p className="text-[#666] text-base">
              {lang === 'uz' ? 'Hisobingizga kiring va kurslaringizni boshqaring.' : 'Sign in to your account and manage your courses.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <span className="material-symbols-outlined text-red-400 text-lg">error</span>
              <p className="text-red-400 text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#cafd00] text-[#516700] py-4 sm:py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(202,253,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#516700]/30 border-t-[#516700] rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  {lang === 'uz' ? 'Kirish' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-[#555] text-sm">
              {lang === 'uz' ? 'Hisobingiz yo\'qmi?' : 'Don\'t have an account?'}{' '}
              <Link href="/register" className="text-[#cafd00] font-bold hover:underline underline-offset-4 transition-all">
                {lang === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Sign Up'}
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
    </div>
  );
}
