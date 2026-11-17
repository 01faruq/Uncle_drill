/**
 * @purpose Component Test Suite for Pillar 3: ChecklistGatekeeper and FieldManualPrintButton.
 * @security Tests Hard Gatekeeper Lockout invariant in simulated React DOM (jsdom).
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChecklistGatekeeper } from "@/components/milestone/ChecklistGatekeeper";
import { FieldManualPrintButton } from "@/components/milestone/FieldManualPrintButton";
import { getMilestoneById } from "@/lib/data/curriculum";

// Mock server actions to prevent network/db calls in component tests
vi.mock("@/modules/curriculum/checklist-actions", () => ({
  toggleChecklistItemAction: vi.fn().mockResolvedValue({ success: true, progress: null }),
}));

describe("ChecklistGatekeeper Component", () => {
  const milestone = getMilestoneById("1.1")!;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders all checklist sections and initial locked state", () => {
    render(<ChecklistGatekeeper milestone={milestone} initialCheckedIds={[]} />);

    expect(screen.getByText(/01\. Foundational Concept Awareness/i)).toBeInTheDocument();
    expect(screen.getByText(/02\. Non-Negotiable Mastery \(100% Required\)/i)).toBeInTheDocument();
    expect(screen.getByText(/03\. Explore Beyond/i)).toBeInTheDocument();

    // Required progress is 0/4
    expect(screen.getByText(/0\/4 \(0%\)/i)).toBeInTheDocument();

    // Gatekeeper button is locked and disabled
    const lockedBtn = screen.getByText(/\[ LOCKED \/\/ 100% REQUIRED NEEDED \]/i);
    expect(lockedBtn).toBeInTheDocument();
    expect(lockedBtn).toBeDisabled();
    expect(screen.getByText(/GATEKEEPER LOCKOUT/i)).toBeInTheDocument();
  });

  it("unlocks the Drill Room button strictly after checking 100% of required items", async () => {
    render(<ChecklistGatekeeper milestone={milestone} initialCheckedIds={[]} />);

    const requiredItems = milestone.checklist.filter((i) => i.category === "REQUIRED");

    // Click each required item
    for (const item of requiredItems) {
      const label = screen.getByText(item.label);
      fireEvent.click(label);
    }

    // Now all 4 required items should be checked
    await waitFor(() => {
      expect(screen.getByText(/4\/4 \(100%\)/i)).toBeInTheDocument();
    });

    // Unlocked banner is visible
    expect(
      screen.getByText(/GATEKEEPER PASS: ALL NON-NEGOTIABLES CHECKED/i)
    ).toBeInTheDocument();

    // Proceed button is rendered and links to drill room
    const proceedBtn = screen.getByText(/\[ PROCEED TO DRILL ROOM -> \]/i);
    expect(proceedBtn).toBeInTheDocument();
    expect(proceedBtn.closest("a")).toHaveAttribute("href", "/drill/1.1");
  });

  it("persists checked items to localStorage", async () => {
    render(<ChecklistGatekeeper milestone={milestone} initialCheckedIds={[]} />);

    const firstItem = milestone.checklist[0];
    const label = screen.getByText(firstItem.label);
    fireEvent.click(label);

    const stored = JSON.parse(
      localStorage.getItem(`uncle_drill_checklist_${milestone.milestoneId}`) || "[]"
    );
    expect(stored).toContain(firstItem.id);
  });
});

describe("FieldManualPrintButton Component", () => {
  it("renders download button and triggers window.print()", async () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});

    render(<FieldManualPrintButton milestoneTitle="Ubuntu Survival" />);

    const btn = screen.getByRole("button", { name: /Download Field Manual for Ubuntu Survival as PDF/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent(/\[ DOWNLOAD FIELD MANUAL \(\.PDF\) \]/i);

    fireEvent.click(btn);

    await waitFor(() => {
      expect(printSpy).toHaveBeenCalled();
    });

    printSpy.mockRestore();
  });
});
