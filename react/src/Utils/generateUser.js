// src/utils/generateUser.js

// ---------- helpers ----------
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ---------- names / ages ----------

const NAMES = [
  "Blitz",
  "Nova",
  "Kade",
  "Mira",
  "Atlas",
  "Rei",
  "Sterling",
  "Luna",
  "Kai",
  "Zara",
  "Echo",
  "Nyx",
  "Roman",
  "Sage",
  "Jet",
  "Vera",
  "Rune",
  "Ari",
  "Knox",
  "Sky",
  "Vale",
  "Flint",
  "Kora",
  "Onyx",
  "Elara",
  "Sol",
  "Riven",
  "Ember",
  "Flux",
  "Halo",
  "Drift",
  "Zen",
  "Rex",
  "Wave",
  "Storm",
  "Iris",
  "Ash",
  "Fox",
  "Quill",
];

const AGE_RANGE = { min: 18, max: 28 };

// ---------- curated image pool (gender-neutral gym vibes) ----------

const IMAGES = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1554344058-8d1d1dbc5960?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1554344058-8d1d1dbc5960?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1594737625785-c3c71df8cc9b?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1571907480607-1c3ff79c6f88?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1546484959-f9a9ae384058?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1526401485004-2aa7a6d413aa?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1546484959-f9a9ae384058?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1571731956672-d634ae3c31c5?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1526401485004-2aa7a6d413aa?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1571907483881-d040f6d6138f?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1583454048669-8f94b1e1b324?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1554344058-8d1d1dbc5960?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&w=900&q=60",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&w=900&q=60",
];

// ---------- archetypes ----------
//
// Each archetype has:
//  - label: name of archetype
//  - bio: sentence style bio
//  - tags: tags shown on card
//  - energyType: drives matching
//  - generateEmbedding(): returns:
//      { avgCheckInTime, streakConsistency, trainingIntensity, slumpDays, energyType }

