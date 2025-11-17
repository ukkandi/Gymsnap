import { useEffect, useRef } from "react";
import runRepCounter from "../repCounter";

export default function RepCounter({ exercise, reps, onRepChange, size = 400 }) {
  const videoRef = useRef(null);
  const repCallbackRef = useRef(onRepChange);

  useEffect(() => {
    repCallbackRef.current = onRepChange;
  }, [onRepChange]);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoEl = videoRef.current;
    videoEl.setAttribute("playsinline", "true");
    videoEl.setAttribute("muted", "true");
    videoEl.muted = true;
    videoEl.autoplay = true;

    const stop = runRepCounter(
      videoEl,
      (newRep) => repCallbackRef.current?.(newRep),
      exercise
    );

    return () => {
      if (typeof stop === "function") stop();
    };
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
        muted
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
