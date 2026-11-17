/**
 * @purpose TDD Test Suite for Auth, 3-Question Onboarding, and DesktopDrillGuard.
 * @security Tests onboarding input validation, mobile drill lockdown, and role invariants.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md, docs/06_UI_DESIGN_SYSTEM.md
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { DesktopDrillGuard } from "@/components/drill-room/DesktopDrillGuard";
import {
  onboardingSchema,
  type OnboardingInput,
} from "@/modules/auth/onboarding-schema";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

describe("Sub-Task 1.2: Onboarding Schema Validation", () => {
  it("validates valid onboarding payload", () => {
    const validData: OnboardingInput = {
      displayName: "Tunde",
      casualAddress: "bro",
      experienceLevel: "STUCK_IN_TUTORIAL_HELL",
      preferredAnalogies: ["Fintech & Banking", "Football & Sports"],
    };

    const parsed = onboardingSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it("rejects empty displayName or short name", () => {
    const invalidData = {
      displayName: "T",
      casualAddress: "bro",
      experienceLevel: "COMPLETE_BEGINNER",
      preferredAnalogies: ["Gaming"],
    };

    const parsed = onboardingSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid casual address enum", () => {
    const invalidData = {
      displayName: "Tunde",
      casualAddress: "chief",
      experienceLevel: "EXPERIENCED_DEV",
      preferredAnalogies: ["Gaming"],
    };

    const parsed = onboardingSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it("requires at least 1 preferred analogy domain", () => {
    const invalidData = {
      displayName: "Tunde",
      casualAddress: "bro",
      experienceLevel: "EXPERIENCED_DEV",
      preferredAnalogies: [],
    };

    const parsed = onboardingSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });
});

describe("Sub-Task 1.2: DesktopDrillGuard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders desktop children when viewport is >= 1024px", () => {
    // Mock matchMedia for desktop
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false, // not mobile
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <DesktopDrillGuard milestoneId="1.1-ubuntu-survival">
        <div data-testid="drill-room-terminal">TERMINAL_ACTIVE</div>
      </DesktopDrillGuard>
    );

    expect(screen.getByTestId("drill-room-terminal")).toBeInTheDocument();
  });

  it("locks drill room on mobile viewports (< 1024px) with HUD warning and Study Room / Field Manual links", () => {
    // Mock matchMedia for mobile
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true, // is mobile (< 1024px)
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <DesktopDrillGuard milestoneId="1.1-ubuntu-survival">
        <div data-testid="drill-room-terminal">TERMINAL_ACTIVE</div>
      </DesktopDrillGuard>
    );

    // Terminal children must NOT be visible or rendered
    expect(screen.queryByTestId("drill-room-terminal")).not.toBeInTheDocument();

    // Must show official HUD lockout header
    expect(
      screen.getByText(/DESKTOP TERMINAL REQUIRED/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/NO MOBILE SHORTCUTS/i)
    ).toBeInTheDocument();

    // Must provide Study Room and Field Manual actions
    expect(screen.getByRole("link", { name: /STUDY ROOM/i })).toHaveAttribute(
      "href",
      "/study/1.1-ubuntu-survival"
    );
    expect(screen.getByRole("link", { name: /FIELD MANUAL/i })).toHaveAttribute(
      "href",
      "/roadmap"
    );
  });
});

describe("Sub-Task 1.2: Signup Page Badge Fix", () => {
  it("renders FREE STARTER ACCESS badge avoiding pixel font NO ambiguity", async () => {
    // Dynamic import to satisfy client component dependencies in test environment
    const { default: SignupPage } = await import("@/app/(auth)/signup/page");
    render(<SignupPage />);

    expect(screen.getByText("FREE STARTER ACCESS")).toBeInTheDocument();
    expect(screen.queryByText("₦0 STARTER ACCESS")).not.toBeInTheDocument();
  });
});

describe("Sub-Task 1.2: UncleDrillAvatar and Onboarding Visuals", () => {
  it("renders UncleDrillAvatar and displays fallback SVG when image fails", async () => {
    const { UncleDrillAvatar } = await import("@/components/brand/UncleDrillAvatar");
    const { fireEvent } = await import("@testing-library/react");
    render(<UncleDrillAvatar size={48} />);

    const img = screen.getByRole("img", { name: /Uncle Drill/i });
    expect(img).toBeInTheDocument();

    // Trigger error to verify SVG fallback
    fireEvent.error(img);
    expect(screen.getByLabelText("Uncle Drill avatar")).toBeInTheDocument();
  });

  it("renders OnboardingPage with CONTINUE -> button text without escaped entities", async () => {
    const { default: OnboardingPage } = await import("@/app/(auth)/onboarding/page");
    const { NuqsTestingAdapter } = await import("nuqs/adapters/testing");
    render(
      <NuqsTestingAdapter>
        <OnboardingPage />
      </NuqsTestingAdapter>
    );

    expect(screen.getByRole("button", { name: /CONTINUE ->/i })).toBeInTheDocument();
    expect(screen.queryByText(/CONTINUE &gt;/i)).not.toBeInTheDocument();
  });
});
