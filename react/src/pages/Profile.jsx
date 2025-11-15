import { currentUser } from "../data/mockGymbros";

export default function Profile() {
  return (
    <div className="pt-20 pb-24 px-4 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 shadow-lg" />
        <div>
          <div className="text-xl font-semibold">{currentUser.name}</div>
          <div className="text-xs text-gray-400">{currentUser.gymPersonality}</div>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-4 mb-4">
        <div className="text-xs text-gray-400 uppercase mb-1">Vibe summary</div>
        <div className="text-sm text-gray-200">
          {currentUser.vibe.join(" · ")}
        </div>
      </div>

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
        <button className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition">
          Edit profile (future)
        </button>
      </div>
    </div>
  );
}
