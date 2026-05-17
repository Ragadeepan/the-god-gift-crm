"use client";

import { useState, useEffect, useRef } from "react";
import {
  Phone, User, Instagram, CheckCircle2,
  Sparkles, Gift, MessageCircle, Zap,
  Loader2, ChevronRight, X, Send, TrendingUp,
  ThumbsUp, Eye, Users, Heart, Star,
} from "lucide-react";
import { customerApi } from "@/services/api";
import { isValidWhatsAppNumber, isValidInstagramUrl } from "@/lib/utils";

type Step = "phone" | "details" | "done";
type PopupType = "existing" | "success" | null;

// ─── Existing Customer Popup ──────────────────────────────────────────────────
function ExistingPopup({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.75)" }} />
      <div className="relative w-full max-w-sm popup-enter" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative px-5 pt-7 pb-5 text-center"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <button onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.35)" }}>
                <Heart className="w-8 h-8 text-white" fill="white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                <Star className="w-3 h-3 text-white" fill="white" />
              </div>
            </div>
            <h2 className="text-lg font-black text-white">வணக்கம், {name}!</h2>
            <p className="text-white/80 text-xs mt-1 font-medium">⭐ Existing VIP Member</p>
          </div>

          <div className="p-5">
            <div className="rounded-xl p-3 mb-3 text-center" style={{ background: "#f5f3ff", border: "1px solid #ede9fe" }}>
              <p className="text-sm font-bold text-violet-800">உங்கள் details ஏற்கனவே எங்களிடம் இருக்கு! 🎉</p>
              <p className="text-xs text-gray-500 mt-0.5">You're already part of our exclusive family.</p>
            </div>

            <div className="rounded-xl p-3 mb-3" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
              <p className="text-xs font-black text-gray-700 mb-2 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                Instagram Offers Coming Soon!
              </p>
              <div className="space-y-1.5">
                {[
                  { color: "#3b82f6", label: "Followers Growth Offers" },
                  { color: "#ef4444", label: "Likes Boost Packages" },
                  { color: "#8b5cf6", label: "Views & Reach Deals" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                    <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#dcfce7", color: "#16a34a" }}>Soon</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 mb-4"
              style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#25D366" }}>
                <MessageCircle className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                All offers will be sent to your <span style={{ color: "#16a34a" }} className="font-bold">WhatsApp</span> soon! 📲
              </p>
            </div>

            <button onClick={onClose}
              className="w-full py-3 rounded-xl text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.75)" }} />
      <div className="relative w-full max-w-sm popup-enter" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative px-5 pt-7 pb-5 text-center"
            style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}>
            <button onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.35)" }}>
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-black text-white">Welcome, {name}! 🎊</h2>
            <p className="text-white/80 text-xs mt-1 font-medium">Registration Successful!</p>
          </div>

          <div className="p-5">
            <div className="rounded-xl p-3 mb-3 text-center" style={{ background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
              <p className="text-sm font-bold text-emerald-800">உங்கள் registration successful! 🎉</p>
              <p className="text-xs text-gray-500 mt-0.5">You've joined our exclusive VIP family!</p>
            </div>

            <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #e5e7eb" }}>
              <div className="px-3 py-2 flex items-center gap-2"
                style={{ background: "linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045)" }}>
                <Instagram className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-black text-white uppercase tracking-wide">Instagram Offers on WhatsApp</span>
              </div>
              <div className="p-2.5 space-y-1.5 bg-white">
                {[
                  { color: "#3b82f6", title: "Followers", desc: "Grow your Instagram followers fast", badge: "🔥 Hot" },
                  { color: "#ef4444", title: "Likes", desc: "Boost your post likes & engagement", badge: "⚡ Quick" },
                  { color: "#8b5cf6", title: "Views", desc: "Increase Reels & Story views", badge: "📈 Growth" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-lg p-2" style={{ background: "#f9fafb" }}>
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      {i === 0 && <Users className="w-3.5 h-3.5" style={{ color: item.color }} />}
                      {i === 1 && <ThumbsUp className="w-3.5 h-3.5" style={{ color: item.color }} />}
                      {i === 2 && <Eye className="w-3.5 h-3.5" style={{ color: item.color }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-gray-800">{item.title}</p>
                        <span className="text-[10px] font-bold text-gray-500">{item.badge}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 mb-4"
              style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#25D366" }}>
                <MessageCircle className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                Instagram followers, likes & views offers will be delivered to your{" "}
                <span style={{ color: "#16a34a" }} className="font-black">WhatsApp</span> shortly! 📲
              </p>
            </div>

            <button onClick={onClose}
              className="w-full py-3 rounded-xl text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}>
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
    }, 500);
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
        /* suppress admin body layers on this page */
        body::before, body::after { display: none !important; }
        @keyframes popup-in {
          0% { opacity:0; transform:translateY(40px) scale(0.95); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes fade-up {
          0% { opacity:0; transform:translateY(16px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        .popup-enter { animation: popup-in 0.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
        .fade-up { animation: fade-up 0.35s ease-out forwards; }
        .shimmer-text {
          background: linear-gradient(90deg,#fff 0%,#fde68a 40%,#fff 60%,#fde68a 80%,#fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .reg-input {
          width: 100%;
          height: 52px;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 14px;
          padding: 0 48px 0 48px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          outline: none;
          caret-color: white;
          -webkit-appearance: none;
          appearance: none;
        }
        .reg-input::placeholder { color: rgba(255,255,255,0.45); font-weight: 400; }
        .reg-input:focus { border-color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.18); }
        .reg-input.err { border-color: rgba(252,165,165,0.8); }
        .reg-btn {
          width: 100%;
          height: 52px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-weight: 800;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: white;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .reg-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .reg-btn:not(:disabled):active { opacity: 0.85; transform: scale(0.98); }
      `}</style>

      <div className="min-h-screen flex flex-col"
        style={{
          backgroundColor: "#0f0524",
          backgroundImage: "url('/register-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "scroll",
        }}>

        {/* Single overlay */}
        <div className="fixed inset-0"
          style={{ background: "linear-gradient(170deg, rgba(10,0,30,0.65) 0%, rgba(20,0,40,0.80) 100%)" }} />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-sm">

            {/* Brand badge */}
            <div className="flex justify-center mb-5">
              <div className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <Zap className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                <span className="text-xs font-black text-white tracking-widest uppercase">The God Gift — VIP</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              </div>
            </div>

            {/* Title */}
            {step !== "done" && (
              <div className="text-center mb-5 fade-up">
                <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-2">
                  <span className="text-white">Grow Your</span>
                  <br />
                  <span className="shimmer-text">Instagram 🚀</span>
                </h1>
                <p className="text-sm text-white/65 font-medium">
                  Get <span className="text-pink-300 font-bold">Followers • Likes • Views</span> offers on WhatsApp
                </p>
              </div>
            )}

            {/* Offer chips (step 1 only) */}
            {step === "phone" && (
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {[
                  { icon: "👥", label: "Followers", bg: "rgba(59,130,246,0.2)", border: "rgba(96,165,250,0.3)", color: "#93c5fd" },
                  { icon: "❤️", label: "Likes", bg: "rgba(239,68,68,0.2)", border: "rgba(248,113,113,0.3)", color: "#fca5a5" },
                  { icon: "👁️", label: "Views", bg: "rgba(139,92,246,0.2)", border: "rgba(167,139,250,0.3)", color: "#c4b5fd" },
                  { icon: "📈", label: "Growth", bg: "rgba(34,197,94,0.2)", border: "rgba(74,222,128,0.3)", color: "#86efac" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: b.bg, border: `1px solid ${b.border}`, color: b.color }}>
                    <span>{b.icon}</span><span>{b.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Progress bar (step 2) */}
            {step === "details" && (
              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-green-400">✓ Phone verified</span>
                  <span className="text-white/50">Step 2 / 2</span>
                </div>
                <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <div className="h-full rounded-full" style={{ width: "100%", background: "linear-gradient(90deg,#34d399,#10b981)" }} />
                </div>
              </div>
            )}

            {/* ── STEP 1: Phone ── */}
            {step === "phone" && (
              <div className="rounded-2xl overflow-hidden shadow-xl fade-up"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <div className="h-1" style={{ background: "linear-gradient(90deg,#833ab4,#fd1d1d,#fcb045)" }} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
                      <Phone className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/45 font-bold uppercase tracking-widest">Step 1 of 2</p>
                      <p className="text-sm font-black text-white">WhatsApp Number</p>
                    </div>
                  </div>

                  <div className="relative mb-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none select-none">🇮🇳</div>
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !checking && handlePhoneNext()}
                      className={`reg-input ${errors.phone ? "err" : ""}`}
                      autoComplete="tel"
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
                    <p className="text-xs text-red-300 font-semibold mb-2 ml-1">{errors.phone}</p>
                  )}
                  <p className="text-xs text-white/45 mb-5 ml-1">📲 Offers will be sent to this number</p>

                  {/* Offers list */}
                  <div className="rounded-xl mb-5 overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="px-3 py-2 text-[10px] font-black text-white/50 uppercase tracking-widest"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      🎁 What You'll Get on WhatsApp
                    </div>
                    {[
                      { icon: <Users className="w-3.5 h-3.5 text-blue-400" />, text: "Instagram Followers packages" },
                      { icon: <ThumbsUp className="w-3.5 h-3.5 text-red-400" />, text: "Post Likes & Engagement offers" },
                      { icon: <Eye className="w-3.5 h-3.5 text-purple-400" />, text: "Reels & Story Views deals" },
                      { icon: <TrendingUp className="w-3.5 h-3.5 text-green-400" />, text: "Exclusive growth packages" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2.5"
                        style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined, background: "rgba(255,255,255,0.04)" }}>
                        {item.icon}
                        <span className="text-xs text-white/70 font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="reg-btn"
                    style={{ background: "linear-gradient(135deg,#667eea 0%,#764ba2 60%,#f472b6 100%)" }}
                    onClick={handlePhoneNext}
                    disabled={checking || !phone.trim()}
                  >
                    {checking
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</>
                      : <><span>Continue</span><ChevronRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Details ── */}
            {step === "details" && (
              <div className="rounded-2xl overflow-hidden shadow-xl fade-up"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <div className="h-1" style={{ background: "linear-gradient(90deg,#11998e,#38ef7d)" }} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#11998e,#38ef7d)" }}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/45 font-bold uppercase tracking-widest">Step 2 of 2</p>
                      <p className="text-sm font-black text-white">Your Details</p>
                    </div>
                  </div>

                  {/* Phone verified */}
                  <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4"
                    style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)" }}>
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-bold text-green-300 flex-1 min-w-0 truncate">{phone}</span>
                    <button onClick={() => { setStep("phone"); setErrors({}); }}
                      className="text-white/35 hover:text-white/60 flex-shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Name */}
                  <div className="mb-3">
                    <label className="block text-[10px] font-black text-white/55 uppercase tracking-widest mb-1.5 ml-1">
                      Your Name *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <User className="w-4 h-4 text-white/35" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                        className={`reg-input ${errors.name ? "err" : ""}`}
                        autoComplete="name"
                        autoFocus
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-300 font-semibold mt-1 ml-1">{errors.name}</p>}
                  </div>

                  {/* Instagram */}
                  <div className="mb-4">
                    <label className="block text-[10px] font-black text-white/55 uppercase tracking-widest mb-1.5 ml-1">
                      Instagram Page <span className="text-white/30 normal-case font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Instagram className="w-4 h-4 text-white/35" />
                      </div>
                      <input
                        type="url"
                        inputMode="url"
                        placeholder="https://instagram.com/yourpage"
                        value={instagram}
                        onChange={(e) => { setInstagram(e.target.value); setErrors((p) => ({ ...p, instagram: "" })); }}
                        className={`reg-input ${errors.instagram ? "err" : ""}`}
                        autoComplete="url"
                      />
                    </div>
                    {errors.instagram && <p className="text-xs text-red-300 font-semibold mt-1 ml-1">{errors.instagram}</p>}
                  </div>

                  {errors.submit && (
                    <div className="rounded-xl px-3 py-2.5 mb-3"
                      style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(252,165,165,0.3)" }}>
                      <p className="text-xs text-red-300 font-semibold">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    className="reg-btn"
                    style={{ background: "linear-gradient(135deg,#11998e 0%,#38ef7d 100%)" }}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</>
                      : <><Send className="w-4 h-4" /> Submit Registration</>}
                  </button>

                  <p className="text-center text-xs text-white/35 mt-3">🔒 100% Private & Secure</p>
                </div>
              </div>
            )}

            {/* ── DONE ── */}
            {step === "done" && (
              <div className="rounded-2xl overflow-hidden shadow-xl text-center fade-up"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <div className="h-1" style={{ background: "linear-gradient(90deg,#833ab4,#fd1d1d,#fcb045)" }} />
                <div className="p-8">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.12)" }}>
                    <Gift className="w-10 h-10 text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">You're In! 🎉</h2>
                  <p className="text-sm text-white/60 mb-5 leading-relaxed">
                    Welcome to The God Gift VIP family! Instagram followers, likes & views offers are coming to your WhatsApp soon.
                  </p>
                  <div className="flex items-center justify-center gap-2 rounded-xl px-4 py-3"
                    style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)" }}>
                    <MessageCircle className="w-4 h-4" style={{ color: "#25D366" }} fill="currentColor" />
                    <span className="text-xs font-bold text-white/75">Watch your WhatsApp for exclusive offers 📲</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-white/30 mt-5">
              Powered by <span className="text-white/55 font-bold">The God Gift CRM</span>
            </p>
          </div>
        </div>
      </div>

      {popup === "existing" && <ExistingPopup name={existingName} onClose={handlePopupClose} />}
      {popup === "success" && <SuccessPopup name={name} onClose={handlePopupClose} />}
    </>
  );
}
