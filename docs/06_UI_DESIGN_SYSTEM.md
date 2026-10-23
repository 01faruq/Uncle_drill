
```markdown
# 06: UI DESIGN SYSTEM & ANTI-SLOP UX SPECIFICATION — UNCLE DRILL

**Aesthetic Direction:** Modern Minimalist Terminal, Swiss Hairline Grid & Precision HUD  
**Visual Benchmarks:** Daytona CLI, Deep Scrape Grid, Kessler HUD, Effect Institute, Off Grid (Object 08), Taoscan Terminal.  
**Core UX Law:** Every pixel must look like an engineered instrument—never a template.

---

## 1. The 5 Design Principles (And How We Break Standard Rules)

1. **Exposed Structural Honesty (No Floating Cards):**
   We never use floating cards with drop shadows (`box-shadow`) or blurry glass (`backdrop-filter`). Layout regions are separated by visible `1px solid` structural hairlines (`#1F1F22`) that span edge-to-edge across the container, creating an architectural grid.
2. **Scale Shock Hierarchy (Micro-Labels vs. Bitmap Display):**
   Eliminate muddy middle-sized headings. Pair tiny, high-tracking `11px` uppercase monospace system labels (`letter-spacing: 0.12em`) directly against oversized `36px–64px` `Departure Mono` pixel display titles and index numbers (`01`, `02`, `03`).
3. **95% Monochrome + 5% Signal Color (Von Restorff Isolation):**
   The workspace is 95% Obsidian Black (`#060607`), Carbon Surface (`#0C0C0E`), Ash Grey (`#71717A`), and Bone White (`#F4F4F0`). Color is never decorative; it is strictly a **system state signal**:
   * **Acid Terminal Lime (`#D4FF00`):** Primary CTA (`[ DRILL ME ]`) and active focus indicator.
   * **Phosphor Emerald (`#00FF66`):** Deterministic Gate Passed / `stdout` / Active Connection.
   * **HUD Amber (`#FF9500`):** Uncle Drill Skeptical Squint / Strike 1 Warning / `⌈ TARGET BRACKETS ⌋`.
   * **Crimson Fault (`#FF2E2E`):** Gate Failed / `stderr` / Strike 2 Lockout / Account Suspended.
4. **Dual-Atmosphere Polarity (Dark Workspace vs. "Bone Paper" Dossier):**
   * **90% of Platform (Roadmap, Drill Room, Terminal, Admin):** Runs in **Obsidian Terminal Mode (`#060607`)** to eliminate eye strain and anchor the developer environment.
   * **10% High-Status Artifacts (Verified Stage Certificates, Public Proof-of-Work Dossiers, & Printable Audit Reports):** Renders in **"Off-Grid Bone Paper" Mode (`#EAE6DF` background with `#0A0A0B` ink, dotted technical hairlines, pixel metrics, and verifiable cryptographic barcodes)**—making an Uncle Drill certificate look like an iconic physical engineering blueprint on X/LinkedIn.
5. **Tactile Mechanical Feedback (Zero Bouncy Animations):**
   Animations never bounce, spring, or float. Transitions are crisp (`100ms–150ms steps(4)` or `cubic-bezier(0.16, 1, 0.3, 1)`), with blinking block cursors (`█`), ASCII scan progress bars (`[████████░░] 80%`), and instant keyboard shortcuts (`ALT+↵`).

---

## 2. Color Tokens (`src/app/globals.css`)

