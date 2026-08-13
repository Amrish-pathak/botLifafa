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
const ProgressCard = ({ lifafa }) => {
  const { claimedUsers = 0, totalUsers = 0, remainingBudget = 0, totalBudget = 0, amountPerUser = 0 } = lifafa;
  const progress = totalBudget / amountPerUser;
  const claimedPct = claimedUsers > 0 ? Math.min(100, (claimedUsers / progress) * 100) : 0;
  const spentAmt = Number(totalBudget) - Number(remainingBudget);
  const spentPct = totalBudget > 0 ? Math.min(100, (spentAmt / totalBudget) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-zinc-800 rounded-2xl p-4 space-y-4">
      {/* remaining budget — big display */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-xs tracking-widest text-xs text-amber-300/70 mb-1">
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
          <span>Users claimed</span>
          <span className="text-zinc-300">{NUM(claimedUsers)} / {NUM(progress - claimedUsers)}</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
            style={{ width: `${claimedPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-zinc-600">
          <span>{claimedPct.toFixed(1)}% claimed</span>
          <span>{NUM(progress - claimedUsers)} pending</span>
        </div>
      </div>
    </div>
  );
};

// ── MOBILE NUMBER SHEET ─────────────────────────────────────────────────
// Start button click pe khulta hai. Number submit → /add-mobile call →
// success pe task link open (parent ka onOpenTask, jo WebApp.openLink use karta hai)
function MobileNumberSheet({ open, onClose, claimAmount, onAddMobile, onOpenTask }) {
  useLockBodyScroll(open);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Sheet dobara open ho to purana state clear ─────────────────────────
  useEffect(() => {
    if (open) {
      setMobile("");
      setError("");
      setSubmitting(false);
      setSuccess(false);
    }
  }, [open]);

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

  const handleSubmit = async () => {
    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      haptic("error");
      return;
    }

    haptic();
    setSubmitting(true);
    setError("");

    try {
      await onAddMobile(mobile);
      haptic("success");
      setSuccess(true);
     onOpenTask()// ── task link turant open — WebApp.openLink, popup-blocker-proof
    } catch (err) {
      haptic("error");
      setError(err?.response?.data?.message || "Something went wrong, please try again");
    } finally {
      setSubmitting(false);
    }
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
        {/* Drag handle */}
        <div className="w-10 h-1.5 bg-white/15 rounded-full mx-auto mb-4" />

        {!success ? (
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
                  onClick={onClose}
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
        ) : (
          <div className="text-center py-2 pb-1">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-3xl">
              ✅
            </div>
            <h3 className="text-lg font-bold text-white">Task Started!</h3>
            <p className="text-xs text-gray-400 mt-1.5 mb-5">
               Complete Provided Task & automatically Recieved Money in Your TaskWala Wallet.
            </p>
            <button
              onClick={onStart}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black font-extrabold text-base shadow-[0_10px_30px_rgba(255,170,0,0.3)] active:scale-[0.98] transition-all"
            >
              Let's Complete 
            </button>
            <button onClick={onClose} className="w-full h-11 mt-2 rounded-2xl text-gray-400 text-sm font-medium active:scale-95 transition-all">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TaskScreen({ lifafa, onStart, onAddMobile }) {
  const [showSteps, setShowSteps] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const title = lifafa?.title || "Premium Classic Task";
  const claimAmount = lifafa?.claimAmount ?? "0";
  const refConditionName = lifafa?.refConditionName ?? "0";

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

        {/* START BUTTON — ab bottom sheet kholta hai, seedha task open nahi karta */}
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
        onAddMobile={onAddMobile}
        onOpenTask={onStart}
      />
    </div>
  );
              }
