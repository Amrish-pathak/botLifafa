import { useState, useMemo, useEffect } from "react";
import HeaderScreen from "../components/HeaderScreen";

// ── 2-decimal rounding — floating point artifacts (0.1+0.2 jaisi cheezein) avoid karne ke liye
const round2 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;

export default function ReferAndEarnScreen({
  taskAmount = 0,
  existingMobile = "",     // ✅ NEW: agar khali hai, number bind karwana padega
  onBack,
  onReferLink,
  onAddMobile,             // ✅ NEW: TaskScreen wali hi add-mobile API
  totalEarned,             // ⏳ FUTURE: pass karoge to stats card dikhega
  totalReferrals,          // ⏳ FUTURE
  referList,               // ⏳ FUTURE: [{ name, amount }, ...]
}) {
  // ── Number binding state ────────────────────────────────────────────────
  const [boundMobile, setBoundMobile] = useState(existingMobile);
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [bindingMobile, setBindingMobile] = useState(false);

  useEffect(() => {
    setBoundMobile(existingMobile);
  }, [existingMobile]);

  // ── Referral amount state ────────────────────────────────────────────────
  const [refAmount, setRefAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState("");
  const [result, setResult] = useState(null); // backend se aaya referLink response
  const [copied, setCopied] = useState(false);

  // ✅ FIX: Math.floor() hata diya — 50% limit ab decimal-safe hai (0.10/0.50/0.55 sab accept honge)
  const maxRefAmount = round2(taskAmount / 2);

  const validRefAmount = useMemo(() => {
    const val = round2(refAmount);
    if (!val || val <= 0) return 0;
    if (val > maxRefAmount) return maxRefAmount;
    return val;
  }, [refAmount, maxRefAmount]);

  const userReward = round2(validRefAmount > 0 ? taskAmount - validRefAmount : taskAmount);

  const handleMobileChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(digits);
    if (mobileError) setMobileError("");
  };

  const handleBindMobile = async () => {
    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      setMobileError("Enter a valid 10-digit mobile number");
      return;
    }
    setBindingMobile(true);
    setMobileError("");
    try {
      await onAddMobile(mobile);
      setBoundMobile(mobile); // optimistic — parent doosri jagah bhi state update kar sakta hai
    } catch (err) {
      setMobileError(err?.response?.data?.message || "Something went wrong, please try again");
    } finally {
      setBindingMobile(false);
    }
  };

  const handleGenerateLink = async () => {
    if (!validRefAmount || validRefAmount < 0.1) {
      setGenError("Minimum referral amount is ₹0.10");
      return;
    }

    setGenError("");
    setLoading(true);
    try {
      // ✅ FIX: raw string refAmount ki jagah clamped/rounded validRefAmount bhej rahe hain
      const res = await onReferLink(validRefAmount);
      setResult(res || null);
    } catch (err) {
      setGenError(err?.response?.data?.message || "Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.referLink) return;
    try {
      await navigator.clipboard.writeText(result.referLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard access na ho to silently ignore */
    }
  };

  const handleShare = () => {
    if (!result?.referLink) return;
    const text = encodeURIComponent(`🎁 Earn ₹${round2(result.userAmount ?? userReward)}! Complete this task:`);
    const url = `https://t.me/share/url?url=${encodeURIComponent(result.referLink)}&text=${text}`;
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(url);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[260px] h-[260px] bg-amber-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[260px] h-[260px] bg-orange-500/20 blur-3xl rounded-full" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-purple-500/5 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        <HeaderScreen />

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 mb-4 active:scale-95 transition-all"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* ⏳ FUTURE stats — sirf tab dikhega jab parent inhe pass kare */}
        {(totalEarned !== undefined || totalReferrals !== undefined) && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Total Earned</p>
              <p className="text-xl font-black text-emerald-300">₹{round2(totalEarned || 0)}</p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Total Referred</p>
              <p className="text-xl font-black text-amber-300">{totalReferrals || 0}</p>
            </div>
          </div>
        )}

        {/* MAIN CARD */}
        <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[30px] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-2xl" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/20 rounded-full px-3 py-1 mb-2">
                <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
                  Referral System
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">Refer & Earn</h1>
              <p className="text-sm text-gray-400 mt-1">Share & earn passive income</p>
            </div>
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
              🎁
            </div>
          </div>

          {!boundMobile ? (
            // ══════════════ STEP 0: NUMBER BIND ══════════════
            <div className="relative z-10">
              <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4 mb-5 flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <p className="text-xs text-amber-200/90 leading-5">
                  Refer link banane se pehle apna wallet number bind karo — isi number pe reward credit hoga.
                </p>
              </div>

              <label className="text-sm text-gray-400 mb-3 block">Wallet Number</label>
              <div className={`flex items-center gap-2 bg-[#131a28] border rounded-2xl px-4 h-16 transition-colors ${
                mobileError ? "border-red-500/60" : "border-white/10 focus-within:border-amber-400/40"
              }`}>
                <span className="text-gray-400 font-semibold text-base">+91</span>
                <div className="w-px h-6 bg-white/10" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={mobile}
                  onChange={handleMobileChange}
                  placeholder="9876543210"
                  disabled={bindingMobile}
                  className="flex-1 bg-transparent outline-none text-white text-lg font-semibold tracking-wide placeholder-gray-600 disabled:opacity-50"
                />
              </div>
              {mobileError && <p className="text-red-400 text-xs mt-2 px-1">{mobileError}</p>}

              <button
                onClick={handleBindMobile}
                disabled={bindingMobile || mobile.length !== 10}
                className="w-full h-16 mt-5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black text-lg font-black shadow-[0_10px_30px_rgba(251,146,60,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {bindingMobile ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Binding…
                  </>
                ) : (
                  "Bind Number & Continue"
                )}
              </button>
            </div>
          ) : result ? (
            // ══════════════ STEP 2: LINK GENERATED ══════════════
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-3xl">
                ✅
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Referral Link Ready!</h3>
              <p className="text-xs text-gray-400 mb-5">
                Friend earns ₹{round2(result.userAmount ?? userReward)} • You earn ₹{round2(result.referAmount ?? validRefAmount)} per referral
              </p>

              <div className="bg-[#131a28] border border-white/10 rounded-2xl px-4 py-3 mb-4 text-left">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Your Referral Link</p>
                <p className="text-xs text-amber-300 break-all">{result.referLink}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-bold active:scale-95 transition-all"
                >
                  {copied ? "Copied ✓" : "Copy Link"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black font-black active:scale-95 transition-all"
                >
                  Share
                </button>
              </div>

              <button
                onClick={() => { setResult(null); setRefAmount(""); }}
                className="w-full h-11 mt-3 rounded-2xl text-gray-400 text-sm font-medium active:scale-95 transition-all"
              >
                Generate Another
              </button>
            </div>
          ) : (
            // ══════════════ STEP 1: SET AMOUNT ══════════════
            <div className="relative z-10">
              <div className="bg-green-500/10 border border-green-400/20 rounded-2xl p-5 text-center mb-6">
                <p className="text-sm text-gray-300 mb-2">Base Task Reward</p>
                <h2 className="text-5xl font-black text-green-300">₹{taskAmount}</h2>
                <p className="text-xs text-green-400/60 mt-2">Maximum shareable amount</p>
              </div>

              <div className="mb-5">
                <label className="text-sm text-gray-400 mb-3 block">
                  Set Referral Reward Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={refAmount}
                    onChange={(e) => { setRefAmount(e.target.value); if (genError) setGenError(""); }}
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-[#131a28] border border-white/10 px-5 pr-12 text-xl font-bold focus:border-amber-400/40 focus:bg-[#182132] outline-none transition-all disabled:opacity-50"
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
                {genError && <p className="text-red-400 text-xs mt-2 px-1">{genError}</p>}
              </div>

              {validRefAmount > 0 && (
                <div className="space-y-3 mb-6">
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-400/20 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-lg">💰</div>
                      <div>
                        <p className="text-xs text-gray-400">You Earn Per Referral</p>
                        <p className="font-bold text-lg text-amber-300">₹{validRefAmount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-400/20 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-lg">🎁</div>
                      <div>
                        <p className="text-xs text-gray-400">Your Friend Gets</p>
                        <p className="font-bold text-lg text-green-300">₹{userReward}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerateLink}
                disabled={!validRefAmount || validRefAmount < 0.1 || loading}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black text-lg font-black shadow-[0_10px_30px_rgba(251,146,60,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
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
            </div>
          )}

          {/* ⏳ FUTURE: Recent referrals — sirf tab dikhega jab parent referList pass kare */}
          {Array.isArray(referList) && referList.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/5 relative z-10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Referrals</p>
              <div className="space-y-2">
                {referList.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-3 py-2">
                    <span className="text-sm text-gray-300">{item.name || "User"}</span>
                    <span className="text-sm font-bold text-emerald-300">+₹{round2(item.amount || 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-white/5 relative z-10">
            <p className="text-center text-xs text-gray-500 leading-5">
              Powered by{" "}
              <span className="text-white font-semibold">TaskWala Solution India</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
