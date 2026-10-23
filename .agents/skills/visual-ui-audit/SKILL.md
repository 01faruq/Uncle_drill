---
name: visual-ui-audit
description: Audits UI components against docs/06_UI_DESIGN_SYSTEM.md using the automated slop linter and Antigravity Browser Verification.
---

# Skill: Visual UI & UX Audit

When invoked after creating or modifying any UI component or page:
1. Run `bash scripts/check-ui-slop.sh`. If any banned class (`rounded-xl`, `bg-gradient`, `backdrop-blur`, etc.) is detected, fix it immediately.
2. Open the route in the Antigravity Browser Sub-Agent:
   - Verify `1px solid #27272C` structural grid alignment.
   - Click interactive tabs/drawers and inspect the browser URL bar to verify `nuqs` search parameters update cleanly.
   - Trigger the browser **Back** button and **Reload** to confirm zero state loss.
   - Capture a screenshot artifact for Founder visual sign-off.