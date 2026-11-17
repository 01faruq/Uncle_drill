-- ==============================================================================
-- UNCLE DRILL — MIGRATION 0002: DUAL-BRAIN ARCHITECTURE & FOUNDER COMMAND ROOM
-- @purpose Adds 'AUTO' roast level, 3-Question Onboarding profile fields, Dual-Ledger
--          proof memory, 4-Pillar weighted scoring, Study Room, Curated Resources,
--          and Live Platform Settings with Super Admin RLS for the /command Room.
-- @security Grants SUPER_ADMIN full ALL RLS permissions across system tables while
--          preserving student data isolation and (SELECT auth.uid()) scalar subqueries.
-- @reference docs/04_SYSTEM_ARCHITECTURE.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
-- ==============================================================================

-- 1. Add 'AUTO' to Roast Level Enum (Dynamic heat calculation)
ALTER TYPE roast_level ADD VALUE IF NOT EXISTS 'AUTO';

-- 2. Upgrade `profiles` with Dual-Ledger Proof Memory, Theme & 3-Question Onboarding
ALTER TABLE profiles
  ALTER COLUMN roast_preference SET DEFAULT 'AUTO',
  ADD COLUMN IF NOT EXISTS ui_theme TEXT NOT NULL DEFAULT 'OBSIDIAN_DARK' CHECK (ui_theme IN ('OBSIDIAN_DARK', 'BLUEPRINT_PAPER')),
  ADD COLUMN IF NOT EXISTS unverified_claims JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS verified_competence JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS learning_dna JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS extension_tokens_remaining INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS experience_level TEXT,
  ADD COLUMN IF NOT EXISTS preferred_analogies TEXT[] DEFAULT '{}';

-- 3. Upgrade `drill_sessions` with 5-Stage Flow & 4-Pillar Scoring (Threshold >= 75)
ALTER TABLE drill_sessions
  ADD COLUMN IF NOT EXISTS stage_0_honesty_gate_passed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS score_explain INTEGER DEFAULT 0 CHECK (score_explain BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS score_produce INTEGER DEFAULT 0 CHECK (score_produce BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS score_debug INTEGER DEFAULT 0 CHECK (score_debug BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS score_stress_test INTEGER DEFAULT 0 CHECK (score_stress_test BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS final_weighted_score NUMERIC(5,2) GENERATED ALWAYS AS (
      (score_explain * 0.25) + (score_produce * 0.30) + (score_debug * 0.25) + (score_stress_test * 0.20)
  ) STORED,
  ADD COLUMN IF NOT EXISTS non_negotiables_passed BOOLEAN NOT NULL DEFAULT false;

-- 4. Uncle's Study Room Messages (Accessible on Mobile & Desktop)
CREATE TABLE IF NOT EXISTS study_room_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    milestone_id TEXT NOT NULL REFERENCES curriculum_public(milestone_id),
    sender TEXT NOT NULL CHECK (sender IN ('USER', 'UNCLE_DRILL')),
    message_text TEXT NOT NULL,
    audio_url TEXT,
    checklist_items_verified JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE study_room_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "study_messages_read_own" ON study_room_messages
    FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "study_messages_insert_own" ON study_room_messages
    FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

-- 5. Curated Resource Vault (Powers Zero-Hallucination Study Recommendations)
CREATE TABLE IF NOT EXISTS curated_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id TEXT NOT NULL REFERENCES curriculum_public(milestone_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    format_type TEXT NOT NULL CHECK (format_type IN ('OFFICIAL_DOC', 'BOOK_CHAPTER', 'INTERACTIVE_SIM', 'VIDEO_LECTURE', 'ARTICLE')),
    learning_style_tags TEXT[] NOT NULL DEFAULT '{}',
    uncle_commentary TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE curated_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resources_read_all" ON curated_resources
    FOR SELECT TO authenticated USING (true);

-- 6. No-Code Founder Command Room Settings (`platform_settings`)
CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_read_all" ON platform_settings
    FOR SELECT TO authenticated USING (true);

-- Seed Default Live Settings Controlled via `/command` UI
INSERT INTO platform_settings (key, value) VALUES
  ('pricing_config', '{"monthly_anchor_ngn": 10000, "certificate_base_ngn": 10000, "retake_pack_ngn": 1000, "free_trial_days": 3}'::jsonb),
  ('ai_router_config', '{"study_room_provider": "groq:llama-3.3-70b-versatile", "drill_room_provider": "google:gemini-2.5-flash", "stt_provider": "groq:whisper-large-v3-turbo", "daily_study_turns": 20, "max_drill_turns": 15}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- SUPER_ADMIN RLS OVERRIDES & ANTI-RECURSION HELPER (FOR /command ROOM)
-- ==============================================================================

-- Security Definer helper to prevent RLS infinite recursion on profiles
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = (SELECT auth.uid()) AND role = 'SUPER_ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Upgrade profile protection trigger to allow SUPER_ADMIN or service_role
CREATE OR REPLACE FUNCTION protect_profile_sensitive_columns()
RETURNS TRIGGER AS $$
BEGIN
    IF current_setting('request.jwt.claims', true)::jsonb->>'role' != 'service_role' AND NOT public.is_super_admin() THEN
        NEW.role := OLD.role;
        NEW.status := OLD.status;
        NEW.grit_xp := OLD.grit_xp;
        NEW.consistency_multiplier := OLD.consistency_multiplier;
        NEW.drills_remaining_this_month := OLD.drills_remaining_this_month;
        NEW.cheat_strikes_total := OLD.cheat_strikes_total;
        NEW.suspension_count := OLD.suspension_count;
        NEW.has_auditor_badge := OLD.has_auditor_badge;
        NEW.god_mode_enabled := OLD.god_mode_enabled;
        NEW.cooldown_until := OLD.cooldown_until;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Full Settings Access
CREATE POLICY "super_admin_manage_settings" ON platform_settings
    FOR ALL USING (public.is_super_admin());

-- 2. Full Curriculum Management (Live CMS)
CREATE POLICY "super_admin_manage_curriculum" ON curriculum_public
    FOR ALL USING (public.is_super_admin());

-- 3. Full Curated Resources Management
CREATE POLICY "super_admin_manage_resources" ON curated_resources
    FOR ALL USING (public.is_super_admin());

-- 4. Full Access Codes / God-Mode Generator Management
CREATE POLICY "super_admin_manage_access_codes" ON access_codes
    FOR ALL USING (public.is_super_admin());

-- 5. Full Apology Letter Review & Approval Access
CREATE POLICY "super_admin_manage_apology_appeals" ON apology_appeals
    FOR ALL USING (public.is_super_admin());

-- 6. Full User Profile Administration (Drill Grants, Unbans, Role Toggles)
CREATE POLICY "super_admin_manage_profiles" ON profiles
    FOR ALL USING (public.is_super_admin());

-- 7. Full Drill Session Observation & Override
CREATE POLICY "super_admin_manage_drill_sessions" ON drill_sessions
    FOR ALL USING (public.is_super_admin());

