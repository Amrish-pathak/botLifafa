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

      // const user = WebApp.initDataUnsafe?.user;
      const user = {id: 1528011068};
      // const startParam = WebApp.initDataUnsafe?.start_param; // ✅ FIXED
      const startParam = "demo"; // ✅ FIXED


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



      // let lifafaId = startParam;
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
      console.log(err);

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

      const user = WebApp.initDataUnsafe?.user;

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

    const user = WebApp.initDataUnsafe?.user;

    const referLink = `https://t.me/ClaimLifafaBot/taskwala?startapp=${lifafa.id}_ref${user.id}`;

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

  switch (screen) {

    case "task":
      return <TaskScreen lifafa={lifafa} onStart={openTask} />;

    case "claim":
      return <ClaimScreen lifafa={lifafa} onClaim={claimReward} />;

    case "success":
      return <SuccessScreen amount={claimAmount} />;

    case "already":
      return <AlreadyClaimed lifafa={lifafa} onRefer={openRefer} />;

    default:
      return null;
  }
}