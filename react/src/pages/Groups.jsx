import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAccountabilityRooms } from "../context/AccountabilityRoomsContext.jsx";

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

const AI_REPLIES = [
  "I’ll check in after tonight’s session.",
  "Need that streak update later!",
  "Short session tomorrow? Keep the ring glowing.",
  "I’ll ping you before my lift.",
];

export default function Groups() {
  const [chatInput, setChatInput] = useState("");
  const { rooms, activeRoomId, setActiveRoomId, appendMessage } =
    useAccountabilityRooms();

  const activeRoom = useMemo(() => {
    if (!rooms.length) return null;
    return rooms.find((room) => room.id === activeRoomId) || rooms[0];
  }, [rooms, activeRoomId]);

  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeRoom) return;
    const text = chatInput.trim();
    setChatInput("");

    appendMessage(activeRoom.id, {
      sender: "you",
      text,
    });

    const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)];
    setTimeout(() => {
      appendMessage(activeRoom.id, {
        sender: activeRoom.person.name,
        text: reply,
      });
    }, 1200);
  };

  return (
    <div className="pt-20 pb-24 px-4 max-w-md mx-auto">
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">Accountability rooms</h2>
          <p className="text-xs text-gray-400">Swiping ❤️ drops matches here</p>
        </div>

        <div className="rounded-3xl bg-black/40 border border-white/10 p-4 text-white">
          {rooms.length === 0 ? (
            <div className="text-sm text-gray-400">
              Swipe right on a match to spin up a faux-real chat room. They’ll
              appear here for accountability.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                    Active squad
                  </div>
                  <div className="text-lg font-semibold">
                    {activeRoom?.person.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {activeRoom.compatibility}% compatible •{" "}
                    {activeRoom.explanation}
                  </div>
                </div>
                <div className="flex gap-2">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setActiveRoomId(room.id)}
                      className={`text-xs px-3 py-1 rounded-full border transition ${
                        activeRoom?.id === room.id
                          ? "bg-emerald-500/20 border-emerald-400 text-white"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                    >
                      {room.person.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-48 overflow-y-auto space-y-2 mb-3">
                {activeRoom?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`text-sm flex ${
                      message.sender === "you" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span
                      className={`px-3 py-2 rounded-2xl ${
                        message.sender === "you"
                          ? "bg-emerald-500/20 border border-emerald-400/40"
                          : "bg-white/10 border border-white/10"
                      }`}
                    >
                      <span className="block text-[10px] uppercase tracking-wide text-gray-400 mb-1">
                        {message.sender === "you" ? "You" : message.sender}
                      </span>
                      {message.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Drop a nudge..."
                  className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-4 py-2 text-sm text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!activeRoom}
                  className={`px-4 py-2 rounded-2xl text-sm font-semibold ${
                    activeRoom
                      ? "bg-emerald-500 text-black"
                      : "bg-white/10 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </section>

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

            <Link
              to={`/chat/${encodeURIComponent(g.name)}`}
              className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition inline-block"
            >
              Open chat
            </Link>

          </div>
        ))}
      </div>
    </div>
  );
}
