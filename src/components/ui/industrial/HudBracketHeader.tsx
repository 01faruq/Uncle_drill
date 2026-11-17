/**
 * @purpose Kessler-style HUD bracket header callout for high-priority status signals.
 * @security Renders sanitized text within accessible screen-reader annotations.
 * @reference docs/06_UI_DESIGN_SYSTEM.md (Section 4: HudBracketHeader)
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface HudBracketHeaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "warn" | "pass" | "fault" | "primary" | "info";
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  children: React.ReactNode;
}

const variantStyles = {
  warn: "text-signal-warn",
  pass: "text-signal-pass",
  fault: "text-signal-fault",
  primary: "text-text-primary",
  info: "text-signal-info",
};

export function HudBracketHeader({
  variant = "warn",
  as: Component = "span",
  className,
  children,
  ...props
}: HudBracketHeaderProps) {
  return (
    <Component
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[11px] font-semibold tracking-hud uppercase select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      ⌈ {children} ⌋
    </Component>
  );
}
