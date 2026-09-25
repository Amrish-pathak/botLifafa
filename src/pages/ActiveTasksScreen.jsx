import { useEffect, useState } from "react";
import api from "../services/api";

const INR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const Skeleton = ({ className = "" }) => (
  <span className={`inline-block bg-white/10 rounded-md animate-pulse ${className}`} />
);

export default function ActiveTasksScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/botlifafa/active-tasks")
      .then((res) => setData(res.data))
      .catch((err) => console.error("active-tasks fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const openTask = (id) => {
    window.open(`https://t.me/ClaimLifafaBot/taskwala?startapp=${id}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white px-4 py-6">
      <div className="max-w-md mx-auto space-y-5">
        <h1 className="text-xl font-bold">Active Tasks</h1>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
            <p className="text-[10px] uppercase text-gray-500">Active Tasks</p>
            {loading ? (
              <Skeleton className="h-7 w-12 mt-1" />
            ) : (
              <p className="text-2xl font-black mt-1">{data?.totalActiveTasks ?? 0}</p>
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

        {/* LIST */}
        <div className="space-y-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))
            : data?.tasks?.map((task) => (
                <button
                  key={task.id}
                  onClick={() => openTask(task.id)}
                  className="w-full text-left bg-white/[0.04] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] transition-all"
                >
                  <p className="font-semibold">{task.title}</p>
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>₹{task.claimAmount} per user</span>
                    <span>{INR(task.remainingBudget)} left</span>
                  </div>
                </button>
              ))}

          {!loading && data?.tasks?.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">
              Abhi koi active task nahi hai
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
