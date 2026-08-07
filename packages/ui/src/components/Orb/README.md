# Project HELIOS — ULTRON Orb Engine

The **Orb Engine** (Codename: Project HELIOS) is the central visual state engine for Project ULTRON. It provides high-performance (60 FPS) visual feedback across 10 distinct operational states without direct coupling to backend or AI logic.

---

## 🏛️ Architecture & Philosophy

The Orb Engine strictly separates the **State Engine** from the **React View Layer**:

```
OrbEngine.ts (Pure TypeScript, No React)
    ↓ transition({ state, duration, source })
Orb.tsx (React View Layer & Mouse Parallax)
    ↓
Layer Components (OrbCore, OrbGlow, OrbRing, OrbParticles)
```

No module or subsystem should manipulate Framer Motion animations directly. Subsystems interact exclusively via the `OrbEngine` controller.

---

## 🔄 Supported Visual States (10 States)

| State | Visual Behavior | Primary Accent |
|-------|-----------------|----------------|
| `idle` | Slow breathing, soft cyan glow, gentle floating | `#00D9FF` (Cyan) |
| `wake` | Outer ring expansion, bright energy pulse | `#00F0FF` (Bright Cyan) |
| `thinking` | Rotating ring, calm purple intelligent glow | `#7A5CFF` (Purple) |
| `listening` | Gentle rhythmic aura pulse | `#10B981` (Emerald) |
| `speaking` | Dynamic outward ripple waves | `#38BDF8` (Sky Blue) |
| `executing` | Fast ring rotation, high glow intensity | `#00E5FF` (Laser Cyan) |
| `researching` | Orbiting particle field, purple accent | `#8B5CF6` (Violet) |
| `memory` | Inward energy flow, cyan + purple gradient blend | `#00D9FF` / `#7A5CFF` |
| `offline` | Dim muted grey, minimal movement | `#64748B` (Muted) |
| `error` | Red soft vibration pulse, zero harsh flashing | `#EF4444` (Red) |

---

## 💻 Public API & Controller Usage

### 1. Creating an Engine Instance (Factory Pattern)
```ts
import { createOrbEngine } from '@ultron/ui';

// Create a standalone engine instance
const orb = createOrbEngine('idle');

// Transition states using future-proof options
orb.transition({
  state: 'thinking',
  duration: 300,
  source: 'brain',
});

// Shortcut string state transitions
orb.transition('executing');

// Subscribe to state transitions
const unsubscribe = orb.subscribe((current, previous) => {
  console.log(`Orb transitioned from ${previous.state} to ${current.state}`);
});
```

### 2. Rendering in React
```tsx
import { Orb, createOrbEngine } from '@ultron/ui';
import { useMemo } from 'react';

export function CompanionView() {
  const orb = useMemo(() => createOrbEngine('idle'), []);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Orb engine={orb} size="lg" />
    </div>
  );
}
```

---

## 🚀 Future Integration Strategy

The Orb Engine serves as the unified visual target for all future ULTRON subsystems:

```
Subsystem Modules              Target Visual State
------------------              -------------------
Brain Subsystem       ------->  'thinking'
Voice Subsystem       ------->  'speaking'
Vision Subsystem      ------->  'wake'
Memory Subsystem      ------->  'memory'
Automation Engine     ------->  'executing'
Research Engine       ------->  'researching'
System Diagnostics    ------->  'offline' / 'error'
```

---

## ♿ Accessibility & Performance

- **`prefers-reduced-motion`**: Automatically disables floating animations, 3D tilt, and mouse parallax when enabled on the OS level, keeping only minimal opacity transitions.
- **Mouse Parallax**: Smooth spring-based tracking capped strictly at **16px max translation** and **6° max 3D tilt**.
- **Conditional Rendering**: `OrbParticles` unmounts in non-particle states (`researching` and `memory` only) to maintain **60 FPS** performance.
