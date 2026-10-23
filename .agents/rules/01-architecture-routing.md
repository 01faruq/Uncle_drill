---
trigger: always_on
---

---
trigger: always_on
description: Enforces Deep Modules folder boundaries and URL-driven navigation state via nuqs so the browser Back button never breaks.
---

# Architecture & URL Routing Laws

1. **Zero Navigation State in `useState`:**
   - NEVER store active tabs, selected phases, open drawers, active drill gates, or filter states in local React `useState`.
   - ALWAYS use `nuqs` (`useQueryState` / `useQueryStates`) synced to URL search parameters as specified in `docs/04_SYSTEM_ARCHITECTURE.md`.
   - Clicking the browser Back button or refreshing the page (`F5`) must deterministically restore the exact UI view.

2. **Strict Separation of Concerns (Deep Modules):**
   - `src/app/**` routes and components may ONLY handle layout, URL state binding, and calling Server Actions.
   - All domain logic, grading engines, quota checks, and database mutations MUST live inside `src/modules/<domain>/`.
   - All Server Actions MUST use `next-safe-action` with `Zod` input schemas and server-side authentication context.

3. **Environment Safety:**
   - NEVER access `process.env` directly inside application code. Always import validated variables from `src/env.ts` (`@t3-oss/env-nextjs`).