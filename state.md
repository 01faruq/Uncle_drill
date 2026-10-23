# UNCLE DRILL — LIVE ENGINEERING BLACKBOARD (`state.md`)

**Current Active Slice:** `SLICE_0_VISUAL_DESIGN_SYSTEM_AND_SHOWCASE`  
**Active Sub-Task:** `0.1 - Initialize Next.js 15 + Fonts + Dual-Theme Tokens + Signature Industrial Primitives`  
**Last Verified Build Status:** `GREEN (Ready for Slice 0 Execution)`

---

## Active Roadmap & Vertical Slice Checklist

### [IN_PROGRESS] SLICE 0: Visual Design System, Dual Theme & Showcase Prototype
- [ ] **0.1:** Scaffold Next.js 15 (App Router, TypeScript), install `nuqs`, `zod`, `@t3-oss/env-nextjs`, `lucide-react`, and configure `Departure Mono`, `Geist Mono`, and `Geist Sans` fonts + Dual-Theme CSS tokens (`OBSIDIAN_DARK` default + `BLUEPRINT_PAPER` light mode toggle) from `docs/06_UI_DESIGN_SYSTEM.md`.
- [ ] **0.2:** Build the 6 Signature Industrial UI Primitives in `src/components/ui/industrial/`:
  - `<StructuralGrid />` & `<GridCell />` (1px `#27272C` / `#BDB7AD` hairline grid)
  - `<HudBracketHeader />` (`⌈ TEXT ⌋` in `#FF9500` / `#F4F4F0`)
  - `<AsciiDivider />` (Waveform `/\_/\_` and dashed terminal dividers)
  - `<DrillButton />` (`acid` `#D4FF00` primary CTA and `terminal` ghost variants, `0px` radius)
  - `<TelemetryLogStream />` (Timestamped `[20:17:21]` live log viewer)
  - `<BottomTelemetryBar />` (Fixed 28px IDE status footer with Theme & God-Mode switcher)
- [ ] **0.3:** Build the 7-Section Public Landing Page (`/`) with live Roast Ticker, interactive 60-second Mini-Drill, "Princess Problem" comparison matrix, 5-Phase syllabus preview, and ₦10,000 Anchor Pricing + Promo Code preview.
- [ ] **0.4:** Create `/design-system` visual verification route + Mint-Grade Sovereign Certificate preview (`/verify/demo`) + write `docs/implementation-log/SLICE_0_IMPLEMENTATION.md` and update `README.md`.

### [PENDING] SLICE 1: Auth, Database Schema (0001 + 0002), RLS & No-Code Founder Command Room (`/command`)
- [ ] **1.1:** Apply migrations `0001_initial_schema.sql` and `0002_dual_brain_and_command_room.sql` (Tables, Dual-Ledger memory columns, 4-Pillar scoring, RLS policies, atomic quota RPC).
- [ ] **1.2:** Build Email + GitHub OAuth authentication flows and Adaptive Viewport Guard (locking `/drill/*` on mobile `< 1024px` with `⌈ DESKTOP TERMINAL REQUIRED ⌋` HUD while routing mobile users to Study Room & Field Manuals).
- [ ] **1.3:** Build the No-Code Founder Command Room (`/command`) for managing `platform_settings` (pricing, promo/sponsor/god-mode codes, user access overrides, AI model router switchboard, and Apology Letter approvals).

### [PENDING] SLICE 2: The 5-Phase Roadmap, Downloadable Field Manuals & Uncle's Study Room
- [ ] **2.1:** Seed `curriculum_public`, `curated_resources`, and `audit_rubrics_private` with Phase 1 full rubrics (`Non-Negotiables` & `Stress-Test Questions`) and Phases 2–5 roadmap metadata.
- [ ] **2.2:** Build `/roadmap` with `nuqs` URL-synced Phase tabs, Milestone Grid, downloadable **Field Manual & Pre-Flight Checklist** (`.md`/PDF), and Hybrid Commitment Contract modal.
- [ ] **2.3:** Build **Uncle's Study Room** (proactive Socratic mentor chat on Mobile & Desktop powered by Groq/Gemini, Dual-Ledger memory extraction, and Voice Note input/output).

### [PENDING] SLICE 3: The 3-Panel Drill Room (`v86` + `xterm.js` + `Monaco`) & Anti-Cheat Buffer
- [ ] **3.1:** Build the Desktop-Locked 3-Panel Drill Room (`/drill/[milestoneId]`) with `xterm.js` + `v86` Wasm Linux, `Monaco Editor`, Voice Note mic button, and offline `man` page viewer.
- [ ] **3.2:** Implement the `<5KB` Telemetry Ring-Buffer, Tab-Switch/Paste strike state machine, and 120s 3G network-drop grace pause (`IndexedDB` persistence).

### [PENDING] SLICE 4: The 5-Stage Drill Auditor Brain & 4-Pillar Grader
- [ ] **4.1:** Build Stage 0 Pre-Drill Honesty Gate (`terminate_session_early`) + Gate 1 & Gate 2 deterministic sandbox runner (`--network=none`) + `forgive_minor_syntax_slip` tool.
- [ ] **4.2:** Build Stage 1–4 Uncle Drill Harness (`AUTO` Roast Heat calculator, Stochastic Move Director, 4-Pillar Weighted Grader `>= 75%` + `100% Non-Negotiables`, and `pgvector` recall).

### [PENDING] SLICE 5: Paystack Billing, Proactive 48h Email Nudges, B2B Portal & Certificate Share Engine
- [ ] **5.1:** Build idempotent Paystack webhook (`HMAC-SHA512`), 90%/99% Promo Code checkout, and `Inngest` 48-hour "Downloaded Manual But Ghosted" email workflow.
- [ ] **5.2:** Build B2B Sponsor Portal (`/partner`), 2-stage Apology Letter unban pipeline, and 1-Click LinkedIn/X Certificate Share Engine.