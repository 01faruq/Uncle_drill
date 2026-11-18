# UNCLE DRILL // MASTERY AUDIT & ACCOUNTABILITY ENGINE

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  UNCLE DRILL // REPO SPECIFICATION & ARCHITECTURAL MANIFESTO                           │
│  "You can lie to the world, but you cannot lie to Uncle Drill."                        │
│  AI-Native Technical Mastery Audit, Proctored Linux Sandbox & Proof-of-Work Engine    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

[![Next.js](https://img.shields.io/badge/Next.js-15.2.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2016-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Tests-57%2F57%20Passing-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)
[![UI Slop Free](https://img.shields.io/badge/UI%20Aesthetic-Industrial%20Terminal%20(0px)-D4FF00?style=flat-square)](docs/06_UI_DESIGN_SYSTEM.md)
[![License](https://img.shields.io/badge/License-MIT-white?style=flat-square)](LICENSE)

---

## 1. Executive Summary & Core Philosophy

**Uncle Drill** is an unapologetic, high-rigor technical auditing engine designed to verify true sovereign competence in backend and distributed systems engineering. 

The industry is saturated with surface-level tutorials, multiple-choice quizzes, and synthetic certificates that reward passive video consumption. When production fails at 03:00 AM under an out-of-memory crash, unhandled connection pool exhaustion, or cascading distributed deadlocks, syntax memorization is useless.

Uncle Drill replaces passive learning with **active, proctored confrontation**:
- **Dual-Brain Architecture**: Separates the supportive Socratic mentor (**Uncle's Study Room**) from the unyielding, deterministic examiner (**The Drill Room**).
- **First-Principles Preparation**: Grounded in historical real-world production disasters, rigorous mental models, downloadable blueprint field manuals, and gatekeeper checklists.
- **Proctored Hands-On Audits**: Code and systems changes run inside sandboxed environments with multi-stage technical interrogation and deterministic test execution.
- **Zero-Compromise Verification**: Mint-grade, cryptographic proof-of-work certificates issued only upon achieving verifiable mastery.

---

## 2. System Architecture: The Dual-Brain Model

Uncle Drill splits pedagogical and auditing responsibilities across two decoupled sub-systems:

```
                                 ┌─────────────────────────────────┐
                                 │       STUDENT ACCESS POINT      │
                                 └────────────────┬────────────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 ▼                                                                 ▼
   ┌───────────────────────────┐                                     ┌───────────────────────────┐
   │    UNCLE'S STUDY ROOM     │                                     │      THE DRILL ROOM       │
   │       (MENTOR BRAIN)      │                                     │      (AUDITOR BRAIN)      │
   ├───────────────────────────┤                                     ├───────────────────────────┤
   │ • Available: Mobile & Web │                                     │ • Restricted: Desktop Only│
   │ • Tone: Tough-Love Uncle  │                                     │ • Tone: Cold & Exacting   │
   │ • Socratic Guidance       │                                     │ • Deterministic Gate Tests│
   │ • Production Disasters    │                                     │ • Real Linux Terminal     │
   │ • Downloadable Manuals    │                                     │ • Multi-Stage Defense     │
   │ • Gatekeeper Checklists   │                                     │ • 4-Pillar Scoring        │
   └─────────────┬─────────────┘                                     └─────────────┬─────────────┘
                 │                                                                 │
                 └────────────────────────────────┬────────────────────────────────┘
                                                  │
                                 ┌────────────────┴────────────────┐
                                 │   SUPABASE LEDGER & AUDIT DB    │
                                 │  - Row-Level Security (RLS)     │
                                 │  - Atomic Quota Deductions      │
                                 │  - Episodic & Semantic Memory   │
                                 └─────────────────────────────────┘
```

### Pillar A: Uncle's Study Room (Mentor Brain)
- Accessible on both mobile and desktop viewports.
- Provides deep conceptual scaffolding, Socratic questioning, and multi-modal curated references.
- Features real-world production incident post-mortems (e.g., Cloudflare 2019 regex CPU exhaustion, Knight Capital dead-code deployment).
- Generates 1-click printable/downloadable Blueprint Paper (`#EAE6DF`) Field Manuals for offline study.
- Enforces an interactive **Pre-Drill Gatekeeper Checklist**: students cannot enter a proctored drill until 100% of non-negotiable prerequisites are checked.

### Pillar B: The Drill Room (Auditor Brain)
- Strictly locked to desktop viewports (`>= 1024px`) via hardware-aware layout guards (`<DesktopDrillGuard />`).
- Direct terminal workspace embedding simulated Linux environments and code editor panes.
- Multi-gate deterministic grading pipeline: objective compilation/test gates execute prior to AI evaluation.
- Multi-stage technical interrogation evaluating code architecture, memory bounds, and failure modes.
- Four-Pillar composite scoring:
  1. **Working Implementation** (Objective test suite execution)
  2. **Non-Negotiables** (Zero edge-case misses on critical production invariants)
  3. **Technical Defense** (Response accuracy under oral grilling)
  4. **Code Quality & Idiomatic Design** (Clean, bounded, production-grade code)

---

## 3. The 5-Phase Backend Curriculum

Every milestone within Uncle Drill targets real-world production competence:

| Phase | Title | Core Focus Areas | Non-Negotiables Covered |
| :--- | :--- | :--- | :--- |
| **01** | **Linux & OS Internals** | Terminal survival, signals, process management, file descriptors, virtual memory & OOM killer. | POSIX process hierarchy, exit codes, zombie cleanup, file descriptor limits. |
| **02** | **Relational Databases & Concurrency** | ACID invariants, isolation levels, MVCC, row-level locking, deadlock avoidance, composite indexing. | Explicit transaction boundaries, `FOR UPDATE` semantics, index selectivity. |
| **03** | **High-Throughput Networking** | TCP/IP three-way handshakes, socket lifecycle, HTTP/1.1 vs HTTP/2 multiplexing, backpressure. | Connection pooling limits, socket timeouts, TLS termination, keep-alive overhead. |
| **04** | **Distributed Systems & Consensus** | Raft consensus, idempotency keys, outbox pattern, distributed transactions, 2PC vs Saga. | Deduplication stores, at-least-once delivery handling, partition tolerance. |
| **05** | **Production Incident Triage** | Live incident mitigation, eBPF telemetry, flamegraphs, memory profiling, blameless post-mortems. | Mean time to recovery (MTTR), zero-downtime rollback, graceful degradation. |

---

## 4. Industrial Terminal Design System

Uncle Drill rejects generic SaaS aesthetic tropes (no pill buttons, no heavy blur cards, no floating pastel gradients). The interface adheres to an **Industrial Mainframe & Precision Instrument** standard:

- **Strict 0px Geometry**: Every button, input, badge, modal, and structural grid cell enforces `rounded-none` (`0px border-radius`).
- **Exposed Structural Hairlines**: Layouts are composed using `<StructuralGrid>` and `<GridCell>` with deliberate `1px solid var(--border-grid)` borders.
- **Dual Visual Modes**:
  - `Obsidian Dark (#060607)`: High-contrast terminal workspace engineered for deep operational focus.
  - `Blueprint Paper (#EAE6DF)`: Physical engineering dossier style used for printable Field Manuals and public credential verification.
- **Von Restorff Signal Colors**:
  - `Acid Lime (#D4FF00)`: Primary action, active readiness, and unlocked gate indicators.
  - `Phosphor Green (#00FF66)`: Passed milestones, live telemetry, and healthy services.
  - `HUD Amber (#FF9500)`: Warnings, in-progress audits, and non-blocking advisories.
  - `Crimson Fault (#FF2E2E)`: Critical test failures, anti-cheat strikes, and syntax errors.
- **Monospace Typography Hierarchy**:
  - `Departure Mono`: Phase titles, index numerals (`01`, `02`), and HUD headers (`⌈ HEADER ⌋`).
  - `Geist Mono`: Interactive controls, timestamps, telemetry streams, and terminal logs.
  - `Geist Sans`: Reserved exclusively for long-form reading passages inside disaster case studies.

---

## 5. Technology Stack

### Frontend & Application Layer
- **Framework**: Next.js 15 (App Router, React 19, Server Components & Server Actions)
- **Language**: TypeScript 5.7 (Strict mode, zero `any` tolerance)
- **Styling**: Tailwind CSS 3.4 with custom CSS custom property tokens
- **URL State**: `nuqs` (Type-safe, query-string synchronization ensuring browser Back/Forward/Refresh resilience)
- **Animation**: Motion (Declarative hardware-accelerated transitions with zero layout bounce)
- **Icons**: Lucide React (Rendered with precise hairlines and strict square boundaries)

### Backend & Database Layer
- **Database**: Supabase PostgreSQL 16
- **Security & Authorization**: Row-Level Security (RLS) on all public tables with scalar `(SELECT auth.uid())` subqueries
- **Atomic Operations**: PostgreSQL Stored Procedures (`RPC`) with `SELECT ... FOR UPDATE` locking to prevent TOCTOU race conditions during attempt deductions
- **Environment Validation**: `@t3-oss/env-nextjs` and `Zod` (Runtime and build-time schema enforcement)

### Quality Assurance & Anti-Slop Enforcement
- **Unit & Component Testing**: Vitest 3.0 + React Testing Library + JSDOM
- **Design System Linter**: Custom bash audit (`scripts/check-ui-slop.sh`) validating zero rounded corners, zero gradients, zero unapproved utility classes, and zero telemetry spoiler strings.

---

## 6. Repository Layout & Deep Module Architecture

The codebase enforces strict boundaries: domain logic is isolated inside `src/modules/*`, while `src/app/*` remains a thin routing and UI layer.

```text
uncle-drill/
├── .agents/                      # AI pair-programming rules & automated workflow skills
├── docs/                         # Source-of-truth specifications & architecture logs
│   ├── 00_DOCUMENTATION_INDEX.md # Master precedence rules
│   ├── 01_FOUNDER_VISION.md      # Manifesto & thesis
│   ├── 02_PRD_AND_ROADMAP.md     # Functional specs & 6-pillar delivery
│   ├── 03_CURRICULUM_RUBRICS.md  # 5-Phase curriculum & 3-gate grading rules
│   ├── 04_SYSTEM_ARCHITECTURE.md # SQL schema, RLS policies & network topology
│   ├── 05_AGENT_PERSONA_SPEC.md  # AI auditor specification & prompt harness
│   ├── 06_UI_DESIGN_SYSTEM.md    # Industrial terminal design tokens
│   ├── 07_UX_WRITING_AND_VOICE.md# Canonical terminology & copy voice guide
│   ├── 08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md # Mobile vs desktop contract & scoring
│   └── implementation-log/       # Educational step-by-step logs of completed slices
├── public/                       # Static assets, sound effects & fonts
├── scripts/
│   └── check-ui-slop.sh          # Automated anti-slop & banned jargon linter
├── src/
│   ├── env.ts                    # Build-time secret validation
│   ├── middleware.ts             # Supabase SSR session validation & route guards
│   ├── app/                      # Next.js App Router (Thin layout & URL binding layer)
│   │   ├── (marketing)/          # Landing page with interactive roast preview & syllabus
│   │   ├── (auth)/               # Login, signup & 3-step onboarding flow
│   │   ├── (workspace)/          # /roadmap, /milestone/[id], /study/[id], /drill/[id]
│   │   ├── (super-admin)/        # /command Founder control room
│   │   ├── design-system/        # Visual component catalog & design token testbed
│   │   └── verify/[certId]/      # Sovereign proof-of-work certificate verification
│   ├── components/               # Reusable UI primitives & feature components
│   │   ├── brand/                # Uncle Drill avatar and brand badges
│   │   ├── command/              # Control Room tabs (Overview, Users, Codes, CMS, AI)
│   │   ├── drill-room/           # Desktop viewport lock guards
│   │   ├── marketing/            # Landing page sections, scrubber, and calculators
│   │   ├── milestone/            # Gatekeeper checklists & printable PDF actions
│   │   └── ui/industrial/        # <StructuralGrid>, <GridCell>, <HUDHeader>, <StatusBadge>
│   ├── lib/
│   │   ├── data/                 # Canonical curriculum milestones and curated resources
│   │   └── supabase/             # Browser, server, and administrative Supabase clients
│   └── modules/                  # Deep Domain Modules (Pure business logic & RPC mutations)
│       ├── access-control/       # Quota checks & atomic session reservation
│       ├── admin/                # Founder command room server actions & metrics
│       ├── auth/                 # Onboarding actions, schemas & profile mutations
│       └── curriculum/           # Milestone queries, checklist math & persistence
├── supabase/
│   └── migrations/               # PostgreSQL migrations (Tables, RLS, functions, seed data)
├── tests/
│   └── unit/                     # Vitest test suites (Pillar 1, 2, 3 verification)
├── AGENTS.md                     # Antigravity master constitution
├── state.md                      # Live project blackboard & current build status
└── package.json                  # Dependencies, build scripts & test configurations
```

---

## 7. Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v20.0.0` or higher (Node 22 recommended)
- **npm**: `v10.0.0` or higher
- **Supabase Account**: A free Supabase project or local Supabase CLI installation

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/01faruq/Uncle_drill.git
   cd Uncle_drill
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment template and configure your local or hosted Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

   | Variable | Required | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL (`https://xyz.supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public Supabase anon key safe for client-side queries |
   | `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service-role secret key (Server-side actions only) |
   | `FOUNDER_ADMIN_EMAIL` | Yes | Email that auto-receives `SUPER_ADMIN` privileges upon signup |
   | `NEXT_PUBLIC_APP_URL` | No | Base application URL (Defaults to `http://localhost:3000`) |
   | `NODE_ENV` | No | `development` \| `test` \| `production` |

4. **Apply Database Migrations:**
   Execute migrations in chronological order within your Supabase SQL Editor or via Supabase CLI:
   - `supabase/migrations/0001_initial_schema.sql` (Core tables, enums, RLS policies, atomic quota RPC)
   - `supabase/migrations/0002_dual_brain_and_command_room.sql` (Founder CMS, promo engine, episodic memory)
   - `supabase/migrations/0003_seed_curriculum.sql` (Phase 1 seed data & curated multi-modal vault)

5. **Run the Automated Anti-Slop Linter:**
   ```bash
   npm run check-slop
   ```

6. **Execute the Test Suite:**
   ```bash
   npm run test
   ```

7. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. Verified Core Routes

| Route | Role / Audience | Description |
| :--- | :--- | :--- |
| `/` | Public | Master Landing Manifesto with interactive roast selector, syllabus preview, and cost calculator. |
| `/design-system` | Developers / QA | Interactive visual showcase of all Industrial Terminal primitives and color tokens. |
| `/login` & `/signup` | Public / Students | Supabase authentication with email/password and OAuth providers. |
| `/onboarding` | Authenticated | URL-synced 3-question profile calibration (`/onboarding?step=1\|2\|3`). |
| `/roadmap` | Authenticated | 5-Phase workspace displaying milestone statuses and checklist completion counters. |
| `/milestone/[id]` | Authenticated | Incident post-mortem, mental model, curated vault, downloadable PDF manual, and hard gatekeeper lock. |
| `/study/[id]` | Authenticated | Uncle's Study Room (Mentor Brain) for conceptual grilling and Socratic preparation. |
| `/drill/[id]` | Authenticated (Desktop) | The Drill Room (Auditor Brain) with hardware guard locking mobile viewports. |
| `/command` | Super Admin Only | No-code Founder Command Room (`overview`, `users`, `codes`, `cms`, `ai` controls). |
| `/verify/[certId]` | Public | Cryptographically verified Sovereign Proof-of-Work dossier rendered in Blueprint Paper style. |

---

## 9. Current Roadmap & Implementation Status

Progress is tracked continuously on the live Blackboard ([state.md](state.md)):

```text
[x] PILLAR 1: Master Landing Page & Visual Design System         (COMPLETED)
[x] PILLAR 2: Auth, Onboarding & /command Control Room           (COMPLETED)
[x] PILLAR 3: Field Manuals, Pre-Drill Hub & Gatekeeper Locks    (COMPLETED)
[ ] PILLAR 4: Uncle Drill Study Chat, Memory & Token Budget      (IN PROGRESS)
[ ] PILLAR 5: 5-Stage Desktop Drill Room (v86 + xterm.js)        (SCHEDULED)
[ ] PILLAR 6: Paystack Billing, Personal Offers & Verifications  (SCHEDULED)
```

---

## 10. Engineering Laws & Contribution Standards

All pull requests and code modifications must uphold the following standards:

1. **Zero UI Slop Rule**: Never introduce `rounded-md`/`lg`/`xl`, gradients, blurred backgrounds, purple/indigo palettes, or scale transforms. Run `npm run check-slop` before every commit.
2. **Zero Telemetry Spoilers Law**: Student-facing UI and messages must never leak internal terminal telemetry mechanics, scoring buffer names, or unapproved backend jargon.
3. **URL-Driven State Invariant**: Navigation states, active tabs, filters, and phase selections must be synchronized to URL parameters via `nuqs`. Clicking the browser Back button or refreshing the page must preserve the exact view.
4. **Deep Module Boundaries**: Application pages (`src/app/**`) are thin presentation boundaries. All database queries, mutations, and domain logic must reside inside `src/modules/**`.
5. **Architectural JSDoc Headers**: All modules and server actions must document their purpose using `@purpose`, `@security`, and `@reference` annotations.

---

## 11. Security & Responsible Disclosure

Uncle Drill enforces defense-in-depth:
- PostgreSQL Row-Level Security isolates student data and attempts.
- Service-role privileges are restricted exclusively to backend modules and server-side execution.
- Student code submissions, terminal buffers, and prompt inputs are sanitized and quarantined within XML isolation tags prior to model evaluation.

To report security vulnerabilities, contact the core team directly at `4sulymanumar@gmail.com`.

---

## 12. License

Distributed under the MIT License. See [LICENSE](LICENSE) for full details.

```text
UNCLE DRILL // PROVE YOUR MASTERY OR STAND DOWN.
```
