// src/Utils/compatibility.js

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const timeCompatibility = (aMinutes, bMinutes) => {
  const MAX_DIFF_MINUTES = 12 * 60; // treat anything more than 12 hours apart as a zero
  const diff = Math.abs(aMinutes - bMinutes);
  return clamp(1 - diff / MAX_DIFF_MINUTES);
};

const simpleDifferenceScore = (a, b) => clamp(1 - Math.abs(a - b));

const slumpCompatibility = (slumpA = [], slumpB = []) => {
  if (!slumpA.length && !slumpB.length) return 1;
  const overlap = slumpA.filter((day) => slumpB.includes(day)).length;
  // Moderate penalty when off-days line up; max penalty when three days overlap
  return clamp(1 - overlap / 3);
};

const energyCompatibility = (energyA, energyB) => {
  if (energyA === energyB) return 1;
  if (energyA === "mix" || energyB === "mix") return 0.75;
  return 0.4;
};

const describeWindow = (minutes = 0) => {
  const hour = minutes / 60;
  if (hour >= 21 || hour < 4) return "late night";
  if (hour >= 17) return "evening";
  if (hour >= 12) return "afternoon";
  if (hour >= 9) return "late morning";
  if (hour >= 5) return "early morning";
  return "overnight";
};

const dayName = (dayIndex) =>
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    dayIndex % 7
  ];

export function calculateCompatibility(embeddingA, embeddingB) {
  if (!embeddingA || !embeddingB) return 0;

  const avgCheckInA = embeddingA.avgCheckInTime ?? 0;
  const avgCheckInB = embeddingB.avgCheckInTime ?? 0;
  const streakA = embeddingA.streakConsistency ?? 0;
  const streakB = embeddingB.streakConsistency ?? 0;
  const intensityA = embeddingA.trainingIntensity ?? 0;
  const intensityB = embeddingB.trainingIntensity ?? 0;

  const timeScore = timeCompatibility(
    avgCheckInA,
    avgCheckInB
  );
  const streakScore = simpleDifferenceScore(
    streakA,
    streakB
  );
  const intensityScore = simpleDifferenceScore(
    intensityA,
    intensityB
  );
  const slumpScore = slumpCompatibility(
    embeddingA.slumpDays ?? [],
    embeddingB.slumpDays ?? []
  );
  const energyScore = energyCompatibility(
    embeddingA.energyType,
    embeddingB.energyType
  );

  const score =
    timeScore * 0.3 +
    streakScore * 0.2 +
    intensityScore * 0.2 +
    slumpScore * 0.1 +
    energyScore * 0.2;

  return Math.round(clamp(score) * 100);
}

export function describeCompatibility(embeddingA, embeddingB) {
  if (!embeddingA || !embeddingB) {
    return "Not enough data to explain this match yet.";
  }

  const statements = [];
  const avgCheckInA = embeddingA.avgCheckInTime ?? 0;
  const avgCheckInB = embeddingB.avgCheckInTime ?? 0;
  const timeDiff = Math.abs(avgCheckInA - avgCheckInB);
  if (timeDiff <= 90) {
    const sharedWindow = describeWindow((avgCheckInA + avgCheckInB) / 2);
    statements.push(`You both train in the ${sharedWindow}.`);
  }

  const intensityDiff = Math.abs(
    (embeddingA.trainingIntensity ?? 0) - (embeddingB.trainingIntensity ?? 0)
  );
  if (intensityDiff <= 0.15) {
    statements.push("Your intensity levels are aligned.");
  }

  if (embeddingA.energyType && embeddingB.energyType) {
    if (embeddingA.energyType === embeddingB.energyType) {
      statements.push(
        `You share a ${embeddingA.energyType} training vibe.`
      );
    } else if (
      embeddingA.energyType === "mix" ||
      embeddingB.energyType === "mix"
    ) {
      statements.push("One of you adapts easily to different training styles.");
    }
  }

  const overlapSlumps = (embeddingA.slumpDays ?? []).filter((day) =>
    (embeddingB.slumpDays ?? []).includes(day)
  );
  if (overlapSlumps.length) {
    const names = overlapSlumps.map(dayName).join(" & ");
    statements.push(`Both tend to slump on ${names}, so you can lock each other in.`);
  }

  const streakDiff = Math.abs(
    (embeddingA.streakConsistency ?? 0) - (embeddingB.streakConsistency ?? 0)
  );
  if (streakDiff <= 0.1) {
    statements.push("Your streak consistency is almost identical.");
  }

  return statements.length
    ? statements.join(" ")
    : "You have complementary habits that make accountability easy.";
}
