import { useState, useMemo } from "react";
import HeaderScreen from "../components/HeaderScreen";

export default function ReferAndEarnScreen({
  taskAmount = 0,
  onBack,
  onReferLink,
}) {
  const [refAmount, setRefAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const maxRefAmount = Math.floor(taskAmount / 2);

  const validRefAmount = useMemo(() => {
    const val = Number(refAmount);
    if (!val || val <= 0) return 0;
    if (val > maxRefAmount) return maxRefAmount;
    return val;
  }, [refAmount, maxRefAmount]);

  const userReward = validRefAmount > 0 ? taskAmount - validRefAmount : taskAmount;

  const handleGenerateLink = async () => {
    if (!validRefAmount || validRefAmount < 0.1) {
      alert("Minimum referral amount is ₹0.10");
      return;
    }

    setLoading(true);
    try {
      await onReferLink(refAmount);
    } catch (err) {
      console.error("Generate link error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white relative overflow-hidden">
      
      {/* Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[260px] h-[260px] bg-amber-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[260px] h-[260px] bg-orange-500/20 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        
        <HeaderScreen />

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 mb-4 active:scale-95 transition-all"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* MAIN CARD */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[30px] p-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/20 rounded-full px-3 py-1 mb-2">
                <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
                  Referral System
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                Refer & Earn
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Share & earn passive income
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
              🎁
            </div>
          </div>

          {/* Task Amount */}
          <div className="bg-green-500/10 border border-green-400/20 rounded-2xl p-5 text-center mb-6">
            <p className="text-sm text-gray-300 mb-2">Base Task Reward</p>
            <h2 className="text-5xl font-black text-green-300">
              ₹{taskAmount}
            </h2>
            <p className="text-xs text-green-400/60 mt-2">Maximum shareable amount</p>
          </div>

          {/* Input */}
          <div className="mb-5">
            <label className="text-sm text-gray-400 mb-3 block">
              Set Referral Reward Amount
            </label>

            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={refAmount}
                onChange={(e) => setRefAmount(e.target.value)}
                disabled={loading}
                className="
                  w-full h-16 rounded-2xl
                  bg-[#131a28]
                  border border-white/10
                  px-5 pr-12
                  text-xl font-bold
                  focus:border-amber-400/40
                  focus:bg-[#182132]
                  outline-none
                  transition-all
                  disabled:opacity-50
                "
                placeholder={`Min ₹0.10 - Max ₹${maxRefAmount}`}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <span className="text-2xl font-black text-amber-300">₹</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 px-1">
              <span className="text-xs text-gray-500">Minimum: ₹0.10</span>
              <span className="text-xs text-amber-400 font-semibold">
                Maximum: ₹{maxRefAmount} (50%)
              </span>
            </div>
          </div>

          {/* Breakdown */}
          {validRefAmount > 0 && (
            <div className="space-y-3 mb-6">
              
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-400/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-lg">
                      💰
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">You Earn Per Referral</p>
                      <p className="font-bold text-lg text-amber-300">₹{validRefAmount}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-400/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-lg">
                      🎁
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Your Friend Gets</p>
                      <p className="font-bold text-lg text-green-300">₹{userReward}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateLink}
            disabled={!validRefAmount || validRefAmount < 0.1 || loading}
            className="
              w-full h-16 rounded-2xl
              bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500
              text-black text-lg font-black
              shadow-[0_10px_30px_rgba(251,146,60,0.3)]
              active:scale-[0.98]
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:active:scale-100
              flex
              items-center
              justify-center
              gap-2
            "
          >
            {loading ? (
              <>
                <span className="animate-spin text-xl">⏳</span>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate Referral Link</span>
                <span className="text-xl">✨</span>
              </>
            )}
          </button>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-center text-xs text-gray-500 leading-5">
              Powered by{" "}
              <span className="text-white font-semibold">
                TaskWala Solution India
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}