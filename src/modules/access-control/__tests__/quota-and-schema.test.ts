/**
 * @purpose TDD Test Suite for Database Schema Invariants, RLS Policies, and Atomic Quota Engine.
 * @security Tests TOCTOU race prevention, sensitive column privilege guards, and rubric vault isolation.
 * @reference docs/04_SYSTEM_ARCHITECTURE.md, docs/02_PRD_AND_ROADMAP.md, .agents/rules/02-security-supabase.md
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { deductDrillQuotaAtomic, QuotaError } from "../quota";

describe("Sub-Task 1.1: Database Schema & RLS Invariants", () => {
  const rootDir = process.cwd();
  const mig0001Path = path.join(rootDir, "supabase/migrations/0001_initial_schema.sql");
  const mig0002Path = path.join(rootDir, "supabase/migrations/0002_dual_brain_and_command_room.sql");

  it("ensures migration 0001 exists and defines all required enums and tables", () => {
    expect(fs.existsSync(mig0001Path)).toBe(true);
    const sql = fs.readFileSync(mig0001Path, "utf-8");

    // Extensions
    expect(sql).toContain('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    expect(sql).toContain('CREATE EXTENSION IF NOT EXISTS "vector"');

    // Strict Enums
    expect(sql).toContain("CREATE TYPE user_role AS ENUM");
    expect(sql).toContain("CREATE TYPE account_status AS ENUM");
    expect(sql).toContain("CREATE TYPE roast_level AS ENUM");
    expect(sql).toContain("CREATE TYPE access_code_type AS ENUM");
    expect(sql).toContain("CREATE TYPE session_status AS ENUM");
    expect(sql).toContain("CREATE TYPE appeal_status AS ENUM");

    // Core Tables
    expect(sql).toContain("CREATE TABLE organizations");
    expect(sql).toContain("CREATE TABLE profiles");
    expect(sql).toContain("CREATE TABLE curriculum_public");
    expect(sql).toContain("CREATE TABLE audit_rubrics_private");
    expect(sql).toContain("CREATE TABLE drill_sessions");
    expect(sql).toContain("CREATE TABLE learner_memories");
    expect(sql).toContain("CREATE TABLE access_codes");
    expect(sql).toContain("CREATE TABLE apology_appeals");
    expect(sql).toContain("CREATE TABLE webhook_events");

    // Column protection trigger
    expect(sql).toContain("protect_profile_sensitive_columns()");
    expect(sql).toContain("trg_protect_profile_columns");

    // Founder auto-admin trigger on auth.users
    expect(sql).toContain("handle_new_user()");
    expect(sql).toContain("4sulymanumar@gmail.com");
    expect(sql).toContain("SUPER_ADMIN");
    expect(sql).toContain("on_auth_user_created");

    // Atomic RPC with row locking
    expect(sql).toContain("CREATE OR REPLACE FUNCTION start_drill_session_atomic");
    expect(sql).toContain("FOR UPDATE");
  });

  it("verifies RLS is enabled on all tables and audit_rubrics_private has zero client policies", () => {
    const sql1 = fs.readFileSync(mig0001Path, "utf-8");
    const sql2 = fs.readFileSync(mig0002Path, "utf-8");
    const fullSql = sql1 + "\n" + sql2;

    const tables = [
      "organizations",
      "profiles",
      "curriculum_public",
      "audit_rubrics_private",
      "drill_sessions",
      "learner_memories",
      "access_codes",
      "apology_appeals",
      "webhook_events",
      "study_room_messages",
      "curated_resources",
      "platform_settings",
    ];

    tables.forEach((table) => {
      expect(fullSql).toContain(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
    });

    // audit_rubrics_private must NEVER have any client CREATE POLICY statement
    expect(fullSql).not.toMatch(/CREATE\s+POLICY.*ON\s+audit_rubrics_private/i);

    // Security rule: auth.uid() must always be wrapped in scalar subquery ((SELECT auth.uid()))
    const rawAuthUidMatches = fullSql.match(/[^(\s]auth\.uid\(\)/g);
    expect(rawAuthUidMatches).toBeNull();
  });

  it("verifies migration 0002 schema additions for Dual-Brain & Founder Command Room", () => {
    expect(fs.existsSync(mig0002Path)).toBe(true);
    const sql = fs.readFileSync(mig0002Path, "utf-8");

    // AUTO roast level
    expect(sql).toContain("ALTER TYPE roast_level ADD VALUE IF NOT EXISTS 'AUTO'");

    // Profiles additions
    expect(sql).toContain("ui_theme");
    expect(sql).toContain("unverified_claims");
    expect(sql).toContain("verified_competence");
    expect(sql).toContain("learning_dna");
    expect(sql).toContain("extension_tokens_remaining");
    expect(sql).toContain("onboarding_completed");
    expect(sql).toContain("experience_level");
    expect(sql).toContain("preferred_analogies");

    // Drill sessions 4-pillar scoring & generated column
    expect(sql).toContain("score_explain");
    expect(sql).toContain("score_produce");
    expect(sql).toContain("score_debug");
    expect(sql).toContain("score_stress_test");
    expect(sql).toContain("final_weighted_score NUMERIC(5,2) GENERATED ALWAYS AS");
    expect(sql).toContain("non_negotiables_passed");

    // Tables
    expect(sql).toMatch(/CREATE TABLE (IF NOT EXISTS )?study_room_messages/);
    expect(sql).toMatch(/CREATE TABLE (IF NOT EXISTS )?curated_resources/);
    expect(sql).toMatch(/CREATE TABLE (IF NOT EXISTS )?platform_settings/);

    // Super Admin ALL permissions for Founder Command Room
    expect(sql).toContain("super_admin_manage_settings");
    expect(sql).toContain("super_admin_manage_curriculum");
    expect(sql).toContain("super_admin_manage_resources");
    expect(sql).toContain("super_admin_manage_access_codes");
    expect(sql).toContain("super_admin_manage_apology_appeals");
  });
});

describe("Sub-Task 1.1: Quota Module (deductDrillQuotaAtomic)", () => {
  it("successfully invokes start_drill_session_atomic RPC", async () => {
    const mockRpc = vi.fn().mockResolvedValue({
      data: "session-uuid-1234",
      error: null,
    });
    const mockSupabase = {
      rpc: mockRpc,
    } as any;

    const sessionId = await deductDrillQuotaAtomic({
      supabase: mockSupabase,
      userId: "user-uuid-abc",
      milestoneId: "1.1-ubuntu-survival",
      variantSeed: "seed-xyz",
      durationMins: 25,
    });

    expect(sessionId).toBe("session-uuid-1234");
    expect(mockRpc).toHaveBeenCalledWith("start_drill_session_atomic", {
      p_user_id: "user-uuid-abc",
      p_milestone_id: "1.1-ubuntu-survival",
      p_variant: "seed-xyz",
      p_duration_mins: 25,
    });
  });

  it("handles NO_DRILL_ATTEMPTS_REMAINING error with structured domain exception", async () => {
    const mockRpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "NO_DRILL_ATTEMPTS_REMAINING" },
    });
    const mockSupabase = { rpc: mockRpc } as any;

    await expect(
      deductDrillQuotaAtomic({
        supabase: mockSupabase,
        userId: "user-uuid-abc",
        milestoneId: "1.1-ubuntu-survival",
        variantSeed: "seed-xyz",
        durationMins: 25,
      })
    ).rejects.toThrow(QuotaError);
  });

  it("handles ACCOUNT_SUSPENDED_OR_BANNED error", async () => {
    const mockRpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "ACCOUNT_SUSPENDED_OR_BANNED" },
    });
    const mockSupabase = { rpc: mockRpc } as any;

    await expect(
      deductDrillQuotaAtomic({
        supabase: mockSupabase,
        userId: "user-uuid-abc",
        milestoneId: "1.1-ubuntu-survival",
        variantSeed: "seed-xyz",
        durationMins: 25,
      })
    ).rejects.toThrow(/suspended or banned/i);
  });
});
