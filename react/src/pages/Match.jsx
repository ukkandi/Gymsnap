import { useState } from "react";
import { gymbros, calculateCompatibility, currentUser } from "../data/mockGymbros";

export default function Match() {
  const [index, setIndex] = useState(0);
  const bro = gymbros[index % gymbros.length];
  const score = calculateCompatibility(currentUser, bro);

  const next = () => setIndex(i => (i + 1) % gymbros.length);

  return (
    <div className="pt-16 pb-28 px-4 max-w-md mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-2">Find your gym twin</h2>
      <p className="text-gray-400 text-sm mb-6 text-center">
        Swipe through gymbros matched by vibe, schedule and goals.
      </p>

      {/* Card */}
      <div className="relative w-full">
        <div className="relative mx-auto w-[280px] h-[360px] rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/15 shadow-[0_22px_50px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Top gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          <div className="p-5 flex flex-col h-full justify-between">
            {/* Name / gym */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 shadow-md" />
                <div>
                  <div className="text-xl font-semibold">
                    {bro.name}, <span className="text-base text-gray-300">{bro.age}</span>
                  </div>
                  <div className="text-xs text-gray-400">{bro.gym}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-300 mb-3">
                <StatBox label="Bench" value={`${bro.maxBench} lb`} />
                <StatBox label="Squat" value={`${bro.maxSquat} lb`} />
                <StatBox label="Deadlift" value={`${bro.maxDeadlift} lb`} />
              </div>

              {/* Personality / vibe */}
              <div className="mb-2">
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Personality
                </div>
                <div className="text-sm">{bro.gymPersonality}</div>
              </div>

              <div className="text-xs text-gray-300">
                Goals:{" "}
                <span className="text-gray-100">{bro.goals.join(", ")}</span>
              </div>

              <div className="mt-1 text-xs text-gray-400">
                Typical days: {bro.schedule.join(", ")}
              </div>
            </div>

            {/* Compatibility bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Compatibility</span>
                <span className="text-emerald-400 font-semibold">{score}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center space-x-6 mt-8">
        <button
          onClick={next}
          className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-2xl hover:bg-zinc-800 transition"
        >
          💀
        </button>
        <button
          onClick={next}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 shadow-[0_0_40px_rgba(34,197,94,0.7)] flex items-center justify-center text-2xl hover:scale-105 transition"
        >
          💪
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Matches are demo-only right now. Real matching comes later.
      </p>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-2 text-center">
      <div className="text-[10px] text-gray-400 uppercase">{label}</div>
      <div className="text-xs font-semibold">{value}</div>
    </div>
  );
}
