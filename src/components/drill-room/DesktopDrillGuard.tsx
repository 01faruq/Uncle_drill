/**
 * @purpose Adaptive Desktop vs. Mobile Viewport Guard for Drill Rooms.
 *   Enforces the contract from docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md:
 *   The 3-panel Drill Room is physically locked on viewports < 1024px (mobile/tablet).
 *   Renders an authoritative Industrial Terminal HUD lockout screen with direct links
 *   to mobile-friendly Study Room and downloadable Field Manuals.
 * @security Client viewport check preventing accidental broken touchscreen terminal sessions.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Adaptive Desktop vs Mobile Contract)
 */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DrillButton } from "@/components/ui/industrial/DrillButton";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";

export interface DesktopDrillGuardProps {
  milestoneId: string;
  children: React.ReactNode;
}

export function DesktopDrillGuard({
  milestoneId,
  children,
}: DesktopDrillGuardProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const updateMatches = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateMatches();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMatches);
      return () => mediaQuery.removeEventListener("change", updateMatches);
    } else {
      mediaQuery.addListener(updateMatches);
      return () => mediaQuery.removeListener(updateMatches);
    }
  }, []);

  // Avoid flash before mount: assume desktop initially or server render
  if (isMobile === null) {
    return (
      <div className="w-full h-full">
        <div className="hidden lg:block w-full h-full">{children}</div>
        <div className="block lg:hidden min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-6 flex flex-col justify-center items-center">
          <span className="font-mono text-xs text-[var(--text-muted)] animate-pulse">
            [ CHECKING VIEWPORT TELEMETRY... ]
          </span>
        </div>
      </div>
    );
  }

  // Mobile Viewport Lockdown
  if (isMobile) {
    return (
      <div className="min-h-screen w-full bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Terminal Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, var(--text-primary) 0, var(--text-primary) 1px, transparent 1px, transparent 2px)",
            backgroundSize: "100% 2px",
          }}
          aria-hidden="true"
        />

        <div className="w-full max-w-lg border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 sm:p-8 relative z-10">
          {/* HUD Status Header */}
          <div className="mb-6">
            <HudBracketHeader variant="warn">
              DESKTOP TERMINAL REQUIRED // NO MOBILE SHORTCUTS
            </HudBracketHeader>
          </div>

          {/* Uncle Drill Character Callout */}
          <div className="flex items-start gap-4 mb-6 border-b border-[var(--border-grid)] pb-6">
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
                [ UNCLE DRILL // PROTOCOL ENFORCED ]
              </span>
              <p className="font-mono text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                Uncle Drill is a rigorous engineering terminal. Real production
                debugging does not happen on touchscreen keyboards. Go to your
                laptop or PC to enter the Drill Room.
              </p>
            </div>
          </div>

          {/* Explanation Axiom */}
          <p className="font-mono text-xs text-[var(--text-muted)] mb-8 leading-relaxed">
            While on mobile, you can study concepts in{" "}
            <span className="text-[var(--text-primary)] font-bold">
              Uncle&apos;s Study Room
            </span>{" "}
            or download the{" "}
            <span className="text-[var(--text-primary)] font-bold">
              Field Manual &amp; Pre-Flight Checklist
            </span>
            .
          </p>

          {/* Action Navigation */}
          <div className="flex flex-col gap-3">
            <Link
              href={`/study/${milestoneId}`}
              className="w-full block"
              aria-label="Open Uncle's Study Room"
            >
              <DrillButton variant="acid" size="lg" className="w-full">
                [ OPEN UNCLE&apos;S STUDY ROOM ]
              </DrillButton>
            </Link>

            <Link
              href="/roadmap"
              className="w-full block"
              aria-label="Download Field Manual on Roadmap"
            >
              <DrillButton variant="terminal" size="lg" className="w-full">
                &gt; DOWNLOAD FIELD MANUAL
              </DrillButton>
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-grid)] flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
            <span>VIEWPORT: &lt;1024px MOBILE</span>
            <span>STATUS: 403 DRILL LOCKED</span>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Viewport: Full access to the 3-panel Drill Room
  return <>{children}</>;
}
