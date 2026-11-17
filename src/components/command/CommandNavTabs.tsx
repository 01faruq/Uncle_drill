"use client";

/**
 * @purpose URL-Synced Tab Switcher for the Founder Command Room (/command).
 *   Binds active tab strictly to ?tab=overview|users|codes|cms|ai via nuqs.
 * @security Navigation state in URL guarantees deterministic Back-button restores.
 * @reference docs/04_SYSTEM_ARCHITECTURE.md (Rule 1: Zero Navigation State in useState)
 */
import * as React from "react";
import { useQueryState, parseAsStringLiteral } from "nuqs";

export const COMMAND_TABS = ["overview", "users", "codes", "cms", "ai"] as const;
export type CommandTab = (typeof COMMAND_TABS)[number];

export const tabParser = parseAsStringLiteral(COMMAND_TABS).withDefault("overview");

interface CommandNavTabsProps {
  activeTab: CommandTab;
  onTabChange: (tab: CommandTab) => void;
}

const TAB_CONFIG: { id: CommandTab; index: string; label: string }[] = [
  { id: "overview", index: "01", label: "OVERVIEW & UNBANS" },
  { id: "users", index: "02", label: "USERS & GOD-MODE" },
  { id: "codes", index: "03", label: "PRICING & CODES" },
  { id: "cms", index: "04", label: "CURRICULUM CMS" },
  { id: "ai", index: "05", label: "AI SWITCHBOARD" },
];

export function CommandNavTabs({ activeTab, onTabChange }: CommandNavTabsProps) {
  return (
    <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-2 mb-8 flex flex-wrap gap-2">
      {TAB_CONFIG.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`font-mono text-xs px-4 py-2 border transition-colors rounded-none flex items-center gap-2 ${
              isActive
                ? "border-signal-cta bg-signal-cta/10 text-signal-cta font-bold"
                : "border-[var(--border-grid)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
            }`}
          >
            <span className="opacity-60">{t.index}.</span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
