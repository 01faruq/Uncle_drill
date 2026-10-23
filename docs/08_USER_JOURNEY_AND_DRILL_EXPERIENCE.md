# 08: USER JOURNEY, STUDY ROOM CHAT, DRILL ENGINE & ADMIN CONTROL — UNCLE DRILL

**Version:** 1.0 (Production Experience Specification)

---

## 1. Dual-Brain Architecture: "Uncle's Study Room" vs. "The Drill Room"

Uncle Drill operates as two distinct specialized agents sharing the same **Dual-Ledger Memory (`unverified_claims` vs. `verified_competence`)**:

### Brain 1: The Study Room Agent (Proactive Mentor & Resource Curator)
* **How It Differs from ChatGPT:**
  1. **Uncle Controls the Thread:** When a user opens the Study Room for Milestone 1.1, Uncle Drill doesn't wait passively. He opens with: *"Alright {{first_name}}, you have the Milestone 1.1 Field Manual. Look at item #1 on your Pre-Flight Checklist (`stdin`, `stdout`, `stderr`). Explain to me what you understand about it so far, or tell me what confused you in the MIT lecture."*
  2. **Socratic Extraction & Personalization:** Uncle Drill asks probing questions to discover *how* the user thinks, what analogies click for them, and what background they have—saving only high-value behavioral insights into `learning_dna`.
  3. **Grounded Resource Recommendations (Zero Hallucination):** When a student struggles with a topic, Uncle Drill queries our curated `resource_vault` and live web search to recommend the exact page of a book, official doc section, interactive simulator (`LearnGitBranching`, `OverTheWire`), or micro-project that fits their learning style.
  4. **Hard Guardrail:** Only answers questions related to software engineering, computer science, career mastery, and the active curriculum. Off-topic distractions trigger a sharp warning or `lock_study_chat(15_minutes)`.

### Brain 2: The Drill Room Agent (Autonomous Technical Auditor)
Equipped with autonomous function-calling tools (`terminate_session_early`, `forgive_minor_syntax_slip`, `inject_sandbox_mutation`, `score_rubric_pillar`) so it acts with real human judgment rather than rigid regex stupidity.

---

## 2. The 5-Stage Drill Room Choreography & Scoring Rubric

When a student clicks **`[ DRILL ME -> ]`**, the session runs through 5 progressive stages:

### Stage 0: The Pre-Drill Gatekeeper (No Wasted Time)
* Before the 25-minute sandbox timer even starts, Uncle Drill presents the **3 Core Prerequisites** for the milestone and asks:
  * *"Before we lock this screen, {{first_name}}: have you built `log_analyzer.sh`, do you understand `set -euo pipefail`, and can you redirect `stderr` without guessing? Be honest with me."*
* **Autonomous Early Exit:**
  * If the student admits *"No, I haven't finished it yet"*, Uncle Drill invokes `terminate_session_early(refund_attempt: true)` and says: *"At least you didn't lie to me. I'm not deducting your drill attempt today. Go finish the Pre-Flight Checklist and come back when you are ready."*
  * If the student is disrespectful, trolling, or spamming nonsense, Uncle Drill invokes `terminate_session_early(refund_attempt: false)`—ending the session immediately and burning 1 attempt.
  * If the student says *"Yes, I know it"*, Uncle Drill logs their claim and says: *"Good. You said it with your chest. Now prove it."*

### Stage 1: First-Principles Warmup (Voice Note or Text — 25% of Score)
* Uncle Drill asks 2 conceptual questions starting simple and moving to first principles.
* **Voice Note Support:** The student can hold **`[ 🎙️ HOLD TO SPEAK TO UNCLE ]`** (transcribed in `<300ms` via Groq `whisper-large-v3-turbo`) or type their explanation, and listen to Uncle Drill's audio response.

### Stage 2: Live Production — Write It From Scratch (30% of Score)
* Uncle Drill gives a clear specification in the `xterm.js` Linux terminal or `Monaco` VS Code editor. The student must write the command pipeline or function live while Uncle Drill watches their telemetry buffer.
* **Smart Typo Tolerance (Human Judgment Over Dumb Autograders):**
  * If a student writes valid logic showing 100% conceptual mastery but makes a minor typo (e.g., a misspelled filename or missing trailing newline), Uncle Drill does **not** fail them like a dumb grader. He nudges them: *"Your pipeline logic is solid, bro, but check how you spelled `/tmp/audit_err.log` on line 3."*

### Stage 3: Live Debugging — Fix the Broken Artifact (25% of Score)
* Uncle Drill drops a broken script or mutates a file in the sandbox and says: *"A junior dev pushed this code and broke production. Find the bug and fix it without rewriting the whole file."*

