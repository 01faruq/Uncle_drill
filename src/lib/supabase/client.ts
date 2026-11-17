/**
 * @purpose Client-side Supabase Browser Client.
 *   Uses @supabase/ssr createBrowserClient with full type safety via Database types.
 * @security Only uses NEXT_PUBLIC_SUPABASE_ANON_KEY. RLS policies guard all access.
 * @reference docs/04_SYSTEM_ARCHITECTURE.md (Security, Database & AI Harness Laws)
 */
import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";
import type { Database } from "@/types/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
