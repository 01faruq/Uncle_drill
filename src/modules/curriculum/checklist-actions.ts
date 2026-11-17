"use server";

/**
 * @purpose Server Actions for Pre-Drill Milestone Checklist Persistence.
 *   Enforces authentication, updates profile learning_dna JSONB, and calculates gatekeeper status.
 * @security Only exports async functions (Next.js 15 rule). Validates inputs and binds to auth.uid().
 * @reference docs/02_PRD_AND_ROADMAP.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMilestoneById, calculateMilestoneProgress } from "@/lib/data/curriculum";
import { MilestoneProgress } from "./types";

interface LearningDnaWithChecklist {
  checklist_progress?: Record<string, string[]>;
  [key: string]: unknown;
}

/**
 * Retrieves the user's checklist progress for a given milestone.
 */
export async function getMilestoneProgressAction(
  milestoneId: string
): Promise<MilestoneProgress | null> {
  const milestone = getMilestoneById(milestoneId);
  if (!milestone) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return calculateMilestoneProgress(milestone, []);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("learning_dna")
      .eq("id", user.id)
      .maybeSingle();

    const learningDna = (profile?.learning_dna as LearningDnaWithChecklist) || {};
    const checked = learningDna.checklist_progress?.[milestone.milestoneId] || [];

    return calculateMilestoneProgress(milestone, checked);
  } catch (err) {
    console.error("[getMilestoneProgressAction] Error fetching progress:", err);
    return calculateMilestoneProgress(milestone, []);
  }
}

/**
 * Toggles a checklist item for a milestone and persists to profile learning_dna.
 */
export async function toggleChecklistItemAction(
  milestoneId: string,
  itemId: string,
  checked: boolean
): Promise<{ success: boolean; progress: MilestoneProgress | null; error?: string }> {
  const milestone = getMilestoneById(milestoneId);
  if (!milestone) {
    return { success: false, progress: null, error: "Milestone not found" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, progress: null, error: "Authentication required" };
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("learning_dna")
      .eq("id", user.id)
      .maybeSingle();

    const learningDna = (profile?.learning_dna as LearningDnaWithChecklist) || {};
    const progressMap = learningDna.checklist_progress || {};
    const currentChecked = progressMap[milestone.milestoneId] || [];

    let updatedChecked: string[];
    if (checked) {
      updatedChecked = Array.from(new Set([...currentChecked, itemId]));
    } else {
      updatedChecked = currentChecked.filter((id) => id !== itemId);
    }

    const updatedLearningDna = {
      ...learningDna,
      checklist_progress: {
        ...progressMap,
        [milestone.milestoneId]: updatedChecked,
      },
    };

    const { error: updateError } = await admin
      .from("profiles")
      .update({ learning_dna: updatedLearningDna })
      .eq("id", user.id);

    if (updateError) {
      console.error("[toggleChecklistItemAction] Database update error:", updateError);
      return { success: false, progress: null, error: updateError.message };
    }

    const progress = calculateMilestoneProgress(milestone, updatedChecked);

    revalidatePath(`/milestone/${milestone.milestoneId}`);
    revalidatePath(`/milestone/${milestone.slug}`);
    revalidatePath("/roadmap");

    return { success: true, progress };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to toggle checklist item";
    console.error("[toggleChecklistItemAction] Fatal error:", err);
    return { success: false, progress: null, error: message };
  }
}

/**
 * Retrieves checklist completion summaries for all milestones for the authenticated user.
 */
export async function getAllMilestonesProgressAction(): Promise<
  Record<string, { completedRequired: number; totalRequired: number; isUnlocked: boolean }>
> {
  const fallback: Record<string, { completedRequired: number; totalRequired: number; isUnlocked: boolean }> = {};

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return fallback;

    const { data: profile } = await supabase
      .from("profiles")
      .select("learning_dna")
      .eq("id", user.id)
      .maybeSingle();

    const learningDna = (profile?.learning_dna as LearningDnaWithChecklist) || {};
    const progressMap = learningDna.checklist_progress || {};

    const { CANONICAL_PHASE_1_MILESTONES } = await import("@/lib/data/curriculum");

    for (const m of CANONICAL_PHASE_1_MILESTONES) {
      const checked = progressMap[m.milestoneId] || [];
      const calc = calculateMilestoneProgress(m, checked);
      fallback[m.milestoneId] = {
        completedRequired: calc.completedRequired,
        totalRequired: calc.totalRequired,
        isUnlocked: calc.isGatekeeperUnlocked,
      };
    }

    return fallback;
  } catch (err) {
    console.error("[getAllMilestonesProgressAction] Error:", err);
    return fallback;
  }
}
