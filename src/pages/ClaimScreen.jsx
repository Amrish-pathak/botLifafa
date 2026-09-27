import { useState } from "react";
import HeaderScreen from "../components/HeaderScreen";
import BottomNav from "../components/BottomNav";

export default function ClaimScreen({ lifafa, onClaim, onOpenRefer, onOpenAllTasks }) {
  const [number, setNumber] = useState(lifafa?.mobile || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSupportClick = () => {
    const supportUsername = String(lifafa?.support || "TaskWala_Solution_India_Help").replace("@", "").trim();
    const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "";
    const msg = `I want help on bot Lifafa - ${lifafa?.title || "Task"}.\nMy Telegram ID: ${tgId}`;
    const url = `https://t.me/${supportUsername}?text=${encodeURIComponent(msg)}`;
    if (window.Telegram?.WebApp?.openTelegramLink) window.Telegram.WebApp.openTelegramLink(url);
    else window.open(url, "_blank");
  };

  const handleClaim = async () => {
    const digits = number.trim();

    // ⚡ FIX — pehle loose ".length < 6" check tha, ab proper 10-digit
    // Indian mobile validation (consistent baaki app ke saath)
    if (!/^[6-9][0-9]{9}$/.test(digits)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await onClaim(digits);
    } catch (err) {
      console.error("Claim failed:", err);
      setError(err?.response?.data?.message || "Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-hidden relative">
      <div className="px-4 pt-6">
        <HeaderScreen />
      </div>

      {/* Glow BG */}
      <div className="absolute top-[-120px] left-[-120px] w-[260px] h-[260px] bg-emerald-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[240px] h-[240px] bg-green-500/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-32">
        {/* MAIN CARD */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] overflow-hidden relative">
          {/* Top Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-green-300/70">
                  Reward Center
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight">
                  Claim Reward
                </h1>
              </div>

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-3xl shadow-lg">
                💸
              </div>
            </div>

            {/* Reward Card */}
            <div className="mt-6 bg-gradient-to-br from-green-500/15 to-emerald-500/10 border border-green-400/20 rounded-3xl p-5">
              <p className="text-sm text-gray-300">Available Reward</p>
              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-5xl font-black text-green-300">
                  ₹{lifafa.claimAmount}
                </h2>
                <div className="text-4xl animate-bounce">💰</div>
              </div>
            </div>

            {/* Input Section */}
            <div className="mt-6">
              <label className="text-sm text-gray-400 mb-2 block">
                TaskWala Number
              </label>

              <div className="relative">
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter Number"
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                    if (error) setError("");
                  }}
                  disabled={loading}
                  className={`w-full h-14 rounded-2xl bg-[#131a28] border px-5 text-white text-lg outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    error ? "border-red-500/60" : "border-white/10 focus:border-green-400/40 focus:bg-[#182132]"
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
                  📱
                </div>
              </div>
              {error && <p className="text-red-400 text-xs mt-2 px-1">{error}</p>}
              {lifafa?.mobile && (
                <p className="text-[11px] text-gray-500 mt-2 px-1">
                  Aapka pehle wala number pre-filled hai — zaroorat ho toh badal sakte hain
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-5 bg-blue-500/10 border border-blue-400/10 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-xl">ℹ️</div>
                <div>
                  <p className="font-semibold text-blue-300">
                    Instant Transfer
                  </p>
                  <p className="text-sm text-gray-400 mt-1 leading-5">
                    Your reward will be processed instantly after verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleClaim}
              disabled={loading || number.length !== 10}
              className="relative overflow-hidden mt-6 w-full h-14 rounded-2xl bg-gradient-to-r from-green-400 via-emerald-500 to-green-500 text-black text-lg font-black shadow-[0_10px_30px_rgba(0,255,120,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <span className="relative z-10">
                {loading ? "Processing..." : `Claim ₹${lifafa.claimAmount}`}
              </span>

              {!loading && (
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
              )}
            </button>

            {/* Footer */}
            <p className="mt-5 text-center text-xs text-gray-500 leading-5">
              Secure & encrypted reward system powered by{" "}
              <span className="text-white font-semibold">
                TaskWala Solution India
              </span>
            </p>
          </div>
        </div>
      </div>

      <BottomNav
        onSupport={handleSupportClick}
        onAllTasks={onOpenAllTasks}
        onRefer={onOpenRefer}
      />
    </div>
  );
}
