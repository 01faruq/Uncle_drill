/**
 * @purpose Structural grid container enforcing 1px hairline architecture without double-border thickness bugs.
 * @security Zero dynamic eval or unsanitized style injection; strictly bound to safe CSS tokens.
 * @reference docs/06_UI_DESIGN_SYSTEM.md (Section 4: StructuralGrid)
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface StructuralGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  children: React.ReactNode;
}

const columnStyles: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-12",
};

export const StructuralGrid = React.forwardRef<HTMLDivElement, StructuralGridProps>(
  ({ columns = 1, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid bg-border-grid gap-[1px] border border-border-grid w-full",
          columnStyles[columns] || "grid-cols-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StructuralGrid.displayName = "StructuralGrid";
