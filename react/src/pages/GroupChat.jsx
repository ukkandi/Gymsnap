import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function GroupChat() {
  const { groupName } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { sender: "Alex", text: "Yo, hitting heavy deadlifts today?", me: false },
    { sender: "Sam", text: "Gym is packed rn but let's go", me: false },
    { sender: "You", text: "On my way 🏃‍♂️", me: true },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { sender: "You", text: input.trim(), me: true },
    ]);

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white pt-16 pb-24 max-w-md mx-auto">
      
      {/* HEADER with back button */}
      <div className="flex items-center gap-4 px-4 mb-4">
        <button
          onClick={() => navigate("/", { state: { tab: "groups" } })}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold">
          {decodeURIComponent(groupName)} Chat
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] p-2 rounded-2xl text-sm ${
              m.me
                ? "bg-blue-600 self-end text-white ml-auto"
                : "bg-zinc-800 text-gray-100"
            }`}
          >
            {!m.me && (
              <div className="text-xs opacity-70 mb-0.5">{m.sender}</div>
            )}
            {m.text}
          </div>
        ))}
      </div>

      {/* INPUT BOX */}
      <div className="flex items-center gap-2 p-4 border-t border-white/10 bg-zinc-900">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message..."
          className="flex-1 px-3 py-2 rounded-full bg-black border border-white/20 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded-full text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
