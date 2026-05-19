export default function AlreadyClaimed({
  lifafa,
  onRefer,
}) {

  return (
    <div className="min-h-screen bg-black text-white p-5">

      <div className="bg-[#171717] rounded-3xl p-5 border border-yellow-500 text-center">

        <div className="text-7xl">
          🥳
        </div>

        <h1 className="text-3xl font-bold mt-5">
          Already Claimed
        </h1>

        <p className="text-gray-400 mt-3">
          You already claimed this reward
        </p>

        <button
          onClick={onRefer}
          className="mt-8 bg-blue-600 w-full h-14 rounded-2xl text-xl font-bold"
        >
          🎁 Refer & Earn
        </button>

        <div className="mt-5 bg-[#222] rounded-2xl p-4">

          <p className="text-gray-400">
            Per Referral Reward
          </p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            ₹1
          </h2>

        </div>

      </div>

    </div>
  );
}
