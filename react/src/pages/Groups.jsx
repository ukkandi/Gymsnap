const groups = [
  {
    name: "GMU Powerlifters",
    members: 42,
    vibe: "Heavy compound lifts, chalk, smelling salts.",
  },
  {
    name: "Early Morning Misfits",
    members: 31,
    vibe: "5am workouts, quiet grind, no crowds.",
  },
  {
    name: "Hypertrophy & Aesthetics",
    members: 58,
    vibe: "Chasing the pump, angles, lighting checks.",
  },
  {
    name: "Beginner Friendly Crew",
    members: 19,
    vibe: "No ego, form help, starting from zero.",
  },
];

export default function Groups() {
  return (
    <div className="pt-20 pb-24 px-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Communities</h2>
      <p className="text-gray-400 text-sm mb-6">
        Join squads that match your training style and vibe.
      </p>

      <div className="space-y-4">
        {groups.map((g, i) => (
          <div
            key={i}
            className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)] p-4"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="font-semibold">{g.name}</div>
              <div className="text-xs text-gray-400">{g.members} members</div>
            </div>
            <p className="text-sm text-gray-300 mb-3">{g.vibe}</p>
            <button className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition">
              View chat / meetups
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
