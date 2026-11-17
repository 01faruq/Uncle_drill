/**
 * @purpose Canonical TypeScript Domain Types for Curriculum, Resources & Pre-Drill Checklists.
 * @security Zero client-side leakage of private grading rubrics. Pure types for public curriculum.
 * @reference docs/03_CURRICULUM_RUBRICS.md, docs/04_SYSTEM_ARCHITECTURE.md
 */

export type ResourceFormatType =
  | "OFFICIAL_DOC"
  | "BOOK_CHAPTER"
  | "INTERACTIVE_SIM"
  | "VIDEO_LECTURE"
  | "ARTICLE";

export type ChecklistCategory = "BASIC" | "REQUIRED" | "EXPLORE_BEYOND";

export interface ChecklistItem {
  id: string;
  label: string;
  category: ChecklistCategory;
  description?: string;
}

export interface CuratedResource {
  id: string;
  milestoneId: string;
  title: string;
  url: string;
  formatType: ResourceFormatType;
  learningStyleTags: string[];
  uncleCommentary: string;
}

export interface DisasterStory {
  title: string;
  company: string;
  year: string;
  narrative: string;
  lesson: string;
}

export interface MentalModel {
  title: string;
  coreThesis: string;
  paragraphs: string[];
  keyTakeaways: string[];
}

export interface PracticeProject {
  title: string;
  artifactName: string;
  brief: string;
  requirements: string[];
  exploreBeyondWarning: string;
}

export interface Milestone {
  milestoneId: string; // e.g. "1.1"
  slug: string; // e.g. "1.1-ubuntu-survival"
  phase: number; // 1-5
  sequenceOrder: number;
  title: string;
  shortTitle: string;
  summary: string;
  isLiveInV1: boolean;
  status: "READY" | "IN_PROGRESS" | "LOCKED";
  timeLimitMinutes: number;
  disasterStory: DisasterStory;
  mentalModel: MentalModel;
  practiceProject: PracticeProject;
  resources: CuratedResource[];
  checklist: ChecklistItem[];
  nonNegotiables: string[];
  stressTestQuestions: string[];
}

export interface CurriculumPhase {
  phase: number;
  title: string;
  subtitle: string;
  status: "ACTIVE" | "LOCKED" | "PREVIEW";
  description: string;
  milestones: Milestone[];
}

export interface MilestoneProgress {
  milestoneId: string;
  checkedItemIds: string[];
  totalRequired: number;
  completedRequired: number;
  totalItems: number;
  completedItems: number;
  isGatekeeperUnlocked: boolean;
  lastUpdated: string;
}
