---
name: tdd-build
description: Executes Red-Green-Refactor Test-Driven Development for backend modules, database RPCs, and Server Actions.
---

# Skill: TDD Vertical Build (Red-Green-Refactor)

When invoked on an approved plan:
1. **RED (Write Failing Test First):** Write a unit or integration test in `src/modules/<domain>/__tests__/*.test.ts` testing both the happy path and the adversarial edge case (e.g., race condition, expired cooldown, prompt injection attempt). Run `npm run test` to confirm it fails.
2. **GREEN (Minimal Clean Implementation):** Write the implementation code in `src/modules/<domain>/` using strict TypeScript (`ts-reset`, `Zod`) until the test passes.
3. **REFACTOR & LINT:** Run `npm run typecheck` and `bash scripts/check-ui-slop.sh`.
4. Update `state.md` marking the sub-task `[x]`.