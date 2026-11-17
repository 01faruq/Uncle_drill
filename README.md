# UNCLE DRILL // MASTERY AUDIT & ACCOUNTABILITY ENGINE

> **"You can lie to the world, but you cannot lie to Uncle Drill."**  
> An AI-native technical mastery audit, proctored Linux sandbox, and sovereign talent verification engine.

---

## 1. Quick Start & Local Development

### Prerequisites
- Node.js `v22+`
- npm `10+`

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Run unit test suite (Vitest)
npm run test

# 3. Verify zero AI UI slop (strictly enforces 0px radius, zero gradients/blurs)
bash scripts/check-ui-slop.sh

# 4. Start local development server
npm run dev
```

Visit the core routes:
- **Landing Manifesto:** `http://localhost:3000/`
- **Design System Showcase:** `http://localhost:3000/design-system`
- **Sovereign Certificate Demo:** `http://localhost:3000/verify/demo`

---

## 2. Core Architecture & Design Tokens

Uncle Drill enforces an **Industrial Minimalist Terminal** aesthetic:
- **Obsidian Dark Mode (`#060607`):** Deep terminal atmosphere for deep debugging.
- **Off-Grid Bone Paper Mode (`#EAE6DF`):** High-status physical blueprint styling for certificates and public proof-of-work dossiers.
- **Von Restorff Signal Colors:** Acid Terminal Lime (`#D4FF00`), Phosphor Green (`#00FF66`), HUD Amber (`#FF9500`), Crimson Fault (`#FF2E2E`).
- **Zero Rounded Corners:** All buttons, panels, inputs, and modals strictly use `rounded-none` (`0px`).
- **Deterministic URL State:** Powered by `nuqs` so browser Back/Forward and refresh never break UI state.

---

## 3. Active Roadmap Status

Track current progress and active slices on the live Blackboard: [state.md](file:///home/abu-hafs/Desktop/Uncle_drill/state.md).

- [x] **SLICE 0:** Visual Design System, Dual Theme & Showcase Prototype
- [ ] **SLICE 1:** Auth, Supabase RLS Schema, Quota RPC & Founder Command Room (`/command`)
- [ ] **SLICE 2:** 5-Phase Roadmap, Downloadable Field Manuals & Uncle's Study Room
- [ ] **SLICE 3:** 3-Panel Drill Room (`v86` + `xterm.js` + `Monaco`) & Anti-Cheat Telemetry
- [ ] **SLICE 4:** 5-Stage Drill Auditor Brain & 4-Pillar Weighted Grader
- [ ] **SLICE 5:** Paystack Billing, Proactive 48h Email Nudges & Certificate Share Engine
