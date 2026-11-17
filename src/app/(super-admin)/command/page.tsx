/**
 * @purpose No-Code Founder Command Room Shell (/command).
 *   Protected strictly for the SUPER_ADMIN role.
 *   Provides dynamic control over platform pricing, access overrides, God-mode toggles,
 *   curriculum CMS, apology unbans, and AI model router switchboards.
 * @security Edge Middleware and Server Component strictly enforce role === 'SUPER_ADMIN'.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 5: Founder Command Room)
 */
import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";
import { DrillButton } from "@/components/ui/industrial/DrillButton";
import { CommandRoomContainer } from "@/components/command/CommandRoomContainer";
import {
  getPlatformOverviewMetricsAction,
  getApologyAppealsAction,
  searchCadetsAction,
  getPricingConfigAction,
  getAccessCodesAction,
  getCurriculumMilestonesAction,
  getCuratedResourcesAction,
  getLandingCopyAction,
  getAiRouterConfigAction,
} from "@/modules/admin/command-actions";

import { createAdminClient } from "@/lib/supabase/admin";
import { env } from "@/env";

export const dynamic = "force-dynamic";

export default async function CommandRoomPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/command");
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
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("role, display_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!isFounder && profile?.role !== "SUPER_ADMIN") {
    redirect("/roadmap?error=FORBIDDEN_COMMAND_ROOM");
  }

  // Fetch initial data across all 5 tabs using validated Super Admin actions
  const [
    metrics,
    appeals,
    cadets,
    pricing,
    codes,
    milestones,
    resources,
    landingCopy,
    aiConfig,
  ] = await Promise.all([
    getPlatformOverviewMetricsAction().catch(() => ({
      totalUsers: 0,
      activeDrills: 0,
      passRate: 0,
      suspendedAccounts: 0,
    })),
    getApologyAppealsAction().catch(() => []),
    searchCadetsAction("").catch(() => []),
    getPricingConfigAction().catch(() => ({
      monthly_anchor_ngn: 10000,
      certificate_base_ngn: 10000,
      retake_pack_ngn: 1000,
      free_trial_days: 3,
    })),
    getAccessCodesAction().catch(() => []),
    getCurriculumMilestonesAction().catch(() => []),
    getCuratedResourcesAction().catch(() => []),
    getLandingCopyAction().catch(() => ({})),
    getAiRouterConfigAction().catch(() => ({
      study_room_provider: "groq:llama-3.3-70b-versatile",
      drill_room_provider: "google:gemini-2.5-flash",
      stt_provider: "groq:whisper-large-v3-turbo",
      daily_study_turns: 20,
      max_drill_turns: 15,
      daily_token_limit: 50000,
    })),
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="mb-2">
              <HudBracketHeader variant="warn">
                FOUNDER COMMAND ROOM // SUPER_ADMIN
              </HudBracketHeader>
            </div>
            <h1 className="font-display text-2xl uppercase tracking-wider">
              PLATFORM CONTROL SWITCHBOARD
            </h1>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              Logged in as:{" "}
              <span className="text-signal-cta font-bold">
                {profile?.email} ({profile?.display_name})
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/roadmap">
              <DrillButton variant="terminal" size="sm">
                [ VIEW ROADMAP ]
              </DrillButton>
            </Link>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="font-mono text-xs text-signal-fault border border-[var(--border-grid)] px-3 py-2 hover:border-signal-fault transition-colors rounded-none"
              >
                [ SIGN OUT ]
              </button>
            </form>
          </div>
        </div>

        {/* 5-Tab Interactive Container with nuqs URL-sync */}
        <CommandRoomContainer
          metrics={metrics}
          appeals={appeals}
          cadets={cadets}
          pricing={pricing}
          codes={codes}
          milestones={milestones}
          resources={resources}
          landingCopy={landingCopy}
          aiConfig={aiConfig}
        />

        {/* Footer Telemetry */}
        <div className="mt-8 border border-[var(--border-grid)] bg-[var(--bg-surface)] p-3 px-4 font-mono text-[11px] text-[var(--text-muted)] flex items-center justify-between">
          <span>FOUNDER ROOM STATUS: ARMED // FRANKFURT REGION</span>
          <span className="text-signal-pass">SUPER_ADMIN PRIVILEGES ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
