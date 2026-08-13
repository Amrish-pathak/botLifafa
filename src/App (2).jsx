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

  const initApp = async () => {
    try {
      WebApp.ready();
      WebApp.expand(); // ── poori screen height turant use — pehle frame se hi "app jaisa" feel

      const user = WebApp.initDataUnsafe.user;

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

  // ── Task link open — WebApp.openLink() Telegram ke native bridge se
  // link kholta hai, isliye async call ke baad bhi popup-blocker se
  // affect nahi hota (raw window.open() hota to yaha block ho sakta tha)
  const openTask = () => {
    try {
      WebApp.openLink(lifafa.referLink);
    } catch {
      window.open(lifafa.referLink, "_blank"); // ── Telegram ke bahar test karte waqt fallback
    }
  };

  // ── Naya: wallet number add-mobile endpoint pe bhejo, initData ke saath
  // (backend middleware isko verify karega)
  const addMobile = async (number) => {
    const user = WebApp.initDataUnsafe.user;
    const res = await api.post("/botlifafa/add-mobile", {
      lifafaId: lifafa.id,
        telegramId: user.id,
        number,
    });
    return res.data;
  };

  const claimReward = async (number) => {
    try {
      const user = WebApp.initDataUnsafe.user;

      const res = await api.post("/botlifafa/claim", {
        lifafaId: lifafa.id,
        telegramId: user.id,
        number,
      });

      setClaimAmount(res.data.amount);
      setScreen("success");
    } catch (err) {
      alert("Claim Failed");
    }
  };

  const openRefer = () => {
    const user = WebApp.initDataUnsafe.user;

    const referLink = `https://t.me/ClaimLifafaBot/app?startapp=${lifafa.id}&ref=${user.id}`;

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
