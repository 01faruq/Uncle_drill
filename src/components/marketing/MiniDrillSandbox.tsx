"use client";

/**
 * @purpose Interactive 60-second mini-drill letting prospective students experience an authentic terminal audit.
 * @security Client simulation only; does not execute untrusted commands on server host.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 2: Stage 1 First-Principles Warmup)
 */
import * as React from "react";
import { useQueryState } from "nuqs";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { DrillButton } from "@/components/ui/industrial/DrillButton";

const OPTIONS = [
  {
    id: "a",
    label: "set -e",
    explanation: "INCORRECT. 'set -e' alone ignores failures in the left side of a pipe! 'false | echo ok' still returns 0.",
    isCorrect: false,
  },
  {
    id: "b",
    label: "set -euo pipefail",
    explanation: "CORRECT! 'pipefail' forces the pipeline to inherit the rightmost non-zero exit code. Essential in production.",
    isCorrect: true,
  },
  {
    id: "c",
    label: "export FAIL_ON_ERROR=1",
    explanation: "INCORRECT. That is not a valid bash builtin variable. You are hallucinating environment variables, bro.",
    isCorrect: false,
  },
  {
    id: "d",
    label: "trap 'exit' ERR",
    explanation: "INCORRECT. A trap does not catch subshell pipe failures unless pipefail or inherit_errexit is already enabled.",
    isCorrect: false,
  },
];

export function MiniDrillSandbox() {
  const [selectedId, setSelectedId] = useQueryState("miniDrill");
  const activeOption = OPTIONS.find((o) => o.id === selectedId);

  return (
    <div className="w-full bg-[#030304] border border-border-grid font-mono text-xs text-text-primary p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-grid pb-4 mb-4">
        <div>
          <HudBracketHeader variant="pass">INTERACTIVE 60-SECOND MINI-DRILL</HudBracketHeader>
          <div className="text-sm font-bold text-text-primary mt-1">
            TEST YOUR Bedrock FUNDAMENTALS BEFORE YOU SIGN UP
          </div>
        </div>
        <span className="text-[11px] text-signal-cta font-bold">
          [ 00 CHEAT STRIKES // LIVE AUDIT ]
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-canvas border border-border-grid p-4 text-text-secondary leading-relaxed">
          <span className="text-text-muted select-none block mb-2">[STAGE 1: FIRST-PRINCIPLES QUESTION]</span>
          <p className="text-text-primary font-semibold">
            In standard bash, running <code className="text-signal-pass bg-surface px-1.5 py-0.5 border border-border-subtle">false | echo &apos;hello&apos;</code> prints &apos;hello&apos; and exits with code 0, completely masking the failure. Which directive forces the pipeline to exit with a non-zero code if ANY command in the pipeline fails?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedId(opt.id)}
              className={`p-3 text-left border font-mono text-xs flex items-center justify-between transition-colors ${
                selectedId === opt.id
                  ? opt.isCorrect
                    ? "bg-surface border-signal-pass text-signal-pass"
                    : "bg-surface border-signal-fault text-signal-fault"
                  : "bg-surface border-border-grid hover:border-text-primary text-text-primary"
              }`}
            >
              <span>
                <strong className="mr-2 uppercase">[{opt.id}]</strong> {opt.label}
              </span>
              {selectedId === opt.id && (
                <span>{opt.isCorrect ? "✓ PASS" : "✕ FAULT"}</span>
              )}
            </button>
          ))}
        </div>

        {activeOption && (
          <div
            className={`p-4 border-l-2 bg-surface text-xs leading-relaxed ${
              activeOption.isCorrect
                ? "border-signal-pass text-signal-pass"
                : "border-signal-fault text-signal-fault"
            }`}
          >
            <div className="font-bold uppercase tracking-wider mb-1">
              {activeOption.isCorrect ? "UNCLE DRILL AUDIT: PASSED" : "UNCLE DRILL ROAST: FAILED"}
            </div>
            <p className="text-text-secondary">
              {activeOption.explanation}
            </p>
            {activeOption.isCorrect && (
              <div className="mt-3 pt-2 border-t border-border-grid text-[11px] text-signal-cta font-bold">
                &quot;Hmm. Not bad, bro. You actually know standard pipeline safety. Now prove you can write log_analyzer.sh from scratch in Milestone 1.1.&quot;
              </div>
            )}
          </div>
        )}

        {selectedId && (
          <div className="flex justify-end pt-2">
            <DrillButton
              variant="terminal"
              size="sm"
              onClick={() => setSelectedId(null)}
            >
              RESET MINI-DRILL
            </DrillButton>
          </div>
        )}
      </div>
    </div>
  );
}
