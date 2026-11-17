"use client";

/**
 * @purpose Developer visual audit route verifying design system tokens, typography, and industrial primitives.
 * @security Internal developer preview; zero sensitive data exposed.
 * @reference docs/06_UI_DESIGN_SYSTEM.md (Anti-Slop UI & Token Verification)
 */
import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";
import { StructuralGrid } from "@/components/ui/industrial/StructuralGrid";
import { GridCell } from "@/components/ui/industrial/GridCell";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { AsciiDivider } from "@/components/ui/industrial/AsciiDivider";
import { DrillButton } from "@/components/ui/industrial/DrillButton";
import { TelemetryLogStream, LogEntry } from "@/components/ui/industrial/TelemetryLogStream";
import { BottomTelemetryBar } from "@/components/ui/industrial/BottomTelemetryBar";

const SAMPLE_LOGS: LogEntry[] = [
  { timestamp: "20:17:21", level: "error", message: "GATE_1_FAULT: stderr (fd 2) leaked to screen" },
  { timestamp: "20:17:43", level: "info", message: "GATE 1: CHECKING STDERR REDIRECTION (fd 2)..." },
  { timestamp: "20:17:44", level: "pass", message: "VERIFIED: EXIT CODE 1 CONFIRMED [PASS]" },
  { timestamp: "20:18:02", level: "warn", message: "UNCLE DRILL [SKEPTICAL SQUINT]: Question 2 skipped" },
];

