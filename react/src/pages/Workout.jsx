import { useState } from "react";

export default function Workout() {
  const [exercise, setExercise] = useState("Push Ups");
  const [reps, setReps] = useState(0);
  const exercises = ["Push Ups", "Sit Ups", "Squats", "Pull Ups", "Bench Press"];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Workout</h1>

      <label>
        Choose Exercise:
        <select 
          value={exercise} 
          onChange={(e) => setExercise(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          {exercises.map((ex) => (
            <option key={ex} value={ex}>{ex}</option>
          ))}
        </select>
      </label>

      <h2 style={{ marginTop: "20px" }}>{exercise}: {reps} reps</h2>

      <button onClick={() => setReps(reps + 1)}>Add Rep</button>
      <button onClick={() => setReps(0)} style={{ marginLeft: "10px" }}>
        Reset
      </button>
    </div>
  );
}

