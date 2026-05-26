export default function ReferSuccessModal({ 
  referLink, 
  referAmount, 
  userAmount,
  onClose,
  onShare 
}) {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referLink);
      alert("✓ Referral link copied!");
    } catch {
      alert("Copy failed");
    }
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join TaskWala & Earn",
        text: `Complete simple tasks and earn ₹${userAmount}! Join now using my referral link.`,
        url: referLink,
      });
    } else {
      copyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
      
      {/* Modal */}
      <div className="bg-[#0b0f19] border border-white/10 rounded-[32px] p-6 max-w-md w-full shadow-2xl relative overflow-hidden animate-slide-up">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/20 blur-3xl rounded-full" />
        
        <div className="relative z-10">
          
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-4xl mx-auto shadow-lg animate-bounce-slow">
              🎉
            </div>
            
            <h2 className="text-2xl font-black mt-4 mb-2">
              Link Created!
            </h2>
            
            <p className="text-sm text-gray-400">
              Your referral link is ready to share
            </p>
          </div>

          {/* Reward Breakdown */}
          <div className="space-y-3 mb-6">
            
            {/* You Earn */}
            <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-lg">
                    💰
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">You Earn Per Referral</p>
                    <p className="font-bold text-lg text-amber-300">₹{referAmount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Friend Earns */}
            <div className="bg-green-500/10 border border-green-400/20 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-lg">
                    🎁
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Friend Gets</p>
                    <p className="font-bold text-lg text-green-300">₹{userAmount}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Link Display */}
          <div className="bg-[#131a28] border border-green-400/30 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-2 mb-2">
              <div className="text-lg">🔗</div>
              <p className="text-xs text-green-400 font-semibold">Your Referral Link</p>
            </div>
            <p className="text-xs text-gray-300 break-all leading-relaxed font-mono bg-black/40 rounded-xl p-3">
              {referLink}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            
            <button
              onClick={copyLink}
              className="
                h-14
                rounded-2xl
                bg-white/5
                border
                border-white/10
                text-white
                font-bold
                flex
                items-center
                justify-center
                gap-2
                active:scale-95
                transition-all
              "
            >
              <span className="text-lg">📋</span>
              <span>Copy</span>
            </button>

            <button
              onClick={shareLink}
              className="
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-green-400
                to-emerald-500
                text-black
                font-black
                flex
                items-center
                justify-center
                gap-2
                active:scale-95
                transition-all
                shadow-[0_10px_20px_rgba(0,255,120,0.2)]
              "
            >
              <span className="text-lg">📤</span>
              <span>Share</span>
            </button>

          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="
              w-full
              h-12
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-gray-400
              font-semibold
              active:scale-95
              transition-all
            "
          >
            Close
          </button>

        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  );
}