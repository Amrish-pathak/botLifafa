import WebApp from "@twa-dev/sdk";

export default function HeaderScreen() {
  const tgUser = WebApp?.initDataUnsafe?.user;

  const hasUser = tgUser?.id;

  return (
    <>
      {/* HEADER */}
      <div className="">

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[28px] p-4 shadow-2xl">

          <div className="flex items-center justify-between gap-3">

            {/* LEFT */}
            <div className="flex items-center gap-4 min-w-0">

              {/* PROFILE */}
              <div className="relative shrink-0">

                {
                  tgUser?.photo_url ? (

                    <img
                      src={tgUser.photo_url}
                      alt=""
                      className="w-16 h-16 rounded-full object-cover border border-white/10 shadow-lg"
                    />

                  ) : (

                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-2xl font-bold shadow-lg">

                      {
                        tgUser?.first_name
                          ? tgUser.first_name.charAt(0)
                          : "U"
                      }

                    </div>

                  )
                }

                {/* ONLINE DOT */}
                <div
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0b0f19] ${
                    hasUser
                      ? "bg-green-400"
                      : "bg-red-500"
                  }`}
                ></div>

              </div>

              {/* USER INFO */}
              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2 flex-wrap">

                  <h2 className="text-lg font-semibold truncate">
                    {
                      tgUser?.first_name
                        ? tgUser.first_name
                        : "---"
                    }
                  </h2>

                  {
                    hasUser && (
                      <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-400/20 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                        ⭐ PREMIUM
                      </div>
                    )
                  }

                </div>

                <p className="text-sm text-gray-400 mt-1 truncate">
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
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 border shrink-0 ${
                hasUser
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }`}
            >

              <span
                className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  hasUser
                    ? "bg-emerald-400"
                    : "bg-red-400"
                }`}
              ></span>

              <span
                className={`text-xs font-medium ${
                  hasUser
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {
                  hasUser
                    ? "Live"
                    : "Error"
                }
              </span>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}