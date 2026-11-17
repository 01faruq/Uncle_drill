/**
 * @purpose ASCII terminal divider replacement for standard HR tags, rendering waveforms and dashed lines.
 * @security Sanitizes string label inputs; purely presentational monospace divider.
 * @reference docs/06_UI_DESIGN_SYSTEM.md (Section 4: AsciiDivider)
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface AsciiDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  variant?: "waveform" | "dashed" | "dotted";
}

export function AsciiDivider({
  label,
  variant = "waveform",
  className,
  ...props
}: AsciiDividerProps) {
  const pattern =
    variant === "waveform"
      ? "/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_"
      : variant === "dashed"
      ? "--------------------------------------------------------------------------------"
      : "· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·";

  return (
    <div
      role="separator"
      className={cn(
        "flex items-center gap-3 overflow-hidden whitespace-nowrap py-1 px-4 text-[11px] font-mono text-text-muted bg-canvas border-y border-border-grid select-none",
        className
      )}
      {...props}
    >
      {label && (
        <span className="font-semibold text-text-secondary tracking-hud uppercase">
          {label}
        </span>
      )}
      <span className="tracking-[0.2em] opacity-60 overflow-hidden text-ellipsis">
        {pattern}
      </span>
    </div>
  );
}
