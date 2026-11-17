-- ==============================================================================
-- UNCLE DRILL — MIGRATION 0001: INITIAL CORE SCHEMA & SECURITY HARNESS
-- @purpose Establishes core domain tables, strict enums, RLS policies, trigger-based
--          privilege escalation guards, new user provisioning, and atomic quota RPC.
-- @security Enforces Row Level Security across all tables, zero client access on
--          rubrics, scalar subquery (SELECT auth.uid()), and SELECT ... FOR UPDATE row locks.
-- @reference docs/04_SYSTEM_ARCHITECTURE.md, docs/02_PRD_AND_ROADMAP.md, .agents/rules/02-security-supabase.md
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Strict Enum Types
CREATE TYPE user_role AS ENUM ('STUDENT', 'PEER_AUDITOR', 'B2B_ADMIN', 'SUPER_ADMIN');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'SUSPENDED_CHEATING', 'BANNED_PERMANENT');
CREATE TYPE roast_level AS ENUM ('LEVEL_1_CONSTRUCTIVE', 'LEVEL_2_STRICT_UNCLE', 'LEVEL_3_NO_MERCY');
CREATE TYPE access_code_type AS ENUM ('DISCOUNT_PERCENT', 'COHORT_SPONSOR', 'VIP_GOD_MODE');
CREATE TYPE session_status AS ENUM ('GATE_1_PRECHECK', 'GATE_2_SANDBOX', 'GATE_3_DEFENSE', 'PASSED', 'FAILED_RUBRIC', 'TERMINATED_CHEATING');
CREATE TYPE appeal_status AS ENUM ('PENDING_AI_SCREEN', 'REJECTED_BY_AI', 'AI_SCREENED_GENUINE', 'APPROVED_BY_ADMIN', 'REJECTED_BY_ADMIN');

-- 3. Organizations (For B2B Cohorts: Learn2Earn, 3MTT, AltSchool, etc.)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    seat_limit INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. User Profiles & Security State
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    github_username TEXT,
    -- Mutable User Preferences
    roast_preference roast_level NOT NULL DEFAULT 'LEVEL_2_STRICT_UNCLE',
    weekly_hours_committed INTEGER NOT NULL DEFAULT 8,
    -- Protected Server-Managed Columns (Guarded by trg_protect_profile_columns)
    role user_role NOT NULL DEFAULT 'STUDENT',
    status account_status NOT NULL DEFAULT 'ACTIVE',
    organization_id UUID REFERENCES organizations(id),
    current_phase INTEGER NOT NULL DEFAULT 1,
    grit_xp INTEGER NOT NULL DEFAULT 0,
    consistency_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    drills_remaining_this_month INTEGER NOT NULL DEFAULT 1, -- 1 free starter drill on signup
    cheat_strikes_total INTEGER NOT NULL DEFAULT 0,
    suspension_count INTEGER NOT NULL DEFAULT 0,
    has_auditor_badge BOOLEAN NOT NULL DEFAULT false,
    god_mode_enabled BOOLEAN NOT NULL DEFAULT false,
    cooldown_until TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4b. Trigger to Prevent Client Column-Privilege Escalation on `profiles`
CREATE OR REPLACE FUNCTION protect_profile_sensitive_columns()
RETURNS TRIGGER AS $$
BEGIN
    IF current_setting('request.jwt.claims', true)::jsonb->>'role' != 'service_role' THEN
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

CREATE TRIGGER trg_protect_profile_columns
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION protect_profile_sensitive_columns();

-- 4c. Trigger to Provision New Profiles on Auth Signup (with Founder God-Mode Detection)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_display_name TEXT;
    v_github_user TEXT;
    v_role user_role;
    v_god_mode BOOLEAN;
