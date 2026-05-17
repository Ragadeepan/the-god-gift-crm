"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import {
  Phone, User, Instagram, CheckCircle2,
  Sparkles, Gift, MessageCircle, Zap, Heart,
  Loader2, ChevronRight, X, Send, Star, TrendingUp,
  ThumbsUp, Eye, Users
} from "lucide-react";
import { customerApi } from "@/services/api";
import { isValidWhatsAppNumber, isValidInstagramUrl } from "@/lib/utils";

type Step = "phone" | "details" | "done";
type PopupType = "existing" | "success" | null;

// ─── Offer Badge ─────────────────────────────────────────────────────────────
function OfferBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${color}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// ─── Existing Customer Popup ──────────────────────────────────────────────────
function ExistingPopup({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div
        className="relative w-full max-w-sm animate-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          {/* Gradient header */}
          <div className="relative px-6 pt-8 pb-6 text-center"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            {/* Close btn */}
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Avatar with sparkle */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
                <Heart className="w-9 h-9 text-white" fill="white" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Star className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
            </div>
            <h2 className="text-xl font-black text-white">வணக்கம், {name}!</h2>
            <p className="text-white/80 text-sm mt-1 font-medium">⭐ Existing VIP Member</p>
          </div>

          <div className="p-6">
            {/* Already registered msg */}
            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mb-4 text-center">
              <p className="text-sm font-bold text-violet-800 mb-1">
                உங்கள் details ஏற்கனவே எங்களிடம் இருக்கு! 🎉
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                You're already part of our exclusive family.
              </p>
            </div>

            {/* Instagram offers coming */}
            <div className="bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-100 rounded-2xl p-4 mb-5">
              <p className="text-xs font-black text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                Instagram Offers Coming Soon!
              </p>
              <div className="space-y-2">
                {[
                  { icon: <Users className="w-3.5 h-3.5 text-blue-500" />, label: "Followers Growth Offers" },
                  { icon: <ThumbsUp className="w-3.5 h-3.5 text-red-500" />, label: "Likes Boost Packages" },
                  { icon: <Eye className="w-3.5 h-3.5 text-green-500" />, label: "Views & Reach Deals" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-50">
                    {item.icon}
                    <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                    <span className="ml-auto text-[10px] bg-green-100 text-green-600 font-bold px-2 py-0.5 rounded-full">Soon</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp notice */}
            <div className="flex items-center gap-2.5 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl px-4 py-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#25D366" }}>
                <MessageCircle className="w-4 h-4 text-white" fill="white" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                All exclusive offers will be sent to your <span className="text-[#25D366] font-bold">WhatsApp</span> soon! 📲
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              ✨ Got it, Waiting for Offers!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Success Popup ────────────────────────────────────────────────────────────
function SuccessPopup({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div
        className="relative w-full max-w-sm animate-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          {/* Gradient header */}
          <div className="relative px-6 pt-8 pb-6 text-center"
            style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}>
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Animated success icon */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center animate-bounce-soft">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-black text-white">Welcome, {name}! 🎊</h2>
            <p className="text-white/80 text-sm mt-1 font-medium">Registration Successful!</p>
          </div>

          <div className="p-6">
            {/* Tamil success */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-4 text-center">
              <p className="text-sm font-bold text-emerald-800 mb-1">
                உங்கள் registration successful! 🎉
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                You've joined our exclusive VIP family. Amazing offers are on their way!
              </p>
            </div>

            {/* Instagram offers detail */}
            <div className="rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm">
              <div className="px-4 py-2.5 flex items-center gap-2"
                style={{ background: "linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045)" }}>
                <Instagram className="w-4 h-4 text-white" />
                <span className="text-xs font-black text-white tracking-wide uppercase">
                  Instagram Offers on WhatsApp
                </span>
              </div>
              <div className="p-3 space-y-2 bg-white">
                {[
                  { icon: <Users className="w-4 h-4 text-blue-500" />, title: "Followers", desc: "Grow your Instagram followers fast", badge: "🔥 Hot" },
                  { icon: <ThumbsUp className="w-4 h-4 text-red-500" />, title: "Likes", desc: "Boost your post likes & engagement", badge: "⚡ Quick" },
                  { icon: <Eye className="w-4 h-4 text-purple-500" />, title: "Views", desc: "Increase Reels & Story views", badge: "📈 Growth" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-gray-800">{item.title}</p>
                        <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">{item.badge}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp delivery notice */}
            <div className="flex items-center gap-2.5 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl px-4 py-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#25D366" }}>
                <MessageCircle className="w-4 h-4 text-white" fill="white" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                Instagram followers, likes & views offers will be delivered to your <span className="text-[#25D366] font-black">WhatsApp</span> shortly! 📲
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}
            >
              🎉 Awesome, Can't Wait!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CustomerRegisterPage() {
  const [step, setStep] = useState<Step>("phone");
  const [popup, setPopup] = useState<PopupType>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [existingName, setExistingName] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const cleaned = phone.replace(/\s+/g, "");
    setPhoneValid(null);
    setErrors({});

    if (cleaned.length < 7) return;
    if (!isValidWhatsAppNumber(cleaned)) {
      setErrors({ phone: "Enter a valid WhatsApp number" });
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await customerApi.checkByPhone(cleaned);
        if (res.exists && res.data) {
          setExistingName(res.data.name);
          setExistingId(res.data.id);
          setPhoneValid(true);
          setPopup("existing");
        } else {
          setExistingId(null);
          setPhoneValid(true);
        }
      } catch {
        setPhoneValid(null);
      } finally {
        setChecking(false);
      }
    }, 600);
  }, [phone]);

  const handlePhoneNext = () => {
    const cleaned = phone.replace(/\s+/g, "");
    if (!isValidWhatsAppNumber(cleaned)) {
      setErrors({ phone: "Please enter a valid WhatsApp number" });
      return;
    }
    if (existingId) { setPopup("existing"); return; }
    setStep("details");
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2)
      newErrors.name = "Please enter your name (min 2 characters)";
    if (instagram && !isValidInstagramUrl(instagram))
      newErrors.instagram = "Enter a valid Instagram URL";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setSubmitting(true);
    try {
      await customerApi.create({
        whatsappNumber: phone.replace(/\s+/g, ""),
        name: name.trim(),
        instagramLink: instagram.trim() || undefined,
      });
      setPopup("success");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || "Something went wrong. Please try again.";
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePopupClose = () => {
    setPopup(null);
    if (popup === "success") setStep("done");
  };

  return (
    <>
      <style>{`
        @keyframes popup {
          0% { opacity:0; transform:scale(0.85) translateY(30px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes float1 {
          0%,100% { transform:translateY(0) rotate(0deg); }
          50% { transform:translateY(-18px) rotate(15deg); }
        }
        @keyframes float2 {
          0%,100% { transform:translateY(0) rotate(0deg); }
          50% { transform:translateY(-22px) rotate(-15deg); }
        }
        @keyframes float3 {
          0%,100% { transform:translateY(0) scale(1); }
          50% { transform:translateY(-12px) scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        @keyframes glow {
          0%,100% { box-shadow:0 0 20px rgba(168,85,247,0.4); }
          50% { box-shadow:0 0 40px rgba(168,85,247,0.8); }
        }
        @keyframes bounce-soft {
          0%,100% { transform:scale(1); }
          50% { transform:scale(1.05); }
        }
        @keyframes slide-in {
          0% { opacity:0; transform:translateX(-20px); }
          100% { opacity:1; transform:translateX(0); }
        }
        .animate-popup { animation:popup 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .animate-float1 { animation:float1 6s ease-in-out infinite; }
        .animate-float2 { animation:float2 8s ease-in-out infinite; }
        .animate-float3 { animation:float3 5s ease-in-out infinite; }
        .animate-bounce-soft { animation:bounce-soft 2s ease-in-out infinite; }
        .animate-slide-in { animation:slide-in 0.4s ease-out forwards; }
        .shimmer-text {
          background:linear-gradient(90deg,#fff,#fde68a,#fff,#fde68a,#fff);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmer 4s linear infinite;
        }
        .glass-form {
          background:rgba(255,255,255,0.12);
          backdrop-filter:blur(24px);
          -webkit-backdrop-filter:blur(24px);
          border:1px solid rgba(255,255,255,0.25);
        }
        .glass-card {
          background:rgba(255,255,255,0.95);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
        }
        .input-glass {
          width:100%;
          height:56px;
          background:rgba(255,255,255,0.15);
          backdrop-filter:blur(10px);
          border:1.5px solid rgba(255,255,255,0.35);
          border-radius:16px;
          padding:0 52px 0 52px;
          color:white;
          font-size:15px;
          font-weight:600;
          outline:none;
          transition:all 0.25s;
          caret-color:white;
        }
        .input-glass::placeholder { color:rgba(255,255,255,0.5); font-weight:400; }
        .input-glass:focus { border-color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.22); box-shadow:0 0 0 4px rgba(255,255,255,0.1); }
        .input-glass.error { border-color:rgba(252,165,165,0.8); }
        .btn-glow {
          width:100%;
          height:56px;
          border-radius:16px;
          border:none;
          cursor:pointer;
          font-weight:800;
          font-size:15px;
          letter-spacing:0.02em;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          transition:all 0.2s;
          position:relative;
          overflow:hidden;
        }
        .btn-glow:active { transform:scale(0.97); }
        .btn-glow:disabled { opacity:0.7; cursor:not-allowed; transform:none; }
        .btn-glow::before {
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.2),transparent);
          pointer-events:none;
        }
        .progress-fill { transition:width 0.5s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      {/* Full-screen background */}
      <div className="min-h-screen relative overflow-hidden flex flex-col"
        style={{
          backgroundColor: "#0f0524",
          backgroundImage: "url('/register-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}>

        {/* Dark gradient overlay — keeps text readable */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(20,0,40,0.75) 50%, rgba(0,0,0,0.80) 100%)" }} />

        {/* Floating accent circles */}
        <div className="absolute top-16 right-8 w-20 h-20 rounded-full opacity-30 animate-float1"
          style={{ background: "radial-gradient(circle, #f472b6, transparent)", filter: "blur(8px)" }} />
        <div className="absolute top-40 left-6 w-14 h-14 rounded-full opacity-25 animate-float2"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)", filter: "blur(6px)" }} />
        <div className="absolute bottom-32 right-12 w-16 h-16 rounded-full opacity-20 animate-float3"
          style={{ background: "radial-gradient(circle, #34d399, transparent)", filter: "blur(8px)" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-10">
          <div className="w-full max-w-md">

            {/* Top brand badge */}
            <div className="flex justify-center mb-6">
              <div className="glass-form rounded-full px-5 py-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="text-xs font-black text-white tracking-widest uppercase">
                  The God Gift — VIP Access
                </span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              </div>
            </div>

            {/* Hero title */}
            {step !== "done" && (
              <div className="text-center mb-7">
                <h1 className="text-4xl font-black leading-tight mb-2">
                  <span className="text-white">Grow Your</span>
                  <br />
                  <span className="shimmer-text">Instagram 🚀</span>
                </h1>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  Join our exclusive family and get{" "}
                  <span className="text-pink-300 font-bold">Followers • Likes • Views</span>{" "}
                  offers on WhatsApp!
                </p>
              </div>
            )}

            {/* Offer chips */}
            {step === "phone" && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <OfferBadge icon="👥" label="Followers" color="bg-blue-500/20 border-blue-400/30 text-blue-200" />
                <OfferBadge icon="❤️" label="Likes" color="bg-red-500/20 border-red-400/30 text-red-200" />
                <OfferBadge icon="👁️" label="Views" color="bg-purple-500/20 border-purple-400/30 text-purple-200" />
                <OfferBadge icon="📈" label="Growth" color="bg-green-500/20 border-green-400/30 text-green-200" />
              </div>
            )}

            {/* Progress (details step) */}
            {step === "details" && (
              <div className="mb-5">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-green-400">✓ Phone verified</span>
                  <span className="text-white/60">Step 2 / 2</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <div className="h-full rounded-full progress-fill"
                    style={{ width: "100%", background: "linear-gradient(90deg, #34d399, #10b981)" }} />
                </div>
              </div>
            )}

            {/* ── STEP 1: Phone ── */}
            {step === "phone" && (
              <div className="glass-form rounded-3xl overflow-hidden shadow-2xl">
                {/* Rainbow top border */}
                <div className="h-1" style={{ background: "linear-gradient(90deg,#833ab4,#fd1d1d,#fcb045,#833ab4)" }} />

                <div className="p-7">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Step 1 of 2</p>
                      <p className="text-sm font-black text-white">WhatsApp Number</p>
                    </div>
                  </div>

                  {/* Phone input */}
                  <div className="relative mb-2">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🇮🇳</div>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !checking && handlePhoneNext()}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)}
                      className={`input-glass ${errors.phone ? "error" : ""}`}
                      autoFocus
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {checking && <Loader2 className="w-4 h-4 text-white animate-spin" />}
                      {!checking && phoneValid === true && !existingId && (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-300 font-semibold mb-3 ml-1 animate-slide-in">{errors.phone}</p>
                  )}

                  <p className="text-xs text-white/50 mb-6 ml-1">
                    📲 Offers will be sent directly to this number
                  </p>

                  {/* What you get */}
                  <div className="rounded-2xl mb-6 overflow-hidden border border-white/10">
                    <div className="px-4 py-2 text-[10px] font-black text-white/60 uppercase tracking-widest"
                      style={{ background: "rgba(255,255,255,0.05)" }}>
                      🎁 What You'll Get on WhatsApp
                    </div>
                    <div className="divide-y divide-white/5">
                      {[
                        { icon: <Users className="w-3.5 h-3.5 text-blue-400" />, text: "Instagram Followers packages" },
                        { icon: <ThumbsUp className="w-3.5 h-3.5 text-red-400" />, text: "Post Likes & Engagement offers" },
                        { icon: <Eye className="w-3.5 h-3.5 text-purple-400" />, text: "Reels & Story Views deals" },
                        { icon: <TrendingUp className="w-3.5 h-3.5 text-green-400" />, text: "Exclusive growth packages" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                          {item.icon}
                          <span className="text-xs text-white/75 font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn-glow"
                    style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f472b6 100%)" }}
                    onClick={handlePhoneNext}
                    disabled={checking || !phone.trim()}
                  >
                    {checking ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</>
                    ) : (
                      <><span>Continue</span><ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Details ── */}
            {step === "details" && (
              <div className="glass-form rounded-3xl overflow-hidden shadow-2xl animate-slide-in">
                <div className="h-1" style={{ background: "linear-gradient(90deg, #11998e, #38ef7d)" }} />

                <div className="p-7">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ background: "linear-gradient(135deg, #11998e, #38ef7d)" }}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Step 2 of 2</p>
                      <p className="text-sm font-black text-white">Your Details</p>
                    </div>
                  </div>

                  {/* Phone verified badge */}
                  <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 mb-5 border border-green-400/20"
                    style={{ background: "rgba(52,211,153,0.1)" }}>
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-bold text-green-300">{phone}</span>
                    <button
                      onClick={() => { setStep("phone"); setErrors({}); }}
                      className="ml-auto text-white/30 hover:text-white/60 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Name */}
                  <div className="mb-4">
                    <label className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-2 ml-1">
                      Your Name *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <User className="w-4 h-4 text-white/40" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        className={`input-glass ${errors.name ? "error" : ""}`}
                        autoFocus
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-300 font-semibold mt-1 ml-1 animate-slide-in">{errors.name}</p>}
                  </div>

                  {/* Instagram */}
                  <div className="mb-5">
                    <label className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-2 ml-1">
                      Instagram Page <span className="text-white/30 normal-case font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Instagram className="w-4 h-4 text-white/40" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://instagram.com/yourpage"
                        value={instagram}
                        onChange={(e) => { setInstagram(e.target.value); setErrors((p) => ({ ...p, instagram: "" })); }}
                        onFocus={() => setFocused("ig")}
                        onBlur={() => setFocused(null)}
                        className={`input-glass ${errors.instagram ? "error" : ""}`}
                      />
                    </div>
                    {errors.instagram && <p className="text-xs text-red-300 font-semibold mt-1 ml-1 animate-slide-in">{errors.instagram}</p>}
                  </div>

                  {errors.submit && (
                    <div className="rounded-xl px-4 py-3 mb-4 border border-red-400/30 animate-slide-in"
                      style={{ background: "rgba(248,113,113,0.15)" }}>
                      <p className="text-xs text-red-300 font-semibold">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    className="btn-glow"
                    style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Submit Registration</>
                    )}
                  </button>

                  <p className="text-center text-xs text-white/40 mt-4">
                    🔒 100% Private & Secure
                  </p>
                </div>
              </div>
            )}

            {/* ── DONE ── */}
            {step === "done" && (
              <div className="glass-form rounded-3xl overflow-hidden shadow-2xl text-center animate-slide-in">
                <div className="h-1" style={{ background: "linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045)" }} />
                <div className="p-10">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center animate-bounce-soft"
                    style={{ background: "rgba(255,255,255,0.15)" }}>
                    <Gift className="w-12 h-12 text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">You're In! 🎉</h2>
                  <p className="text-sm text-white/60 mb-6 leading-relaxed">
                    Welcome to The God Gift VIP family! Instagram followers, likes & views offers are coming to your WhatsApp soon.
                  </p>
                  <div className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 border border-[#25D366]/30"
                    style={{ background: "rgba(37,211,102,0.1)" }}>
                    <MessageCircle className="w-4 h-4 text-[#25D366]" fill="currentColor" />
                    <span className="text-xs font-bold text-white/80">Watch your WhatsApp for exclusive offers 📲</span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <p className="text-center text-xs text-white/30 mt-6 font-medium">
              Powered by <span className="text-white/60 font-bold">The God Gift CRM</span>
            </p>
          </div>
        </div>
      </div>

      {/* Popups */}
      {popup === "existing" && <ExistingPopup name={existingName} onClose={handlePopupClose} />}
      {popup === "success" && <SuccessPopup name={name} onClose={handlePopupClose} />}
    </>
  );
}
