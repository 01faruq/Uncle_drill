"use client";

/**
 * @purpose Top brand header with live failure ticker and quick navigation shortcuts.
 * @security Presentational header; no sensitive credentials displayed or requested.
 * @reference docs/06_UI_DESIGN_SYSTEM.md (Screen A: The Landing & Manifesto Screen)
 */
import * as React from "react";
import Link from "next/link";
import { DrillButton } from "@/components/ui/industrial/DrillButton";

export function MarketingHeader() {
  return (
    <header className="w-full bg-canvas border-b border-border-grid h-12 flex items-center justify-between px-4 font-mono text-xs select-none sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 bg-signal-cta inline-block" />
        <Link href="/" className="font-display text-sm tracking-wider hover:text-signal-cta text-text-primary transition-colors">
          UNCLE_DRILL // v1.0
        </Link>
        <span className="hidden md:inline text-[11px] text-text-muted">
          [MASTERY AUDIT ENGINE]
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-text-secondary text-[11px]">
        <span className="text-signal-warn">TICKER:</span>
        <span className="text-text-muted">&quot;82% of vibe coders failed Milestone 1.1 first attempt. Can you redirect stderr without guessing?&quot;</span>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/design-system">
          <DrillButton variant="terminal" size="sm">
            DESIGN SYSTEM
          </DrillButton>
        </Link>
        <Link href="/verify/demo">
          <DrillButton variant="acid" size="sm">
            VIEW CERTIFICATE
          </DrillButton>
        </Link>
      </div>
    </header>
  );
}
