/**
 * @purpose Structural grid cell component rendering clean industrial panels with optional dot matrix.
 * @security Encapsulates presentation styling and prevents style bleed or unescaped HTML content.
 * @reference docs/06_UI_DESIGN_SYSTEM.md (Section 4: GridCell)
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface GridCellProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "surface" | "canvas" | "elevated";
  dotMatrix?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children?: React.ReactNode;
}

const variantStyles = {
  surface: "bg-surface",
  canvas: "bg-canvas",
  elevated: "bg-elevated",
};

const paddingStyles = {
  none: "p-0",
  sm: "p-3",
  md: "p-6",
  lg: "p-8 md:p-12",
};

export const GridCell = React.forwardRef<HTMLDivElement, GridCellProps>(
  ({ variant = "surface", dotMatrix = false, padding = "md", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          paddingStyles[padding],
          dotMatrix && "dot-matrix",
          "relative overflow-hidden text-text-primary",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridCell.displayName = "GridCell";
