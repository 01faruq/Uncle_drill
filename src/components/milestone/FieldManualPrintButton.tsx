"use client";

/**
 * @purpose Printable/Downloadable PDF Field Manual Button.
 *   Triggers browser print dialog styled for Blueprint Paper dossier export (#EAE6DF).
 * @security Client-only interactive trigger; zero external API dependencies or trackers.
 * @reference docs/06_UI_DESIGN_SYSTEM.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */

import React, { useState } from "react";

export function FieldManualPrintButton({ milestoneTitle }: { milestoneTitle: string }) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      disabled={isPrinting}
      aria-label={`Download Field Manual for ${milestoneTitle} as PDF`}
      className="font-mono text-xs text-[var(--text-primary)] border border-[var(--border-grid)] bg-[var(--bg-canvas)] hover:border-signal-cta hover:text-signal-cta px-4 py-2 transition-colors flex items-center gap-2 rounded-none print:hidden cursor-pointer"
    >
      <span className="w-2 h-2 bg-signal-cta inline-block" />
      <span>{isPrinting ? "[ PREPARING DOSSIER... ]" : "[ DOWNLOAD FIELD MANUAL (.PDF) ]"}</span>
    </button>
  );
}
