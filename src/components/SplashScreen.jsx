import WebApp from "@twa-dev/sdk";

export default function SplashScreen() {

  const tgUser =
    WebApp?.initDataUnsafe?.user;

  const hasUser =
    tgUser?.id;

  return (
    <div className="min-h-screen bg-[#070707] text-white overflow-hidden flex flex-col">

      {/* HEADER */}

      <div className="h-[78px] border-b border-[#1d1d1d] bg-[#101010]/95 backdrop-blur-xl flex items-center justify-between px-3 sm:px-5">

        {/* LEFT */}

        <div className="flex items-center gap-3 min-w-0">

          {/* PROFILE */}

          <div className="relative shrink-0">

            {
              tgUser?.photo_url ? (

                <img
                  src={tgUser.photo_url}
                  alt=""
                  className="w-[52px] h-[52px] rounded-2xl object-cover border border-[#2d2d2d]"
                />

              ) : (

                <div className="w-[52px] h-[52px] rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] animate-pulse"></div>

              )
            }

            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#101010] ${
              hasUser
                ? "bg-green-500"
                : "bg-red-500"
            }`}></div>

          </div>

          {/* USER INFO */}

          <div className="min-w-0">

            <h2 className="font-bold text-[15px] sm:text-[16px] truncate">

              {
                tgUser?.first_name
                  ? tgUser.first_name
                  : "---"
              }

            </h2>

            <p className="text-gray-400 text-[12px] sm:text-sm truncate">

              ID:
              {
                tgUser?.id
                  ? ` ${tgUser.id}`
                  : " ---"
              }

            </p>

          </div>

        </div>

        {/* STATUS */}

        <div>

          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] sm:text-sm font-medium ${
            hasUser
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>

            <div className={`w-2 h-2 rounded-full animate-pulse ${
              hasUser
                ? "bg-green-400"
                : "bg-red-400"
            }`}></div>

            {
              hasUser
                ? "Active"
                : "Error"
            }

          </div>

        </div>

      </div>

      {/* BODY */}

      <div className="flex-1 flex flex-col items-center justify-center px-5 pt-5 pb-8">

        {/* LOGO */}

        <div className="relative mt-2">

          {/* GLOW */}

          <div className="absolute inset-0 rounded-full bg-blue-500 blur-[70px] opacity-20 animate-pulse"></div>

          {/* ROTATING RING */}

          <div className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full border-[5px] border-blue-500/20 border-t-blue-500 animate-spin"></div>

          {/* INNER */}

          <div className="absolute inset-[14px] rounded-full bg-[#101010] border border-[#252525] flex items-center justify-center shadow-2xl">

            <div className="text-center">

              <div className="text-5xl sm:text-6xl animate-bounce">
                💸
              </div>

              <h2 className="mt-3 text-[22px] sm:text-3xl font-extrabold tracking-wide">

                TaskWala

              </h2>

            </div>

          </div>

        </div>

        {/* ANIMATED TEXTS */}

        <div className="mt-10 text-center px-2">

          <h1 className="text-[26px] sm:text-4xl font-black tracking-wide leading-tight opacity-0 animate-[fadeUp_0.8s_ease_forwards]">

            TaskWala Solutions India

          </h1>

          <p className="text-gray-400 mt-4 text-[15px] sm:text-lg opacity-0 animate-[fadeUp_0.8s_ease_forwards] [animation-delay:1s]">

            Secure Reward Validation System

          </p>

          <p className="text-gray-500 mt-3 text-[13px] sm:text-sm opacity-0 animate-[fadeUp_0.8s_ease_forwards] [animation-delay:2s]">

            Connecting Telegram Wallet Services...

          </p>

        </div>

        {/* LOADING SKELETON */}

        <div className="mt-10 w-full max-w-md grid gap-4">

          {/* CARD 1 */}

          <div className="bg-[#141414] border border-[#202020] rounded-3xl p-4">

            <div className="h-4 w-28 bg-[#252525] rounded-full animate-pulse"></div>

            <div className="h-3 w-full bg-[#1d1d1d] rounded-full mt-4 animate-pulse"></div>

            <div className="h-3 w-2/3 bg-[#1d1d1d] rounded-full mt-3 animate-pulse"></div>

          </div>

          {/* CARD 2 */}

          <div className="bg-[#141414] border border-[#202020] rounded-3xl p-4">

            <div className="flex items-center justify-between">

              <div className="h-4 w-24 bg-[#252525] rounded-full animate-pulse"></div>

              <div className="h-8 w-20 bg-[#252525] rounded-2xl animate-pulse"></div>

            </div>

            <div className="h-3 w-full bg-[#1d1d1d] rounded-full mt-5 animate-pulse"></div>

          </div>

          {/* CARD 3 */}

          <div className="bg-[#141414] border border-[#202020] rounded-3xl p-4">

            <div className="flex gap-3">

              <div className="w-12 h-12 rounded-2xl bg-[#252525] animate-pulse"></div>

              <div className="flex-1">

                <div className="h-4 w-32 bg-[#252525] rounded-full animate-pulse"></div>

                <div className="h-3 w-20 bg-[#1d1d1d] rounded-full mt-3 animate-pulse"></div>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="mt-8 text-center text-gray-600 text-[11px] sm:text-xs px-5 leading-relaxed">

          Powered By TaskWala Wallet Infrastructure

        </div>

      </div>

      {/* STYLE */}

      <style>

        {`

          @keyframes fadeUp {

            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }

          }

        `}

      </style>

    </div>
  );
}
