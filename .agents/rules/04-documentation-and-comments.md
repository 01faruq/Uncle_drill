---
trigger: always_on
---

---
trigger: always_on
description: Forces the agent to write senior-level JSDoc comments explaining WHY (never obvious WHAT), maintain README.md, and log architectural implementation notes.
---

# Documentation, Code Comments & Implementation Logging Laws

1. **Senior-Level Code Comments ("Why, Not What"):**
   - NEVER write noisy beginner comments like `// increment counter by 1`.
   - Every module in `src/modules/*`, every complex SQL RPC, and every Server Action MUST include a JSDoc header explaining:
     - `@purpose`: Architectural role of this module.
     - `@security`: Which threat or edge case it guards against (e.g., TOCTOU race condition, prompt injection, 3G drop).
     - `@reference`: Link to the section in `docs/02_PRD_AND_ROADMAP.md` or `docs/04_SYSTEM_ARCHITECTURE.md`.

2. **Mandatory Implementation Logs (`docs/implementation-log/`):**
   - Upon completing any Slice in `state.md`, create `docs/implementation-log/SLICE_<N>_IMPLEMENTATION.md` explaining in clear, educational engineering prose:
     - What was built and how the files connect.
     - Key trade-offs and design patterns used (so the Founder can study the implementation).
     - How to test and verify the slice locally.

3. **Living `README.md`:**
   - Keep the root `README.md` updated with exact setup instructions, architecture overview, environment variable table, and test commands whenever new infrastructure is added.