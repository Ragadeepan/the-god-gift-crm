"use client";

import { useState, useEffect, useRef } from "react";
import {
  Phone, User, Instagram, CheckCircle2, Sparkles, Gift,
  MessageCircle, Zap, Loader2, ChevronRight, X, Send,
  TrendingUp, ThumbsUp, Eye, Users, Heart, Star, Shield,
} from "lucide-react";
import { customerApi } from "@/services/api";
import { isValidWhatsAppNumber, isValidInstagramUrl } from "@/lib/utils";

type Step = "phone" | "details" | "done";
type PopupType = "existing" | "success" | null;

/* ─── Static particles (fixed positions — avoids SSR hydration mismatch) ─── */
const PARTICLES = [
  { left: "8%",  top: "12%", delay: "0s",    dur: "3s"   },
  { left: "22%", top: "5%",  delay: "0.6s",  dur: "2.5s" },
  { left: "40%", top: "8%",  delay: "1.2s",  dur: "3.5s" },
  { left: "62%", top: "4%",  delay: "0.3s",  dur: "2.8s" },
  { left: "80%", top: "10%", delay: "1.8s",  dur: "3.2s" },
  { left: "92%", top: "20%", delay: "0.9s",  dur: "2.4s" },
  { left: "5%",  top: "40%", delay: "2.1s",  dur: "3.8s" },
  { left: "95%", top: "50%", delay: "0.4s",  dur: "2.9s" },
  { left: "3%",  top: "65%", delay: "1.5s",  dur: "3.1s" },
  { left: "88%", top: "72%", delay: "0.7s",  dur: "2.6s" },
  { left: "15%", top: "85%", delay: "2.4s",  dur: "3.6s" },
  { left: "50%", top: "90%", delay: "1.1s",  dur: "2.7s" },
  { left: "70%", top: "88%", delay: "0.2s",  dur: "3.3s" },
  { left: "35%", top: "55%", delay: "1.9s",  dur: "4s"   },
  { left: "78%", top: "35%", delay: "0.5s",  dur: "2.3s" },
];

