export default function ErrorScreen({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-5 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-red-500/20 blur-3xl rounded-full top-[-80px] right-[-80px]" />
      <div className="absolute w-72 h-72 bg-red-700/10 blur-3xl rounded-full bottom-[-100px] left-[-100px]" />

      {/* Card */}
      <div className="relative bg-[#111111]/95 backdrop-blur-xl border border-red-500/20 rounded-[32px] p-8 w-full max-w-md shadow-[0_0_40px_rgba(255,0,0,0.15)]">

        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-inner">
          <span className="text-5xl">⚠️</span>
        </div>

        {/* Title */}
        <h2 className="text-white text-3xl font-extrabold mt-7 text-center tracking-tight">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-400 mt-4 text-center leading-relaxed text-[15px]">
          {message}
        </p>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="
            mt-8
            w-full
            h-14
            rounded-2xl
            bg-gradient-to-r
            from-red-600
            to-red-500
            text-white
            text-lg
            font-bold
            shadow-lg
            shadow-red-500/20
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-red-500/40
            active:scale-[0.98]
          "
        >
          Retry
        </button>

        {/* Footer */}
        <p className="text-gray-600 text-xs text-center mt-5">
          Please check your internet connection or try again later.
        </p>

      </div>
    </div>
  );
}