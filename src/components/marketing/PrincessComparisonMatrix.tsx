/**
 * @purpose Structural comparison matrix contrasting generic tutorial hell vs Uncle Drill engineering reality.
 * @security Pure presentational component highlighting platform differentiation and pedagogy.
 * @reference docs/01_FOUNDER_VISION.md & docs/06_UI_DESIGN_SYSTEM.md
 */
import * as React from "react";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";

const COMPARISON_ROWS = [
  {
    feature: "GRADING & FEEDBACK",
    fragile: "Gentle hints, confetti animations, unlimited retries with zero stakes.",
    uncle: "Raw stderr output. Deterministic exit code audits. African Uncle roasts when you guess.",
  },
  {
    feature: "AI POLICY (PHASES 1-2)",
    fragile: "AI writes the code for you while you nod along and vibe-code into obsolescence.",
    uncle: "Zero AI Autocomplete in the terminal. You must write every line from first principles.",
  },
  {
    feature: "THE SANDBOX",
    fragile: "Toy browser iframe with simulated fake terminals that fail on real Unix pipelines.",
    uncle: "Isolated Linux sandbox (--network=none) watching file descriptors, exit codes, and pipes.",
  },
  {
    feature: "ACCOUNTABILITY",
    fragile: "Ghost for three months with zero check-ins. Your subscription renews quietly.",
    uncle: "Proactive 48-hour email nudges. Weekly Commitment Contracts. Strike lockout if you cheat.",
  },
  {
    feature: "CREDENTIAL VALUE",
    fragile: "Generic completion badge that recruiters ignore as copy-paste participation trophies.",
    uncle: "Mint-Grade Sovereign Certificate with 4-Pillar Scorecard, SHA-256 seal, and 0 Cheat Strikes.",
  },
];

export function EngineeringRealityMatrix() {
  return (
    <div className="w-full bg-surface border border-border-grid">
      <div className="p-6 border-b border-border-grid">
        <HudBracketHeader variant="warn">THE TUTORIAL ILLUSION</HudBracketHeader>
        <h2 className="font-display text-2xl sm:text-3xl text-text-primary mt-2 uppercase">
          NO FRAGILE TUTORIALS. REAL BACKEND REALITY.
        </h2>
        <p className="font-sans text-sm text-text-secondary mt-2 max-w-3xl leading-relaxed">
          Modern tutorials flatter you into believing you understand systems because you watched someone else build them. 
          When production crashes at 2 AM on AWS, there is no AI autocomplete to hold your hand.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-grid bg-canvas text-text-muted">
              <th className="p-4 w-1/4 uppercase tracking-hud font-bold">PILLAR</th>
              <th className="p-4 w-3/8 text-signal-fault uppercase tracking-hud font-bold">
                ✕ FRAGILE TUTORIALS
              </th>
              <th className="p-4 w-3/8 text-signal-pass uppercase tracking-hud font-bold">
                ✓ UNCLE DRILL ENGINE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature} className="hover:bg-elevated transition-colors">
                <td className="p-4 font-bold text-text-primary tracking-wider text-[11px]">
                  {row.feature}
                </td>
                <td className="p-4 text-text-secondary leading-relaxed border-l border-border-subtle">
                  {row.fragile}
                </td>
                <td className="p-4 text-text-primary bg-highlight/30 leading-relaxed border-l border-border-grid">
                  <span className="font-semibold text-signal-pass mr-1">▶</span>
                  {row.uncle}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const PrincessComparisonMatrix = EngineeringRealityMatrix;
