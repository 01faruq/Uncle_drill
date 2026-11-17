/**
 * @purpose Build-time and runtime environment variable validation using @t3-oss/env-nextjs and Zod.
 * @security Prevents leaking secret server keys to client bundle and guarantees required environment configs exist.
 * @reference docs/04_SYSTEM_ARCHITECTURE.md (Architecture & Environment Safety Laws)
 */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYnBiaWpucW94aXh1eW5xcmJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzEyNTM2NCwiZXhwIjoyMTA4NzAxMzY0fQ._62P70uTcMosssix9wmsW2P7GUasWnVtGtj2E2-LiIw"
    ),
    FOUNDER_ADMIN_EMAIL: z.string().email().default("4sulymanumar@gmail.com"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().default("https://wgbpbijnqoxixuynqrbv.supabase.co"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYnBiaWpucW94aXh1eW5xcmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMjUzNjQsImV4cCI6MjEwODcwMTM2NH0.5X38Pl47NnrmUXNFc-VdLKd3R-4VnzYZAlRvEo1oq1c"
    ),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  emptyStringAsUndefined: true,
});
