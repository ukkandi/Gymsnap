import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { currentUser as baseUser } from "../data/currentUser";

const STORAGE_KEY = "lockedin:user-state";

const EXERCISE_METADATA = {
  curl: { muscleGroup: "Arms", energyBias: "strength" },
  squat: { muscleGroup: "Legs", energyBias: "functional" },
};

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const UserDataContext = createContext(null);

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const defaultWeeklySummary = () => ({
  totalSets: 0,
  favoriteMuscleGroup: "None yet",
  peakTrainingTime: "—",
  consistencyScore: 0,
  effortLevel: "Warming up",
  slumpDay: "Unknown",
  advice: "Finish a tracked session to unlock insights.",
});

const describeWindow = (minutes = 0) => {
  const hour = minutes / 60;
  if (hour >= 21 || hour < 4) return "late night";
  if (hour >= 17) return "evening";
  if (hour >= 12) return "afternoon";
  if (hour >= 9) return "late morning";
  if (hour >= 5) return "early morning";
  return "overnight";
};

const toDayKey = (value) => {
  const date = new Date(value);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const minutesFromDate = (value) => {
  const date = new Date(value);
  return date.getHours() * 60 + date.getMinutes();
};

const estimateSetsFromReps = (reps) => Math.max(1, Math.round(reps / 10));

const calcSessionIntensity = (session) => {
  const durationMinutes = Math.max(
    1,
    (session.endedAt - session.startedAt) / 1000 / 60
  );
  const density = session.reps / durationMinutes;
  const normalized = clamp(density / 25);
  const bias =
    session.exercise === "squat"
      ? 1.1
      : session.exercise === "curl"
        ? 0.95
        : 1;

  return clamp(normalized * bias);
};

const calcAvgCheckInTime = (sessions, fallback) => {
  if (!sessions.length) return fallback ?? 0;
  const total = sessions.reduce(
    (sum, session) => sum + minutesFromDate(session.startedAt),
    0
  );
  return Math.round(total / sessions.length);
};

const calcTrainingIntensity = (sessions, fallback) => {
  if (!sessions.length) return fallback ?? 0.5;
  const recent = sessions.slice(-5);
  const total = recent.reduce(
    (sum, session) => sum + calcSessionIntensity(session),
    0
  );
  return clamp(total / recent.length);
};

const calcStreakFromSessions = (sessions) => {
  if (!sessions.length) return 0;

  const daySet = new Set(sessions.map((session) => toDayKey(session.endedAt)));
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = toDayKey(cursor);
    if (!daySet.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const calcStreakConsistency = (sessions, fallback) => {
  if (!sessions.length) return fallback ?? 0.5;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 13);
  cutoff.setHours(0, 0, 0, 0);

  const workedDays = new Set(
    sessions
      .filter((session) => session.endedAt >= cutoff.getTime())
      .map((session) => toDayKey(session.endedAt))
  );

  const ratio = workedDays.size / 14;
  return clamp(0.35 + ratio * 0.6);
};

const calcSlumpDays = (sessions, fallback = []) => {
  if (!sessions.length) return fallback;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 13);
  cutoff.setHours(0, 0, 0, 0);

  const counts = Array.from({ length: 7 }, (_, day) => ({
    day,
    count: 0,
  }));

  sessions.forEach((session) => {
    if (session.endedAt < cutoff.getTime()) return;
    const day = new Date(session.endedAt).getDay();
    counts[day].count += 1;
  });

  const zeroDays = counts.filter((entry) => entry.count === 0);
  if (zeroDays.length) {
    return zeroDays.slice(0, 2).map((entry) => entry.day);
  }

  return counts
    .sort((a, b) => a.count - b.count)
    .slice(0, 2)
    .map((entry) => entry.day);
};

const buildAdvice = ({ slumpDay, effortLevel, peakTrainingTime, favorite }) => {
  if (slumpDay) {
    return `${slumpDay} fell off—schedule a quick ${favorite.toLowerCase()} grind to keep momentum.`;
  }

  if (effortLevel === "Beast Mode") {
    return "Intensity is maxed—protect recovery so the streak stays clean.";
  }

  if (effortLevel === "Locked In") {
    return `Keep stacking those ${peakTrainingTime} sessions to push the streak higher.`;
  }

  return "Aim for one more tracked workout this week to lock the habit.";
};

const buildWeeklySummary = (sessions) => {
  if (!sessions.length) return defaultWeeklySummary();

  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);

  const recent = sessions.filter(
    (session) => session.endedAt >= cutoff.getTime()
  );
  if (!recent.length) return defaultWeeklySummary();

  const totalSets = recent.reduce(
    (sum, session) => sum + estimateSetsFromReps(session.reps),
    0
  );

  const focusCounts = {};
  recent.forEach((session) => {
    const focus =
      EXERCISE_METADATA[session.exercise]?.muscleGroup || "Full Body";
    focusCounts[focus] = (focusCounts[focus] || 0) + 1;
  });
  const favoriteMuscleGroup =
    Object.entries(focusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "Full Body";

  const timeBuckets = {};
  recent.forEach((session) => {
    const bucket = describeWindow(minutesFromDate(session.startedAt));
    timeBuckets[bucket] = (timeBuckets[bucket] || 0) + 1;
  });
  const peakTrainingTime =
    Object.entries(timeBuckets).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "evening";

  const uniqueDays = new Set(recent.map((session) => toDayKey(session.endedAt)));
  const consistencyScore = Math.round((uniqueDays.size / 7) * 100);

  const averageIntensity =
    recent.reduce((sum, session) => sum + calcSessionIntensity(session), 0) /
    recent.length;
  const effortLevel =
    averageIntensity > 0.75
      ? "Beast Mode"
      : averageIntensity > 0.5
        ? "Locked In"
        : "Finding Rhythm";

  const dayCounts = Array.from({ length: 7 }, (_, day) => ({
    day,
    count: 0,
  }));
  recent.forEach((session) => {
    const day = new Date(session.endedAt).getDay();
    dayCounts[day].count += 1;
  });
  const weeklySlump = dayCounts.find((entry) => entry.count === 0)?.day;
  const slumpDayLabel = weeklySlump !== undefined ? DAY_LABELS[weeklySlump] : "";

  const advice = buildAdvice({
    slumpDay: slumpDayLabel,
    effortLevel,
    peakTrainingTime,
    favorite: favoriteMuscleGroup,
  });

  return {
    totalSets,
    favoriteMuscleGroup,
    peakTrainingTime,
    consistencyScore,
    effortLevel,
    slumpDay: slumpDayLabel || "None",
    advice,
  };
};

const buildCalendarHeatmap = (sessions, days = 28) => {
  const values = sessions.reduce((acc, session) => {
    const key = toDayKey(session.endedAt);
    acc[key] = (acc[key] || 0) + estimateSetsFromReps(session.reps);
    return acc;
  }, {});

  const result = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = toDayKey(date);
    result.push({
      key,
      date: date.toISOString(),
      value: values[key] || 0,
    });
  }

  return result;
};