```css
:root {
  /* Primary Atmosphere: Obsidian Terminal (Default) */
  --bg-canvas: #060607;          /* Pure deep terminal void */
  --bg-surface: #0C0C0E;         /* Grid cell & panel background */
  --bg-elevated: #121216;        /* Hover state & active input surface */
  --bg-highlight: #1A1A20;       /* Selected file / active row */

  /* Structural Hairlines (1px solid) */
  --border-subtle: #1A1A1E;      /* Internal table/log row dividers */
  --border-grid: #27272C;        /* Exposed 1px structural cell borders */
  --border-focus: #F4F4F0;       /* Active panel / focused input border */

  /* Typography Ink */
  --text-primary: #F4F4F0;       /* Crisp warm bone white */
  --text-secondary: #A1A1AA;     /* Muted technical prose */
  --text-muted: #52525B;         /* Timestamps, line numbers, locked items */
  --text-inverse: #060607;       /* Text inside Acid Lime or White primary buttons */

  /* Semantic Signal Accents (Strictly Functional) */
  --signal-cta: #D4FF00;         /* Acid Lime: [ DRILL ME ] & Primary CTAs */
  --signal-pass: #00FF66;        /* Phosphor Green: Gate Passed / stdout / Online */
  --signal-warn: #FF9500;        /* HUD Amber: ⌈ WARNING ⌋ / Strike 1 / Cooldown */
  --signal-fault: #FF2E2E;       /* Terminal Red: [ERROR] / stderr / Cheating Ban */
  --signal-info: #00E5FF;        /* Voxel Cyan: May-Know Stretch Bonus / Process XP */

  /* Secondary Atmosphere: "Off-Grid Bone Paper" (For Certificates & Public Dossiers) */
  --paper-canvas: #EAE6DF;
  --paper-surface: #E2DDD4;
  --paper-ink: #0A0A0B;
  --paper-border: #BDB7AD;

  /* Geometry Lock */
  --radius-none: 0px;            /* Default for all grid cells, cards, buttons, inputs */
  --radius-pill: 9999px;         /* Allowed ONLY for inline terminal prompt pills */
}

```

---

## 3. Typography Stack & Hierarchy Scale

Loaded via `next/font/local` and `next/font/google`:

* **`--font-display` (`Departure Mono`):** Open-source monospaced pixel/bitmap typeface. Used exclusively for:
* Hero & Phase Titles (`PHASE 01 // LINUX & GIT`)
* Oversized Milestone Index Numbers (`01`, `02`, `03`, `04`)
* Live Countdown Clock & Grit XP Counter (`1,420 XP`)
* HUD Bracket Headers (`⌈ DRILL SESSION ACTIVE ⌋`)


* **`--font-mono` (`Geist Mono`):** High-legibility technical monospace. Used for:
* Navigation bars, buttons, table rows, timestamps (`[20:18:46]`), badges, `xterm.js` terminal, `Monaco` code editor, and Uncle Drill chat messages.


* **`--font-sans` (`Geist Sans`):** Clean neo-grotesque sans-serif. Used strictly for:
* Multi-paragraph reading inside Mental Models, Real-World Disaster Stories, and Official Documentation panels (`max-width: 65ch`, `line-height: 1.65`).



| Token Name | Font Family | Size / Line-Height | Tracking / Case | Usage |
| --- | --- | --- | --- | --- |
| `display-xl` | `Departure Mono` | `48px / 1.05` | `-0.02em` / `UPPERCASE` | Landing Hero, Certificate Header, Phase Banner |
| `display-index` | `Departure Mono` | `36px / 1.0` | `0em` / `NUMERIC` | Milestone Card Index (`01`, `02`, `03`) |
| `heading-hud` | `Departure Mono` | `18px / 1.2` | `0.05em` / `UPPERCASE` | Section Titles (`⌈ MILESTONE 1.1: UBUNTU SURVIVAL ⌋`) |
| `mono-body` | `Geist Mono` | `13.5px / 1.55` | `0em` / `Sentence` | Uncle Drill Chat Messages, Terminal Logs, Diff Explanations |
| `mono-label` | `Geist Mono` | `11px / 1.2` | `0.12em` / `UPPERCASE` | Grid Cell Headers (`PARAMETERS`, `SEARCH LOG`, `STATUS: DONE`) |
| `prose-read` | `Geist Sans` | `15px / 1.65` | `-0.01em` / `Sentence` | Mental Model & Disaster Story long-form reading |

---

## 4. Signature UI Micro-Components (What Makes It Look Agency-Built)

