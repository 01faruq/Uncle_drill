"use client";

/**
 * @purpose Public Landing Page — Master 10-Section Founder Blueprint with Final Pillar 1 Visual Polish.
 *   Implements the exact copy from docs/07_UX_WRITING_AND_VOICE.md and Industrial Terminal
 *   design tokens from docs/06_UI_DESIGN_SYSTEM.md.
 *   Features:
 *     - FIXED (not sticky) header locked at top with 1px acid-lime (#D4FF00) scroll progress bar
 *     - Visible Light/Dark Theme Toggle [ ☀ PAPER ] / [ ☾ DARK ] synced via nuqs URL state
 *     - Custom geometric [UD] SVG brand logo mark in navbar
 *     - Uncle Drill character avatar (72px) in Study Chat & Drill Audit tabs
 *     - Wide hero typography with clamp font-size preventing orphan words
 *     - 100vw full-bleed horizontal divider lines
 *     - Infinite looping 12-brand marquee with edge fade masks (TrustLogos)
 *     - Section 02 default tab = 01. TASK & CHECKLIST
 *     - Section 03 full-screen wide layout
 *     - Full-width Reviews with large portraits and mouse-wheel horizontal scroll
 *     - Section 09 final callout buttons: [ DRILL ME -> ] and > VIEW TASK & CHECKLIST
 *     - Footer PLATFORM column with correct public links
 * @security Client component with zero untrusted HTML injection and safe clipboard interception.
 * @reference docs/01_FOUNDER_VISION.md, docs/06_UI_DESIGN_SYSTEM.md, docs/07_UX_WRITING_AND_VOICE.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { TrustLogos } from "@/components/marketing/TrustLogos";
import { ReviewsSection } from "@/components/marketing/ReviewsSection";
import { HudSectionScrubber } from "@/components/marketing/HudSectionScrubber";
import { useTheme } from "@/components/providers/ThemeProvider";

// ============================================================================
// TYPES
// ============================================================================
type PreviewTab = 1 | 2 | 3;
type RoastLevel = 1 | 2 | 3;
type ChallengeState = "IDLE" | "SCANNING" | "RESULT" | "COPY_CAUGHT";

// ============================================================================
// COMPONENT: Custom Geometric [UD] Brand Logo Mark
// Industrial rectangle + box-cut UD monogram per docs/06_UI_DESIGN_SYSTEM.md
// ============================================================================
function UncleDrillLogo() {
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      {/* Geometric logo mark: outer rect + inner UD */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer rectangle frame */}
        <rect x="0.5" y="0.5" width="27" height="27" stroke="var(--signal-cta)" strokeWidth="1" fill="none"/>
        {/* Inner fill block */}
        <rect x="3" y="3" width="22" height="22" fill="var(--signal-cta)"/>
        {/* U letterform */}
        <path d="M5 7V17C5 20 7.5 22 10 22C12.5 22 15 20 15 17V7H12V17C12 18.1 11.1 19 10 19C8.9 19 8 18.1 8 17V7H5Z" fill="var(--text-inverse)"/>
        {/* D letterform */}
        <path d="M16 7H20C22.8 7 25 9.2 25 12V17C25 19.8 22.8 22 20 22H16V7ZM19 10V19H20C21.1 19 22 18.1 22 17V12C22 10.9 21.1 10 20 10H19Z" fill="var(--text-inverse)"/>
      </svg>
      <span
        className="font-display font-bold text-text-primary tracking-tightest uppercase hidden sm:block"
        style={{ fontSize: "0.8rem", letterSpacing: "0.08em" }}
      >
        ■ UNCLE_DRILL
      </span>
    </div>
  );
}

