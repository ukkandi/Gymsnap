// src/pages/MatchPage.jsx

import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { generateUser } from "../Utils/generateUser";
import {
  calculateCompatibility,
  describeCompatibility,
} from "../Utils/compatibility";
import { useUserData } from "../context/UserDataContext.jsx";
import { useAccountabilityRooms } from "../context/AccountabilityRoomsContext.jsx";

const EMOTION_TAGS = ["Hyped", "Focused", "Calm", "Laser", "Tired"];

export default function MatchPage() {
  const { user, logEmotionTag } = useUserData();
  const { addRoom, setActiveRoomId } = useAccountabilityRooms();

  // Generate initial pool
  const [matches, setMatches] = useState(() =>
    Array.from({ length: 30 }, () => generateUser())
  );

  const [index, setIndex] = useState(0);
  const [matchSheet, setMatchSheet] = useState(null);

  const activePerson = matches[index];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);

  const swipe = (direction, likedPerson, likedCompatibility, likedExplanation) => {
    const to = direction === "left" ? -500 : 500;
    const targetPerson = likedPerson || activePerson;
    setMatchSheet(null);

    animate(x, to, {
      duration: 0.25,
      onComplete: () => {
        x.set(0);

        if (direction === "right" && targetPerson) {
          const roomId = addRoom(targetPerson, likedCompatibility, likedExplanation);
          setMatchSheet({
            name: targetPerson.name,
            compatibility: likedCompatibility,
            explanation: likedExplanation,
            roomId,
            emotion: null,
          });
        }

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
    if (info.offset.x > 120)
      swipe("right", activePerson, compatibility, compatibilityExplanation);
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
              onClick={() =>
                swipe("right", activePerson, compatibility, compatibilityExplanation)
              }
            >
              ❤️
            </button>
          </div>
        </div>
      </motion.div>

      {matchSheet && (
        <div className="fixed inset-0 z-30 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 opacity-100 pointer-events-none"></div>
          <div className="relative w-full max-w-md px-4 pb-6">
            <div className="rounded-3xl bg-zinc-900/80 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                    Compatibility
                  </div>
                  <div className="text-2xl font-semibold">
                    {matchSheet.compatibility}% Match
                  </div>
                </div>
                <span className="text-sm text-gray-400">AI insight</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                {matchSheet.explanation}
              </p>
              <div className="mb-4">
                <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
                  How does this match feel?
                </div>
                <div className="flex flex-wrap gap-2">
                  {EMOTION_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setMatchSheet((prev) =>
                          prev ? { ...prev, emotion: tag } : prev
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs border transition ${
                        matchSheet.emotion === tag
                          ? "bg-emerald-500/30 border-emerald-300 text-white"
                          : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className={`w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 text-black font-semibold flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition ${
                  matchSheet.emotion ? "" : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (matchSheet.roomId) {
                    setActiveRoomId(matchSheet.roomId);
                  }
                  if (matchSheet.emotion) {
                    logEmotionTag({
                      emotion: matchSheet.emotion,
                      matchName: matchSheet.name,
                    });
                  }
                  setMatchSheet(null);
                }}
                disabled={!matchSheet.emotion}
              >
                ⚡ Start Accountability Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