Every screen in Uncle Drill is assembled from these 6 bespoke industrial components (`src/components/ui/industrial/`):

### 1. `<StructuralGrid />` & `<GridCell />` (Exposed Hairline Architecture)

* Uses CSS Grid with `gap: 1px` over a `var(--border-grid)` background so every panel shares crisp, continuous `1px` borders without double-border thickness bugs.
* Optional subtle background dot-matrix pattern (`radial-gradient(#27272C 1px, transparent 1px)` with `background-size: 16px 16px`) for hero and empty-state regions.

### 2. `<HudBracketHeader />` (Kessler-Style Corner Brackets)

* Renders high-priority status callouts inside unicode or SVG targeting brackets:
* Example: `⌈ DAILY DRILL WINDOW: 20:00 UTC ⌋` or `⌈ GATE 02 // LIVE MUTATION ⌋` in `var(--signal-warn)` (`#FF9500`).



### 3. `<AsciiDivider />` (Deep Scrape & Daytona Terminal Dividers)

* Replaces boring `<hr>` tags with programmatic terminal dividers:
* Waveform bar: `DEEP SCRAPE /\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_`
* Dashed rule: `------------------------------------------------------------`



### 4. `<DrillButton />` (High-Contrast Rectangular Triggers)

* **Primary CTA (`variant="acid"`):** Solid `#D4FF00` background, `#060607` bold `Geist Mono` uppercase text, `0px` border-radius, right arrow glyph `[ DRILL ME -> ]`. On hover: inverts to `#F4F4F0` with a `1px` inset border.
* **Secondary Ghost (`variant="terminal"`):** `#0C0C0E` background, `1px solid #27272C` border, `#F4F4F0` text (`> VIEW MAN PAGE`).

### 5. `<TelemetryLogStream />` (Timestamped Live Feedback)

* Formats system events and Gate 1 deterministic checks like a real mission log:
* `[20:17:21] ERROR: set -euo pipefail MISSING IN LINE 1..5` (in `#FF2E2E`)
* `[20:17:43] >> GATE 1: CHECKING STDERR REDIRECTION (fd 2)...` (in `#A1A1AA`)
* `[20:17:44] >> VERIFIED: EXIT CODE 1 CONFIRMED [PASS]` (in `#00FF66`)



### 6. `<BottomTelemetryBar />` (Persistent IDE Footer)

* A fixed `28px`-tall bottom status bar across the workspace displaying:
* Left: `[● ONLINE: 3G GRACE READY]` | `SANDBOX: v86_WASM_LINUX` | `STRIKES: 0/2`
* Right: `ROAST: LEVEL 02 (STRICT UNCLE)` | `QUOTA: 7/8 DRILLS LEFT` | `QUICK ACTIONS [ALT+↵]`



---

## 5. Core Screen Blueprints

### Screen A: The Landing & Manifesto Screen

* **Top Hairline Bar:** Brand mark `[ UNCLE_DRILL // v1.0 ]` on left; live ticker in center (`"82% OF VIBE CODERS FAILED MILESTONE 1.1 FIRST ATTEMPT — DO YOU ACTUALLY KNOW YOUR FUNDAMENTALS?"`); `[ GITHUB SIGN IN ]` cell on right.
* **Split Hero Grid:**
* **Left Cell (60%):** Giant `Departure Mono` headline: `YOU CAN LIE TO THE WORLD. NOT TO THIS TERMINAL.` Below it, the core thesis paragraph and two sharp buttons: solid acid-lime `[ ENTER THE DRILL ROOM -> ]` and bordered `[ INSPECT 5-PHASE ROADMAP ]`.
* **Right Cell (40%):** Live interactive preview of Uncle Drill roasting a real terminal mistake in real time, framed inside an ASCII/HUD terminal window.



### Screen B: The 5-Phase Roadmap & Milestone Grid (`/roadmap`)

