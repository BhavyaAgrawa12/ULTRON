# Project HELIOS V2 — ULTRON Orb Visual Redesign

The **Orb Engine** (Codename: Project HELIOS V2) is the primary visual brand identity and visual state engine of Project ULTRON.

---

## 🏛️ Multi-Layer Visual Architecture

```
OrbGlow (Ambient Background Bloom)
    ↓
OrbParticles (Selective Particles: 'researching' & 'memory' only)
    ↓
OrbHalo (Radial Energy Halo Ring)
    ↓
OrbRing (Dual Counter-Rotating Rings)
    ↓
OrbCore (Multi-Stop Gradient Sphere & Specular Lens Highlight)
```

No subsystem manipulates Framer Motion animations directly. Subsystems interact exclusively via `OrbEngine.ts`.

---

## 📐 Dimensions & Interaction Limits

- **Default Scale**: `lg` = 160px (140px – 180px centerpiece range).
- **Mouse Parallax Translation**: Max **10px**.
- **Mouse 3D Tilt**: Max **4°**.
- **Accessibility**: Disables floating, parallax, and 3D tilt when `prefers-reduced-motion` is active.

---

## 🔄 Supported Visual States (10 States)

| State | Visual Behavior | Primary Accent |
|-------|-----------------|----------------|
| `idle` | Slow breathing (1 to 1.04), soft cyan ambient bloom | `#00D9FF` (Cyan) |
| `wake` | Under 1s sequence: Expansion (1.2) ➔ Ring acceleration ➔ Energy pulse | `#00F0FF` (Bright Cyan) |
| `thinking` | Rotating ring, calm purple intelligent glow | `#7A5CFF` (Purple) |
| `listening` | Gentle rhythmic pulse (breathing while paying attention) | `#10B981` (Emerald) |
| `speaking` | Wave propagation from center | `#38BDF8` (Sky Blue) |
| `executing` | Faster ring rotation, high glow intensity | `#00E5FF` (Laser Cyan) |
| `researching` | Orbiting particle field, violet accent | `#8B5CF6` (Violet) |
| `memory` | Inward energy flow, cyan + purple gradient blend | `#00D9FF` / `#7A5CFF` |
| `offline` | Dim muted grey, minimal movement | `#64748B` (Muted) |
| `error` | Red soft vibration pulse, zero harsh flashing | `#EF4444` (Red) |

---

## 💻 Public API & Controller Usage

```ts
import { createOrbEngine, Orb } from '@ultron/ui';

// 1. Create a pure TS OrbEngine instance (Dependency Injection factory)
const orb = createOrbEngine('idle');

// 2. Future-Proof Transition API
orb.transition({
  state: 'thinking',
  duration: 300,
  source: 'brain',
});

// 3. Render in React
<Orb engine={orb} size="lg" />
```

---

## 🚀 Future Integration Strategy

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
