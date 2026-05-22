import { useMemo, useState } from "react";

export default function SuccessScreen({
  amount,
}) {

  const [refAmount, setRefAmount] = useState("");
  const [linkCreated, setLinkCreated] = useState(false);

  const taskAmount = Number(amount || 0);

  // Max 50%
  const maxRefAmount = Math.floor(taskAmount / 2);

  const validRefAmount =
    Number(refAmount) <= maxRefAmount
      ? Number(refAmount || 0)
      : maxRefAmount;

  const userReward =
    taskAmount - validRefAmount;

  // Demo referral link
  const referralLink = useMemo(() => {
    return `https://t.me/your_bot/app?startapp=ref_${validRefAmount}_${Date.now()}`;
  }, [validRefAmount]);

  // Copy Link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert("Referral link copied");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] overflow-hidden relative text-white">

      {/* Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[260px] h-[260px] bg-green-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[260px] h-[260px] bg-emerald-500/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">

        {/* SUCCESS CARD */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] overflow-hidden relative">

          {/* Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">

            {/* Success Top */}
            <div className="text-center">

              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-5xl mx-auto shadow-[0_10px_40px_rgba(0,255,120,0.25)]">
                🎉
              </div>

              <h1 className="text-3xl font-black mt-5">
                Claim Successful
              </h1>

              <p className="text-gray-400 mt-2 text-sm">
                Reward credited successfully
              </p>

            </div>

            {/* Reward Card */}
            <div className="mt-6 bg-gradient-to-br from-green-500/15 to-emerald-500/10 border border-green-400/20 rounded-3xl p-5 text-center">

              <p className="text-sm text-gray-300">
                Your Reward
              </p>

              <h2 className="text-5xl text-green-300 font-black mt-3">
                ₹{amount}
              </h2>

            </div>

            {/* Referral Section */}
            <div className="mt-6 bg-[#131a28] border border-white/5 rounded-3xl p-4">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/10 flex items-center justify-center text-2xl">
                  🔗
                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    Create Referral Link
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Set how much reward you want per referral
                  </p>

                </div>

              </div>

              {/* Input */}
              <div className="mt-5">

                <label className="text-sm text-gray-400 block mb-2">
                  Referral Reward Amount
                </label>

                <div className="relative">

                  <input
                    type="number"
                    value={refAmount}
                    onChange={(e) => {

                      let val = Number(e.target.value);

                      if (val > maxRefAmount) {
                        val = maxRefAmount;
                      }

                      setRefAmount(val);
                    }}
                    placeholder={`Max ₹${maxRefAmount}`}
                    className="
                      w-full
                      h-14
                      rounded-2xl
                      bg-[#0f1725]
                      border
                      border-white/10
                      px-5
                      text-lg
                      outline-none
                      focus:border-amber-400/40
                    "
                  />

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-300 font-bold">
                    ₹
                  </div>

                </div>

                {/* Info */}
                <div className="mt-4 space-y-2">

                  <div className="flex items-center justify-between bg-white/[0.03] rounded-2xl px-4 py-3">

                    <p className="text-sm text-gray-400">
                      Referral Gets
                    </p>

                    <p className="font-bold text-amber-300">
                      ₹{validRefAmount}
                    </p>

                  </div>

                  <div className="flex items-center justify-between bg-white/[0.03] rounded-2xl px-4 py-3">

                    <p className="text-sm text-gray-400">
                      User Will Receive
                    </p>

                    <p className="font-bold text-green-300">
                      ₹{userReward}
                    </p>

                  </div>

                </div>

                {/* Note */}
                <div className="mt-4 bg-blue-500/10 border border-blue-400/10 rounded-2xl p-4">

                  <p className="text-sm text-gray-300 leading-6">

                    Example: If task reward is{" "}
                    <span className="text-green-300 font-semibold">
                      ₹{taskAmount}
                    </span>{" "}
                    and you set referral reward to{" "}
                    <span className="text-amber-300 font-semibold">
                      ₹{validRefAmount}
                    </span>
                    , then users joining from your referral link will receive{" "}
                    <span className="text-green-300 font-semibold">
                      ₹{userReward}
                    </span>.

                  </p>

                </div>

              </div>

              {/* Generate */}
              <button
                onClick={() => setLinkCreated(true)}
                className="
                  mt-5
                  w-full
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-amber-400
                  via-orange-500
                  to-amber-500
                  text-black
                  text-lg
                  font-black
                  active:scale-[0.98]
                  transition-all
                "
              >
                Generate Referral Link
              </button>

              {/* Link */}
              {
                linkCreated && (
                  <div className="mt-5">

                    <div className="bg-[#0f1725] border border-white/10 rounded-2xl p-4 break-all text-sm text-gray-300 leading-6">
                      {referralLink}
                    </div>

                    <button
                      onClick={copyLink}
                      className="
                        mt-4
                        w-full
                        h-12
                        rounded-2xl
                        bg-green-500/10
                        border
                        border-green-400/20
                        text-green-300
                        font-bold
                      "
                    >
                      Copy Referral Link
                    </button>

                  </div>
                )
              }

            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-gray-500 leading-5">

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