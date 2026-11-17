/**
 * @purpose Schema definitions and TypeScript interfaces for the Founder Command Room (/command).
 * @security Provides strict runtime Zod validation for administrative mutations.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 5: Founder Command Room)
 */
import { z } from "zod";
import type { UserRole, AccountStatus, AccessCodeType } from "@/types/database.types";

// ==============================================================================
// 1. Overview & Apology Appeal Types
// ==============================================================================

export interface PlatformOverviewMetrics {
  totalUsers: number;
  activeDrills: number;
  passRate: number;
  suspendedAccounts: number;
}

export interface ApologyAppealDetail {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  letterBody: string;
  aiScreeningNotes: string | null;
  status: string;
  submittedAt: string;
}

// ==============================================================================
// 2. Cadet Management Types
// ==============================================================================

export interface CadetDetail {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: AccountStatus;
  gritXp: number;
  drillsRemaining: number;
  cheatStrikes: number;
  godModeEnabled: boolean;
  lastActiveAt: string;
  cooldownUntil: string | null;
}

export const UpdateUserRoleSchema = z.object({
  userId: z.string().uuid("Invalid user UUID"),
  role: z.enum(["STUDENT", "PEER_AUDITOR", "B2B_ADMIN", "SUPER_ADMIN"]),
});
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;

export const UpdateUserStatusSchema = z.object({
  userId: z.string().uuid("Invalid user UUID"),
  status: z.enum(["ACTIVE", "SUSPENDED_CHEATING", "BANNED_PERMANENT"]),
});
export type UpdateUserStatusInput = z.infer<typeof UpdateUserStatusSchema>;

export const GrantBonusDrillsSchema = z.object({
  userId: z.string().uuid("Invalid user UUID"),
  amount: z.number().int().positive("Bonus drills must be positive"),
});
export type GrantBonusDrillsInput = z.infer<typeof GrantBonusDrillsSchema>;

export const ToggleGodModeSchema = z.object({
  userId: z.string().uuid("Invalid user UUID"),
  enabled: z.boolean(),
});
export type ToggleGodModeInput = z.infer<typeof ToggleGodModeSchema>;

// ==============================================================================
// 3. Pricing & Access Codes Schemas
// ==============================================================================

export const PricingConfigSchema = z.object({
  monthly_anchor_ngn: z.number().int().min(0),
  certificate_base_ngn: z.number().int().min(0),
  retake_pack_ngn: z.number().int().min(0),
  free_trial_days: z.number().int().min(0),
});
export type PricingConfig = z.infer<typeof PricingConfigSchema>;

export const CreateAccessCodeSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(50)
    .regex(/^[A-Z0-9_-]+$/, "Code must contain uppercase alphanumeric characters, dashes, or underscores"),
  code_type: z.enum(["DISCOUNT_PERCENT", "COHORT_SPONSOR", "VIP_GOD_MODE"]),
  discount_percent: z.number().int().min(0).max(100).default(0),
  drills_granted: z.number().int().min(0).default(8),
  max_redemptions: z.number().int().min(1).default(1),
  expires_at: z.string().nullable().optional(),
});
export type CreateAccessCodeInput = z.infer<typeof CreateAccessCodeSchema>;

export interface AccessCodeDetail {
  code: string;
  codeType: AccessCodeType;
  discountPercent: number;
  drillsGranted: number;
  maxRedemptions: number;
  currentRedemptions: number;
  expiresAt: string | null;
  createdAt: string;
}

// ==============================================================================
// 4. Curriculum & CMS Schemas
// ==============================================================================

export const UpsertMilestoneSchema = z.object({
  milestone_id: z.string().min(2),
  phase: z.number().int().min(1).max(5),
  sequence_order: z.number().int().min(1),
  title: z.string().min(2),
  is_live_in_v1: z.boolean().default(false),
  time_limit_minutes: z.number().int().min(5).max(180).default(25),
  mental_model: z.string().min(10),
  disaster_story: z.string().min(10),
  project_brief: z.string().min(10),
  primary_resources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      type: z.string(),
    })
  ).default([]),
});
export type UpsertMilestoneInput = z.infer<typeof UpsertMilestoneSchema>;

export const CreateCuratedResourceSchema = z.object({
  milestone_id: z.string().min(2),
  title: z.string().min(2),
  url: z.string().url(),
  format_type: z.enum(["OFFICIAL_DOC", "BOOK_CHAPTER", "INTERACTIVE_SIM", "VIDEO_LECTURE", "ARTICLE"]),
  learning_style_tags: z.array(z.string()).default([]),
  uncle_commentary: z.string().min(5),
});
export type CreateCuratedResourceInput = z.infer<typeof CreateCuratedResourceSchema>;

export const LandingCopySchema = z.object({
  hero_headline: z.string().optional(),
  manifesto_quote: z.string().optional(),
  beta_reviews: z.array(
    z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
      handle: z.string(),
      metric: z.string(),
    })
  ).optional(),
});
export type LandingCopyInput = z.infer<typeof LandingCopySchema>;

// ==============================================================================
// 5. AI Router Switchboard Schemas
// ==============================================================================

export const AiRouterConfigSchema = z.object({
  study_room_provider: z.string().min(3),
  drill_room_provider: z.string().min(3),
  stt_provider: z.string().min(3),
  daily_study_turns: z.number().int().min(1).max(200).default(20),
  max_drill_turns: z.number().int().min(1).max(100).default(15),
  daily_token_limit: z.number().int().min(1000).default(50000),
  study_room_prompt_override: z.string().optional(),
  drill_room_prompt_override: z.string().optional(),
});
export type AiRouterConfig = z.infer<typeof AiRouterConfigSchema>;
