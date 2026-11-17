/**
 * @purpose Interactive 5-Phase Workspace Roadmap Explorer.
 *   URL-synced phase tabs (?phase=1..5) with milestone cards, live checklist progress,
 *   and direct routes to /milestone/[milestoneId] (prep & checklist) and /study/[milestoneId] (Uncle's chat).
 * @security Edge Middleware-protected. Role-gated Command Room access for Super Admins only.
 * @reference docs/02_PRD_AND_ROADMAP.md, docs/04_SYSTEM_ARCHITECTURE.md
 */

import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPhases } from "@/lib/data/curriculum";
import { getAllMilestonesProgressAction } from "@/modules/curriculum/checklist-actions";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { DrillButton } from "@/components/ui/industrial/DrillButton";

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ phase?: string }>;
}) {
  const { phase: rawPhase } = await searchParams;
  const currentPhaseNum = parseInt(rawPhase || "1", 10) || 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Role Gate: Super Admin check
  let isSuperAdmin = false;
  if (user) {
    if (user.email?.toLowerCase() === "4sulymanumar@gmail.com") {
      isSuperAdmin = true;
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.role === "SUPER_ADMIN") {
        isSuperAdmin = true;
      }
    }
  }

  const phases = getPhases();
  const activePhase = phases.find((p) => p.phase === currentPhaseNum) || phases[0];
  const progressMap = await getAllMilestonesProgressAction();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Telemetry Header */}
        <div className="border-b border-[var(--border-grid)] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <HudBracketHeader variant="pass">
              PHASE 1–5 ENGINEERING ROADMAP // LIVE
            </HudBracketHeader>
            <h1 className="font-display text-2xl sm:text-4xl uppercase tracking-wider mt-2">
              BEDROCK CURRICULUM
            </h1>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              Select a Phase to explore the curriculum, prepare checklists, and enter Uncle Drill&apos;s Study Room.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <Link href="/command">
                <span className="font-mono text-xs text-signal-cta border border-signal-cta/40 px-3 py-1.5 bg-signal-cta/10 hover:bg-signal-cta hover:text-black transition-colors cursor-pointer rounded-none">
                  [ COMMAND ROOM ]
                </span>
              </Link>
            )}
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="font-mono text-xs text-signal-fault border border-[var(--border-grid)] px-3 py-1.5 hover:border-signal-fault transition-colors rounded-none cursor-pointer"
              >
                [ SIGN OUT ]
              </button>
            </form>
          </div>
        </div>

        {/* URL-Synced 5-Phase Tabs (?phase=1..5) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border border-[var(--border-grid)] p-2 bg-[var(--bg-surface)]">
          {phases.map((p) => {
            const isSelected = p.phase === activePhase.phase;
            return (
              <Link
                key={p.phase}
                href={`/roadmap?phase=${p.phase}`}
                className={`p-3 border text-left transition-colors flex flex-col justify-between ${
                  isSelected
                    ? "border-signal-cta bg-[var(--bg-canvas)] text-signal-cta font-bold"
                    : "border-transparent hover:border-[var(--border-grid)] text-[var(--text-muted)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] tracking-wider uppercase">
                    PHASE 0{p.phase}
                  </span>
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.2 border ${
                      p.status === "ACTIVE"
                        ? "border-signal-pass text-signal-pass"
                        : p.status === "PREVIEW"
                        ? "border-signal-cta text-signal-cta"
                        : "border-[var(--border-grid)] text-[var(--text-muted)]"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <span className="font-display text-xs uppercase line-clamp-1">
                  {p.title.split(": ")[1] || p.title}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Active Phase Information Dossier */}
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div>
              <span className="font-mono text-xs text-signal-cta uppercase font-bold tracking-wider">
                ⌈ {activePhase.title} ⌋
              </span>
              <h2 className="font-display text-lg uppercase tracking-wide mt-1">
                {activePhase.subtitle}
              </h2>
            </div>
            <div className="font-mono text-xs text-[var(--text-muted)] border border-[var(--border-grid)] px-3 py-1 bg-[var(--bg-canvas)] self-start sm:self-auto">
              STATUS: {activePhase.status}
            </div>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed max-w-3xl">
            {activePhase.description}
          </p>
        </div>

        {/* Milestone Grid for Active Phase */}
        {activePhase.milestones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePhase.milestones.map((m) => {
              const prog = progressMap[m.milestoneId];
              const completedReq = prog?.completedRequired || 0;
              const totalReq = prog?.totalRequired || m.checklist.filter((i) => i.category === "REQUIRED").length;
              const isUnlocked = prog?.isUnlocked || false;

              return (
                <div
                  key={m.milestoneId}
                  className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 flex flex-col justify-between hover:border-[var(--text-muted)] transition-colors"
                >
                  <div>
                    {/* Top Status HUD */}
                    <div className="flex items-center justify-between mb-3 border-b border-[var(--border-grid)] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-signal-cta font-bold">
                          MILESTONE {m.milestoneId}
                        </span>
                        <span className="text-[var(--border-grid)]">•</span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          {m.timeLimitMinutes} MIN DRILL
                        </span>
                      </div>

                      <span className="font-mono text-[10px] bg-emerald-950/60 text-signal-pass px-2 py-0.5 border border-signal-pass font-bold">
                        {m.status}
                      </span>
                    </div>

                    <h3 className="font-display text-base sm:text-lg uppercase mb-2">
                      {m.title}
                    </h3>
                    <p className="font-mono text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
                      {m.summary}
                    </p>

                    {/* Checklist Completion Badge */}
                    <div className="border border-[var(--border-grid)] bg-[var(--bg-canvas)] p-3 mb-6 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase">
                        PRE-DRILL READINESS:
                      </span>
                      <span
                        className={`font-mono text-xs font-bold ${
                          isUnlocked ? "text-signal-pass" : "text-signal-cta"
                        }`}
                      >
                        {completedReq}/{totalReq} ITEMS READY
                      </span>
                    </div>
                  </div>

                  {/* Dual Action Routing */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Link href={`/milestone/${m.milestoneId}`} className="w-full sm:flex-1">
                      <DrillButton variant="acid" size="sm" className="w-full">
                        [ PREPARE &amp; CHECKLIST -&gt; ]
                      </DrillButton>
                    </Link>
                    <Link href={`/study/${m.milestoneId}`} className="w-full sm:flex-1">
                      <DrillButton variant="terminal" size="sm" className="w-full">
                        &gt; UNCLE&apos;S STUDY ROOM
                      </DrillButton>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Preview / Locked Phase Placeholder */
          <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-12 text-center">
            <span className="font-mono text-xs text-signal-warn font-bold uppercase tracking-wider block mb-2">
              ⌈ PREREQUISITE VERIFICATION REQUIRED ⌋
            </span>
            <h3 className="font-display text-xl uppercase mb-3">
              {activePhase.title} IS UNDER ACTIVE SIMULATION
            </h3>
            <p className="font-mono text-xs text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed mb-6">
              Complete and pass all Phase 1 Milestones (1.1 through 1.4) in the timed Drill Room to unlock live audit sessions in {activePhase.title}.
            </p>
            <Link href="/roadmap?phase=1">
              <button
                type="button"
                className="font-mono text-xs text-signal-cta border border-signal-cta px-6 py-2.5 bg-transparent hover:bg-signal-cta hover:text-black transition-colors rounded-none cursor-pointer"
              >
                &lt;- RETURN TO PHASE 1 BEDROCK
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
