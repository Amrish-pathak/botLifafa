export default function AlreadyClaimed({
  lifafa,
  onReferClick,
}) {
  const reward = lifafa?.claimAmount || 5;

  const isDirect =
    !lifafa?.refConditionName ||
    lifafa?.refConditionName === "Direct Join";

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[280px] h-[280px] bg-yellow-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[280px] h-[280px] bg-orange-500/20 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-md mx-auto px-4 py-8">

        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[34px] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)] text-center">

          {/* Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-5xl shadow-lg">
            🥳
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black mt-5">
            Already Claimed
          </h1>

          <p className="text-gray-400 text-sm mt-2 leading-6">
            You have already claimed this reward.
          </p>

          {/* Optional Ref Info */}
          {!isDirect && (
            <p className="text-sm text-gray-300 mt-3">
              Refer by{" "}
              <span className="text-white font-semibold">
                {lifafa?.refConditionName}
              </span>
            </p>
          )}

          {/* Reward Highlight */}
          <div className="mt-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 rounded-3xl p-5">

            <p className="text-sm text-gray-400">
              Task Reward
            </p>

            <h2 className="text-5xl font-black text-yellow-300 mt-2">
              ₹{reward}
            </h2>

            <p className="text-xs text-gray-500 mt-2">
              Already credited to your account
            </p>
          </div>

          {/* Info */}
          <div className="mt-6 space-y-3 text-left">

            <div className="bg-[#131a28] border border-white/5 rounded-2xl p-4">
              <p className="font-semibold">Earn More</p>
              <p className="text-sm text-gray-400 mt-1">
                You can still earn by referring others.
              </p>
            </div>

            <div className="bg-[#131a28] border border-white/5 rounded-2xl p-4">
              <p className="font-semibold">Referral System</p>
              <p className="text-sm text-gray-400 mt-1">
                Invite friends and earn passive income instantly.
              </p>
            </div>

          </div>

          {/* CTA Button → your separate screen */}
          <button
            onClick={onReferClick}
            className="
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
            🎁 Go to Refer & Earn
          </button>

          {/* Footer */}
          <p className="mt-6 text-xs text-gray-500">
            Powered by{" "}
            <span className="text-white font-semibold">
              TaskWala Solution India
            </span>
          </p>

        </div>

      </div>
    </div>
  );
}