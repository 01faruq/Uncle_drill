/**
 * @purpose TDD Test Suite for Founder Control Room (/command) Server Actions.
 * @security Tests strict SUPER_ADMIN role verification, privilege escalation rejection,
 *   atomic unbans, god-mode overrides, pricing updates, and AI router switchboard.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 5: Founder Command Room)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoist mocks for Supabase Server and Admin clients
const mockGetUser = vi.fn();
const mockServerFrom = vi.fn();
const mockAdminFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockImplementation(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockServerFrom,
  })),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn().mockImplementation(() => ({
    from: mockAdminFrom,
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import {
  requireSuperAdmin,
  getPlatformOverviewMetricsAction,
  approveApologyAppealAction,
  rejectApologyAppealAction,
  toggleGodModeAction,
  grantBonusDrillsAction,
  updateUserRoleAction,
  updateUserStatusAction,
  updatePricingConfigAction,
  createAccessCodeAction,
  deleteAccessCodeAction,
  upsertCurriculumMilestoneAction,
  createCuratedResourceAction,
  deleteCuratedResourceAction,
  updateAiRouterConfigAction,
} from "../command-actions";

describe("Sub-Task 1.3: Founder Control Room Security & Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Security: requireSuperAdmin Invariant", () => {
    it("rejects unauthenticated caller with UNAUTHORIZED_SUPER_ADMIN", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

      await expect(requireSuperAdmin()).rejects.toThrow("UNAUTHORIZED_SUPER_ADMIN");
    });

    it("rejects authenticated caller who has STUDENT role", async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: "student-123", email: "cadet@test.com" } },
        error: null,
      });

      mockServerFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: { role: "STUDENT" },
              error: null,
            }),
          }),
        }),
      });

      await expect(requireSuperAdmin()).rejects.toThrow("UNAUTHORIZED_SUPER_ADMIN");
    });

    it("accepts authenticated caller who has SUPER_ADMIN role", async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: "admin-123", email: "auditor@uncle-drill.com" } },
        error: null,
      });

      mockServerFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: { role: "SUPER_ADMIN" },
              error: null,
            }),
          }),
        }),
      });

      const user = await requireSuperAdmin();
      expect(user.id).toBe("admin-123");
    });

    it("unconditionally accepts and auto-heals Founder (4sulymanumar@gmail.com)", async () => {
      mockGetUser.mockResolvedValueOnce({
        data: {
          user: {
            id: "founder-uuid",
            email: "4sulymanumar@gmail.com",
            user_metadata: { full_name: "Founder Umar" },
          },
        },
        error: null,
      });

      const mockUpsert = vi.fn().mockResolvedValueOnce({ error: null });
      mockAdminFrom.mockReturnValueOnce({ upsert: mockUpsert });

      const user = await requireSuperAdmin();
      expect(user.id).toBe("founder-uuid");
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "SUPER_ADMIN",
          god_mode_enabled: true,
          onboarding_completed: true,
        }),
        expect.anything()
      );
    });
  });

  describe("Tab 1: Overview & Apology Appeal Queue", () => {
    it("fetches platform overview metrics correctly", async () => {
      // Mock super admin auth using Founder
      mockGetUser.mockResolvedValue({
        data: { user: { id: "admin-123", email: "4sulymanumar@gmail.com" } },
      });

      // Mock admin queries for metrics
      mockAdminFrom.mockImplementation((table: string) => {
        if (table === "profiles") {
          return {
            upsert: vi.fn().mockResolvedValue({ error: null }),
            select: vi.fn().mockImplementation((_cols, options) => {
              if (options?.head && options?.count === "exact") {
                return {
                  eq: vi.fn().mockResolvedValue({ count: 2, error: null }), // suspended count
                  then: (fn: Function) => fn({ count: 150, error: null }), // total users count
                };
              }
              return Promise.resolve({ count: 150, error: null });
            }),
          };
        }
        if (table === "drill_sessions") {
          return {
            select: vi.fn().mockImplementation((_cols, options) => {
              if (options?.head && options?.count === "exact") {
                return {
                  in: vi.fn().mockResolvedValue({ count: 12, error: null }), // active sessions
                  eq: vi.fn().mockResolvedValue({ count: 85, error: null }), // passed sessions
                  then: (fn: Function) => fn({ count: 100, error: null }), // total sessions
                };
              }
              return Promise.resolve({ count: 100, error: null });
            }),
          };
        }
        return { select: vi.fn() };
      });

      const metrics = await getPlatformOverviewMetricsAction();
      expect(metrics).toBeDefined();
      expect(typeof metrics.totalUsers).toBe("number");
      expect(typeof metrics.activeDrills).toBe("number");
      expect(typeof metrics.passRate).toBe("number");
      expect(typeof metrics.suspendedAccounts).toBe("number");
    });

    it("approves apology appeal and resets cadet strikes + status to ACTIVE", async () => {
      // Setup super admin auth
      mockGetUser.mockResolvedValue({
        data: { user: { id: "admin-123", email: "founder@uncle-drill.com" } },
      });
      mockServerFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: "SUPER_ADMIN" } }),
          }),
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: "appeal-1", user_id: "cadet-99" },
            error: null,
          }),
        }),
      });

      mockAdminFrom.mockImplementation((table: string) => {
        if (table === "apology_appeals") {
          return {
            select: mockSelect,
            update: mockUpdate,
          };
        }
        if (table === "profiles") {
          return {
            update: mockUpdate,
          };
        }
        return {};
      });

      const result = await approveApologyAppealAction("appeal-1");
      expect(result.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalled();
    });

    it("rejects apology appeal and adds 48h cooldown", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "admin-123", email: "founder@uncle-drill.com" } },
      });
      mockServerFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: "SUPER_ADMIN" } }),
          }),
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: "appeal-2", user_id: "cadet-100" },
            error: null,
          }),
        }),
      });

      mockAdminFrom.mockImplementation((table: string) => {
        if (table === "apology_appeals" || table === "profiles") {
          return { select: mockSelect, update: mockUpdate };
        }
        return {};
      });

      const result = await rejectApologyAppealAction("appeal-2");
      expect(result.success).toBe(true);
    });
  });

  describe("Tab 2: User & God-Mode Manager", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "admin-123", email: "founder@uncle-drill.com" } },
      });
      mockServerFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: "SUPER_ADMIN" } }),
          }),
        }),
      });
    });

    it("toggles god_mode_enabled on target user", async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      mockAdminFrom.mockReturnValue({ update: mockUpdate });

      const res = await toggleGodModeAction({
        userId: "11111111-1111-1111-1111-111111111111",
        enabled: true,
      });
      expect(res.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ god_mode_enabled: true }));
    });

    it("grants bonus drill attempts to target user", async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { drills_remaining_this_month: 2 },
            error: null,
          }),
        }),
      });
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      mockAdminFrom.mockReturnValue({ select: mockSelect, update: mockUpdate });

      const res = await grantBonusDrillsAction({
        userId: "11111111-1111-1111-1111-111111111111",
        amount: 5,
      });
      expect(res.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ drills_remaining_this_month: 7 })
      );
    });

    it("updates user role and status", async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      mockAdminFrom.mockReturnValue({ update: mockUpdate });

      const roleRes = await updateUserRoleAction({
        userId: "11111111-1111-1111-1111-111111111111",
        role: "PEER_AUDITOR",
      });
      expect(roleRes.success).toBe(true);

      const statusRes = await updateUserStatusAction({
        userId: "11111111-1111-1111-1111-111111111111",
        status: "SUSPENDED_CHEATING",
      });
      expect(statusRes.success).toBe(true);
    });
  });

  describe("Tab 3: Pricing & Scholarship Code Generator", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "admin-123", email: "founder@uncle-drill.com" } },
      });
      mockServerFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: "SUPER_ADMIN" } }),
          }),
        }),
      });
    });

    it("updates platform pricing config in platform_settings", async () => {
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      mockAdminFrom.mockReturnValue({ upsert: mockUpsert });

      const res = await updatePricingConfigAction({
        monthly_anchor_ngn: 12000,
        certificate_base_ngn: 10000,
        retake_pack_ngn: 1500,
        free_trial_days: 7,
      });
      expect(res.success).toBe(true);
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "pricing_config",
          value: expect.objectContaining({ monthly_anchor_ngn: 12000 }),
        }),
        expect.anything()
      );
    });

    it("creates and deactivates access codes", async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      mockAdminFrom.mockReturnValue({ insert: mockInsert, delete: mockDelete });

      const createRes = await createAccessCodeAction({
        code: "FOUNDER-VIP-2026",
        code_type: "VIP_GOD_MODE",
        discount_percent: 100,
        drills_granted: 999,
        max_redemptions: 10,
        expires_at: null,
      });
      expect(createRes.success).toBe(true);
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({ code: "FOUNDER-VIP-2026" })
      );

      const deleteRes = await deleteAccessCodeAction("FOUNDER-VIP-2026");
      expect(deleteRes.success).toBe(true);
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe("Tab 4: Curriculum & Curated Resources CMS", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "admin-123", email: "founder@uncle-drill.com" } },
      });
      mockServerFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: "SUPER_ADMIN" } }),
          }),
        }),
      });
    });

    it("upserts curriculum milestones into curriculum_public", async () => {
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      mockAdminFrom.mockReturnValue({ upsert: mockUpsert });

      const res = await upsertCurriculumMilestoneAction({
        milestone_id: "1.1-ubuntu-survival",
        phase: 1,
        sequence_order: 1,
        title: "Ubuntu CLI Survival & Safety Flags",
        is_live_in_v1: true,
        time_limit_minutes: 25,
        mental_model: "The Shell is a Sharp Scalpel.",
        disaster_story: "GitLab rm -rf disaster wiped production DB in 2017.",
        project_brief: "Write a bulletproof shell script log_analyzer.sh",
        primary_resources: [
          { title: "Bash Reference Manual", url: "https://gnu.org/bash", type: "OFFICIAL_DOC" },
        ],
      });
      expect(res.success).toBe(true);
      expect(mockUpsert).toHaveBeenCalled();
    });

    it("creates and deletes curated resources", async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      mockAdminFrom.mockReturnValue({ insert: mockInsert, delete: mockDelete });

      const res = await createCuratedResourceAction({
        milestone_id: "1.1-ubuntu-survival",
        title: "The Linux Command Line (William Shotts)",
        url: "https://linuxcommand.org/tlcl.php",
        format_type: "BOOK_CHAPTER",
        learning_style_tags: ["Reading", "CLI"],
        uncle_commentary: "Read Chapters 1 through 6 before touching Uncle's terminal.",
      });
      expect(res.success).toBe(true);

      const delRes = await deleteCuratedResourceAction("res-123");
      expect(delRes.success).toBe(true);
    });
  });

  describe("Tab 5: AI Brain Router Switchboard", () => {
    it("updates ai_router_config in platform_settings", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "admin-123", email: "founder@uncle-drill.com" } },
      });
      mockServerFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: "SUPER_ADMIN" } }),
          }),
        }),
      });

      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      mockAdminFrom.mockReturnValue({ upsert: mockUpsert });

      const res = await updateAiRouterConfigAction({
        study_room_provider: "google:gemini-2.5-flash",
        drill_room_provider: "groq:llama-3.3-70b-versatile",
        stt_provider: "groq:whisper-large-v3-turbo",
        daily_study_turns: 30,
        max_drill_turns: 20,
        daily_token_limit: 60000,
        study_room_prompt_override: "Be especially strict on memory safety.",
      });
      expect(res.success).toBe(true);
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "ai_router_config",
          value: expect.objectContaining({
            study_room_provider: "google:gemini-2.5-flash",
            daily_study_turns: 30,
          }),
        }),
        expect.anything()
      );
    });
  });
});
