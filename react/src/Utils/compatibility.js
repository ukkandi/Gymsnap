// src/utils/compatibility.js

const METRIC_WEIGHTS = {
  time: 0.3,
  streak: 0.25,
  intensity: 0.2,
  slump: 0.15,
  energy: 0.1,
};

// Time comparison: how close check-in times are (in minutes from midnight)
function compareTimes(a, b) {
  const diff = Math.abs(a - b);
  const normalized = 1 - diff / (24 * 60); // 0–1
  return {
    score: Math.max(0, normalized),
    diffMinutes: diff,
  };
}

// Both are 0–1 already
function compareStreaks(a, b) {
  const distance = Math.abs(a - b);
  return {
    score: 1 - distance,
    delta: distance,
  };
}

// 0–1 range
function compareIntensity(a, b) {
  const distance = Math.abs(a - b);
  return {
    score: 1 - distance,
    delta: distance,
  };
}

// Slump days: 0–6 (Sun–Sat)
function compareSlumps(a = [], b = []) {
  if (!a.length && !b.length) {
    return { score: 1, shared: 0, total: 0 };
  }
  if (!a.length || !b.length) {
    return { score: 0, shared: 0, total: new Set([...a, ...b]).size };
  }

  const shared = a.filter((day) => b.includes(day)).length;
  const total = new Set([...a, ...b]).size;
  return {
    score: total === 0 ? 0 : shared / total, // 0–1
    shared,
    total,
  };
}

// energyType: "strength" | "cardio" | "calisthenics" | "functional" | "mix" | etc.
function compareEnergy(a, b) {
  if (a === b) return { score: 1, description: "Same training focus" };
  if (a === "mix" || b === "mix") {
    return {
      score: 0.5,
      description: "One person cross-trains, so overlap is partial",
    };
  }
  return {
    score: 0.2,
    description: "Different focus areas, but still complementary",
  };
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const describeTime = (diff = 0) => {
  if (diff <= 45) return "Same-hour check-ins";
  if (diff <= 120) return "Overlapping training windows";
  if (diff <= 240) return "Different but adjacent windows";
  return "Opposite training schedules";
};

const describeStreak = (delta = 0) => {
  if (delta <= 0.08) return "Consistency twins";
  if (delta <= 0.18) return "Pretty similar discipline";
  return "Different streak rhythms";
};

const describeIntensity = (delta = 0) => {
  if (delta <= 0.1) return "Match intensity rep-for-rep";
  if (delta <= 0.25) return "Close enough to push together";
  return "Intensity mismatch";
};

const describeSlumps = (shared, total) => {
  if (total === 0) return "No slump data yet";
  if (shared === 0) return "Opposite recovery days";
  if (shared === total) return "Identical recovery rhythm";
  return "Some shared off days";
};

/**
 * embedding shape:
 * {
 *   avgCheckInTime: number (0–1440),
 *   streakConsistency: number (0–1),
 *   trainingIntensity: number (0–1),
 *   slumpDays: number[], // 0–6
 *   energyType: string
 * }
 */
export function calculateCompatibility(userA, userB) {
  const slumpDaysA = userA.slumpDays || [];
  const slumpDaysB = userB.slumpDays || [];
  const time = compareTimes(userA.avgCheckInTime, userB.avgCheckInTime);
  const streak = compareStreaks(
    userA.streakConsistency,
    userB.streakConsistency
  );
  const intensity = compareIntensity(
    userA.trainingIntensity,
    userB.trainingIntensity
  );
  const slump = compareSlumps(slumpDaysA, slumpDaysB);
  const energy = compareEnergy(userA.energyType, userB.energyType);

  const breakdown = [
    {
      id: "time",
      label: "Time overlap",
      score: Math.round(time.score * 100),
      weight: METRIC_WEIGHTS.time,
      description: describeTime(time.diffMinutes),
    },
    {
      id: "streak",
      label: "Consistency alignment",
      score: Math.round(streak.score * 100),
      weight: METRIC_WEIGHTS.streak,
      description: describeStreak(streak.delta),
    },
    {
      id: "intensity",
      label: "Intensity similarity",
      score: Math.round(intensity.score * 100),
      weight: METRIC_WEIGHTS.intensity,
      description: describeIntensity(intensity.delta),
    },
    {
      id: "slump",
      label: "Recovery rhythm",
      score: Math.round(slump.score * 100),
      weight: METRIC_WEIGHTS.slump,
      description: describeSlumps(slump.shared, slump.total),
      detail:
        slump.shared > 0
          ? `Shared off days: ${slumpDaysA
              .filter((day) => slumpDaysB.includes(day))
              .map((day) => dayLabels[day])
              .join(" · ")}`
          : "",
    },
    {
      id: "energy",
      label: "Category preference",
      score: Math.round(energy.score * 100),
      weight: METRIC_WEIGHTS.energy,
      description:
        energy.description ||
        `You: ${userA.energyType || "mix"} vs ${userB.energyType || "mix"}`,
    },
  ];

  const totalScore = breakdown.reduce(
    (sum, metric) => sum + (metric.score / 100) * metric.weight,
    0
  );

  return {
    score: Math.round(totalScore * 100),
    breakdown,
  };
}
