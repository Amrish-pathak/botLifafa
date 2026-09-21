import { useState, useEffect } from "react";
import HeaderScreen from "../components/HeaderScreen";

const INR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n) || 0);
const NUM = (n) => new Intl.NumberFormat("en-IN").format(Number(n) || 0);

const STATUS_THEME = {
  over: {
    emoji: "💸",
    badge: "BUDGET OVER",
    heading: "Lifafa Over Ho Gaya!",
    subtitle: "Is lifafa ka pura budget claim ho chuka hai. Naye lifafa ka wait kare.",
    ring: "#f43f5e",
    glow: "bg-rose-500/20",
    chip: "bg-rose-500/10 text-rose-300 border-rose-400/20",
    dot: "bg-rose-400",
    gradient: "from-rose-500 via-red-500 to-rose-600",
    logoGradient: "from-rose-500/25 to-red-600/10",
    shadow: "shadow-[0_10px_30px_rgba(244,63,94,0.35)]",
  },
  complete: {
    emoji: "✅",
    badge: "COMPLETED",
    heading: "Lifafa Complete Ho Gaya!",
    subtitle: "Is lifafa ke saare slots fill ho chuke hain.",
    ring: "#38bdf8",
    glow: "bg-sky-500/20",
    chip: "bg-sky-500/10 text-sky-300 border-sky-400/20",
    dot: "bg-sky-400",
    gradient: "from-sky-400 via-blue-500 to-sky-600",
    logoGradient: "from-sky-500/25 to-blue-600/10",
    shadow: "shadow-[0_10px_30px_rgba(56,189,248,0.35)]",
  },
  inactive: {
    emoji: "⏸️",
    badge: "INACTIVE",
    heading: "Lifafa Abhi Inactive Hai",
    subtitle: "Yeh lifafa filhaal active nahi hai. Thodi der baad try kare.",
    ring: "#fbbf24",
    glow: "bg-amber-500/20",
    chip: "bg-amber-500/10 text-amber-300 border-amber-400/20",
    dot: "bg-amber-400",
    gradient: "from-amber-400 via-orange-500 to-amber-500",
    logoGradient: "from-amber-500/25 to-orange-600/10",
    shadow: "shadow-[0_10px_30px_rgba(255,170,0,0.35)]",
  },
};

