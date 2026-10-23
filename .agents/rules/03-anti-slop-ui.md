---
trigger: always_on
---

---
trigger: glob
globs: ["src/**/*.tsx", "src/**/*.css", "tailwind.config.*"]
description: Enforces the Industrial Terminal & Precision HUD Design System (docs/06_UI_DESIGN_SYSTEM.md) and bans generic AI UI slop.
---

# Anti-Slop UI & UX Engineering Laws

1. **Banned Tailwind & CSS Patterns (Instant Rejection):**
   - NO rounded cards or buttons: `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl` are FORBIDDEN. Use `rounded-none` (`0px`).
   - NO gradients or neon blurs: `bg-gradient-to-*`, `from-*`, `via-*`, `to-*`, `backdrop-blur-*`, and `shadow-lg`/`shadow-xl` are FORBIDDEN.
   - NO default SaaS palette: Tailwind `indigo-*`, `purple-*`, `violet-*`, `blue-*`, and `pink-*` classes are FORBIDDEN. Use only our CSS variables defined in `docs/06_UI_DESIGN_SYSTEM.md`.
   - NO bouncy hover transforms: `hover:scale-*` is FORBIDDEN.

2. **Mandatory Industrial Primitives:**
   - Build layouts using `<StructuralGrid />` and `<GridCell />` with exposed `1px solid var(--border-grid)` (`#27272C`) hairlines.
   - Use `--font-display` (`Departure Mono`) for phase titles, oversized index numbers (`01`, `02`), and HUD bracket headers (`⌈ TEXT ⌋`).
   - Use `--font-mono` (`Geist Mono`) for all UI controls, timestamps (`[20:17:21]`), telemetry logs, and Uncle Drill chat.
   - Use `--font-sans` (`Geist Sans`) ONLY for long-form reading paragraphs inside Mental Models and Disaster Stories.
   - Every async button MUST have a disabled loading state (`[ EXECUTING... ]`) to prevent double clicks.