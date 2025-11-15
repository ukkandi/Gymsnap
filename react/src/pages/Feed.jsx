import { gymbros, calculateCompatibility, currentUser } from "../data/mockGymbros";

export default function Feed() {
  return (
    <div className="pt-20 pb-24 px-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Squad Feed</h2>
      <p className="text-gray-400 text-sm mb-6">
        See what other gymrats are up to today.
      </p>

      <div className="space-y-4">
        {gymbros.map(bro => {
          const score = calculateCompatibility(currentUser, bro);
          return (
            <div
              key={bro.id}
              className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              {/* Fake content thumbnail */}
              <div className="h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-3 left-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-black/60 text-white/80">
                    Chest day · PR attempt
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 shadow-lg" />
                    <div>
                      <div className="font-semibold">{bro.name}</div>
                      <div className="text-xs text-gray-400">
                        {bro.gym} · {bro.gymPersonality}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Match score</div>
                    <div className="text-lg font-semibold text-emerald-400">
                      {score}%
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-300 mt-1">
                  “{bro.vibe.slice(0, 2).join(" · ")}” · Goals: {bro.goals.join(", ")}
                </div>

                {/* Reactions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <div className="flex space-x-3 text-xl">
                    <button>🔥</button>
                    <button>💀</button>
                    <button>💪</button>
                    <button>🧠</button>
                  </div>
                  <button className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition">
                    DM / Spot
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
