# 02: PRODUCT REQUIREMENTS DOCUMENT (PRD) & PRODUCTION ROADMAP — UNCLE DRILL

**Version:** 2.0 (Production-Hardened Specification)  
**Owner:** Founder & Chief Architect  
**Target Environments:** Consumer Web (B2C) + Institutional Cohort Portal (B2B: Learn2Earn, 3MTT, Bootcamps)

---

## 1. Product Purpose & Core Loop
Uncle Drill is an AI-native **Mastery Audit & Accountability Engine**. It separates *learning* (which happens asynchronously using curated primary sources, books, official docs, and personal tools) from *verification* (which happens inside a locked, proctored, telemetry-monitored simulation led by an uncompromising AI persona: **Uncle Drill**).

### The Core User Loop
1. **Commit:** User signs a **Hybrid Commitment Contract** (selecting their weekly study pace; Uncle Drill assigns strict available drill windows).
2. **Study Externally:** User unlocks a Milestone brief containing the **Mental Model**, **Real-World Industry Use Case** (how companies like Paystack, Cloudflare, or Uber use this concept), **Primary Sources**, and a **Practical Project Spec**.
3. **Enter the Drill Room ("Drill Me"):** User enters a locked environment (Browser Linux Terminal + Monaco Editor + Built-in `man`/Docs).
4. **Practical + Theoretical Audit:**
   * **Stage A (Practical Execution):** Uncle Drill issues a live task or mutates the student's code/environment. Deterministic scripts + telemetry track every command, error, and `man` lookup.
   * **Stage B (Socratic Defense):** Uncle Drill interrogates the user with randomized, personalized conceptual questions (`Must-Knows` to pass; `May-Knows` to humble and stretch).
5. **Verdict & Progression:**
   * **Pass (`Must-Knows` = 100%):** Earn Dynamic Grit XP, unlock next Milestone, and record weaknesses from `May-Knows` into Episodic Learner Memory.
   * **Fail (`Must-Knows` < 100%):** Burn 1 Drill Attempt, receive a specific study prescription, and enforce a mandatory **Cooling-Off Study Timer** (minimum 4 hours) before retrying so users cannot brute-force guess.

---

## 2. Functional Requirements & Edge-Case Specifications

### FR-01: Progressive Onboarding & "Skip-Ahead" Verification
* **Beginner Flow:** Starts at Phase 1, Milestone 1.1. No GitHub account is required until Milestone 1.2 (Git Internals). All Milestone 1.1 drills happen inside the in-browser WebAssembly Linux terminal (`v86` + `xterm.js`).
* **Intermediate / Pro "Skip-Ahead" Flow:** Experienced users can select a higher target milestone, but **cannot bypass verification**. They must click **"Drill Me"** on each prerequisite milestone and pass its practical sandbox task + theoretical defense (no GitHub project push required for bypassed beginner milestones; evaluated 100% on live sandbox performance and oral/chat defense).
* **Anti-Syllabus Gaming (Dynamic Mutation):** Because the curriculum roadmap is free and public, students may pre-prepare answers before subscribing. To defeat pre-memorization:
  * Every drill pulls from a **Parameterized Question & Task Generator** (e.g., changing log formats, exit code requirements, file permissions, or variable mutations dynamically per session).
  * Uncle Drill asks follow-up questions based on the user's *live terminal history* during that exact session.