* Inspired directly by the **Deep Scrape** 4-column card grid and archive table:
* **Top Bar:** Phase selector tabs (`PHASE 01 [LIVE]`, `PHASE 02 [LOCKED]`, `PHASE 03 [LOCKED]...`) + Active Commitment Contract timer (`⌈ NEXT DRILL WINDOW: THU 20:00 ⌋`).
* **Milestone Grid:** Each Milestone card (`1.1`, `1.2`, `1.3`, `1.4`) is a sharp `1px`-bordered cell displaying the giant `Departure Mono` number (`01`, `02`), title, `MUST-KNOWS: 3`, status tag (`DONE` in green, `IN PROGRESS` with bottom progress bar, or `LOCKED` with padlock icon).
* **Expanded Milestone Drawer:** Opens the **Real-World Disaster Story**, **Mental Model**, **Primary Resource Table** (`[MIT]`, `[MAN]`, `[BOOK]`), and the bottom action bar with `[ DRILL ME -> ]`.



### Screen C: The 3-Panel Drill Room (`/drill/[milestoneId]`)

* Zero wasted padding (`100vh` locked viewport above the `28px` `<BottomTelemetryBar />`):
* **Left Column (28% — Uncle Drill Command & Telemetry):**
* Top sub-cell: Uncle Drill status header (`[ UNCLE DRILL // WATCHING TERMINAL ]`) + Dynamic expression badge (`⌈ SKEPTICAL SQUINT ⌋`) + Remaining AI Turns (`12/15`).
* Middle sub-cell: Conversation stream in `Geist Mono` (`13.5px`), with Uncle's messages prefixed by `UNCLE >` and student replies below.
* Bottom sub-cell: Command-style chat input (`REPLY TO UNCLE... [ENTER]`).


* **Center Column (47% — Execution Sandbox):**
* Top tab strip (`TERMINAL (bash)`, `EDITOR (log_analyzer.sh)`, `GATE CHECKS [2/3]`) with an acid-lime `2px` underline on the active tab.
* Full-bleed `xterm.js` terminal or `Monaco` editor matching `--bg-canvas` (`#060607`).
* Top-right action button: `[ RUN GATE VERIFICATION ]`.


* **Right Column (25% — Offline `man` Pages & Rubric Specs):**
* Searchable offline documentation (`man grep`, `man chmod`, `stdout/stderr`) so the student never needs to leave the browser tab.





### Screen D: The "Bone Paper" Certificate & Verification Dossier (`/verify/[certId]`)

* Inspired by **Off Grid (Object 08)**:
* Switches to `--paper-canvas` (`#EAE6DF`) with crisp `#0A0A0B` ink, exposed dotted/solid technical hairlines, oversized `Departure Mono` metrics (`98% MUST-KNOW ACCURACY`, `00 CHEAT STRIKES`), vertical rotated axis labels (`VERIFIED // UNCLE DRILL ENGINE`), and a scannable cryptographic verification barcode at the bottom.



---

## 6. Hard Anti-Slop Ban List (Enforced by Google Antigravity)

The following patterns are **strictly forbidden** anywhere in the Uncle Drill codebase:

1. **NO Generic Fonts:** Never load `Inter`, `Roboto`, `Open Sans`, `Poppins`, or `Montserrat`.
2. **NO Rounded SaaS Cards:** Never use `rounded-lg`, `rounded-xl`, `rounded-2xl`, or `rounded-3xl`. All structural containers use `rounded-none` (`0px`).
3. **NO Purple/Blue AI Gradients or Glows:** Never use `bg-gradient-to-*`, purple/indigo/violet Tailwind classes, or blurry neon blobs behind cards.
4. **NO Glassmorphism or Drop Shadows:** Never use `backdrop-blur-*` or `shadow-md` / `shadow-lg` / `shadow-xl`. Depth is created strictly via `1px` borders and surface luminance steps (`#060607` $\rightarrow$ `#0C0C0E` $\rightarrow$ `#121216`).
5. **NO Bouncy Hover Effects:** Never use `hover:scale-105` or spring animations on cards. Hover states change border color (`#27272C` $\rightarrow$ `#F4F4F0`) or invert background/text cleanly.

```

