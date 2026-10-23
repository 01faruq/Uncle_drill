---
trigger: always_on
---

---
trigger: always_on
description: Enforces Supabase Row-Level Security, prevents column-privilege escalation, and guards AI endpoints against prompt injection and token drain.
---

# Security, Database & AI Harness Laws

1. **Database & RLS Invariants:**
   - Every table in `supabase/migrations/` MUST have `ENABLE ROW LEVEL SECURITY`.
   - Always wrap `auth.uid()` in a scalar subquery `((SELECT auth.uid()) = user_id)` inside RLS policies for query performance.
   - NEVER expose `audit_rubrics_private` to client-side Supabase queries. It may ONLY be queried server-side via the service-role client inside `src/modules/audit-engine/`.
   - All drill attempt deductions MUST execute via the atomic PostgreSQL RPC `start_drill_session_atomic()` using `SELECT ... FOR UPDATE` row locking.

2. **Prompt Injection & Grading Integrity:**
   - Objective code checks (Gate 1 & Gate 2 exit codes, `pytest`, `ruff`, `mypy --strict`) MUST run deterministically BEFORE calling the LLM.
   - If deterministic checks fail, the LLM is physically blocked from setting `session.status = 'PASSED'`.
   - Always wrap student code, terminal history, and chat inputs inside `<untrusted_student_artifact>` XML tags before passing to Gemini.