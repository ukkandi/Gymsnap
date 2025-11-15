import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

export default function runRepCounter(videoElement, repCallback, exercise) {
  let repCount = 0;

  // Distance helper
  function distance(a, b) {
    return Math.sqrt(
      (a.x - b.x) ** 2 +
      (a.y - b.y) ** 2
    );
  }

  // =======================================================
  // SUPER-STABLE CURL DETECTOR (DIRECTION-BASED)
  // =======================================================

  let lastDist = null;
  let direction = null;       // "up" or "down"
  let passedMid = false;
  let repLocked = false;

  function countCurl(lm) {
    const shoulder = lm[12];
    const wrist = lm[16];

    const dist = distance(shoulder, wrist);

    // Your ranges:
    const DOWN_THRESHOLD = 0.77;   // fully extended
    const MID_THRESHOLD  = 0.71;   // halfway
    const UP_THRESHOLD   = 0.66;   // fully curled

    // Setup lastDist
    if (lastDist === null) {
      lastDist = dist;
      return;
    }

    // Compute movement direction
    const delta = dist - lastDist;

    if (delta < -0.01) direction = "up";        // moving upward
    if (delta >  0.01) direction = "down";      // moving downward

    // DEBUG
    // console.log({ dist, delta, direction, passedMid, repLocked });

    // STEP 1: mark when crossing mid during upward motion
    if (dist < MID_THRESHOLD && direction === "up") {
      passedMid = true;
    }

    // STEP 2: only count rep if:
    // - we passed mid
    // - reached top
    // - and we are moving UP
    // - and rep isn't locked
    if (
      dist < UP_THRESHOLD &&
      passedMid &&
      direction === "up" &&
      !repLocked
    ) {
      repCount++;
      repCallback(repCount);
      repLocked = true;  // block spam
    }

    // STEP 3: unlock only after returning to full DOWN
    if (dist > DOWN_THRESHOLD && direction === "down") {
      repLocked = false;
      passedMid = false;
    }

    lastDist = dist;
  }

  // =======================================================
  // SIMPLE SQUAT DETECTOR (same as before)
  // =======================================================
  let squatDown = false;

  function countSquat(lm) {
    const hip = lm[24];
    const ankle = lm[28];

    const dist = distance(hip, ankle);

    if (dist < 0.33) squatDown = true;

    if (dist > 0.50 && squatDown) {
      repCount++;
      repCallback(repCount);
      squatDown = false;
    }
  }

  // =======================================================
  // MEDIAPIPE SETUP
  // =======================================================
  const pose = new Pose({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
  });

  pose.onResults((results) => {
    if (!results.poseLandmarks) return;

    const lm = results.poseLandmarks;

    if (exercise === "curl") countCurl(lm);
    if (exercise === "squat") countSquat(lm);
  });

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await pose.send({ image: videoElement });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}
