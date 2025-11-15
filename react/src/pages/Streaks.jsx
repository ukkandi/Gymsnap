import { useState } from "react";

export default function Streak() {
  const [streak, setStreak] = useState(7); // demo streak count
  const [checkedIn, setCheckedIn] = useState(false);

  function handleCheckIn() {
    if (checkedIn) return;

    setCheckedIn(true);
    setStreak(streak + 1);
  }

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
      
      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[200px] rounded-full opacity-60 -z-10" />

      {/* Streak Ring */}
      <div className="relative flex items-center justify-center">
        
        {/* Ring */}
        <div
          className={`w-64 h-64 rounded-full border-[18px] ${
            checkedIn 
              ? "border-purple-400 shadow-[0_0_60px_rgba(180,0,255,0.8)] scale-110" 
              : "border-purple-800 shadow-[0_0_40px_rgba(120,0,200,0.5)]"
          } transition-all duration-700`}
        ></div>

        {/* Streak Number */}
        <div className="absolute text-center">
          <p className="text-[90px] font-bold">{streak}</p>
          <p className="opacity-70 text-lg">day streak</p>
        </div>
      </div>

      {/* Check-in Button */}
      <button
        onClick={handleCheckIn}
        className={`mt-10 px-12 py-4 rounded-full font-semibold text-xl transition-all ${
          checkedIn
            ? "bg-purple-900/80 text-purple-300 cursor-default"
            : "bg-purple-500 hover:bg-purple-400 text-white shadow-[0_0_40px_rgba(200,0,255,0.6)]"
        }`}
      >
        {checkedIn ? "Checked In ✓" : "Check In"}
      </button>
    </div>
  );
}
