import { useMemo } from "react";
import { useUserData } from "../context/UserDataContext.jsx";
import CalendarHeatmap from "../components/CalendarHeatmap.jsx";
import IntensityGraph from "../components/IntensityGraph.jsx";
import MuscleSplitChart from "../components/MuscleSplitChart.jsx";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const describeWindow = (minutes = 0) => {
  const hour = minutes / 60;
  if (hour >= 21 || hour < 4) return "Late night";
  if (hour >= 17) return "Evening";
  if (hour >= 12) return "Afternoon";
  if (hour >= 9) return "Late morning";
  if (hour >= 5) return "Early morning";
  return "Overnight";
};

const formatMinutesToTime = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hrs >= 12 ? "PM" : "AM";
  const displayHour = ((hrs + 11) % 12) + 1;
  return `${displayHour}:${mins.toString().padStart(2, "0")} ${suffix}`;
};

const buildIdentity = (embedding = {}) => {
  const minutes = embedding.avgCheckInTime ?? 0;
  const intensity = embedding.trainingIntensity ?? 0.5;
  const energy = embedding.energyType || "mix";

  if (energy === "strength" && minutes >= 20 * 60) return "Night Grinder";
  if (energy === "strength" && intensity > 0.75) return "Strength Demon";
  if (energy === "cardio" && minutes < 8 * 60) return "Dawn Sprinter";
  if (energy === "calisthenics" && intensity < 0.6) return "Quiet Operator";
  if (energy === "functional") return "Chaos Engine";
  if (energy === "mix" && minutes >= 18 * 60) return "Wildcard Lifter";
  return "Locked-In Hybrid";
};

export default function Profile() {
  const { user } = useUserData();
  const embedding = user.embedding || {};

  const trainingIdentity = useMemo(
    () => buildIdentity(embedding),
    [embedding]
  );
  const intensityPercent = Math.round((embedding.trainingIntensity ?? 0.5) * 100);
  const energyScore = Math.round(
    ((embedding.trainingIntensity ?? 0.5) + (embedding.streakConsistency ?? 0.5)) /
      2 *
      100
  );
  const slumpDays =
    (embedding.slumpDays || []).length > 0
      ? embedding.slumpDays.map((day) => DAY_LABELS[day]).join(" · ")
      : "None";
  const preferredWindow = describeWindow(embedding.avgCheckInTime ?? 0);
  const preferredTime = formatMinutesToTime(embedding.avgCheckInTime ?? 0);

  return (
    <div className="pt-16 pb-24 px-4 text-white max-w-md mx-auto space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-500/30 via-black to-black border border-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm uppercase tracking-wide text-emerald-300">
              Gym personality
            </div>
            <h1 className="text-3xl font-bold mt-1">{user.name || "You"}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {trainingIdentity} · {user.streak || 0} day streak
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase text-gray-400">Energy score</div>
            <div className="text-3xl font-bold">{energyScore}%</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="uppercase tracking-wide text-gray-400">
              Intensity
            </span>
            <span className="font-semibold">{intensityPercent}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-yellow-300"
              style={{ width: `${intensityPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-black/40 border border-white/10 p-5 space-y-4">
        <div>
          <div className="text-xs uppercase text-gray-400 tracking-wide">
            Preferred training window
          </div>
          <p className="text-lg font-semibold">
            {preferredWindow} · {preferredTime}
          </p>
        </div>

        <div>
          <div className="text-xs uppercase text-gray-400 tracking-wide mb-1">
            Slump days
          </div>
          <p className="text-lg font-semibold">{slumpDays}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] uppercase tracking-wide text-gray-400">
              Energy type
            </div>
            <div className="text-lg font-semibold capitalize mt-1">
              {embedding.energyType || "mix"}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] uppercase tracking-wide text-gray-400">
              Streak consistency
            </div>
            <div className="text-lg font-semibold mt-1">
              {Math.round((embedding.streakConsistency ?? 0.5) * 100)}%
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-5">
        <div className="text-xs uppercase text-gray-400 tracking-[0.3em]">
          Behavior log
        </div>
        <p className="text-lg text-gray-300 mt-2">
          Lock in {preferredWindow.toLowerCase()} sessions. Your vibe is{" "}
          <span className="text-white font-semibold">{trainingIdentity}</span> —
          keep the streak alive by protecting {slumpDays.includes("None") ? "your open days" : slumpDays}.
        </p>

        <div className="mt-4 text-sm text-gray-400">
          Last updated from live rep tracking — every logged set makes this
          profile smarter.
        </div>
      </div>

      <CalendarHeatmap />
      <IntensityGraph />
      <MuscleSplitChart />
    </div>
  );
}
