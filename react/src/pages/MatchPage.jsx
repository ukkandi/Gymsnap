import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function MatchPage() {
  const matches = [
  {
    name: "Blitz",
    age: 22,
    bio: "Lives inside the squat rack. Dreams in sets of 5.",
    tags: ["Powerlifting", "Strength", "Bulk Mode"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&w=900&q=60",
  },
  {
    name: "Nova",
    age: 20,
    bio: "Mobility first. Strength second. Aesthetic forever.",
    tags: ["Mobility", "Calisthenics", "Minimalist"],
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&w=900&q=60",
  },
  {
    name: "Kade",
    age: 24,
    bio: "Follows a strict Push/Pull/Legs religion.",
    tags: ["Hypertrophy", "Routine", "Discipline"],
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&w=900&q=60",
  },
  {
    name: "Mira",
    age: 19,
    bio: "Cardio is my meditation. Lifting is my therapy.",
    tags: ["Cardio", "Running", "Wellness"],
    image: "https://images.unsplash.com/photo-1599058907723-63d31589be05?auto=format&w=900&q=60",
  },
  {
    name: "Atlas",
    age: 21,
    bio: "Chasing symmetry. Sculpting the perfect frame.",
    tags: ["Bodybuilding", "Aesthetics", "Posing"],
    image: "https://images.unsplash.com/photo-1594737625785-c3c71df8cc9b?auto=format&w=900&q=60",
  },
  {
    name: "Rei",
    age: 20,
    bio: "Training for my first ring muscle-up.",
    tags: ["Gymnastics", "Calisthenics", "Mobility"],
    image: "https://images.unsplash.com/photo-1583454110553-c39e0e1b9e06?auto=format&w=900&q=60",
  },
  {
    name: "Sterling",
    age: 23,
    bio: "Cold plunges and protein pancakes keep me alive.",
    tags: ["Recovery", "Strength", "Lifestyle"],
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&w=900&q=60",
  },
  {
    name: "Luna",
    age: 18,
    bio: "Early morning lifts > late night parties.",
    tags: ["Discipline", "Strength", "Focus"],
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&w=900&q=60",
  },
  {
    name: "Kai",
    age: 25,
    bio: "Functional training lover. Battle ropes obsessed.",
    tags: ["Functional", "HIIT", "Athlete"],
    image: "https://images.unsplash.com/photo-1526401485004-2aa7a6d413aa?auto=format&w=900&q=60",
  },
  {
    name: "Zara",
    age: 21,
    bio: "Lifts heavy, laughs louder.",
    tags: ["Powerbuilding", "Strength", "Endurance"],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&w=900&q=60",
  },
  {
    name: "Echo",
    age: 22,
    bio: "Consistency beats motivation every time.",
    tags: ["Routine", "Hypertrophy", "Discipline"],
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&w=900&q=60",
  },
  {
    name: "Nyx",
    age: 20,
    bio: "Night owl who only trains after 10 PM.",
    tags: ["Strength", "Aesthetics", "Routine"],
    image: "https://images.unsplash.com/photo-1550345332-09e3ac9878c2?auto=format&w=900&q=60",
  },
  {
    name: "Roman",
    age: 23,
    bio: "Machines don’t hit right. Free weights only.",
    tags: ["Free Weights", "Powerlifting", "Barbell Only"],
    image: "https://images.unsplash.com/photo-1579758629939-037fdd6f4c5d?auto=format&w=900&q=60",
  },
  {
    name: "Sage",
    age: 19,
    bio: "Mind–muscle connection is spiritual.",
    tags: ["Mindfulness", "Bodybuilding", "Wellness"],
    image: "https://images.unsplash.com/photo-1571907483881-d040f6d6138f?auto=format&w=900&q=60",
  },
  {
    name: "Jet",
    age: 22,
    bio: "Arms day > everything.",
    tags: ["Hypertrophy", "Arms Day", "Bulk"],
    image: "https://images.unsplash.com/photo-1554311885-0792d79d0e7d?auto=format&w=900&q=60",
  },
  {
    name: "Vera",
    age: 21,
    bio: "Trains legs twice a week. Maybe three if I'm bored.",
    tags: ["Leg Day", "Strength", "Intensity"],
    image: "https://images.unsplash.com/photo-1571019613740-179d48e2db40?auto=format&w=900&q=60",
  },
  {
    name: "Rune",
    age: 24,
    bio: "Olympic lifting enthusiast. Cleans over cardio.",
    tags: ["Olympic Lifts", "Strength", "Technique"],
    image: "https://images.unsplash.com/photo-1598970434984-5c45e7108893?auto=format&w=900&q=60",
  },
  {
    name: "Ari",
    age: 18,
    bio: "New to the gym. Just trying my best.",
    tags: ["Beginner", "Routine", "Learning"],
    image: "https://images.unsplash.com/photo-1544223479-4c09f802f5f4?auto=format&w=900&q=60",
  },
  {
    name: "Knox",
    age: 26,
    bio: "Strongman training is my whole identity.",
    tags: ["Strongman", "Strength", "Bulking"],
    image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&w=900&q=60",
  },
  {
    name: "Sky",
    age: 20,
    bio: "Pilates + lifting. Hybrid athlete.",
    tags: ["Pilates", "Strength", "Flexibility"],
    image: "https://images.unsplash.com/photo-1583454048669-8f94b1e1b324?auto=format&w=900&q=60",
  },
  {
    name: "Vale",
    age: 23,
    bio: "If it’s not 5AM, it’s not training.",
    tags: ["Early Riser", "Cardio", "Strength"],
    image: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&w=900&q=60",
  },
  {
    name: "Flint",
    age: 22,
    bio: "Benches twice a week because why not.",
    tags: ["Bench Press", "Powerlifting", "Hypertrophy"],
    image: "https://images.unsplash.com/photo-1550345333-7bb90481f36d?auto=format&w=900&q=60",
  },
  {
    name: "Kora",
    age: 19,
    bio: "Cardio bunny but trying to fall in love with weights.",
    tags: ["Running", "Learning", "Strength"],
    image: "https://images.unsplash.com/photo-1571907483881-d040f6d6138f?auto=format&w=900&q=60",
  },
  {
    name: "Onyx",
    age: 20,
    bio: "Deadlifts cure everything.",
    tags: ["Deadlift", "Strength", "Aesthetics"],
    image: "https://images.unsplash.com/photo-1583454048688-3316d0e6f012?auto=format&w=900&q=60",
  },
  {
    name: "Elara",
    age: 22,
    bio: "I lift to feel alive.",
    tags: ["Intensity", "Strength", "Routine"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&w=900&q=60",
  },
];

  const [index, setIndex] = useState(0);

  const activePerson = matches[index];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);

  const swipe = (direction) => {
    const to = direction === "left" ? -500 : 500;

    animate(x, to, {
      duration: 0.3,
      onComplete: () => {
        x.set(0);
        setIndex((i) => Math.min(i + 1, matches.length - 1));
      },
    });
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 120) swipe("right");
    else if (info.offset.x < -120) swipe("left");
    else {
      animate(x, 0, { type: "spring", stiffness: 300 });
    }
  };

  return (
    <div className="px-4 mt-6 pb-24 relative h-[560px] flex justify-center">
      {matches
        .slice(index, index + 3)
        .reverse()
        .map((person, i) => {
          const isTop = i === matches.slice(index, index + 3).length - 1;

          return (
            <motion.div
              key={person.name}
              className="absolute w-[360px] h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-xl"
              style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotate : 0,
                zIndex: i,
                scale: 1 - i * 0.05,
                translateY: i * 10,
              }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={isTop ? handleDragEnd : null}
            >
              <img
                src={person.image}
                className="w-full h-full object-cover absolute"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>

              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl font-bold">
                  {person.name}, {person.age}
                </h2>
                <p className="text-gray-300 mt-1">{person.bio}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {person.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center mt-6 gap-6">
                  <button
                    className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xl backdrop-blur-xl"
                    onClick={() => swipe("left")}
                  >
                    ✖
                  </button>
                  <button
                    className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xl backdrop-blur-xl"
                    onClick={() => swipe("right")}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
    </div>
  );
}
