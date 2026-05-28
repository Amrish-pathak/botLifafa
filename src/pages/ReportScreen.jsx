/**
 * ReportScreen.jsx — Mobile-first Lifafa Report
 * Updated to match backend: { title, amountPerUser, totalBudget,
 * totalUsers, completedUsers, claimedUsers, remainingBudget }
 */

import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";

// ─── helpers ──────────────────────────────────────────────────────────────────

const INR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const NUM = (n) => new Intl.NumberFormat("en-IN").format(Number(n) || 0);

const fmtDate = (raw) => {
  if (!raw) return "—";
  const ts = raw?._seconds ? raw._seconds * 1000 : raw;
  const d = new Date(ts);
  if (isNaN(d)) return "—";
  return d.toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const fmtShortDate = (raw) => {
  if (!raw) return "—";
  const ts = raw?._seconds ? raw._seconds * 1000 : raw;
  const d = new Date(ts);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const STATUS_META = {
  claimed:   { label: "Claimed",   cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  completed: { label: "Completed", cls: "bg-amber-500/15  text-amber-400  border-amber-500/30"    },
};

// ─── Lifafa Details Card ──────────────────────────────────────────────────────

const LifafaCard = ({ summary }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

    {/* card header */}
    <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-zinc-800">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
          Lifafa Details
        </p>
        <h2 className="text-base font-extrabold text-white leading-tight">
          {summary.title || "—"}
        </h2>
      </div>
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25
                      flex items-center justify-center text-base">
        📩
      </div>
    </div>

    {/* 3-col stats strip */}
    <div className="grid grid-cols-3 divide-x divide-zinc-800">

      <div className="px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Per User</span>
        <span className="text-sm font-extrabold text-emerald-400">{INR(summary.amountPerUser)}</span>
      </div>

      <div className="px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Total Budget</span>
        <span className="text-sm font-extrabold text-white">{INR(summary.totalBudget)}</span>
      </div>

      <div className="px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Total Users</span>
        <span className="text-sm font-extrabold text-white">{NUM(summary.totalUsers)}</span>
      </div>

    </div>

    {/* completed / claimed row */}
    <div className="grid grid-cols-2 divide-x divide-zinc-800 border-t border-zinc-800">

      <div className="px-4 py-3 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-xs flex-shrink-0">
          ✅
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Un-Claimed</p>
          <p className="text-sm font-extrabold text-amber-400">{NUM(summary.completedUsers)}</p>
        </div>
      </div>

      <div className="px-4 py-3 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-xs flex-shrink-0">
          🎁
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Claimed</p>
          <p className="text-sm font-extrabold text-emerald-400">{NUM(summary.claimedUsers)}</p>
        </div>
      </div>

    </div>
  </div>
);

// ─── Progress + Remaining Card ────────────────────────────────────────────────

const ProgressCard = ({ summary }) => {
  const { claimedUsers = 0, totalUsers = 0, remainingBudget = 0, totalBudget = 0 ,amountPerUser=0} = summary;
  const progress = totalBudget/amountPerUser
  const claimedPct  = totalUsers > 0 ? Math.min(100, (claimedUsers / progress) * 100)  : 0;
  const spentAmt    = Number(totalBudget) - Number(remainingBudget);
  const spentPct    = totalBudget > 0 ? Math.min(100, (spentAmt / totalBudget) * 100) : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4">

      {/* remaining budget — big display */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">
            Remaining Budget
          </p>
          <p className="text-3xl font-black text-white leading-none">
            {INR(remainingBudget)}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1">
            of {INR(totalBudget)} total
          </p>
        </div>

        {/* donut-style ring (CSS only) */}
        <div className="relative flex-shrink-0 w-14 h-14">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#27272a" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.5" fill="none"
              stroke="#10b981" strokeWidth="3"
              strokeDasharray={`${spentPct * 0.974} 97.4`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-400">
            {Math.round(spentPct)}%
          </span>
        </div>
      </div>


      {/* divider */}
      <div className="border-t border-zinc-800" />

      {/* claimed users progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-semibold text-zinc-500">
          <span>Users claimed</span>
          <span className="text-zinc-300">{NUM(claimedUsers)} / {NUM(progress-claimedUsers)}</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
            style={{ width: `${claimedPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-zinc-600">
          <span>{claimedPct.toFixed(1)}% claimed</span>
          <span>{NUM(progress-claimedUsers)} pending</span>
        </div>
      </div>

    </div>
  );
};

// ─── Mobile user card ─────────────────────────────────────────────────────────

const UserCard = ({ user, serial }) => {
  const meta = STATUS_META[user.status] || STATUS_META.completed;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl">

      {/* Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5" />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 text-sm font-black text-white shadow-inner">
            {user.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-zinc-100">
              {user.firstName || "Unknown User"}
            </h3>

            <p className="truncate text-[11px] text-zinc-500 font-mono">
              @{user.username || "no_username"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-bold tracking-widest text-zinc-600">
            #{serial}
          </span>

          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${meta.cls}`}
          >
            {meta.label}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      {/* Main Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            Telegram ID
          </p>

          <p className="truncate font-mono text-xs font-semibold text-zinc-200">
            {user.telegramId}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            Mobile
          </p>

          <p className="truncate font-mono text-xs text-zinc-300">
            {user.number || "—"}
          </p>
        </div>
      </div>

      {/* Reward Section */}
      <div className="mt-4 grid grid-cols-3 gap-3">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            Referrer
          </p>

          {user.refId ? (
            <p className="truncate font-mono text-[11px] text-amber-400">
              {user.refId}
            </p>
          ) : (
            <p className="text-[11px] text-zinc-600">—</p>
          )}
        </div>

        <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-3 text-center">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-amber-300/60">
            Ref Bonus
          </p>

          <p className="text-sm font-extrabold text-amber-400">
            {user.referAmount > 0 ? INR(user.referAmount) : "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-right">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-emerald-300/60">
            Reward
          </p>

          <p className="text-sm font-black text-emerald-400">
            {INR(user.claimAmount)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">

        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              user.status === "claimed"
                ? "bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                : "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
            }`}
          />

          <span className="text-[11px] font-medium text-zinc-500">
            {user.status === "claimed"
              ? "Reward Claimed"
              : "Pending Claim"}
          </span>
        </div>

        {user.status === "claimed" && user.claimedAt && (
          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            {fmtShortDate(user.claimedAt)}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Pulse = ({ className }) => (
  <div className={`animate-pulse bg-zinc-800/70 rounded-xl ${className}`} />
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const FILTERS = [
  { key: "all",       label: "All"       },
  { key: "completed", label: "Completed" },
  { key: "claimed",   label: "Claimed"   },
];

const LIMIT = 20;

const ReportScreen = ({ lifafaId }) => {
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error,        setError]        = useState("");
  const [page,         setPage]         = useState(1);
  const [filter,       setFilter]       = useState("all");

  const fetchReport = useCallback(
    async (pg = 1, sf = filter, tableOnly = false) => {
      tableOnly ? setTableLoading(true) : setLoading(true);
      setError("");
      try {
        const res = await api.get(
          `/botlifafa/report/${lifafaId}?page=${pg}&limit=${LIMIT}&status=${sf}`
        );
        setData(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load report");
      } finally {
        setLoading(false);
        setTableLoading(false);
      }
    },
    [lifafaId, filter]
  );

  useEffect(() => { fetchReport(1, filter); }, [lifafaId]);

  const handlePage = (p) => {
    setPage(p);
    fetchReport(p, filter, true);
    const el = document.getElementById("userlist");
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
  };

  const handleFilter = (sf) => {
    setFilter(sf);
    setPage(1);
    fetchReport(1, sf, true);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-zinc-950 p-4 space-y-4 pt-5">
      <div className="flex items-center gap-3 mb-2">
        <Pulse className="w-9 h-9 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Pulse className="h-4 w-44" />
          <Pulse className="h-3 w-28" />
        </div>
      </div>
      <Pulse className="h-44 rounded-2xl" />
      <Pulse className="h-48 rounded-2xl" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => <Pulse key={i} className="h-36 rounded-2xl" />)}
      </div>
    </div>
  );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-red-500/30 rounded-3xl p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-base font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-zinc-400 mb-6">{error}</p>
        <button
          onClick={() => fetchReport(1)}
          className="w-full py-3 rounded-2xl bg-emerald-500 text-black text-sm font-bold active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!data?.summary) return (
    <div className="min-h-screen bg-zinc-950 text-zinc-500 flex items-center justify-center text-sm">
      No report data found.
    </div>
  );

  const { summary = {}, users = [], pagination = {} } = data;

  // sliding page window
  const totalPages = pagination.totalPages || 1;
  const getPageWindow = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3)       return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── sticky header ── */}
      <header className="sticky top-0 z-30 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-sm">
            📊
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-none">Lifafa Report</p>
            <p className="text-[10px] text-zinc-600 mt-0.5 font-mono truncate max-w-[120px]">
              {lifafaId}
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchReport(page, filter, true)}
          disabled={tableLoading}
          className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center
                     text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40
                     active:scale-90 transition-all disabled:opacity-40"
          aria-label="Refresh"
        >
          <svg className={`w-4 h-4 ${tableLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      <div className="px-4 pb-24 space-y-4 pt-5 max-w-2xl mx-auto">

        {/* ── Lifafa Details Card ── */}
        <LifafaCard summary={summary} />

        {/* ── Progress + Remaining Card ── */}
        <ProgressCard summary={summary} />

        {/* ── Users list ── */}
        <div id="userlist" className="space-y-3">

          {/* header row */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Users List</h2>
            <span className="text-[10px] text-zinc-500 font-semibold">
              {NUM(pagination.total || users.length)} total
            </span>
          </div>

          {/* filter tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilter(key)}
                className={`
                  flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95
                  ${filter === key
                    ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600"}
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── mobile cards ── */}
          <div className={`md:hidden space-y-2.5 transition-opacity duration-200 ${tableLoading ? "opacity-40 pointer-events-none" : ""}`}>
            {users.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl py-14 text-center">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm text-zinc-500">No users found</p>
              </div>
            ) : users.map((user, i) => (
              <UserCard key={`${user.telegramId}-${i}`} user={user} serial={(page - 1) * LIMIT + i + 1} />
            ))}
          </div>

          {/* ── desktop table ── */}
          <div className={`
            hidden md:block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden
            transition-opacity duration-200 ${tableLoading ? "opacity-40 pointer-events-none" : ""}
          `}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-zinc-800/50 border-b border-zinc-800">
                    {["#","User ID","Mobile","Referrer","Ref Bonus","Reward","Status","Claimed At"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-zinc-600 text-sm">No users found</td>
                    </tr>
                  ) : users.map((user, i) => {
                    const meta = STATUS_META[user.status] || STATUS_META.completed;
                    return (
                      <tr key={`${user.telegramId}-${i}`} className="hover:bg-zinc-800/25 transition-colors">
                        <td className="px-4 py-3 text-[11px] text-zinc-600 font-bold">
                          {(page - 1) * LIMIT + i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-lg">
                            {user.telegramId}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-400 whitespace-nowrap">
                          {user.number || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {user.refId
                            ? <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">{user.refId}</span>
                            : <span className="text-zinc-700 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-amber-400 whitespace-nowrap">
                          {user.referAmount > 0 ? INR(user.referAmount) : <span className="text-zinc-700">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-emerald-400 whitespace-nowrap">
                          {INR(user.claimAmount)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border whitespace-nowrap ${meta.cls}`}>
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-zinc-600 whitespace-nowrap">
                          {fmtDate(user.claimedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                disabled={page === 1 || tableLoading}
                onClick={() => handlePage(page - 1)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800
                           text-sm font-bold text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed
                           hover:border-zinc-600 active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </button>

              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                {getPageWindow().map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePage(p)}
                    className={`
                      flex-shrink-0 w-9 h-9 rounded-xl text-xs font-bold transition-all active:scale-90
                      ${p === page
                        ? "bg-emerald-500 text-black shadow-[0_0_14px_rgba(16,185,129,0.3)]"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600"}
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                disabled={page === totalPages || tableLoading}
                onClick={() => handlePage(page + 1)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800
                           text-sm font-bold text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed
                           hover:border-zinc-600 active:scale-95 transition-all"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {pagination.total > 0 && (
            <p className="text-center text-[10px] text-zinc-600">
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, pagination.total)} of {NUM(pagination.total)}
            </p>
          )}

        </div>

        {/* footer */}
        <div className="text-center pt-2 pb-4">
          <p className="text-[10px] text-zinc-700">Powered by</p>
          <p className="text-xs font-bold text-zinc-500 mt-0.5">Taskwala Solutions India</p>
        </div>

      </div>
    </div>
  );
};

export default ReportScreen;