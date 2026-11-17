"use client";

/**
 * @purpose Tab 4: Curriculum, Field Manual & Landing Copy CMS for Founder Command Room.
 *   Provides point-and-click control over milestones, disaster stories, mental models,
 *   curated learning resources, and marketing copy.
 * @security Verified server-side for SUPER_ADMIN role.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 5)
 */
import * as React from "react";
import {
  type UpsertMilestoneInput,
  type CreateCuratedResourceInput,
  type LandingCopyInput,
} from "@/modules/admin/command-types";
import {
  upsertCurriculumMilestoneAction,
  createCuratedResourceAction,
  deleteCuratedResourceAction,
  updateLandingCopyAction,
} from "@/modules/admin/command-actions";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";

interface CmsTabProps {
  initialMilestones: any[];
  initialResources: any[];
  initialLandingCopy: LandingCopyInput;
}

export function CmsTab({
  initialMilestones,
  initialResources,
  initialLandingCopy,
}: CmsTabProps) {
  const [milestones, setMilestones] = React.useState<any[]>(initialMilestones);
  const [resources, setResources] = React.useState<any[]>(initialResources);
  const [landingCopy, setLandingCopy] = React.useState<LandingCopyInput>(initialLandingCopy);

  const [activeSection, setActiveSection] = React.useState<"milestones" | "resources" | "copy">("milestones");
  const [toast, setToast] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // New Milestone Form
  const [editingMilestone, setEditingMilestone] = React.useState<UpsertMilestoneInput>({
    milestone_id: "1.1-ubuntu-survival",
    phase: 1,
    sequence_order: 1,
    title: "Ubuntu CLI Survival & Safety Flags",
    is_live_in_v1: true,
    time_limit_minutes: 25,
    mental_model: "The Shell is a Sharp Scalpel. Careless pipelines cut deep.",
    disaster_story: "In 2017, a GitLab engineer accidentally ran rm -rf on production, deleting 300GB of database records.",
    project_brief: "Build a defensive log analysis pipeline using set -euo pipefail, awk, and grep.",
    primary_resources: [
      { title: "Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/", type: "OFFICIAL_DOC" },
    ],
  });

  // New Resource Form
  const [newResource, setNewResource] = React.useState<CreateCuratedResourceInput>({
    milestone_id: "1.1-ubuntu-survival",
    title: "",
    url: "",
    format_type: "BOOK_CHAPTER",
    learning_style_tags: ["Reading", "CLI"],
    uncle_commentary: "",
  });

  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setToast(null);
      await upsertCurriculumMilestoneAction(editingMilestone);
      setMilestones((prev) => {
        const idx = prev.findIndex((m) => m.milestone_id === editingMilestone.milestone_id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...editingMilestone };
          return updated;
        }
        return [...prev, editingMilestone];
      });
      setToast(`[ MILESTONE ${editingMilestone.milestone_id} UPSERTED SUCCESSFULLY ]`);
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.url) return;

    try {
      setIsSaving(true);
      setToast(null);
      await createCuratedResourceAction(newResource);
      setResources((prev) => [
        {
          id: `res-${Date.now()}`,
          ...newResource,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setToast(`[ RESOURCE ADDED TO UNCLE'S VAULT ]`);
      setNewResource({
        milestone_id: "1.1-ubuntu-survival",
        title: "",
        url: "",
        format_type: "BOOK_CHAPTER",
        learning_style_tags: ["Reading", "CLI"],
        uncle_commentary: "",
      });
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      setIsSaving(true);
      setToast(null);
      await deleteCuratedResourceAction(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      setToast(`[ RESOURCE REMOVED FROM VAULT ]`);
    } catch (err: any) {
      setToast(`[ ERROR: ${err.message} ]`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLandingCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setToast(null);
      await updateLandingCopyAction(landingCopy);
      setToast(`[ LANDING PAGE COPY UPDATED ]`);
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

      {/* Sub-nav Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveSection("milestones")}
          className={`font-mono text-xs px-4 py-2 border rounded-none transition-colors ${
            activeSection === "milestones"
              ? "border-signal-cta text-signal-cta font-bold bg-signal-cta/10"
              : "border-[var(--border-grid)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
          }`}
        >
          [ 01. MILESTONES &amp; RUBRICS ]
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("resources")}
          className={`font-mono text-xs px-4 py-2 border rounded-none transition-colors ${
            activeSection === "resources"
              ? "border-signal-cta text-signal-cta font-bold bg-signal-cta/10"
              : "border-[var(--border-grid)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
          }`}
        >
          [ 02. CURATED RESOURCE VAULT ]
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("copy")}
          className={`font-mono text-xs px-4 py-2 border rounded-none transition-colors ${
            activeSection === "copy"
              ? "border-signal-cta text-signal-cta font-bold bg-signal-cta/10"
              : "border-[var(--border-grid)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
          }`}
        >
          [ 03. LANDING PAGE COPY ]
        </button>
      </div>

      {/* Section 1: Milestones */}
      {activeSection === "milestones" && (
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 space-y-6">
          <HudBracketHeader variant="warn">
            CURRICULUM MILESTONE EDITOR (`curriculum_public`)
          </HudBracketHeader>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Create or edit Phase milestones, Disaster Stories, Mental Models, and Sandbox requirements.
          </p>

          <form onSubmit={handleSaveMilestone} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                  MILESTONE ID
                </label>
                <input
                  type="text"
                  required
                  value={editingMilestone.milestone_id}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, milestone_id: e.target.value })
                  }
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                  PHASE (1-5)
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={editingMilestone.phase}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, phase: parseInt(e.target.value) || 1 })
                  }
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                  SEQUENCE ORDER
                </label>
                <input
                  type="number"
                  min={1}
                  value={editingMilestone.sequence_order}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      sequence_order: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                  TITLE
                </label>
                <input
                  type="text"
                  required
                  value={editingMilestone.title}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, title: e.target.value })
                  }
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMilestone.is_live_in_v1}
                    onChange={(e) =>
                      setEditingMilestone({
                        ...editingMilestone,
                        is_live_in_v1: e.target.checked,
                      })
                    }
                    className="accent-signal-cta rounded-none"
                  />
                  <span>IS LIVE IN V1</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                MENTAL MODEL
              </label>
              <textarea
                rows={2}
                value={editingMilestone.mental_model}
                onChange={(e) =>
                  setEditingMilestone({ ...editingMilestone, mental_model: e.target.value })
                }
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                REAL-WORLD DISASTER STORY
              </label>
              <textarea
                rows={2}
                value={editingMilestone.disaster_story}
                onChange={(e) =>
                  setEditingMilestone({ ...editingMilestone, disaster_story: e.target.value })
                }
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                PROJECT BRIEF
              </label>
              <textarea
                rows={2}
                value={editingMilestone.project_brief}
                onChange={(e) =>
                  setEditingMilestone({ ...editingMilestone, project_brief: e.target.value })
                }
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="font-mono text-xs bg-signal-cta text-black font-bold px-6 py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity rounded-none"
            >
              {isSaving ? "[ SAVING... ]" : "[ UPSERT MILESTONE ]"}
            </button>
          </form>

          {/* Existing Milestones List */}
          <div className="pt-4 border-t border-[var(--border-grid)]">
            <span className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-3">
              LOADED MILESTONES IN SUPABASE ({milestones.length})
            </span>
            <div className="space-y-2">
              {milestones.map((m) => (
                <div
                  key={m.milestone_id}
                  onClick={() => setEditingMilestone(m)}
                  className="border border-[var(--border-grid)] p-3 bg-[var(--bg-canvas)] hover:border-signal-cta cursor-pointer transition-colors flex items-center justify-between font-mono text-xs"
                >
                  <div>
                    <span className="text-signal-cta font-bold mr-2">
                      P{m.phase}.{m.sequence_order}
                    </span>
                    <span className="text-[var(--text-primary)]">{m.title}</span>
                  </div>
                  <span
                    className={
                      m.is_live_in_v1 ? "text-signal-pass font-bold" : "text-[var(--text-muted)]"
                    }
                  >
                    {m.is_live_in_v1 ? "[ LIVE ]" : "[ COMING SOON ]"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Curated Resources */}
      {activeSection === "resources" && (
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 space-y-6">
          <HudBracketHeader variant="pass">
            CURATED RESOURCE VAULT (`curated_resources`)
          </HudBracketHeader>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Recommended books, chapters, and primary docs that Uncle Drill feeds cadets during Study Room chat.
          </p>

          <form onSubmit={handleCreateResource} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                FOR MILESTONE ID
              </label>
              <input
                type="text"
                required
                value={newResource.milestone_id}
                onChange={(e) =>
                  setNewResource({ ...newResource, milestone_id: e.target.value })
                }
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                FORMAT TYPE
              </label>
              <select
                value={newResource.format_type}
                onChange={(e) =>
                  setNewResource({ ...newResource, format_type: e.target.value as any })
                }
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              >
                <option value="OFFICIAL_DOC">OFFICIAL_DOC</option>
                <option value="BOOK_CHAPTER">BOOK_CHAPTER</option>
                <option value="INTERACTIVE_SIM">INTERACTIVE_SIM</option>
                <option value="VIDEO_LECTURE">VIDEO_LECTURE</option>
                <option value="ARTICLE">ARTICLE</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                RESOURCE TITLE
              </label>
              <input
                type="text"
                required
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                placeholder="e.g. The Linux Command Line, Ch. 4"
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                DIRECT URL
              </label>
              <input
                type="url"
                required
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                UNCLE DRILL COMMENTARY
              </label>
              <textarea
                rows={2}
                required
                value={newResource.uncle_commentary}
                onChange={(e) =>
                  setNewResource({ ...newResource, uncle_commentary: e.target.value })
                }
                placeholder="Why the cadet must read this before drilling..."
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSaving}
                className="font-mono text-xs bg-signal-pass text-black font-bold px-6 py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity rounded-none"
              >
                {isSaving ? "[ ADDING... ]" : "[ ADD RESOURCE TO VAULT ]"}
              </button>
            </div>
          </form>

          {/* Resources List */}
          <div className="pt-4 border-t border-[var(--border-grid)] space-y-3">
            {resources.map((r) => (
              <div
                key={r.id}
                className="border border-[var(--border-grid)] p-3 bg-[var(--bg-canvas)] flex items-start justify-between gap-4 font-mono text-xs"
              >
                <div>
                  <div className="font-bold text-[var(--text-primary)]">{r.title}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{r.url}</div>
                  <div className="text-[10px] text-signal-cta mt-1">
                    {r.format_type} | MILESTONE: {r.milestone_id}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] italic mt-1">
                    &quot;{r.uncle_commentary}&quot;
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteResource(r.id)}
                  className="text-signal-fault text-[10px] border border-signal-fault/30 px-2 py-1 hover:border-signal-fault rounded-none"
                >
                  [ REMOVE ]
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Landing Copy */}
      {activeSection === "copy" && (
        <div className="border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 space-y-6">
          <HudBracketHeader variant="warn">
            MARKETING &amp; LANDING COPY OVERRIDES
          </HudBracketHeader>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Override the landing page hero headline and manifesto copy directly in `platform_settings`.
          </p>

          <form onSubmit={handleSaveLandingCopy} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                HERO HEADLINE OVERRIDE
              </label>
              <input
                type="text"
                value={landingCopy.hero_headline ?? ""}
                onChange={(e) =>
                  setLandingCopy({ ...landingCopy, hero_headline: e.target.value })
                }
                placeholder="Leave blank to use default hero headline..."
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-[var(--text-muted)] block uppercase mb-1">
                MANIFESTO QUOTE OVERRIDE
              </label>
              <textarea
                rows={3}
                value={landingCopy.manifesto_quote ?? ""}
                onChange={(e) =>
                  setLandingCopy({ ...landingCopy, manifesto_quote: e.target.value })
                }
                placeholder="Leave blank to use default manifesto quote..."
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-grid)] p-2 font-mono text-xs text-[var(--text-primary)] rounded-none focus:border-signal-cta outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="font-mono text-xs bg-signal-cta text-black font-bold px-6 py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity rounded-none"
            >
              {isSaving ? "[ SAVING... ]" : "[ SAVE LANDING COPY ]"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