function DesignSystemContent() {
  const { theme, toggleTheme } = useTheme();
  const [logs, setLogs] = React.useState<LogEntry[]>(SAMPLE_LOGS);
  const [btnLoading, setBtnLoading] = React.useState(false);

  const addTestLog = () => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      {
        timestamp: time,
        level: "pass",
        message: `TELEMETRY EVENT: Test verification logged at ${time}`,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-canvas text-text-primary pb-16">
      {/* Top audit bar */}
      <header className="h-12 border-b border-border-grid bg-surface px-4 flex items-center justify-between font-mono text-xs select-none sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-text-secondary hover:text-signal-cta font-bold">
            &larr; BACK TO LANDING
          </Link>
          <span className="text-border-grid">|</span>
          <span className="font-display text-sm uppercase">DESIGN SYSTEM &amp; ANTI-SLOP AUDIT</span>
        </div>
        <div className="flex items-center gap-2">
          <DrillButton variant="terminal" size="sm" onClick={toggleTheme}>
            TOGGLE THEME [{theme.toUpperCase()}]
          </DrillButton>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* SECTION 1: ATMOSPHERE & COLOR TOKENS */}
        <section className="space-y-4">
          <HudBracketHeader variant="primary">TOKEN PALETTE // VON RESTORFF ISOLATION</HudBracketHeader>
          <p className="font-sans text-xs text-text-secondary max-w-2xl">
            95% monochrome architecture + 5% functional signal accents. Color is strictly a system state indicator, never decorative.
          </p>

          <StructuralGrid columns={6}>
            <GridCell padding="sm" className="bg-canvas border border-border-grid">
              <span className="font-mono text-[10px] text-text-muted block">CANVAS</span>
              <span className="font-mono text-xs font-bold">#060607</span>
            </GridCell>
            <GridCell padding="sm" className="bg-surface border border-border-grid">
              <span className="font-mono text-[10px] text-text-muted block">SURFACE</span>
              <span className="font-mono text-xs font-bold">#0C0C0E</span>
            </GridCell>
            <GridCell padding="sm" className="bg-signal-cta text-text-inverse border border-signal-cta">
              <span className="font-mono text-[10px] opacity-75 block">CTA ACID</span>
              <span className="font-mono text-xs font-bold">#D4FF00</span>
            </GridCell>
            <GridCell padding="sm" className="bg-signal-pass text-text-inverse border border-signal-pass">
              <span className="font-mono text-[10px] opacity-75 block">PASS GREEN</span>
              <span className="font-mono text-xs font-bold">#00FF66</span>
            </GridCell>
            <GridCell padding="sm" className="bg-signal-warn text-text-inverse border border-signal-warn">
              <span className="font-mono text-[10px] opacity-75 block">WARN AMBER</span>
              <span className="font-mono text-xs font-bold">#FF9500</span>
            </GridCell>
            <GridCell padding="sm" className="bg-signal-fault text-text-inverse border border-signal-fault">
              <span className="font-mono text-[10px] opacity-75 block">FAULT RED</span>
              <span className="font-mono text-xs font-bold">#FF2E2E</span>
            </GridCell>
          </StructuralGrid>
        </section>

        {/* SECTION 2: TYPOGRAPHY HIERARCHY */}
        <section className="space-y-4">
          <HudBracketHeader variant="warn">TYPOGRAPHY HIERARCHY SCALE</HudBracketHeader>
          <div className="border border-border-grid bg-surface p-6 space-y-6">
            <div>
              <span className="font-mono text-[11px] text-text-muted uppercase tracking-hud block mb-1">
                --font-display (Silkscreen) // Display XL
              </span>
              <div className="font-display text-3xl sm:text-4xl uppercase">
                YOU CAN LIE TO THE WORLD.
              </div>
            </div>
            <div className="border-t border-border-grid pt-4">
              <span className="font-mono text-[11px] text-text-muted uppercase tracking-hud block mb-1">
                --font-mono (Geist Mono) // Terminal Labels &amp; Controls
              </span>
              <div className="font-mono text-xs text-signal-pass">
                [20:17:44] &gt;&gt; VERIFIED: EXIT CODE 1 CONFIRMED [PASS]
              </div>
            </div>
            <div className="border-t border-border-grid pt-4">
              <span className="font-mono text-[11px] text-text-muted uppercase tracking-hud block mb-1">
                --font-sans (Geist Sans) // Long-Form Disaster Prose
              </span>
              <p className="font-sans text-sm text-text-secondary max-w-2xl leading-relaxed">
                In 2017, an engineer ran a backup cleanup script without checking set -euo pipefail. 300GB of production data was deleted before the command returned an error code. Real engineers do not guess terminal pipes.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: 6 INDUSTRIAL PRIMITIVES SHOWCASE */}
        <section className="space-y-6">
          <HudBracketHeader variant="pass">SIGNATURE INDUSTRIAL PRIMITIVES</HudBracketHeader>

          {/* 1. StructuralGrid & GridCell */}
          <div className="space-y-2">
            <span className="font-mono text-xs text-text-muted">01. StructuralGrid &amp; GridCell (1px Hairline Grid)</span>
            <StructuralGrid columns={3}>
              <GridCell padding="md">
                <span className="font-mono text-[11px] text-text-muted uppercase">SURFACE CELL</span>
                <p className="font-sans text-xs text-text-secondary mt-1">1px hairlines without double-border bugs.</p>
              </GridCell>
              <GridCell dotMatrix padding="md">
                <span className="font-mono text-[11px] text-signal-warn uppercase">DOT-MATRIX CELL</span>
                <p className="font-sans text-xs text-text-secondary mt-1">Subtle 16px grid background pattern.</p>
              </GridCell>
              <GridCell variant="canvas" padding="md">
                <span className="font-mono text-[11px] text-text-muted uppercase">CANVAS CELL</span>
                <p className="font-sans text-xs text-text-secondary mt-1">Deep terminal void background.</p>
              </GridCell>
            </StructuralGrid>
          </div>

          {/* 2. HudBracketHeader */}
          <div className="space-y-2">
            <span className="font-mono text-xs text-text-muted">02. HudBracketHeader (Kessler Targeting Brackets)</span>
            <div className="border border-border-grid bg-surface p-4 flex flex-wrap gap-4 items-center">
              <HudBracketHeader variant="warn">WARN AMBER BRACKET</HudBracketHeader>
              <HudBracketHeader variant="pass">PASS EMERALD BRACKET</HudBracketHeader>
              <HudBracketHeader variant="fault">FAULT CRIMSON BRACKET</HudBracketHeader>
              <HudBracketHeader variant="primary">PRIMARY BONE BRACKET</HudBracketHeader>
              <HudBracketHeader variant="info">INFO VOXEL CYAN BRACKET</HudBracketHeader>
            </div>
          </div>

          {/* 3. AsciiDivider */}
          <div className="space-y-2">
            <span className="font-mono text-xs text-text-muted">03. AsciiDivider (Waveform &amp; Dashed Terminal Rules)</span>
            <div className="space-y-3">
              <AsciiDivider label="WAVEFORM_DIVIDER" variant="waveform" />
              <AsciiDivider label="DASHED_RULE" variant="dashed" />
              <AsciiDivider label="DOTTED_RULE" variant="dotted" />
            </div>
          </div>

          {/* 4. DrillButton */}
          <div className="space-y-2">
            <span className="font-mono text-xs text-text-muted">04. DrillButton (High-Contrast Tactile Triggers)</span>
            <div className="border border-border-grid bg-surface p-6 flex flex-wrap gap-3 items-center">
              <DrillButton variant="acid" size="md" arrow>
                PRIMARY ACID CTA
              </DrillButton>
              <DrillButton variant="terminal" size="md">
                &gt; TERMINAL GHOST
              </DrillButton>
              <DrillButton variant="danger" size="md">
                ! TERMINATE EARLY
              </DrillButton>
              <DrillButton variant="paper" size="md">
                BONE PAPER INK
              </DrillButton>
              <DrillButton
                variant="acid"
                size="md"
                isLoading={btnLoading}
                onClick={() => {
                  setBtnLoading(true);
                  setTimeout(() => setBtnLoading(false), 2000);
                }}
              >
                TEST DOUBLE-CLICK LOCK
              </DrillButton>
            </div>
          </div>

          {/* 5. TelemetryLogStream */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-text-muted">05. TelemetryLogStream (Timestamped Mission Logs)</span>
              <DrillButton variant="terminal" size="sm" onClick={addTestLog}>
                + EMIT TELEMETRY EVENT
              </DrillButton>
            </div>
            <TelemetryLogStream logs={logs} />
          </div>

          {/* 6. Link to Sovereign Certificate Preview */}
          <div className="border border-border-grid bg-surface p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <HudBracketHeader variant="primary">OFF-GRID BONE PAPER ATMOSPHERE</HudBracketHeader>
              <div className="font-display text-xl text-text-primary mt-1">
                MINT-GRADE SOVEREIGN CERTIFICATE DOSSIER
              </div>
              <p className="font-sans text-xs text-text-secondary mt-1">
                Verifiable cryptographic proof of work formatted like an iconic engineering blueprint.
              </p>
            </div>
            <Link href="/verify/demo">
              <DrillButton variant="acid" size="md" arrow>
                [ VIEW CERTIFICATE PREVIEW ]
              </DrillButton>
            </Link>
          </div>
        </section>
      </main>

      <Suspense fallback={null}>
        <BottomTelemetryBar />
      </Suspense>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <DesignSystemContent />
    </Suspense>
  );
}
