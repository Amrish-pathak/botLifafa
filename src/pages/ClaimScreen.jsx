import { useState } from "react";

export default function ClaimScreen({
  lifafa,
  onClaim,
}) {

  const [number, setNumber] = useState("");

  return (
    <div className="min-h-screen bg-black text-white p-5">

      <div className="bg-[#171717] rounded-3xl p-5 border border-[#2a2a2a]">

        <h1 className="text-3xl font-bold">
          💰 Claim Reward
        </h1>

        <div className="mt-5 bg-green-500/10 p-4 rounded-2xl border border-green-500">

          <p className="text-gray-400">
            Claim Amount
          </p>

          <h2 className="text-4xl font-bold text-green-400 mt-2">
            ₹{lifafa.claimAmount}
          </h2>

        </div>

        <input
          type="number"
          placeholder="Enter Number"
          value={number}
          onChange={(e)=>setNumber(e.target.value)}
          className="mt-6 w-full h-14 rounded-2xl bg-[#222] px-4 outline-none"
        />

        <button
          onClick={()=>onClaim(number)}
          className="mt-5 bg-green-600 w-full h-14 rounded-2xl text-xl font-bold"
        >
          Claim ₹{lifafa.claimAmount}
        </button>

      </div>

    </div>
  );
}
