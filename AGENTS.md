# AGENTS.md — UNCLE DRILL MASTER CONSTITUTION

You are building **Uncle Drill**, a production-grade Mastery Audit & Accountability Engine.
Before planning or writing a single line of code on ANY turn, you MUST read `state.md` (the project Blackboard) and cross-reference the relevant specification inside `docs/`.

## 1. Source-of-Truth Documentation Map
- `docs/00_DOCUMENTATION_INDEX.md`: Master index and precedence rules.
- `docs/01_FOUNDER_VISION.md`: Founder origin story, core thesis, and product manifesto.
- `docs/02_PRD_AND_ROADMAP.md`: Core functional requirements, anti-cheat rules, Grit XP math, and vertical slice roadmap.
- `docs/03_CURRICULUM_RUBRICS.md`: 5-Phase curriculum, Real-World Disaster Stories, 3-Gate deterministic grading pipeline, and rubrics.
- `docs/04_SYSTEM_ARCHITECTURE.md`: Folder structure, `nuqs` URL state rules, PostgreSQL schema, RLS policies, Dual-Ledger memory, and sandbox execution.
- `docs/05_AGENT_PERSONA_SPEC.md`: Dual-Brain AI architecture (Study Room Mentor vs. Drill Room Auditor), `AUTO` Roast Level, Stochastic Move Director, and Groq/Gemini multi-provider router.
- `docs/06_UI_DESIGN_SYSTEM.md`: Industrial Terminal design tokens (Obsidian Dark + Blueprint Paper Light Mode), typography (`Departure Mono`, `Geist Mono`), and anti-slop UI ban list.
- `docs/07_UX_WRITING_AND_VOICE.md`: Official UX Writing Bible, African Uncle speech mechanics, and canonical terminology (**Non-Negotiables**, **Stress-Test Questions**, **Field Manual**, **Uncle's Study Room**).
- `docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md`: Adaptive Desktop vs. Mobile contract (Drills strictly locked on mobile), 5-Stage Drill choreography, 4-Pillar scoring, Voice Notes (Groq Whisper STT + TTS), ₦10,000 Anchor Pricing + Promo Engine, Mint-Grade Certificate, and No-Code Founder Command Room (`/command`).

## 2. Canonical Terminology Override
Whenever older docs (`02`–`05`) mention "Must-Knows" or "May-Knows", ALWAYS use the official terms from `docs/07` and `docs/08` in UI copy and new code:
- **Must-Knows** -> **`Non-Negotiables`**
- **May-Knows** -> **`Stress-Test Questions`**
- **Office Hours / Mentor Chat** -> **`Uncle's Study Room`**

## 3. Mandatory Operating Protocol (Review-Driven Development)
1. **NEVER ONE-SHOT LARGE FEATURES:** Work strictly on the single active sub-task marked `IN_PROGRESS` inside `state.md`.
2. **PLAN FIRST (`/plan-vertical-slice`):** Produce a concise implementation plan listing exact files to create/modify and tests to run. Wait for Founder approval before writing implementation code.
3. **TEST-DRIVEN EXECUTION (`/tdd-build`):** For all business logic (`src/modules/*`), write the failing Vitest/Playwright test first, then write the minimal code to pass it.
4. **ANTI-SLOP GATE (`/visual-ui-audit`):** After touching any `.tsx` or `.css` file, run `bash scripts/check-ui-slop.sh` and verify the route in the browser sub-agent (checking URL state persistence on refresh and Back button navigation).
5. **DOCUMENT & UPDATE BLACKBOARD:** Write senior-level JSDoc comments (`@purpose`, `@security`, `@reference`), log completed slices in `docs/implementation-log/`, keep `README.md` current, and update `state.md`.

## 4. Zero Telemetry Spoilers & Zero Backend Jargon Law
- Student-facing UI must NEVER mention internal terminal telemetry mechanics (NO `Stochastic Move Director`, NO `RING_BUFFER`, NO `watches every command you type`).
- Student-facing UI must NEVER use `princess` or `0% AI`.
- NEVER expose raw promo codes publicly on pricing cards.
- `"use server"` files must ONLY export `async function` declarations (keep Zod schemas/constants in separate files).
- Hide `[ COMMAND ROOM ]` from students on all workspace pages (strictly conditionally render for `role === 'SUPER_ADMIN'` or `4sulymanumar@gmail.com`).