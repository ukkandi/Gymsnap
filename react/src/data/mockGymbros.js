// Simple mock data + compatibility logic

export const currentUser = {
  id: 0,
  name: "You",
  gymPersonality: "Locked In Introvert",
  goals: ["Strength", "Hypertrophy"],
  schedule: ["Mon", "Wed", "Fri"],
  vibe: ["No BS", "Low Talk", "High Effort"],
};

export const gymbros = [
  {
    id: 1,
    name: "Alex",
    age: 20,
    gym: "GMU Rec",
    maxBench: 225,
    maxSquat: 315,
    maxDeadlift: 365,
    gymPersonality: "Loud Hype Man",
    goals: ["Hypertrophy", "Aesthetics"],
    schedule: ["Mon", "Tue", "Thu"],
    vibe: ["Energy", "Music Loud", "Memes"],
  },
  {
    id: 2,
    name: "Jas",
    age: 19,
    gym: "Planet Fitness",
    maxBench: 155,
    maxSquat: 225,
    maxDeadlift: 275,
    gymPersonality: "Form Police",
    goals: ["Strength", "Technique"],
    schedule: ["Wed", "Fri", "Sat"],
    vibe: ["Chill", "Coaching", "No Ego"],
  },
  {
    id: 3,
    name: "Diego",
    age: 21,
    gym: "Gold's Gym",
    maxBench: 245,
    maxSquat: 365,
    maxDeadlift: 405,
    gymPersonality: "Silent Demon",
    goals: ["Powerlifting", "Strength"],
    schedule: ["Mon", "Wed", "Fri", "Sun"],
    vibe: ["Headphones On", "No Small Talk"],
  },
  {
    id: 4,
    name: "Mia",
    age: 20,
    gym: "LA Fitness",
    maxBench: 95,
    maxSquat: 185,
    maxDeadlift: 205,
    gymPersonality: "Coach Friend",
    goals: ["Strength", "Mobility"],
    schedule: ["Tue", "Thu", "Sat"],
    vibe: ["Encouraging", "Spotter", "Form Checks"],
  },
];

// Dumb but explainable compatibility score
export function calculateCompatibility(user, bro) {
  let score = 0;

  // Goal overlap
  const sharedGoals = bro.goals.filter(g => user.goals.includes(g)).length;
  score += sharedGoals * 15;

  // Schedule overlap
  const sharedDays = bro.schedule.filter(d => user.schedule.includes(d)).length;
  score += sharedDays * 10;

  // Personality clash/fit (toy logic)
  if (
    (user.gymPersonality.includes("Introvert") && bro.gymPersonality === "Silent Demon") ||
    (user.gymPersonality.includes("Introvert") && bro.gymPersonality === "Form Police")
  ) {
    score += 25;
  }

  if (bro.gymPersonality === "Loud Hype Man" && user.gymPersonality.includes("Introvert")) {
    score -= 10;
  }

  // Vibe overlap
  const sharedVibe = bro.vibe.filter(v => user.vibe.includes(v)).length;
  score += sharedVibe * 10;

  // Clamp 0–100
  score = Math.max(0, Math.min(100, score));
  return score;
}
