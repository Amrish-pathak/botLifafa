import { useState } from "react";
import HeaderScreen from "../components/HeaderScreen";

export default function TaskScreen({ lifafa, onStart }) {
  const [showSteps, setShowSteps] = useState(false);

  const username =
    lifafa?.telegram?.username ||
    lifafa?.intData?.username ||
    lifafa?.userName ||
    "Premium User";

  const userId =
    lifafa?.telegram?.id ||
    lifafa?.intData?.id ||
    lifafa?.userId ||
    "000123";

  const title = lifafa?.title || "Premium Classic Task";
  const claimAmount = lifafa?.claimAmount ?? "0";
  const refConditionName = lifafa?.refConditionName ?? "0";


  return (
    <div
      className="
        min-h-screen 
        bg-[#0b0f19] 
        text-white 
        // overflow-y-auto 
        overflow-x-hidden
        relative
        scrollbar-hide
      "
    >
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

        {/* HEADER */}
        <HeaderScreen />

        {/* REWARD CARD */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-white/10 rounded-[30px] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">

            <p className="uppercase tracking-[0.25em] text-xs text-amber-300/70">
              Reward Task
            </p>

            <h2 className="mt-3 text-2xl font-bold leading-tight">
              {title}
            </h2>

            <div className="mt-5 flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4">

              <div>
                <p className="text-sm text-gray-400">
                  Total Reward
                </p>

                <p className="text-4xl font-black text-amber-300 mt-1">
                  ₹{claimAmount}
                </p>
              </div>

              <div className="text-5xl animate-bounce">
                💰
              </div>

            </div>

          </div>

        </div>

        {/* COLLAPSIBLE STEPS */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[28px] overflow-hidden transition-all duration-300">

          {/* TOP BAR */}
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="w-full flex items-center justify-between p-4"
          >

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-400/10 flex items-center justify-center text-xl">
                📋
              </div>

              <div className="text-left">

                <h3 className="text-lg font-bold">
                  How to Complete
                </h3>

                <p className="text-xs text-gray-400">
                  Easy premium workflow
                </p>

              </div>

            </div>

            {/* Arrow */}
            <div
              className={`w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-xl transition-all duration-300 ${showSteps ? "rotate-180" : ""
                }`}
            >
              ⌄
            </div>

          </button>

          {/* CONTENT */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${showSteps
                ? "max-h-[500px] opacity-100 p-4 pt-0"
                : "max-h-0 opacity-0"
              }`}
          >

            <div className="space-y-3">

              {[
                {
                  icon: "🚀",
                  title: "Start Task",
                  desc: "Tap the button below to begin.",
                },
                {
                  icon: "📢",
                  title: "Join Channel",
                  desc: "Complete Telegram verification.",
                },
                {
                  icon: "✅",
                  title: "Claim Reward",
                  desc: "Receive reward instantly.",
                },
                {
                  icon: "🎥",
                  title: "Watch Tutorial",
                  desc: "Learn the completion process.",
                },
              ].map((item, index) => (

                <div
                  key={index}
                  className="flex items-start gap-4 bg-[#131a28] border border-white/5 rounded-2xl p-4 hover:bg-[#182132] transition-all"
                >

                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shrink-0">
                    {item.icon}
                  </div>

                  <div>

                    <p className="font-semibold">
                      {item.title}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      {item.desc}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* START BUTTON */}
        <button
          onClick={onStart}
          className="
            relative 
            overflow-hidden 
            w-full 
            h-14 
            rounded-2xl 
            bg-gradient-to-r 
            from-amber-400 
            via-orange-500 
            to-amber-500 
            text-black 
            font-extrabold 
            text-lg 
            shadow-[0_10px_30px_rgba(255,170,0,0.35)] 
            active:scale-[0.98] 
            transition-all
          "
        >

          <span className="relative z-10">
            Start & Claim ₹{claimAmount}
          </span>

          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>

        </button>

        {/* FOOTER */}
        <div className="text-center pt-1 pb-5">

          <p className="text-xs text-gray-500 leading-5">
            By continuing you agree to the{" "}

            <button className="text-amber-300">
              terms & conditions
            </button>

          </p>

          <p className="mt-2 text-[11px] text-gray-600">

            Powered by{" "}

            <span className="text-white font-semibold">
              TaskWala Solution India
            </span>

          </p>

          {refConditionName !== "Direct Join" && (
            <p className="text-white font-semibold">
              Refer by - {refConditionName}
            </p>
          )}
        </div>


      </div>
    </div>
  );
}