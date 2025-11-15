import { useState, useEffect } from "react";

export default function Streaks() {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState("");

  useEffect(() => {
    const savedStreak = localStorage.getItem("streak");
    const savedDate = localStorage.getItem("lastWorkout");

    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedDate) setLastDate(savedDate);
  }, []);

  function markWorkout() {
    const today = new Date().toDateString();

    if (today === lastDate) return;

    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = streak;
    if (lastDate === yesterday) newStreak++;
    else newStreak = 1;

    setStreak(newStreak);
    setLastDate(today);

    localStorage.setItem("streak", newStreak);
    localStorage.setItem("lastWorkout", today);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Streaks</h1>

      <h2>Current Streak: {streak} days</h2>
      <p>Last workout: {lastDate || "No workouts yet"}</p>

      <button onClick={markWorkout} style={{ marginTop: "10px" }}>
        Mark Today as Workout
      </button>
    </div>
  );
}
