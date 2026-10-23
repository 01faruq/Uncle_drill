---
name: plan-vertical-slice
description: Plans a single vertical slice from state.md by grilling edge cases and listing exact files, database touches, and tests before writing code.
---

# Skill: Plan Vertical Slice

When invoked:
1. Read `state.md` to identify the active Slice and Sub-Task.
2. Read the corresponding sections in `docs/02_PRD_AND_ROADMAP.md`, `docs/04_SYSTEM_ARCHITECTURE.md`, and `docs/06_UI_DESIGN_SYSTEM.md`.
3. Output a compact **Implementation Plan Artifact** containing:
   - **Goal:** 1-sentence outcome of this sub-task.
   - **Files to Create/Modify:** Exact file paths.
   - **URL State & Edge Cases Handled:** How Back-button navigation, offline/3G drops, or unauthorized inputs are handled.
   - **Verification Test:** Exact command (`vitest`, `playwright`, or `check-ui-slop.sh`) that proves completion.
4. Stop and ask the Founder: *"Approve this slice plan to begin TDD implementation?"*