### Stage 4: Stress-Test & Edge Cases — The Pro Way (20% of Score)
* Uncle Drill challenges their working code with a **Stress-Test Question**: *"Your script works for a 100-line file. What happens when the log file is 50GB and doesn't fit in RAM? How does a senior engineer change line 8?"*

### Passing Threshold & Grading Formula
$$\text{Final Drill Score} = 0.25(\text{Explain}) + 0.30(\text{Produce}) + 0.25(\text{Debug}) + 0.20(\text{Stress-Test})$$
* **To Pass the Milestone:**
  1. Must score **100% on all `Non-Negotiables`** (zero fundamental blind spots).
  2. Must achieve a **Total Weighted Score $\ge 75 / 100$**.

---

## 3. Pricing Psychology, Promo Engine & Payment Architecture

To establish high perceived value while keeping access affordable for students and fellowships:

* **Official Anchor Price:** **₦10,000 / month** (Displayed publicly as the standard price for full Drill Room + Study Room + Sandbox access).
* **The Promo & Scholarship Code Strategy:**
  * You distribute targeted promo codes (e.g., `BUILD90` for **90% off $\rightarrow$ ₦1,000/mo**, or `FELLOW99` for **99% off $\rightarrow$ ₦100/mo**, or `VIP100` for **100% Free**).
  * Seeing a **₦10,000** platform unlocked for **₦1,000** via an exclusive code creates massive urgency and gratitude, preventing users from taking the platform for granted.
* **Free Trial Funnel (Zero Credit Card Required to Taste):**
  * Every new signup gets **Milestone 1.1 Downloadable Field Manual + 3 Days of Uncle's Study Room Chat + 1 Milestone 1.1 Drill Attempt 100% Free**.
* **Local + Global Payment Rails (Paystack):**
  * Supports Nigerian **Bank Transfer (Pay with Transfer)**, **USSD**, **Verve/Mastercard/Visa Cards**, and Apple Pay so students without international cards can pay in 15 seconds.

---

## 4. The Mint-Grade Sovereign Certificate (What Makes It Worth ₦10,000)

Located at `uncledrill.com/verify/[certId]` and exportable as high-DPI PDF & 1-Click LinkedIn/X Graphic:
1. **Triple Authority Signatures:**
   * **Founder & Chief Architect Signature** (Your signature).
   * **Uncle Drill Cryptographic Audit Seal** (Digital SHA-256 signature hash + embossed Metallic Gold/Acid-Lime Guilloché Badge).
   * **Sponsoring Institution Co-Sign (Optional for B2B):** e.g., *Co-Verified for Learn2Earn Cohort 01*.
2. **Verified Proof-of-Work Scorecard:** Shows exact scores across the 4 Pillars (`Explain: 92% | Produce: 95% | Debug: 88% | Stress-Test: 85%`), GitHub repository commit link, and `00 Cheat Strikes`.
3. **1-Click Viral Share Engine:**
   * `[ ADD TO LINKEDIN CERTIFICATIONS ]` (Pre-fills credential name, issuing organization, issue date, and verification URL automatically).
   * `[ SHARE PROOF ON X (TWITTER) ]` (Generates a custom preview card with Uncle Drill's reluctant endorsement quote).

---

## 5. The No-Code Founder Command Room (`/command`)

To ensure you never have to edit code or redeploy just to run your business, the **Founder Command Room** reads and writes to a live `platform_settings` table in Supabase, giving you point-and-click UI controls over:

1. **Access & Granular User Control:**
   * Search any user $\rightarrow$ Manually unlock specific Phases or Milestones for them, grant bonus drill attempts, reset their cooldown timer, toggle `god_mode`, or ban/unban their account.
2. **Dynamic Pricing & Promo Code Generator:**
   * Change the base subscription price (e.g., ₦10,000), certificate price, and create unlimited Promo/Sponsor codes (`% off`, fixed Naira discount, max redemptions, expiration date, specific allowed milestones).
3. **Curriculum & Resource Manager (CMS):**
   * Edit Milestone Field Manuals, swap broken documentation links, add new book/blog recommendations to Uncle Drill's `resource_vault`, or toggle a Milestone between `LIVE` and `COMING_SOON` directly from a form.
4. **AI Brain & Cost Control Switchboard:**
   * Switch Study Room or Drill Room models between **Gemini 2.5 Flash**, **Gemini 2.5 Pro**, and **Groq (`Llama-3.3-70B`)**, adjust daily turn limits, and monitor real-time token spend per user.
5. **Growth, Data Analytics & Roast Exporter:**
   * View conversion funnel stats, milestone drop-off heatmaps, and 1-click export anonymized hilarious Uncle Drill terminal interactions as branded images for your X/Twitter marketing.