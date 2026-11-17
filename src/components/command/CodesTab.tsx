"use client";

/**
 * @purpose Tab 3: Dynamic Pricing & Scholarship Code Generator for Founder Command Room.
 *   Enables live adjustment of anchor pricing, free trial days, and generation of
 *   unlimited promo/sponsor/god-mode access codes.
 * @security Mutations verified server-side for SUPER_ADMIN role.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 5)
 */
import * as React from "react";
import {
  type PricingConfig,
  type AccessCodeDetail,
  type CreateAccessCodeInput,
} from "@/modules/admin/command-types";
import {
  updatePricingConfigAction,
  createAccessCodeAction,
  deleteAccessCodeAction,
} from "@/modules/admin/command-actions";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";

interface CodesTabProps {
  initialPricing: PricingConfig;
  initialCodes: AccessCodeDetail[];
}

export function CodesTab({ initialPricing, initialCodes }: CodesTabProps) {
  const [pricing, setPricing] = React.useState<PricingConfig>(initialPricing);
  const [codes, setCodes] = React.useState<AccessCodeDetail[]>(initialCodes);
  const [isSavingPricing, setIsSavingPricing] = React.useState(false);
  const [isCreatingCode, setIsCreatingCode] = React.useState(false);
  const [deletingCode, setDeletingCode] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  // New Code Form State
  const [newCode, setNewCode] = React.useState<CreateAccessCodeInput>({
    code: "",
    code_type: "DISCOUNT_PERCENT",
    discount_percent: 90,
    drills_granted: 8,
    max_redemptions: 50,
    expires_at: null,
  });

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingPricing(true);
      setToast(null);
      await updatePricingConfigAction(pricing);
      setToast("[ SUCCESS: PLATFORM PRICING CONFIG UPDATED IN SUPABASE ]");
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setIsSavingPricing(false);
    }
  };

  const applyPreset = (preset: "DISCOUNT_90" | "DISCOUNT_99" | "FREE_SCHOLARSHIP" | "B2B_COHORT" | "GOD_MODE_TESTER") => {
    switch (preset) {
      case "DISCOUNT_90":
        setNewCode({
          code: `DISCOUNT90-${Math.floor(1000 + Math.random() * 9000)}`,
          code_type: "DISCOUNT_PERCENT",
          discount_percent: 90,
          drills_granted: 8,
          max_redemptions: 100,
          expires_at: null,
        });
        break;
      case "DISCOUNT_99":
        setNewCode({
          code: `PROMO99-${Math.floor(1000 + Math.random() * 9000)}`,
          code_type: "DISCOUNT_PERCENT",
          discount_percent: 99,
          drills_granted: 8,
          max_redemptions: 50,
          expires_at: null,
        });
        break;
      case "FREE_SCHOLARSHIP":
        setNewCode({
          code: `SCHOLARSHIP-${Math.floor(1000 + Math.random() * 9000)}`,
          code_type: "COHORT_SPONSOR",
          discount_percent: 100,
          drills_granted: 15,
          max_redemptions: 25,
          expires_at: null,
        });
        break;
      case "B2B_COHORT":
        setNewCode({
          code: `COHORT-L2E-${Math.floor(1000 + Math.random() * 9000)}`,
          code_type: "COHORT_SPONSOR",
          discount_percent: 100,
          drills_granted: 20,
          max_redemptions: 50,
          expires_at: null,
        });
        break;
      case "GOD_MODE_TESTER":
        setNewCode({
          code: `GODMODE-VIP-${Math.floor(1000 + Math.random() * 9000)}`,
          code_type: "VIP_GOD_MODE",
          discount_percent: 100,
          drills_granted: 999,
          max_redemptions: 5,
          expires_at: null,
        });
        break;
    }
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.code.trim()) return;

    try {
      setIsCreatingCode(true);
      setToast(null);
      await createAccessCodeAction(newCode);
      setCodes((prev) => [
        {
          code: newCode.code.toUpperCase().trim(),
          codeType: newCode.code_type,
          discountPercent: newCode.discount_percent,
          drillsGranted: newCode.drills_granted,
          maxRedemptions: newCode.max_redemptions,
          currentRedemptions: 0,
          expiresAt: newCode.expires_at ?? null,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setToast(`[ ACCESS CODE ${newCode.code.toUpperCase()} CREATED SUCCESSFULLY ]`);
      setNewCode({
        code: "",
        code_type: "DISCOUNT_PERCENT",
        discount_percent: 90,
        drills_granted: 8,
        max_redemptions: 50,
        expires_at: null,
      });
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setIsCreatingCode(false);
    }
  };

  const handleDeleteCode = async (code: string) => {
    try {
      setDeletingCode(code);
      setToast(null);
      await deleteAccessCodeAction(code);
      setCodes((prev) => prev.filter((c) => c.code !== code));
      setToast(`[ CODE ${code} DEACTIVATED ]`);
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setDeletingCode(null);
    }
  };

  return (
    <div className="space-y-8">
      {toast && (
        <div className="border border-signal-cta bg-signal-cta/10 p-3 font-mono text-xs text-signal-cta">
          {toast}
        </div>
      )}

      {/* Dynamic Pricing Engine Form */}
      <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6">
        <HudBracketHeader variant="warn">
          DYNAMIC PRICING &amp; FREE TRIAL SETTINGS
        </HudBracketHeader>
        <p className="font-mono text-xs text-[var(--text-muted)] mt-1 mb-6">
          Adjust live anchor subscription pricing, retake packs, and trial duration without redeploying code.
        </p>

        <form onSubmit={handleSavePricing} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
              MONTHLY ANCHOR (NGN)
            </label>
            <input
              type="number"
              value={pricing.monthly_anchor_ngn}
              onChange={(e) =>
                setPricing({ ...pricing, monthly_anchor_ngn: parseInt(e.target.value) || 0 })
              }
              className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
              CERTIFICATE BASE (NGN)
            </label>
            <input
              type="number"
              value={pricing.certificate_base_ngn}
              onChange={(e) =>
                setPricing({ ...pricing, certificate_base_ngn: parseInt(e.target.value) || 0 })
              }
              className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
              RETAKE PACK (NGN)
            </label>
            <input
              type="number"
              value={pricing.retake_pack_ngn}
              onChange={(e) =>
                setPricing({ ...pricing, retake_pack_ngn: parseInt(e.target.value) || 0 })
              }
              className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
              FREE TRIAL DAYS
            </label>
            <input
              type="number"
              value={pricing.free_trial_days}
              onChange={(e) =>
                setPricing({ ...pricing, free_trial_days: parseInt(e.target.value) || 0 })
              }
              className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 pt-2">
            <button
              type="submit"
              disabled={isSavingPricing}
              className="font-mono text-xs bg-signal-cta text-black font-bold px-6 py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity rounded-none"
            >
              {isSavingPricing ? "[ SAVING SETTINGS... ]" : "[ SAVE LIVE PRICING ]"}
            </button>
          </div>
        </form>
      </div>

      {/* Access & Scholarship Code Generator */}
      <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6">
        <HudBracketHeader variant="pass">
          SCHOLARSHIP &amp; ACCESS CODE GENERATOR
        </HudBracketHeader>
        <p className="font-mono text-xs text-[var(--text-muted)] mt-1 mb-4">
          Generate promo codes, sponsor cohort vouchers, or VIP God-Mode tester keys.
        </p>

        {/* 1-Click Presets */}
        <div className="mb-6">
          <span className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-2">
            1-CLICK PRESETS:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset("DISCOUNT_90")}
              className="font-mono text-[11px] border border-[var(--border-grid)] px-3 py-1.5 hover:border-signal-cta text-[var(--text-primary)] rounded-none"
            >
              [ + 90% DISCOUNT ]
            </button>
            <button
              type="button"
              onClick={() => applyPreset("DISCOUNT_99")}
              className="font-mono text-[11px] border border-[var(--border-grid)] px-3 py-1.5 hover:border-signal-cta text-[var(--text-primary)] rounded-none"
            >
              [ + 99% DISCOUNT ]
            </button>
            <button
              type="button"
              onClick={() => applyPreset("FREE_SCHOLARSHIP")}
              className="font-mono text-[11px] border border-signal-pass text-signal-pass px-3 py-1.5 hover:bg-signal-pass/10 rounded-none font-bold"
            >
              [ + 100% SCHOLARSHIP ]
            </button>
            <button
              type="button"
              onClick={() => applyPreset("B2B_COHORT")}
              className="font-mono text-[11px] border border-[var(--border-grid)] px-3 py-1.5 hover:border-signal-cta text-[var(--text-primary)] rounded-none"
            >
              [ + B2B COHORT SPONSOR ]
            </button>
            <button
              type="button"
              onClick={() => applyPreset("GOD_MODE_TESTER")}
              className="font-mono text-[11px] border border-signal-warn text-signal-warn px-3 py-1.5 hover:bg-signal-warn/10 rounded-none font-bold"
            >
              [ + VIP GOD MODE TESTER ]
            </button>
          </div>
        </div>

        {/* Code Generator Form */}
        <form onSubmit={handleCreateCode} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 border-b border-[var(--border-grid)] pb-8">
          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
              CODE STRING (UPPERCASE)
            </label>
            <input
              type="text"
              required
              value={newCode.code}
              onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
              placeholder="e.g. IYIN-GODMODE-2026"
              className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none uppercase"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
              CODE TYPE
            </label>
            <select
              value={newCode.code_type}
              onChange={(e) =>
                setNewCode({ ...newCode, code_type: e.target.value as any })
              }
              className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
            >
              <option value="DISCOUNT_PERCENT">DISCOUNT_PERCENT</option>
              <option value="COHORT_SPONSOR">COHORT_SPONSOR</option>
              <option value="VIP_GOD_MODE">VIP_GOD_MODE</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
              DISCOUNT PERCENT (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={newCode.discount_percent}
              onChange={(e) =>
                setNewCode({ ...newCode, discount_percent: parseInt(e.target.value) || 0 })
              }
              className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
              DRILLS GRANTED
            </label>
            <input
              type="number"
              min={1}
              value={newCode.drills_granted}
              onChange={(e) =>
                setNewCode({ ...newCode, drills_granted: parseInt(e.target.value) || 1 })
              }
              className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
              MAX REDEMPTIONS
            </label>
            <input
              type="number"
              min={1}
              value={newCode.max_redemptions}
              onChange={(e) =>
                setNewCode({ ...newCode, max_redemptions: parseInt(e.target.value) || 1 })
              }
              className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isCreatingCode}
              className="w-full font-mono text-xs bg-signal-pass text-black font-bold px-4 py-2 hover:opacity-90 disabled:opacity-50 transition-opacity rounded-none"
            >
              {isCreatingCode ? "[ GENERATING... ]" : "[ CREATE ACCESS CODE ]"}
            </button>
          </div>
        </form>

        {/* Existing Codes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-grid)] text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                <th className="p-2">Code</th>
                <th className="p-2">Type</th>
                <th className="p-2">Discount</th>
                <th className="p-2">Drills</th>
                <th className="p-2">Redeemed</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-grid)]">
              {codes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-[var(--text-muted)]">
                    [ ZERO ACTIVE ACCESS CODES ]
                  </td>
                </tr>
              ) : (
                codes.map((c) => {
                  const isBusy = deletingCode === c.code;
                  return (
                    <tr key={c.code} className="hover:bg-[var(--bg-canvas)]/50 transition-colors">
                      <td className="p-2 font-bold text-signal-cta">{c.code}</td>
                      <td className="p-2 text-[11px] text-[var(--text-muted)]">{c.codeType}</td>
                      <td className="p-2 font-bold text-signal-pass">{c.discountPercent}%</td>
                      <td className="p-2">{c.drillsGranted}</td>
                      <td className="p-2">
                        {c.currentRedemptions} / {c.maxRedemptions}
                      </td>
                      <td className="p-2">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDeleteCode(c.code)}
                          className="text-[10px] text-signal-fault border border-signal-fault/40 px-2 py-1 hover:border-signal-fault transition-colors rounded-none"
                        >
                          {isBusy ? "..." : "[ DEACTIVATE ]"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