// ============================================================================
// COMPONENT: Uncle Drill Avatar (72px)
// Uses /brand/uncle-avatar.jpg with inline SVG fallback of Uncle with flat cap,
// >_ badge, and glowing green glasses.
// ============================================================================
function UncleDrillAvatar({ size = 72 }: { size?: number }) {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <div
        className="shrink-0 overflow-hidden"
        style={{ width: size, height: size, border: "1px solid var(--border-grid)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/uncle-avatar.jpg"
          alt="Uncle Drill — Strict Systems Mentor"
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback inline SVG: Uncle with flat cap, glowing green glasses, >_ badge
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Uncle Drill avatar"
      style={{ border: "1px solid var(--border-grid)", flexShrink: 0 }}
    >
      <rect width="72" height="72" fill="#0C0C0E"/>
      {/* Flat cap brim */}
      <rect x="14" y="18" width="44" height="6" fill="#27272C"/>
      <rect x="16" y="12" width="40" height="9" fill="#1A1A20"/>
      {/* Skin */}
      <ellipse cx="36" cy="34" rx="15" ry="16" fill="#5C3D2A"/>
      {/* Stubble / beard shadow */}
      <path d="M21 40C21 48 27 54 36 54C45 54 51 48 51 40L44 43L36 45L28 43Z" fill="#3D2B1A" opacity="0.7"/>
      {/* Thick-frame glasses — glowing green */}
      <rect x="19" y="30" width="14" height="9" rx="0" stroke="#00FF66" strokeWidth="2" fill="none"/>
      <rect x="35" y="30" width="14" height="9" rx="0" stroke="#00FF66" strokeWidth="2" fill="none"/>
      <line x1="33" y1="34" x2="35" y2="34" stroke="#00FF66" strokeWidth="2"/>
      {/* Glow effect behind glasses */}
      <rect x="19" y="30" width="14" height="9" rx="0" fill="#00FF66" opacity="0.08"/>
      <rect x="35" y="30" width="14" height="9" rx="0" fill="#00FF66" opacity="0.08"/>
      {/* Eyes */}
      <ellipse cx="26" cy="34" rx="2" ry="2.5" fill="#060607"/>
      <ellipse cx="42" cy="34" rx="2" ry="2.5" fill="#060607"/>
      {/* Body / shirt */}
      <path d="M12 72C12 55 22 49 36 49C50 49 60 55 60 72H12Z" fill="#121216"/>
      {/* >_ badge on shirt */}
      <rect x="27" y="56" width="18" height="9" fill="#0C0C0E" stroke="#00FF66" strokeWidth="1"/>
      <text x="30" y="63" fontSize="6" fill="#00FF66" fontFamily="monospace">&gt;_</text>
    </svg>
  );
}

// ============================================================================
// HOOK: Scroll-Triggered IntersectionObserver
// ============================================================================
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ============================================================================
// DATA: 5-Phase Bedrock Curriculum
// ============================================================================
const PHASES = [
  {
    id: "01",
    code: "MOD_01 // BEDROCK",
    title: "Linux, Git Internals & Industrial Python",
    tags: ["stdin/stdout/stderr", "Process FD Table", "Git DAGs", "reflog", "pdb", "mypy", "pytest"],
    internals: "Processes, standard streams (stdin/stdout/stderr), DAGs, reflog recovery, debugging with pdb, static types (mypy), and automated testing (pytest).",
    proof: "Recover broken repositories, pipe and debug Linux streams without guessing, and ship tested, type-safe Python.",
  },
  {
    id: "02",
    code: "MOD_02 // MEMORY & DB",
    title: "Hardware Cost, C Memory, DSA & PostgreSQL Internals",
    tags: ["Pointers", "Stack vs. Heap", "Custom Hash Tables", "EXPLAIN ANALYZE", "ACID Locks"],
    internals: "Pointers, Stack vs. Heap, custom hash tables, EXPLAIN ANALYZE query plans, and ACID concurrency locking.",
    proof: "Diagnose memory bottlenecks and fix slow database queries that bring production servers to their knees.",
  },
  {
    id: "03",
    code: "MOD_03 // CONCURRENCY",
    title: "Networking, Async Concurrency & Production APIs",
    tags: ["TCP/TLS Handshakes", "Event Loops", "FastAPI Architecture", "Idempotency Keys", "AI PR Audit"],
    internals: "TCP/TLS handshakes, event loops, FastAPI layered architecture, idempotency keys, and auditing AI-generated pull requests.",
    proof: "Architect payment-grade APIs that never double-charge a user and catch subtle bugs AI code generators miss.",
  },
  {
    id: "04",
    code: "MOD_04 // RESILIENCE",
    title: "Linux Containers, CI/CD & Distributed Resilience",
    tags: ["Multi-Stage Dockerfiles", "Redis Caching", "Background Queues", "Cache-Crash Chaos Drills"],
    internals: "Hardened multi-stage Dockerfiles, Redis caching, background queues, and surviving live cache-crash chaos drills.",
    proof: "Containerize, deploy, and keep distributed backend services alive when a cache or worker node fails at 2 AM.",
  },
  {
    id: "05",
    code: "MOD_05 // POLYGLOT",
    title: "Polyglot Systems Mastery (Go or Rust)",
    tags: ["Go Goroutines", "Rust Ownership", "High-Concurrency", "Language-Agnostic Systems"],
    internals: "Prove language-agnostic mastery by rebuilding high-concurrency backend infrastructure from scratch in Go or Rust.",
    proof: "Prove that programming languages are just tools to you, and pick up any modern backend stack in days.",
  },
];

const FAQS = [
  {
    q: "Is Uncle Drill anti-AI?",
    a: "Not at all. We train you to be the top 1% of AI users. An engineer with deep fundamentals uses AI like a mathematician uses a calculator—spotting hallucinations immediately and shipping resilient systems 10x faster.",
  },
  {
    q: "Do you provide video courses?",
    a: "No. The world doesn't need another 50-hour video course. We curate the best existing primary sources on earth, give you the mental model and downloadable Field Manual, and focus 100% on coaching your thinking and auditing your mastery.",
  },
  {
    q: "I'm a beginner. Will Uncle Drill crush me?",
    a: "Uncle Drill is strict on laziness, not on beginners. Inside the Study Chat, if you admit you don't understand a concept, he will patiently break it down from zero. He only roasts you in the Drill Room when you claim to know something you haven't studied.",
  },
  {
    q: "Can I use Uncle Drill on my phone?",
    a: "You can read Field Manuals, track your checklist, and use Uncle's Study Chat on mobile. However, Drill Sessions require a desktop or laptop—because real engineering happens in a real terminal and code editor.",
  },
  {
    q: "What do I get when I pass a Phase? Is there a certificate?",
    a: "Standard course certificates are useless because anyone can play videos at 2x speed. When you pass a Phase here, you unlock a Verified Engineering Audit Certificate backed by your real sandbox audit logs—proof you can show a hiring manager.",
  },
  {
    q: "How much time do I need per week?",
    a: "Plan for 6 to 10 focused hours per week. We don't measure how many hours you keep a tab open; we only care whether you can pass your Milestone Audit when you step into the drill room.",
  },
  {
    q: "How does Uncle Drill work for Schools, Fellowships, or Engineering Teams?",
    a: "Instead of relying on take-home assignments that students generate with AI, program directors and CTOs use Uncle Drill to run live, unassisted technical audits—with a central dashboard showing every member's verified strengths and blind spots.",
  },
];

// ============================================================================
// COMPONENT: Live Terminal Sequence (Tab 3) with Dwell-Time Interactive Roasts
// ============================================================================
const FULL_CMD = "./log_analyzer.sh > out.txt";

const ROAST_SPECS: Record<
  RoastLevel,
  { label: string; badge: string; color: string; quote: string }
> = {
  1: {
    label: "[ LVL 1: MENTOR ]",
    badge: "CONSTRUCTIVE MENTOR",
    color: "var(--signal-info)",
    quote:
      `"Hold on. Look closely at './log_analyzer.sh > out.txt'. The '>' operator only redirects standard output (fd 1). When an error occurs, standard error (fd 2) still prints to your screen. Check 'man bash' on how to redirect fd 2."`,
  },
  2: {
    label: "[ LVL 2: STRICT UNCLE ]",
    badge: "STRICT UNCLE",
    color: "var(--signal-warn)",
    quote:
      `"Chinedu. Look at your screen. You had seven days to learn standard streams, and you still don't know why '> out.txt' only redirects fd 1? Even a plumber understands pipes better than this. Open 'man bash' before I price a table for you at Computer Village."`,
  },
  3: {
    label: "[ LVL 3: NO MERCY ]",
    badge: "NO MERCY",
    color: "var(--signal-fault)",
    quote:
      `"You claimed you mastered Linux streams, then you walked in here and leaked stderr like someone who learned Bash from a 60-second TikTok. Gate 1 is locked. Read the GNU manual on file descriptors and come back when you're serious."`,
  },
};

function LiveDrillTerminal({
  roastLevel,
  onRoastChange,
}: {
  roastLevel: RoastLevel;
  onRoastChange: (lvl: RoastLevel) => void;
}) {
  const [stage, setStage] = useState(0);
  const [typedCmd, setTypedCmd] = useState("");
  const [typedQuote, setTypedQuote] = useState("");
  const [isTypingQuote, setIsTypingQuote] = useState(false);

  const replay = useCallback(() => {
    setStage(0);
    setTypedCmd("");
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      setTypedCmd(FULL_CMD.slice(0, idx));
      if (idx >= FULL_CMD.length) {
        clearInterval(timer);
        setTimeout(() => setStage(1), 260);
        setTimeout(() => setStage(2), 850);
        setTimeout(() => setStage(3), 1500);
      }
    }, 28);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return replay();
  }, [replay]);

  // Dynamic typewriter re-typing effect when roast level is toggled
  useEffect(() => {
    if (stage < 3) return;
    setIsTypingQuote(true);
    setTypedQuote("");
    const targetQuote = ROAST_SPECS[roastLevel].quote;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedQuote(targetQuote.slice(0, i));
      if (i >= targetQuote.length) {
        clearInterval(interval);
        setIsTypingQuote(false);
      }
    }, 14);
    return () => clearInterval(interval);
  }, [stage, roastLevel]);

  const handleRoastToggle = (lvl: RoastLevel) => {
    onRoastChange(lvl);
    if (stage < 3) {
      setStage(3);
    }
  };

  return (
    <div className="p-5 sm:p-7 font-mono text-xs sm:text-[13px] space-y-5">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-grid">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 inline-block animate-pulse" style={{ background: "var(--signal-warn)" }} />
          <span className="font-bold tracking-wider text-text-primary">
            LIVE TELEMETRY INTERCEPT // MILESTONE 1.1
          </span>
        </div>
        <button
          onClick={replay}
          className="text-[11px] hover:underline"
          style={{ color: "var(--signal-cta)" }}
        >
          [ ↻ REPLAY COMMAND ]
        </button>
      </div>

      {/* Terminal Command Execution */}
      <div className="pt-1">
        <span className="font-bold" style={{ color: "var(--signal-pass)" }}>
          student@uncle-drill:~$
        </span>{" "}
        <span className="text-text-primary">{typedCmd}</span>
        {stage === 0 && (
          <span
            className="inline-block w-2 h-4 ml-1 animate-pulse align-middle"
            style={{ background: "var(--signal-cta)" }}
          />
        )}
      </div>

      {stage >= 1 && (
        <div className="leading-relaxed" style={{ color: "var(--signal-fault)" }}>
          [20:17:21] GATE_1_FAULT: stderr (fd 2) leaked to screen.<br />
          Exit code: 0 on missing log target.
        </div>
      )}

      {stage >= 2 && (
        <div className="text-text-muted leading-relaxed">
          [20:17:22] TELEMETRY: Uncle Drill Auditor Brain engaged.<br />
          Analyzing candidate response pattern...
        </div>
      )}

      {stage >= 3 && (
        <div
          className="p-5 space-y-4"
          style={{
            border: "1px solid var(--border-grid)",
            borderLeft: `3px solid ${ROAST_SPECS[roastLevel].color}`,
            background: "var(--bg-elevated)",
          }}
        >
          {/* Dwell-Time Interactive Roast Level Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="font-bold tracking-wider" style={{ color: ROAST_SPECS[roastLevel].color }}>
              UNCLE DRILL [{ROAST_SPECS[roastLevel].badge}]:
            </span>
            <div className="flex items-center gap-1.5">
              {([1, 2, 3] as const).map((lvl) => {
                const isSelected = roastLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleRoastToggle(lvl)}
                    className="px-2 py-0.5 text-[10px] uppercase font-bold transition-colors cursor-pointer select-none"
                    style={{
                      border: "1px solid " + (isSelected ? ROAST_SPECS[lvl].color : "var(--border-grid)"),
                      background: isSelected ? ROAST_SPECS[lvl].color : "var(--bg-canvas)",
                      color: isSelected ? "var(--text-inverse)" : "var(--text-muted)",
                    }}
                  >
                    {ROAST_SPECS[lvl].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Typed Roast Quote */}
          <p className="italic leading-[1.7] text-text-secondary min-h-[4rem]">
            {typedQuote}
            {isTypingQuote && (
              <span
                className="inline-block w-1.5 h-3 ml-1 animate-pulse align-middle"
                style={{ background: ROAST_SPECS[roastLevel].color }}
              />
            )}
          </p>
        </div>
      )}

      {/* Terminal Gate Status */}
      <div
        className="pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px]"
        style={{ borderTop: "1px solid var(--border-grid)" }}
      >
        <span className="text-text-muted">STATUS: GATE 1 BLOCKED</span>
        <span className="font-bold" style={{ color: "var(--signal-cta)" }}>
          RETRY AFTER FIXING STREAMS
        </span>
      </div>

      {/* Corrected 3-Column Telemetry Stats (Bug 2 Fix) */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 text-center"
        style={{ border: "1px solid var(--border-grid)", background: "var(--bg-canvas)" }}
      >
        {[
          { label: "1ST PRINCIPLES", value: "BEDROCK FOCUS", color: "var(--signal-cta)" },
          { label: "LIVE TERMINAL", value: "ZERO CRUTCHES", color: "var(--signal-warn)" },
          { label: "100% VERIFIED", value: "AUDIT STANDARD", color: "var(--signal-pass)" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4"
            style={{
              borderRight: i < 2 ? "1px solid var(--border-grid)" : undefined,
              borderBottom: i < 2 ? "1px solid var(--border-grid)" : undefined,
            }}
          >
            <div
              className="font-display text-xs sm:text-sm font-bold uppercase mb-1"
              style={{ color: stat.color }}
            >
              {stat.label}
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] text-text-secondary uppercase tracking-wider">
              ({stat.value})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN LANDING PAGE
// ============================================================================
export default function MarketingPage() {
  // Section 02 default = Tab 1 (Task & Checklist) so first-time visitors see the workflow
  const [previewTab, setPreviewTab] = useState<PreviewTab>(1);
  const [roastLevel, setRoastLevel] = useState<RoastLevel>(2);
  const [checklist, setChecklist] = useState([true, true, true, false]);
  const [activePhase, setActivePhase] = useState(0);
  const [challengeInput, setChallengeInput] = useState("");
  const [challengeState, setChallengeState] = useState<ChallengeState>("IDLE");
  const [challengeReply, setChallengeReply] = useState("");
  const [streamedReply, setStreamedReply] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showPromoBox, setShowPromoBox] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const heroSection = useInView(0.1);
  const storySection = useInView(0.15);
  const pricingSection = useInView(0.15);

  // Window scroll progress listener for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = (window.scrollY / scrollHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stream challenge reply
  useEffect(() => {
    if (!challengeReply) {
      setStreamedReply("");
      return;
    }
    let i = 0;
    setStreamedReply("");
    const t = setInterval(() => {
      i++;
      setStreamedReply(challengeReply.slice(0, i));
      if (i >= challengeReply.length) clearInterval(t);
    }, 12);
    return () => clearInterval(t);
  }, [challengeReply]);

  // Keyboard shortcuts [1][2][3] for interactive preview
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "1") setPreviewTab(1);
      if (e.key === "2") setPreviewTab(2);
      if (e.key === "3") setPreviewTab(3);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleCopyIntercept = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setChallengeState("COPY_CAUGHT");
    setChallengeReply(
      "[GATE_FAULT // CLIPBOARD INTERCEPT]: Did you just press Ctrl+C to paste this into ChatGPT? Close that tab and use your head. Look at `permissions=[]` on Line 1—when does Python allocate that list?"
    );
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeInput.trim()) return;
    setChallengeState("SCANNING");
    setChallengeReply("");
    setTimeout(() => {
      const val = challengeInput.toLowerCase();
      const gotOutput = val.includes("viewer") && val.includes("editor");
      const gotWhy =
        val.includes("mutable") ||
        val.includes("once") ||
        val.includes("definition") ||
        val.includes("memory") ||
        val.includes("same list");
      setChallengeState("RESULT");
      if (gotOutput && gotWhy) {
        setChallengeReply(
          "UNCLE DRILL [PASS]: Correct. Python evaluates default function arguments ONCE when `def` runs, mutating the exact same list object in memory across calls. That was the warm-up—step into Milestone 1.1."
        );
      } else if (gotOutput && !gotWhy) {
        setChallengeReply(
          "UNCLE DRILL [HALF-CREDIT]: You guessed `['viewer', 'editor']`, but you dodged the 'WHY'. Guessing right without explaining when Python binds default objects in memory won't survive a live audit."
        );
      } else {
        setChallengeReply(
          "UNCLE DRILL [ROAST LVL 2]: Wrong. Line 5 prints `['viewer', 'editor']`—and you just leaked admin permissions across two users in production. Default lists in Python are created ONCE at function definition time, not per call."
        );
      }
    }, 500);
  };

  return (
    <>
      <style>{`
        @keyframes crtBoot {
          0%   { clip-path: inset(0 100% 0 0); opacity: 0; }
          40%  { clip-path: inset(0 40%  0 0); opacity: 1; }
          100% { clip-path: inset(0 0%   0 0); opacity: 1; }
        }
        @keyframes limeSlam {
          0%, 45% { opacity: 0; transform: translateY(6px); filter: brightness(2.5); }
          60%      { opacity: 1; transform: translateY(0);   filter: brightness(1.8); }
          100%     { opacity: 1; transform: translateY(0);   filter: brightness(1);   }
        }
        @keyframes scanline {
          0%   { top: -4%;  opacity: 0.9; }
          85%  { top: 100%; opacity: 0.3; }
          100% { top: 102%; opacity: 0;   }
        }
        @keyframes waveShift {
          0%   { transform: translateX(0);     }
          100% { transform: translateX(-28px); }
        }
        @keyframes packetFlow {
          0%   { stroke-dashoffset: 240; }
          100% { stroke-dashoffset: 0;   }
        }
        .animate-crt-boot  { animation: crtBoot 420ms steps(6,end) forwards; }
        .animate-lime-slam { animation: limeSlam 780ms steps(8,end) 200ms forwards; opacity: 0; }
        .scanline-bar {
          position: absolute; left: 0; right: 0; height: 2px; pointer-events: none; z-index: 30;
          background: linear-gradient(90deg, transparent, var(--signal-cta), var(--signal-warn), transparent);
          box-shadow: 0 0 18px var(--signal-cta);
          animation: scanline 1.1s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .animate-wave { display: inline-block; animation: waveShift 1.2s steps(4,end) infinite; }
        .animate-circuit { stroke-dasharray: 8 8; animation: packetFlow 3s linear infinite; }
        .mech-btn { transition: transform 80ms steps(2,end), box-shadow 80ms steps(2,end); }
        .mech-btn:hover  { transform: translate(-2px,-2px); box-shadow: 4px 4px 0 var(--signal-warn); }
        .mech-btn:active { transform: translate(1px,1px);   box-shadow: none; }
      `}</style>

      {/* Desktop HUD Section Scrubber (xl screens) */}
      <HudSectionScrubber />

      {/* pt-[88px] offsets the fixed header height so content starts below it */}
      <div className="min-h-screen bg-canvas text-text-primary pb-16 overflow-x-hidden pt-[88px]" style={{ WebkitFontSmoothing: "antialiased" }}>

        {/* ================================================================
            SECTION 00 — FIXED HEADER (locked at top while scrolling)
        ================================================================ */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-canvas)]/95 border-b border-[var(--border-grid)] relative" style={{ backdropFilter: "blur(2px)" }}>
          {/* Micro-Ticker */}
          <div
            className="px-4 sm:px-6 py-1 font-mono text-[10px] text-text-muted flex items-center justify-between overflow-hidden"
            style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-elevated)" }}
          >
            <span className="shrink-0 text-text-secondary tracking-hud">UNCLE_DRILL // SYSTEMS &amp; BACKEND MASTERY ENGINE</span>
            <div className="hidden sm:block truncate ml-4" style={{ color: "var(--signal-warn)" }}>
              TICKER: &ldquo;82% of candidates failed Milestone 1.1 on first attempt. Can you redirect stderr without guessing?&rdquo;
            </div>
          </div>

          {/* Main Navbar */}
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 font-mono text-[11px]">
            {/* Custom geometric [UD] logo mark */}
            <UncleDrillLogo />
            <nav className="hidden md:flex items-center gap-6 text-text-muted text-xs">
              {["Curriculum", "Pricing", "For Schools", "For Business"].map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="hover:text-signal-cta transition-colors">
                  {l}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme Toggle — persists via nuqs URL state */}
              <button
                type="button"
                id="theme-toggle"
                onClick={toggleTheme}
                title={theme === "obsidian" ? "Switch to Paper Light Mode" : "Switch to Obsidian Dark Mode"}
                className="px-3 py-1.5 font-bold uppercase text-[10px] transition-colors cursor-pointer"
                style={{
                  border: "1px solid var(--border-grid)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                }}
              >
                {theme === "obsidian" ? "[ ☀ PAPER ]" : "[ ☾ DARK ]"}
              </button>
              <Link
                href="/login"
                className="px-3.5 py-1.5 font-bold uppercase text-[11px] text-text-secondary hover:text-text-primary transition-colors"
                style={{ border: "1px solid var(--border-grid)", background: "var(--bg-elevated)" }}
              >
                LOG IN
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 font-bold uppercase text-[11px] mech-btn"
                style={{ background: "var(--signal-cta)", color: "var(--text-inverse)" }}
              >
                [ SIGN UP FREE ]
              </Link>
            </div>
          </div>

          {/* ASCII Waveform Sub-Bar */}
          <div
            className="px-4 sm:px-6 py-1 font-mono text-[10px] text-text-muted flex items-center gap-3 overflow-hidden"
            style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}
          >
            <span className="shrink-0 text-text-secondary">LIVE_AUDIT_STREAM</span>
            <div className="overflow-hidden w-56 sm:w-80 whitespace-nowrap" style={{ color: "var(--border-grid)" }}>
              <span className="animate-wave">/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_/\_</span>
            </div>
          </div>

          {/* 1px Acid-Lime Horizontal Scroll Progress Bar */}
          <div
            className="absolute bottom-0 left-0 h-[1px] bg-[#D4FF00] z-50 transition-all duration-75 pointer-events-none"
            style={{ width: `${scrollProgress}%` }}
            aria-hidden="true"
          />
        </header>

        {/* ================================================================
            SECTION 01 — CENTERED HERO (OPEN-CAGE RHYTHM: ZERO BOX BORDER)
            Wide container (1360px) + clamp font-size prevents orphan words.
        ================================================================ */}
        <section
          id="hero"
          ref={heroSection.ref as React.RefObject<HTMLElement>}
          className="w-full px-6 py-24 sm:py-36"
          style={{ maxWidth: "1360px", margin: "0 auto" }}
        >
          <div className="relative text-center overflow-hidden">
            {heroSection.inView && <div className="scanline-bar" />}

            {/* Eyebrow */}
            <div
              className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase mb-8"
              style={{ color: "var(--signal-warn)" }}
            >
              ⌈ BUILT FOR THE AI ERA // GROUNDED IN FIRST PRINCIPLES ⌋
            </div>

            {/* Headline — clamp prevents single-word orphans across viewport widths */}
            <h1
              className="font-display font-bold uppercase mb-10"
              style={{
                fontSize: "clamp(1.8rem, 3.8vw, 3.6rem)",
                lineHeight: "1.12",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              <span className="block text-text-primary animate-crt-boot">YOU CAN LIE ON YOUR RESUME.</span>
              <span className="block mt-3 animate-lime-slam" style={{ color: "var(--signal-cta)" }}>
                YOU CAN&apos;T LIE TO UNCLE DRILL.
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="mx-auto text-text-secondary text-sm sm:text-[1.05rem] leading-[1.75] mb-12 font-sans"
              style={{ maxWidth: "58ch" }}
            >
              Tutorials hold your hand. Chatbots flatter your mistakes.{" "}
              <strong className="text-text-primary font-semibold">Uncle Drill puts you through live technical audits</strong>{" "}
              and tests your fundamentals until systems thinking becomes your second language.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs sm:text-[13px] mb-6">
              <a
                href="#interactive-stage"
                onClick={() => setPreviewTab(3)}
                className="w-full sm:w-auto font-bold px-10 py-4 uppercase tracking-wider mech-btn"
                style={{ background: "var(--signal-cta)", color: "var(--text-inverse)" }}
              >
                [ DRILL ME -&gt; ]
              </a>
              <a
                href="#interactive-stage"
                onClick={() => setPreviewTab(1)}
                className="w-full sm:w-auto text-text-secondary px-8 py-4 uppercase tracking-wider hover:text-text-primary transition-colors"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-grid)" }}
              >
                &gt; VIEW TASK &amp; CHECKLIST
              </a>
            </div>

            {/* 100vw full-bleed divider below CTA buttons */}
            <div className="w-screen relative left-1/2 -translate-x-1/2 mb-10" style={{ borderTop: "1px solid var(--border-grid)" }} />

            {/* Trust Bar — Infinite Marquee */}
            <div className="mb-4">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted mb-6">
                MASTER THE SYSTEMS FUNDAMENTALS DEMANDED BY:
              </div>
              <TrustLogos />
            </div>
          </div>
        </section>

        {/* 100vw full-bleed divider below the Trust Bar */}
        <div className="w-full border-t border-[var(--border-grid)]" />

        {/* ================================================================
            SECTION 02 — INTERACTIVE PREVIEW STAGE (LOCKED IN STRUCTURAL GRID)
        ================================================================ */}
        <section id="interactive-stage" className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
          <div className="p-3 sm:p-5" style={{ border: "1px solid var(--border-grid)", background: "var(--bg-surface)" }}>
            <div style={{ border: "1px solid var(--border-subtle)", background: "var(--bg-elevated)" }}>
              {/* Tab Bar */}
              <div
                className="px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
                style={{ borderBottom: "1px solid var(--border-grid)" }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 1 as PreviewTab, label: "01. TASK & CHECKLIST" },
                    { id: 2 as PreviewTab, label: "02. UNCLE'S STUDY CHAT" },
                    { id: 3 as PreviewTab, label: "03. LIVE DRILL AUDIT" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPreviewTab(tab.id)}
                      className="px-3 py-1.5 uppercase font-bold transition-colors cursor-pointer"
                      style={{
                        border: "1px solid " + (previewTab === tab.id ? "var(--signal-cta)" : "var(--border-grid)"),
                        background: previewTab === tab.id ? "var(--signal-cta)" : "var(--bg-canvas)",
                        color: previewTab === tab.id ? "var(--text-inverse)" : "var(--text-muted)",
                      }}
                    >
                      [ {tab.label} ]
                    </button>
                  ))}
                </div>
                <div className="font-mono text-[11px] text-text-muted">
                  [ PRESS 1, 2, OR 3 ]
                </div>
              </div>

              {/* TAB 1: TASK & CHECKLIST */}
              {previewTab === 1 && (
                <div className="p-6 sm:p-8 font-mono text-xs sm:text-[13px] space-y-5">
                  <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--border-grid)" }}>
                    <span className="font-bold text-signal-cta">MILESTONE 1.1 // STANDARD STREAMS &amp; PIPES</span>
                    <span style={{ color: "var(--signal-warn)" }}>CHECKLIST: {checklist.filter(Boolean).length}/4 DONE</span>
                  </div>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed">
                    Before stepping into the audit sandbox, study the curated primary documentation and verify every item below:
                  </p>
                  <div className="space-y-2.5 p-4" style={{ background: "var(--bg-canvas)", border: "1px solid var(--border-grid)" }}>
                    {[
                      "I can explain why `> out.txt 2>&1` captures stderr, while `2>&1 > out.txt` leaks it.",
                      "I understand how `set -euo pipefail` stops silent failures inside piped scripts.",
                      "I can inspect active file descriptors inside `/proc/<PID>/fd`.",
                      "I wrote and tested `log_analyzer.sh` in my local terminal without AI autocomplete.",
                    ].map((item, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          setChecklist((prev) => {
                            const n = [...prev];
                            n[i] = !n[i];
                            return n;
                          })
                        }
                        className="flex items-start gap-3 p-2 cursor-pointer select-none hover:opacity-80"
                      >
                        <span className="font-bold" style={{ color: checklist[i] ? "var(--signal-pass)" : "var(--text-muted)" }}>
                          {checklist[i] ? "[✓]" : "[ ]"}
                        </span>
                        <span style={{ color: checklist[i] ? "var(--text-primary)" : "var(--text-secondary)" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: UNCLE'S STUDY CHAT */}
              {previewTab === 2 && (
                <div className="p-6 sm:p-8 font-mono text-xs sm:text-[13px] space-y-5">
                  <div className="font-bold pb-3" style={{ color: "var(--signal-pass)", borderBottom: "1px solid var(--border-grid)" }}>
                    UNCLE&apos;S STUDY CHAT // FIRST-PRINCIPLES MENTORSHIP MODE
                  </div>
                  <div className="p-4 text-text-secondary" style={{ background: "var(--bg-canvas)", border: "1px solid var(--border-grid)" }}>
                    <span className="text-text-primary font-bold block mb-1">CANDIDATE:</span>
                    &ldquo;Uncle, why does the order of <code style={{ color: "var(--signal-cta)" }}>&gt; out.txt 2&gt;&amp;1</code> matter so much?&rdquo;
                  </div>
                  <div
                    className="p-5 space-y-3"
                    style={{ border: "1px solid var(--border-grid)", borderLeft: "3px solid var(--signal-pass)", background: "var(--bg-elevated)" }}
                  >
                    <div className="flex items-center gap-3">
                      <UncleDrillAvatar size={44} />
                      <div className="font-bold text-[11px]" style={{ color: "var(--signal-pass)" }}>UNCLE DRILL [STUDY COACH]:</div>
                    </div>
                    <p className="font-sans text-sm text-text-secondary leading-relaxed">
                      Think of File Descriptor 1 (stdout) and File Descriptor 2 (stderr) as two water hoses. Bash reads strictly left-to-right. When you type{" "}
                      <code className="font-mono px-1" style={{ color: "var(--signal-cta)", background: "var(--bg-surface)" }}>
                        &gt; out.txt
                      </code>{" "}
                      first, you point Hose 1 into the bucket, and then{" "}
                      <code className="font-mono px-1" style={{ color: "var(--signal-cta)", background: "var(--bg-surface)" }}>
                        2&gt;&amp;1
                      </code>{" "}
                      points Hose 2 into that same bucket.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE DRILL AUDIT */}
              {previewTab === 3 && (
                <div>
                  {/* Uncle avatar header for the Drill Audit tab */}
                  <div className="px-6 pt-5 pb-0 flex items-center gap-3">
                    <UncleDrillAvatar size={48} />
                    <div>
                      <div className="font-display font-bold text-xs uppercase" style={{ color: "var(--signal-warn)" }}>UNCLE DRILL</div>
                      <div className="font-mono text-[10px] text-text-muted">LIVE AUDITOR BRAIN // ACTIVE</div>
                    </div>
                  </div>
                  <LiveDrillTerminal
                    roastLevel={roastLevel}
                    onRoastChange={(lvl) => setRoastLevel(lvl)}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 03 — ORIGIN STORY & COMPARISON
        ================================================================ */}
        <section id="origin" ref={storySection.ref as React.RefObject<HTMLElement>} className="w-full px-4 sm:px-8 mb-24" style={{ maxWidth: "1400px", margin: "0 auto 6rem" }}>
          <div className="relative dot-matrix-bg overflow-hidden p-7 sm:p-12" style={{ border: "1px solid var(--border-grid)", minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {storySection.inView && <div className="scanline-bar" />}
            <div className="font-mono text-xs font-bold tracking-[0.16em] uppercase mb-3" style={{ color: "var(--signal-warn)" }}>
              ⌈ WHY UNCLE DRILL EXISTS ⌋
            </div>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-text-primary uppercase leading-[1.25] mb-3">
              THE BEST ENGINEERS WITHOUT AI ARE THE BEST ENGINEERS WITH AI.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mb-10 font-sans">
              A calculator only makes you dangerous if you already understand the math.
            </p>

            <div className="grid lg:grid-cols-12 gap-6">
              {/* Founder Dossier */}
              <div className="lg:col-span-5">
                <div
                  className="p-6 sm:p-8 space-y-4 text-sm text-text-secondary leading-[1.75] h-full font-sans"
                  style={{ border: "1px solid var(--border-grid)", borderLeft: "3px solid var(--signal-warn)", background: "var(--bg-elevated)" }}
                >
                  <p>
                    To fix my own foundational gaps, I built a rigorous fundamentals roadmap and asked an AI to act as my{" "}
                    <strong className="text-text-primary">&ldquo;Strict Uncle&rdquo;</strong> to audit me.
                  </p>
                  <p>
                    First, it asked which topics I was already good at. Confidently, I typed:{" "}
                    <code className="font-mono px-2 py-0.5" style={{ color: "var(--signal-cta)", background: "var(--bg-surface)" }}>
                      &ldquo;Linux CLI (Bash) and Python.&rdquo;
                    </code>
                  </p>
                  <p>
                    It pushed back: <em className="text-text-primary">&ldquo;Talk is cheap. Prove it. Answer these questions without leaving this chat.&rdquo;</em>
                  </p>
                  <p>I quietly skipped the tough Bash questions and only answered the single Python question I knew cold.</p>
                  <p
                    className="text-text-primary font-medium p-3.5"
                    style={{ background: "var(--bg-highlight)", border: "1px solid rgba(255,149,0,0.3)" }}
                  >
                    It didn&apos;t say &ldquo;Great job on the Python question!&rdquo;{" "}
                    <strong style={{ color: "var(--signal-warn)" }}>It drilled me harshly for dodging the Bash questions.</strong>
                  </p>
                  <p>
                    Sitting there reading that scolding, it clicked:{" "}
                    <strong style={{ color: "var(--signal-cta)" }}>I need something like this.</strong>
                  </p>
                  <div className="font-mono text-xs text-text-primary pt-1">[GM Umar]</div>
                </div>
              </div>

              {/* 3-Row Comparison Grid */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-12 h-full font-mono text-xs" style={{ border: "1px solid var(--border-grid)", background: "var(--bg-surface)" }}>
                  <div
                    className="col-span-4 p-4 text-text-muted uppercase font-bold"
                    style={{ borderBottom: "1px solid var(--border-grid)", borderRight: "1px solid var(--border-grid)" }}
                  >
                    DIMENSION
                  </div>
                  <div
                    className="col-span-4 p-4 uppercase font-bold"
                    style={{ borderBottom: "1px solid var(--border-grid)", borderRight: "1px solid var(--border-grid)", color: "var(--signal-fault)" }}
                  >
                    OTHER PLATFORMS
                  </div>
                  <div
                    className="col-span-4 p-4 uppercase font-bold"
                    style={{ borderBottom: "1px solid var(--border-grid)", background: "var(--bg-elevated)", color: "var(--signal-cta)" }}
                  >
                    ■ UNCLE DRILL
                  </div>
                  {[
                    {
                      dim: "How You Learn",
                      bad: { t: "Tutorial Hell.", b: "Generic videos and toy examples that never adapt to you—and fall apart against a real production codebase." },
                      good: { t: "Real-World First Principles.", b: "Curated Field Manuals built around how production systems actually work—Linux internals, memory, Git, SQL, and concurrency." },
                    },
                    {
                      dim: "How You Are Guided",
                      bad: { t: "Easy to Game.", b: "Static hints or standard chatbots where you can manipulate the prompt or lie to the AI without getting caught." },
                      good: { t: "Strict Mentorship.", b: "Uncle Drill tracks your weak spots, makes you prove what you claim to know, and calls you out the second you dodge a question." },
                    },
                    {
                      dim: "How You Prove It",
                      bad: { t: "The Senior Engineer Illusion.", b: "Easy tasks that make you feel like a senior engineer—until you face a blank terminal on your own." },
                      good: { t: "Live Technical Audits.", b: "Unassisted sessions where you explain, write, debug, and defend real engineering work under pressure." },
                    },
                  ].map((row, i) => (
                    <React.Fragment key={i}>
                      <div
                        className="col-span-4 p-4 text-text-primary font-bold"
                        style={{ borderTop: "1px solid var(--border-grid)", borderRight: "1px solid var(--border-grid)" }}
                      >
                        0{i + 1} // {row.dim}
                      </div>
                      <div
                        className="col-span-4 p-4 text-text-secondary leading-relaxed hover:opacity-80 transition-opacity"
                        style={{ borderTop: "1px solid var(--border-grid)", borderRight: "1px solid var(--border-grid)" }}
                      >
                        <strong className="text-text-primary block mb-1">{row.bad.t}</strong>
                        {row.bad.b}
                      </div>
                      <div
                        className="col-span-4 p-4 text-text-secondary leading-relaxed hover:opacity-80 transition-opacity"
                        style={{ borderTop: "1px solid var(--border-grid)", background: "var(--bg-elevated)" }}
                      >
                        <strong className="block mb-1" style={{ color: "var(--signal-cta)" }}>
                          {row.good.t}
                        </strong>
                        {row.good.b}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 04 — THE 3-STEP MASTERY LOOP
        ================================================================ */}
        <section id="methodology" className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
          <div className="dot-matrix-bg p-7 sm:p-12" style={{ border: "1px solid var(--border-grid)" }}>
            <div className="font-mono text-xs font-bold tracking-[0.16em] uppercase mb-3" style={{ color: "var(--signal-warn)" }}>
              ⌈ THE METHODOLOGY ⌋
            </div>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-text-primary uppercase leading-[1.25] mb-3">
              DON&apos;T JUST CONSUME CONTENT. PROVE YOU OWN IT.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mb-10 font-sans">
              No 50-hour bloated video courses—just a ruthless 3-step loop designed to turn raw documentation into permanent engineering instinct.
            </p>
            <div className="hidden md:block mb-2">
              <svg className="w-full h-6" viewBox="0 0 900 24" fill="none">
                <line x1="150" y1="12" x2="750" y2="12" stroke="var(--border-grid)" strokeWidth="2" />
                <line x1="150" y1="12" x2="750" y2="12" stroke="var(--signal-cta)" strokeWidth="2" className="animate-circuit" />
                <circle cx="150" cy="12" r="5" fill="var(--signal-cta)" />
                <circle cx="450" cy="12" r="5" fill="var(--signal-warn)" />
                <circle cx="750" cy="12" r="5" fill="var(--signal-pass)" />
              </svg>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  num: "01 // THE TASK & FIELD MANUAL",
                  accent: "var(--signal-cta)",
                  text: "Get the mental model, real-world production failure cases, curated primary sources (MIT, CS50, classic engineering books, official docs), and a downloadable PDF Field Manual with a clear Pre-Drill Checklist.",
                },
                {
                  num: "02 // UNCLE'S STUDY CHAT",
                  accent: "var(--signal-warn)",
                  text: "Stuck on a hard concept? Step into the Study Chat. Uncle Drill breaks complex internals down through relatable stories and first principles—testing your reasoning step by step instead of handing you lazy shortcuts.",
                },
                {
                  num: "03 // THE DRILL SESSION",
                  accent: "var(--signal-pass)",
                  text: "Once every box on your checklist is ticked, click [ DRILL ME ] on your desktop. Explain concepts by voice or text, predict code output in your head, write scripts from scratch, and debug broken systems live.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="p-6 flex flex-col justify-between hover:opacity-90 transition-opacity"
                  style={{ border: "1px solid var(--border-grid)", background: "var(--bg-surface)" }}
                >
                  <div>
                    <div className="font-display text-xs sm:text-sm font-bold mb-4" style={{ color: step.accent }}>
                      {step.num}
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">{step.text}</p>
                  </div>
                  <div
                    className="mt-6 pt-3 font-mono text-[10px] text-text-muted flex justify-between"
                    style={{ borderTop: "1px dashed var(--border-subtle)" }}
                  >
                    <span>GATE_0{i + 1}</span>
                    <span className="text-text-primary">REQUIRED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 05 — 5-PHASE BEDROCK CURRICULUM
        ================================================================ */}
        <section id="curriculum" className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
          <div className="dot-matrix-bg p-7 sm:p-12" style={{ border: "1px solid var(--border-grid)" }}>
            <div className="font-mono text-xs font-bold tracking-[0.16em] uppercase mb-3" style={{ color: "var(--signal-warn)" }}>
              ⌈ FRAMEWORKS CHANGE. BEDROCK REMAINS. ⌋
            </div>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-text-primary uppercase leading-[1.25] mb-3">
              WHAT IT TAKES TO STAND OUT IN THE AI ERA.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mb-8 font-sans">
              You don&apos;t just read these phases. You prove you own them in the drill room.
            </p>
            <div className="grid lg:grid-cols-12" style={{ border: "1px solid var(--border-grid)", background: "var(--bg-surface)" }}>
              <div className="lg:col-span-5" style={{ borderBottom: "1px solid var(--border-grid)" }}>
                {PHASES.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePhase(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    style={{
                      borderBottom: "1px solid var(--border-grid)",
                      borderLeft: activePhase === idx ? "3px solid var(--signal-cta)" : "3px solid transparent",
                      background: activePhase === idx ? "var(--bg-elevated)" : undefined,
                    }}
                  >
                    <div>
                      <div className="font-mono text-[10px] text-text-muted mb-1">{p.code}</div>
                      <div
                        className="font-mono text-xs sm:text-sm font-bold"
                        style={{ color: activePhase === idx ? "var(--signal-cta)" : "var(--text-primary)" }}
                      >
                        {p.title}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] shrink-0" style={{ color: activePhase === idx ? "var(--signal-cta)" : "var(--text-muted)" }}>
                      {idx === 0 ? "FREE" : "LOCKED"}
                    </span>
                  </button>
                ))}
              </div>
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6" style={{ borderLeft: "1px solid var(--border-grid)" }}>
                <div>
                  <div className="font-mono text-[10px] tracking-hud uppercase mb-2" style={{ color: "var(--signal-warn)" }}>
                    {PHASES[activePhase].code}
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-text-primary uppercase font-bold mb-4">
                    {PHASES[activePhase].title}
                  </h3>
                  <div className="font-mono text-[11px] text-text-muted uppercase mb-2">CORE INTERNALS</div>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed">{PHASES[activePhase].internals}</p>
                </div>
                <div>
                  <div className="font-mono text-[11px] text-text-muted uppercase mb-2">REAL-WORLD PROOF</div>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed">{PHASES[activePhase].proof}</p>
                </div>
                <div>
                  <div className="font-mono text-[11px] text-text-muted uppercase mb-2">TERMINAL TAGS</div>
                  <div className="flex flex-wrap gap-2">
                    {PHASES[activePhase].tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-1 text-text-secondary"
                        style={{ background: "var(--bg-canvas)", border: "1px solid var(--border-grid)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <a href="#" className="font-mono text-xs hover:underline" style={{ color: "var(--signal-cta)" }}>
                    &gt; DOWNLOAD COMPLETE 5-PHASE SYLLABUS (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 06 — 60-SECOND CHALLENGE
        ================================================================ */}
        <section id="challenge" className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
          <div className="p-7 sm:p-12" style={{ border: "1px solid var(--border-grid)", background: "var(--bg-surface)" }}>
            <div className="font-mono text-xs font-bold tracking-[0.16em] uppercase mb-3" style={{ color: "var(--signal-warn)" }}>
              ⌈ TEST YOURSELF LIVE ⌋
            </div>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-text-primary uppercase leading-[1.25] mb-3">
              THINK YOUR BASICS ARE SOLID? PROVE IT IN 60 SECONDS.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mb-8 font-sans">
              No hints. No AI. Just you and three lines of Python.
            </p>
            <div
              className="p-5 font-mono text-xs sm:text-sm mb-5 relative"
              style={{ background: "var(--bg-canvas)", border: "1px solid var(--border-grid)" }}
              onCopy={handleCopyIntercept}
            >
              <div className="text-text-muted mb-3 text-[10px]">CHALLENGE_SNIPPET.py</div>
              <pre className="text-text-secondary leading-[1.9] select-none">
                <span className="text-text-muted">1  </span>
                <span style={{ color: "var(--signal-info)" }}>def</span>{" "}
                <span style={{ color: "var(--signal-cta)" }}>add_role</span>(user, roles
                <span className="text-text-muted">=[]</span>):{"\n"}
                <span className="text-text-muted">2    </span>roles.
                <span style={{ color: "var(--signal-info)" }}>append</span>(user){"\n"}
                <span className="text-text-muted">3    </span>
                <span style={{ color: "var(--signal-info)" }}>return</span> roles{"\n"}
                <span className="text-text-muted">4  </span>
                <span style={{ color: "var(--signal-cta)" }}>add_role</span>(
                <span style={{ color: "var(--signal-warn)" }}>&quot;viewer&quot;</span>){"\n"}
                <span className="text-text-muted">5  </span>
                <span style={{ color: "var(--signal-info)" }}>print</span>(
                <span style={{ color: "var(--signal-cta)" }}>add_role</span>(
                <span style={{ color: "var(--signal-warn)" }}>&quot;editor&quot;</span>))
              </pre>
            </div>
            <form onSubmit={handleChallengeSubmit} className="space-y-3">
              <label className="font-mono text-[11px] text-text-muted uppercase block">
                WHAT DOES LINE 5 PRINT, AND WHY?
              </label>
              <input
                type="text"
                value={challengeInput}
                onChange={(e) => setChallengeInput(e.target.value)}
                placeholder="Type your answer here..."
                disabled={challengeState === "SCANNING"}
                className="w-full text-text-primary font-mono text-sm px-4 py-3 placeholder:text-text-muted focus:outline-none transition-colors disabled:opacity-50"
                style={{ background: "var(--bg-canvas)", border: "1px solid var(--border-grid)" }}
              />
              <button
                type="submit"
                disabled={challengeState === "SCANNING" || !challengeInput.trim()}
                className="font-bold font-mono text-xs px-6 py-3 uppercase tracking-wider mech-btn disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "var(--signal-cta)", color: "var(--text-inverse)" }}
              >
                {challengeState === "SCANNING" ? "[ SCANNING... ]" : "[ SUBMIT TO UNCLE DRILL -> ]"}
              </button>
            </form>
            {(challengeState === "RESULT" || challengeState === "COPY_CAUGHT") && streamedReply && (
              <div
                className="mt-5 p-5 font-mono text-xs sm:text-sm leading-relaxed"
                style={{
                  border: "1px solid var(--border-grid)",
                  borderLeft:
                    "3px solid " +
                    (streamedReply.includes("PASS")
                      ? "var(--signal-pass)"
                      : streamedReply.includes("CLIPBOARD")
                      ? "var(--signal-fault)"
                      : "var(--signal-warn)"),
                  background: "var(--bg-elevated)",
                  color: streamedReply.includes("PASS")
                    ? "var(--signal-pass)"
                    : streamedReply.includes("CLIPBOARD")
                    ? "var(--signal-fault)"
                    : "var(--signal-warn)",
                }}
              >
                {streamedReply}
              </div>
            )}
          </div>
        </section>

        {/* ================================================================
            SECTION 07 — HORIZONTAL SIDE-SCROLLING BETA REVIEWS SECTION
        ================================================================ */}
        <ReviewsSection />

        {/* ================================================================
            SECTION 08 — 3-COLUMN PRICING (PRICING CARD 1 BUG FIX)
        ================================================================ */}
        <section id="pricing" ref={pricingSection.ref as React.RefObject<HTMLElement>} className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
          <div className="relative dot-matrix-bg overflow-hidden p-7 sm:p-12" style={{ border: "1px solid var(--border-grid)" }}>
            {pricingSection.inView && <div className="scanline-bar" />}
            <div className="font-mono text-xs font-bold tracking-[0.16em] uppercase mb-3" style={{ color: "var(--signal-warn)" }}>
              ⌈ SKIN IN THE GAME ⌋
            </div>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-text-primary uppercase leading-[1.25] mb-3">
              START WITH MILESTONE 1.1 FREE. STAY FOR THE ACCOUNTABILITY.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mb-10 font-sans" style={{ maxWidth: "60ch" }}>
              We anchor at <strong className="text-text-primary">₦10,000/month</strong> to reflect the real market value of proctored Linux sandboxes and senior systems auditing.
            </p>
            <div className="grid md:grid-cols-3 gap-5 mb-6">
              {[
                {
                  title: "Free First-Principles Trial",
                  price: "FREE",
                  subPrice: "₦0 • 3-DAY STARTER ACCESS",
                  period: "",
                  highlight: false,
                  features: [
                    "Milestone 1.1 Field Manual (PDF)",
                    "3 Days in Uncle's Study Chat",
                    "1 Proctored Drill Attempt",
                    "No credit card required",
                  ],
                  cta: "[ START FREE TRIAL ]",
                },
                {
                  title: "Full Engineering Membership",
                  price: "₦10,000",
                  subPrice: null,
                  period: "per month",
                  highlight: true,
                  badge: "MOST POPULAR",
                  features: [
                    "All 5 Phases + Field Manuals",
                    "Unlimited Drill Attempts",
                    "Unlimited Uncle's Study Chat",
                    "Verified Audit Certificate",
                    "Voice Note Input & Playback",
                  ],
                  cta: "[ JOIN THE MEMBERSHIP ]",
                },
                {
                  title: "Teams, Bootcamps & Schools",
                  price: "Custom",
                  subPrice: null,
                  period: "per seat",
                  highlight: false,
                  features: [
                    "Cohort Dashboard & Analytics",
                    "Blind Spot Reports per Member",
                    "B2B Sponsor Verification",
                    "Custom Seat Pricing",
                  ],
                  cta: "[ CONTACT FOR PRICING ]",
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className="p-6 sm:p-8 flex flex-col justify-between"
                  style={{
                    border: "1px solid " + (plan.highlight ? "var(--signal-cta)" : "var(--border-grid)"),
                    background: plan.highlight ? "var(--bg-elevated)" : "var(--bg-surface)",
                  }}
                >
                  <div>
                    {"badge" in plan && plan.badge && (
                      <div className="font-mono text-[10px] tracking-hud uppercase mb-3" style={{ color: "var(--signal-cta)" }}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="font-mono text-xs text-text-muted uppercase mb-2">{plan.title}</div>
                    <div className="font-display text-3xl sm:text-4xl text-text-primary font-bold mb-1">
                      {plan.price}
                    </div>
                    {plan.subPrice ? (
                      <div className="font-mono text-xs font-bold mb-6 tracking-wider" style={{ color: "var(--signal-cta)" }}>
                        {plan.subPrice}
                      </div>
                    ) : (
                      <div className="font-mono text-[10px] text-text-muted mb-6">{plan.period}</div>
                    )}
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="font-mono text-[11px] text-text-secondary flex items-start gap-2">
                          <span className="shrink-0" style={{ color: "var(--signal-cta)" }}>
                            ✓
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="#"
                    className="block text-center font-mono text-xs font-bold px-4 py-3 uppercase tracking-wider mech-btn"
                    style={
                      plan.highlight
                        ? { background: "var(--signal-cta)", color: "var(--text-inverse)" }
                        : { border: "1px solid var(--border-grid)", color: "var(--text-secondary)" }
                    }
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
              <button
                onClick={() => setShowPromoBox((v) => !v)}
                className="font-mono text-xs text-text-muted hover:text-signal-cta transition-colors cursor-pointer"
              >
                &gt; Have a Fellowship, Early-Tester, or Merit Scholarship Code? Apply it at checkout.
              </button>
              {showPromoBox && (
                <div
                  className="mt-3 p-4 font-mono text-xs text-text-secondary"
                  style={{ border: "1px solid var(--border-grid)", background: "var(--bg-canvas)" }}
                >
                  Promo codes are applied during checkout. Do not share codes publicly—they are tracked and revoked if abused.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 09 — FAQ ACCORDION
        ================================================================ */}
        <section id="for-schools" className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
          <div className="p-7 sm:p-12" style={{ border: "1px solid var(--border-grid)", background: "var(--bg-surface)" }}>
            <div className="font-mono text-xs font-bold tracking-[0.16em] uppercase mb-3" style={{ color: "var(--signal-warn)" }}>
              ⌈ NO FLUFF. JUST HOW IT WORKS. ⌋
            </div>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-text-primary uppercase leading-[1.25] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderTop: "1px solid var(--border-grid)" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <span className="font-mono text-xs sm:text-sm text-text-primary font-bold">{faq.q}</span>
                    <span className="font-mono shrink-0 ml-4" style={{ color: "var(--signal-warn)" }}>
                      {openFaq === i ? "[ − ]" : "[ + ]"}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div
                      className="px-5 pb-5 font-sans text-sm text-text-secondary leading-relaxed"
                      style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-canvas)" }}
                    >
                      <div className="pt-4">{faq.a}</div>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border-grid)" }} />
            </div>
          </div>
        </section>

        {/* 100vw full-bleed divider above the Final Callout */}
        <div className="w-full border-t border-[var(--border-grid)] mb-0" />

        {/* ================================================================
            SECTION 10 — FINAL MANIFESTO CALLOUT (OPEN-CAGE RHYTHM)
        ================================================================ */}
        <section id="manifesto" className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <div className="text-center space-y-6">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2">
              ⌈ CANONICAL UNCLE DRILL MANIFESTO ⌋
            </div>
            <blockquote
              className="font-display font-bold text-xl sm:text-3xl text-text-primary uppercase leading-[1.3] mx-auto"
              style={{ maxWidth: "50ch" }}
            >
              &ldquo;YOU CANNOT RUN AWAY FROM THE FUNDAMENTALS. THEY ARE THE BUILDING BLOCKS OF EVERYTHING ELSE.&rdquo;
            </blockquote>
            <p className="font-sans text-sm text-text-secondary mx-auto" style={{ maxWidth: "50ch" }}>
              Start with Milestone 1.1 Field Manual + 3 Days in Uncle&apos;s Study Room + 1 Proctored Drill Attempt — 100% Free. No credit card required.
            </p>
            {/* Section 09 corrected button copy */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#interactive-stage"
                onClick={() => setPreviewTab(3)}
                className="font-bold font-mono text-sm px-8 py-4 uppercase tracking-wider mech-btn"
                style={{ background: "var(--signal-cta)", color: "var(--text-inverse)" }}
              >
                [ DRILL ME -&gt; ]
              </a>
              <a
                href="#interactive-stage"
                onClick={() => setPreviewTab(1)}
                className="font-mono text-sm px-7 py-4 uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
                style={{ border: "1px solid var(--border-grid)" }}
              >
                &gt; VIEW TASK &amp; CHECKLIST
              </a>
            </div>
          </div>
        </section>

        {/* 100vw full-bleed divider above the Footer */}
        <div className="w-full border-t border-[var(--border-grid)]" />

        {/* 4-Column Footer (Open Negative Space) */}
        <footer className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 pt-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 font-mono text-xs">
            <div>
              <div className="font-display font-bold text-text-primary text-sm mb-4">■ UNCLE_DRILL</div>
              <p className="text-text-muted leading-relaxed font-sans text-[11px]">
                Mastery Audit &amp; Accountability Engine for backend engineers who take fundamentals seriously.
              </p>
            </div>
            {/* PLATFORM column uses exact public links; Design System removed per spec */}
            <div>
              <div className="text-text-muted uppercase tracking-hud mb-4">Platform</div>
              <ul className="space-y-2">
                <li><a href="#curriculum" className="text-text-secondary hover:text-signal-cta transition-colors">Curriculum</a></li>
                <li><a href="/verify/demo" className="text-text-secondary hover:text-signal-cta transition-colors">Sample Certificate</a></li>
                <li><a href="#pricing" className="text-text-secondary hover:text-signal-cta transition-colors">Pricing</a></li>
                <li><Link href="/login" className="text-text-secondary hover:text-signal-cta transition-colors">Log In</Link></li>
                <li><Link href="/signup" className="text-text-secondary hover:text-signal-cta transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-text-muted uppercase tracking-hud mb-4">Organizations</div>
              <ul className="space-y-2">
                {["For Schools", "For Bootcamps", "For Engineering Teams", "Partner Portal"].map((l) => (
                  <li key={l}><a href="#" className="text-text-secondary hover:text-signal-cta transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-text-muted uppercase tracking-hud mb-4">Legal</div>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Refund Policy", "Contact"].map((l) => (
                  <li key={l}><a href="#" className="text-text-secondary hover:text-signal-cta transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className="mt-10 pt-6 font-mono text-[10px] text-text-muted flex flex-wrap items-center justify-between gap-2"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <span>© 2026 UNCLE_DRILL. ALL RIGHTS RESERVED.</span>
            <span>BUILT WITH: Next.js 15 // Tailwind CSS v3 // nuqs</span>
          </div>
        </footer>

      </div>
    </>
  );
}
