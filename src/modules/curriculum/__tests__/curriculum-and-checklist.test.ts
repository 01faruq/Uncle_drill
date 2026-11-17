/**
 * @purpose TDD Test Suite for Curriculum Data, Resolver & Gatekeeper Checklist Math.
 * @security Guards against client bypass of checklist readiness and validates normalization.
 * @reference docs/03_CURRICULUM_RUBRICS.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */

import { describe, it, expect } from "vitest";
import {
  getPhases,
  getMilestoneById,
  calculateMilestoneProgress,
  getAllLiveMilestones,
} from "@/lib/data/curriculum";

describe("Curriculum Data Layer & Milestone Resolver", () => {
  it("should return all 5 curriculum phases with Phase 1 active", () => {
    const phases = getPhases();
    expect(phases.length).toBe(5);
    expect(phases[0].phase).toBe(1);
    expect(phases[0].status).toBe("ACTIVE");
    expect(phases[0].milestones.length).toBe(4);
    expect(phases[1].phase).toBe(2);
  });

  it("should normalize milestone lookups by either short ID or slug", () => {
    const byId = getMilestoneById("1.1");
    const bySlug = getMilestoneById("1.1-ubuntu-survival");
    const byPrefixed = getMilestoneById("1.1-ubuntu");

    expect(byId).toBeDefined();
    expect(bySlug).toBeDefined();
    expect(byPrefixed).toBeDefined();
    expect(byId?.milestoneId).toBe("1.1");
    expect(bySlug?.milestoneId).toBe("1.1");
  });

  it("should return undefined for non-existent milestone IDs", () => {
    const invalid = getMilestoneById("9.9-quantum-computing");
    expect(invalid).toBeUndefined();
  });

  it("should verify Phase 1 canonical milestones contain mandatory educational components", () => {
    const milestones = getAllLiveMilestones();
    expect(milestones.length).toBe(4);

    for (const m of milestones) {
      // Must have disaster story with lesson
      expect(m.disasterStory.company).toBeTruthy();
      expect(m.disasterStory.narrative).toBeTruthy();
      expect(m.disasterStory.lesson).toBeTruthy();

      // Must have mental model with core thesis and takeaways
      expect(m.mentalModel.coreThesis).toBeTruthy();
      expect(m.mentalModel.paragraphs.length).toBeGreaterThan(0);
      expect(m.mentalModel.keyTakeaways.length).toBeGreaterThan(0);

      // Must have practice project with explicit "Explore Beyond" callout
      expect(m.practiceProject.artifactName).toBeTruthy();
      expect(m.practiceProject.exploreBeyondWarning).toMatch(/Uncle Drill tests edge cases beyond/i);

      // Must have curated multi-modal resources with format types
      expect(m.resources.length).toBeGreaterThan(0);
      for (const res of m.resources) {
        expect(["OFFICIAL_DOC", "BOOK_CHAPTER", "INTERACTIVE_SIM", "VIDEO_LECTURE", "ARTICLE"]).toContain(
          res.formatType
        );
        expect(res.uncleCommentary).toBeTruthy();
      }

      // Must have checklist with at least 1 REQUIRED item
      const requiredItems = m.checklist.filter((c) => c.category === "REQUIRED");
      expect(requiredItems.length).toBeGreaterThan(0);
    }
  });

  it("should have specific industry disaster stories for all 4 Phase 1 milestones", () => {
    const m1 = getMilestoneById("1.1");
    const m2 = getMilestoneById("1.2");
    const m3 = getMilestoneById("1.3");
    const m4 = getMilestoneById("1.4");

    expect(m1?.disasterStory.company).toMatch(/GitLab/i);
    expect(m2?.disasterStory.narrative).toMatch(/merge conflicts?|reflog/i);
    expect(m3?.disasterStory.narrative).toMatch(/mutable/i);
    expect(m4?.disasterStory.narrative).toMatch(/NoneType|AttributeError|untyped/i);
  });
});

describe("Interactive Gatekeeper Checklist Logic", () => {
  const milestone = getMilestoneById("1.1");

  it("locks the Drill Room when zero checklist items are checked", () => {
    expect(milestone).toBeDefined();
    if (!milestone) return;

    const progress = calculateMilestoneProgress(milestone, []);
    expect(progress.completedRequired).toBe(0);
    expect(progress.isGatekeeperUnlocked).toBe(false);
  });

  it("locks the Drill Room if only non-required items are checked", () => {
    if (!milestone) return;

    const basicOrExploreIds = milestone.checklist
      .filter((c) => c.category !== "REQUIRED")
      .map((c) => c.id);

    const progress = calculateMilestoneProgress(milestone, basicOrExploreIds);
    expect(progress.completedRequired).toBe(0);
    expect(progress.isGatekeeperUnlocked).toBe(false);
  });

  it("locks the Drill Room if required items are partially checked (e.g. 50% or 99%)", () => {
    if (!milestone) return;

    const requiredItems = milestone.checklist.filter((c) => c.category === "REQUIRED");
    // Check all but the last required item
    const partialChecked = requiredItems.slice(0, requiredItems.length - 1).map((c) => c.id);

    const progress = calculateMilestoneProgress(milestone, partialChecked);
    expect(progress.completedRequired).toBe(requiredItems.length - 1);
    expect(progress.isGatekeeperUnlocked).toBe(false);
  });

  it("unlocks the Drill Room strictly when 100% of REQUIRED items are checked", () => {
    if (!milestone) return;

    const requiredIds = milestone.checklist
      .filter((c) => c.category === "REQUIRED")
      .map((c) => c.id);

    const progress = calculateMilestoneProgress(milestone, requiredIds);
    expect(progress.completedRequired).toBe(requiredIds.length);
    expect(progress.totalRequired).toBe(requiredIds.length);
    expect(progress.isGatekeeperUnlocked).toBe(true);
  });
});
