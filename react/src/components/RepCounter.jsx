import { useEffect, useRef } from "react";
import runRepCounter from "../repCounter";

export default function RepCounter({ exercise, reps, onRepChange, size = 400 }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    runRepCounter(
      videoRef.current,
      (newRep) => onRepChange(newRep),
      exercise
    );
  }, [exercise]);

  const dimension = `${size}px`;

  return (
    <div
      style={{
        position: "relative",
        width: dimension,
        height: dimension,
      }}
    >
      {/* HUD Overlay */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.6)",
          padding: "10px 15px",
          borderRadius: "8px",
          color: "white",
          zIndex: 10,
          fontSize: "14px",
        }}
      >
        <div><strong>Exercise:</strong> {exercise}</div>
        <div><strong>Reps:</strong> {reps}</div>
        <div
          style={{
            marginTop: "6px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "limegreen",
          }}
        ></div>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width={size}
        height={size}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          borderRadius: "10px",
          border: "2px solid white",
          zIndex: 1,
        }}
      />
    </div>
  );
}
