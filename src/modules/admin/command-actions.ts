/**
 * @purpose Server Actions for the Founder Command Room (/command).
 *   Enforces SUPER_ADMIN access verification on every single operation and performs
 *   direct administrative mutations via createAdminClient().
 * @security Every action checks caller identity and role === 'SUPER_ADMIN' before mutating.
 *   Throws UNAUTHORIZED_SUPER_ADMIN if verification fails.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 5: Founder Command Room)
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { UserRole, AccountStatus, AccessCodeType } from "@/types/database.types";
import { env } from "@/env";
import {
  PricingConfigSchema,
  type PricingConfig,
  CreateAccessCodeSchema,
  type CreateAccessCodeInput,
  type AccessCodeDetail,
  UpsertMilestoneSchema,
  type UpsertMilestoneInput,
  CreateCuratedResourceSchema,
  type CreateCuratedResourceInput,
  LandingCopySchema,
  type LandingCopyInput,
  AiRouterConfigSchema,
  type AiRouterConfig,
  ToggleGodModeSchema,
  type ToggleGodModeInput,
  GrantBonusDrillsSchema,
  type GrantBonusDrillsInput,
  UpdateUserRoleSchema,
  type UpdateUserRoleInput,
  UpdateUserStatusSchema,
  type UpdateUserStatusInput,
  type PlatformOverviewMetrics,
  type ApologyAppealDetail,
  type CadetDetail,
} from "./command-types";

/**
 * Security Invariant: Verifies that the active session caller has the 'SUPER_ADMIN' role.
 * If caller is the Founder (4sulymanumar@gmail.com), auto-heals profile and grants access immediately.
 * Throws an error immediately if unauthenticated or not a super admin.
 */
export async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("UNAUTHORIZED_SUPER_ADMIN: No active authenticated session");
  }

  const founderEmail =
    (typeof process !== "undefined" && process.env?.FOUNDER_ADMIN_EMAIL) ||
    "4sulymanumar@gmail.com";
  const isFounder =
    user.email?.toLowerCase() === "4sulymanumar@gmail.com" ||
    user.email?.toLowerCase() === founderEmail.toLowerCase();

  const admin = createAdminClient();

  if (isFounder) {
    // Auto-heal Founder profile row in public.profiles
    await admin.from("profiles").upsert(
      {
        id: user.id,
        email: user.email!,
        display_name: user.user_metadata?.full_name || user.email!.split("@")[0],
        role: "SUPER_ADMIN",
        god_mode_enabled: true,
        onboarding_completed: true,
        status: "ACTIVE",
      },
      { onConflict: "id" }
    );

    return user;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "SUPER_ADMIN") {
    throw new Error("UNAUTHORIZED_SUPER_ADMIN: Caller lacks SUPER_ADMIN privileges");
  }

  return user;
}

// ==============================================================================
// 1. Overview & Apology Unban Actions
// ==============================================================================

export async function getPlatformOverviewMetricsAction(): Promise<PlatformOverviewMetrics> {
  await requireSuperAdmin();
  const admin = createAdminClient();

  // 1. Total users count
  const { count: totalUsers } = await admin
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // 2. Suspended accounts count
  const { count: suspendedAccounts } = await admin
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("status", "SUSPENDED_CHEATING");

  // 3. Active drill sessions count
  const { count: activeDrills } = await admin
    .from("drill_sessions")
    .select("*", { count: "exact", head: true })
    .in("status", ["GATE_1_PRECHECK", "GATE_2_SANDBOX", "GATE_3_DEFENSE"]);

  // 4. Pass rate calculation
  const { count: totalDrills } = await admin
    .from("drill_sessions")
    .select("*", { count: "exact", head: true });

  const { count: passedDrills } = await admin
    .from("drill_sessions")
    .select("*", { count: "exact", head: true })
    .eq("status", "PASSED");

  const total = totalDrills ?? 0;
  const passed = passedDrills ?? 0;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return {
    totalUsers: totalUsers ?? 0,
    activeDrills: activeDrills ?? 0,
    passRate,
    suspendedAccounts: suspendedAccounts ?? 0,
  };
}

