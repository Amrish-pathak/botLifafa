export default function AlreadyClaimed({
  lifafa,
  onRefer,
}) {

  const reward =
    lifafa?.claimAmount || 5;

  const referralReward =
    Math.floor(reward / 2);

  return (
    <div className="min-h-screen bg-[#0b0f19] overflow-hidden relative text-white">

      {/* Glow BG */}
      <div className="absolute top-[-120px] left-[-120px] w-[260px] h-[260px] bg-yellow-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[260px] h-[260px] bg-orange-500/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">

        {/* MAIN CARD */}
        <div className="relative overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

          {/* Top Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">

            {/* Emoji */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-5xl mx-auto shadow-[0_10px_40px_rgba(255,180,0,0.25)]">
              🥳
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black text-center mt-5">
              Already Claimed
            </h1>

            <p className="text-gray-400 text-center mt-3 leading-6">
              You already claimed this reward.
              <br />
              But you can still earn using referrals.
            </p>

            {/* Reward Box */}
            <div className="mt-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 rounded-3xl p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-400">
                    Per Referral Reward
                  </p>

                  <h2 className="text-5xl font-black text-yellow-300 mt-2">
                    ₹{referralReward}
                  </h2>

                </div>

                <div className="text-5xl animate-bounce">
                  🎁
                </div>

              </div>

            </div>

            {/* Info Cards */}
            <div className="mt-5 space-y-3">

              <div className="bg-[#131a28] border border-white/5 rounded-2xl p-4 flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-400/10 flex items-center justify-center text-2xl shrink-0">
                  🔗
                </div>

                <div>

                  <p className="font-semibold">
                    Share Referral Link
                  </p>

                  <p className="text-sm text-gray-400 mt-1 leading-5">
                    Invite users using your custom referral link.
                  </p>

                </div>

              </div>

              <div className="bg-[#131a28] border border-white/5 rounded-2xl p-4 flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/10 flex items-center justify-center text-2xl shrink-0">
                  💸
                </div>

                <div>

                  <p className="font-semibold">
                    Earn Automatically
                  </p>

                  <p className="text-sm text-gray-400 mt-1 leading-5">
                    When someone completes the task from your link,
                    you instantly receive reward earnings.
                  </p>

                </div>

              </div>

            </div>

            {/* Referral Example */}
            <div className="mt-5 bg-blue-500/10 border border-blue-400/10 rounded-2xl p-4">

              <p className="text-sm text-gray-300 leading-6">

                Example:
                If task reward is{" "}
                <span className="text-green-300 font-semibold">
                  ₹{reward}
                </span>
                , you can earn up to{" "}
                <span className="text-yellow-300 font-semibold">
                  ₹{referralReward}
                </span>{" "}
                per successful referral.

              </p>

            </div>

            {/* Button */}
            <button
              onClick={onRefer}
              className="
                relative
                overflow-hidden
                mt-7
                w-full
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-blue-400
                via-cyan-500
                to-blue-500
                text-white
                text-lg
                font-black
                shadow-[0_10px_30px_rgba(0,150,255,0.25)]
                active:scale-[0.98]
                transition-all
              "
            >

              <span className="relative z-10">
                🎁 Refer & Earn
              </span>

              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>

            </button>

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