# @ultron/vision — ULTRON Computer Vision & Spatial Hand Tracking Package

The `@ultron/vision` workspace package provides the foundational architecture, spatial hand tracking pipelines, camera device managers, and event abstractions for Project ULTRON.

---

## 🏛️ Purpose & Scope

`@ultron/vision` acts as the spatial perception layer of Project ULTRON. It abstracts hardware video capture, spatial 3D landmark smoothing, hand tracking loops, and spatial gesture detection without coupling to specific UI rendered components or AI routing logic.

---

## 📁 Package Architecture & Folder Structure

```
packages/vision/
├── src/
│   ├── camera/
│   │   ├── CameraManager.ts    # Device enumeration & stream initialization
│   │   ├── CameraDevice.ts     # Individual camera hardware device abstraction
│   │   └── index.ts
│   │
│   ├── tracking/
│   │   ├── HandTracker.ts      # 3D spatial hand landmark detection pipeline
│   │   ├── LandmarkSmoother.ts # 1-Euro / EMA temporal noise filter
│   │   ├── TrackingLoop.ts     # Frame processing loop orchestrator
│   │   └── index.ts
│   │
│   ├── events/
│   │   ├── EventBus.ts         # Strongly-typed vision event emitter
│   │   ├── VisionEvents.ts     # Event payload type definitions
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── CameraTypes.ts      # Camera metadata & frame types
│   │   ├── VisionTypes.ts      # Engine status & tracking mode types
│   │   ├── HandLandmark.ts     # 3D spatial landmark & handedness structures
│   │   └── index.ts
│   │
│   ├── VisionEngine.ts         # Main orchestrator engine factory
│   └── index.ts                # Package barrel export
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧩 Planned Sub-Modules

1. **`camera`**: Manages WebCam hardware stream enumeration, resolution selection, and video stream lifecycle.
2. **`tracking`**: Runs high-performance MediaPipe spatial 3D hand tracking and landmark smoothing filters.
3. **`events`**: Broadcasts strongly-typed vision events (`landmarksUpdated`, `cameraStatusChange`) across the application event bus.
4. **`VisionEngine`**: Orchestrates vision pipeline initialization, tracking state transitions, and frame processing.

---

## 🚀 Future Integration Strategy

The `@ultron/vision` package is designed for seamless integration with other ULTRON subsystems:

```
@ultron/vision
    │
    ├──> Orb Engine (@ultron/ui)     : Triggers 'wake' visual state upon hand detection
    ├──> Voice System (@ultron/voice)   : Coordinates multimodal spatial + voice triggers
    ├──> Memory Engine (@ultron/memory) : Records spatial interaction history & preferences
    └──> Automation (@ultron/automation): Triggers spatial gesture macro execution
```

---

## 🛑 Phase 1 Compliance

Phase 1 provides pure TypeScript package architecture, interfaces, type definitions, and placeholder contracts. No camera hardware streams (`getUserMedia`), MediaPipe models, or gesture detection algorithms are active.
