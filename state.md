# UNCLE DRILL — LIVE ENGINEERING BLACKBOARD (`state.md`)

**Current Active Pillar:** `PILLAR_4_STUDY_CHAT_AND_TOKEN_BUDGET` [PENDING]  
**Active Sub-Task:** `PILLAR 3 COMPLETE -> READY FOR PILLAR 4 (Uncle Drill Study Chat & Token Budget)`  
**Last Verified Build Status:** `GREEN (57/57 Tests Passing, check-ui-slop.sh Passing, npm run build 12/12 Routes 0 Errors, Dev Server 200 OK)`

---

## Canonical V1 6-Pillar Roadmap

### [COMPLETED] PILLAR 1: Master Landing Page & Visual Design System
- [x] **1.1:** Scaffold Next.js 15 (App Router, TypeScript), configure Industrial Terminal tokens & Obsidian Dark / Blueprint Light modes.
- [x] **1.2:** Build Industrial UI Primitives (`<StructuralGrid>`, `<GridCell>`, `<HUDHeader>`, `<StatusBadge>`).
- [x] **1.3:** Master Landing Page with Founder 10-Section Blueprint (`src/app/(marketing)/page.tsx`).
- [x] **1.4:** Interactive Roast Level selector (`[ LVL 1 ]`, `[ LVL 2 ]`, `[ LVL 3 ]`), desktop HUD section scrubber, dynamic terminal typing, and verified zero slop.

### [COMPLETED] PILLAR 2: Auth, Onboarding & `/command` Control Room
- [x] **2.1:** Migrations `0001_initial_schema.sql` and `0002_dual_brain_and_command_room.sql` (Tables, Dual-Ledger memory columns, 4-Pillar scoring, RLS policies, atomic quota RPC).
- [x] **2.2:** Build Email + Google/GitHub OAuth authentication flows, URL-synced 3-Question Onboarding (`/onboarding?step=1|2|3`), Next.js Edge Middleware (`supabase.auth.getUser()`), and Adaptive Viewport Guard (`<DesktopDrillGuard />` locking `/drill/*` on viewports `< 1024px` with `⌈ DESKTOP TERMINAL REQUIRED ⌋` HUD).
- [x] **2.3:** Build No-Code Founder Control Room (`/command`) with URL-synced tabs (`overview`, `users`, `codes`, `cms`, `ai`), live switches, and strict Founder/SuperAdmin authorization.
- [x] **2.4:** Permanent UX/Security Guardrails: Role-gated `[ COMMAND ROOM ]` button on `/roadmap`, Zero Telemetry Spoilers Law, automated slop linter checks.

### [COMPLETED] PILLAR 3: Task, Resource, Downloadable PDF Field Manual & Pre-Drill Checklist Hub
- [x] **3.1:** Seed Canonical Phase 1 Milestones (1.1, 1.2, 1.3, 1.4) and Curated Resources in Supabase (`curriculum_public` & `curated_resources`) with embedded fallback seed data (`src/lib/data/curriculum.ts` and `0003_seed_curriculum.sql`).
- [x] **3.2:** Interactive `/roadmap` Workspace displaying all 5 Phases, Milestone status badges, checklist progress (`X/Y Items Ready`), and routes to `/milestone/[milestoneId]` and `/study/[milestoneId]`.
- [x] **3.3:** Dedicated Task, Resource & Checklist Page (`/milestone/[milestoneId]`):
  - Real-World Production Disaster Case & Why It Matters.
  - First-Principles Mental Model & Practice Project + explicit "Explore Beyond" callout.
  - Curated Multi-Modal Resource Vault (`curated_resources`).
  - 1-Click Printable/Downloadable PDF Field Manual (`[ DOWNLOAD FIELD MANUAL (.PDF) ]`) in `#EAE6DF` Blueprint Paper style.
  - Interactive Gatekeeper Checklist (`Basic` -> `Required` -> `Explore Beyond`) with dual-persistence (`localStorage` + Server Action `profiles.learning_dna`).
  - **Hard Gatekeeper Lock:** `[ PROCEED TO DRILL ROOM -> ]` remains locked (`disabled`) until 100% of required checklist items are checked. Once 100% checked, turns Acid Lime (`#D4FF00`) and unlocks navigation to `/drill/[milestoneId]`.

### [PENDING] PILLAR 4: Uncle Drill Study Chat & Token Budget
- [ ] **4.1:** Uncle's Study Room (proactive Socratic mentor on Mobile & Desktop) with Groq/Gemini router and token budget tracker.
- [ ] **4.2:** Dual-Ledger memory integration (`profiles.episodic_memory` & `semantic_memory`).
- [ ] **4.3:** Voice Note input/output support (Groq Whisper STT + TTS).

### [PENDING] PILLAR 5: 5-Stage Desktop Drill Room (`v86` + `xterm.js` + `Monaco`)
- [ ] **5.1:** Desktop-Locked 3-Panel Drill Room (`/drill/[milestoneId]`) with `xterm.js` + `v86` WebAssembly Linux, `Monaco Editor`, Voice Note mic button, and offline `man` page viewer.
- [ ] **5.2:** Stage 0 Pre-Drill Honesty Gate (`terminate_session_early`), Gate 1 & Gate 2 deterministic sandbox execution, and Anti-Cheat strike state machine.
- [ ] **5.3:** Stage 1–4 Uncle Drill Interrogation Engine & 4-Pillar Weighted Grader (`>= 75%` + `100% Non-Negotiables`).

### [PENDING] PILLAR 6: Paystack Billing, Personal Merit Offers & Beta Feedback Loop
- [ ] **6.1:** Idempotent Paystack webhook (`HMAC-SHA512`), ₦10,000 anchor pricing with promo/sponsor engine, and Inngest 48h Ghosting email workflow.
- [ ] **6.2:** Two-stage Apology Letter unban pipeline, Mint-Grade Certificate sharing, and B2B Cohort Sponsor Portal (`/partner`).