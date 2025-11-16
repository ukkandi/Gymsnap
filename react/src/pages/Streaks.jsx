import { useState } from "react";

export default function Streak() {
  const [streak, setStreak] = useState(7); // demo streak count
  const [checkedIn, setCheckedIn] = useState(false);
  const [workoutDays, setWorkoutDays] = useState([]);

  useEffect(() => {
    const savedStreak = localStorage.getItem("streakCount");
    const savedCheckIn = localStorage.getItem("checkedIn");
    const savedDays = JSON.parse(localstorage.getItem("workoutDay")) || [];
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedCheckIn === "true) setCheckedIn(true);
    setWorkoutDays(savedDays);
    if (savedDays.length > 0) {
      const lastDay = new Date(savedDays[savedDays.length - 1]);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDay.toDateString() !== yesterday.toDateString() && lastday.toDateString() !== new Date(). toDateString())
        setStreak(0);
    }
  }
            }, []);
  useEffect(() => {
localStorage.setItem("streakCount", streak);
localStorage.setItem("checkedIn", checkedIn);
localStorage.setItem("workoutDays", JSON.stringify(workoutDays));
}, [streak, checkedIn, workoutDays]);
  
  function handleCheckIn() {
    if (checkedIn) return;
    const today = new Date();
const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
setCheckedIn(true);
setStreak(streak + 1);
setWorkoutDays([...workoutDays, todayStr]);
}
    setCheckedIn(true);
    setStreak(streak + 1);
  }
const renderCalendar = () => {
const currentMonth = new Date();
const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
const cells = [];


for (let i = 0; i < startDay; i++) cells.push(<div key={`empty-${i}`} className="day empty"></div>);


for (let day = 1; day <= daysInMonth; day++) {
const dateStr = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-${day}`;
const isWorkout = workoutDays.includes(dateStr);
cells.push(<div key={day} className={`day ${isWorkout ? 'workout' : ''}`}>{day}</div>);
}
return cells;
};



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
