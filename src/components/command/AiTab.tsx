"use client";

/**
 * @purpose Tab 5: AI Brain & Cost Switchboard for Founder Command Room.
 *   Provides instant switching between Gemini and Groq providers for Study Room
 *   and Drill Auditor, token cap adjustments, and custom prompt overrides.
 * @security Verified server-side for SUPER_ADMIN role.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 5)
 */
import * as React from "react";
import { type AiRouterConfig } from "@/modules/admin/command-types";
import { updateAiRouterConfigAction } from "@/modules/admin/command-actions";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";

interface AiTabProps {
  initialConfig: AiRouterConfig;
}

const MODEL_OPTIONS = [
  { id: "google:gemini-2.5-flash", label: "Google Gemini 2.5 Flash (Ultra-fast, 1M Context)" },
  { id: "google:gemini-2.5-pro", label: "Google Gemini 2.5 Pro (Deep Reasoning & Complex Code)" },
  { id: "groq:llama-3.3-70b-versatile", label: "Groq Llama 3.3 70B (Sub-second Socratic Chat)" },
];

const STT_OPTIONS = [
  { id: "groq:whisper-large-v3-turbo", label: "Groq Whisper Large V3 Turbo (Voice Notes STT)" },
];

export function AiTab({ initialConfig }: AiTabProps) {
  const [config, setConfig] = React.useState<AiRouterConfig>(initialConfig);
  const [isSaving, setIsSaving] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setToast(null);
      await updateAiRouterConfigAction(config);
      setToast("[ SUCCESS: AI ROUTER CONFIG UPDATED ACROSS ALL ACTIVE SESSIONS ]");
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="border border-signal-cta bg-signal-cta/10 p-3 font-mono text-xs text-signal-cta">
          {toast}
        </div>
      )}

      <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 space-y-6">
        <div>
          <HudBracketHeader variant="warn">
            AI BRAIN &amp; COST SWITCHBOARD (`ai_router_config`)
          </HudBracketHeader>
          <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
            Dynamically switch model backends between Google Gemini and Groq without server restart.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Model Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                STUDY ROOM SOKRATIC MENTOR PROVIDER
              </label>
              <select
                value={config.study_room_provider}
                onChange={(e) =>
                  setConfig({ ...config, study_room_provider: e.target.value })
                }
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2.5 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              >
                {MODEL_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-1">
                Active in Uncle&apos;s Study Room mobile &amp; desktop chat.
              </span>
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                DRILL ROOM AUDITOR PROVIDER (5-STAGE EVALUATOR)
              </label>
              <select
                value={config.drill_room_provider}
                onChange={(e) =>
                  setConfig({ ...config, drill_room_provider: e.target.value })
                }
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2.5 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              >
                {MODEL_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-1">
                Runs Gate 3 defense &amp; 4-Pillar grading engine.
              </span>
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                VOICE NOTE SPEECH-TO-TEXT (STT) ENGINE
              </label>
              <select
                value={config.stt_provider}
                onChange={(e) => setConfig({ ...config, stt_provider: e.target.value })}
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2.5 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              >
                {STT_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-1">
                Fast Whisper transcription for voice defense submissions.
              </span>
            </div>

            {/* Quota Caps */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                  DAILY STUDY TURNS
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={config.daily_study_turns}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      daily_study_turns: parseInt(e.target.value) || 20,
                    })
                  }
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                  MAX DRILL TURNS
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={config.max_drill_turns}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      max_drill_turns: parseInt(e.target.value) || 15,
                    })
                  }
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                  DAILY TOKEN CAP
                </label>
                <input
                  type="number"
                  min={1000}
                  step={5000}
                  value={config.daily_token_limit}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      daily_token_limit: parseInt(e.target.value) || 50000,
                    })
                  }
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
                />
              </div>
            </div>
          </div>

          {/* System Prompt Overrides */}
          <div className="space-y-4 pt-4 border-t border-[var(--border-grid)]">
            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                CUSTOM STUDY ROOM SYSTEM PROMPT OVERRIDE (OPTIONAL)
              </label>
              <textarea
                rows={3}
                value={config.study_room_prompt_override ?? ""}
                onChange={(e) =>
                  setConfig({ ...config, study_room_prompt_override: e.target.value })
                }
                placeholder="Leave blank to use the canonical African Uncle persona prompt from docs/05_AGENT_PERSONA_SPEC.md..."
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2.5 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                CUSTOM DRILL AUDITOR SYSTEM PROMPT OVERRIDE (OPTIONAL)
              </label>
              <textarea
                rows={3}
                value={config.drill_room_prompt_override ?? ""}
                onChange={(e) =>
                  setConfig({ ...config, drill_room_prompt_override: e.target.value })
                }
                placeholder="Leave blank to use the canonical 4-Pillar strict evaluator prompt..."
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2.5 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="font-mono text-xs bg-signal-cta text-black font-bold px-6 py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity rounded-none"
          >
            {isSaving ? "[ SAVING SWITCHBOARD... ]" : "[ SAVE AI ROUTER CONFIG ]"}
          </button>
        </form>
      </div>
    </div>
  );
}
