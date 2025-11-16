import { useState } from "react";
import WeeklySummary from "../components/WeeklySummary.jsx";

export default function Feed() {
  // mock gym posts (later replaced with real db)
  const [posts] = useState([
    {
      id: 1,
      name: "Jake B.",
      avatar: "https://i.pravatar.cc/150?img=12",
      video: "https://cdn.coverr.co/videos/coverr-man-lifting-weights-9873/1080p.mp4",
      caption: "Hit a new PR today 🔥 315lb bench!",
      reactions: 128
    },
    {
      id: 2,
      name: "Leo M.",
      avatar: "https://i.pravatar.cc/150?img=8",
      video: "https://cdn.coverr.co/videos/coverr-aggressive-powerlifting-3128/1080p.mp4",
      caption: "Back day intensity 🚀",
      reactions: 254
    },
    {
      id: 3,
      name: "Santi G.",
      avatar: "https://i.pravatar.cc/150?img=25",
      video: "https://cdn.coverr.co/videos/coverr-outdoor-fitness-workout-2197/1080p.mp4",
      caption: "Morning pump! ☀️",
      reactions: 92
    }
  ]);

  return (
    <div className="pt-4 pb-24">
      <WeeklySummary />

      {posts.map(post => (
        <div
          key={post.id}
          className="mb-8 bg-black/40 rounded-2xl overflow-hidden shadow-xl border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center p-4 space-x-3">
            <img
              src={post.avatar}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-semibold">{post.name}</div>
              <div className="text-gray-400 text-xs">posted just now</div>
            </div>
          </div>

          {/* Video */}
          <video
            src={post.video}
            className="w-full max-h-[450px] object-cover"
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Footer */}
          <div className="p-4">
            <p className="text-gray-200 mb-3 text-sm">{post.caption}</p>
            <div className="flex items-center space-x-4 text-xl">
              <button className="hover:scale-110 transition">🔥</button>
              <button className="hover:scale-110 transition">💪🏽</button>
              <button className="hover:scale-110 transition">👑</button>
              <button className="hover:scale-110 transition">💀</button>
              <button className="hover:scale-110 transition">👊🏽</button>
              <span className="text-gray-400 text-sm ml-auto">
                {post.reactions} reactions
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
