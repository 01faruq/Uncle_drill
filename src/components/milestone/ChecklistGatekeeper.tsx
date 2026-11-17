"use client";

/**
 * @purpose Interactive Gatekeeper Checklist with Hard Lockout for Drill Room.
 *   Persists in localStorage (0ms latency, 3G offline resilience) and syncs via Server Action.
 * @security Physically blocks proceeding to /drill/[milestoneId] until 100% of REQUIRED items are checked.
 * @reference docs/02_PRD_AND_ROADMAP.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Milestone, ChecklistItem, ChecklistCategory } from "@/modules/curriculum/types";
import { toggleChecklistItemAction } from "@/modules/curriculum/checklist-actions";

interface ChecklistGatekeeperProps {
  milestone: Milestone;
  initialCheckedIds?: string[];
}

export function ChecklistGatekeeper({
  milestone,
  initialCheckedIds = [],
}: ChecklistGatekeeperProps) {
  const storageKey = `uncle_drill_checklist_${milestone.milestoneId}`;
  const [checkedIds, setCheckedIds] = useState<string[]>(initialCheckedIds);
  const [isPending, startTransition] = useTransition();

  // Load from localStorage on mount and merge with initial server state
  useEffect(() => {
    try {
      const local = localStorage.getItem(storageKey);
      if (local) {
        const parsed = JSON.parse(local) as string[];
        if (Array.isArray(parsed)) {
          const merged = Array.from(new Set([...initialCheckedIds, ...parsed]));
          setCheckedIds(merged);
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }, [storageKey, initialCheckedIds]);

  const handleToggle = (item: ChecklistItem) => {
    const isCurrentlyChecked = checkedIds.includes(item.id);
    const nextChecked = isCurrentlyChecked
      ? checkedIds.filter((id) => id !== item.id)
      : [...checkedIds, item.id];

    // Optimistic local update
    setCheckedIds(nextChecked);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextChecked));
    } catch {
      // Ignore storage write errors
    }

    // Server-side profile persistence
    startTransition(async () => {
      try {
        await toggleChecklistItemAction(
          milestone.milestoneId,
          item.id,
          !isCurrentlyChecked
        );
      } catch (err) {
        console.error("Failed to sync checklist with server:", err);
      }
    });
  };

  const requiredItems = milestone.checklist.filter((i) => i.category === "REQUIRED");
  const basicItems = milestone.checklist.filter((i) => i.category === "BASIC");
  const exploreItems = milestone.checklist.filter((i) => i.category === "EXPLORE_BEYOND");

  const completedRequired = requiredItems.filter((i) => checkedIds.includes(i.id)).length;
  const totalRequired = requiredItems.length;
  const isGatekeeperUnlocked = totalRequired > 0 && completedRequired === totalRequired;
  const percentRequired = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;

  const renderGroup = (title: string, items: ChecklistItem[], category: ChecklistCategory) => {
    if (items.length === 0) return null;

    const badgeColor =
      category === "REQUIRED"
        ? "text-signal-cta border-signal-cta"
        : category === "EXPLORE_BEYOND"
        ? "text-signal-warn border-signal-warn"
        : "text-[var(--text-muted)] border-[var(--border-grid)]";

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between border-b border-[var(--border-grid)] pb-2 mb-3">
          <span className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--text-primary)]">
            {title}
          </span>
          <span className={`font-mono text-[10px] px-2 py-0.5 border ${badgeColor}`}>
            {category}
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <label
                key={item.id}
                onClick={() => handleToggle(item)}
                className={`flex items-start gap-3 p-3 border transition-colors cursor-pointer select-none ${
                  isChecked
                    ? "border-signal-cta/60 bg-[var(--bg-canvas)]"
                    : "border-[var(--border-grid)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)]"
                }`}
              >
                <div
                  className={`w-4 h-4 mt-0.5 shrink-0 border flex items-center justify-center font-mono text-xs font-bold ${
                    isChecked
                      ? "border-signal-cta bg-signal-cta text-black"
                      : "border-[var(--border-grid)] bg-[var(--bg-surface)] text-transparent"
                  }`}
                >
                  {isChecked ? "X" : ""}
                </div>

                <div className="flex-1">
                  <span
                    className={`font-mono text-xs block ${
                      isChecked
                        ? "text-[var(--text-primary)] line-through opacity-80"
                        : "text-[var(--text-primary)] font-medium"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="font-mono text-[11px] text-[var(--text-muted)] block mt-1 leading-relaxed">
                      {item.description}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 mb-8">
      {/* Header & Readiness Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-grid)] pb-4 mb-6">
        <div>
          <span className="font-mono text-xs text-signal-cta tracking-wider uppercase font-bold block mb-1">
            ⌈ PRE-DRILL GATEKEEPER CHECKLIST ⌋
          </span>
          <h2 className="font-display text-xl uppercase tracking-wide">
            OBJECTIVE READINESS VERIFICATION
          </h2>
        </div>

        <div className="text-right">
          <div className="font-mono text-xs">
            <span className="text-[var(--text-muted)]">REQUIRED READINESS: </span>
            <span
              className={`font-bold ${
                isGatekeeperUnlocked ? "text-signal-pass" : "text-signal-cta"
              }`}
            >
              {completedRequired}/{totalRequired} ({percentRequired}%)
            </span>
          </div>
          <div className="w-48 h-1.5 bg-[#141416] border border-[var(--border-grid)] mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isGatekeeperUnlocked ? "bg-signal-pass" : "bg-signal-cta"
              }`}
              style={{ width: `${percentRequired}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Sections */}
      {renderGroup("01. Foundational Concept Awareness", basicItems, "BASIC")}
      {renderGroup("02. Non-Negotiable Mastery (100% Required)", requiredItems, "REQUIRED")}
      {renderGroup("03. Explore Beyond (Stretch Knowledge)", exploreItems, "EXPLORE_BEYOND")}

      {/* Hard Gatekeeper Action Bar */}
      <div
        className={`border p-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
          isGatekeeperUnlocked
            ? "border-signal-pass bg-emerald-950/20"
            : "border-signal-fault/50 bg-[#140A0A]"
        }`}
      >
        <div className="space-y-1">
          <span
            className={`font-mono text-xs font-bold block uppercase ${
              isGatekeeperUnlocked ? "text-signal-pass" : "text-signal-fault"
            }`}
          >
            {isGatekeeperUnlocked
              ? "⌈ GATEKEEPER PASS: ALL NON-NEGOTIABLES CHECKED ⌋"
              : "⌈ GATEKEEPER LOCKOUT: INCOMPLETE PREPARATION ⌋"}
          </span>
          <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed">
            {isGatekeeperUnlocked
              ? "You have acknowledged all foundational requirements. Uncle Drill is waiting in the terminal."
              : `Uncle Drill does not permit unprepared attempts. Check all ${totalRequired} required items above (${completedRequired}/${totalRequired} ready).`}
          </p>
        </div>

        <div>
          {isGatekeeperUnlocked ? (
            <Link href={`/drill/${milestone.milestoneId}`} className="block">
              <button
                type="button"
                className="w-full sm:w-auto font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 border border-signal-cta bg-signal-cta text-black hover:bg-white transition-colors cursor-pointer rounded-none"
              >
                [ PROCEED TO DRILL ROOM -&gt; ]
              </button>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 border border-[var(--border-grid)] bg-[var(--bg-canvas)] text-[var(--text-muted)] cursor-not-allowed rounded-none opacity-60"
            >
              [ LOCKED // 100% REQUIRED NEEDED ]
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
