import { useState } from "react";

export default function Health() {
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");
  const [entries, setEntries] = useState([]);

  function addEntry() {
    if (!weight || !calories) return;

    const entry = {
      weight,
      calories,
      date: new Date().toDateString()
    };

    setEntries([...entries, entry]);
    setWeight("");
    setCalories("");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Health Tracking</h1>

      <input
        type="number"
        placeholder="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />

      <button onClick={addEntry} style={{ marginLeft: "10px" }}>
        Add Entry
      </button>

      <h2 style={{ marginTop: "20px" }}>History</h2>

      {entries.map((e, i) => (
        <div key={i}>
          {e.date} — Weight: {e.weight}, Calories: {e.calories}
        </div>
      ))}
    </div>
  );
}
