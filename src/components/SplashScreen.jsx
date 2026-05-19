import WebApp from "@twa-dev/sdk";

export default function SplashScreen() {

  const tgUser =
    WebApp?.initDataUnsafe?.user;

  const hasUser =
    tgUser?.id;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white overflow-hidden">

      {/* HEADER */}

      <div className="h-20 border-b border-[#1f1f1f] bg-[#111111]/90 backdrop-blur-xl flex items-center justify-between px-4">

        {/* LEFT */}

        <div className="flex items-center gap-3">

          {/* PROFILE */}

          <div className="relative">

            {
              tgUser?.photo_url ? (

                <img
                  src={tgUser.photo_url}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover border border-[#2d2d2d]"
                />

              ) : (

                <div className="w-14 h-14 rounded-2xl bg-[#1d1d1d] border border-[#2d2d2d] animate-pulse"></div>

              )
            }

            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#111] ${
              hasUser
                ? "bg-green-500"
                : "bg-red-500"
            }`}></div>

          </div>

          {/* USER DETAILS */}

          <div>

            <h2 className="font-bold text-[15px] leading-tight">

              {
                tgUser?.first_name
                  ? tgUser.first_name
                  : "---"
              }

            </h2>

            <p className="text-gray-400 text-sm mt-1">

              ID:
              {
                tgUser?.id
                  ? ` ${tgUser.id}`
                  : " ---"
              }

            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="text-right">

          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium ${
            hasUser
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>

            <div className={`w-2 h-2 rounded-full ${
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

      <div className="flex flex-col items-center justify-center px-5 pt-10">

        {/* LOGO */}

        <div className="relative mt-5">

          {/* OUTER GLOW */}

          <div className="absolute inset-0 rounded-full bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>

          {/* RING */}

          <div className="w-40 h-40 rounded-full border-[6px] border-blue-500/30 border-t-blue-500 animate-spin"></div>

          {/* INNER */}

          <div className="absolute inset-5 rounded-full bg-[#121212] border border-[#2c2c2c] flex items-center justify-center shadow-2xl">

            <div className="text-center">

              <div className="text-5xl animate-bounce">
                💸
              </div>

              <h2 className="mt-3 text-2xl font-extrabold tracking-wide">
                TaskWala
              </h2>

            </div>

          </div>

        </div>

        {/* TEXTS */}

        <div className="mt-10 text-center">

          <h1 className="text-3xl font-extrabold tracking-wide">

            TaskWala Solutions India

          </h1>

          <p className="text-gray-400 mt-3 text-lg">

            Secure Reward Validation System

          </p>

          <p className="text-gray-500 mt-2 text-sm">

            Connecting Telegram Wallet Services...

          </p>

        </div>

        {/* LOADING */}

        <div className="mt-12 w-full max-w-md grid gap-4">

          {/* SKELETON 1 */}

          <div className="bg-[#151515] border border-[#232323] rounded-2xl p-4">

            <div className="h-4 w-32 bg-[#262626] rounded animate-pulse"></div>

            <div className="h-3 w-full bg-[#202020] rounded mt-4 animate-pulse"></div>

            <div className="h-3 w-2/3 bg-[#202020] rounded mt-3 animate-pulse"></div>

          </div>

          {/* SKELETON 2 */}

          <div className="bg-[#151515] border border-[#232323] rounded-2xl p-4">

            <div className="flex items-center justify-between">

              <div className="h-4 w-28 bg-[#262626] rounded animate-pulse"></div>

              <div className="h-8 w-20 bg-[#262626] rounded-xl animate-pulse"></div>

            </div>

            <div className="h-3 w-full bg-[#202020] rounded mt-5 animate-pulse"></div>

          </div>

          {/* SKELETON 3 */}

          <div className="bg-[#151515] border border-[#232323] rounded-2xl p-4">

            <div className="flex gap-3">

              <div className="w-12 h-12 rounded-xl bg-[#262626] animate-pulse"></div>

              <div className="flex-1">

                <div className="h-4 w-36 bg-[#262626] rounded animate-pulse"></div>

                <div className="h-3 w-24 bg-[#202020] rounded mt-3 animate-pulse"></div>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="mt-10 text-center text-gray-600 text-xs pb-10">

          Powered By TaskWala Wallet Infrastructure

        </div>

      </div>

    </div>
  );
}
