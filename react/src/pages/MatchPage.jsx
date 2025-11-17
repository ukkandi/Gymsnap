// src/pages/MatchPage.jsx

import { useMemo, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useAccountabilityRooms } from "../context/AccountabilityRoomsContext.jsx";
import { useUserData } from "../context/UserDataContext.jsx";
import { generateUser } from "../utils/generateUser";
import { calculateCompatibility } from "../utils/compatibility";
import { currentUser } from "../data/currentUser";

const SwipeCard = motion.div;

export default function MatchPage() {
  // Generate initial pool
  const [matches, setMatches] = useState(() =>
    Array.from({ length: 30 }, () => generateUser())
  );

  const [index, setIndex] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [pendingMatch, setPendingMatch] = useState(null);
  const [showMoodSheet, setShowMoodSheet] = useState(false);
  const [selectedMood, setSelectedMood] = useState("locked-in");
  const { addRoom } = useAccountabilityRooms();
  const { logEmotionTag } = useUserData();

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

          // When running out of users → generate more on the fly
          if (next >= matches.length) {
            setMatches((old) => [
              ...old,
              generateUser(),
              generateUser(),
              generateUser(),
            ]);
          }

          return next;
        });
      },
    });
  };

  const buildExplanation = (source) => {
    const data = source && source.length ? source : breakdown;
    if (!data?.length) {
      return "Behavior overlap detected across timing, discipline, and intensity.";
    }
    const ranked = [...data].sort(
      (a, b) => b.score * b.weight - a.score * a.weight
    );
    const highlights = ranked
      .slice(0, 2)
      .map((metric) => `${metric.label}: ${metric.description}`);
    return highlights.join(" · ");
  };

  const handleLike = () => {
    if (activePerson) {
      setPendingMatch({
        person: activePerson,
        compatibility,
        breakdown,
      });
      setSelectedMood("locked-in");
      setShowMoodSheet(true);
    }
    setShowBreakdown(false);
    swipe("right");
  };

  const handlePass = () => {
    setShowBreakdown(false);
    swipe("left");
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 120) handleLike();
    else if (info.offset.x < -120) handlePass();
    else animate(x, 0, { type: "spring", stiffness: 300 });
  };

  const handleCreateActiveSquad = () => {
    if (!pendingMatch) return;
    const explanation = buildExplanation(pendingMatch.breakdown);
    addRoom(pendingMatch.person, pendingMatch.compatibility, explanation);
    if (selectedMood) {
      logEmotionTag({
        emotion: selectedMood,
        matchName: pendingMatch.person.name,
      });
    }
    setPendingMatch(null);
    setShowMoodSheet(false);
  };

  const handleDismissMoodSheet = () => {
    setPendingMatch(null);
    setShowMoodSheet(false);
  };

  const moodOptions = useMemo(
    () => [
      { id: "locked-in", label: "Locked In", emoji: "🟢" },
      { id: "amped", label: "Amped", emoji: "🔥" },
      { id: "calm", label: "Calm", emoji: "😌" },
      { id: "curious", label: "Curious", emoji: "🤔" },
    ],
    []
  );

  if (!activePerson) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Loading...
      </div>
    );
  }

  const { score: compatibility, breakdown } = calculateCompatibility(
    currentUser.embedding,
    activePerson.embedding
  );

  return (
    <div className="px-4 mt-6 pb-24 relative h-[560px] flex justify-center">
      <SwipeCard
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

          {/* Name + Age */}
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

          <button
            onClick={() => setShowBreakdown(true)}
            className="mt-2 text-xs uppercase tracking-wide text-emerald-200 hover:text-white transition"
          >
            Why this match?
          </button>

          {/* Bio */}
          <p className="text-gray-300 mt-2">{activePerson.bio}</p>

          {/* Tags */}
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

          {/* Swipe Buttons */}
          <div className="flex justify-center mt-6 gap-6">
            <button
              className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xl backdrop-blur-xl"
              onClick={handlePass}
            >
              ✖
            </button>
            <button
              className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xl backdrop-blur-xl"
              onClick={handleLike}
            >
              ❤️
            </button>
          </div>
        </div>
      </SwipeCard>

      {showBreakdown && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowBreakdown(false)}
          ></div>
          <div className="relative w-full max-w-md mx-auto rounded-t-3xl bg-zinc-950 border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                  Compatibility Sheet
                </div>
                <p className="text-sm text-gray-400">
                  Behavior embedding comparison across key signals.
                </p>
              </div>
              <button
                onClick={() => setShowBreakdown(false)}
                className="text-xs px-3 py-1 rounded-full border border-white/20 text-gray-300 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {breakdown?.map((metric) => (
                <div
                  key={metric.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {metric.label}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {metric.description}
                        {metric.detail && (
                          <>
                            {" "}
                            <span className="text-gray-500">{metric.detail}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-emerald-300">
                      {metric.score}%
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-lime-300"
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMoodSheet && pendingMatch && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={handleDismissMoodSheet}
          ></div>
          <div className="relative w-full max-w-md mx-auto rounded-t-3xl bg-zinc-950 border border-white/10 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                  Squad Check-In
                </div>
                <p className="text-sm text-gray-400">
                  Capture the vibe before spinning up accountability.
                </p>
              </div>
              <button
                onClick={handleDismissMoodSheet}
                className="text-xs px-3 py-1 rounded-full border border-white/20 text-gray-300 hover:text-white"
              >
                Skip
              </button>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">
                  {pendingMatch.person.name}
                </div>
                <p className="text-xs text-gray-400">
                  {pendingMatch.compatibility}% behavioral match
                </p>
              </div>
              <div className="text-right text-xs text-gray-400 max-w-[160px]">
                {buildExplanation(pendingMatch.breakdown)}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
                Mood tag
              </div>
              <div className="grid grid-cols-2 gap-3">
                {moodOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedMood(option.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm transition ${
                      selectedMood === option.id
                        ? "border-emerald-400 bg-emerald-500/20 text-white"
                        : "border-white/10 bg-white/5 text-gray-300"
                    }`}
                  >
                    <span>{option.emoji}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateActiveSquad}
              className="w-full py-3 rounded-2xl bg-emerald-400 text-black font-semibold text-sm uppercase tracking-wide"
            >
              Create active squad
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
