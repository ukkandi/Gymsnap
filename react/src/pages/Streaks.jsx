import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useUserData } from "../context/UserDataContext.jsx";
import CalendarHeatmap from "../components/CalendarHeatmap.jsx";
import IntensityGraph from "../components/IntensityGraph.jsx";
import MuscleSplitChart from "../components/MuscleSplitChart.jsx";

const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hrs >= 12 ? "PM" : "AM";
  const displayHour = ((hrs + 11) % 12) + 1;
  return `${displayHour}:${mins.toString().padStart(2, "0")} ${suffix}`;
};

export default function Streaks() {
  const { user, logWorkoutSession } = useUserData();
  const [logging, setLogging] = useState(false);
  const exerciseOptions = [
    { id: "curl", label: "Bicep Curl" },
    { id: "squat", label: "Squat" },
    { id: "pushup", label: "Push-Up" },
    { id: "pullup", label: "Pull-Up" },
    { id: "bench", label: "Bench Press" },
    { id: "deadlift", label: "Deadlift" },
    { id: "row", label: "Row" },
    { id: "lunge", label: "Lunge" },
  ];
  const [quickExercise, setQuickExercise] = useState("curl");
  const [quickReps, setQuickReps] = useState(20);

  const recentSessions = useMemo(() => {
    const sessions = [...(user.sessions || [])];
    return sessions.slice(-3).reverse();
  }, [user.sessions]);

  const handleQuickCheckIn = () => {
    if (logging) return;
    const parsedReps = Number(quickReps);
    if (!parsedReps || parsedReps <= 0) return;
    setLogging(true);
    const now = Date.now();
    logWorkoutSession({
      exercise: quickExercise,
      reps: parsedReps,
      startedAt: now - 1000 * 60 * 15,
      endedAt: now,
    });
    setTimeout(() => setLogging(false), 400);
  };

  const STREAK_GOAL = 21;
  const streakValue = user.streak || 0;
  const streakProgress = Math.min(streakValue / STREAK_GOAL, 1);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const dashArray = `${circumference} ${circumference}`;
  const dashOffset = circumference * (1 - streakProgress);

  return (
    <div className="pt-16 pb-24 px-4 text-white max-w-md mx-auto space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-500/20 via-black/80 to-black border border-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="relative w-[150px] h-[150px]">
            <svg viewBox="0 0 150 150" className="w-full h-full rotate-[135deg]">
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="url(#streakGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />
              <defs>
                <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#a7f3d0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                Streak
              </div>
              <div className="text-4xl font-bold">{streakValue}</div>
              <div className="text-[11px] text-gray-400">
                Goal {STREAK_GOAL} days
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">
              Behavior snapshot
            </div>
            <p className="text-2xl font-semibold mt-2">
              Avg check-in {formatTime(user.embedding?.avgCheckInTime ?? 0)}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Ring fills from live rep tracking and manual logs.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <select
              value={quickExercise}
              onChange={(e) => setQuickExercise(e.target.value)}
              className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-3 py-2 text-sm text-white"
            >
              {exerciseOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={quickReps}
              onChange={(e) => setQuickReps(e.target.value)}
              className="w-24 bg-black/60 border border-white/10 rounded-2xl px-3 py-2 text-sm text-white"
              placeholder="Reps"
            />
          </div>
          <button
            onClick={handleQuickCheckIn}
            disabled={logging}
            className={`px-5 py-3 rounded-2xl text-sm font-semibold border border-emerald-400/60 ${
              logging
                ? "text-emerald-200 cursor-not-allowed"
                : "text-black bg-emerald-400 hover:bg-emerald-300"
            }`}
          >
            {logging ? "Checked In" : "Quick Check-In"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm text-gray-300 mt-6">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500">
              Consistency
            </div>
            <div className="text-xl font-semibold">
              {Math.round((user.embedding?.streakConsistency ?? 0) * 100)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500">
              Intensity
            </div>
            <div className="text-xl font-semibold">
              {Math.round((user.embedding?.trainingIntensity ?? 0) * 100)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500">
              Slump days
            </div>
            <div className="text-xl font-semibold">
              {(user.embedding?.slumpDays || [])
                .map((day) =>
                  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]
                )
                .join(" · ") || "None"}
            </div>
          </div>
        </div>
      </section>

      <CalendarHeatmap
        action={
          <Link
            to="/calendar"
            state={{ tab: "streaks" }}
            className="inline-flex items-center text-emerald-300 hover:text-emerald-100 transition"
          >
            Full calendar →
          </Link>
        }
      />

      <IntensityGraph />
      <MuscleSplitChart />

      <section className="rounded-3xl bg-black/40 border border-white/10 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent check-ins</h2>
          <span className="text-xs text-gray-400">From AI rep counter</span>
        </div>

        {recentSessions.length === 0 && (
          <p className="text-sm text-gray-400">
            Log a session to unlock your history.
          </p>
        )}

        <div className="space-y-3">
          {recentSessions.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="font-semibold">
                  {session.exercise === "squat" ? "Squat" : "Bicep Curl"}
                </div>
                <div className="text-gray-400">
                  {formatDate(session.endedAt)}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                <span>{session.reps} reps tracked</span>
                <span>
                  {Math.round((session.reps / 12) * 10) / 10} sets est.
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