BEGIN
    BEGIN
        v_display_name := COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        );
        v_github_user := COALESCE(
            NEW.raw_user_meta_data->>'user_name',
            NEW.raw_user_meta_data->>'preferred_username'
        );

        -- Founder Auto-Admin check: 4sulymanumar@gmail.com unlocks instant SUPER_ADMIN + God Mode
        IF LOWER(NEW.email) = '4sulymanumar@gmail.com' THEN
            v_role := 'SUPER_ADMIN';
            v_god_mode := true;
        ELSE
            v_role := 'STUDENT';
            v_god_mode := false;
        END IF;

        INSERT INTO public.profiles (
            id,
            email,
            display_name,
            github_username,
            role,
            god_mode_enabled,
            drills_remaining_this_month
        ) VALUES (
            NEW.id,
            NEW.email,
            v_display_name,
            v_github_user,
            v_role,
            v_god_mode,
            CASE WHEN v_god_mode THEN 999 ELSE 1 END
        )
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        -- Never abort auth.users insert; log warning and let client/admin upsert handle fallback
        RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
    END;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Public Curriculum Metadata (Readable by All Users)
CREATE TABLE curriculum_public (
    milestone_id TEXT PRIMARY KEY, -- e.g., '1.1-ubuntu-survival'
    phase INTEGER NOT NULL,
    sequence_order INTEGER NOT NULL,
    title TEXT NOT NULL,
    is_live_in_v1 BOOLEAN NOT NULL DEFAULT false,
    mental_model TEXT NOT NULL,
    disaster_story TEXT NOT NULL,
    primary_resources JSONB NOT NULL, -- Array of {title, url, type}
    project_brief TEXT NOT NULL,
    time_limit_minutes INTEGER NOT NULL DEFAULT 25
);

-- 6. Private Grading Rubrics (ZERO Client Access - Server Role ONLY)
CREATE TABLE audit_rubrics_private (
    milestone_id TEXT PRIMARY KEY REFERENCES curriculum_public(milestone_id) ON DELETE CASCADE,
    sandbox_type TEXT NOT NULL, -- 'WASM_V86_LINUX' | 'DOCKER_E2B'
    gate_1_deterministic_checks JSONB NOT NULL,
    gate_2_mutations JSONB NOT NULL,
    gate_3_socratic_rubric JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Active & Historical Drill Sessions (Server-Authoritative State Machine)
CREATE TABLE drill_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    milestone_id TEXT NOT NULL REFERENCES curriculum_public(milestone_id),
    variant_seed TEXT NOT NULL,
    status session_status NOT NULL DEFAULT 'GATE_1_PRECHECK',
    session_strikes INTEGER NOT NULL DEFAULT 0,
    ai_turns_used INTEGER NOT NULL DEFAULT 0,
    max_ai_turns INTEGER NOT NULL DEFAULT 15,
    telemetry_summary JSONB DEFAULT '{}'::jsonb, -- Compressed <5KB JSON
    must_knows_passed JSONB DEFAULT '[]'::jsonb,
    may_knows_attempted JSONB DEFAULT '[]'::jsonb,
    xp_awarded INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    network_paused_seconds INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_drill_sessions_user_status ON drill_sessions(user_id, status);

-- 8. Episodic Learner Memory (pgvector for Uncle Drill Recall)
CREATE TABLE learner_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    milestone_id TEXT NOT NULL,
    memory_summary TEXT NOT NULL, -- Compact 1-2 sentence behavioral/conceptual note
    embedding vector(768),        -- Gemini text-embedding dimension
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_learner_memories_hnsw ON learner_memories USING hnsw (embedding vector_cosine_ops);

-- 9. Access, Promo, Cohort Sponsor & VIP God-Mode Codes
CREATE TABLE access_codes (
    code TEXT PRIMARY KEY, -- e.g., 'IYIN-GODMODE-2026', 'L2E-COHORT-1'
    code_type access_code_type NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    discount_percent INTEGER DEFAULT 0,
    drills_granted INTEGER DEFAULT 8,
    max_redemptions INTEGER NOT NULL DEFAULT 1,
    current_redemptions INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Apology & Accountability Unban Letters
CREATE TABLE apology_appeals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    letter_body TEXT NOT NULL CHECK (char_length(letter_body) >= 150),
    ai_screening_notes TEXT,
    status appeal_status NOT NULL DEFAULT 'PENDING_AI_SCREEN',
    reviewed_by UUID REFERENCES profiles(id),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ
);

-- 11. Idempotent Payment Webhooks (Paystack)
CREATE TABLE webhook_events (
    event_id TEXT PRIMARY KEY,
    provider TEXT NOT NULL DEFAULT 'PAYSTACK',
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across ALL tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_public ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_rubrics_private ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE apology_appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users read/update own row
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = (SELECT auth.uid()));
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = (SELECT auth.uid()));