const buildIntensityTrend = (sessions, days = 7) => {
  const dayMap = sessions.reduce((acc, session) => {
    const key = toDayKey(session.endedAt);
    const intensity = calcSessionIntensity(session);
    if (!acc[key]) acc[key] = [];
    acc[key].push(intensity);
    return acc;
  }, {});

  const result = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = toDayKey(date);
    const bucket = dayMap[key] || [];
    const avg =
      bucket.length === 0
        ? 0
        : bucket.reduce((sum, value) => sum + value, 0) / bucket.length;
    result.push({
      key,
      label: DAY_LABELS[date.getDay()].slice(0, 3),
      value: Number(avg.toFixed(2)),
    });
  }

  return result;
};

const buildMuscleSplit = (sessions) => {
  if (!sessions.length) {
    return [
      { label: "Arms", value: 0 },
      { label: "Legs", value: 0 },
      { label: "Full Body", value: 0 },
    ];
  }

  const counts = sessions.reduce((acc, session) => {
    const meta = EXERCISE_METADATA[session.exercise];
    const label = meta?.muscleGroup || "Full Body";
    acc[label] = (acc[label] || 0) + estimateSetsFromReps(session.reps);
    return acc;
  }, {});

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0) || 1;

  return Object.entries(counts).map(([label, value]) => ({
    label,
    value,
    percent: Math.round((value / total) * 100),
  }));
};

const readStoredState = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...baseUser,
      ...parsed,
      embedding: {
        ...baseUser.embedding,
        ...(parsed.embedding || {}),
      },
      sessions: parsed.sessions || [],
      weeklySummary: parsed.weeklySummary || defaultWeeklySummary(),
    };
  } catch {
    return null;
  }
};

export function UserDataProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = readStoredState();
    if (stored) return stored;
    return {
      ...baseUser,
      streak: 0,
      sessions: [],
      lastWorkoutAt: null,
      weeklySummary: defaultWeeklySummary(),
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const logWorkoutSession = useCallback((payload) => {
    const { reps, exercise, startedAt, endedAt } = payload;
    if (!reps || reps <= 0) return;

    const safeExercise = exercise || "curl";
    const start = startedAt || Date.now();
    const finish = endedAt || Date.now();

    setUser((prev) => {
      const newSession = {
        id: `${finish}-${safeExercise}`,
        reps,
        exercise: safeExercise,
        startedAt: start,
        endedAt: finish,
      };

      const sessions = [...(prev.sessions || []), newSession];
      const streak = calcStreakFromSessions(sessions);
      const avgCheckInTime = calcAvgCheckInTime(
        sessions,
        prev.embedding?.avgCheckInTime
      );
      const trainingIntensity = calcTrainingIntensity(
        sessions,
        prev.embedding?.trainingIntensity
      );
      const slumpDays = calcSlumpDays(
        sessions,
        prev.embedding?.slumpDays || baseUser.embedding.slumpDays
      );
      const streakConsistency = calcStreakConsistency(
        sessions,
        prev.embedding?.streakConsistency
      );
      const weeklySummary = buildWeeklySummary(sessions);

      return {
        ...prev,
        streak,
        lastWorkoutAt: finish,
        sessions,
        embedding: {
          ...prev.embedding,
          avgCheckInTime,
          trainingIntensity,
          slumpDays,
          streakConsistency,
        },
        weeklySummary,
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      logWorkoutSession,
      stats: {
        calendarHeatmap: buildCalendarHeatmap(user.sessions || []),
        intensityTrend: buildIntensityTrend(user.sessions || []),
        muscleSplit: buildMuscleSplit(user.sessions || []),
      },
    }),
    [user, logWorkoutSession]
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

/* eslint-disable-next-line react-refresh/only-export-components */
export const useUserData = () => {
  const ctx = useContext(UserDataContext);
  if (!ctx) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return ctx;
};
