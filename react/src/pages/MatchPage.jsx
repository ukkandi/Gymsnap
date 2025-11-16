// src/pages/MatchPage.jsx

import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { generateUser } from "../Utils/generateUser";
import {
  calculateCompatibility,
  describeCompatibility,
} from "../Utils/compatibility";
import { useUserData } from "../context/UserDataContext.jsx";

export default function MatchPage() {
  const { user } = useUserData();

  // Generate initial pool
  const [matches, setMatches] = useState(() =>
    Array.from({ length: 30 }, () => generateUser())
  );

  const [index, setIndex] = useState(0);

  const activePerson = matches[index];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);

  const swipe = (direction) => {
    const to = direction === "left" ? -500 : 500;

    animate(x, to, {
      duration: 0.25,
      onComplete: () => {
        x.set(0);

        setIndex((prev) => {
          const next = prev + 1;

          // If out of users, generate more on the fly
          if (next >= matches.length) {
            setMatches((old) => [...old, generateUser(), generateUser(), generateUser()]);
          }

          return next;
        });
      },
    });
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 120) swipe("right");
    else if (info.offset.x < -120) swipe("left");
    else animate(x, 0, { type: "spring", stiffness: 300 });
  };

  if (!activePerson) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Loading...
      </div>
    );
  }

  const compatibility = calculateCompatibility(
    user.embedding,
    activePerson.embedding
  );
  const compatibilityExplanation = describeCompatibility(
    user.embedding,
    activePerson.embedding
  );

  return (
    <div className="px-4 mt-6 pb-24 relative h-[560px] flex justify-center">
      <motion.div
        key={activePerson.name + index}
        className="absolute w-[360px] h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-xl"
        style={{
          x,
          rotate,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
      >
        <img
          src={activePerson.image}
          className="w-full h-full object-cover absolute"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>

        <div className="absolute bottom-6 left-6 right-6">
  <h2 className="text-3xl font-bold">
    {activePerson.name}, {activePerson.age}
  </h2>

  {/* Compatibility Score */}
  <div className="mt-1 flex items-center gap-2">
    <span className="text-emerald-400 font-semibold text-lg">
      {compatibility}% Match
    </span>
    <span className="text-xs text-gray-400">behavior-based</span>
  </div>
  <p className="text-xs text-gray-400 mt-1 italic">
    {compatibilityExplanation}
  </p>

  <p className="text-gray-300 mt-2">{activePerson.bio}</p>

  <div className="flex flex-wrap gap-2 mt-3">
    {activePerson.tags.map((tag) => (
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
    </div>
  );
}
