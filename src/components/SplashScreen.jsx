import WebApp from "@twa-dev/sdk";

export default function SplashScreen() {
  const user = WebApp?.initDataUnsafe?.user;

  const firstName = user?.first_name || "User";
  const userId = user?.id ? String(user.id) : "";

  return (
    <div className="fixed inset-0 z-[99999] bg-[#070707] text-white flex items-center justify-center overflow-hidden">

      {/* Very light background glow */}
      <div className="absolute w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm px-6 text-center">

        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative w-28 h-28 flex items-center justify-center">

            {/* Lightweight ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-blue-500/20 border-t-blue-500 animate-spin" />

            {/* Logo container */}
            <div className="w-20 h-20 rounded-[24px] bg-[#111] border border-[#252525] flex items-center justify-center shadow-lg">
              <span className="text-4xl">💸</span>
            </div>
          </div>
        </div>

        {/* Brand */}
        <div className="mt-7">
          <h1 className="text-2xl font-extrabold tracking-tight">
            TaskWala
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            TaskWala Solutions India
          </p>
        </div>

        {/* User */}
        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

          <span>
            {firstName}
            {userId ? ` • ${userId}` : ""}
          </span>
        </div>

        {/* Loading */}
        <div className="mt-8">

          <div className="mx-auto w-40 h-1 rounded-full bg-[#1c1c1c] overflow-hidden">
            <div className="h-full w-1/2 bg-blue-500 rounded-full animate-[loading_1s_ease-in-out_infinite]" />
          </div>

          <p className="mt-4 text-[11px] text-gray-600">
            Starting TaskWala...
          </p>

        </div>

      </div>

      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(220%);
          }
        }
      `}</style>

    </div>
  );
}
