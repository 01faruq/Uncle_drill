"use client";

/**
 * @purpose Interactive discount & scholarship calculator demonstrating the ₦10,000 anchor pricing strategy.
 * @security Client-side promo simulator; server checkout strictly re-validates promo eligibility via database RPC.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 3: Pricing Psychology & Promo Engine)
 */
import * as React from "react";
import { useQueryState } from "nuqs";
import { DrillButton } from "@/components/ui/industrial/DrillButton";

const PROMO_CODES: Record<
  string,
  { discountPercent: number; finalPriceNaira: number; label: string; note: string }
> = {
  BUILD90: {
    discountPercent: 90,
    finalPriceNaira: 1000,
    label: "BUILD90 — 90% DISCOUNT APPLIED",
    note: "Cohort builder rate unlocked. ₦9,000 subsidized by Uncle Drill fund.",
  },
  FELLOW99: {
    discountPercent: 99,
    finalPriceNaira: 100,
    label: "FELLOW99 — 99% SCHOLARSHIP APPLIED",
    note: "Full scholarship rate unlocked. ₦9,900 subsidized for verified learners.",
  },
  VIP100: {
    discountPercent: 100,
    finalPriceNaira: 0,
    label: "VIP100 — 100% GOD-MODE ACCESS",
    note: "Founder/Investor access granted. Unlimited drills across all 5 phases.",
  },
};

const BASE_PRICE_NAIRA = 10000;

export function PromoCodeCalculator() {
  const [promoParam, setPromoParam] = useQueryState("promo");
  const [inputCode, setInputCode] = React.useState(promoParam || "");

  const activeCode = (promoParam || "").trim().toUpperCase();
  const matchedPromo = PROMO_CODES[activeCode];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoParam(inputCode.trim().toUpperCase() || null);
  };

  return (
    <div className="w-full bg-canvas border border-border-grid p-6 text-text-primary">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-grid pb-4 mb-6">
        <div>
          <span className="font-mono text-[11px] text-text-muted tracking-hud uppercase block">
            OFFICIAL ANCHOR PRICING
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-display text-3xl sm:text-4xl text-text-primary">
              ₦{matchedPromo ? matchedPromo.finalPriceNaira.toLocaleString() : BASE_PRICE_NAIRA.toLocaleString()}
            </span>
            <span className="font-mono text-xs text-text-muted">/ MONTH</span>
            {matchedPromo && (
              <span className="line-through font-mono text-sm text-text-muted">
                ₦{BASE_PRICE_NAIRA.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="font-mono text-[11px] text-signal-pass tracking-hud uppercase block font-bold">
            [ 100% SATISFACTION OR ROASTED ]
          </span>
          <span className="font-mono text-xs text-text-secondary">
            Pay with Bank Transfer, Card, or USSD
          </span>
        </div>
      </div>

      <form onSubmit={handleApply} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          placeholder="ENTER PROMO CODE (e.g. BUILD90)"
          aria-label="Promo Code Input"
          className="flex-1 bg-surface border border-border-grid px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus uppercase tracking-wider"
        />
        <DrillButton type="submit" variant="terminal" size="sm">
          APPLY CODE
        </DrillButton>
      </form>

      {matchedPromo ? (
        <div className="p-3 bg-surface border-l-2 border-signal-cta text-xs font-mono">
          <div className="text-signal-cta font-bold">{matchedPromo.label}</div>
          <div className="text-text-secondary mt-1">{matchedPromo.note}</div>
        </div>
      ) : activeCode ? (
        <div className="p-3 bg-surface border-l-2 border-signal-fault text-xs font-mono">
          <div className="text-signal-fault font-bold">[INVALID PROMO CODE: {activeCode}]</div>
          <div className="text-text-secondary mt-1">
            Uncle Drill says: &quot;Nice try, bro. That code doesn&apos;t exist. Try BUILD90 for 90% off or pay your ₦10,000.&quot;
          </div>
        </div>
      ) : (
        <div className="text-xs font-mono text-text-muted flex flex-wrap gap-2 items-center">
          <span>TRY CODES:</span>
          <button
            type="button"
            onClick={() => {
              setInputCode("BUILD90");
              setPromoParam("BUILD90");
            }}
            className="text-signal-cta hover:underline"
          >
            BUILD90 (₦1,000)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setInputCode("FELLOW99");
              setPromoParam("FELLOW99");
            }}
            className="text-signal-cta hover:underline"
          >
            FELLOW99 (₦100)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setInputCode("VIP100");
              setPromoParam("VIP100");
            }}
            className="text-signal-pass hover:underline"
          >
            VIP100 (FREE)
          </button>
        </div>
      )}
    </div>
  );
}
