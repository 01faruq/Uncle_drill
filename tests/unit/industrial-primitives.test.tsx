import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { StructuralGrid } from "@/components/ui/industrial/StructuralGrid";
import { GridCell } from "@/components/ui/industrial/GridCell";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { AsciiDivider } from "@/components/ui/industrial/AsciiDivider";
import { DrillButton } from "@/components/ui/industrial/DrillButton";
import { TelemetryLogStream } from "@/components/ui/industrial/TelemetryLogStream";
import { BottomTelemetryBar } from "@/components/ui/industrial/BottomTelemetryBar";

describe("Industrial Primitives Suite", () => {
  describe("StructuralGrid & GridCell", () => {
    it("renders structural grid with 1px border grid background", () => {
      const { container } = render(
        <StructuralGrid columns={2}>
          <GridCell>Cell 1</GridCell>
          <GridCell dotMatrix>Cell 2</GridCell>
        </StructuralGrid>
      );
      expect(screen.getByText("Cell 1")).toBeInTheDocument();
      expect(screen.getByText("Cell 2")).toBeInTheDocument();
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("bg-border-grid");
    });
  });

  describe("HudBracketHeader", () => {
    it("renders text framed in Kessler HUD brackets", () => {
      render(<HudBracketHeader>TARGET BRACKET ACTIVE</HudBracketHeader>);
      const header = screen.getByText(/TARGET BRACKET ACTIVE/);
      expect(header).toBeInTheDocument();
      expect(header.textContent).toContain("⌈");
      expect(header.textContent).toContain("⌋");
    });
  });

  describe("AsciiDivider", () => {
    it("renders terminal waveform divider with label", () => {
      render(<AsciiDivider label="AUDIT LOG" variant="waveform" />);
      expect(screen.getByText(/AUDIT LOG/)).toBeInTheDocument();
      expect(screen.getByText(/\/\\_\/\\_/)).toBeInTheDocument();
    });
  });

  describe("DrillButton", () => {
    it("renders acid variant and triggers onClick", () => {
      const handleClick = vi.fn();
      render(
        <DrillButton variant="acid" onClick={handleClick}>
          DRILL ME NOW
        </DrillButton>
      );
      const button = screen.getByRole("button", { name: /DRILL ME NOW/i });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("renders executing loading state and prevents click execution", () => {
      const handleClick = vi.fn();
      render(
        <DrillButton isLoading onClick={handleClick}>
          DRILL ME NOW
        </DrillButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent(/\[ EXECUTING\.\.\. \]/);
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("TelemetryLogStream", () => {
    it("renders formatted timestamped telemetry events", () => {
      const logs = [
        { timestamp: "20:17:21", level: "error" as const, message: "Missing set -euo pipefail" },
        { timestamp: "20:17:44", level: "pass" as const, message: "Gate 1 passed" },
      ];
      render(<TelemetryLogStream logs={logs} />);
      expect(screen.getByText(/\[20:17:21\]/)).toBeInTheDocument();
      expect(screen.getByText(/Missing set -euo pipefail/)).toBeInTheDocument();
      expect(screen.getByText(/Gate 1 passed/)).toBeInTheDocument();
    });
  });

  describe("BottomTelemetryBar", () => {
    it("renders persistent footer with connection status and strikes", () => {
      render(
        <NuqsTestingAdapter>
          <BottomTelemetryBar
            status="ONLINE"
            sandbox="v86_WASM_LINUX"
            strikes={0}
            maxStrikes={2}
            roastLevel="LEVEL 2 (STRICT UNCLE)"
          />
        </NuqsTestingAdapter>
      );
      expect(screen.getByText(/ONLINE/)).toBeInTheDocument();
      expect(screen.getByText(/v86_WASM_LINUX/)).toBeInTheDocument();
      expect(screen.getByText(/0\/2/)).toBeInTheDocument();
    });
  });
});
