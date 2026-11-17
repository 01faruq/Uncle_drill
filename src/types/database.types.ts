/**
 * @purpose Strict TypeScript definitions for Uncle Drill Supabase Database schema.
 *   Matches PostgreSQL migrations 0001 and 0002 and conforms to Supabase v2 GenericSchema.
 * @security Provides compile-time type safety across all queries, RPCs, and mutations.
 * @reference docs/04_SYSTEM_ARCHITECTURE.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "STUDENT" | "PEER_AUDITOR" | "B2B_ADMIN" | "SUPER_ADMIN";
export type AccountStatus = "ACTIVE" | "SUSPENDED_CHEATING" | "BANNED_PERMANENT";
export type RoastLevel =
  | "LEVEL_1_CONSTRUCTIVE"
  | "LEVEL_2_STRICT_UNCLE"
  | "LEVEL_3_NO_MERCY"
  | "AUTO";
export type AccessCodeType = "DISCOUNT_PERCENT" | "COHORT_SPONSOR" | "VIP_GOD_MODE";
export type SessionStatus =
  | "GATE_1_PRECHECK"
  | "GATE_2_SANDBOX"
  | "GATE_3_DEFENSE"
  | "PASSED"
  | "FAILED_RUBRIC"
  | "TERMINATED_CHEATING";
export type AppealStatus =
  | "PENDING_AI_SCREEN"
  | "REJECTED_BY_AI"
  | "AI_SCREENED_GENUINE"
  | "APPROVED_BY_ADMIN"
  | "REJECTED_BY_ADMIN";
export type UiTheme = "OBSIDIAN_DARK" | "BLUEPRINT_PAPER";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          seat_limit: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          seat_limit?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          seat_limit?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          github_username: string | null;
          roast_preference: RoastLevel;
          weekly_hours_committed: number;
          role: UserRole;
          status: AccountStatus;
          organization_id: string | null;
          current_phase: number;
          grit_xp: number;
          consistency_multiplier: number;
          drills_remaining_this_month: number;
          cheat_strikes_total: number;
          suspension_count: number;
          has_auditor_badge: boolean;
          god_mode_enabled: boolean;
          cooldown_until: string | null;
          last_active_at: string;
          created_at: string;
          ui_theme: UiTheme;
          unverified_claims: Json;
          verified_competence: Json;
          learning_dna: Json;
          extension_tokens_remaining: number;
          onboarding_completed: boolean;
          experience_level: string | null;
          preferred_analogies: string[];
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          github_username?: string | null;
          roast_preference?: RoastLevel;
          weekly_hours_committed?: number;
          role?: UserRole;
          status?: AccountStatus;
          organization_id?: string | null;
          current_phase?: number;
          grit_xp?: number;
          consistency_multiplier?: number;
          drills_remaining_this_month?: number;
          cheat_strikes_total?: number;
          suspension_count?: number;
          has_auditor_badge?: boolean;
          god_mode_enabled?: boolean;
          cooldown_until?: string | null;
          last_active_at?: string;
          created_at?: string;
          ui_theme?: UiTheme;
          unverified_claims?: Json;
          verified_competence?: Json;
          learning_dna?: Json;
          extension_tokens_remaining?: number;
          onboarding_completed?: boolean;
          experience_level?: string | null;
          preferred_analogies?: string[];
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          github_username?: string | null;
          roast_preference?: RoastLevel;
          weekly_hours_committed?: number;
          role?: UserRole;
          status?: AccountStatus;
          organization_id?: string | null;
          current_phase?: number;
          grit_xp?: number;
          consistency_multiplier?: number;
          drills_remaining_this_month?: number;
          cheat_strikes_total?: number;
          suspension_count?: number;
          has_auditor_badge?: boolean;
          god_mode_enabled?: boolean;
          cooldown_until?: string | null;
          last_active_at?: string;
          created_at?: string;
          ui_theme?: UiTheme;
          unverified_claims?: Json;
          verified_competence?: Json;
          learning_dna?: Json;
          extension_tokens_remaining?: number;
          onboarding_completed?: boolean;
          experience_level?: string | null;
          preferred_analogies?: string[];
        };
        Relationships: [];
      };
      curriculum_public: {
        Row: {
          milestone_id: string;
          phase: number;
          sequence_order: number;
          title: string;
          is_live_in_v1: boolean;
          mental_model: string;
          disaster_story: string;
          primary_resources: Json;
          project_brief: string;
          time_limit_minutes: number;
        };
        Insert: {
          milestone_id: string;
          phase: number;
          sequence_order: number;
          title: string;
          is_live_in_v1?: boolean;
          mental_model: string;
          disaster_story: string;
          primary_resources: Json;
          project_brief: string;
          time_limit_minutes?: number;
        };
        Update: {
          milestone_id?: string;
          phase?: number;
          sequence_order?: number;
          title?: string;
          is_live_in_v1?: boolean;
          mental_model?: string;
          disaster_story?: string;
          primary_resources?: Json;
          project_brief?: string;
          time_limit_minutes?: number;
        };
        Relationships: [];
      };
      audit_rubrics_private: {
        Row: {
          milestone_id: string;
          sandbox_type: string;
          gate_1_deterministic_checks: Json;
          gate_2_mutations: Json;
          gate_3_socratic_rubric: Json;
          updated_at: string;
        };
        Insert: {
          milestone_id: string;
          sandbox_type: string;
          gate_1_deterministic_checks: Json;
          gate_2_mutations: Json;
          gate_3_socratic_rubric: Json;
          updated_at?: string;
        };
        Update: {
          milestone_id?: string;
          sandbox_type?: string;
          gate_1_deterministic_checks?: Json;
          gate_2_mutations?: Json;
          gate_3_socratic_rubric?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      drill_sessions: {
        Row: {
          id: string;
          user_id: string;
          milestone_id: string;
          variant_seed: string;
          status: SessionStatus;
          session_strikes: number;
          ai_turns_used: number;
          max_ai_turns: number;
          telemetry_summary: Json;
          must_knows_passed: Json;
          may_knows_attempted: Json;
          xp_awarded: number;
          started_at: string;
          expires_at: string;
          network_paused_seconds: number;
          completed_at: string | null;
          stage_0_honesty_gate_passed: boolean;
          score_explain: number;
          score_produce: number;
          score_debug: number;
          score_stress_test: number;
          final_weighted_score: number | null;
          non_negotiables_passed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          milestone_id: string;
          variant_seed: string;
          status?: SessionStatus;
          session_strikes?: number;
          ai_turns_used?: number;
          max_ai_turns?: number;
          telemetry_summary?: Json;
          must_knows_passed?: Json;
          may_knows_attempted?: Json;
          xp_awarded?: number;
          started_at?: string;
          expires_at: string;
          network_paused_seconds?: number;
          completed_at?: string | null;
          stage_0_honesty_gate_passed?: boolean;
          score_explain?: number;
          score_produce?: number;
          score_debug?: number;
          score_stress_test?: number;
          non_negotiables_passed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          milestone_id?: string;
          variant_seed?: string;
          status?: SessionStatus;
          session_strikes?: number;
          ai_turns_used?: number;
          max_ai_turns?: number;
          telemetry_summary?: Json;
          must_knows_passed?: Json;
          may_knows_attempted?: Json;
          xp_awarded?: number;
          started_at?: string;
          expires_at?: string;
          network_paused_seconds?: number;
          completed_at?: string | null;
          stage_0_honesty_gate_passed?: boolean;
          score_explain?: number;
          score_produce?: number;
          score_debug?: number;
          score_stress_test?: number;
          non_negotiables_passed?: boolean;
        };
        Relationships: [];
      };
      learner_memories: {
        Row: {
          id: string;
          user_id: string;
          milestone_id: string;
          memory_summary: string;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          milestone_id: string;
          memory_summary: string;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          milestone_id?: string;
          memory_summary?: string;
          embedding?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      access_codes: {
        Row: {
          code: string;
          code_type: AccessCodeType;
          organization_id: string | null;
          discount_percent: number;
          drills_granted: number;
          max_redemptions: number;
          current_redemptions: number;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          code: string;
          code_type: AccessCodeType;
          organization_id?: string | null;
          discount_percent?: number;
          drills_granted?: number;
          max_redemptions?: number;
          current_redemptions?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          code?: string;
          code_type?: AccessCodeType;
          organization_id?: string | null;
          discount_percent?: number;
          drills_granted?: number;
          max_redemptions?: number;
          current_redemptions?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      apology_appeals: {
        Row: {
          id: string;
          user_id: string;
          letter_body: string;
          ai_screening_notes: string | null;
          status: AppealStatus;
          reviewed_by: string | null;
          submitted_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          letter_body: string;
          ai_screening_notes?: string | null;
          status?: AppealStatus;
          reviewed_by?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          letter_body?: string;
          ai_screening_notes?: string | null;
          status?: AppealStatus;
          reviewed_by?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Relationships: [];
      };
      webhook_events: {
        Row: {
          event_id: string;
          provider: string;
          payload: Json;
          processed_at: string;
        };
        Insert: {
          event_id: string;
          provider?: string;
          payload: Json;
          processed_at?: string;
        };
        Update: {
          event_id?: string;
          provider?: string;
          payload?: Json;
          processed_at?: string;
        };
        Relationships: [];
      };
      study_room_messages: {
        Row: {
          id: string;
          user_id: string;
          milestone_id: string;
          sender: "USER" | "UNCLE_DRILL";
          message_text: string;
          audio_url: string | null;
          checklist_items_verified: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          milestone_id: string;
          sender: "USER" | "UNCLE_DRILL";
          message_text: string;
          audio_url?: string | null;
          checklist_items_verified?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          milestone_id?: string;
          sender?: "USER" | "UNCLE_DRILL";
          message_text?: string;
          audio_url?: string | null;
          checklist_items_verified?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      curated_resources: {
        Row: {
          id: string;
          milestone_id: string;
          title: string;
          url: string;
          format_type:
            | "OFFICIAL_DOC"
            | "BOOK_CHAPTER"
            | "INTERACTIVE_SIM"
            | "VIDEO_LECTURE"
            | "ARTICLE";
          learning_style_tags: string[];
          uncle_commentary: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          milestone_id: string;
          title: string;
          url: string;
          format_type:
            | "OFFICIAL_DOC"
            | "BOOK_CHAPTER"
            | "INTERACTIVE_SIM"
            | "VIDEO_LECTURE"
            | "ARTICLE";
          learning_style_tags?: string[];
          uncle_commentary: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          milestone_id?: string;
          title?: string;
          url?: string;
          format_type?:
            | "OFFICIAL_DOC"
            | "BOOK_CHAPTER"
            | "INTERACTIVE_SIM"
            | "VIDEO_LECTURE"
            | "ARTICLE";
          learning_style_tags?: string[];
          uncle_commentary?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      platform_settings: {
        Row: {
          key: string;
          value: Json;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      start_drill_session_atomic: {
        Args: {
          p_user_id: string;
          p_milestone_id: string;
          p_variant: string;
          p_duration_mins: number;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      account_status: AccountStatus;
      roast_level: RoastLevel;
      access_code_type: AccessCodeType;
      session_status: SessionStatus;
      appeal_status: AppealStatus;
      ui_theme: UiTheme;
    };
    CompositeTypes: Record<string, never>;
  };
}
