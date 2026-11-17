"use client";

/**
 * @purpose Fixed right-edge vertical HUD Section Scrubber for desktop viewports (xl screens).
 *   Highlights active section on scroll and executes smooth proximity navigation on click.
 *   Avoids rigid scroll-snap-type to preserve natural trackpad momentum.
 * @security Local DOM inspection; no sensitive state or eval.
 * @reference docs/06_UI_DESIGN_SYSTEM.md & docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */

import * as React from "react";

interface SectionItem {
  id: string;
  num: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: "hero", num: "01", label: "HERO" },
  { id: "interactive-stage", num: "02", label: "AUDIT" },
  { id: "origin", num: "03", label: "ORIGIN" },
  { id: "methodology", num: "04", label: "METHOD" },
  { id: "curriculum", num: "05", label: "PHASES" },
  { id: "challenge", num: "06", label: "TEST" },
  { id: "reports", num: "07", label: "REPORTS" },
  { id: "pricing", num: "08", label: "PRICING" },
  { id: "for-schools", num: "09", label: "FAQ" },
];

export function HudSectionScrubber() {
  const [activeId, setActiveId] = React.useState<string>("hero");

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let current = SECTIONS[0].id;

      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            current = sec.id;
          }
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside
      aria-label="HUD Section Navigation"
      className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5 font-mono text-[10px] select-none p-2 bg-[#060607]/80 border border-border-grid backdrop-none"
      style={{
        boxShadow: "0 0 12px rgba(0,0,0,0.8)",
      }}
    >
      <div className="text-[9px] tracking-hud text-text-muted px-1 pb-1 border-b border-border-subtle uppercase">
        HUD // NAV
      </div>
      {SECTIONS.map((sec) => {
        const isActive = activeId === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            title={`Jump to Section ${sec.num}: ${sec.label}`}
            className="flex items-center gap-2 px-1 py-1 text-left transition-colors group cursor-pointer"
            style={{
              color: isActive ? "var(--signal-cta)" : "var(--text-muted)",
            }}
          >
            <span
              className="w-1.5 h-1.5 shrink-0 transition-colors"
              style={{
                background: isActive ? "var(--signal-cta)" : "var(--border-grid)",
              }}
            />
            <span className="font-bold">{sec.num}</span>
            <span
              className="text-[9px] tracking-widest hidden group-hover:inline-block transition-all"
              style={{
                color: isActive ? "var(--signal-cta)" : "var(--text-secondary)",
              }}
            >
              {sec.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
