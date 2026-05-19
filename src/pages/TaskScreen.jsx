export default function TaskScreen({
  lifafa,
  onStart,
}) {

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-5">

      <div className="bg-[#171717] rounded-3xl p-5 border border-[#2a2a2a]">

        <h1 className="text-3xl font-bold">
          🎁 {lifafa.title}
        </h1>

        <div className="mt-5 bg-green-500/10 border border-green-500 rounded-2xl p-4">

          <p className="text-gray-400">
            Total Reward
          </p>

          <h2 className="text-4xl font-bold text-green-400 mt-2">
            ₹{lifafa.claimAmount}
          </h2>

        </div>

        <div className="mt-8">

          <h3 className="text-xl font-bold">
            📋 How To Complete
          </h3>

          <div className="grid gap-3 mt-4">

            <div className="bg-[#222] p-4 rounded-2xl">
              1️⃣ Start bot using claim button
            </div>

            <div className="bg-[#222] p-4 rounded-2xl">
              2️⃣ Join channel & complete task
            </div>

            <div className="bg-[#222] p-4 rounded-2xl">
              3️⃣ Come back and verify reward
            </div>

          </div>

        </div>

        <button
          onClick={onStart}
          className="mt-8 bg-blue-600 w-full h-14 rounded-2xl text-xl font-bold"
        >
          🚀 Start & Claim ₹{lifafa.claimAmount}
        </button>

      </div>

      <div className="mt-5 text-gray-500 text-sm text-center">

        By continuing you agree to terms & conditions

      </div>

    </div>
  );
}