/* ─── Existing Popup ─────────────────────────────────────────────────────── */
function ExistingPopup({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(5,0,20,0.85)" }} />
      <div
        className="relative w-full max-w-sm spring-in"
        onClick={(e) => e.stopPropagation()}
        style={{ filter: "drop-shadow(0 0 40px rgba(139,92,246,0.4))" }}
      >
        {/* Confetti dots */}
        <div className="absolute inset-x-0 top-0 h-16 overflow-hidden rounded-t-2xl pointer-events-none">
          {["#f472b6","#818cf8","#34d399","#fbbf24","#60a5fa"].map((c, i) => (
            <div key={i} className="confetti-dot absolute w-2 h-2 rounded-full"
              style={{ background: c, left: `${15 + i * 17}%`, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative px-5 pt-8 pb-5 text-center"
            style={{ background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)" }}>
            <button onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <X className="w-4 h-4 text-white" />
            </button>
            {/* Avatar */}
            <div className="relative w-18 h-18 mx-auto mb-3">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center ring-2 ring-white/30 ring-offset-2 ring-offset-purple-600"
                style={{ background: "rgba(255,255,255,0.2)" }}>
                <Heart className="w-8 h-8 text-white" fill="white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Star className="w-3 h-3 text-white" fill="white" />
              </div>
            </div>
            <h2 className="text-lg font-black text-white">வணக்கம், {name}! 👋</h2>
            <p className="text-white/75 text-xs mt-0.5 font-semibold">⭐ Existing VIP Member</p>
          </div>

          <div className="p-5 space-y-3">
            <div className="rounded-xl p-3 text-center"
              style={{ background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "1px solid #ddd6fe" }}>
              <p className="text-sm font-black text-violet-800">உங்கள் details எங்களிடம் இருக்கு! 🎉</p>
              <p className="text-xs text-violet-500 mt-0.5">You're already in our exclusive VIP family.</p>
            </div>

            {/* Offer list */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #fde8d8" }}>
              <div className="px-3 py-2 flex items-center gap-1.5"
                style={{ background: "linear-gradient(90deg,#ff6b6b,#feca57,#ff9ff3)" }}>
                <Instagram className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-black text-white uppercase tracking-wide">Instagram Offers Coming</span>
              </div>
              {[
                { bg:"#eff6ff", border:"#bfdbfe", iconBg:"#3b82f6", label:"Followers Growth Offers" },
                { bg:"#fef2f2", border:"#fecaca", iconBg:"#ef4444", label:"Likes Boost Packages" },
                { bg:"#f5f3ff", border:"#ddd6fe", iconBg:"#8b5cf6", label:"Views & Reach Deals" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2"
                  style={{ background: item.bg, borderTop: "1px solid " + item.border }}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: item.iconBg }}>
                      {i === 0 && <Users className="w-2.5 h-2.5 text-white" />}
                      {i === 1 && <ThumbsUp className="w-2.5 h-2.5 text-white" />}
                      {i === 2 && <Eye className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                    style={{ background: "#dcfce7", color: "#15803d" }}>Soon</span>
                </div>
              ))}
            </div>

            {/* WhatsApp notice */}
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
              style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.3)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#25D366" }}>
                <MessageCircle className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                All offers → your <span style={{ color: "#16a34a" }} className="font-black">WhatsApp</span> soon! 📲
              </p>
            </div>

            <button onClick={onClose}
              className="w-full py-3 rounded-xl text-white font-black text-sm transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)" }}>
              ✨ Got it, Waiting for Offers!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Success Popup ──────────────────────────────────────────────────────── */
function SuccessPopup({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(5,0,20,0.85)" }} />
      <div
        className="relative w-full max-w-sm spring-in"
        onClick={(e) => e.stopPropagation()}
        style={{ filter: "drop-shadow(0 0 40px rgba(52,211,153,0.4))" }}
      >
        {/* Confetti */}
        <div className="absolute inset-x-0 top-0 h-16 overflow-hidden rounded-t-2xl pointer-events-none">
          {["#34d399","#fbbf24","#60a5fa","#f472b6","#a78bfa"].map((c, i) => (
            <div key={i} className="confetti-dot absolute w-2 h-2 rounded-full"
              style={{ background: c, left: `${10 + i * 18}%`, animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative px-5 pt-8 pb-5 text-center"
            style={{ background: "linear-gradient(135deg,#11998e 0%,#38ef7d 100%)" }}>
            <button onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <X className="w-4 h-4 text-white" />
            </button>
            {/* Success rings */}
            <div className="relative w-20 h-20 mx-auto mb-3 flex items-center justify-center">
              <div className="success-ring absolute w-20 h-20 rounded-full border-2 border-white/50" />
              <div className="success-ring absolute w-20 h-20 rounded-full border-2 border-white/50" style={{ animationDelay: "0.4s" }} />
              <div className="w-16 h-16 rounded-full flex items-center justify-center ring-2 ring-white/30 ring-offset-2 ring-offset-emerald-500"
                style={{ background: "rgba(255,255,255,0.25)" }}>
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-black text-white">Welcome, {name}! 🎊</h2>
            <p className="text-white/75 text-xs mt-0.5 font-semibold">Registration Successful!</p>
          </div>

          <div className="p-5 space-y-3">
            <div className="rounded-xl p-3 text-center"
              style={{ background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: "1px solid #a7f3d0" }}>
              <p className="text-sm font-black text-emerald-800">உங்கள் registration successful! 🎉</p>
              <p className="text-xs text-emerald-600 mt-0.5">You've joined our exclusive VIP family!</p>
            </div>

            {/* Instagram offers */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
              <div className="px-3 py-2 flex items-center gap-1.5"
                style={{ background: "linear-gradient(90deg,#833ab4,#fd1d1d,#fcb045)" }}>
                <Instagram className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-black text-white uppercase tracking-wide">Instagram Offers on WhatsApp</span>
              </div>
              {[
                { iconBg:"#3b82f6", title:"Followers", desc:"Grow your Instagram followers fast", badge:"🔥 Hot", bg:"#eff6ff" },
                { iconBg:"#ef4444", title:"Likes",     desc:"Boost your post likes & engagement", badge:"⚡ Quick", bg:"#fef2f2" },
                { iconBg:"#8b5cf6", title:"Views",     desc:"Increase Reels & Story views",       badge:"📈 Growth", bg:"#f5f3ff" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2.5"
                  style={{ background: item.bg, borderTop: "1px solid #f3f4f6" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ background: item.iconBg }}>
                    {i === 0 && <Users className="w-3.5 h-3.5 text-white" />}
                    {i === 1 && <ThumbsUp className="w-3.5 h-3.5 text-white" />}
                    {i === 2 && <Eye className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-gray-800">{item.title}</p>
                      <span className="text-[10px] font-bold text-gray-500">{item.badge}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
              style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.3)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#25D366" }}>
                <MessageCircle className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                Instagram followers, likes & views offers →{" "}
                <span style={{ color: "#16a34a" }} className="font-black">WhatsApp</span> shortly! 📲
              </p>
            </div>

            <button onClick={onClose}
              className="w-full py-3 rounded-xl text-white font-black text-sm transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg,#11998e 0%,#38ef7d 100%)" }}>
              🎉 Awesome, Can't Wait!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function CustomerRegisterPage() {
  const [step, setStep]               = useState<Step>("phone");
  const [popup, setPopup]             = useState<PopupType>(null);
  const [phone, setPhone]             = useState("");
  const [name, setName]               = useState("");
  const [instagram, setInstagram]     = useState("");
  const [existingName, setExistingName] = useState("");
  const [existingId, setExistingId]   = useState<string | null>(null);
  const [checking, setChecking]       = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [phoneValid, setPhoneValid]   = useState<boolean | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
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
      } catch { setPhoneValid(null); }
      finally  { setChecking(false); }
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
      newErrors.name = "Please enter your name (min 2 chars)";
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
    } finally { setSubmitting(false); }
  };

  const handlePopupClose = () => {
    setPopup(null);
    if (popup === "success") setStep("done");
  };

  const inputStyle = (key: string, hasError: boolean) => ({
    width: "100%",
    height: "52px",
    background: focusedInput === key
      ? "rgba(255,255,255,0.14)"
      : "rgba(255,255,255,0.07)",
    border: `1.5px solid ${
      hasError
        ? "rgba(252,165,165,0.8)"
        : focusedInput === key
          ? "rgba(168,85,247,0.9)"
          : "rgba(255,255,255,0.15)"
    }`,
    borderRadius: "14px",
    padding: "0 48px 0 48px",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    outline: "none",
    caretColor: "white",
    WebkitAppearance: "none" as const,
    appearance: "none" as const,
    boxShadow: focusedInput === key && !hasError
      ? "0 0 0 3px rgba(168,85,247,0.2), 0 0 20px rgba(168,85,247,0.15)"
      : "none",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  });

  return (
    <>
      <style>{`
        /* ── suppress admin body layers ── */
        body::before, body::after { display:none!important; }

        /* ── background orbs ── */
        @keyframes orb1 {
          0%,100% { transform:translate(0,0) scale(1); }
          33%     { transform:translate(40px,-50px) scale(1.06); }
          66%     { transform:translate(-25px,25px) scale(0.95); }
        }
        @keyframes orb2 {
          0%,100% { transform:translate(0,0) scale(1); }
          40%     { transform:translate(-50px,35px) scale(1.08); }
          70%     { transform:translate(30px,-20px) scale(0.93); }
        }
        @keyframes orb3 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%     { transform:translate(25px,40px) scale(1.1); }
        }

        /* ── particles ── */
        @keyframes twinkle {
          0%,100% { opacity:0; transform:scale(0.3) rotate(0deg); }
          50%     { opacity:1; transform:scale(1.4) rotate(180deg); }
        }
        .particle {
          position:absolute;
          width:4px; height:4px;
          border-radius:50%;
          background:white;
          animation:twinkle var(--dur,3s) var(--delay,0s) ease-in-out infinite;
        }

        /* ── confetti ── */
        @keyframes confetti-fall {
          0%   { transform:translateY(0) rotate(0deg); opacity:1; }
          100% { transform:translateY(55px) rotate(540deg); opacity:0; }
        }
        .confetti-dot {
          animation:confetti-fall 1.2s ease-out var(--cd-delay,0s) forwards infinite;
        }

        /* ── card neon border ── */
        @keyframes neon-border {
          0%,100% { box-shadow:0 0 20px rgba(139,92,246,0.25), 0 0 60px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.08); }
          50%     { box-shadow:0 0 35px rgba(139,92,246,0.45), 0 0 80px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.12); }
        }
        .neon-card {
          animation: neon-border 3s ease-in-out infinite;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          overflow: hidden;
        }

        /* ── rainbow top border animation ── */
        @keyframes rainbow-move {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .rainbow-bar {
          height: 3px;
          background: linear-gradient(90deg,#833ab4,#fd1d1d,#fcb045,#38ef7d,#667eea,#833ab4);
          background-size: 300% 100%;
          animation: rainbow-move 4s linear infinite;
        }

        /* ── shimmer text ── */
        @keyframes shimmer-txt {
          0%   { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg,#fff 0%,#fde68a 30%,#f9a8d4 50%,#fde68a 70%,#fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-txt 3s linear infinite;
        }

        /* ── badge glow ── */
        @keyframes badge-glow {
          0%,100% { box-shadow:0 0 0 0 rgba(250,204,21,0.5),0 0 12px rgba(250,204,21,0.2); }
          50%     { box-shadow:0 0 0 6px rgba(250,204,21,0),0 0 24px rgba(250,204,21,0.4); }
        }
        .badge-glow { animation: badge-glow 2.5s ease-in-out infinite; }

        /* ── button sweep ── */
        @keyframes btn-sweep {
          0%   { transform:translateX(-100%) skewX(-20deg); opacity:0.7; }
          100% { transform:translateX(350%) skewX(-20deg); opacity:0; }
        }
        .btn-sweep::after {
          content:'';
          position:absolute;
          top:0; left:0;
          width:35%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent);
          animation:btn-sweep 2.2s ease-in-out infinite;
        }
        .btn-sweep { position:relative; overflow:hidden; }
        .btn-sweep:disabled::after { display:none; }

        /* ── offer chips fade-in stagger ── */
        @keyframes chip-in {
          0%   { opacity:0; transform:translateY(10px) scale(0.9); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        .chip { animation: chip-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }

        /* ── step fade up ── */
        @keyframes fade-up {
          0%   { opacity:0; transform:translateY(18px); }
          100% { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fade-up 0.4s ease-out both; }

        /* ── offer rows stagger ── */
        @keyframes row-in {
          0%   { opacity:0; transform:translateX(-12px); }
          100% { opacity:1; transform:translateX(0); }
        }
        .row-in { animation: row-in 0.35s ease-out both; }

        /* ── popup spring ── */
        @keyframes spring-in {
          0%  { opacity:0; transform:translateY(60px) scale(0.9); }
          60% { opacity:1; transform:translateY(-8px) scale(1.02); }
          80% { transform:translateY(3px) scale(0.99); }
          100%{ transform:translateY(0) scale(1); }
        }
        .spring-in { animation: spring-in 0.45s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }

        /* ── success ring ── */
        @keyframes success-ring {
          0%   { transform:scale(1); opacity:0.6; }
          100% { transform:scale(2.2); opacity:0; }
        }
        .success-ring {
          animation: success-ring 1.8s ease-out infinite;
        }

        /* ── progress bar glow ── */
        @keyframes progress-glow {
          0%,100% { box-shadow:0 0 8px rgba(52,211,153,0.5); }
          50%     { box-shadow:0 0 18px rgba(52,211,153,0.9); }
        }
        .progress-glow { animation: progress-glow 1.5s ease-in-out infinite; }

        /* ── done gift bounce ── */
        @keyframes gift-bounce {
          0%,100% { transform:translateY(0) rotate(-4deg); }
          50%     { transform:translateY(-12px) rotate(4deg); }
        }
        .gift-bounce { animation: gift-bounce 2.5s ease-in-out infinite; }

        /* ── input placeholder ── */
        .reg-inp::placeholder { color:rgba(255,255,255,0.35); font-weight:400; }
        .reg-inp { font-family:inherit; }

        /* ── done rings ── */
        @keyframes done-ring {
          0%   { transform:scale(0.8); opacity:0.5; }
          50%  { transform:scale(1.15); opacity:0.15; }
          100% { transform:scale(0.8); opacity:0.5; }
        }
        .done-ring { animation: done-ring 2s ease-in-out infinite; }
        .done-ring-2 { animation: done-ring 2s ease-in-out 0.5s infinite; }

        /* ── touch ── */
        * { -webkit-tap-highlight-color:transparent; }
        button { touch-action:manipulation; }
      `}</style>

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0" style={{ backgroundColor: "#0b0118" }}>
        {/* Background image */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "url('/register-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.35,
          }} />

        {/* Gradient overlay */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(170deg,rgba(15,5,40,0.7) 0%,rgba(30,0,60,0.85) 100%)" }} />

        {/* Orb 1 — purple */}
        <div className="absolute will-change-transform"
          style={{
            top: "10%", left: "15%", width: 280, height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(139,92,246,0.55) 0%,transparent 70%)",
            filter: "blur(60px)",
            animation: "orb1 14s ease-in-out infinite",
          }} />

        {/* Orb 2 — pink */}
        <div className="absolute will-change-transform"
          style={{
            bottom: "15%", right: "10%", width: 240, height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(244,114,182,0.5) 0%,transparent 70%)",
            filter: "blur(55px)",
            animation: "orb2 18s ease-in-out infinite",
          }} />

        {/* Orb 3 — teal */}
        <div className="absolute will-change-transform"
          style={{
            top: "50%", right: "20%", width: 180, height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(52,211,153,0.4) 0%,transparent 70%)",
            filter: "blur(45px)",
            animation: "orb3 10s ease-in-out infinite",
          }} />

        {/* Particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} className="particle"
            style={{ left: p.left, top: p.top, "--delay": p.delay, "--dur": p.dur } as React.CSSProperties} />
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">

          {/* Brand badge */}
          <div className="flex justify-center mb-5">
            <div className="badge-glow flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <Zap className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
              <span className="text-xs font-black text-white tracking-widest uppercase">
                The God Gift — VIP
              </span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </div>
          </div>

          {/* Hero title */}
          {step !== "done" && (
            <div className="text-center mb-5 fade-up">
              <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-2">
                <span className="text-white">Grow Your</span>
                <br />
                <span className="shimmer-text">Instagram 🚀</span>
              </h1>
              <p className="text-sm text-white/60 font-medium">
                Get{" "}
                <span className="text-pink-300 font-bold">Followers • Likes • Views</span>
                {" "}offers on WhatsApp
              </p>
            </div>
          )}

          {/* Offer chips */}
          {step === "phone" && (
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {[
                { icon: "👥", label: "Followers", bg: "rgba(59,130,246,0.18)", border: "rgba(96,165,250,0.35)", color: "#93c5fd", delay: "0s" },
                { icon: "❤️", label: "Likes",     bg: "rgba(239,68,68,0.18)", border: "rgba(248,113,113,0.35)", color: "#fca5a5", delay: "0.08s" },
                { icon: "👁️", label: "Views",    bg: "rgba(139,92,246,0.18)", border: "rgba(167,139,250,0.35)", color: "#c4b5fd", delay: "0.16s" },
                { icon: "📈", label: "Growth",   bg: "rgba(34,197,94,0.18)", border: "rgba(74,222,128,0.35)", color: "#86efac",  delay: "0.24s" },
              ].map((b) => (
                <div key={b.label} className="chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: b.bg, border: `1px solid ${b.border}`, color: b.color, animationDelay: b.delay }}>
                  <span>{b.icon}</span><span>{b.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Progress (step 2) */}
          {step === "details" && (
            <div className="mb-4 fade-up">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Phone verified
                </span>
                <span className="text-white/40">Step 2 / 2</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full progress-glow"
                  style={{ width: "100%", background: "linear-gradient(90deg,#34d399,#10b981)" }} />
              </div>
            </div>
          )}

          {/* ── STEP 1: Phone ── */}
          {step === "phone" && (
            <div className="neon-card fade-up" style={{ background: "rgba(15,8,35,0.85)" }}>
              <div className="rainbow-bar" />
              <div className="p-5">
                {/* Step header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", boxShadow: "0 4px 15px rgba(102,126,234,0.4)" }}>
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Step 1 of 2</p>
                    <p className="text-sm font-black text-white">WhatsApp Number</p>
                  </div>
                </div>

                {/* Phone input */}
                <div className="relative mb-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none select-none">🇮🇳</div>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !checking && handlePhoneNext()}
                    onFocus={() => setFocusedInput("phone")}
                    onBlur={() => setFocusedInput(null)}
                    className="reg-inp"
                    style={inputStyle("phone", !!errors.phone)}
                    autoComplete="tel"
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {checking && (
                      <div className="flex gap-1">
                        {[0,1,2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400"
                            style={{ animation: `twinkle 0.8s ease-in-out ${i*0.15}s infinite` }} />
                        ))}
                      </div>
                    )}
                    {!checking && phoneValid === true && !existingId && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.5)" }}>
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      </div>
                    )}
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-300 font-semibold mb-2 ml-1 fade-up">{errors.phone}</p>
                )}
                <p className="text-xs text-white/35 mb-5 ml-1">📲 Offers will be sent to this number</p>

                {/* Offer rows */}
                <div className="rounded-xl mb-5 overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                  <div className="px-3 py-2 text-[10px] font-black text-white/40 uppercase tracking-widest"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    🎁 What You'll Get on WhatsApp
                  </div>
                  {[
                    { icon: <Users className="w-3.5 h-3.5 text-blue-400" />,   text: "Instagram Followers packages",    delay: "0s" },
                    { icon: <ThumbsUp className="w-3.5 h-3.5 text-red-400" />,  text: "Post Likes & Engagement offers",  delay: "0.06s" },
                    { icon: <Eye className="w-3.5 h-3.5 text-purple-400" />,    text: "Reels & Story Views deals",       delay: "0.12s" },
                    { icon: <TrendingUp className="w-3.5 h-3.5 text-green-400" />, text: "Exclusive growth packages",   delay: "0.18s" },
                  ].map((item, i) => (
                    <div key={i} className="row-in flex items-center gap-3 px-3 py-2.5"
                      style={{
                        borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined,
                        animationDelay: item.delay,
                      }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.06)" }}>
                        {item.icon}
                      </div>
                      <span className="text-xs text-white/65 font-medium">{item.text}</span>
                      <span className="ml-auto text-[10px] text-white/25 font-bold">→</span>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-sweep w-full h-13 py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: "linear-gradient(135deg,#667eea 0%,#764ba2 50%,#f472b6 100%)",
                    boxShadow: "0 8px 25px rgba(102,126,234,0.45), 0 2px 8px rgba(0,0,0,0.3)",
                  }}
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
            <div className="neon-card fade-up" style={{ background: "rgba(15,8,35,0.85)" }}>
              <div className="rainbow-bar" />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ background: "linear-gradient(135deg,#11998e,#38ef7d)", boxShadow: "0 4px 15px rgba(17,153,142,0.4)" }}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">Step 2 of 2</p>
                    <p className="text-sm font-black text-white">Your Details</p>
                  </div>
                </div>

                {/* Phone verified pill */}
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4"
                  style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}>
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm font-bold text-green-300 flex-1 min-w-0 truncate">{phone}</span>
                  <button onClick={() => { setStep("phone"); setErrors({}); }}
                    className="flex-shrink-0 text-white/25 hover:text-white/60 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Name */}
                <div className="mb-3">
                  <label className="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1.5 ml-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: focusedInput === "name" ? "#a78bfa" : "rgba(255,255,255,0.3)", transition: "color 0.2s" }}>
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                      onFocus={() => setFocusedInput("name")}
                      onBlur={() => setFocusedInput(null)}
                      className="reg-inp"
                      style={inputStyle("name", !!errors.name)}
                      autoComplete="name"
                      autoFocus
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-300 font-semibold mt-1 ml-1 fade-up">{errors.name}</p>}
                </div>

                {/* Instagram */}
                <div className="mb-4">
                  <label className="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1.5 ml-1">
                    Instagram Page{" "}
                    <span className="text-white/25 normal-case font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: focusedInput === "ig" ? "#f472b6" : "rgba(255,255,255,0.3)", transition: "color 0.2s" }}>
                      <Instagram className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      inputMode="url"
                      placeholder="https://instagram.com/yourpage"
                      value={instagram}
                      onChange={(e) => { setInstagram(e.target.value); setErrors((p) => ({ ...p, instagram: "" })); }}
                      onFocus={() => setFocusedInput("ig")}
                      onBlur={() => setFocusedInput(null)}
                      className="reg-inp"
                      style={inputStyle("ig", !!errors.instagram)}
                      autoComplete="url"
                    />
                  </div>
                  {errors.instagram && <p className="text-xs text-red-300 font-semibold mt-1 ml-1 fade-up">{errors.instagram}</p>}
                </div>

                {errors.submit && (
                  <div className="rounded-xl px-3 py-2.5 mb-3 fade-up"
                    style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(252,165,165,0.3)" }}>
                    <p className="text-xs text-red-300 font-semibold">{errors.submit}</p>
                  </div>
                )}

                <button
                  className="btn-sweep w-full py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: "linear-gradient(135deg,#11998e 0%,#38ef7d 100%)",
                    boxShadow: "0 8px 25px rgba(17,153,142,0.45), 0 2px 8px rgba(0,0,0,0.3)",
                  }}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</>
                    : <><Send className="w-4 h-4" /> Submit Registration</>}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <Shield className="w-3 h-3 text-white/25" />
                  <p className="text-center text-xs text-white/25">100% Private & Secure</p>
                </div>
              </div>
            </div>
          )}

          {/* ── DONE ── */}
          {step === "done" && (
            <div className="neon-card fade-up text-center" style={{ background: "rgba(15,8,35,0.85)" }}>
              <div className="rainbow-bar" />
              <div className="p-8">
                <div className="relative w-24 h-24 mx-auto mb-5 flex items-center justify-center">
                  <div className="done-ring absolute w-24 h-24 rounded-full"
                    style={{ border: "2px solid rgba(250,204,21,0.3)" }} />
                  <div className="done-ring-2 absolute w-24 h-24 rounded-full"
                    style={{ border: "2px solid rgba(244,114,182,0.3)" }} />
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center gift-bounce shadow-2xl"
                    style={{ background: "linear-gradient(135deg,#f59e0b,#f472b6)", boxShadow: "0 8px 30px rgba(245,158,11,0.4)" }}>
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">You're In! 🎉</h2>
                <p className="text-sm text-white/55 mb-5 leading-relaxed">
                  Welcome to The God Gift VIP family!<br />
                  Instagram <span className="text-pink-300 font-bold">followers, likes & views</span> offers are coming to your WhatsApp!
                </p>
                <div className="flex items-center justify-center gap-2 rounded-xl px-4 py-3"
                  style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)" }}>
                  <MessageCircle className="w-4 h-4" style={{ color: "#25D366" }} fill="currentColor" />
                  <span className="text-xs font-bold text-white/70">Watch your WhatsApp for exclusive offers 📲</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-white/20 mt-5">
            Powered by <span className="text-white/40 font-bold">The God Gift CRM</span>
          </p>
        </div>
      </div>

      {popup === "existing" && <ExistingPopup name={existingName} onClose={handlePopupClose} />}
      {popup === "success"  && <SuccessPopup  name={name}         onClose={handlePopupClose} />}
    </>
  );
}