export async function getApologyAppealsAction(): Promise<ApologyAppealDetail[]> {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("apology_appeals")
    .select(`
      id,
      user_id,
      letter_body,
      ai_screening_notes,
      status,
      submitted_at,
      profiles:user_id (
        display_name,
        email
      )
    `)
    .order("submitted_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    userName: item.profiles?.display_name ?? "Unknown Cadet",
    userEmail: item.profiles?.email ?? "unknown@cadet.com",
    letterBody: item.letter_body,
    aiScreeningNotes: item.ai_screening_notes,
    status: item.status,
    submittedAt: item.submitted_at,
  }));
}

export async function approveApologyAppealAction(appealId: string) {
  const adminUser = await requireSuperAdmin();
  const admin = createAdminClient();

  // 1. Fetch appeal to get target cadet user_id
  const { data: appeal, error: fetchErr } = await admin
    .from("apology_appeals")
    .select("user_id")
    .eq("id", appealId)
    .single();

  if (fetchErr || !appeal) {
    throw new Error("Appeal not found");
  }

  // 2. Mark appeal approved
  const { error: appealErr } = await admin
    .from("apology_appeals")
    .update({
      status: "APPROVED_BY_ADMIN",
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", appealId);

  if (appealErr) {
    throw new Error(appealErr.message);
  }

  // 3. Reset student profile
  const { error: profileErr } = await admin
    .from("profiles")
    .update({
      status: "ACTIVE",
      cheat_strikes_total: 0,
      cooldown_until: null,
    })
    .eq("id", appeal.user_id);

  if (profileErr) {
    throw new Error(profileErr.message);
  }

  revalidatePath("/command");
  return { success: true };
}

export async function rejectApologyAppealAction(appealId: string) {
  const adminUser = await requireSuperAdmin();
  const admin = createAdminClient();

  const { data: appeal, error: fetchErr } = await admin
    .from("apology_appeals")
    .select("user_id")
    .eq("id", appealId)
    .single();

  if (fetchErr || !appeal) {
    throw new Error("Appeal not found");
  }

  // Mark appeal rejected
  const { error: appealErr } = await admin
    .from("apology_appeals")
    .update({
      status: "REJECTED_BY_ADMIN",
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", appealId);

  if (appealErr) {
    throw new Error(appealErr.message);
  }

  // 48 hours lockout
  const cooldownDate = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
  await admin
    .from("profiles")
    .update({
      cooldown_until: cooldownDate,
    })
    .eq("id", appeal.user_id);

  revalidatePath("/command");
  return { success: true };
}

// ==============================================================================
// 2. User & God-Mode Actions
// ==============================================================================

export async function searchCadetsAction(query: string = ""): Promise<CadetDetail[]> {
  await requireSuperAdmin();
  const admin = createAdminClient();

  let req = admin
    .from("profiles")
    .select(`
      id,
      email,
      display_name,
      role,
      status,
      grit_xp,
      drills_remaining_this_month,
      cheat_strikes_total,
      god_mode_enabled,
      last_active_at,
      cooldown_until
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (query.trim()) {
    req = req.or(`email.ilike.%${query.trim()}%,display_name.ilike.%${query.trim()}%`);
  }

  const { data, error } = await req;
  if (error || !data) {
    return [];
  }

  return data.map((u: any) => ({
    id: u.id,
    email: u.email,
    displayName: u.display_name,
    role: u.role,
    status: u.status,
    gritXp: u.grit_xp,
    drillsRemaining: u.drills_remaining_this_month,
    cheatStrikes: u.cheat_strikes_total,
    godModeEnabled: u.god_mode_enabled,
    lastActiveAt: u.last_active_at,
    cooldownUntil: u.cooldown_until,
  }));
}

export async function toggleGodModeAction(input: ToggleGodModeInput) {
  await requireSuperAdmin();
  const parsed = ToggleGodModeSchema.parse(input);
  const admin = createAdminClient();

  const { error } = await admin
    .from("profiles")
    .update({ god_mode_enabled: parsed.enabled })
    .eq("id", parsed.userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}

export async function grantBonusDrillsAction(input: GrantBonusDrillsInput) {
  await requireSuperAdmin();
  const parsed = GrantBonusDrillsSchema.parse(input);
  const admin = createAdminClient();

  const { data: userProfile, error: fetchErr } = await admin
    .from("profiles")
    .select("drills_remaining_this_month")
    .eq("id", parsed.userId)
    .single();

  if (fetchErr || !userProfile) {
    throw new Error("Cadet not found");
  }

  const newTotal = (userProfile.drills_remaining_this_month ?? 0) + parsed.amount;

  const { error: updateErr } = await admin
    .from("profiles")
    .update({ drills_remaining_this_month: newTotal })
    .eq("id", parsed.userId);

  if (updateErr) {
    throw new Error(updateErr.message);
  }

  revalidatePath("/command");
  return { success: true, newTotal };
}

export async function updateUserRoleAction(input: UpdateUserRoleInput) {
  await requireSuperAdmin();
  const parsed = UpdateUserRoleSchema.parse(input);
  const admin = createAdminClient();

  const { error } = await admin
    .from("profiles")
    .update({ role: parsed.role as UserRole })
    .eq("id", parsed.userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}

export async function updateUserStatusAction(input: UpdateUserStatusInput) {
  await requireSuperAdmin();
  const parsed = UpdateUserStatusSchema.parse(input);
  const admin = createAdminClient();

  const { error } = await admin
    .from("profiles")
    .update({ status: parsed.status as AccountStatus })
    .eq("id", parsed.userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}

// ==============================================================================
// 3. Pricing & Access Codes Actions
// ==============================================================================

export async function getPricingConfigAction(): Promise<PricingConfig> {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { data } = await admin
    .from("platform_settings")
    .select("value")
    .eq("key", "pricing_config")
    .single();

  if (!data?.value) {
    return {
      monthly_anchor_ngn: 10000,
      certificate_base_ngn: 10000,
      retake_pack_ngn: 1000,
      free_trial_days: 3,
    };
  }

  return data.value as unknown as PricingConfig;
}

export async function updatePricingConfigAction(pricing: PricingConfig) {
  const adminUser = await requireSuperAdmin();
  const parsed = PricingConfigSchema.parse(pricing);
  const admin = createAdminClient();

  const { error } = await admin.from("platform_settings").upsert(
    {
      key: "pricing_config",
      value: parsed,
      updated_by: adminUser.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}

export async function getAccessCodesAction(): Promise<AccessCodeDetail[]> {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("access_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((item: any) => ({
    code: item.code,
    codeType: item.code_type,
    discountPercent: item.discount_percent ?? 0,
    drillsGranted: item.drills_granted ?? 0,
    maxRedemptions: item.max_redemptions ?? 1,
    currentRedemptions: item.current_redemptions ?? 0,
    expiresAt: item.expires_at,
    createdAt: item.created_at,
  }));
}

export async function createAccessCodeAction(input: CreateAccessCodeInput) {
  await requireSuperAdmin();
  const parsed = CreateAccessCodeSchema.parse(input);
  const admin = createAdminClient();

  const { error } = await admin.from("access_codes").insert({
    code: parsed.code.toUpperCase().trim(),
    code_type: parsed.code_type as AccessCodeType,
    discount_percent: parsed.discount_percent,
    drills_granted: parsed.drills_granted,
    max_redemptions: parsed.max_redemptions,
    expires_at: parsed.expires_at ? new Date(parsed.expires_at).toISOString() : null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}

export async function deleteAccessCodeAction(code: string) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("access_codes").delete().eq("code", code);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}

// ==============================================================================
// 4. Curriculum & CMS Actions
// ==============================================================================

export async function getCurriculumMilestonesAction() {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("curriculum_public")
    .select("*")
    .order("phase", { ascending: true })
    .order("sequence_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function upsertCurriculumMilestoneAction(input: UpsertMilestoneInput) {
  await requireSuperAdmin();
  const parsed = UpsertMilestoneSchema.parse(input);
  const admin = createAdminClient();

  const { error } = await admin.from("curriculum_public").upsert(
    {
      milestone_id: parsed.milestone_id,
      phase: parsed.phase,
      sequence_order: parsed.sequence_order,
      title: parsed.title,
      is_live_in_v1: parsed.is_live_in_v1,
      time_limit_minutes: parsed.time_limit_minutes,
      mental_model: parsed.mental_model,
      disaster_story: parsed.disaster_story,
      project_brief: parsed.project_brief,
      primary_resources: parsed.primary_resources,
    },
    { onConflict: "milestone_id" }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}

export async function getCuratedResourcesAction(milestoneId?: string) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  let req = admin.from("curated_resources").select("*").order("created_at", { ascending: false });
  if (milestoneId) {
    req = req.eq("milestone_id", milestoneId);
  }

  const { data, error } = await req;
  if (error || !data) {
    return [];
  }
  return data;
}

export async function createCuratedResourceAction(input: CreateCuratedResourceInput) {
  await requireSuperAdmin();
  const parsed = CreateCuratedResourceSchema.parse(input);
  const admin = createAdminClient();

  const { error } = await admin.from("curated_resources").insert({
    milestone_id: parsed.milestone_id,
    title: parsed.title,
    url: parsed.url,
    format_type: parsed.format_type as any,
    learning_style_tags: parsed.learning_style_tags,
    uncle_commentary: parsed.uncle_commentary,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}

export async function deleteCuratedResourceAction(resourceId: string) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("curated_resources").delete().eq("id", resourceId);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}

export async function getLandingCopyAction(): Promise<LandingCopyInput> {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { data } = await admin
    .from("platform_settings")
    .select("value")
    .eq("key", "landing_copy")
    .single();

  if (!data?.value) {
    return {};
  }
  return data.value as unknown as LandingCopyInput;
}

export async function updateLandingCopyAction(copy: LandingCopyInput) {
  const adminUser = await requireSuperAdmin();
  const parsed = LandingCopySchema.parse(copy);
  const admin = createAdminClient();

  const { error } = await admin.from("platform_settings").upsert(
    {
      key: "landing_copy",
      value: parsed,
      updated_by: adminUser.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}

// ==============================================================================
// 5. AI Router Switchboard Actions
// ==============================================================================

export async function getAiRouterConfigAction(): Promise<AiRouterConfig> {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { data } = await admin
    .from("platform_settings")
    .select("value")
    .eq("key", "ai_router_config")
    .single();

  if (!data?.value) {
    return {
      study_room_provider: "groq:llama-3.3-70b-versatile",
      drill_room_provider: "google:gemini-2.5-flash",
      stt_provider: "groq:whisper-large-v3-turbo",
      daily_study_turns: 20,
      max_drill_turns: 15,
      daily_token_limit: 50000,
    };
  }

  return data.value as unknown as AiRouterConfig;
}

export async function updateAiRouterConfigAction(config: AiRouterConfig) {
  const adminUser = await requireSuperAdmin();
  const parsed = AiRouterConfigSchema.parse(config);
  const admin = createAdminClient();

  const { error } = await admin.from("platform_settings").upsert(
    {
      key: "ai_router_config",
      value: parsed,
      updated_by: adminUser.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/command");
  return { success: true };
}
