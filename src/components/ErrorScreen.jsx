export default function ErrorScreen({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-hidden relative flex items-center justify-center px-4">

      {/* TOP GLOW */}
      <div className="absolute top-[-140px] left-[-120px] w-[300px] h-[300px] bg-red-500/20 blur-3xl rounded-full"></div>

      {/* BOTTOM GLOW */}
      <div className="absolute bottom-[-120px] right-[-120px] w-[280px] h-[280px] bg-orange-500/10 blur-3xl rounded-full"></div>

      {/* CENTER GRID EFFECT */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:22px_22px]"></div>

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-md">

        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7 shadow-[0_25px_90px_rgba(0,0,0,0.45)]">

          {/* INNER GLOW */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-red-500/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">

            {/* ICON */}
            <div className="mx-auto relative w-28 h-28 rounded-[30px] bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-400/20 flex items-center justify-center shadow-[0_0_40px_rgba(255,0,0,0.15)]">

              <div className="absolute inset-0 rounded-[30px] bg-white/[0.03]"></div>

              <span className="text-6xl relative z-10 animate-pulse">
                ⚠️
              </span>

            </div>

            {/* LABEL */}
            <div className="mt-7 text-center">

              <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">
                Error Detected
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight leading-tight">
                {message}
              </h1>

              <p className="mt-4 text-gray-400 text-[15px] leading-7">
                {message}
              </p>

            </div>

            

            {/* BUTTON */}
            <button
              onClick={onRetry}
              className="
                relative
                overflow-hidden
                mt-7
                w-full
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-red-500
                via-orange-500
                to-red-500
                text-white
                text-lg
                font-black
                shadow-[0_12px_35px_rgba(255,80,80,0.30)]
                transition-all
                duration-300
                active:scale-[0.98]
                hover:scale-[1.01]
              "
            >

              <span className="relative z-10">
                Retry Again
              </span>

              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-white/10"></div>

            </button>

            {/* FOOTER */}
            <div className="mt-6 text-center">

              <p className="text-xs text-gray-500 leading-6">
                Secure verification powered by
              </p>

              <p className="mt-1 font-semibold text-white">
                TaskWala Solution India
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}