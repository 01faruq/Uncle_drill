/**
 * @purpose Uncle Drill Character Avatar Component with resilient inline SVG fallback.
 *   Attempts to load /brand/uncle-avatar.jpg (or .jpeg) and falls back to an inline SVG
 *   depicting Uncle Drill with flat cap, glowing green glasses, and '>_' badge.
 * @security Prevents broken image icons or remote asset leaks.
 * @reference docs/06_UI_DESIGN_SYSTEM.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */
"use client";

import React, { useState } from "react";

interface UncleDrillAvatarProps {
  size?: number;
  className?: string;
}

export function UncleDrillAvatar({ size = 48, className = "" }: UncleDrillAvatarProps) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <div
        className={`shrink-0 overflow-hidden border border-[var(--border-grid)] bg-[#0C0C0E] ${className}`}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/uncle-avatar.jpg"
          alt="Uncle Drill — Strict Systems Mentor"
          width={size}
          height={size}
          className="w-full h-full object-cover grayscale contrast-125"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback inline SVG: Uncle Drill with flat cap, glowing green glasses, and >_ badge
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Uncle Drill avatar"
      className={`shrink-0 border border-[var(--border-grid)] ${className}`}
    >
      <rect width="72" height="72" fill="#0C0C0E" />
      {/* Flat cap brim */}
      <rect x="14" y="18" width="44" height="6" fill="#27272C" />
      <rect x="16" y="12" width="40" height="9" fill="#1A1A20" />
      {/* Skin */}
      <ellipse cx="36" cy="34" rx="15" ry="16" fill="#5C3D2A" />
      {/* Stubble / beard shadow */}
      <path
        d="M21 40C21 48 27 54 36 54C45 54 51 48 51 40L44 43L36 45L28 43Z"
        fill="#3D2B1A"
        opacity="0.7"
      />
      {/* Thick-frame glasses — glowing green */}
      <rect x="19" y="30" width="14" height="9" stroke="#00FF66" strokeWidth="2" fill="none" />
      <rect x="35" y="30" width="14" height="9" stroke="#00FF66" strokeWidth="2" fill="none" />
      <line x1="33" y1="34" x2="35" y2="34" stroke="#00FF66" strokeWidth="2" />
      {/* Glow effect behind glasses */}
      <rect x="19" y="30" width="14" height="9" fill="#00FF66" opacity="0.08" />
      <rect x="35" y="30" width="14" height="9" fill="#00FF66" opacity="0.08" />
      {/* Eyes */}
      <ellipse cx="26" cy="34" rx="2" ry="2.5" fill="#060607" />
      <ellipse cx="42" cy="34" rx="2" ry="2.5" fill="#060607" />
      {/* Body / shirt */}
      <path d="M12 72C12 55 22 49 36 49C50 49 60 55 60 72H12Z" fill="#121216" />
      {/* >_ badge on shirt */}
      <rect x="27" y="56" width="18" height="9" fill="#0C0C0E" stroke="#00FF66" strokeWidth="1" />
      <text x="30" y="63" fontSize="6" fill="#00FF66" fontFamily="monospace">
        &gt;_
      </text>
    </svg>
  );
}
