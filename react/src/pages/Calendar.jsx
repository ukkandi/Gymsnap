import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserData } from "../context/UserDataContext.jsx";

const dayKey = (dateLike) => {
  const date = new Date(dateLike);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const estimateSets = (reps) => Math.max(1, Math.round(reps / 10));

export default function Calendar() {
  const { user } = useUserData();
  const [selectedDay, setSelectedDay] = useState(() => dayKey(new Date()));
  const navigate = useNavigate();
  const location = useLocation();

  const { weeks, dayStats } = useMemo(() => {
    const sessions = user.sessions || [];
    const map = sessions.reduce((acc, session) => {
      const key = dayKey(new Date(session.endedAt));
      if (!acc[key]) {
        acc[key] = {
          sessions: [],
          totalSets: 0,
          totalReps: 0,
        };
      }
      acc[key].sessions.push(session);
      acc[key].totalSets += estimateSets(session.reps);
      acc[key].totalReps += session.reps;
      return acc;
    }, {});

    const viewDate = new Date();
    const startOfMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      0
    );
    const daysInMonth = endOfMonth.getDate();
    const startWeekday = startOfMonth.getDay();

    const cells = [];
    for (let i = 0; i < startWeekday; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const cellDate = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth(),
        day
      );
      const key = dayKey(cellDate);
      cells.push({
        key,
        date: cellDate,
        stats: map[key],
      });
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    const weeksMatrix = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeksMatrix.push(cells.slice(i, i + 7));
    }

    return {
      weeks: weeksMatrix,
      dayStats: map,
    };
  }, [user.sessions]);

  const selectedStats = dayStats[selectedDay];

  const dayChipClasses = (info) => {
    if (!info?.stats) {
      return "border-white/10 text-gray-500";
    }
    const sets = info.stats.totalSets;
    if (sets >= 6) return "border-emerald-300 bg-emerald-500/40 text-white";
    if (sets >= 3) return "border-emerald-300/70 bg-emerald-500/30 text-white";
    return "border-emerald-300/40 bg-emerald-500/10 text-white";
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <div className="max-w-md mx-auto relative">
        <header className="pt-6 px-4 flex items-center justify-between">
          <button
            onClick={() =>
              navigate("/", {
                state: location.state?.tab
                  ? { tab: location.state.tab }
                  : { tab: "streaks" },
              })
            }
            className="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 hover:text-white hover:border-white/30 transition"
          >
            ← Back
          </button>
          <div className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            Calendar
          </div>
        </header>

        <div className="pt-6 pb-24 px-4 space-y-6">
          <section className="rounded-3xl bg-black/40 border border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">
              Training calendar
            </div>
            <h2 className="text-xl font-semibold mt-1">
              {new Date().toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>
          <p className="text-xs text-gray-400">
            Tap a day to see details
          </p>
        </div>

        <div className="grid grid-cols-7 gap-2 text-xs text-gray-400 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {weeks.map((week, idx) => (
            <div key={idx} className="grid grid-cols-7 gap-2">
              {week.map((day, index) =>
                day ? (
                  <button
                    key={day.key}
                    onClick={() => setSelectedDay(day.key)}
                    className={`aspect-square rounded-2xl border text-sm flex flex-col items-center justify-center transition ${
                      selectedDay === day.key
                        ? "ring-2 ring-emerald-300"
                        : "ring-0"
                    } ${dayChipClasses(day)}`}
                  >
                    <span>{day.date.getDate()}</span>
                    <span className="text-[10px]">
                      {day.stats ? `${day.stats.totalSets} sets` : "—"}
                    </span>
                  </button>
                ) : (
                  <div key={`empty-${index}`} />
                )
              )}
            </div>
          ))}
        </div>
          </section>

          <section className="rounded-3xl bg-black/60 border border-white/10 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {new Date(selectedDay).toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </h3>
          <span className="text-xs text-gray-400">
            {selectedStats
              ? `${selectedStats.totalSets} sets logged`
              : "No data"}
          </span>
        </div>

        {!selectedStats && (
          <p className="text-sm text-gray-400">
            No sessions tracked today. Log a quick check-in to keep the habit.
          </p>
        )}

        {selectedStats && (
          <div className="space-y-3">
            {selectedStats.sessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold capitalize">
                    {session.exercise}
                  </span>
                  <span className="text-gray-400">
                    {new Date(session.endedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {session.reps} reps · approx {estimateSets(session.reps)} sets
                </div>
              </div>
            ))}
          </div>
        )}
          </section>
        </div>
      </div>
    </div>
  );
}
