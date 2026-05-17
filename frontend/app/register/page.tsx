"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import {
  Phone, User, Instagram, CheckCircle2,
  Sparkles, Gift, MessageCircle, Star, Zap, Heart,
  Loader2, ChevronRight, X, Send
} from "lucide-react";
import { customerApi } from "@/services/api";
import { isValidWhatsAppNumber, isValidInstagramUrl } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = "phone" | "details" | "done";
type PopupType = "existing" | "success" | null;

// ─── Floating particle ───────────────────────────────────────────────────────
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none animate-float"
      style={style}
    />
  );
}

// ─── Existing Customer Popup ─────────────────────────────────────────────────
function ExistingPopup({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm animate-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          {/* Top gradient bar */}
          <div className="h-2 bg-gradient-to-r from-blue-400 via-violet-500 to-purple-500" />

          <div className="p-7 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-5 relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                <Heart className="w-9 h-9 text-violet-500" fill="currentColor" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                <Star className="w-4 h-4 text-white" fill="white" />
              </div>
            </div>

            <h2 className="text-xl font-black text-gray-900 mb-1">
              வணக்கம், {name}! 👋
            </h2>
            <p className="text-sm font-semibold text-violet-600 mb-4">
              Already a Member
            </p>

            <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl p-4 mb-5 border border-violet-100">
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                உங்கள் details ஏற்கனவே எங்களிடம் இருக்கு! 🎉
              </p>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Your data is safe with us. We'll send exclusive offers &amp; updates directly to your WhatsApp!
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 bg-green-50 rounded-xl px-4 py-3 mb-5 border border-green-100">
              <MessageCircle className="w-4 h-4 text-green-600" fill="currentColor" />
              <span className="text-xs font-semibold text-green-700">
                Offers will be shared on WhatsApp 📲
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-violet-200 active:scale-95 transition-transform"
            >
              Got it, Thanks! ✨
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm animate-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />

          <div className="p-7 text-center">
            {/* Animated check */}
            <div className="w-20 h-20 mx-auto mb-5 relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center animate-pulse-soft">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-black text-gray-900 mb-1">
              Welcome, {name}! 🎊
            </h2>
            <p className="text-sm font-semibold text-emerald-600 mb-4">
              Successfully Registered
            </p>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 mb-4 border border-green-100">
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                உங்கள் registration successful! 🎉
              </p>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                You're now part of our exclusive family. Stay tuned for amazing offers!
              </p>
            </div>

            {/* WhatsApp offer notice */}
            <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl px-4 py-3 mb-5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4 text-white" fill="white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-800">WhatsApp Offers</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Exclusive offers & deals will be shared on your WhatsApp number soon! 📲
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-green-200 active:scale-95 transition-transform"
            >
              🎉 Awesome, Thank You!
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

  // Auto-check phone
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
    } finally {
      setSubmitting(false);
    }
  };

  const handlePopupClose = () => {
    setPopup(null);
    if (popup === "success") {
      setStep("done");
    }
  };

  const particles: CSSProperties[] = [
    { width: 8, height: 8, background: "#a78bfa", top: "10%", left: "8%", animationDelay: "0s", animationDuration: "6s" },
    { width: 12, height: 12, background: "#34d399", top: "20%", right: "10%", animationDelay: "1s", animationDuration: "8s" },
    { width: 6, height: 6, background: "#fbbf24", top: "60%", left: "5%", animationDelay: "2s", animationDuration: "7s" },
    { width: 10, height: 10, background: "#f472b6", bottom: "20%", right: "8%", animationDelay: "0.5s", animationDuration: "9s" },
    { width: 7, height: 7, background: "#60a5fa", top: "75%", left: "15%", animationDelay: "1.5s", animationDuration: "6.5s" },
    { width: 9, height: 9, background: "#fb923c", top: "35%", right: "5%", animationDelay: "3s", animationDuration: "7.5s" },
  ];

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes popup {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideRight {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-float { animation: float var(--duration, 6s) ease-in-out infinite; }
        .animate-popup { animation: popup 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #22c55e, #16a34a, #4ade80, #22c55e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .progress-bar { animation: slideRight 0.5s ease-out forwards; }
        .step-card {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .input-field {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
          padding: 0 48px 0 16px;
          font-size: 15px;
          font-weight: 500;
          background: white;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus { border-color: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.1); }
        .input-field.error { border-color: #f87171; box-shadow: 0 0 0 4px rgba(248,113,113,0.1); }
        .btn-primary {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.01em;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(34,197,94,0.35);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-primary:active { transform: scale(0.97); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
      `}</style>

      {/* Background */}
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12"
        style={{
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #f0f9ff 60%, #faf5ff 100%)",
        }}>

        {/* Animated blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #86efac, transparent)" }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #c4b5fd, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #67e8f9, transparent)" }} />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} style={{ ...p, position: "absolute" }} />
        ))}

        {/* Content */}
        <div className="relative w-full max-w-md z-10">

          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-100 rounded-full px-4 py-2 mb-5 shadow-sm">
              <Zap className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <span className="text-xs font-bold text-gray-700 tracking-wide uppercase">
                The God Gift — Exclusive Member
              </span>
            </div>

            {step !== "done" && (
              <>
                <h1 className="text-3xl font-black text-gray-900 leading-tight">
                  Join Our{" "}
                  <span className="shimmer-text">VIP Family</span>
                </h1>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  Get exclusive offers directly on your WhatsApp 🎁
                </p>
              </>
            )}
          </div>

          {/* Progress bar (only on details step) */}
          {step === "details" && (
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                <span className="text-green-600">✓ Phone verified</span>
                <span>Step 2 of 2</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full progress-bar" />
              </div>
            </div>
          )}

          {/* ── STEP 1: Phone ── */}
          {step === "phone" && (
            <div className="step-card rounded-3xl shadow-xl border border-white/60 overflow-hidden">
              {/* Top accent */}
              <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400" />

              <div className="p-7">
                {/* Step indicator */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shadow-md shadow-green-200">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Step 1 of 2</p>
                    <p className="text-sm font-bold text-gray-800">Enter your WhatsApp Number</p>
                  </div>
                </div>

                {/* Phone input */}
                <div className="relative mb-2">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <span className="text-base">🇮🇳</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !checking && handlePhoneNext()}
                    className={`input-field pl-12 pr-12 ${errors.phone ? "error" : ""}`}
                    style={{ paddingLeft: "52px" }}
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {checking && <Loader2 className="w-4 h-4 text-green-500 animate-spin" />}
                    {!checking && phoneValid === true && !existingId && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 font-medium mb-3 ml-1">{errors.phone}</p>
                )}

                <p className="text-xs text-gray-400 mb-6 ml-1">
                  We'll use this to send exclusive WhatsApp offers 📲
                </p>

                {/* Perks */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { icon: "🎁", label: "Exclusive Offers" },
                    { icon: "⚡", label: "Early Access" },
                    { icon: "💎", label: "VIP Deals" },
                  ].map((p) => (
                    <div key={p.label} className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
                      <div className="text-xl mb-1">{p.icon}</div>
                      <p className="text-[10px] font-semibold text-gray-500">{p.label}</p>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-primary"
                  onClick={handlePhoneNext}
                  disabled={checking || !phone.trim()}
                >
                  {checking ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</>
                  ) : (
                    <>Continue <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {step === "details" && (
            <div className="step-card rounded-3xl shadow-xl border border-white/60 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-violet-400 via-purple-500 to-pink-400" />

              <div className="p-7">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center shadow-md shadow-violet-200">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Step 2 of 2</p>
                    <p className="text-sm font-bold text-gray-800">Tell us about yourself</p>
                  </div>
                </div>

                {/* Verified phone badge */}
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 mb-5">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-green-700">{phone}</span>
                  <button
                    onClick={() => { setStep("phone"); setErrors({}); }}
                    className="ml-auto text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                      className={`input-field ${errors.name ? "error" : ""}`}
                      autoFocus
                    />
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.name}</p>}
                </div>

                {/* Instagram */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                    Instagram Page{" "}
                    <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://instagram.com/yourpage"
                      value={instagram}
                      onChange={(e) => { setInstagram(e.target.value); setErrors((p) => ({ ...p, instagram: "" })); }}
                      className={`input-field ${errors.instagram ? "error" : ""}`}
                    />
                    <Instagram className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                  </div>
                  {errors.instagram && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.instagram}</p>}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                    <p className="text-xs text-red-600 font-medium">{errors.submit}</p>
                  </div>
                )}

                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Submit Registration</>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  🔒 Your data is 100% private &amp; secure
                </p>
              </div>
            </div>
          )}

          {/* ── DONE STATE ── */}
          {step === "done" && (
            <div className="step-card rounded-3xl shadow-xl border border-white/60 overflow-hidden text-center">
              <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400" />
              <div className="p-10">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center animate-pulse-soft">
                  <Gift className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">You're In! 🎉</h2>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Welcome to The God Gift family. Exclusive WhatsApp offers are coming your way soon!
                </p>
                <div className="flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl px-4 py-3">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" fill="currentColor" />
                  <span className="text-xs font-semibold text-gray-700">Watch your WhatsApp for offers 📲</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Powered by{" "}
            <span className="font-bold text-green-600">The God Gift CRM</span>
          </p>
        </div>
      </div>

      {/* Popups */}
      {popup === "existing" && (
        <ExistingPopup name={existingName} onClose={handlePopupClose} />
      )}
      {popup === "success" && (
        <SuccessPopup name={name} onClose={handlePopupClose} />
      )}
    </>
  );
}
