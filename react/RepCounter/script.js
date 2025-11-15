const videoElement = document.getElementById('webcam');
const repCountElem = document.getElementById('repCount');
const exerciseSelect = document.getElementById('exerciseSelect');

let repCount = 0;
let goingDown = false;

// Reset reps when switching exercises
exerciseSelect.addEventListener("change", () => {
  repCount = 0;
  repCountElem.innerText = 0;
  goingDown = false;
});

// Utility: angle between 3 landmarks
function getAngle(a, b, c) {
  const ab = [a.x - b.x, a.y - b.y];
  const cb = [c.x - b.x, c.y - b.y];
  const dot = ab[0]*cb[0] + ab[1]*cb[1];
  const magAB = Math.sqrt(ab[0]**2 + ab[1]**2);
  const magCB = Math.sqrt(cb[0]**2 + cb[1]**2);
  const angle = Math.acos(dot / (magAB * magCB));
  return angle * (180 / Math.PI);
}

function countCurl(landmarks) {
  const angle = getAngle(
    landmarks[12], // shoulder
    landmarks[14], // elbow
    landmarks[16]  // wrist
  );

  // Down → angle small
  if (angle < 40) goingDown = true;

  // Up → angle big and we were down
  if (angle > 150 && goingDown) {
    repCount++;
    repCountElem.innerText = repCount;
    goingDown = false;
  }
}

function countSquat(landmarks) {
  const angle = getAngle(
    landmarks[24], // hip
    landmarks[26], // knee
    landmarks[28]  // ankle
  );

  // Down position
  if (angle < 70) goingDown = true;

  // Standing back up
  if (angle > 160 && goingDown) {
    repCount++;
    repCountElem.innerText = repCount;
    goingDown = false;
  }
}

const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
});

pose.onResults(results => {
  if (!results.poseLandmarks) return;

  const landmarks = results.poseLandmarks;
  const mode = exerciseSelect.value;

  if (mode === "curl") countCurl(landmarks);
  if (mode === "squat") countSquat(landmarks);
});

const camera = new Camera(videoElement, {
  onFrame: async () => await pose.send({ image: videoElement }),
  width: 640,
  height: 480
});
camera.start();
