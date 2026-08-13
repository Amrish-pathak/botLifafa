import { useEffect, useState } from "react";

import WebApp from "@twa-dev/sdk";

import api from "./services/api";

import SplashScreen from "./components/SplashScreen";
import ErrorScreen from "./components/ErrorScreen";

import TaskScreen from "./pages/TaskScreen";
import ClaimScreen from "./pages/ClaimScreen";
import SuccessScreen from "./pages/SuccessScreen";
import AlreadyClaimed from "./pages/AlreadyClaimed";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screen, setScreen] = useState("");
  const [lifafa, setLifafa] = useState(null);
  const [claimAmount, setClaimAmount] = useState(0);

  // ── User ek baar cache kar lete hai — baar-baar WebApp.initDataUnsafe.user
  // call karne ki zaroorat nahi, aur agar kabhi undefined ho to sab jagah
  // consistent rahega ────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);

  const initApp = async () => {
    try {
      WebApp.ready();
      WebApp.expand();

      const user = WebApp.initDataUnsafe?.user;
      setCurrentUser(user);

      if (!user?.id) {
        setError({
          title: "Unable To Fetch",
          message: "Please close and retry again",
        });
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const lifafaId = params.get("startapp");
      const ref = params.get("ref");

      if (!lifafaId) {
        setError({
          title: "Invalid Request",
          message: "Lifafa ID is missing",
        });
        return;
      }

      // ── validate ke liye telegramUser bhejna theek hai — yeh sirf
      // display/lookup purpose ke liye hai, koi balance/payment yahan
      // move nahi hota. Money-moving actions (claim, add-mobile) ke
      // liye neeche initData (verified) use ho raha hai ────────────────
      const res = await api.post("/botlifafa/validate", {
        lifafaId,
        ref,
        telegramUser: user,
      });

      const data = res.data;

      if (!data || !data.success) {
        setError({
          title: "Invalid Lifafa",
          message: data?.message || "This Bot Lifafa is invalid or expired",
        });
        return;
      }

      if (!data.lifafa) {
        setError({
          title: "Invalid Response",
          message: "Lifafa data not found",
        });
        return;
      }

      setLifafa(data.lifafa);

      if (data.status === "new") {
        setScreen("task");
      } else if (data.status === "completed") {
        setScreen("claim");
      } else if (data.status === "claimed") {
        setScreen("already");
      } else {
        setError({
          title: "Unknown Status",
          message: "Invalid lifafa status",
        });
      }
    } catch (err) {
      console.log(err);
      setError({
        title: "Server Error",
        message: err.response?.data?.message || "Please retry again",
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
    try {
      WebApp.openLink(lifafa.referLink);
    } catch {
      window.open(lifafa.referLink, "_blank");
    }
  };

  // ── FIX: initData (verified, spoof-proof) bhejo — telegramId nahi.
  // Backend ka verifyTelegramInitData middleware isko decode/verify
  // karke req.telegramUser set karta hai, jo hi addMobileNumber
  // controller actually use karta hai ─────────────────────────────────
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

  // ── FIX: yahi same problem — telegramId ki jagah initData ──────────────
  const claimReward = async (number) => {
    try {
      if (!currentUser?.id) {
        alert("User not found");
        return;
      }
      if (!number || String(number).trim() === "") {
        alert("Please enter your TaskWala number");
        return;
      }

      const res = await api.post("/botlifafa/claim", {
        lifafaId: lifafa.id,
        initData: WebApp.initData,
        number: String(number).trim(),
      });

      setClaimAmount(res.data.amount ?? lifafa.claimAmount);
      setScreen("success");
    } catch (err) {
      alert(err?.response?.data?.message || "Claim Failed");
    }
  };

  const openRefer = () => {
    if (!currentUser?.id) return;

    const referLink = `https://t.me/ClaimLifafaBot/app?startapp=${lifafa.id}&ref=${currentUser.id}`;

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

  if (screen === "task") {
    return <TaskScreen lifafa={lifafa} onStart={openTask} onAddMobile={addMobile} />;
  }

  if (screen === "claim") {
    return <ClaimScreen lifafa={lifafa} onClaim={claimReward} />;
  }

  if (screen === "success") {
    return <SuccessScreen amount={claimAmount} />;
  }

  if (screen === "already") {
    return <AlreadyClaimed lifafa={lifafa} onRefer={openRefer} />;
  }

  return null;
}
