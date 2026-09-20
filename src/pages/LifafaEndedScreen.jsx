import { useState } from "react";
import HeaderScreen from "../components/HeaderScreen";

// ── UTILS (module scope — TaskScreen jaisa hi pattern) ─────────────────────
const INR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const NUM = (n) => new Intl.NumberFormat("en-IN").format(Number(n) || 0);

// ── STATUS THEME MAP ────────────────────────────────────────────────────
const STATUS_THEME = {
  over: {
    emoji: "💸",
    badge: "BUDGET OVER",
    heading: "Lifafa Over Ho Gaya!",
    subtitle: "Is lifafa ka pura budget claim ho chuka hai. Naye lifafa ka wait kare.",
    ring: "#f43f5e",
    glow: "bg-rose-500/20",
    chip: "bg-rose-500/10 text-rose-300 border-rose-400/20",
    gradient: "from-rose-500 via-red-500 to-rose-600",
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
    gradient: "from-sky-400 via-blue-500 to-sky-600",
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
    gradient: "from-amber-400 via-orange-500 to-amber-500",
    shadow: "shadow-[0_10px_30px_rgba(255,170,0,0.35)]",
  },
};

export default function LifafaEndedScreen({ status, message, lifafa }) {
  const [copied, setCopied] = useState(false);
  const theme = STATUS_THEME[status] || STATUS_THEME.inactive;

  const title = lifafa?.title || "";
  const totalBudget = Number(lifafa?.totalBudget || 0);
  const remainingBudget = Number(lifafa?.remainingBudget || 0);
  const claimedUsers = Number(lifafa?.claimedUsers ?? 0);
  const amountPerUser = Number(lifafa?.amountPerUser || 0);

  const spentAmt = Math.max(0, totalBudget - remainingBudget);
  const spentPct = totalBudget > 0 ? Math.min(100, (spentAmt / totalBudget) * 100) : 100;

  const handleSupportClick = () => {
    const supportUsername = String(lifafa?.support || "TaskWala_Solution_India_Help")
      .replace("@", "")
      .trim();
    if (!supportUsername) return;

    const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "";
    const msg = `I want help on bot Lifafa - ${title}.\nStatus: ${status}\nMy Telegram ID: ${tgId}`;
    const url = `https://t.me/${supportUsername}?text=${encodeURIComponent(msg)}`;

    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(url);
    } else {
      window.open(url, "_blank");
    }
  };

  const handleClose = () => {
    try {
      window.Telegram?.WebApp?.close();
    } catch {
      /* telegram ke bahar ho to ignore */
    }
  };

  const copyId = async () => {
    if (!lifafa?.id) return;
    try {
      await navigator.clipboard.writeText(lifafa.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked - silently ignore */
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-x-hidden relative scrollbar-hide">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

          @keyframes softPulseEnded {
            0%, 100% { opacity: 0.65; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.06); }
          }
          .pulse-emoji-ended { animation: softPulseEnded 2.4s ease-in-out infinite; }
        `}
      </style>

      {/* Glow BG — status color ke hisaab se */}
      <div className={`absolute top-[-120px] left-[-120px] w-[260px] h-[260px] ${theme.glow} blur-3xl rounded-full`}></div>
      <div className={`absolute bottom-[-100px] right-[-100px] w-[240px] h-[240px] ${theme.glow} blur-3xl rounded-full`}></div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-5 pb-10 flex flex-col gap-4">
        <HeaderScreen />

        {/* STATUS HERO CARD */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-white/10 rounded-[30px] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] text-center">
          <div className={`absolute top-0 right-0 w-32 h-32 ${theme.glow} blur-3xl rounded-full`}></div>

          <div className="relative z-10 flex flex-col items-center">
            <span
              className={`inline-block text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full border mb-4 ${theme.chip}`}
            >
              {theme.badge}
            </span>

            <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-4xl pulse-emoji-ended mb-4">
              {theme.emoji}
            </div>

            <h1 className="text-xl font-extrabold leading-tight">{theme.heading}</h1>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              {message || theme.subtitle}
            </p>

            {title && (
              <div className="mt-4 w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-xs text-gray-500 font-semibold shrink-0">Task</span>
                <span className="text-sm font-bold truncate max-w-[220px]">{title}</span>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS / STATS CARD — TaskScreen ke ProgressCard jaisa hi look */}
        {(totalBudget > 0 || claimedUsers > 0) && (
          <div className="relative bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-zinc-800 rounded-2xl p-4 space-y-4 overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                backgroundImage: `linear-gradient(to right, transparent, ${theme.ring}99, transparent)`,
              }}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.25em] mb-1"
                  style={{ color: `${theme.ring}b3` }}
                >
                  Remaining Budget
                </p>
                <p className="text-3xl font-black text-white leading-none truncate">
                  {INR(remainingBudget)}
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">of {INR(totalBudget)} total</p>
              </div>

              <div className="relative flex-shrink-0 w-14 h-14">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#27272a" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke={theme.ring}
                    strokeWidth="3"
                    strokeDasharray={`${spentPct * 0.974} 97.4`}
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ color: theme.ring }}
                >
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
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${spentPct}%`,
                    backgroundImage: `linear-gradient(to right, ${theme.ring}, ${theme.ring}cc)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600">
                <span>{spentPct.toFixed(1)}% budget used</span>
                {amountPerUser > 0 && <span>₹{NUM(amountPerUser)} / user</span>}
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <button
          onClick={handleSupportClick}
          className={`relative overflow-hidden w-full h-14 rounded-2xl bg-gradient-to-r ${theme.gradient} text-black font-extrabold text-lg ${theme.shadow} active:scale-[0.98] transition-all`}
        >
          <span className="relative z-10">🎧 Contact Support</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
        </button>

        <button
          onClick={handleClose}
          className="w-full h-12 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-gray-300 font-bold text-sm active:scale-[0.98] transition-all"
        >
          Close
        </button>

        {lifafa?.id && (
          <button
            onClick={copyId}
            className="flex items-center justify-center gap-2 text-[11px] text-gray-500"
          >
            <span>Lifafa ID: {lifafa.id}</span>
            <span className="text-amber-300 font-bold">{copied ? "Copied ✓" : "Copy"}</span>
          </button>
        )}

        {/* FOOTER */}
        <div className="text-center pt-1 pb-2">
          <p className="text-[11px] text-gray-600">
            Powered by <span className="text-white font-semibold">TaskWala Solution India</span>
          </p>
        </div>
      </div>
    </div>
  );
                                                                  }

