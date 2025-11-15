import { useState } from "react";
import RepCounter from "../components/RepCounter";

export default function Workout() {
  const [exercise, setExercise] = useState("curl");
  const [reps, setReps] = useState(0);

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
          <option value="curl">Bicep Curl</option>
          <option value="squat">Squat</option>
        </select>
      </label>

      <h2 style={{ marginTop: "20px" }}>
        {exercise}: {reps} reps
      </h2>

      <RepCounter
        exercise={exercise}
        reps={reps}
        onRepChange={(count) => setReps(count)}
      />
    </div>
  );
}
