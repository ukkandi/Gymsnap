// src/data/currentUser.js

export const currentUser = {
  name: "You",
  embedding: {
    // 9:30 PM lifter
    avgCheckInTime: 21 * 60 + 30,
    // decent but not perfect consistency
    streakConsistency: 0.68,
    // medium intensity
    trainingIntensity: 0.55,
    // tends to slump Thu + Sun
    slumpDays: [0, 4],
    // mixed training style by default
    energyType: "mix",
  },
};
