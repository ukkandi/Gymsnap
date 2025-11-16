import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

export default function runRepCounter(videoElement, repCallback, exercise) {
  let repCount = 0;

  const lerp = (prev, next, factor = 0.2) =>
    prev === null ? next : prev + (next - prev) * factor;

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

  const curlState = {
    lastDist: null,
    direction: null,
    passedMid: false,
    repLocked: false,
  };

  function countCurl(lm) {
    const shoulder = lm[12];
    const wrist = lm[16];

    const dist = distance(shoulder, wrist);

    const DOWN_THRESHOLD = 0.78;
    const MID_THRESHOLD = 0.72;
    const UP_THRESHOLD = 0.66;

    if (curlState.lastDist === null) {
      curlState.lastDist = dist;
      return;
    }

    const delta = dist - curlState.lastDist;

    if (delta < -0.01) curlState.direction = "up";
    if (delta > 0.01) curlState.direction = "down";

    if (dist < MID_THRESHOLD && curlState.direction === "up") {
      curlState.passedMid = true;
    }

    if (
      dist < UP_THRESHOLD &&
      curlState.passedMid &&
      curlState.direction === "up" &&
      !curlState.repLocked
    ) {
      repCount++;
      repCallback(repCount);
      curlState.repLocked = true;
    }

    if (dist > DOWN_THRESHOLD && curlState.direction === "down") {
      curlState.repLocked = false;
      curlState.passedMid = false;
    }

    curlState.lastDist = dist;
  }

  // =======================================================
  // SIMPLE SQUAT DETECTOR (same as before)
  // =======================================================
  const squatState = {
    down: false,
    filteredDist: null,
  };

  function countSquat(lm) {
    const hip = lm[24];
    const ankle = lm[28];

    const dist = distance(hip, ankle);
    squatState.filteredDist = lerp(squatState.filteredDist, dist, 0.3);

    const value = squatState.filteredDist ?? dist;

    if (value < 0.34) squatState.down = true;

    if (value > 0.53 && squatState.down) {
      repCount++;
      repCallback(repCount);
      squatState.down = false;
    }
  }

  // =======================================================
  // PUSH-UP / BENCH PRESS STYLE DETECTOR
  // =======================================================
  const pushState = {
    low: false,
    filteredTorso: null,
  };

  function countPushPress(lm) {
    const shoulderR = lm[12];
    const shoulderL = lm[11];
    const hipR = lm[24];
    const hipL = lm[23];
    const avgY = (shoulderR.y + shoulderL.y + hipR.y + hipL.y) / 4;

    pushState.filteredTorso = lerp(pushState.filteredTorso, avgY, 0.25);
    const value = pushState.filteredTorso ?? avgY;

    if (value > 0.68) pushState.low = true;

    if (value < 0.5 && pushState.low) {
      repCount++;
      repCallback(repCount);
      pushState.low = false;
    }
  }

  // =======================================================
  // PULL-UP / ROW STYLE DETECTOR
  // =======================================================
  const pullState = {
    low: false,
    filteredHand: null,
  };

  function countPull(lm) {
    const wrist = lm[16];
    pullState.filteredHand = lerp(pullState.filteredHand, wrist.y, 0.2);
    const value = pullState.filteredHand ?? wrist.y;

    if (value > 0.62) pullState.low = true;

    if (value < 0.38 && pullState.low) {
      repCount++;
      repCallback(repCount);
      pullState.low = false;
    }
  }

  // =======================================================
  // DEADLIFT / HINGE DETECTOR
  // =======================================================
  const hingeState = {
    low: false,
    filteredHip: null,
  };

  function countHipHinge(lm) {
    const hip = lm[24];
    hingeState.filteredHip = lerp(hingeState.filteredHip, hip.y, 0.2);
    const value = hingeState.filteredHip ?? hip.y;

    if (value > 0.68) hingeState.low = true;

    if (value < 0.52 && hingeState.low) {
      repCount++;
      repCallback(repCount);
      hingeState.low = false;
    }
  }

  const detectors = {
    curl: countCurl,
    squat: countSquat,
    lunge: countSquat,
    pushup: countPushPress,
    bench: countPushPress,
    pullup: countPull,
    row: countPull,
    deadlift: countHipHinge,
  };

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

    const handler = detectors[exercise];
    if (handler) handler(lm);
  });

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await pose.send({ image: videoElement });
    },
    width: 640,
    height: 480,
  });

  camera.start();

  return () => {
    camera.stop();
  };
}
