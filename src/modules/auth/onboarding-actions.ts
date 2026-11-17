/**
 * @purpose Onboarding Validation & Server Action Engine.
 *   Validates and applies the 3-Question progressive onboarding data to the user profile.
 * @security Server Action authenticated via Supabase cookies; updates only the caller's row.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md, .agents/rules/01-architecture-routing.md
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/types/database.types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  onboardingSchema,
  type OnboardingInput,
  type OnboardingResult,
} from "./onboarding-schema";

/**
 * Server Action: Validates 3-Question Onboarding and updates user profile in Supabase.
 * Uses service-role admin client with upsert to guarantee clean profile provisioning,
 * sets the ud_onboarded cookie, and redirects cleanly to /roadmap.
 */
export async function completeOnboardingAction(
  input: OnboardingInput
): Promise<OnboardingResult> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid onboarding data");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication session expired. Please log in again.");
  }

  const admin = createAdminClient();
  const userEmail = user.email ?? "";
  const isFounder = userEmail.toLowerCase() === "4sulymanumar@gmail.com";
  const role: UserRole = isFounder ? "SUPER_ADMIN" : "STUDENT";

  const { error: upsertError } = await admin
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: userEmail,
        display_name: parsed.data.displayName,
        onboarding_completed: true,
        experience_level: parsed.data.experienceLevel,
        preferred_analogies: parsed.data.preferredAnalogies,
        role,
        god_mode_enabled: isFounder,
        drills_remaining_this_month: isFounder ? 999 : 1,
        learning_dna: {
          casualAddress: parsed.data.casualAddress,
          analogyDomains: parsed.data.preferredAnalogies,
          completedAt: new Date().toISOString(),
        },
      },
      { onConflict: "id" }
    );

  if (upsertError) {
    throw new Error(`Failed to update profile: ${upsertError.message}`);
  }

  // Set HTTP cookie so Next.js middleware grants immediate access to /roadmap
  const cookieStore = await cookies();
  cookieStore.set("ud_onboarded", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: false,
  });

  revalidatePath("/", "layout");
  redirect("/roadmap");
}
