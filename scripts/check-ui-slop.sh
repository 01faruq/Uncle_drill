#!/usr/bin/env bash
set -euo pipefail

echo "[UNCLE_DRILL // UI_AUDIT] Scanning src/ for banned AI-slop classes..."

BANNED_PATTERNS="rounded-(md|lg|xl|2xl|3xl)|bg-gradient-to|backdrop-blur|shadow-(md|lg|xl|2xl)|text-(indigo|purple|violet|pink)-|bg-(indigo|purple|violet|pink)-|hover:scale-"

if grep -rnE "$BANNED_PATTERNS" src/ --include="*.tsx" --include="*.ts" --include="*.css"; then
  echo "[ERROR] UI SLOP DETECTED! Remove banned rounded corners, gradients, blurs, or SaaS colors above." >&2
  exit 1
fi

echo "[PASS] Zero UI slop detected. Industrial Terminal aesthetic verified."
exit 0