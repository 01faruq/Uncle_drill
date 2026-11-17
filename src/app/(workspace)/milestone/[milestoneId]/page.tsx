/**
 * @purpose Dedicated Task, Resource & Pre-Drill Checklist Dossier (/milestone/[milestoneId]).
 *   Features Real-World Disasters, First-Principles Mental Models, Curated Resources,
 *   Downloadable Blueprint PDF Field Manual, and Interactive Gatekeeper Checklist.
 * @security Edge Middleware-protected. Pure server component loading static seed data & profile progress.
 * @reference docs/03_CURRICULUM_RUBRICS.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMilestoneById } from "@/lib/data/curriculum";
import { getMilestoneProgressAction } from "@/modules/curriculum/checklist-actions";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { ChecklistGatekeeper } from "@/components/milestone/ChecklistGatekeeper";
import { FieldManualPrintButton } from "@/components/milestone/FieldManualPrintButton";

export default async function MilestoneDossierPage({
  params,
}: {
  params: Promise<{ milestoneId: string }>;
}) {
  const { milestoneId } = await params;
  const milestone = getMilestoneById(milestoneId);

  if (!milestone) {
    notFound();
  }

  const progress = await getMilestoneProgressAction(milestone.milestoneId);
  const initialCheckedIds = progress?.checkedItemIds || [];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-4 sm:p-8 lg:p-12 print:p-0 print:bg-white print:text-black">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-grid)] pb-4 print:hidden">
          <div className="flex items-center gap-3 font-mono text-xs">
            <Link
              href="/roadmap"
              className="text-[var(--text-muted)] hover:text-signal-cta transition-colors"
            >
              &lt;- BACK TO ROADMAP
            </Link>
            <span className="text-[var(--border-grid)]">/</span>
            <span className="text-signal-cta font-bold">
              PHASE {milestone.phase} // MILESTONE {milestone.milestoneId}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <FieldManualPrintButton milestoneTitle={milestone.title} />
            <Link href={`/study/${milestone.milestoneId}`}>
              <button
                type="button"
                className="font-mono text-xs text-signal-cta border border-signal-cta px-3 py-2 bg-transparent hover:bg-signal-cta hover:text-black transition-colors rounded-none cursor-pointer"
              >
                &gt; UNCLE&apos;S STUDY ROOM
              </button>
            </Link>
          </div>
        </div>

        {/* Milestone Header Dossier */}
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 sm:p-8 print:border-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <HudBracketHeader variant="pass">
              FIELD MANUAL // MILESTONE {milestone.milestoneId}
            </HudBracketHeader>
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
              <span className="border border-[var(--border-grid)] px-2 py-1 bg-[var(--bg-canvas)]">
                TIME LIMIT: {milestone.timeLimitMinutes} MIN
              </span>
              <span className="border border-signal-pass text-signal-pass px-2 py-1 bg-emerald-950/40 font-bold">
                {milestone.status}
              </span>
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl uppercase tracking-wide mb-3">
            {milestone.title}
          </h1>
          <p className="font-mono text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed">
            {milestone.summary}
          </p>
        </div>

        {/* Section 1: Real-World Production Disaster Story */}
        <div className="border border-signal-fault/50 bg-[#120707] p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-signal-fault/30 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-signal-fault inline-block animate-pulse" />
              <span className="font-mono text-xs text-signal-fault font-bold uppercase tracking-wider">
                ⌈ REAL-WORLD PRODUCTION DISASTER // WHY YOU LEARN THIS ⌋
              </span>
            </div>
            <span className="font-mono text-xs text-signal-fault/80">
              {milestone.disasterStory.company} • {milestone.disasterStory.year}
            </span>
          </div>

          <h3 className="font-display text-lg uppercase tracking-wide text-signal-fault mb-3">
            {milestone.disasterStory.title}
          </h3>

          <p className="font-sans text-sm text-[var(--text-primary)] leading-relaxed mb-4">
            {milestone.disasterStory.narrative}
          </p>

          <div className="border-l-2 border-signal-fault pl-4 py-1 bg-black/40">
            <span className="font-mono text-xs text-signal-fault font-bold uppercase block mb-1">
              [ THE DRILL LESSON ]
            </span>
            <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed">
              {milestone.disasterStory.lesson}
            </p>
          </div>
        </div>

        {/* Section 2: First-Principles Mental Model */}
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 sm:p-8">
          <div className="border-b border-[var(--border-grid)] pb-3 mb-6">
            <span className="font-mono text-xs text-signal-cta font-bold uppercase tracking-wider block mb-1">
              ⌈ 01. FIRST-PRINCIPLES ARCHITECTURAL FOUNDATION ⌋
            </span>
            <h2 className="font-display text-xl uppercase tracking-wide">
              {milestone.mentalModel.title}
            </h2>
          </div>

          {/* Core Thesis Box */}
          <div className="border border-[var(--border-grid)] bg-[var(--bg-canvas)] p-5 mb-6">
            <span className="font-mono text-xs text-signal-cta font-bold uppercase block mb-2">
              [ CORE THESIS ]
            </span>
            <p className="font-mono text-sm sm:text-base text-[var(--text-primary)] font-semibold leading-relaxed">
              &quot;{milestone.mentalModel.coreThesis}&quot;
            </p>
          </div>

          {/* Deep Architectural Narrative */}
          <div className="space-y-4 mb-6">
            {milestone.mentalModel.paragraphs.map((para, idx) => (
              <p
                key={idx}
                className="font-sans text-sm sm:text-base text-[var(--text-muted)] leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Key Takeaways Grid */}
          <div className="border-t border-[var(--border-grid)] pt-6">
            <span className="font-mono text-xs text-[var(--text-primary)] font-bold uppercase block mb-3">
              [ NON-NEGOTIABLE TAKEAWAYS ]
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {milestone.mentalModel.keyTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="border border-[var(--border-grid)] p-3 bg-[var(--bg-canvas)] flex items-start gap-2.5"
                >
                  <span className="font-mono text-xs text-signal-cta font-bold mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span className="font-mono text-xs text-[var(--text-primary)] leading-relaxed">
                    {takeaway}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Practice Project & Explore Beyond Warning */}
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 sm:p-8">
          <div className="border-b border-[var(--border-grid)] pb-3 mb-6">
            <span className="font-mono text-xs text-signal-cta font-bold uppercase tracking-wider block mb-1">
              ⌈ 02. HANDS-ON PRACTICE TASK ⌋
            </span>
            <h2 className="font-display text-xl uppercase tracking-wide">
              {milestone.practiceProject.title}
            </h2>
          </div>

          <div className="mb-4">
            <div className="inline-block border border-[var(--border-grid)] bg-[var(--bg-canvas)] px-3 py-1 font-mono text-xs text-signal-cta mb-3">
              TARGET ARTIFACT: {milestone.practiceProject.artifactName}
            </div>
            <p className="font-sans text-sm text-[var(--text-primary)] leading-relaxed">
              {milestone.practiceProject.brief}
            </p>
          </div>

          {/* Objective Requirements List */}
          <div className="border border-[var(--border-grid)] bg-[var(--bg-canvas)] p-4 mb-6">
            <span className="font-mono text-xs text-[var(--text-muted)] font-bold uppercase block mb-2">
              [ ARTIFACT SPECIFICATIONS ]
            </span>
            <ul className="space-y-2">
              {milestone.practiceProject.requirements.map((req, idx) => (
                <li
                  key={idx}
                  className="font-mono text-xs text-[var(--text-primary)] flex items-start gap-2"
                >
                  <span className="text-signal-cta font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Explicit "Explore Beyond" Callout Warning */}
          <div className="border border-signal-warn/60 bg-amber-950/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-signal-warn inline-block" />
              <span className="font-mono text-xs text-signal-warn font-bold uppercase tracking-wider">
                ⌈ EXPLORE BEYOND WARNING // UNCLE DRILL ADVISORY ⌋
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--text-primary)] leading-relaxed">
              {milestone.practiceProject.exploreBeyondWarning}
            </p>
          </div>
        </div>

        {/* Section 4: Curated Multi-Modal Resource Vault */}
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 sm:p-8">
          <div className="border-b border-[var(--border-grid)] pb-3 mb-6">
            <span className="font-mono text-xs text-signal-cta font-bold uppercase tracking-wider block mb-1">
              ⌈ 03. CURATED MULTI-MODAL RESOURCE VAULT ⌋
            </span>
            <h2 className="font-display text-xl uppercase tracking-wide">
              PRIMARY SOURCES &amp; STUDY MATERIAL
            </h2>
          </div>

          <div className="space-y-4">
            {milestone.resources.map((res) => (
              <div
                key={res.id}
                className="border border-[var(--border-grid)] bg-[var(--bg-canvas)] p-5 hover:border-[var(--text-muted)] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-sm sm:text-base text-signal-cta hover:underline"
                  >
                    {res.title} -&gt;
                  </a>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] border border-signal-cta text-signal-cta px-2 py-0.5 uppercase">
                      {res.formatType.replace("_", " ")}
                    </span>
                    {res.learningStyleTags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] border border-[var(--border-grid)] text-[var(--text-muted)] px-2 py-0.5 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-l-2 border-signal-cta pl-3 mt-3">
                  <span className="font-mono text-[10px] text-signal-cta font-bold block uppercase">
                    [ UNCLE&apos;S DIRECTIVE ]
                  </span>
                  <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">
                    {res.uncleCommentary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Interactive Gatekeeper Checklist */}
        <ChecklistGatekeeper
          milestone={milestone}
          initialCheckedIds={initialCheckedIds}
        />
      </div>
    </div>
  );
}
