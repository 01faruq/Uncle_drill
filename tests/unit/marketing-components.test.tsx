import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { PromoCodeCalculator } from "@/components/marketing/PromoCodeCalculator";
import { RoastPreviewTerminal } from "@/components/marketing/RoastPreviewTerminal";
import { TrustLogos } from "@/components/marketing/TrustLogos";
import { ReviewsSection } from "@/components/marketing/ReviewsSection";
import { HudSectionScrubber } from "@/components/marketing/HudSectionScrubber";
import { AUDIT_REVIEWS } from "@/lib/config/reviews";

describe("Marketing Components Suite", () => {
  describe("PromoCodeCalculator", () => {
    it("displays default anchor pricing of ₦10,000", () => {
      render(
        <NuqsTestingAdapter>
          <PromoCodeCalculator />
        </NuqsTestingAdapter>
      );
      expect(screen.getByText(/₦10,000/)).toBeInTheDocument();
      expect(screen.getByText(/ANCHOR PRICING/i)).toBeInTheDocument();
    });

    it("applies BUILD90 code reducing price to ₦1,000", () => {
      render(
        <NuqsTestingAdapter searchParams={{ promo: "BUILD90" }}>
          <PromoCodeCalculator />
        </NuqsTestingAdapter>
      );
      expect(screen.getByText(/₦1,000/)).toBeInTheDocument();
      expect(screen.getByText(/90% DISCOUNT APPLIED/i)).toBeInTheDocument();
    });
  });

  describe("RoastPreviewTerminal", () => {
    it("renders default roast level 2 strict uncle message", () => {
      render(
        <NuqsTestingAdapter searchParams={{ roast: "2" }}>
          <RoastPreviewTerminal />
        </NuqsTestingAdapter>
      );
      expect(screen.getByText(/STRICT UNCLE/i)).toBeInTheDocument();
      expect(screen.getByText(/ROAST LVL 2/i)).toBeInTheDocument();
    });
  });

  describe("TrustLogos", () => {
    it("renders all 5 brand logos (Cloudflare, Stripe, Anthropic, Paystack, Moniepoint)", () => {
      render(<TrustLogos />);
      expect(screen.getAllByText(/CLOUDFLARE/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/stripe/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/ANTHROPIC/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/paystack/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/moniepoint/i)[0]).toBeInTheDocument();
    });
  });

  describe("ReviewsSection & AUDIT_REVIEWS", () => {
    it("has 5 verified developer reviews in config", () => {
      expect(AUDIT_REVIEWS).toHaveLength(5);
      AUDIT_REVIEWS.forEach((rev) => {
        expect(rev.name).toBeTruthy();
        expect(rev.role).toBeTruthy();
        expect(rev.quote).toBeTruthy();
        expect(rev.auditBadge).toContain("PASSED MILESTONE");
      });
    });

    it("renders reviews section title and reviewer cards", () => {
      render(<ReviewsSection />);
      expect(
        screen.getByText(/VERIFIED AUDIT TRANSCRIPTS FROM THE FRONT LINES/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Tunde Bakare/i)).toBeInTheDocument();
      expect(screen.getByText(/Amina Bello/i)).toBeInTheDocument();
      expect(screen.getByText(/Chidi Okonkwo/i)).toBeInTheDocument();
    });
  });

  describe("HudSectionScrubber", () => {
    it("renders HUD navigation item buttons", () => {
      render(<HudSectionScrubber />);
      expect(screen.getByText(/HUD \/\/ NAV/i)).toBeInTheDocument();
      expect(screen.getByText(/01/i)).toBeInTheDocument();
      expect(screen.getByText(/02/i)).toBeInTheDocument();
      expect(screen.getByText(/07/i)).toBeInTheDocument();
    });
  });
});
