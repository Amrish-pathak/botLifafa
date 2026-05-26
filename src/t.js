import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "https://tgautomactiontool-backend.onrender.com/api";
const BOT_BASE = "https://t.me/ClaimLifafaBot/taskwala?startapp=";
const getTaskLink = (id) => `${BOT_BASE}${id}`;

const fmtDate = (val) => {
  if (!val) return "—";
  const ms = val._seconds ? val._seconds * 1000 : new Date(val).getTime();
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
};

// ── Toast ─────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-xl text-sm font-semibold border pointer-events-none whitespace-nowrap
      ${toast.type === "error"
        ? "bg-zinc-900 text-red-400 border-red-900"
        : "bg-zinc-900 text-green-400 border-green-900"}`}>
      {toast.type === "error" ? "✕ " : "✓ "}{toast.msg}
    </div>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────
function ConfirmDialog({ msg, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[9998] bg-black/60 flex items-end p-4"
      onClick={onCancel}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 pb-8 w-full max-w-lg mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white text-sm font-medium text-center mb-5">{msg}</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-3 rounded-xl bg-red-600 text-white text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────
const STATUS_CLS = {
  active:   "bg-green-950 text-green-400 border border-green-900",
  complete: "bg-amber-950 text-amber-400 border border-amber-900",
  over:     "bg-red-950  text-red-400   border border-red-900",
};
function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0 ${STATUS_CLS[status] || STATUS_CLS.over}`}>
      {status}
    </span>
  );
}

// ── Icon Button ───────────────────────────────────────────────
function IconBtn({ icon, label, onClick, variant = "default" }) {
  const cls = {
    default: "border-zinc-800 text-zinc-400 hover:bg-zinc-800",
    accent:  "border-blue-900/60 text-blue-400 bg-blue-950/30 hover:bg-blue-950/60",
    danger:  "border-red-900/60  text-red-400  bg-red-950/30  hover:bg-red-950/60",
  }[variant];
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 rounded-xl border transition-colors w-full ${cls}`}
    >
      <i className={`ti ti-${icon} text-base`} aria-hidden="true" />
      {label}
    </button>
  );
}

// ── Task Card ─────────────────────────────────────────────────
function TaskCard({ task, onUpdateStatus, onDelete, onCopyLink, onShare, onViewReport }) {
  const statusBtnCls = (val) => {
    const active = task.status === val;
    const map = {
      active:   active ? "border-green-500 text-green-400 bg-green-950/40" : "border-zinc-800 text-zinc-600",
      complete: active ? "border-amber-500 text-amber-400 bg-amber-950/40" : "border-zinc-800 text-zinc-600",
      over:     active ? "border-red-500   text-red-400   bg-red-950/40"   : "border-zinc-800 text-zinc-600",
    };
    return `text-xs font-bold py-2.5 rounded-xl border transition-all ${map[val]}`;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-white font-semibold text-[15px] truncate">{task.title}</p>
          <p className="text-zinc-500 text-xs mt-0.5 truncate">@{task.botUsername} · {task.telegramPhone}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black rounded-xl px-3 py-2.5">
          <p className="text-zinc-500 text-[10px] mb-0.5">Per invite</p>
          <p className="text-green-400 text-xl font-bold">₹{task.claimAmount}</p>
        </div>
        <div className="bg-black rounded-xl px-3 py-2.5">
          <p className="text-zinc-500 text-[10px] mb-0.5">Budget</p>
          <p className="text-white text-xl font-bold">{task.budget}</p>
        </div>
      </div>

      {/* Status toggle */}
      <div className="grid grid-cols-3 gap-1.5">
        {[["active","Active"],["complete","Complete"],["over","Over"]].map(([val, label]) => (
          <button key={val} onClick={() => onUpdateStatus(task.id, val)} className={statusBtnCls(val)}>
            {label}
          </button>
        ))}
      </div>

      {/* Extra actions */}
      <div className="grid grid-cols-2 gap-1.5">
        <IconBtn icon="chart-bar" label="View report" onClick={() => onViewReport(task)} variant="accent" />
        <IconBtn icon="copy"      label="Copy link"   onClick={() => onCopyLink(task.id)} />
        <IconBtn icon="share"     label="Share task"  onClick={() => onShare(task)} />
        <IconBtn icon="trash"     label="Delete"      onClick={() => onDelete(task.id)} variant="danger" />
      </div>
    </div>
  );
}

// ── Invite Row ────────────────────────────────────────────────
function InviteRow({ inv, index }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-white text-sm font-semibold">
          {inv.username ? `@${inv.username}` : inv.userId ? `ID: ${inv.userId}` : `User #${index + 1}`}
        </span>
        <span className="text-[10px] font-bold bg-green-950 text-green-400 px-2 py-0.5 rounded-full">
          #{index + 1}
        </span>
      </div>
      {inv.messageText && (
        <p className="text-zinc-500 text-xs leading-relaxed my-1 break-words">
          {inv.messageText.length > 100 ? inv.messageText.slice(0, 100) + "…" : inv.messageText}
        </p>
      )}
      <p className="text-zinc-600 text-[11px] mt-1">
        {fmtDate(inv.receivedAt)}{inv.senderId && ` · ${inv.senderId}`}
      </p>
    </div>
  );
}

