import { useRef, useState } from "react";
import RepCounter from "../components/RepCounter";
import { useUserData } from "../context/UserDataContext.jsx";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatMinutesToTime = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hrs >= 12 ? "PM" : "AM";
  const displayHour = ((hrs + 11) % 12) + 1;
  return `${displayHour}:${mins.toString().padStart(2, "0")} ${suffix}`;
};

export default function Workout() {
  const { user, logWorkoutSession } = useUserData();
  const [exercise, setExercise] = useState("curl");
  const [sessionReps, setSessionReps] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);
  const [status, setStatus] = useState("idle");

  const absoluteRepsRef = useRef(0);
  const baselineRef = useRef(0);

  const handleRepChange = (count) => {
    absoluteRepsRef.current = count;
    if (!sessionStart) return;
    const delta = Math.max(0, count - baselineRef.current);
    setSessionReps(delta);
  };

  const beginSession = () => {
    baselineRef.current = absoluteRepsRef.current;
    setSessionReps(0);
    setSessionStart(Date.now());
    setStatus("recording");
  };

  const finishSession = () => {
    if (!sessionStart || sessionReps <= 0) return;

    const endedAt = Date.now();
    logWorkoutSession({
      exercise,
      reps: sessionReps,
      startedAt: sessionStart,
      endedAt,
    });

    setSessionStart(null);
    setSessionReps(0);
    baselineRef.current = absoluteRepsRef.current;
    setStatus("saved");
  };

  const sessionActive = Boolean(sessionStart);
  const intensityPercent = Math.round(
    (user.embedding?.trainingIntensity ?? 0) * 100
  );
  const slumpDays =
    user.embedding?.slumpDays?.map((day) => DAY_LABELS[day]).join(" / ") ||
    "None";
  const avgCheckIn = formatMinutesToTime(user.embedding?.avgCheckInTime ?? 0);

  const statusMessage =
    status === "recording"
      ? "Tracking reps directly from the camera."
      : status === "saved"
        ? "Session saved. Streak & behavior updated."
        : "Start a session and let the camera feed your streak.";

  return (
    <div className="pt-16 pb-24 px-4 text-white max-w-md mx-auto">
      <div className="mb-6">
        <p className="text-sm uppercase text-emerald-400 tracking-wide">
          AI rep counter
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Track a session</h1>
        <p className="text-gray-400 text-sm mt-2">{statusMessage}</p>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-400 uppercase">Exercise</label>
        <select
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 mt-2 text-white"
        >
          <option value="curl">Bicep Curl</option>
          <option value="squat">Squat</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-gray-400 uppercase">Session reps</div>
          <div className="text-2xl font-semibold mt-1">{sessionReps}</div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={beginSession}
            disabled={sessionActive}
            className={`px-4 py-3 rounded-2xl text-sm font-semibold transition ${
              sessionActive
                ? "bg-white/10 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Start Session
          </button>
          <button
            onClick={finishSession}
            disabled={!sessionActive || sessionReps === 0}
            className={`px-4 py-3 rounded-2xl text-sm font-semibold transition ${
              !sessionActive || sessionReps === 0
                ? "bg-white/5 text-gray-500 cursor-not-allowed"
                : "bg-emerald-500 text-black hover:bg-emerald-400"
            }`}
          >
            Finish
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-black/30 border border-white/10 p-4 mb-8">
        <RepCounter
          exercise={exercise}
          reps={sessionReps}
          onRepChange={handleRepChange}
        />
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase">Streak</div>
            <div className="text-3xl font-bold">{user.streak || 0} days</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase">Avg check-in</div>
            <div className="text-xl font-semibold">{avgCheckIn}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500">
              Intensity
            </div>
            <div className="text-lg font-semibold">{intensityPercent}%</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500">
              Slump days
            </div>
            <div className="text-lg font-semibold">{slumpDays}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500">
              Peak window
            </div>
            <div className="text-lg font-semibold">
              {user.weeklySummary?.peakTrainingTime || "—"}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400 border-t border-white/5 pt-3 italic">
          {user.weeklySummary?.advice ||
            "Train once to unlock your first AI summary."}
        </div>
      </div>
    </div>
  );
}
