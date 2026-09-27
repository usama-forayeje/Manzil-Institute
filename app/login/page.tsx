'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { signInWithGoogle } from '@/lib/auth/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const retryParam = searchParams.get('retry');

    if (errorParam) {
      switch (errorParam) {
        case 'invalid_grant':
          setError(retryParam === 'true'
            ? 'আপনার লগইন অনুরোধের সময় অতিরিক্ত দেরি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'লগইন প্রক্রিয়ায় ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          );
          break;
        case 'auth_failed':
          setError('প্রমাণীকরণ ব্যর্থ হয়েছে। অনুগ্রহ করে আপনার Google অ্যাকাউন্ট চেক করে আবার চেষ্টা করুন।');
          break;
        case 'callback_failed':
          setError('লগইন প্রক্রিয়া সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
          break;
        case 'missing_params':
          setError('লগইন প্রক্রিয়ায় প্রয়োজনীয় তথ্য অনুপস্থিত। অনুগ্রহ করে আবার চেষ্টা করুন।');
          break;
        case 'oauth_failed':
          setError('Google OAuth প্রক্রিয়ায় ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
          break;
        default:
          setError('লগইন করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    try {
      const res = await signInWithGoogle();
      if (res?.success && res.url) {
        window.location.href = res.url;
      } else {
        setError(
          res?.error || 'লগইন প্রক্রিয়া শুরু করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
        );
        setIsLoading(false);
      }
    } catch (error: any) {
      setError(
        error?.message || 'লগইন প্রক্রিয়া শুরু করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
      );
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleGoogleLogin();
  };

  return (
    <>
      <style>{`
        @keyframes glowing-particle {
          0%   { transform: translate(0,0) scale(1); opacity: 0.5; }
          33%  { transform: translate(10px,-20px) scale(1.4); opacity: 0.9; }
          66%  { transform: translate(-8px,-12px) scale(0.8); opacity: 0.4; }
          100% { transform: translate(0,0) scale(1); opacity: 0.5; }
        }
        @keyframes float-shape {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-12px) rotate(4deg); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .animate-particle { animation: glowing-particle 5s ease-in-out infinite; }
        .animate-float    { animation: float-shape 7s ease-in-out infinite; }
        .animate-fade-up  { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      <div className="h-dvh w-screen flex flex-col lg:flex-row overflow-hidden bg-white">
        {/* =========================================================
            LEFT PANEL - branding (Deep Blue / Cyan theme)
            ========================================================= */}
        <div className="relative overflow-hidden bg-[#041222] h-56 shrink-0 lg:h-full lg:w-[52%] lg:shrink-0">
          {/* Layered gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#00315a_0%,#041222_60%)]" />

          {/* Blobs */}
          <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-[#00AEEF]/25 blur-[90px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 rounded-full bg-[#0088cc]/20 blur-[80px]" />
          <div className="absolute top-1/3 left-1/3 w-1/2 h-1/2 rounded-full bg-[#00AEEF]/10 blur-[60px]" />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.9) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Particles (Desktop only) */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {[
              { top: "15%", left: "20%", d: "0s", s: "w-1.5 h-1.5" },
              { top: "30%", left: "65%", d: "1.2s", s: "w-1 h-1" },
              { top: "50%", left: "15%", d: "2.4s", s: "w-2 h-2" },
              { top: "60%", left: "80%", d: "0.8s", s: "w-1 h-1" },
              { top: "75%", left: "45%", d: "2.0s", s: "w-1.5 h-1.5" },
              { top: "25%", left: "85%", d: "0.5s", s: "w-1 h-1" },
              { top: "85%", left: "75%", d: "2.8s", s: "w-2 h-2" },
              { top: "40%", left: "55%", d: "1.7s", s: "w-1 h-1" },
            ].map((p, i) => (
              <span
                key={i}
                className={`absolute ${p.s} rounded-full bg-[#00AEEF] animate-particle`}
                style={{ top: p.top, left: p.left, animationDelay: p.d, boxShadow: '0 0 10px #00AEEF' }}
              />
            ))}

            {/* Glowing outlines / geometric accents */}
            {[
              { top: "10%", right: "15%", rot: "15deg", w: 70, op: 0.1 },
              { bottom: "18%", left: "10%", rot: "-15deg", w: 90, op: 0.08 },
              { top: "60%", right: "8%", rot: "45deg", w: 50, op: 0.06 },
            ].map((l, i) => (
              <svg
                key={i}
                className="absolute animate-float"
                style={{
                  top: l.top,
                  right: l.right,
                  bottom: l.bottom,
                  left: l.left,
                  width: l.w,
                  height: l.w,
                  opacity: l.op,
                  color: "#00AEEF",
                  transform: `rotate(${l.rot})`,
                  animationDelay: `${i * 1.5}s`,
                }}
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polygon points="50 5, 95 30, 95 70, 50 95, 5 70, 5 30" />
                <polygon points="50 15, 85 35, 85 65, 50 85, 15 65, 15 35" opacity="0.4"/>
              </svg>
            ))}
          </div>

          <div className="relative z-10 h-full flex flex-col px-6 py-5 lg:px-14 lg:py-12 justify-between">
            {/* Dual Logos for Collaboration */}
            <div className="flex items-center justify-center lg:justify-start gap-3.5">
              <Link href="/" className="inline-block transition-transform hover:-translate-y-0.5 duration-300">
                <Image
                  src="/manzil-logo/manzil-gorup-logo-dark.webp"
                  alt="Manzil Group"
                  width={140}
                  height={35}
                  className="h-7 lg:h-8 w-auto object-contain opacity-90 drop-shadow-md"
                  priority
                />
              </Link>
              <div className="flex items-center justify-center w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-white/10 backdrop-blur-md shadow-sm ring-1 ring-[#00AEEF]/40 border border-white/5">
                <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <Link href="/" className="inline-block transition-transform hover:-translate-y-0.5 duration-300">
                <Image
                  src="/manzil-logo/manzil-institute-logo-dark.webp"
                  alt="Manzil Institute Logo"
                  width={160}
                  height={40}
                  className="h-8 lg:h-10 w-auto object-contain drop-shadow-md"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Hero Text */}
            <div className="hidden lg:block space-y-8">
              {/* Arabic watermark */}
              <p
                className="text-[90px] font-bold leading-none text-[#00AEEF]/5 select-none -ml-3"
                dir="rtl"
                style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
              >
                مَنْزِل
              </p>

              <div className="-mt-10">
                <h1 
                  className="text-5xl xl:text-[64px] font-extrabold text-white leading-[1.1] tracking-tight"
                  style={{ fontFamily: "'Kalpurush', sans-serif" }}
                >
                  মানযিল <br />
                  ইনস্টিটিউট
                </h1>
                <p 
                  className="text-cyan-100/70 text-[16px] mt-6 leading-relaxed max-w-sm"
                  style={{ fontFamily: "'Kalpurush', sans-serif" }}
                >
                  বিশ্বমানের শিক্ষা · আদর্শ জীবন · আগামীর প্রতিশ্রুতি
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-3">
                {[
                  { num: "২০০+", label: "শিক্ষার্থী" },
                  { num: "২৫+", label: "শিক্ষক" },
                  { num: "২০১৯", label: "প্রতিষ্ঠিত" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Kalpurush', sans-serif" }}>{s.num}</p>
                    <p className="text-[12px] text-[#00AEEF] font-bold mt-1 uppercase tracking-wider" style={{ fontFamily: "'Kalpurush', sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Feature List */}
            <div className="hidden lg:flex flex-col gap-3.5">
              {[
                { icon: "🎓", text: "হিফজ, আলেম এবং জেনারেল শিক্ষা" },
                { icon: "🏫", text: "স্মার্ট ক্লাসরুম ও উন্নত আবাসিক সুবিধা" },
                { icon: "💻", text: "কম্পিউটার ল্যাব এবং টেকনিক্যাল ট্রেনিং" },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#00315a]/50 border border-[#00AEEF]/30 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,174,239,0.15)] shrink-0">
                    {f.icon}
                  </div>
                  <p className="text-sm text-cyan-50/80 tracking-wide" style={{ fontFamily: "'Kalpurush', sans-serif" }}>{f.text}</p>
                </div>
              ))}
            </div>

            {/* Mobile simplified header */}
            <div className="lg:hidden flex-1 flex flex-col items-center justify-center -mt-2">
              <div className="text-center">
                <h1 className="text-[26px] font-bold text-white tracking-wide" style={{ fontFamily: "'Kalpurush', sans-serif" }}>মানযিল ইনস্টিটিউট</h1>
                <p className="text-[#00AEEF] text-[13px] font-semibold mt-1" style={{ fontFamily: "'Kalpurush', sans-serif" }}>শিক্ষার্থী ও অভিভাবক পোর্টাল</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT PANEL - Login Form
            ========================================================= */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-[#fafcff] px-6 py-8 lg:px-12">
          {/* Subtle backgrounds */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#e0f4ff_0%,transparent_60%)] opacity-70" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: "radial-gradient(circle,#00AEEF 1.5px,transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Corner graphic */}
          <div className="absolute bottom-0 right-0 w-40 h-40 lg:w-64 lg:h-64 bg-blue-50/60 rounded-tl-[100px] border-t border-l border-blue-100/40" />

          <div className="relative z-10 w-full max-w-95 animate-fade-up">
            {/* Header */}
            <div className="mb-8 lg:mb-10">
              <div className="inline-flex items-center gap-2.5 bg-[#eaf8ff] border border-[#00AEEF]/20 px-3.5 py-1.5 rounded-full mb-5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#00AEEF] animate-pulse shadow-[0_0_8px_#00AEEF]" />
                <span className="text-[11px] font-bold text-[#007cb0] tracking-widest uppercase">
                  পোর্টাল এক্সেস
                </span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0a192f] tracking-tight mb-3" style={{ fontFamily: "'Kalpurush', sans-serif" }}>
                স্বাগতম! 👋
              </h2>
              <p className="text-[#4b6a82] text-sm lg:text-[15px] leading-relaxed" style={{ fontFamily: "'Kalpurush', sans-serif" }}>
                আপনার স্টুডেন্ট ড্যাশবোর্ড উপভোগ করতে 
                <br className="hidden sm:block" />
                Google অ্যাকাউন্ট দিয়ে লগইন করুন।
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 animate-fade-up">
                <div className="flex items-start gap-3.5">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1" style={{ fontFamily: "'Kalpurush', sans-serif" }}>
                    <p className="text-sm font-semibold text-red-800 mb-1">লগইন ত্রুটি</p>
                    <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                    {error.includes('আবার চেষ্টা করুন') && (
                      <button
                        onClick={handleRetry}
                        className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-lg transition-colors duration-200"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        আবার চেষ্টা করুন
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-[#0a192f] font-semibold py-3.5 px-5 rounded-2xl border-[1.5px] border-[#e2e8f0] hover:border-[#00AEEF]/50 hover:bg-[#f8fcff] transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,174,239,0.15)] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#00AEEF]" />
              ) : (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              <span className="text-[15px]" style={{ fontFamily: "'Kalpurush', sans-serif" }}>
                {isLoading ? 'লগইন হচ্ছে...' : 'Google দিয়ে লগইন করুন'}
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7 text-center">
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
              <span className="text-[11px] text-[#8ca3b8] font-bold tracking-widest uppercase" style={{ fontFamily: "'Kalpurush', sans-serif" }}>অথবা</span>
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            {/* Info Box */}
            <div className="bg-[#fff9ed] border border-[#ffecd1] rounded-2xl p-4 lg:p-4.5 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#ffefe0] flex items-center justify-center shrink-0 shadow-inner">
                  <svg className="w-5 h-5 text-[#e07a30]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="pt-0.5" style={{ fontFamily: "'Kalpurush', sans-serif" }}>
                  <p className="text-[13px] font-bold text-[#b85b14] mb-1">প্রবেশাধিকার নিয়ন্ত্রিত</p>
                  <p className="text-[13px] text-[#c97534] leading-relaxed font-medium">
                    এই পোর্টালে শুধুমাত্র নিবন্ধিত শিক্ষার্থী ও শিক্ষকরা প্রবেশ করতে পারবেন।
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center space-y-4" style={{ fontFamily: "'Kalpurush', sans-serif" }}>
              <Link href="/" className="inline-block text-[13px] font-semibold text-[#00AEEF] hover:text-[#0088cc] hover:underline transition-all">
                &larr; মূল ওয়েবসাইটে ফিরে যান
              </Link>
              <p className="text-[11px] text-[#8ca3b8] leading-relaxed max-w-70 mx-auto">
                লগইন করার মাধ্যমে আপনি আমাদের <Link href="#" className="text-[#4b6a82] font-semibold hover:text-[#00AEEF]">শর্তাবলী</Link> ও <Link href="#" className="text-[#4b6a82] font-semibold hover:text-[#00AEEF]">গোপনীয়তা নীতিতে</Link> সম্মত হচ্ছেন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
