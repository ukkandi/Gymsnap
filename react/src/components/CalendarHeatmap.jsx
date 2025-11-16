import { useUserData } from "../context/UserDataContext.jsx";

const getLevelClass = (value, maxValue) => {
  if (value === 0) return "bg-white/5 border-white/10 text-gray-500";
  const ratio = value / (maxValue || 1);
  if (ratio > 0.66) return "bg-emerald-500/80 border-emerald-300 text-white";
  if (ratio > 0.33) return "bg-emerald-500/40 border-emerald-300/60 text-white";
  return "bg-emerald-500/20 border-emerald-300/30 text-white";
};

export default function CalendarHeatmap() {
  const { stats } = useUserData();
  const data = stats?.calendarHeatmap || [];
  if (!data.length) return null;

  const maxValue = data.reduce(
    (max, entry) => (entry.value > max ? entry.value : max),
    0
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
            Consistency Heatmap
          </div>
          <p className="text-sm text-gray-400">
            Last 4 weeks of sessions from the AI rep counter.
          </p>
        </div>
        <div className="text-xs text-gray-400">Dark = heavy work</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {data.map((entry) => (
          <div
            key={entry.key}
            className={`aspect-square rounded-xl border text-[10px] flex items-center justify-center ${getLevelClass(
              entry.value,
              maxValue
            )}`}
          >
            {new Date(entry.date).getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}
