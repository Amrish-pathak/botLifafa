export default function SuccessScreen({
  amount,
}) {

  return (
    <div className="h-screen bg-black flex items-center justify-center p-5">

      <div className="bg-[#171717] rounded-3xl border border-green-500 p-6 text-center w-full max-w-md">

        <div className="text-7xl">
          🎉
        </div>

        <h1 className="text-white text-3xl font-bold mt-5">
          Claim Successful
        </h1>

        <p className="text-gray-400 mt-3">
          Reward credited successfully
        </p>

        <div className="mt-6 bg-green-500/10 border border-green-500 rounded-2xl p-5">

          <h2 className="text-5xl text-green-400 font-bold">
            ₹{amount}
          </h2>

        </div>

      </div>

    </div>
  );
}
