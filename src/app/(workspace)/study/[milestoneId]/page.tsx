/**
 * @purpose Uncle's Study Room Shell (Mobile & Desktop).
 *   Socratic mentor chat and Field Manual review.
 * @security Protected by Edge Middleware; requires active session and onboarding completion.
 * @reference docs/07_UX_WRITING_AND_VOICE.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */
import React from "react";
import Link from "next/link";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { DrillButton } from "@/components/ui/industrial/DrillButton";

export default async function StudyRoomPage({
  params,
}: {
  params: Promise<{ milestoneId: string }>;
}) {
  const { milestoneId } = await params;

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-6 sm:p-12">
      <div className="max-w-4xl mx-auto border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-[var(--border-grid)] pb-4 mb-6">
          <HudBracketHeader variant="pass">
            UNCLE&apos;S STUDY ROOM // SOCRATIC MENTOR
          </HudBracketHeader>
          <span className="font-mono text-xs text-signal-cta font-bold">
            [ MILESTONE {milestoneId} ]
          </span>
        </div>

        <div className="flex items-start gap-4 mb-8 bg-[var(--bg-canvas)] p-4 border border-[var(--border-grid)]">
          <div className="w-14 h-14 shrink-0 border border-[var(--border-grid)] bg-[#0C0C0E] overflow-hidden grayscale contrast-125">
            <img
              src="/brand/uncle-avatar.jpg"
              alt="Uncle Drill"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div>
            <span className="font-mono text-xs text-signal-warn tracking-widest block uppercase font-bold mb-1">
              [ UNCLE DRILL // OFFICE HOURS ]
            </span>
            <p className="font-mono text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
              Welcome to the Study Room. Here we discuss mental models, disaster stories,
              and non-negotiables before you enter the timed Drill Room. What questions
              do you have about {milestoneId}?
            </p>
          </div>
        </div>

        <div className="border border-[var(--border-grid)] p-4 mb-6 font-mono text-xs text-[var(--text-muted)]">
          [ STUDY ROOM SESSIONS COMING IN SLICE 2: REAL-TIME GROQ / GEMINI MULTI-PROVIDER ROUTER ]
        </div>

        <div className="flex items-center gap-4">
          <Link href={`/drill/${milestoneId}`}>
            <DrillButton variant="acid" size="md">
              [ ENTER DRILL ROOM ]
            </DrillButton>
          </Link>
          <Link href="/roadmap">
            <DrillButton variant="terminal" size="md">
              &lt; BACK TO ROADMAP
            </DrillButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
