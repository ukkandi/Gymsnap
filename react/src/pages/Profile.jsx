import { useState } from "react";
import { currentUser } from "../data/mockGymbros";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  // full structured state
  const [extra, setExtra] = useState(
    currentUser.extra || {
      experience: "Beginner",
      favLift: "",
      goal: "Maintain",
      bio: "",
      goals: [...currentUser.goals],
      schedule: [...currentUser.schedule],
      newGoal: "",
      newDay: "",
    }
  );

  // Save function
  const save = () => {
    currentUser.extra = { ...extra };
    // clean temporary inputs
    delete currentUser.extra.newGoal;
    delete currentUser.extra.newDay;
    setIsEditing(false);
  };

  // Handlers for Goals and Schedule
  const addGoal = () => {
    if (extra.newGoal.trim() && !extra.goals.includes(extra.newGoal.trim())) {
      setExtra({ ...extra, goals: [...extra.goals, extra.newGoal.trim()], newGoal: "" });
    }
  };

  const removeGoal = (goal) => {
    setExtra({ ...extra, goals: extra.goals.filter(g => g !== goal) });
  };

  const addDay = () => {
    const day = extra.newDay.trim();
    if (day && !extra.schedule.includes(day)) {
      setExtra({ ...extra, schedule: [...extra.schedule, day], newDay: "" });
    }
  };

  const removeDay = (day) => {
    setExtra({ ...extra, schedule: extra.schedule.filter(d => d !== day) });
  };

  return (
    <div className="pt-20 pb-24 px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 shadow-lg" />
        <div>
          <div className="text-xl font-semibold">{currentUser.name}</div>
          <div className="text-xs text-gray-400">{currentUser.gymPersonality}</div>
        </div>
      </div>

      {/* Vibe */}
      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-4 mb-4">
        <div className="text-xs text-gray-400 uppercase mb-1">Vibe summary</div>
        <div className="text-sm text-gray-200">
          {currentUser.vibe.join(" · ")}
        </div>
      </div>

      {/* Goals */}
      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-4 mb-4">
        <div className="text-xs text-gray-400 uppercase mb-2">Goals</div>
        <div className="flex flex-wrap gap-2">
          {currentUser.goals.map(g => (
            <span
              key={g}
              className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-100"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Schedule + Edit */}
      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-4">
        <div className="text-xs text-gray-400 uppercase mb-2">Schedule</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {currentUser.schedule.map(d => (
            <span
              key={d}
              className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-100"
            >
              {d}
            </span>
          ))}
        </div>

        {isEditing ? (
          <div className="space-y-3 mt-3">
            {/* Experience */}
            <div>
              <label className="text-xs text-gray-400">Experience Level</label>
              <select
                className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2 text-sm text-gray-100"
                value={extra.experience}
                onChange={(e) =>
                  setExtra({ ...extra, experience: e.target.value })
                }
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            {/* Favorite Lift */}
            <div>
              <label className="text-xs text-gray-400">Favorite Lift</label>
              <input
                type="text"
                className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2 text-sm text-gray-100"
                placeholder="Bench, Squat, Deadlift..."
                value={extra.favLift}
                onChange={(e) =>
                  setExtra({ ...extra, favLift: e.target.value })
                }
              />
            </div>

            {/* Main Goal */}
            <div>
              <label className="text-xs text-gray-400">Main Goal</label>
              <select
                className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2 text-sm text-gray-100"
                value={extra.goal}
                onChange={(e) =>
                  setExtra({ ...extra, goal: e.target.value })
                }
              >
                <option>Bulk</option>
                <option>Cut</option>
                <option>Maintain</option>
                <option>Strength</option>
                <option>Endurance</option>
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs text-gray-400">Short Bio</label>
              <textarea
                rows={2}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2 text-sm text-gray-100"
                placeholder="Tell us something short..."
                value={extra.bio}
                onChange={(e) =>
                  setExtra({ ...extra, bio: e.target.value })
                }
              />
            </div>

            {/* Goals Editor */}
            <div>
              <label className="text-xs text-gray-400">Goals</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {extra.goals.map(g => (
                  <span
                    key={g}
                    className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-100"
                  >
                    {g}
                    <button
                      onClick={() => removeGoal(g)}
                      className="text-red-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  className="flex-1 bg-zinc-800 border border-white/10 rounded-xl p-2 text-sm text-gray-100"
                  placeholder="Add goal..."
                  value={extra.newGoal}
                  onChange={(e) => setExtra({ ...extra, newGoal: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addGoal()}
                />
                <button
                  onClick={addGoal}
                  className="px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Schedule Editor */}
            <div>
              <label className="text-xs text-gray-400">Schedule</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {extra.schedule.map(d => (
                  <span
                    key={d}
                    className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-100"
                  >
                    {d}
                    <button
                      onClick={() => removeDay(d)}
                      className="text-red-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  className="flex-1 bg-zinc-800 border border-white/10 rounded-xl p-2 text-sm text-gray-100"
                  placeholder="Add day..."
                  value={extra.newDay}
                  onChange={(e) => setExtra({ ...extra, newDay: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addDay()}
                />
                <button
                  onClick={addDay}
                  className="px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Save & Cancel */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={save}
                className="text-xs px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Display saved extra info */}
            {currentUser.extra && (
              <div className="text-sm text-gray-300 space-y-1 mb-3">
                <div>
                  <span className="text-gray-400">Experience:</span> {currentUser.extra.experience}
                </div>
                <div>
                  <span className="text-gray-400">Favorite Lift:</span> {currentUser.extra.favLift}
                </div>
                <div>
                  <span className="text-gray-400">Goal:</span> {currentUser.extra.goal}
                </div>
                <div>
                  <span className="text-gray-400">Bio:</span> {currentUser.extra.bio}
                </div>
                <div>
                  <span className="text-gray-400">Goals:</span> {currentUser.extra.goals.join(", ")}
                </div>
                <div>
                  <span className="text-gray-400">Schedule:</span> {currentUser.extra.schedule.join(", ")}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
            >
              Edit profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
