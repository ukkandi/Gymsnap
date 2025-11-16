import { useUserData } from "../context/UserDataContext.jsx";

export default function WeeklySummary() {
  const { user } = useUserData();
  const summary = user.weeklySummary || {};

  const statBlocks = [
    { label: "Total sets", value: summary.totalSets ?? 0 },
    { label: "Favorite group", value: summary.favoriteMuscleGroup || "—" },
    { label: "Peak time", value: summary.peakTrainingTime || "—" },
    { label: "Consistency", value: `${summary.consistencyScore ?? 0}%` },
    { label: "Effort", value: summary.effortLevel || "—" },
    { label: "Slump day", value: summary.slumpDay || "—" },
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-500/20 via-black/40 to-black border border-white/10 p-5 mb-6 text-white">
      <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
        Weekly AI Summary
      </div>
      <h2 className="text-2xl font-semibold mt-1">Behavior Recap</h2>
      <p className="text-sm text-gray-300 mt-1">
        Real training data from the rep counter drives this identity snapshot.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        {statBlocks.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="text-[11px] uppercase text-gray-400 tracking-wide">
              {stat.label}
            </div>
            <div className="text-lg font-semibold mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
        <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-1">
          Mood
        </div>
        <div className="text-lg font-semibold">
          {summary.dominantEmotion || "Neutral"}
        </div>
      </div>

      <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/5 text-sm italic text-gray-200">
        {summary.advice || "Track a workout to unlock weekly coaching."}
      </div>
    </div>
  );
}
