import { useMemo } from "react";
import { useUserData } from "../context/UserDataContext.jsx";

export default function IntensityGraph() {
  const { stats } = useUserData();
  const data = stats?.intensityTrend || [];

  const { path, area, points } = useMemo(() => {
    if (!data.length) return { path: "", area: "", points: [] };
    const width = 280;
    const height = 120;
    const step = width / Math.max(data.length - 1, 1);

    const coords = data.map((entry, index) => {
      const x = index * step;
      const y = height - entry.value * height;
      return { x, y };
    });

    const pathString = coords
      .map((point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
      )
      .join(" ");

    const areaString = `${pathString} L ${
      coords[coords.length - 1]?.x ?? width
    } ${height} L 0 ${height} Z`;

    return {
      path: pathString,
      area: areaString,
      points: coords,
    };
  }, [data]);

  if (!data.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
            Intensity trend
          </div>
          <p className="text-sm text-gray-400">Last 7 days</p>
        </div>
        <div className="text-xs text-gray-400">0 → 100% effort</div>
      </div>

      <div className="relative">
        <svg viewBox="0 0 280 120" className="w-full h-32">
          <defs>
            <linearGradient id="intensityFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={area}
            fill="url(#intensityFill)"
            stroke="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={path}
            fill="none"
            stroke="#6ee7b7"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#34d399"
              stroke="#111"
              strokeWidth="1"
            />
          ))}
        </svg>
        <div className="flex justify-between text-xs uppercase text-gray-400 mt-2">
          {data.map((entry) => (
            <span key={entry.key}>{entry.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
