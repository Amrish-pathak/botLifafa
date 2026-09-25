import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import api from "../services/api";
import HeaderScreen from "../components/HeaderScreen";

const INR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const Skeleton = ({ className = "" }) => (
  <span className={`inline-block bg-white/10 rounded-md animate-pulse ${className}`} />
);

export default function ActiveTasksScreen({ onSelectTask }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/botlifafa/active-tasks")
      .then((res) => setData(res.data))
      .catch((err) => console.error("active-tasks fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const validTasks = (data?.tasks || []).filter(
    (t) => Number(t.claimAmount) > 0 && Number(t.totalSlots) > 0
  );

  const openRegister = () => {
    const url = "https://taskwalasolution.in/register";
    try {
      WebApp.openLink(url); // Telegram ke andar naye tab jaisa external browser khulega
    } catch (err) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white px-4 py-6">
      <div className="max-w-md mx-auto space-y-5">
        <HeaderScreen />
        
        {/* SUMMARY */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
            <p className="text-[10px] uppercase text-gray-500">Active Tasks</p>
            {loading ? (
              <Skeleton className="h-7 w-12 mt-1" />
            ) : (
              <p className="text-2xl font-black mt-1">{validTasks.length}</p>
            )}
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
            <p className="text-[10px] uppercase text-gray-500">Earning Potential</p>
            {loading ? (
              <Skeleton className="h-7 w-20 mt-1" />
            ) : (
              <p className="text-2xl font-black mt-1 text-amber-300">
                {INR(data?.totalEarningPotential)}
              </p>
            )}
          </div>
        </div>

        {/* TRUST BADGES */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-2.5 text-center">
            <p className="text-sm font-bold text-amber-300">₹10</p>
            <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Min Withdrawal</p>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-2.5 text-center">
            <p className="text-sm font-bold text-emerald-300">2 Hrs</p>
            <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Upto Payment</p>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-2.5 text-center">
            <p className="text-sm font-bold text-sky-300">Instant</p>
            <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Task Earning</p>
          </div>
        </div>

        {/* REGISTER CTA */}
        <button
          onClick={openRegister}
          className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20 rounded-2xl px-4 py-3 text-left active:scale-[0.98] transition-all"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-200">New here?</p>
            <p className="text-xs text-gray-400 mt-0.5">Register on TaskWala to get started</p>
          </div>
          <span className="text-amber-300 text-xs font-bold shrink-0">Register →</span>
        </button>

        {/* LIST */}
        <div className="space-y-3">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 space-y-3"
              >
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-1.5 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}

          {!loading &&
            validTasks.map((task) => {
              const pct =
                task.totalSlots > 0
                  ? Math.min(100, Math.round((task.claimedUsers / task.totalSlots) * 100))
                  : 0;
              const isFull = task.remainingSlots <= 0;

              return (
                <div
                  key={task.id}
                  className="relative bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-white/10 rounded-2xl p-4 overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold truncate min-w-0">{task.title}</p>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-black text-amber-300">₹{task.claimAmount}</p>
                      <p className="text-[10px] text-gray-500">per user</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>
                        {task.claimedUsers}/{task.totalSlots} claimed
                      </span>
                      <span>{isFull ? "Full" : `${task.remainingSlots} left`}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => !isFull && onSelectTask(task.id)}
                    disabled={isFull}
                    className={`mt-3 w-full h-10 rounded-xl font-bold text-sm transition-all ${
                      isFull
                        ? "bg-white/5 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black active:scale-[0.98]"
                    }`}
                  >
                    {isFull ? "Full" : "Claim Now"}
                  </button>
                </div>
              );
            })}

          {!loading && validTasks.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">
              Abhi koi active task nahi hai
            </p>
          )}
        </div>

        {/* BRANDING FOOTER */}
        <div className="pt-4 pb-2 text-center">
          <p className="text-sm font-black tracking-wide">
            <span className="text-orange-400">Task</span>
            <span className="text-blue-400">Wala</span>
          </p>
          <p className="text-[10px] text-gray-600 mt-0.5">Solutions India</p>
        </div>
      </div>
    </div>
  );
}
