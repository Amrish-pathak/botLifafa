import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

import api from "./services/api";

import SplashScreen from "./components/SplashScreen";
import ErrorScreen from "./components/ErrorScreen";
import ReferSuccessModal from "./components/ReferSuccessModal";

import TaskScreen from "./pages/TaskScreen";
import ClaimScreen from "./pages/ClaimScreen";
import SuccessScreen from "./pages/SuccessScreen";
import AlreadyClaimed from "./pages/AlreadyClaimed";
import ReferAndEarnScreen from "./pages/ReferAndEarnScreen";
import ReportScreen from "./pages/ReportScreen";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screen, setScreen] = useState("");
  const [lifafa, setLifafa] = useState(null);
  const [claimAmount, setClaimAmount] = useState(0);
  const [referScreen, setReferScreen] = useState(false);

  // ── Refer success modal state ──────────────────────────────
  const [referSuccess, setReferSuccess] = useState(null);

  // ── Store user in state ────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);

  const initApp = async () => {
    try {
      WebApp.ready();

      const user = WebApp.initDataUnsafe?.user;
      const startParam = WebApp.initDataUnsafe?.start_param;
      //  const user = WebApp.initDataUnsafe?.user || { id: 5989056489 };
      // const startParam = WebApp.initDataUnsafe?.start_param || "2Vt2UGbno50EMqKqB7x7";

      setCurrentUser(user);

      if (!user?.id) {
        setError({
          title: "Unable To Fetch",
          message: "Telegram user not found",
        });
        return;
      }

      if (!startParam) {
        setError({
          title: "Invalid Request",
          message: "Lifafa ID missing",
        });
        return;
      }

      if (
        startParam.startsWith("report_")
      ) {

        const lifafaId =
          startParam.replace(
            "report_",
            ""
          );

        setScreen("report");

        setLifafa({
          id: lifafaId,
        });

        setLoading(false);

        return;
      }

      // ── Parse referral link format ─────────────────────────
      // Format: lifafaId_ref{userId}
      let lifafaId = startParam;
      let ref = null;

      if (startParam.includes("_ref")) {
        const parts = startParam.split("_ref");
        lifafaId = parts[0];           // 22OeN1HlOVFYp3fx8Daw
        ref = parts[1] || null;        // 1528011068
      }

      console.log("Parsed:", { lifafaId, ref, originalParam: startParam });

      const res = await api.post("/botlifafa/validate", {
        lifafaId,
        ref,
        telegramUser: user,
      });

      const data = res.data;

      if (!data?.success) {
        setError({
          title: "Invalid Lifafa",
          message: data?.message || "Expired or invalid link",
        });
        return;
      }

      if (!data?.lifafa) {
        setError({
          title: "Invalid Response",
          message: "Lifafa data missing",
        });
        return;
      }

      setLifafa(data.lifafa);

      switch (data.status) {
        case "new":
          setScreen("task");
          break;

        case "completed":
          setScreen("claim");
          break;

        case "claimed":
          setScreen("already");
          break;

        default:
          setError({
            title: "Unknown Status",
            message: "Invalid lifafa status",
          });
      }
    } catch (err) {
      console.error("Init error:", err);
      setError({
        title: "Server Error",
        message: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  const openTask = () => {
    if (!lifafa?.referLink) return;
    window.open(lifafa.referLink, "_blank");
  };

  const claimReward = async (number) => {
    try {
      if (!currentUser?.id) {
        alert("User not found");
        return;
      }

      if (!number || number.trim() === "") {
        alert("Please enter your TaskWala number");
        return;
      }



      const res = await api.post("/botlifafa/claim", {
        lifafaId: lifafa.id,
        initData: WebApp.initData,
        number: number.trim(),
      });

      console.log("Claim response:", res.data);

      setClaimAmount(res.data.amount || lifafa.claimAmount);
      setScreen("success");
    } catch (err) {
      console.error("Claim error:", err);
      alert(err?.response?.data?.message || "Claim Failed");
    }
  };

  const getReferLink = async (amount) => {
    try {
      if (!currentUser?.id) {
        alert("User not found");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        alert("Please enter a valid referral amount");
        return;
      }

      console.log("Creating refer link:", {
        lifafaId: lifafa.id,
        telegramId: currentUser.id,
        referAmount: Number(amount),
      });

      const res = await api.post("/botlifafa/refer", {
        lifafaId: lifafa.id,
        telegramId: currentUser.id,
        referAmount: Number(amount),
      });

      console.log("Refer response:", res.data);

      // ── Show success modal with response data ─────────────
      if (res.data.success) {
        setReferSuccess({
          referLink: res.data.referLink,
          referAmount: res.data.referAmount,
          userAmount: res.data.userAmount,
          totalClaimAmount: res.data.totalClaimAmount,
        });

        // Close refer screen
        setReferScreen(false);
      }
    } catch (err) {
      console.error("Refer error:", err);
      alert(err?.response?.data?.message || "Unable to generate referral link");
    }
  };

  const openRefer = () => {
    if (!currentUser?.id) return;

    const referLink = `https://t.me/ClaimLifafaBot/taskwala?startapp=${lifafa.id}_ref${currentUser.id}`;

    WebApp.openTelegramLink(
      `https://t.me/share/url?url=${encodeURIComponent(referLink)}`
    );
  };

  if (loading) return <SplashScreen />;

  if (error) {
    return (
      <ErrorScreen
        title={error.title}
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      {/* ── Refer Success Modal ────────────────────────────── */}
      {referSuccess && (
        <ReferSuccessModal
          referLink={referSuccess.referLink}
          referAmount={referSuccess.referAmount}
          userAmount={referSuccess.userAmount}
          onClose={() => setReferSuccess(null)}
          onShare={() => {
            if (navigator.share) {
              navigator.share({
                title: "Join TaskWala & Earn",
                text: `Complete tasks and earn ₹${referSuccess.userAmount}!`,
                url: referSuccess.referLink,
              });
            }
          }}
        />
      )}

      {/* ── Main Screens ───────────────────────────────────── */}
      {referScreen ? (
        <ReferAndEarnScreen
          taskAmount={lifafa.claimAmount}
          onBack={() => setReferScreen(false)}
          onReferLink={getReferLink}
        />
      ) : (
        <>
          {screen === "task" && (
            <TaskScreen lifafa={lifafa} onStart={openTask} />
          )}

          {screen === "claim" && (
            <ClaimScreen lifafa={lifafa} onClaim={claimReward} />
          )}

          {screen === "success" && (
            <SuccessScreen
              amount={claimAmount}
              onReferClick={() => setReferScreen(true)}
            />
          )}

          {screen === "already" && (
            <AlreadyClaimed
              lifafa={lifafa}
              onReferClick={() => setReferScreen(true)}
            />
          )}

          {screen === "report" && (
            <ReportScreen
              lifafaId={lifafa.id}
            />
          )}
        </>
      )}
    </>
  );
}