### FR-02: The Hybrid Commitment Contract & Accountability Engine
* **User Input:** During onboarding (and at the start of each Phase), the user selects their weekly commitment tier (e.g., *Standard: 8 hrs/week* or *Intensive: 15 hrs/week*).
* **Uncle Drill Scheduling:** The system generates fixed **Drill Windows** (specific days/time slots when Uncle Drill is "in the office").
* **Late & Missed Drill Penalties:**
  * **T-Minus 2 Hours:** Automated Email (V1 via `Resend`) / WhatsApp nudge (V2 via `Termii`).
  * **Missed Window (No Excuse):** Streak multiplier resets to `1.0x`, user loses Grit XP, and the next drill session starts with a **Penalty Rapid-Fire Question** before the normal drill begins.
  * **Emergency Excuse Flow:** Users get **1 Emergency Reschedule Token per month** (must be requested *before* the window closes, or validated via Uncle Drill's excuse-screening prompt).

### FR-03: The Drill Room & Telemetry Capture Engine
* **Workspace Layout (URL-Synced via `nuqs`):**
  * **Left Panel (30%):** Uncle Drill Chat + Roast Level Indicator + Remaining Attempt/Timer Header.
  * **Center Panel (45%):** `xterm.js` Linux Terminal and/or `Monaco` Code Editor.
  * **Right Panel (25%):** Offline-accessible `man` pages and official documentation snippets for the active milestone.
* **Zero-Cost Telemetry Buffer:**
  * The client captures a rolling ring-buffer of events: `command_executed`, `exit_code`, `time_to_first_command`, `man_page_opened`, `backspace_burst_rate` (detecting typing vs. pasting), `tab_blur_duration_ms`, and `code_diff_snapshot`.
  * Telemetry is sent to the server as a compressed `<5KB` JSON payload only when (a) a task checkpoint completes, (b) the user messages Uncle Drill, or (c) the session ends.

### FR-04: Anti-Cheat Escalation & The Apology Unban Workflow
* **Monitored Vectors:**
  1. `document.visibilityState === 'hidden'` or `window.onblur` lasting $> 4$ seconds (while `navigator.onLine === true`).
  2. External clipboard paste events (`onPaste`) exceeding 30 characters without matching prior internal `onCopy` events.
  3. DevTools inspection / DOM tampering attempts on the timer state.
* **Network-Drop Protection (False-Positive Guard):** If `navigator.onLine` turns `false`, the server pauses the session clock for up to **120 seconds** and does **not** record a tab-switch strike while the user reconnects their mobile hotspot/ISP.
* **The 3-Strike Escalation Ladder:**
  * **Strike 1 (Warning):** Toast alert + Uncle Drill calls out the tab switch in chat (*"Keep your eyes on your own terminal, [Name]. Look away again and we are done."*).
  * **Strike 2 (Session Termination):** Immediate drill failure, 1 Drill Attempt deducted, session locked for 12 hours.
  * **Strike 3 across 2 Drills (Account Suspension):** Account status set to `SUSPENDED_CHEATING`. All drill access locked.
* **Two-Stage Redemption Flow (The Apology Letter):**
  1. **Mandatory Cooling-Off:** User cannot submit an appeal until **48 hours** after suspension.
  2. **Stage 1 (Uncle Drill AI Screening):** User must write a minimum 150-word explanation of *what* they did, *why* they tried to bypass the system, and their commitment moving forward. Uncle Drill checks for AI-generated fluff or copy-pasted text. If fake or defensive, Uncle Drill rejects it immediately and adds 24 hours.
  3. **Stage 2 (Super Admin Approval):** Once Uncle Drill marks the letter `AI_SCREENED_GENUINE`, it appears in the **Main Admin Dashboard** queue for manual 1-click approval/rejection by the Founder (or Cohort Admin).
  4. **Repeat Offender Rule:** A second account suspension after an approved apology results in a **Permanent Account Ban** (`BANNED_PERMANENT`) and revocation of sponsorship eligibility.

### FR-05: Dynamic Grit XP & Anti-Gaming League Leaderboards
* **Why Standard XP Fails:** Rewarding raw completion lets experienced developers farm beginner levels; rewarding raw failure count lets gamers intentionally fail twice to farm "struggle points."
* **The Uncle Drill Grit XP Formula:**
  $$\text{Drill XP} = (\text{Base Milestone Value}) \times (\text{Consistency Multiplier}) + (\text{Process Mastery Bonus}) + (\text{May-Know Stretch Bonus})$$
  * **Consistency Multiplier (`1.0x` to `2.0x`):** Increases by `+0.1x` for every consecutive on-time Drill Window met. Resets to `1.0x` on a missed deadline.
  * **Process Mastery Bonus:** Awarded deterministically when telemetry proves the user opened relevant `man`/official docs after hitting a non-zero exit code and resolved the error cleanly on their own.
  * **Zero XP for Failed Drills:** Failing gives `0 XP` (preventing failure farming), while passing *after* a prior failed attempt awards a one-time **Redemption Bonus** (`+15%`) only if the user spent at least 30 minutes in the documentation/practice sandbox between attempts.
* **Tiered Leagues:** Users are grouped into separate weekly/monthly leaderboards by Phase (**Phase 1 League**, **Phase 2 League**, **Phase 3+ League**). Users who skip Phase 1 are placed directly into the Phase 2+ League so true beginners never compete against experienced devs on the Phase 1 board.

### FR-06: Verified Peer-to-Peer Auditing ("Audit the Auditor") & Mentorship (V2)
* **Eligibility:** A user can only apply for an **Auditor Badge** or **Volunteer Mentor Badge** for Phase $N$ after passing **Phase $N+1$** with zero active cheat strikes.
* **Structured Rubric Enforcement:** Peer auditors are given a strict binary checklist during a 15-minute live or async audit.
* **The Spot-Check Trap:** After a Peer Auditor marks a student as "Passed", Uncle Drill immediately triggers an automated **3-Minute Spot-Check Question** on one specific rubric item the Auditor claimed the student mastered.
  * If the student passes the spot-check $\rightarrow$ Student advances; Auditor earns **Auditor XP & Reputation**.
  * If the student fails the spot-check $\rightarrow$ Student's pass is voided; the **Auditor immediately loses their Auditor Badge**, loses 500 XP, and is barred from auditing until they pass a recertification drill.

### FR-07: Monetization, Quotas, Sponsorships & God-Mode Codes
* **Free Tier:** Full access to the 5-Phase Roadmap, Mental Models, Resource links, and **Milestone 1.1's first practice drill (1 free attempt)** so every user experiences Uncle Drill's scolding firsthand before hitting a paywall.
* **B2C Subscription (~₦1,000 / month):**
  * Grants **8 Official Drill Attempts per month** + **15 AI Chat Turns per drill** (keeps worst-case Gemini 2.5 Flash token cost under **₦65/month per user**, guaranteeing an **85%+ gross margin** even after Paystack fees).
  * **Fail Retake Top-Up:** Users who burn all 8 attempts due to unpreparedness can purchase a **3-Attempt Retake Pack (₦500)**—making laziness financially painful while protecting platform unit economics.
* **Merit-Gated Sponsorship Engine:**
  * The *"Apply for Sponsorship"* button is locked until a user passes Milestone 1.1 on time with 0 cheat strikes.
  * Sponsored seats are funded by the platform pool or B2B partners. **Auto-Revocation Rule:** An `Inngest` cron job checks sponsored accounts daily; 7 days of inactivity automatically revokes the sponsorship seat and assigns it to the #1 user on the Merit Waitlist.
* **Unified Access & Promo Code Engine (`access_codes` table):**
  * Supports 4 code types out of the box:
    1. `DISCOUNT_PERCENT` (e.g., 50% or 70% off certificates: ₦10k $\rightarrow$ ₦5k or ₦3k).
    2. `COHORT_SPONSOR` (e.g., `L2E-FELLOW-2026` — grants 100% free access and links the user to the Learn2Earn B2B Admin Dashboard).
    3. `VIP_GOD_MODE` (For Investors like Iyin & QA Testers — bypasses all paywalls, unlocks all Phases/Milestones simultaneously, disables cooldown timers, and displays a "Tester Switcher Bar" at the top of the screen to jump between Beginner, Intermediate, and B2B Admin views in one click).

### FR-08: Help Desk, Bug Reporting & Continuous Feedback Loop
* **Persistent Workspace Widget:** Every screen includes a low-friction **"Report Issue / Feedback"** drawer that automatically attaches the current URL state (`?phase=1&milestone=1.2`), browser metadata, and last 5 terminal/console error logs so you never have to ask a beta tester *"What page were you on when it broke?"*

---

## 3. Non-Functional Requirements (Production Quality Bars)

1. **Performance & Low-Bandwidth Resilience:**
   * Initial page load $< 1.5\text{s}$ on 4G; $< 3.0\text{s}$ on Nigerian 3G networks.
   * WebAssembly Linux image (`v86`) cached in browser `CacheStorage` / `IndexedDB` after first load so subsequent drills boot in $< 800\text{ms}$.
2. **Security & Anti-Tampering:**
   * 100% of database tables protected by Supabase Row-Level Security (RLS).
   * Zero rubric answers or hidden test assertions ever sent to the browser client.
   * All AI outputs constrained via strict JSON Schema (`Zod`) and sanitized against XSS before rendering.
3. **Observability & Zero-Slop UX:**
   * Browser Back/Forward buttons must work deterministically across 100% of application states via `nuqs`.
   * Every async button ("Drill Me", "Submit Code", "Verify Payment") must implement optimistic disabled states and skeleton loaders to prevent double-submissions.

---

## 4. The Canonical V1 6-Pillar Production Roadmap

We build and ship Uncle Drill in **6 self-contained, battle-tested vertical pillars**:

* **Pillar 1: Master Landing Page & Visual Design System [DONE]**
  - Industrial Terminal tokens (Obsidian Dark + Blueprint Light), signature primitives (`<StructuralGrid>`, `<GridCell>`), 10-section blueprint, interactive Roast Level selector, and responsive HUD scrubber.
* **Pillar 2: Auth, Onboarding & `/command` Control Room [DONE]**
  - Supabase Auth (Email + Google/GitHub OAuth), 3-Question Onboarding flow, Next.js Edge Middleware (`supabase.auth.getUser()`), Desktop-only Guard for Drills, and Founder Command Room (`/command`) with live platform switches.
* **Pillar 3: Task, Resource, Downloadable PDF Field Manual & Pre-Drill Checklist Hub [ACTIVE]**
  - Canonical Phase 1–5 Milestone curriculum seeding, interactive `/roadmap` workspace, dedicated `/milestone/[milestoneId]` Hub with Real-World Disasters, First-Principles Mental Models, Curated Resources, 1-Click Printable/Downloadable PDF Field Manual, and Gatekeeper Checklist locking `/drill/[milestoneId]` until 100% prepared.
* **Pillar 4: Uncle Drill Study Chat & Token Budget [PENDING]**
  - Uncle's Study Room (proactive Socratic mentor on Mobile & Desktop), Dual-Brain Groq/Gemini router, Dual-Ledger memory recall, and Voice Notes (STT/TTS).
* **Pillar 5: 5-Stage Desktop Drill Room [PENDING]**
  - Desktop-locked 3-Panel Drill Room (`xterm.js` + `v86` Wasm Linux + `Monaco`), Stage 0 Honesty Gate, Stage 1–4 Uncle Drill interrogation, and 4-Pillar scoring (`>= 75%` + `100% Non-Negotiables`).
* **Pillar 6: Paystack Billing, Personal Merit Offers & Beta Feedback Loop [PENDING]**
  - Idempotent Paystack webhook (`HMAC-SHA512`), ₦10,000 anchor pricing with promo codes, 48h Ghosting email nudges (`Inngest`), Apology Letter redemption, and Mint-Grade Certificate sharing.

---

## 5. Zero Telemetry Spoilers & Zero Backend Jargon Law

To maintain the mystique, authority, and realism of Uncle Drill:
1. **No Internal Telemetry Spoilers:** Student-facing UI copy must NEVER expose internal architecture (NO `"Stochastic Move Director"`, NO `"RING_BUFFER"`, NO `"watches every command you type"`). Use authentic Uncle Drill narrative framing (e.g. `"Uncle Drill is waiting for your defense."`, `"SANDBOX: v86_LINUX_ISOLATED"`).
2. **No Banned Buzzwords or Slop:** Student-facing UI must NEVER use `"princess"`, `"0% AI"`, or unescaped HTML entities like `&GT;`.
3. **No Public Promo Leaks:** NEVER expose raw secret promo codes publicly on marketing pricing cards.
4. **Clean Server Actions:** `"use server"` files must ONLY export `async function` declarations (all Zod schemas and constants must live in separate files).
5. **Role-Gated Command Room:** The `[ COMMAND ROOM ]` link is strictly hidden from non-admin learners on `/roadmap` and all workspace headers.