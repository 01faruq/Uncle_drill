/**
 * @purpose Progressive 3-Question Onboarding Wizard with URL State Synchronization (nuqs).
 *   Collects student identity, bedrock experience, and learning DNA analogy preferences.
 * @security Updates authenticated user profile via completeOnboardingAction Server Action.
 * @reference docs/07_UX_WRITING_AND_VOICE.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */
"use client";

import React, { useState, useTransition, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsInteger } from "nuqs";
import { completeOnboardingAction } from "@/modules/auth/onboarding-actions";
import { DrillButton } from "@/components/ui/industrial/DrillButton";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { UncleDrillAvatar } from "@/components/brand/UncleDrillAvatar";

const ANALOGY_OPTIONS = [
  {
    id: "Fintech & Banking",
    title: "FINTECH & BANKING",
    desc: "Ledgers, double-entry, settlement windows, idempotency, and high-frequency transactions.",
  },
  {
    id: "Football & Sports",
    title: "FOOTBALL & TACTICS",
    desc: "Defensive backlines, referee consensus, offside flags, and tactical high-press.",
  },
  {
    id: "Gaming",
    title: "GAMING & ENGINES",
    desc: "Tick rates, hitbox desync, server rollbacks, and deterministic simulation.",
  },
  {
    id: "Everyday Markets & Life",
    title: "MARKETS & COMMERCE",
    desc: "Balogun market queues, generator backups, fuel scarcity buffers, and real-world logistics.",
  },
];

const EXPERIENCE_OPTIONS = [
  {
    id: "COMPLETE_BEGINNER" as const,
    title: "FRESH RECRUIT // COMPLETE BEGINNER",
    desc: "I know basic syntax, but the command line and production systems still look like foreign hieroglyphics.",
  },
  {
    id: "STUCK_IN_TUTORIAL_HELL" as const,
    title: "TUTORIAL APPRENTICE // STUCK IN PURGATORY",
    desc: "I can copy video tutorials, but when the blank editor opens or a real error throws, I freeze up.",
  },
  {
    id: "EXPERIENCED_DEV" as const,
    title: "WORKING ENGINEER // STRESS-TESTING BEDROCK",
    desc: "I write code daily, but I want Uncle Drill to audit my mental models and expose gaps in my fundamentals.",
  },
];