-- 2. B2B Admins can read profiles belonging to their Organization
CREATE POLICY "b2b_admin_read_cohort" ON profiles FOR SELECT USING (
    organization_id IS NOT NULL AND organization_id IN (
        SELECT organization_id FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'B2B_ADMIN'
    )
);

-- 3. Curriculum Public: Readable by all authenticated users
CREATE POLICY "curriculum_read_all" ON curriculum_public FOR SELECT TO authenticated USING (true);

-- 4. Audit Rubrics Private: ZERO client policies (Server service_role ONLY)

-- 5. Drill Sessions: Users can read their own sessions
CREATE POLICY "sessions_read_own" ON drill_sessions FOR SELECT USING (user_id = (SELECT auth.uid()));

-- 6. Learner Memories: Users can read their own episodic memories
CREATE POLICY "learner_memories_read_own" ON learner_memories FOR SELECT USING (user_id = (SELECT auth.uid()));

-- 7. Access Codes: Authenticated users can query access codes for validation
CREATE POLICY "access_codes_read" ON access_codes FOR SELECT TO authenticated USING (true);

-- 8. Apology Appeals: Users read and submit their own appeals
CREATE POLICY "apology_appeals_read_own" ON apology_appeals FOR SELECT USING (user_id = (SELECT auth.uid()));
CREATE POLICY "apology_appeals_insert_own" ON apology_appeals FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

-- ==============================================================================
-- ATOMIC DRILL QUOTA DEDUCTION RPC (PREVENTS MULTI-TAB RACE CONDITIONS)
-- ==============================================================================
CREATE OR REPLACE FUNCTION start_drill_session_atomic(
    p_user_id UUID,
    p_milestone_id TEXT,
    p_variant TEXT,
    p_duration_mins INTEGER
)
RETURNS UUID AS $$
DECLARE
    v_session_id UUID;
    v_god_mode BOOLEAN;
    v_status account_status;
    v_cooldown TIMESTAMPTZ;
BEGIN
    -- Atomic row lock on student profile prevents concurrent tab double-deductions
    SELECT god_mode_enabled, status, cooldown_until
    INTO v_god_mode, v_status, v_cooldown
    FROM profiles
    WHERE id = p_user_id
    FOR UPDATE;

    IF v_status != 'ACTIVE' THEN
        RAISE EXCEPTION 'ACCOUNT_SUSPENDED_OR_BANNED';
    END IF;

    IF NOT v_god_mode AND v_cooldown IS NOT NULL AND v_cooldown > now() THEN
        RAISE EXCEPTION 'COOLING_OFF_ACTIVE_UNTIL_%', v_cooldown;
    END IF;

    IF NOT v_god_mode THEN
        UPDATE profiles
        SET drills_remaining_this_month = drills_remaining_this_month - 1
        WHERE id = p_user_id AND drills_remaining_this_month > 0;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'NO_DRILL_ATTEMPTS_REMAINING';
        END IF;
    END IF;

    INSERT INTO drill_sessions (
        user_id,
        milestone_id,
        variant_seed,
        expires_at
    ) VALUES (
        p_user_id,
        p_milestone_id,
        p_variant,
        now() + (p_duration_mins || ' minutes')::interval
    ) RETURNING id INTO v_session_id;

    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