// ── Countdown hook — deadline (ISO string) tak remaining seconds return karta hai ──
function useCountdown(deadlineIso) {
  const [remaining, setRemaining] = useState(() => {
    if (!deadlineIso) return 0;
    return Math.max(0, Math.floor((new Date(deadlineIso).getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!deadlineIso) return;
    const tick = () => {
      const secs = Math.max(0, Math.floor((new Date(deadlineIso).getTime() - Date.now()) / 1000));
      setRemaining(secs);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineIso]);

  return remaining;
}

const formatMMSS = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function LifafaEndedScreen({ status, message, lifafa, alreadyStarted, inviteStatus }) {
  const [copied, setCopied] = useState(false);
  const theme = STATUS_THEME[status] || STATUS_THEME.inactive;

  const title = lifafa?.title || "TaskWala";
  const totalBudget = Number(lifafa?.totalBudget || 0);
  const remainingBudget = Number(lifafa?.remainingBudget || 0);
  const claimedUsers = Number(lifafa?.claimedUsers ?? 0);
  const amountPerUser = Number(lifafa?.amountPerUser || 0);

  const spentAmt = Math.max(0, totalBudget - remainingBudget);
  const spentPct = totalBudget > 0 ? Math.min(100, (spentAmt / totalBudget) * 100) : 100;

  // 5-min grace window sirf "over" status pe, sirf jab user pehle se task
  // start kar chuka ho (invite exist karta ho) aur abhi claimed na ho
  const deadlineIso = lifafa?.listenerStopAt || null;
  const remainingSeconds = useCountdown(status === "over" ? deadlineIso : null);
  const showGraceWindow =
    status === "over" &&
    alreadyStarted &&
    inviteStatus !== "claimed" &&
    deadlineIso &&
    remainingSeconds > 0;
  const graceWindowJustExpired =
    status === "over" && alreadyStarted && inviteStatus !== "claimed" && deadlineIso && remainingSeconds <= 0;

  const handleSupportClick = () => {
    const supportUsername = String(lifafa?.support || "TaskWala_Solution_India_Help").replace("@", "").trim();
    if (!supportUsername) return;
    const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "";
    const msg = `I want help on bot Lifafa - ${title}.\nStatus: ${status}\nMy Telegram ID: ${tgId}`;
    const url = `https://t.me/${supportUsername}?text=${encodeURIComponent(msg)}`;
    if (window.Telegram?.WebApp?.openTelegramLink) window.Telegram.WebApp.openTelegramLink(url);
    else window.open(url, "_blank");
  };

  const handleClose = () => {
    try { window.Telegram?.WebApp?.close(); } catch { /* ignore */ }
  };

  const copyId = async () => {
    if (!lifafa?.id) return;
    try {
      await navigator.clipboard.writeText(lifafa.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard blocked */ }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-x-hidden relative scrollbar-hide">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes softPulseEnded { 0%,100%{opacity:.65;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
          .pulse-emoji-ended { animation: softPulseEnded 2.4s ease-in-out infinite; }
          @keyframes urgentPulse { 0%,100%{opacity:1} 50%{opacity:.55} }
          .urgent-pulse { animation: urgentPulse 1s ease-in-out infinite; }
          @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
          .dot-pulse { animation: dotPulse 1.6s ease-in-out infinite; }
        `}
      </style>

      <div className={`absolute top-[-120px] left-[-120px] w-[260px] h-[260px] ${theme.glow} blur-3xl rounded-full pointer-events-none`}></div>
      <div className={`absolute bottom-[-100px] right-[-100px] w-[240px] h-[240px] ${theme.glow} blur-3xl rounded-full pointer-events-none`}></div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-5 pb-10 flex flex-col gap-4">
        <HeaderScreen />

        {/* ── BOT / TASK IDENTITY ROW — naam left (big), logo right ───────── */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-1">
              Task
            </p>
            <h1 className="text-[26px] leading-[1.1] font-black text-white truncate">
              {title}
            </h1>
          </div>

          <div
            className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.logoGradient} border border-white/10 flex items-center justify-center text-3xl shadow-lg pulse-emoji-ended`}
          >
            🧧
          </div>
        </div>

        {/* ── MESSAGE CARD ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-white/10 rounded-[28px] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className={`absolute top-0 right-0 w-32 h-32 ${theme.glow} blur-3xl rounded-full pointer-events-none`}></div>
          <div className="relative z-10">
            <h2 className="text-lg font-extrabold leading-snug">{theme.heading}</h2>
            <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
              {message || theme.subtitle}
            </p>
          </div>
        </div>

        {/* ── BUDGET / PROGRESS CARD ───────────────────────────────────── */}
        {(totalBudget > 0 || claimedUsers > 0) && (
          <div className="relative bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-zinc-800 rounded-2xl p-4 space-y-4 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ backgroundImage: `linear-gradient(to right, transparent, ${theme.ring}99, transparent)` }} />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: `${theme.ring}b3` }}>
                  Remaining Budget
                </p>
                <p className="text-3xl font-black text-white leading-none truncate">{INR(remainingBudget)}</p>
                <p className="text-[10px] text-zinc-500 mt-1">of {INR(totalBudget)} total</p>
              </div>
              <div className="relative flex-shrink-0 w-14 h-14">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#27272a" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke={theme.ring} strokeWidth="3"
                    strokeDasharray={`${spentPct * 0.974} 97.4`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: theme.ring }}>
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
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${spentPct}%`, backgroundImage: `linear-gradient(to right, ${theme.ring}, ${theme.ring}cc)` }} />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600">
                <span>{spentPct.toFixed(1)}% budget used</span>
                {amountPerUser > 0 && <span>₹{NUM(amountPerUser)} / user</span>}
              </div>
            </div>
          </div>
        )}

        {/* ── SPACER — timer/support ko bottom actions ke paas group karta hai ── */}
        <div className="flex-1 min-h-[4px]" />

        {/* ── GRACE TIMER — ab seedha Support button ke UPAR, action se juda hua ── */}
        {showGraceWindow && (
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/20 to-red-500/10 border-2 border-amber-400/40 rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(251,191,36,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-lg shrink-0 urgent-pulse">
                ⚡
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-amber-300 font-extrabold text-[13px] leading-tight">
                  Jaldi task complete karo!
                </p>
                <p className="text-[10.5px] text-amber-100/75 mt-0.5 leading-snug">
                  Itni der tak hi manual process hoga.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-1.5 bg-black/30 rounded-xl px-3 py-2">
                <span className="text-base">⏳</span>
                <span className="text-lg font-black tabular-nums text-amber-300 tracking-wider">
                  {formatMMSS(remainingSeconds)}
                </span>
              </div>
            </div>
          </div>
        )}

        {graceWindowJustExpired && (
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3.5 text-center">
            <p className="text-gray-300 text-sm font-semibold">Processing window band ho chuki hai</p>
            <p className="text-gray-500 text-xs mt-1">
              Agar task complete kar liya tha, support se contact karo — admin manually check karega.
            </p>
          </div>
        )}

        {/* ── ACTIONS ───────────────────────────────────────────────────── */}
        <button onClick={handleSupportClick}
          className={`relative overflow-hidden w-full h-14 rounded-2xl bg-gradient-to-r ${theme.gradient} text-black font-extrabold text-lg ${theme.shadow} active:scale-[0.98] transition-all`}>
          <span className="relative z-10">🎧 Contact Support</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
        </button>

        <button onClick={handleClose}
          className="w-full h-12 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-gray-300 font-bold text-sm active:scale-[0.98] transition-all">
          Close
        </button>

        {/* ── STATUS — ab bottom-center, final confirmation ki tarah ──────── */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <span className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${theme.chip}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} dot-pulse`}></span>
            {theme.badge}
          </span>

          {lifafa?.id && (
            <button onClick={copyId} className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
              <span>Lifafa ID: {lifafa.id}</span>
              <span className="text-amber-300 font-bold">{copied ? "Copied ✓" : "Copy"}</span>
            </button>
          )}
        </div>

        <div className="text-center pt-1 pb-2">
          <p className="text-[11px] text-gray-600">
            Powered by <span className="text-white font-semibold">TaskWala Solution India</span>
          </p>
        </div>
      </div>
    </div>
  );
}
