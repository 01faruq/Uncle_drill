/**
 * @purpose High-contrast industrial action button with anti-double-submission lock and zero border radius.
 * @security Throttles double-clicks via isLoading state to guard against duplicate payment and attempt burns.
 * @reference docs/06_UI_DESIGN_SYSTEM.md (Section 4: DrillButton)
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface DrillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "acid" | "terminal" | "danger" | "paper";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  arrow?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  acid: "bg-signal-cta text-text-inverse border border-signal-cta hover:bg-text-primary hover:text-text-inverse hover:border-text-primary",
  terminal: "bg-surface text-text-primary border border-border-grid hover:border-text-primary hover:bg-elevated",
  danger: "bg-surface text-signal-fault border border-signal-fault hover:bg-signal-fault hover:text-text-inverse",
  paper: "bg-paper-ink text-paper-canvas border border-paper-ink hover:bg-paper-surface hover:text-paper-ink",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-[11px]",
  md: "px-5 py-2.5 text-[12px]",
  lg: "px-7 py-3.5 text-[13px]",
};

export const DrillButton = React.forwardRef<HTMLButtonElement, DrillButtonProps>(
  (
    {
      variant = "terminal",
      size = "md",
      isLoading = false,
      arrow = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-mono font-bold tracking-hud uppercase select-none transition-colors duration-100 ease-linear disabled:opacity-50 disabled:cursor-not-allowed rounded-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <span className="inline-block animate-pulse">■</span>
            [ EXECUTING... ]
          </span>
        ) : (
          <>
            <span>{children}</span>
            {arrow && <span aria-hidden="true">-&gt;</span>}
          </>
        )}
      </button>
    );
  }
);

DrillButton.displayName = "DrillButton";
