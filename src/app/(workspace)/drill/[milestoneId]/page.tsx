/**
 * @purpose Desktop-Locked 3-Panel Drill Room Shell.
 *   Wrapped strictly inside DesktopDrillGuard to enforce the desktop-only terminal contract.
 * @security DesktopDrillGuard physically replaces touchscreen viewports with the 403 Lockout HUD.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Adaptive Desktop vs Mobile Contract)
 */
import React from "react";
import Link from "next/link";
import { DesktopDrillGuard } from "@/components/drill-room/DesktopDrillGuard";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { DrillButton } from "@/components/ui/industrial/DrillButton";

export default async function DrillRoomPage({
  params,
}: {
  params: Promise<{ milestoneId: string }>;
}) {
  const { milestoneId } = await params;

  return (
    <DesktopDrillGuard milestoneId={milestoneId}>
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-6 flex flex-col justify-between">
        {/* Top Precision HUD */}
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HudBracketHeader variant="pass">
              DRILL TERMINAL // ACTIVE
            </HudBracketHeader>
            <span className="font-mono text-xs text-signal-cta font-bold">
              [ MILESTONE: {milestoneId} ]
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-[var(--text-muted)]">
            <span>TIMER: 25:00</span>
            <span>STRIKES: 0/2</span>
            <Link href="/roadmap">
              <span className="text-signal-fault hover:underline cursor-pointer">
                [ ABORT DRILL ]
              </span>
            </Link>
          </div>
        </div>

        {/* 3-Panel Placeholder Shell */}
        <div className="my-6 grid grid-cols-12 gap-4 flex-1">
          {/* Panel 1: Task Checklist */}
          <div className="col-span-3 border border-[var(--border-grid)] bg-[var(--bg-surface)] p-4 font-mono text-xs">
            <span className="text-signal-cta font-bold block mb-2">
              ⌈ 01. NON-NEGOTIABLES ⌋
            </span>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Task brief, time limits, and objective sandbox requirements.
            </p>
          </div>

          {/* Panel 2: xterm.js / v86 Terminal */}
          <div className="col-span-6 border border-[var(--border-grid)] bg-[#030304] p-4 font-mono text-xs text-signal-cta flex flex-col justify-between">
            <div>
              <span className="text-[var(--text-muted)] block mb-2">
                [ LINUX V86 WASM SHELL // INITIALIZING IN SLICE 3 ]
              </span>
              <p className="text-emerald-400">cadet@uncle-drill:~$ _</p>
            </div>
            <div className="border-t border-[var(--border-grid)] pt-2 text-[10px] text-[var(--text-muted)]">
              SANDBOX: v86_LINUX_ISOLATED | NETWORK: ISOLATED (--network=none)
            </div>
          </div>

          {/* Panel 3: Uncle Drill Live Auditor */}
          <div className="col-span-3 border border-[var(--border-grid)] bg-[var(--bg-surface)] p-4 font-mono text-xs flex flex-col justify-between">
            <div>
              <span className="text-signal-warn font-bold block mb-2">
                ⌈ 03. UNCLE DRILL AUDITOR ⌋
              </span>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Uncle Drill is waiting for your defense.
              </p>
            </div>
            <Link href="/roadmap" className="w-full">
              <DrillButton variant="terminal" size="sm" className="w-full">
                &lt; BACK TO ROADMAP
              </DrillButton>
            </Link>
          </div>
        </div>

        {/* Footer Telemetry Bar */}
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-2 px-4 flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)]">
          <span>DESKTOP TERMINAL ENGINE: READY</span>
          <span>LATENCY: 12ms</span>
        </div>
      </div>
    </DesktopDrillGuard>
  );
}
