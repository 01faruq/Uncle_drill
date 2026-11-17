"use client";

/**
 * @purpose Interactive terminal intercept showcasing Uncle Drill's authentic African Uncle voice across 3 roast levels.
 * @security Sanitizes rendered terminal text; demonstrates deterministic gate failure logic.
 * @reference docs/07_UX_WRITING_AND_VOICE.md (Section 1: Speech Mechanics) & docs/06_UI_DESIGN_SYSTEM.md
 */
import * as React from "react";
import { useQueryState, parseAsStringLiteral } from "nuqs";

const ROAST_LEVELS = ["1", "2", "3"] as const;
type RoastLevel = (typeof ROAST_LEVELS)[number];

const roastParser = parseAsStringLiteral(ROAST_LEVELS).withDefault("2");

interface RoastContent {
  levelBadge: string;
  badgeColor: string;
  title: string;
  quote: string;
}

const ROAST_DATA: Record<RoastLevel, RoastContent> = {
  "1": {
    levelBadge: "ROAST LVL 1 // CONSTRUCTIVE MENTOR",
    badgeColor: "text-signal-info border-signal-info",
    title: "CONSTRUCTIVE COACHING",
    quote:
      "You redirected stdout cleanly with '> out.txt', but you forgot that bash sends errors to file descriptor 2 (stderr). In production, your error logs would vanish into thin air. Check 'man bash' under Redirection and re-run with '2>&1'.",
  },
  "2": {
    levelBadge: "ROAST LVL 2 // STRICT UNCLE",
    badgeColor: "text-signal-warn border-signal-warn",
    title: "STRICT UNCLE",
    quote:
      "Chinedu. Look at your screen. You had seven days to learn standard streams, and you still don't know why '> out.txt' only redirects file descriptor 1? Even a plumber understands pipes better than this. Open 'man bash' before I price a table for you at Computer Village.",
  },
  "3": {
    levelBadge: "ROAST LVL 3 // NO MERCY",
    badgeColor: "text-signal-fault border-signal-fault",
    title: "NO MERCY LOCKOUT",
    quote:
      "Chinedu. Look at me. You came to my terminal with ChatGPT-generated confidence and couldn't even separate stdout from stderr. Who told you that you are ready for a DevOps job? Go back to Milestone 1.1 Field Manual before I revoke your terminal access permanently!",
  },
};

export function RoastPreviewTerminal() {
  const [roast, setRoast] = useQueryState("roast", roastParser);
  const current = ROAST_DATA[roast];

  return (
    <div className="w-full bg-[#030304] border border-border-grid font-mono text-xs select-text">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-border-grid">
        <span className="text-[11px] font-semibold text-text-primary tracking-hud uppercase flex items-center gap-2">
          <span className="w-2 h-2 bg-signal-warn animate-pulse" />
          LIVE TELEMETRY INTERCEPT // MILESTONE 1.1
        </span>
        <div className="flex items-center gap-1">
          {ROAST_LEVELS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setRoast(lvl)}
              className={`px-2 py-0.5 text-[10px] uppercase font-bold border transition-colors ${
                roast === lvl
                  ? "bg-signal-warn text-text-inverse border-signal-warn"
                  : "bg-canvas text-text-muted border-border-grid hover:text-text-primary"
              }`}
            >
              LVL {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal logs */}
      <div className="p-4 space-y-3">
        <div className="text-text-muted">
          <span className="text-signal-pass">student@uncle-drill:~$</span> ./log_analyzer.sh &gt; out.txt
        </div>
        <div className="text-signal-fault leading-relaxed">
          [20:17:21] GATE_1_FAULT: stderr (fd 2) leaked to screen. Exit code: 0 on missing log target.
        </div>
        <div className="text-text-muted">
          [20:17:22] TELEMETRY: Uncle Drill Auditor Brain engaged. Analyzing candidate response...
        </div>

        {/* Dynamic Uncle Drill Quote Box */}
        <div className="mt-4 p-3 bg-canvas border-l-2 border-signal-warn text-text-primary space-y-2">
          <div className="flex items-center justify-between text-[10px] tracking-hud uppercase">
            <span className="font-bold text-signal-warn">UNCLE DRILL [{current.title}]:</span>
            <span className="text-text-muted">ROAST LVL {roast}</span>
          </div>
          <p className="text-text-secondary leading-relaxed italic">
            &quot;{current.quote}&quot;
          </p>
        </div>
      </div>

      {/* Terminal prompt footer */}
      <div className="px-4 py-2 border-t border-border-grid bg-surface/50 text-[11px] text-text-muted flex items-center justify-between">
        <span>STATUS: GATE 1 BLOCKED</span>
        <span className="text-signal-cta font-bold">RETRY AFTER FIXING STREAMS</span>
      </div>
    </div>
  );
}
