/**
 * @purpose 5-Phase curriculum syllabus explorer previewing Phase 1 milestones and Phases 2-5 archive roadmap.
 * @security Presentational view of public curriculum metadata.
 * @reference docs/03_CURRICULUM_RUBRICS.md & docs/06_UI_DESIGN_SYSTEM.md (Screen B: The 5-Phase Roadmap)
 */
import * as React from "react";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { StructuralGrid } from "@/components/ui/industrial/StructuralGrid";
import { GridCell } from "@/components/ui/industrial/GridCell";
import { DrillButton } from "@/components/ui/industrial/DrillButton";

const PHASE_1_MILESTONES = [
  {
    index: "01",
    id: "1.1",
    title: "UBUNTU SERVER SURVIVAL",
    description: "stdin, stdout, stderr (2>&1), exit codes ($?), set -euo pipefail, permissions (chmod/chown), and log parsing.",
    nonNegotiablesCount: 3,
    disasterStory: "2017 GitLab 300GB Production DB wipe from unverified bash rm -rf.",
    status: "LIVE_IN_V1",
  },
  {
    index: "02",
    id: "1.2",
    title: "GIT INTERNALS & DAGS",
    description: "Blobs, trees, commits, HEAD vs Index, reset --hard vs revert, interactive rebase, and 90-second reflog rescue.",
    nonNegotiablesCount: 3,
    disasterStory: "Accidental git push --force overwriting 4 weeks of team sprint commits.",
    status: "LIVE_IN_V1",
  },
  {
    index: "03",
    id: "1.3",
    title: "PROCEDURAL PYTHON & PDB",
    description: "Pass-by-object-reference, default mutable argument traps, argparse, logging vs print, and interactive pdb bug hunt.",
    nonNegotiablesCount: 3,
    disasterStory: "Mutable default list parameter accumulating state across 10,000 requests.",
    status: "LIVE_IN_V1",
  },
  {
    index: "04",
    id: "1.4",
    title: "2026 PYTHON: UV, RUFF, MYPY",
    description: "Composition over inheritance, @dataclass, typing.Protocol, uv packaging, strict mypy typing, and pytest parameterized tests.",
    nonNegotiablesCount: 4,
    disasterStory: "Silent runtime AttributeError in production after a third-party dependency update.",
    status: "LIVE_IN_V1",
  },
];

const ROADMAP_PHASES = [
  {
    phase: "PHASE 02",
    title: "C Pointers, Memory Layout, Concurrency & PostgreSQL Internals",
    signatureDrill: "20-Thread Double-Spend Race Condition & EXPLAIN ANALYZE (<5ms)",
    aiPolicy: "STRICT_NO_AI",
  },
  {
    phase: "PHASE 03",
    title: "AsyncIO Event Loop, Production FastAPI & SQLAlchemy 2.0",
    signatureDrill: "'Spot the AI Slop' 180-Line PR Audit (N+1 query & Webhook HMAC)",
    aiPolicy: "CONTROLLED_AI",
  },
  {
    phase: "PHASE 04",
    title: "Multi-Stage Docker, CI/CD, Redis & Cloud Capstone",
    signatureDrill: "Live Chaos Drill: Redis Container Killed Under 200 req/s Load",
    aiPolicy: "CONTROLLED_AI",
  },
  {
    phase: "PHASE 05",
    title: "Polyglot Systems Mastery (Track A: Go / Track B: Rust)",
    signatureDrill: "Rebuild Concurrent Worker Pool (Go) or RESP Parser (Rust)",
    aiPolicy: "PRINCIPAL_DEFENSE",
  },
];

export function CurriculumSyllabusPreview() {
  return (
    <div className="w-full space-y-6">
      <div className="border border-border-grid bg-surface p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <HudBracketHeader variant="primary">5-PHASE COMPREHENSIVE ROADMAP</HudBracketHeader>
            <h2 className="font-display text-2xl sm:text-3xl text-text-primary mt-2 uppercase">
              PHASE 01: SYSTEMS FOUNDATIONS // LINUX, GIT &amp; PYTHON
            </h2>
            <p className="font-sans text-sm text-text-secondary mt-1">
              Every milestone requires 100% on Non-Negotiables and &ge;75% weighted score to pass.
            </p>
          </div>
          <div className="text-right font-mono text-xs text-text-muted">
            <span className="text-signal-cta font-bold">12 WEEKS</span> • 8 HRS/WEEK COMMITMENT
          </div>
        </div>
      </div>

      {/* 4 Phase 1 Milestone Cards */}
      <StructuralGrid columns={4}>
        {PHASE_1_MILESTONES.map((m) => (
          <GridCell key={m.id} padding="md" className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[10px] text-signal-pass font-bold tracking-hud uppercase">
                  MILESTONE {m.id} // {m.status}
                </span>
                <span className="font-display text-3xl text-text-muted">{m.index}</span>
              </div>
              <h3 className="font-mono text-sm font-bold text-text-primary mb-2">
                {m.title}
              </h3>
              <p className="font-sans text-xs text-text-secondary leading-relaxed mb-4">
                {m.description}
              </p>
            </div>

            <div className="border-t border-border-grid pt-3 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-text-muted">
                <span>NON-NEGOTIABLES:</span>
                <span className="text-signal-warn font-bold">{m.nonNegotiablesCount} Core Checks</span>
              </div>
              <div className="text-text-muted text-[10px] leading-tight">
                <strong className="text-signal-fault">DISASTER:</strong> {m.disasterStory}
              </div>
            </div>
          </GridCell>
        ))}
      </StructuralGrid>

      {/* Archive Table for Phases 2 - 5 */}
      <div className="border border-border-grid bg-canvas p-6">
        <span className="font-mono text-[11px] text-text-muted tracking-hud uppercase block mb-3">
          ADVANCED PHASES ARCHIVE // UNLOCKS AFTER PHASE 01 CHECKPOINT
        </span>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-grid text-text-muted">
                <th className="py-2 px-3">PHASE</th>
                <th className="py-2 px-3">CORE DOMAIN</th>
                <th className="py-2 px-3">SIGNATURE SANDBOX DRILL</th>
                <th className="py-2 px-3">AI POLICY</th>
                <th className="py-2 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {ROADMAP_PHASES.map((p) => (
                <tr key={p.phase} className="hover:bg-elevated transition-colors text-text-secondary">
                  <td className="py-3 px-3 font-bold text-signal-info">{p.phase}</td>
                  <td className="py-3 px-3 text-text-primary">{p.title}</td>
                  <td className="py-3 px-3 text-text-muted">{p.signatureDrill}</td>
                  <td className="py-3 px-3 font-semibold text-[10px]">{p.aiPolicy}</td>
                  <td className="py-3 px-3 text-text-muted">[LOCKED]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