// ── Report View ───────────────────────────────────────────────
function ReportView({ task, invites, loading, onBack, onCopyLink }) {
  return (
    <div className="bg-black min-h-screen">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-black border-b border-zinc-900 px-4 py-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-blue-400 text-sm font-medium mb-2.5">
          <i className="ti ti-arrow-left text-base" aria-hidden="true" />
          Back
        </button>
        <h1 className="text-white text-lg font-bold">{task.title}</h1>
        <p className="text-zinc-500 text-xs mt-0.5">Invite report</p>
      </div>

      <div className="px-4 pb-10 pt-4 max-w-lg mx-auto">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Total invites", value: invites.length, cls: "text-green-400" },
            { label: "Budget",        value: task.budget,    cls: "text-white" },
            { label: "Per invite",    value: `₹${task.claimAmount}`, cls: "text-amber-400" },
            { label: "Status",        value: task.status,    cls: "text-white capitalize" },
          ].map((s, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-3 py-2.5">
              <p className="text-zinc-500 text-[10px] mb-0.5">{s.label}</p>
              <p className={`text-xl font-bold ${s.cls}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Task link */}
        <div className="bg-zinc-900 border border-blue-900/50 rounded-2xl px-4 py-3 mb-5">
          <p className="text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-2">Task link</p>
          <div className="flex items-center gap-2">
            <p className="text-zinc-400 text-[11px] font-mono flex-1 break-all leading-relaxed">
              {getTaskLink(task.id)}
            </p>
            <button
              onClick={() => onCopyLink(task.id)}
              className="shrink-0 bg-blue-950/60 border border-blue-900/60 rounded-lg p-2 text-blue-400"
            >
              <i className="ti ti-copy text-sm" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Invites header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-sm font-semibold">Invites</h2>
          <span className="text-xs font-bold bg-blue-950/60 text-blue-400 border border-blue-900/50 px-2.5 py-0.5 rounded-full">
            {invites.length} total
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-zinc-600 text-sm">Loading invites…</div>
        ) : invites.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-600 text-sm">
            No invites yet
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {invites.map((inv, i) => (
              <InviteRow key={inv.id || i} inv={inv} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function TelegramTaskManager() {
  const [view, setView]                   = useState("main");
  const [reportTask, setReportTask]       = useState(null);
  const [reportInvites, setReportInvites] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [tasks, setTasks]                 = useState([]);
  const [accounts, setAccounts]           = useState([]);
  const [loading, setLoading]             = useState(false);
  const [searchingChat, setSearchingChat] = useState(false);
  const [creatingTask, setCreatingTask]   = useState(false);
  const [chatData, setChatData]           = useState(null);
  const [toast, setToast]                 = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    title: "", referLink: "", referStatus: true,
    claimAmount: "", budget: "", telegramPhone: "", botUsername: "",
  });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data.data || []);
    } catch { showToast("Failed to load tasks", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  const loadAccounts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/auth/accounts`);
      setAccounts(res.data.data || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadTasks(); loadAccounts(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSearchChat = async () => {
    if (!form.telegramPhone || !form.botUsername) {
      return showToast("Select account and enter bot username", "error");
    }
    try {
      setSearchingChat(true);
      const res = await axios.post(`${API}/tasks/search-chat`, {
        phoneNumber: form.telegramPhone, botUsername: form.botUsername,
      });
      setChatData(res.data.data);
      showToast("Chat found!");
    } catch (err) {
      showToast(err?.response?.data?.message || "Chat not found", "error");
    } finally { setSearchingChat(false); }
  };

  const handleCreateTask = async () => {
    const required = ["title","referLink","claimAmount","budget","telegramPhone","botUsername"];
    for (const k of required) {
      if (!form[k] && form[k] !== 0) return showToast(`Please fill: ${k}`, "error");
    }
    try {
      setCreatingTask(true);
      await axios.post(`${API}/tasks/create`, {
        title: form.title, referLink: form.referLink, referStatus: form.referStatus,
        claimAmount: Number(form.claimAmount), budget: Number(form.budget),
        telegramPhone: form.telegramPhone, botUsername: form.botUsername,
      });
      showToast("Task created!");
      setForm({ title:"", referLink:"", referStatus:true, claimAmount:"", budget:"", telegramPhone:"", botUsername:"" });
      setChatData(null);
      loadTasks();
    } catch (err) {
      showToast(err?.response?.data?.message || "Task creation failed", "error");
    } finally { setCreatingTask(false); }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await axios.put(`${API}/tasks/${taskId}/status`, { status });
      showToast(`Marked as ${status}`);
      loadTasks();
    } catch { showToast("Status update failed", "error"); }
  };

  const deleteTask     = (taskId) => setConfirmDelete(taskId);
  const confirmDeleteTask = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await axios.delete(`${API}/tasks/${id}`);
      showToast("Task deleted");
      loadTasks();
    } catch { showToast("Delete failed", "error"); }
  };

  const copyTaskLink = useCallback((taskId) => {
    navigator.clipboard.writeText(getTaskLink(taskId))
      .then(() => showToast("Link copied!"))
      .catch(() => showToast("Copy failed", "error"));
  }, [showToast]);

  const shareTask = useCallback(async (task) => {
    const link = getTaskLink(task.id);
    if (navigator.share) {
      try { await navigator.share({ title: task.title, text: `Join ${task.title} — Earn ₹${task.claimAmount} per referral`, url: link }); }
      catch { /* cancelled */ }
    } else { copyTaskLink(task.id); }
  }, [copyTaskLink]);

  const viewReport = useCallback(async (task) => {
    setReportTask(task);
    setReportInvites([]);
    setView("report");
    setReportLoading(true);
    try {
      const res = await axios.get(`${API}/tasks/${task.id}/invites`);
      setReportInvites(res.data.data?.invites || []);
    } catch { showToast("Failed to load invites", "error"); }
    finally { setReportLoading(false); }
  }, [showToast]);

  // ── REPORT VIEW ──────────────────────────────────────────────
  if (view === "report" && reportTask) {
    return (
      <>
        <Toast toast={toast} />
        <ReportView
          task={reportTask}
          invites={reportInvites}
          loading={reportLoading}
          onBack={() => setView("main")}
          onCopyLink={copyTaskLink}
        />
      </>
    );
  }

  // ── MAIN VIEW ────────────────────────────────────────────────
  return (
    <div className="bg-black min-h-screen text-white overflow-y-auto  no-scrollbar">
      <Toast toast={toast} />
      {confirmDelete && (
        <ConfirmDialog
          msg="Delete this task and all invites?"
          onConfirm={confirmDeleteTask}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-zinc-900 px-4 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="text-white text-lg font-bold leading-none">Task Manager</h1>
          <p className="text-zinc-600 text-xs mt-1">
            {accounts.length} account{accounts.length !== 1 ? "s" : ""} · {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { loadTasks(); loadAccounts(); }}
          className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl"
        >
          <i className="ti ti-refresh text-sm" aria-hidden="true" />
          Refresh
        </button>
      </div>

      <div className="px-4 pb-12 pt-4 max-w-lg mx-auto h-[100vh] overflow-y:auto">

        {/* ── Create Task Form ─────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
          <h2 className="text-white text-sm font-semibold mb-4">Create task</h2>

          <div className="flex flex-col gap-2.5">
            <input
              name="title" value={form.title} onChange={handleChange}
              placeholder="Task title"
              className="w-full h-11 bg-black border border-zinc-800 rounded-xl px-3.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600"
            />
            <input
              name="referLink" value={form.referLink} onChange={handleChange}
              placeholder="Referral link"
              className="w-full h-11 bg-black border border-zinc-800 rounded-xl px-3.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                name="claimAmount" value={form.claimAmount} onChange={handleChange}
                placeholder="Amount (₹)" type="number"
                className="w-full h-11 bg-black border border-zinc-800 rounded-xl px-3.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600"
              />
              <input
                name="budget" value={form.budget} onChange={handleChange}
                placeholder="Budget count" type="number"
                className="w-full h-11 bg-black border border-zinc-800 rounded-xl px-3.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600"
              />
            </div>

            <select
              name="telegramPhone" value={form.telegramPhone} onChange={handleChange}
              className="w-full h-11 bg-black border border-zinc-800 rounded-xl px-3.5 text-sm text-white outline-none focus:border-zinc-600 appearance-none"
            >
              <option value="">Select TG account</option>
              {accounts.map((acc, i) => (
                <option key={i} value={acc.phoneNumber}>
                  {acc.phoneNumber}{!acc.isConnected ? " (offline)" : ""}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input
                name="botUsername" value={form.botUsername} onChange={handleChange}
                placeholder="@bot_username"
                className="w-full h-11 bg-black border border-zinc-800 rounded-xl px-3.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600"
              />
              <button
                onClick={handleSearchChat}
                disabled={searchingChat}
                className="h-11 px-4 bg-blue-950/60 border border-blue-900/60 text-blue-400 text-sm font-semibold rounded-xl whitespace-nowrap disabled:opacity-50"
              >
                {searchingChat ? "…" : "Search"}
              </button>
            </div>

            <label className="flex items-center gap-2.5 text-zinc-400 text-sm cursor-pointer select-none">
              <input
                type="checkbox" name="referStatus" checked={form.referStatus} onChange={handleChange}
                className="w-4 h-4 accent-green-500"
              />
              Refer status enabled
            </label>

            {chatData && (
              <div className="bg-black border border-green-900/60 rounded-xl px-4 py-3">
                <p className="text-green-400 text-[10px] font-bold tracking-widest uppercase mb-1.5">Chat found</p>
                <p className="text-white text-sm font-semibold">{chatData.firstName}</p>
                <p className="text-zinc-500 text-xs mt-0.5">@{chatData.username} · {chatData.type} · ID: {chatData.id}</p>
              </div>
            )}

            <button
              onClick={handleCreateTask}
              disabled={creatingTask}
              className="h-11 w-full bg-white text-black text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingTask ? "Creating…" : "Create task"}
            </button>
          </div>
        </div>

        {/* ── Task List ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-sm font-semibold">All tasks</h2>
          {tasks.length > 0 && (
            <span className="text-xs font-semibold bg-zinc-900 text-zinc-500 border border-zinc-800 px-2.5 py-0.5 rounded-full">
              {tasks.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-600 text-sm">Loading…</div>
        ) : tasks.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-16 text-center">
            <i className="ti ti-inbox text-4xl text-zinc-800 block mb-2" aria-hidden="true" />
            <p className="text-zinc-600 text-sm">No tasks yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateStatus={updateStatus}
                onDelete={deleteTask}
                onCopyLink={copyTaskLink}
                onShare={shareTask}
                onViewReport={viewReport}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}