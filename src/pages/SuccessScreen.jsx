import { useState } from "react";
import HeaderScreen from "../components/HeaderScreen";

export default function SuccessScreen({ amount, onReferClick }) {
  const [celebrating, setCelebrating] = useState(true);

  // Stop animation after 3 seconds
  setTimeout(() => setCelebrating(false), 3000);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-hidden relative">
      <div className="px-4 pt-6">
        <HeaderScreen />
      </div>

      {/* Animated Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[260px] h-[260px] bg-green-500/30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[240px] h-[240px] bg-emerald-500/30 blur-3xl rounded-full animate-pulse"></div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        {/* SUCCESS CARD */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden relative">
          
          {/* Top Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            
            {/* Success Icon */}
            <div className="text-center">
              <div 
                className={`w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-6xl mx-auto shadow-[0_10px_40px_rgba(0,255,120,0.3)] ${
                  celebrating ? "animate-bounce" : ""
                }`}
              >
                🎉
              </div>

              <div className="mt-6">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-400/20 rounded-full px-4 py-2 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-green-300 tracking-wider uppercase">
                    Payment Successful
                  </span>
                </div>

                <h1 className="text-4xl font-black tracking-tight">
                  Congratulations!
                </h1>

                <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                  Your reward has been credited successfully
                </p>
              </div>
            </div>

            {/* Reward Amount Card */}
            <div className="mt-8 bg-gradient-to-br from-green-500/15 to-emerald-500/10 border border-green-400/30 rounded-3xl p-6 text-center relative overflow-hidden">
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

              <p className="text-sm text-gray-300 mb-2">
                Credited Amount
              </p>

              <div className="flex items-center justify-center gap-3">
                <div className="text-6xl">💰</div>
                <h2 className="text-6xl text-green-300 font-black">
                  ₹{amount}
                </h2>
              </div>

              <p className="text-xs text-green-400/60 mt-3">
                Processed instantly via TaskWala
              </p>
            </div>

            {/* Features Grid */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: "⚡", label: "Instant" },
                { icon: "🔒", label: "Secure" },
                { icon: "✓", label: "Verified" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center"
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Referral CTA */}
            <div className="mt-6 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-400/20 rounded-3xl p-5">
              
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shrink-0 shadow-lg">
                  🎁
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-amber-300">
                    Earn More Rewards
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                    Share tasks with friends and earn rewards for each referral
                  </p>
                </div>
              </div>

              <button
                onClick={onReferClick}
                className="
                  mt-4
                  w-full
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-amber-400
                  via-orange-500
                  to-amber-500
                  text-black
                  text-base
                  font-black
                  shadow-[0_10px_30px_rgba(251,146,60,0.3)]
                  active:scale-[0.98]
                  transition-all
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <span>Start Referring & Earning</span>
                <span className="text-lg">→</span>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <p className="text-center text-xs text-gray-500 leading-5">
                Transaction secured by{" "}
                <span className="text-white font-semibold">
                  TaskWala Solution India
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}