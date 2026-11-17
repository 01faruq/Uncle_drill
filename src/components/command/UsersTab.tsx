"use client";

/**
 * @purpose Tab 2: User & God-Mode Manager for Founder Command Room.
 *   Provides cadet search, role updates, cheat strike inspection, bonus drill grants,
 *   and 1-click God-Mode toggles.
 * @security Direct server action calls protected by SUPER_ADMIN requirement.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 5)
 */
import * as React from "react";
import { type CadetDetail } from "@/modules/admin/command-types";
import {
  searchCadetsAction,
  toggleGodModeAction,
  grantBonusDrillsAction,
  updateUserRoleAction,
  updateUserStatusAction,
} from "@/modules/admin/command-actions";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import type { UserRole, AccountStatus } from "@/types/database.types";

interface UsersTabProps {
  initialCadets: CadetDetail[];
}

export function UsersTab({ initialCadets }: UsersTabProps) {
  const [cadets, setCadets] = React.useState<CadetDetail[]>(initialCadets);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [busyUserId, setBusyUserId] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsSearching(true);
      const results = await searchCadetsAction(searchQuery);
      setCadets(results);
    } catch (err: any) {
      setToast(`[ SEARCH FAILED: ${err.message} ]`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleGodMode = async (userId: string, currentVal: boolean) => {
    try {
      setBusyUserId(userId);
      setToast(null);
      await toggleGodModeAction({ userId, enabled: !currentVal });
      setCadets((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, godModeEnabled: !currentVal } : c))
      );
      setToast(`[ CADET ${userId.slice(0, 8)}: GOD_MODE = ${!currentVal ? "ENABLED" : "DISABLED"} ]`);
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setBusyUserId(null);
    }
  };

  const handleGrantBonus = async (userId: string, amount: number) => {
    try {
      setBusyUserId(userId);
      setToast(null);
      const res = await grantBonusDrillsAction({ userId, amount });
      setCadets((prev) =>
        prev.map((c) =>
          c.id === userId ? { ...c, drillsRemaining: res.newTotal ?? c.drillsRemaining + amount } : c
        )
      );
      setToast(`[ GRANTED +${amount} DRILLS TO CADET ${userId.slice(0, 8)} ]`);
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setBusyUserId(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setBusyUserId(userId);
      setToast(null);
      await updateUserRoleAction({ userId, role: newRole });
      setCadets((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, role: newRole } : c))
      );
      setToast(`[ ROLE UPDATED TO ${newRole} FOR ${userId.slice(0, 8)} ]`);
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setBusyUserId(null);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: AccountStatus) => {
    try {
      setBusyUserId(userId);
      setToast(null);
      await updateUserStatusAction({ userId, status: newStatus });
      setCadets((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, status: newStatus } : c))
      );
      setToast(`[ STATUS UPDATED TO ${newStatus} FOR ${userId.slice(0, 8)} ]`);
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="border border-signal-cta bg-signal-cta/10 p-3 font-mono text-xs text-signal-cta">
          {toast}
        </div>
      )}

      {/* Search Header */}
      <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6">
        <HudBracketHeader variant="pass">
          USER &amp; GOD-MODE MANAGER // CADET REGISTRY
        </HudBracketHeader>
        <p className="font-mono text-xs text-[var(--text-muted)] mt-1 mb-4">
          Search cadets by email or display name to inspect strikes, grant drills, or override access.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email (e.g. tunde@) or name..."
            className="flex-1 bg-[var(--bg-canvas)] border border-[var(--border-grid)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:border-signal-cta outline-none rounded-none"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="font-mono text-xs bg-signal-cta text-black font-bold px-4 py-2 hover:opacity-90 disabled:opacity-50 transition-opacity rounded-none"
          >
            {isSearching ? "[ SEARCHING... ]" : "[ SEARCH ]"}
          </button>
        </form>
      </div>

      {/* Cadets Table */}
      <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-grid)] bg-[var(--bg-canvas)] text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              <th className="p-3">Cadet Name / Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Drills</th>
              <th className="p-3">Strikes</th>
              <th className="p-3">God Mode</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-grid)]">
            {cadets.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[var(--text-muted)]">
                  [ NO CADETS FOUND MATCHING CRITERIA ]
                </td>
              </tr>
            ) : (
              cadets.map((c) => {
                const isBusy = busyUserId === c.id;
                return (
                  <tr key={c.id} className="hover:bg-[var(--bg-canvas)]/50 transition-colors">
                    <td className="p-3">
                      <div className="text-[var(--text-primary)] font-bold">{c.displayName}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{c.email}</div>
                    </td>
                    <td className="p-3">
                      <select
                        value={c.role}
                        disabled={isBusy}
                        onChange={(e) => handleRoleChange(c.id, e.target.value as UserRole)}
                        className="bg-[var(--bg-canvas)] border border-[var(--border-grid)] px-2 py-1 text-[11px] text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="PEER_AUDITOR">PEER_AUDITOR</option>
                        <option value="B2B_ADMIN">B2B_ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={c.status}
                        disabled={isBusy}
                        onChange={(e) =>
                          handleStatusChange(c.id, e.target.value as AccountStatus)
                        }
                        className={`bg-[var(--bg-canvas)] border px-2 py-1 text-[11px] rounded-none focus:border-signal-cta outline-none ${
                          c.status === "ACTIVE"
                            ? "border-signal-pass text-signal-pass"
                            : c.status === "SUSPENDED_CHEATING"
                            ? "border-signal-warn text-signal-warn"
                            : "border-signal-fault text-signal-fault"
                        }`}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUSPENDED_CHEATING">SUSPENDED</option>
                        <option value="BANNED_PERMANENT">BANNED</option>
                      </select>
                    </td>
                    <td className="p-3 font-bold text-signal-cta">
                      {c.drillsRemaining}
                    </td>
                    <td className="p-3">
                      <span
                        className={
                          c.cheatStrikes >= 2
                            ? "text-signal-fault font-bold"
                            : c.cheatStrikes === 1
                            ? "text-signal-warn font-bold"
                            : "text-[var(--text-muted)]"
                        }
                      >
                        {c.cheatStrikes}/2
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleToggleGodMode(c.id, c.godModeEnabled)}
                        className={`text-[10px] font-bold px-2 py-1 border transition-colors rounded-none ${
                          c.godModeEnabled
                            ? "border-signal-pass bg-signal-pass/10 text-signal-pass"
                            : "border-[var(--border-grid)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
                        }`}
                      >
                        {c.godModeEnabled ? "[ GOD: ON ]" : "[ GOD: OFF ]"}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleGrantBonus(c.id, 1)}
                          className="text-[10px] border border-[var(--border-grid)] px-2 py-1 text-[var(--text-primary)] hover:border-signal-cta transition-colors rounded-none"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleGrantBonus(c.id, 5)}
                          className="text-[10px] border border-[var(--border-grid)] px-2 py-1 text-[var(--text-primary)] hover:border-signal-cta transition-colors rounded-none"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