const ARCHETYPES = [
  {
    label: "Night Grinder",
    energyType: "strength",
    bio: "Only feels awake when the gym is half empty and the playlist is loud.",
    tags: ["Strength", "Night Sessions", "Intensity"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(21 * 60, 23 * 60 + 30), // 9:00–11:30 PM
        streakConsistency: rand(0.6, 0.82),
        trainingIntensity: rand(0.7, 0.95),
        slumpDays: [2, 4], // Tue + Thu for example
        energyType: this.energyType,
      };
    },
  },
  {
    label: "5AM Ritualist",
    energyType: "strength",
    bio: "Treats the gym like a morning ritual and the alarm clock like a contract.",
    tags: ["Early Riser", "Routine", "Discipline"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(5 * 60, 6 * 60 + 30), // 5:00–6:30 AM
        streakConsistency: rand(0.78, 0.95),
        trainingIntensity: rand(0.55, 0.8),
        slumpDays: [6], // Saturday
        energyType: this.energyType,
      };
    },
  },
  {
    label: "Cardio Phantom",
    energyType: "cardio",
    bio: "Shows up, runs hard, vanishes. Never posts, always consistent.",
    tags: ["Cardio", "Running", "Endurance"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(6 * 60, 9 * 60), // 6–9 AM
        streakConsistency: rand(0.8, 0.97),
        trainingIntensity: rand(0.5, 0.75),
        slumpDays: [0], // Sunday
        energyType: this.energyType,
      };
    },
  },
  {
    label: "Aesthetic Sculptor",
    energyType: "bodybuilding",
    bio: "Treats every set like a photo shoot no one can see yet.",
    tags: ["Bodybuilding", "Aesthetics", "Hypertrophy"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(14 * 60, 18 * 60), // 2–6 PM
        streakConsistency: rand(0.65, 0.85),
        trainingIntensity: rand(0.7, 0.9),
        slumpDays: [3], // Wed
        energyType: this.energyType,
      };
    },
  },
  {
    label: "Mobility Mystic",
    energyType: "calisthenics",
    bio: "Chases clean lines, smooth joints, and quiet progress.",
    tags: ["Mobility", "Calisthenics", "Control"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(9 * 60, 12 * 60), // 9 AM–12 PM
        streakConsistency: rand(0.7, 0.9),
        trainingIntensity: rand(0.35, 0.6),
        slumpDays: [5], // Friday
        energyType: this.energyType,
      };
    },
  },
  {
    label: "CrossFit Chaos Engine",
    energyType: "functional",
    bio: "Lives for loud timers, chalk, and questionable life choices.",
    tags: ["Functional", "HIIT", "Chaos"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(17 * 60, 20 * 60), // 5–8 PM
        streakConsistency: rand(0.55, 0.8),
        trainingIntensity: rand(0.8, 1.0),
        slumpDays: [1, 5],
        energyType: this.energyType,
      };
    },
  },
  {
    label: "Ring Acrobat",
    energyType: "calisthenics",
    bio: "Always working toward the next impossible bodyweight skill.",
    tags: ["Rings", "Calisthenics", "Skill Work"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(16 * 60, 20 * 60), // 4–8 PM
        streakConsistency: rand(0.6, 0.85),
        trainingIntensity: rand(0.55, 0.8),
        slumpDays: [2],
        energyType: this.energyType,
      };
    },
  },
  {
    label: "Bulk Mode Strategist",
    energyType: "strength",
    bio: "Tracks macros, tracks sets, tracks everything except bedtime.",
    tags: ["Bulk Mode", "Strength", "Numbers"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(18 * 60, 22 * 60), // 6–10 PM
        streakConsistency: rand(0.6, 0.78),
        trainingIntensity: rand(0.65, 0.9),
        slumpDays: [0, 3],
        energyType: this.energyType,
      };
    },
  },
  {
    label: "Functional Maverick",
    energyType: "functional",
    bio: "Likes feeling athletic more than hitting any specific number.",
    tags: ["Functional", "Athlete", "Agility"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(10 * 60, 14 * 60), // 10 AM–2 PM
        streakConsistency: rand(0.6, 0.85),
        trainingIntensity: rand(0.55, 0.8),
        slumpDays: [4],
        energyType: this.energyType,
      };
    },
  },
  {
    label: "Wellness Alchemist",
    energyType: "mix",
    bio: "Balances lifting, movement, and recovery like a science experiment.",
    tags: ["Wellness", "Balance", "Recovery"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(8 * 60, 11 * 60), // 8–11 AM
        streakConsistency: rand(0.7, 0.9),
        trainingIntensity: rand(0.45, 0.7),
        slumpDays: [6],
        energyType: this.energyType,
      };
    },
  },
  {
    label: "Beginner Chaos Wanderer",
    energyType: "mix",
    bio: "Figuring it out one random session at a time.",
    tags: ["Beginner", "Learning", "Experimenting"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(8 * 60, 22 * 60), // could be anytime
        streakConsistency: rand(0.25, 0.55),
        trainingIntensity: rand(0.3, 0.6),
        slumpDays: [1, 3, 5],
        energyType: this.energyType,
      };
    },
  },
  {
    label: "HIIT Shadowrunner",
    energyType: "cardio",
    bio: "Shows up for short, brutal sessions and bounces.",
    tags: ["HIIT", "Sprints", "Short Sessions"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(18 * 60, 21 * 60), // 6–9 PM
        streakConsistency: rand(0.55, 0.8),
        trainingIntensity: rand(0.75, 1.0),
        slumpDays: [2],
        energyType: this.energyType,
      };
    },
  },
  {
    label: "Barbell Monk",
    energyType: "strength",
    bio: "Repeats the same basic lifts with borderline religious focus.",
    tags: ["Barbell", "Strength", "Minimalist"],
    generateEmbedding() {
      return {
        avgCheckInTime: randInt(15 * 60, 19 * 60), // 3–7 PM
        streakConsistency: rand(0.7, 0.9),
        trainingIntensity: rand(0.65, 0.9),
        slumpDays: [0],
        energyType: this.energyType,
      };
    },
  },
];

// ---------- main generator ----------

export function generateUser() {
  const name = pick(NAMES);
  const age = randInt(AGE_RANGE.min, AGE_RANGE.max);
  const archetype = pick(ARCHETYPES);
  const image = pick(IMAGES);
  const embedding = archetype.generateEmbedding();

  return {
    name,
    age,
    bio: archetype.bio,
    tags: archetype.tags,
    image,
    embedding,
  };
}
