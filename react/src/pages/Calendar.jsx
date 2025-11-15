import { useEffect, useState } from "react";

export default function Calendar() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const last = localStorage.getItem("lastWorkout");
    const streak = localStorage.getItem("streak");

    let arr = [];
    if (last) arr.push({ date: last, workedOut: true });

    setHistory(arr);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Calendar</h1>

      <h2>Workout History</h2>

      {history.length === 0 && <p>No workouts logged yet.</p>}

      {history.map((item, index) => (
        <div key={index}>
          <strong>{item.date}</strong> — ✔ Worked Out
        </div>
      ))}
    </div>
  );
}
