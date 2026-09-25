export default function BottomNav({ onSupport, onAllTasks, onRefer }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div
        className="max-w-md mx-auto px-4"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-3xl px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">

          {/* SUPPORT — left */}
          <button
            onClick={onSupport}
            aria-label="Support"
            className="flex flex-col items-center gap-1 w-16 active:scale-90 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 border border-white/10 flex items-center justify-center text-lg">
              🎧
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Support</span>
          </button>

          {/* ALL TASKS — center, raised */}
          <button
            onClick={onAllTasks}
            aria-label="All Active Tasks"
            className="flex flex-col items-center gap-1 w-16 -mt-6 active:scale-90 transition-transform"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 border-4 border-[#0b0f19] flex items-center justify-center text-xl shadow-[0_6px_18px_rgba(16,185,129,0.4)]">
              📋
            </div>
            <span className="text-[10px] text-emerald-300 font-semibold">All Tasks</span>
          </button>

          {/* REFER & EARN — right */}
          <button
            onClick={onRefer}
            aria-label="Refer & Earn"
            className="relative flex flex-col items-center gap-1 w-16 active:scale-90 transition-transform"
          >
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border border-white/10 flex items-center justify-center text-lg">
              🎁
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 border-2 border-[#0b0f19] shadow-md">
                +₹
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Refer</span>
          </button>

        </div>
      </div>
    </div>
  );
}
