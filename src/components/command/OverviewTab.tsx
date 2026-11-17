"use client";

/**
 * @purpose Tab 1: Overview & Apology Unban Queue for Founder Command Room.
 *   Provides platform health metrics and 1-click unban decisions for suspended cadets.
 * @security Server actions strictly verified server-side; mutations revalidate router.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 5)
 */
import * as React from "react";
import {
  type PlatformOverviewMetrics,
  type ApologyAppealDetail,
} from "@/modules/admin/command-types";
import {
  approveApologyAppealAction,
  rejectApologyAppealAction,
} from "@/modules/admin/command-actions";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { DrillButton } from "@/components/ui/industrial/DrillButton";

interface OverviewTabProps {
  metrics: PlatformOverviewMetrics;
  appeals: ApologyAppealDetail[];
}

export function OverviewTab({ metrics, appeals: initialAppeals }: OverviewTabProps) {
  const [appeals, setAppeals] = React.useState<ApologyAppealDetail[]>(initialAppeals);
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const handleApprove = async (appealId: string) => {
    try {
      setProcessingId(appealId);
      setStatusMessage(null);
      await approveApologyAppealAction(appealId);
      setAppeals((prev) =>
        prev.map((a) => (a.id === appealId ? { ...a, status: "APPROVED_BY_ADMIN" } : a))
      );
      setStatusMessage(`[ SUCCESS // APPEAL ${appealId.slice(0, 8)} APPROVED — CADET UNBANNED ]`);
    } catch (err: any) {
      setStatusMessage(`[ ERROR: ${err.message || "Action failed"} ]`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (appealId: string) => {
    try {
      setProcessingId(appealId);
      setStatusMessage(null);
      await rejectApologyAppealAction(appealId);
      setAppeals((prev) =>
        prev.map((a) => (a.id === appealId ? { ...a, status: "REJECTED_BY_ADMIN" } : a))
      );
      setStatusMessage(`[ LOCKED // APPEAL REJECTED — 48H COOLDOWN APPLIED ]`);
    } catch (err: any) {
      setStatusMessage(`[ ERROR: ${err.message || "Action failed"} ]`);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingAppeals = appeals.filter(
    (a) => a.status === "PENDING_AI_SCREEN" || a.status === "AI_SCREENED_GENUINE"
  );

  return (
    <div className="space-y-8">
      {statusMessage && (
        <div className="border border-signal-cta bg-signal-cta/10 p-3 font-mono text-xs text-signal-cta">
          {statusMessage}
        </div>
      )}

      {/* 4 Metric HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-5 font-mono">
          <span className="text-[10px] text-[var(--text-muted)] uppercase block tracking-wider mb-1">
            TOTAL CADETS
          </span>
          <div className="text-3xl font-display text-[var(--text-primary)]">
            {metrics.totalUsers}
          </div>
          <span className="text-[10px] text-signal-pass block mt-2">
            ● REGISTERED ACCOUNTS
          </span>
        </div>

        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-5 font-mono">
          <span className="text-[10px] text-[var(--text-muted)] uppercase block tracking-wider mb-1">
            ACTIVE DRILL ROOMS
          </span>
          <div className="text-3xl font-display text-signal-cta">
            {metrics.activeDrills}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] block mt-2">
            ● TERMINAL SESSIONS LIVE
          </span>
        </div>

        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-5 font-mono">
          <span className="text-[10px] text-[var(--text-muted)] uppercase block tracking-wider mb-1">
            GLOBAL PASS RATE
          </span>
          <div className="text-3xl font-display text-signal-pass">
            {metrics.passRate}%
          </div>
          <span className="text-[10px] text-[var(--text-muted)] block mt-2">
            ● 4-PILLAR WEIGHTED &gt;= 75%
          </span>
        </div>

        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-5 font-mono">
          <span className="text-[10px] text-[var(--text-muted)] uppercase block tracking-wider mb-1">
            SUSPENDED CADETS
          </span>
          <div className="text-3xl font-display text-signal-fault">
            {metrics.suspendedAccounts}
          </div>
          <span className="text-[10px] text-signal-warn block mt-2">
            ● 2-STRIKE CHEAT LOCKOUT
          </span>
        </div>
      </div>

      {/* Apology Letter Unban Queue */}
      <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <HudBracketHeader variant="warn">
              APOLOGY LETTER UNBAN QUEUE // 1-CLICK DECISION ENGINE
            </HudBracketHeader>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              Cadets caught pasting answers or switching tabs must submit a &gt;=150 char genuine apology.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-signal-cta">
            [ PENDING: {pendingAppeals.length} ]
          </span>
        </div>

        {appeals.length === 0 ? (
          <div className="border border-dashed border-[var(--border-grid)] p-8 text-center font-mono text-xs text-[var(--text-muted)]">
            [ ZERO APPEALS IN QUEUE // ALL CADETS IN GOOD STANDING ]
          </div>
        ) : (
          <div className="space-y-4">
            {appeals.map((appeal) => {
              const isPending =
                appeal.status === "PENDING_AI_SCREEN" ||
                appeal.status === "AI_SCREENED_GENUINE";
              const isBusy = processingId === appeal.id;

              return (
                <div
                  key={appeal.id}
                  className="border border-[var(--border-grid)] bg-[var(--bg-canvas)] p-4 font-mono text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-grid)] pb-2 text-[11px]">
                    <div>
                      <span className="text-[var(--text-primary)] font-bold">
                        {appeal.userName}
                      </span>{" "}
                      <span className="text-[var(--text-muted)]">({appeal.userEmail})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--text-muted)]">
                        {new Date(appeal.submittedAt).toLocaleString()}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 border ${
                          appeal.status === "APPROVED_BY_ADMIN"
                            ? "border-signal-pass text-signal-pass"
                            : appeal.status === "REJECTED_BY_ADMIN"
                            ? "border-signal-fault text-signal-fault"
                            : "border-signal-warn text-signal-warn"
                        }`}
                      >
                        {appeal.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">
                      CADET APOLOGY LETTER (&gt;= 150 CHARS):
                    </span>
                    <p className="text-[var(--text-primary)] bg-[var(--bg-surface)] p-3 border border-[var(--border-grid)] leading-relaxed italic">
                      &quot;{appeal.letterBody}&quot;
                    </p>
                  </div>

                  {appeal.aiScreeningNotes && (
                    <div className="text-[11px] text-[var(--text-muted)]">
                      <span className="text-signal-cta font-bold">AI SCREEN NOTE:</span>{" "}
                      {appeal.aiScreeningNotes}
                    </div>
                  )}

                  {isPending && (
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleApprove(appeal.id)}
                        className="font-mono text-xs bg-signal-pass text-black font-bold px-4 py-2 hover:opacity-90 disabled:opacity-50 transition-opacity rounded-none"
                      >
                        {isBusy ? "[ EXECUTING... ]" : "[ APPROVE UNBAN ]"}
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleReject(appeal.id)}
                        className="font-mono text-xs border border-signal-fault text-signal-fault font-bold px-4 py-2 hover:bg-signal-fault/10 disabled:opacity-50 transition-colors rounded-none"
                      >
                        {isBusy ? "[ EXECUTING... ]" : "[ REJECT + 48H COOLDOWN ]"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
