import { useState, useEffect } from "react";
import HeaderScreen from "../components/HeaderScreen";

// ── UTILS (module scope — instances har render pe naye nahi banenge) ──────
const INR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const NUM = (n) => new Intl.NumberFormat("en-IN").format(Number(n) || 0);

const formatMobileDisplay = (m = "") => (m.length === 10 ? `${m.slice(0, 5)} ${m.slice(5)}` : m);

// ── BODY SCROLL LOCK — bottom sheet khulte hi background freeze ────────────
function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

// ── PROGRESS CARD (module scope — TaskScreen re-render se decouple) ───────
// ✅ FIX: pehle `totalUsers` ko `totalBudget / amountPerUser` se derive kiya
// jaata tha. Yeh galat hai — agar admin lifafa edit karke claimAmount badal
// de (jo kabhi bhi ho sakta hai), yeh number turant wrong ho jaata hai kyunki
// totalBudget purane rate ke hisaab se set hua tha. Ab sirf woh values use
// ho rahi hain jo backend se hamesha live/correct milti hain: claimedUsers
// (actual count) aur remainingBudget (actual amount) — koi client-side
// guess nahi jo claimAmount edit se toot sake.
const ProgressCard = ({ lifafa }) => {
  const {
    claimedUsers = 0,
    remainingBudget = 0,
    totalBudget = 0,
    amountPerUser = 0,
  } = lifafa;

  const spentAmt = Math.max(0, Number(totalBudget) - Number(remainingBudget));
  const spentPct = totalBudget > 0 ? Math.min(100, (spentAmt / totalBudget) * 100) : 0;

  // "Current rate" ke hisaab se estimate — clearly "~" (approx) label ke saath,
  // taaki koi false precision na lage
  const estRemainingSlots = amountPerUser > 0 ? Math.floor(Number(remainingBudget) / amountPerUser) : 0;

  return (
    <div className="bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-zinc-800 rounded-2xl p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300/70 mb-1">
            Remaining Budget
          </p>
          <p className="text-3xl font-black text-white leading-none">{INR(remainingBudget)}</p>
          <p className="text-[10px] text-zinc-500 mt-1">of {INR(totalBudget)} total</p>
        </div>

        <div className="relative flex-shrink-0 w-14 h-14">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#27272a" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.5" fill="none"
              stroke="#10b981" strokeWidth="3"
              strokeDasharray={`${spentPct * 0.974} 97.4`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-400">
            {Math.round(spentPct)}%
          </span>
        </div>
      </div>

      <div className="border-t border-zinc-800" />

      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-semibold text-zinc-500">
          <span>Budget Used</span>
          <span className="text-zinc-300">{NUM(claimedUsers)} claimed</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
            style={{ width: `${spentPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-zinc-600">
          <span>{spentPct.toFixed(1)}% budget used</span>
          <span>~{NUM(estRemainingSlots)} spots left</span>
        </div>
      </div>
    </div>
  );
};

// ── MOBILE NUMBER SHEET ─────────────────────────────────────────────────
// ✅ FIX: agar `existingMobile` already hai (backend se aaya), sheet
// "view mode" me khulti hai — number seedha dikh jaata hai, "Continue" pe
// koi API call nahi hoti, seedha task open ho jaata hai. Sirf "Change"
// click karne par ya naye number ke case me hi add-mobile API hit hoti hai.
function MobileNumberSheet({ open, onClose, claimAmount, existingMobile, onAddMobile, onOpenTask }) {
  useLockBodyScroll(open);
  const [editing, setEditing] = useState(!existingMobile);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // ── Sheet dobara open ho to state reset — existingMobile ke hisaab se
  // sahi mode (view/edit) set karo ────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setEditing(!existingMobile);
      setMobile(existingMobile || "");
      setError("");
      setSubmitting(false);
      setSuccess(false);
      setCountdown(3);
    }
  }, [open, existingMobile]);

  // ── Success hote hi 3-second auto-redirect countdown ────────────────────
  useEffect(() => {
    if (!success) return;

    setCountdown(3);
    const tick = setInterval(() => {
      setCountdown((c) => (c > 1 ? c - 1 : 0));
    }, 1000);

    const redirect = setTimeout(() => {
      onOpenTask();
    }, 3000);

    return () => {
      clearInterval(tick);
      clearTimeout(redirect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const haptic = (type) => {
    try {
      const hf = window.Telegram?.WebApp?.HapticFeedback;
      if (!hf) return;
      if (type === "success" || type === "error") hf.notificationOccurred(type);
      else hf.impactOccurred("light");
    } catch {
      /* haptics available na ho to silently ignore */
    }
  };

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(digits);
    if (error) setError("");
  };

  // ── Naya number ya number change — sirf tabhi API hit hoti hai ─────────
  const handleSubmit = async () => {
    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      haptic("error");
      return;
    }

    // User ne wahi purana number type kar diya — API hit karne ki zaroorat nahi
    if (existingMobile && mobile === existingMobile) {
      haptic();
      onClose();
      onOpenTask();
      return;
    }

    haptic();
    setSubmitting(true);
    setError("");

    try {
      await onAddMobile(mobile);
      haptic("success");
      setSuccess(true); // ── useEffect [success] khud 3s baad onOpenTask() call karega
    } catch (err) {
      haptic("error");
      setError(
        err?.response?.data?.message ||
        "Something went wrong, please try again"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Existing number ke saath seedha aage — koi API call nahi ────────────
  const handleContinueExisting = () => {
    haptic();
    onClose();
    onOpenTask();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center"
      onClick={submitting ? undefined : onClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-[#161c2c] to-[#0b0f19] border-t border-white/10 rounded-t-[32px] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] px-5 pt-3"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-white/15 rounded-full mx-auto mb-4" />

        {success ? (
          <div className="text-center py-2 pb-1">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-3xl">
              ✅
            </div>
            <h3 className="text-lg font-bold text-white">Task Started!</h3>
            <p className="text-xs text-gray-400 mt-1.5 mb-1">
              Complete Provided Task &amp; automatically Recieved Money in Your TaskWala Wallet.
            </p>
            <p className="text-[11px] text-amber-300/80 mb-5">
              Redirecting in {countdown}s…
            </p>
            <button
              onClick={onOpenTask}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black font-extrabold text-base shadow-[0_10px_30px_rgba(255,170,0,0.3)] active:scale-[0.98] transition-all"
            >
              Let's Complete &amp; Earn
            </button>
            <button onClick={onClose} className="w-full h-11 mt-2 rounded-2xl text-gray-400 text-sm font-medium active:scale-95 transition-all">
              Close
            </button>
          </div>
        ) : !editing ? (
          // ══════════════ VIEW MODE — number already saved ══════════════
          <>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-lg font-bold text-white">Wallet Number</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Reward ₹{claimAmount} isi number pe credit hoga
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 active:scale-95 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl px-4 h-14">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-semibold text-base">+91</span>
                <div className="w-px h-6 bg-white/10" />
                <span className="text-white text-lg font-semibold tracking-wide">
                  {formatMobileDisplay(existingMobile)}
                </span>
              </div>
              <button
                onClick={() => { setEditing(true); setMobile(existingMobile); }}
                className="text-amber-300 text-xs font-bold active:opacity-70 px-1"
              >
                Change
              </button>
            </div>

            <button
              onClick={handleContinueExisting}
              className="w-full h-14 mt-5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black font-extrabold text-base shadow-[0_10px_30px_rgba(255,170,0,0.3)] active:scale-[0.98] transition-all"
            >
              Continue & Start Task
            </button>

            <p className="text-center text-[10px] text-gray-600 mt-3 pb-1">
              Number sirf reward payout ke liye use hoga
            </p>
          </>
        ) : (
          // ══════════════ EDIT MODE — naya number ya "Change" ══════════════
          <>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-lg font-bold text-white">Enter Wallet Number</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Reward ₹{claimAmount} isi TaskWala wallet number pe credit hoga
                </p>
              </div>
              {!submitting && (
                <button
                  onClick={existingMobile ? () => { setEditing(false); setError(""); } : onClose}
                  className="w-9 h-9 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 active:scale-95 transition-all"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="mt-4">
              <div
                className={`flex items-center gap-2 bg-white/[0.04] border rounded-2xl px-4 h-14 transition-colors ${
                  error ? "border-red-500/60" : "border-white/10 focus-within:border-amber-400/60"
                }`}
              >
                <span className="text-gray-400 font-semibold text-base">+91</span>
                <div className="w-px h-6 bg-white/10" />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  value={mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  disabled={submitting}
                  className="flex-1 bg-transparent outline-none text-white text-lg font-semibold tracking-wide placeholder-gray-600 disabled:opacity-50"
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-2 px-1">{error}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || mobile.length !== 10}
              className="w-full h-14 mt-5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black font-extrabold text-base shadow-[0_10px_30px_rgba(255,170,0,0.3)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Submitting…
                </>
              ) : (
                "Continue & Start Task"
              )}
            </button>

            <p className="text-center text-[10px] text-gray-600 mt-3 pb-1">
              Number sirf reward payout ke liye use hoga
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function TaskScreen({ lifafa, onStart, onAddMobile, onOpenRefer }) {
  const [showSteps, setShowSteps] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const title = lifafa?.title || "Premium Classic Task";
  const claimAmount = lifafa?.claimAmount ?? "0";
  const refConditionName = lifafa?.refConditionName ?? "Direct Join";
  const existingMobile = lifafa?.mobile || "";

  // ── Support click — API se aaye `support` username pe seedha message
  // ke saath redirect, telegram ID bhi attach ─────────────────────────────
  const handleSupportClick = () => {
    const supportUsername = String(lifafa?.support || "").replace("@", "").trim();
    if (!supportUsername) return;

    const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "";
    const message = `I want help on bot Lifafa.\nMy Telegram ID: ${tgId}`;
    const url = `https://t.me/${supportUsername}?text=${encodeURIComponent(message)}`;

    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(url);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-x-hidden relative scrollbar-hide">
      {/* Hide Scrollbar */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* Glow BG */}
      <div className="absolute top-[-120px] left-[-120px] w-[260px] h-[260px] bg-amber-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[240px] h-[240px] bg-orange-500/20 blur-3xl rounded-full"></div>

      {/* ── FLOATING RIGHT-SIDE BUTTONS — Support + Refer&Earn ────────────
          Emoji-based icons, koi naya icon-library import nahi — lightweight
          aur fast loading ke liye ── */}
      <div className="fixed right-3 top-[38%] z-40 flex flex-col gap-3">
        <button
          onClick={handleSupportClick}
          aria-label="Support"
          className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.4)] flex items-center justify-center text-xl active:scale-90 transition-transform"
        >
          🎧
        </button>
        <button
          onClick={onOpenRefer}
          aria-label="Refer & Earn"
          className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.4)] flex items-center justify-center text-xl active:scale-90 transition-transform"
        >
          🎁
        </button>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-5 flex flex-col gap-4">
        <HeaderScreen />

        {/* REWARD CARD */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-white/10 rounded-[30px] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            <p className="uppercase tracking-[0.25em] text-xs text-amber-300/70">Reward Task</p>
            <h2 className="mt-3 text-2xl font-bold leading-tight">{title}</h2>

            <div className="mt-5 flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4">
              <div>
                <p className="text-sm text-gray-400">Total Reward</p>
                <p className="text-4xl font-black text-amber-300 mt-1">₹{claimAmount}</p>
              </div>
              <div className="text-5xl animate-bounce">💰</div>
            </div>
          </div>
        </div>

        {/* Progress + Remaining Card */}
        <ProgressCard lifafa={lifafa} />

        {/* COLLAPSIBLE STEPS */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[28px] overflow-hidden transition-all duration-300">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-400/10 flex items-center justify-center text-xl">
                📋
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold">How to Complete</h3>
                <p className="text-xs text-gray-400">Easy premium workflow</p>
              </div>
            </div>
            <div
              className={`w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-xl transition-all duration-300 ${
                showSteps ? "rotate-180" : ""
              }`}
            >
              ⌄
            </div>
          </button>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showSteps ? "max-h-[500px] opacity-100 p-4 pt-0" : "max-h-0 opacity-0"
            }`}
          >
             <div className="space-y-3">
              {[
                { icon: "🚀", title: "Start Task", desc: "Tap the button below to begin." },
                { icon: "📢", title: "Join Channel", desc: "Complete Telegram verification." },
                { icon: "✅", title: "Claim Reward", desc: "Receive reward instantly." },
                { icon: "🎥", title: "Watch Tutorial", desc: "Learn the completion process." },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-[#131a28] border border-white/5 rounded-2xl p-4 hover:bg-[#182132] transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* START BUTTON — sheet kholta hai (view/edit mode automatically decide hota hai) */}
        <button
          onClick={() => setSheetOpen(true)}
          className="relative overflow-hidden w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black font-extrabold text-lg shadow-[0_10px_30px_rgba(255,170,0,0.35)] active:scale-[0.98] transition-all"
        >
          <span className="relative z-10">Start & Claim ₹{claimAmount}</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
        </button>

        {/* FOOTER */}
        <div className="text-center pt-1 pb-5">
          <p className="text-xs text-gray-500 leading-5">
            By continuing you agree to the{" "}
            <button className="text-amber-300">terms & conditions</button>
          </p>
          <p className="mt-2 text-[11px] text-gray-600">
            Powered by <span className="text-white font-semibold">TaskWala Solution India</span>
          </p>
          {refConditionName !== "Direct Join" && (
            <p className="text-white font-semibold">Refer by - {refConditionName}</p>
          )}
        </div>
      </div>

      <MobileNumberSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        claimAmount={claimAmount}
        existingMobile={existingMobile}
        onAddMobile={onAddMobile}
        onOpenTask={onStart}
      />
    </div>
  );
    }
