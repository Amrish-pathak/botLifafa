const Skeleton = ({ className = "" }) => (
  <span className={`inline-block bg-white/10 rounded-md animate-pulse ${className}`} />
);

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-x-hidden relative">
      {/* Glow BG — same as TaskScreen, taaki transition seamless lage */}
      <div className="absolute top-[-120px] left-[-120px] w-[260px] h-[260px] bg-amber-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[240px] h-[240px] bg-orange-500/20 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-md mx-auto px-4 py-5 pb-32 flex flex-col gap-4">
        {/* HEADER skeleton */}
        <div className="flex items-center justify-between px-1 py-2">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        {/* REWARD CARD skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-white/10 rounded-[30px] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
          <div className="relative z-10">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="mt-3 h-7 w-48" />
            <div className="mt-5 flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-9 w-28" />
              </div>
              <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* PROGRESS CARD skeleton */}
        <div className="relative bg-gradient-to-br from-[#1a1f2f] to-[#111827] border border-zinc-800 rounded-2xl p-4 space-y-4 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-2.5 w-28" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-2.5 w-24" />
            </div>
            <div className="w-14 h-14 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
          </div>
          <div className="border-t border-zinc-800" />
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-2.5 w-16" />
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full w-1/3 rounded-full bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>

        {/* STEPS CARD skeleton */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[28px] p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/5 animate-pulse" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* START BUTTON skeleton */}
        <div className="w-full h-14 rounded-2xl bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}
