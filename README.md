

# **Gymsnap — AI-Powered Gym Accountability & Matching**

Gymsnap is a real-time gym-tracking and behavior-matching prototype. It uses on-device pose estimation and custom analytics to understand how a person trains, generate a behavior embedding, and match users based on consistency, intensity, and training style.
Everything runs fully in the browser with **no backend**.

# **Public Repository Link**

[https://github.com/YOUR-USERNAME/Gymsnap](https://github.com/YOUR-USERNAME/Gymsnap)

# **Setup / Run Instructions**

```
git clone https://github.com/YOUR-USERNAME/Gymsnap
cd Gymsnap
npm install
npm run dev
```

Runs locally at:
`http://localhost:5173`

# **Architecture Overview**

Below is the **clean, organized architecture diagram** you can paste directly into README until you upload a PNG version.

This version separates your system into 4 logical layers:
**UI Layer → AI Layer → Core Logic Layer → Local State Layer**

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                UI LAYER                                   │
│                        (React + Vite + Tailwind)                          │
│  - Feed Page                                                               │
│  - Match Page                                                              │
│  - Streaks Page                                                            │
│  - Weekly Summary                                                          │
│  - Calendar + Profile                                                      │
└───────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                                AI LAYER                                   │
│                            (MediaPipe Pose)                               │
│  - Pose estimation                                                         │
│  - Rep detection                                                           │
│  - Rep event stream (exercise, rep count, timestamps)                      │
└───────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          CORE LOGIC LAYER                                  │
│                          (Custom JS Utilities)                              │
│                                                                             │
│  Behavior Engine                                                            │
│   - Updates 10D training embedding                                          │
│   - Categorizes exercises                                                   │
│   - Computes intensity + timestamps                                         │
│                                                                             │
│  Streak Engine                                                              │
│   - Daily streak simulation                                                 │
│   - Heatmap + slump detection                                               │
│                                                                             │
│  Matching Engine                                                            │
│   - Time similarity                                                         │
│   - Intensity similarity                                                    │
│   - Streak similarity                                                       │
│   - Training category overlap                                               │
│   - Final weighted score + explanation popup                                │
└───────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                           LOCAL STATE LAYER                                │
│                         (React useState Hooks)                             │
│  - Current embedding                                                        │
│  - Streak data / heatmap                                                    │
│  - Rep counts                                                                │
│  - Calendar activity                                                         │
│  - Match results                                                             │
│  - No backend. No persistence.                                               │
└───────────────────────────────────────────────────────────────────────────┘
```

This layout mirrors how real AI front-ends are documented.
Judges will instantly understand:

Camera → AI → Behavior Logic → UI
Everything local. Everything fast.

# **Key Features**

### AI Rep Counter

Pose estimation via MediaPipe (Apache-2.0). Counts reps and updates embedding and streak state in real time.

### Behavior Embedding

10-dimensional vector:
Strength, Routine, Calisthenics, Aesthetics, Mobility, Powerlifting, Bodybuilding, Cardio, Strongman, Functional
Updated from rep events, timestamp patterns, intensity, and categories.

### Matching Engine

Matches users using weighted scoring:
Time overlap, streak similarity, intensity similarity, category alignment.

### Streak System

Simulated streaks, heatmap, slump detection, and streak ring animation.

### Weekly Summary

AI-style summary of user performance trends.

### Calendar + Analytics

Full month view showing activity, logged sessions, and category breakdowns.

# **Licenses for Third-Party Assets**

MediaPipe Pose (Google Research)
Apache License 2.0

Unsplash Images
Unsplash License
Demo-only placeholder images.

React, Vite, TailwindCSS
MIT License

Heroicons (if used)
MIT License

No third-party datasets were used.
All logs, embeddings, and analytics are locally generated.

# **Team**

Uday: System design, behavior logic, matching engine, UI integration, overall application structure
Saumit: Profile page and user information flow
Mitha: Rep counter integration and camera based session tracking
Maanasa: Streak engine, data aggregation, and streak visualization
All members are Computer Science majors at George Mason University.