function OnboardingContent() {
  const router = useRouter();
  const [step, setStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [casualAddress, setCasualAddress] = useState<"bro" | "sis" | "first_name">("bro");
  const [experienceLevel, setExperienceLevel] = useState<
    "COMPLETE_BEGINNER" | "STUCK_IN_TUTORIAL_HELL" | "EXPERIENCED_DEV"
  >("STUCK_IN_TUTORIAL_HELL");
  const [preferredAnalogies, setPreferredAnalogies] = useState<string[]>([
    "Fintech & Banking",
    "Football & Sports",
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleAnalogy = (id: string) => {
    if (preferredAnalogies.includes(id)) {
      if (preferredAnalogies.length > 1) {
        setPreferredAnalogies(preferredAnalogies.filter((item) => item !== id));
      }
    } else {
      setPreferredAnalogies([...preferredAnalogies, id]);
    }
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!displayName.trim() || displayName.trim().length < 2) {
        setErrorMessage("Please enter your name (at least 2 characters).");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (preferredAnalogies.length === 0) {
        setErrorMessage("Please select at least 1 analogy domain.");
        return;
      }

      startTransition(async () => {
        try {
          await completeOnboardingAction({
            displayName: displayName.trim(),
            casualAddress,
            experienceLevel,
            preferredAnalogies,
          });
          router.push("/roadmap");
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to finalize onboarding.";
          if (!message.includes("NEXT_REDIRECT")) {
            setErrorMessage(message);
          }
        }
      });
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle Scanline Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--text-primary) 0, var(--text-primary) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-xl border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 sm:p-8 relative z-10">
        {/* Progress Header */}
        <div className="mb-6 flex items-center justify-between border-b border-[var(--border-grid)] pb-4">
          <HudBracketHeader variant="warn">
            CADET ONBOARDING // PROTOCOL 01
          </HudBracketHeader>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={
                step >= 1 ? "text-signal-cta font-bold" : "text-[var(--text-muted)]"
              }
            >
              01
            </span>
            <span className="text-[var(--border-grid)]">/</span>
            <span
              className={
                step >= 2 ? "text-signal-cta font-bold" : "text-[var(--text-muted)]"
              }
            >
              02
            </span>
            <span className="text-[var(--border-grid)]">/</span>
            <span
              className={
                step === 3 ? "text-signal-cta font-bold" : "text-[var(--text-muted)]"
              }
            >
              03
            </span>
          </div>
        </div>

        {/* Uncle Drill Speech Bubble */}
        <div className="flex items-start gap-4 mb-8 bg-[var(--bg-canvas)] p-4 border border-[var(--border-grid)]">
          <UncleDrillAvatar size={48} />
          <div>
            <span className="font-mono text-[10px] text-signal-cta tracking-widest block uppercase font-bold mb-1">
              [ UNCLE DRILL // QUESTION 0{step} ]
            </span>
            <p className="font-mono text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
              {step === 1 &&
                "Listen here cadet. I don't care about your resume yet. What do I call you when your code breaks at 2 AM in production?"}
              {step === 2 &&
                "Honesty time. If I ask you to build a resilient payment webhook handler without looking at Google or ChatGPT, what actually happens?"}
              {step === 3 &&
                "I explain distributed consensus using football referees and banking settlement queues. What real-world analogies make things click in your brain?"}
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-950/40 border border-signal-fault text-signal-fault font-mono text-xs flex items-center gap-2">
            <span>[!]</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* QUESTION 1: Identity */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name-input"
                className="block font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold"
              >
                1. YOUR FIRST NAME OR CALLSIGN:
              </label>
              <input
                id="name-input"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Faruq, Tunde, Amina"
                className="w-full border border-[var(--border-grid)] bg-[var(--bg-canvas)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono text-sm px-4 py-3 rounded-none outline-none focus:border-signal-cta transition-colors"
                autoFocus
              />
            </div>

            <div>
              <span className="block font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
                2. HOW SHOULD UNCLE DRILL ADDRESS YOU CASUALLY?
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "bro" as const, label: '"My Guy / Bro"' },
                  { id: "sis" as const, label: '"Sister / Sis"' },
                  { id: "first_name" as const, label: "Just my Name" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCasualAddress(opt.id)}
                    className={`border p-3 text-left font-mono text-xs transition-colors rounded-none ${
                      casualAddress === opt.id
                        ? "border-signal-cta bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold"
                        : "border-[var(--border-grid)] bg-[var(--bg-canvas)] text-[var(--text-muted)] hover:border-[var(--text-primary)]"
                    }`}
                  >
                    <span className="block text-[10px] text-signal-cta mb-1">
                      {casualAddress === opt.id ? "[ SELECTED ]" : "[ SELECT ]"}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QUESTION 2: Starting Bedrock Experience */}
        {step === 2 && (
          <div className="space-y-3">
            <span className="block font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
              CHOOSE YOUR REALITY LEVEL (NO JUDGMENT):
            </span>
            {EXPERIENCE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setExperienceLevel(opt.id)}
                className={`w-full border p-4 text-left font-mono transition-colors rounded-none block ${
                  experienceLevel === opt.id
                    ? "border-signal-cta bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                    : "border-[var(--border-grid)] bg-[var(--bg-canvas)] text-[var(--text-muted)] hover:border-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[var(--text-primary)]">
                    {opt.title}
                  </span>
                  <span className="text-[10px] text-signal-cta">
                    {experienceLevel === opt.id ? "[ ACTIVE ]" : ""}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* QUESTION 3: Analogy Domains */}
        {step === 3 && (
          <div className="space-y-3">
            <span className="block font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
              SELECT YOUR PREFERRED ANALOGY DOMAINS (AT LEAST 1):
            </span>
            {ANALOGY_OPTIONS.map((opt) => {
              const isSelected = preferredAnalogies.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleAnalogy(opt.id)}
                  className={`w-full border p-4 text-left font-mono transition-colors rounded-none block ${
                    isSelected
                      ? "border-signal-cta bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                      : "border-[var(--border-grid)] bg-[var(--bg-canvas)] text-[var(--text-muted)] hover:border-[var(--text-primary)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[var(--text-primary)]">
                      {opt.title}
                    </span>
                    <span className="text-[10px] text-signal-cta font-bold">
                      {isSelected ? "[ SELECTED ✓ ]" : "[ + ADD ]"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-4 border-t border-[var(--border-grid)] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isPending}
              className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-3 py-2 border border-transparent hover:border-[var(--border-grid)] rounded-none"
            >
              &lt; PREVIOUS STEP
            </button>
          ) : (
            <div />
          )}

          <DrillButton
            type="button"
            variant="acid"
            size="md"
            onClick={handleNext}
            isLoading={isPending}
          >
            {step < 3 ? "CONTINUE ->" : "[ COMPLETE & ENTER ROADMAP ]"}
          </DrillButton>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-canvas)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">
          [ INITIALIZING ONBOARDING PROTOCOL... ]
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
