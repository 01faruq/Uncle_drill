/**
 * @purpose Server-only Supabase Service-Role Admin Client.
 *   Bypasses RLS to query private grading rubrics (`audit_rubrics_private`)
 *   and perform atomic administrative mutations.
 * @security NEVER expose to client bundle. MUST only be imported inside server modules.
 * @reference docs/04_SYSTEM_ARCHITECTURE.md, .agents/rules/02-security-supabase.md
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/env";
import type { Database } from "@/types/database.types";

export function createAdminClient() {
  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
