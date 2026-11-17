"use client";

/**
 * @purpose Persistent 28px bottom status bar showing connectivity, sandbox environment, strikes, and theme toggle.
 * @security Local state only; triggers validated URL search param transitions for theme without external requests.
 * @reference docs/06_UI_DESIGN_SYSTEM.md (Section 4: BottomTelemetryBar)
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

export interface BottomTelemetryBarProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: string;
  sandbox?: string;
  strikes?: number;
  maxStrikes?: number;
  roastLevel?: string;
  quotaRemaining?: string;
}

export function BottomTelemetryBar({
  status = "ONLINE (3G GRACE READY)",
  sandbox = "v86_WASM_LINUX",
  strikes = 0,
  maxStrikes = 2,
  roastLevel = "LEVEL 2 (STRICT UNCLE)",
  quotaRemaining = "7/8 DRILLS LEFT",
  className,
  ...props
}: BottomTelemetryBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 h-7 bg-surface border-t border-border-grid flex items-center justify-between px-3 font-mono text-[11px] text-text-secondary select-none z-50",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="flex items-center gap-1.5 text-signal-pass font-bold">
          <span className="inline-block w-2 h-2 bg-signal-pass" />
          {status}
        </span>
        <span className="text-border-grid">|</span>
        <span className="hidden sm:inline">SANDBOX: {sandbox}</span>
        <span className="text-border-grid hidden sm:inline">|</span>
        <span className={strikes > 0 ? "text-signal-fault font-bold" : "text-text-secondary"}>
          STRIKES: {strikes}/{maxStrikes}
        </span>
      </div>

      <div className="flex items-center gap-3 whitespace-nowrap">
        <span className="hidden md:inline text-text-muted">ROAST: {roastLevel}</span>
        <span className="text-border-grid hidden md:inline">|</span>
        <span className="hidden lg:inline text-text-muted">QUOTA: {quotaRemaining}</span>
        <span className="text-border-grid hidden lg:inline">|</span>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Atmosphere Theme"
          className="text-text-primary hover:text-signal-cta cursor-pointer uppercase transition-colors"
        >
          [THEME: {theme.toUpperCase()}]
        </button>
      </div>
    </footer>
  );
}
