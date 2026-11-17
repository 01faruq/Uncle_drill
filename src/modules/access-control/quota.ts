/**
 * @purpose Atomic Drill Quota Deduction Engine.
 *   Interacts with PostgreSQL RPC `start_drill_session_atomic` to guard against
 *   concurrent multi-tab race conditions, quota overdrafts, and suspended accounts.
 * @security Row-level lock (`SELECT ... FOR UPDATE`) inside database guarantees atomic decrement.
 * @reference docs/04_SYSTEM_ARCHITECTURE.md (Row-Level Security & Atomic Quota RPCs),
 *            .agents/rules/02-security-supabase.md
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type QuotaErrorCode =
  | "NO_DRILL_ATTEMPTS_REMAINING"
  | "ACCOUNT_SUSPENDED_OR_BANNED"
  | "COOLING_OFF_ACTIVE"
  | "RPC_EXECUTION_FAILED";

export class QuotaError extends Error {
  public readonly code: QuotaErrorCode;

  constructor(message: string, code: QuotaErrorCode) {
    super(message);
    this.name = "QuotaError";
    this.code = code;
    Object.setPrototypeOf(this, QuotaError.prototype);
  }
}

export interface DeductQuotaParams {
  supabase: SupabaseClient<Database>;
  userId: string;
  milestoneId: string;
  variantSeed: string;
  durationMins?: number;
}

/**
 * Executes atomic quota deduction and starts a drill session.
 *
 * @throws {QuotaError} When user has no attempts left, is suspended, or is cooling off.
 * @returns {Promise<string>} The created drill_sessions UUID.
 */
export async function deductDrillQuotaAtomic({
  supabase,
  userId,
  milestoneId,
  variantSeed,
  durationMins = 25,
}: DeductQuotaParams): Promise<string> {
  const { data, error } = await supabase.rpc("start_drill_session_atomic", {
    p_user_id: userId,
    p_milestone_id: milestoneId,
    p_variant: variantSeed,
    p_duration_mins: durationMins,
  });

  if (error) {
    const errorMsg = error.message || "";

    if (errorMsg.includes("ACCOUNT_SUSPENDED_OR_BANNED")) {
      throw new QuotaError(
        "Account is suspended or banned from taking drills.",
        "ACCOUNT_SUSPENDED_OR_BANNED"
      );
    }

    if (errorMsg.includes("COOLING_OFF_ACTIVE")) {
      throw new QuotaError(
        `Cooling-off period active: ${errorMsg}`,
        "COOLING_OFF_ACTIVE"
      );
    }

    if (errorMsg.includes("NO_DRILL_ATTEMPTS_REMAINING")) {
      throw new QuotaError(
        "No drill attempts remaining for this month.",
        "NO_DRILL_ATTEMPTS_REMAINING"
      );
    }

    throw new QuotaError(
      `Failed to start drill session: ${errorMsg}`,
      "RPC_EXECUTION_FAILED"
    );
  }

  if (!data) {
    throw new QuotaError(
      "RPC completed without returning a valid session ID.",
      "RPC_EXECUTION_FAILED"
    );
  }

  return data;
}
