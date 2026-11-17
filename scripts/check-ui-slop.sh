#!/usr/bin/env bash
set -euo pipefail

echo "[UNCLE_DRILL // UI_AUDIT] Scanning src/ for banned AI-slop classes..."

BANNED_PATTERNS="rounded-(md|lg|xl|2xl|3xl)|bg-gradient-to|backdrop-blur|shadow-(md|lg|xl|2xl)|text-(indigo|purple|violet|pink)-|bg-(indigo|purple|violet|pink)-|hover:scale-"

if grep -rnE "$BANNED_PATTERNS" src/ --include="*.tsx" --include="*.ts" --include="*.css"; then
  echo "[ERROR] UI SLOP DETECTED! Remove banned rounded corners, gradients, blurs, or SaaS colors above." >&2
  exit 1
fi

echo "[UNCLE_DRILL // UI_AUDIT] Scanning for backend telemetry spoilers and forbidden jargon..."
BANNED_STRINGS="Stochastic Move Director|RING_BUFFER|watches every command|princess|0% AI|&GT;"

if grep -rnE "$BANNED_STRINGS" src/app/ src/components/ --include="*.tsx" --include="*.ts"; then
  echo "[ERROR] TELEMETRY SPOILER OR BANNED JARGON DETECTED in student-facing UI!" >&2
  echo "Student-facing UI must never leak telemetry details (e.g. RING_BUFFER, Stochastic Move Director), use 'princess' / '0% AI', or raw '&GT;' entity." >&2
  exit 1
fi

echo "[PASS] Zero UI slop detected. Industrial Terminal aesthetic verified."
exit 0