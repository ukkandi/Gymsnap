import { useUserData } from "../context/UserDataContext.jsx";

export default function MuscleSplitChart() {
  const { stats } = useUserData();
  const data = stats?.muscleSplit || [];
  if (!data.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
            Muscle focus
          </div>
          <p className="text-sm text-gray-400">
            Where the rep counter sees the most volume.
          </p>
        </div>
        <div className="text-xs text-gray-400">Sets %</div>
      </div>

      <div className="space-y-3">
        {data.map((entry) => (
          <div key={entry.label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-300">{entry.label}</span>
              <span className="text-white font-semibold">
                {entry.percent ?? 0}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500"
                style={{ width: `${entry.percent ?? 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
