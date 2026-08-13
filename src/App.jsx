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
  const [referSuccess, setReferSuccess] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const initApp = async () => {
    try {
      WebApp.ready();

      const user = WebApp.initDataUnsafe?.user;
      const startParam = WebApp.initDataUnsafe?.start_param;

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

      if (startParam.startsWith("report_")) {
        const lifafaId = startParam.replace("report_", "");
        setScreen("report");
        setLifafa({ id: lifafaId });
        setLoading(false);
        return;
      }

      let lifafaId = startParam;
      let ref = null;

      if (startParam.includes("_ref")) {
        const parts = startParam.split("_ref");
        lifafaId = parts[0];
        ref = parts[1] || null;
      }

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
  if (!lifafa?.referLink || !currentUser?.id) return;

  const link = lifafa.referLink.replace(
    "%7Buser%7D",
    String(currentUser.id)
  );

  // ── t.me links (channel/bot join) ke liye openTelegramLink hi sahi
  // method hai — openLink sirf non-Telegram external URLs ke liye ────────
  const isTelegramLink = /^(https?:\/\/)?(www\.)?t\.me\//i.test(link);

  try {
    if (isTelegramLink) {
      WebApp.openTelegramLink(link);
    } else {
      WebApp.openLink(link);
    }
  } catch (err) {
    console.error("openTask error:", err);

    try {
      window.open(link, "_blank", "noopener,noreferrer");
    } catch {
      window.location.href = link;
    }
  }
};


  // ── NAYA — sirf yeh function add hua hai, baaki file untouched ─────────
  const addMobile = async (number) => {
    if (!currentUser?.id) {
      throw new Error("User not found");
    }
    if (!number || String(number).trim() === "") {
      throw new Error("Please enter your TaskWala number");
    }

    const res = await api.post("/botlifafa/add-mobile", {
      lifafaId: lifafa.id,
      initData: WebApp.initData,
      number: String(number).trim(),
    });
    return res.data;
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

      const res = await api.post("/botlifafa/refer", {
        lifafaId: lifafa.id,
        telegramId: currentUser.id,
        referAmount: Number(amount),
      });

      if (res.data.success) {
        setReferSuccess({
          referLink: res.data.referLink,
          referAmount: res.data.referAmount,
          userAmount: res.data.userAmount,
          totalClaimAmount: res.data.totalClaimAmount,
        });
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

      {referScreen ? (
        <ReferAndEarnScreen
          taskAmount={lifafa.claimAmount}
          onBack={() => setReferScreen(false)}
          onReferLink={getReferLink}
        />
      ) : (
        <>
          {screen === "task" && (
            <TaskScreen lifafa={lifafa} onStart={openTask} onAddMobile={addMobile} />
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
            <ReportScreen lifafaId={lifafa.id} />
          )}
        </>
      )}
    </>
  );
}
