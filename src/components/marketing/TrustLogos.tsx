/**
 * @purpose Infinite-looping horizontal marquee of 12 monochrome engineering brand SVG marks.
 *   Doubles the brand list to create a seamless infinite scroll illusion, with
 *   CSS edge-fade gradient masks and hover-pause. Each logo is fully vectorized
 *   and theme-responsive via `currentColor`.
 * @security Static SVG data; no remote resources loaded.
 * @reference docs/06_UI_DESIGN_SYSTEM.md, docs/07_UX_WRITING_AND_VOICE.md
 */
import * as React from "react";

const BRANDS = [
  {
    name: "CLOUDFLARE",
    title: "Cloudflare Systems Standard",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
      </svg>
    ),
  },
  {
    name: "stripe",
    title: "Stripe Infrastructure Architecture",
    svg: (
      <svg width="14" height="18" viewBox="0 0 24 30" fill="currentColor" aria-hidden="true">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.97 15.654.43 12.52.43c-6.19 0-10.354 3.228-10.354 8.653 0 6.64 8.57 6.47 8.57 10.36 0 1.094-.969 1.579-2.316 1.579-2.736 0-5.845-1.282-7.854-2.428L0 24.161c2.164 1.134 5.394 1.839 8.795 1.839 6.41 0 10.635-3.084 10.635-8.71 0-7.391-8.454-6.848-8.454-8.14z"/>
      </svg>
    ),
  },
  {
    name: "ANTHROPIC",
    title: "Anthropic First Principles",
    svg: (
      <svg width="20" height="16" viewBox="0 0 24 21" fill="currentColor" aria-hidden="true">
        <path d="M14.2 2.5h3.6L24 21.5h-3.6l-1.6-4.5h-6.8l-1.6 4.5H6.8L14.2 2.5zm2.8 11.8l-2.2-6.2-2.2 6.2h4.4zM4.4 7.2L0 19.5h3.4l1.1-3.2h4.4l.6 1.8h3.3L8.6 7.2H4.4z"/>
      </svg>
    ),
  },
  {
    name: "paystack",
    title: "Paystack Resilient Concurrency",
    svg: (
      <svg width="22" height="17" viewBox="0 0 26 20" fill="none" aria-hidden="true">
        <rect y="0" width="26" height="4.5" fill="currentColor"/>
        <rect y="7.5" width="18" height="4.5" fill="currentColor"/>
        <rect y="15" width="22" height="4.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "moniepoint",
    title: "Moniepoint Real-World Core",
    svg: (
      <svg width="18" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M2 18L12 4L22 18H17L12 11L7 18H2Z" fill="currentColor"/>
        <circle cx="12" cy="18" r="2.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    title: "GitHub Open Source Toolchain",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: "VERCEL",
    title: "Vercel Deployment Platform",
    svg: (
      <svg width="18" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 22.525H0l12-21.05 12 21.05z"/>
      </svg>
    ),
  },
  {
    name: "LINEAR",
    title: "Linear Engineering Workflow",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M0 14.347l9.64 9.64a12.02 12.02 0 0 1-9.64-9.64zm0-3.654L13.307 24a12.08 12.08 0 0 1-2.327.165L0 13.007v-2.314zm.38-3.442L17.12 23.63A12.017 12.017 0 0 1 14.83 24L.37 9.54a12.069 12.069 0 0 1 .01-2.289zM1.628 4.06L19.94 22.37a12.01 12.01 0 0 1-1.886 1.058L.57 5.936A12.106 12.106 0 0 1 1.628 4.06zm2.744-2.751l17.32 17.319c-.517.43-1.076.814-1.672 1.148L3.312 2.596A12.086 12.086 0 0 1 4.372 1.31zm3.62-1.065l15.76 15.76A12.001 12.001 0 0 1 20.45 17.7L5.304.543A12.05 12.05 0 0 1 7.992.245zm4.03-.238l11.73 11.73A11.975 11.975 0 0 1 23.755 12L12.022.006c-.674-.01-1.34.04-1.993.15l-.006.001z"/>
      </svg>
    ),
  },
  {
    name: "Flutterwave",
    title: "Flutterwave African Payments",
    svg: (
      <svg width="20" height="16" viewBox="0 0 28 22" fill="none" aria-hidden="true">
        <path d="M2 11C2 6.03 6.03 2 11 2h6C21.97 2 26 6.03 26 11v0C26 15.97 21.97 20 17 20h-6C6.03 20 2 15.97 2 11z" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M8 11h12M14 5v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"/>
      </svg>
    ),
  },
  {
    name: "ANDELA",
    title: "Andela Engineering Talent",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    name: "DOCKER",
    title: "Docker Container Platform",
    svg: (
      <svg width="22" height="16" viewBox="0 0 30 22" fill="currentColor" aria-hidden="true">
        <rect x="0" y="8" width="5" height="5" rx="0"/>
        <rect x="6" y="8" width="5" height="5" rx="0"/>
        <rect x="12" y="8" width="5" height="5" rx="0"/>
        <rect x="6" y="2" width="5" height="5" rx="0"/>
        <rect x="12" y="2" width="5" height="5" rx="0"/>
        <rect x="12" y="14" width="5" height="5" rx="0"/>
        <path d="M18.5 9.5C19.5 8 21.5 8 22 8.5C24 7 26 9 24 12C22 15 18 15 16 14C14 13 14 10.5 18.5 9.5z"/>
      </svg>
    ),
  },
  {
    name: "PostgreSQL",
    title: "PostgreSQL Relational Systems",
    svg: (
      <svg width="18" height="20" viewBox="0 0 24 26" fill="none" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="4" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M3 5v12c0 2.21 4.03 4 9 4s9-1.79 9-4V5" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M3 11c0 2.21 4.03 4 9 4s9-1.79 9-4" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M15 19v3M15 22c0 1 1 1.5 1 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/>
      </svg>
    ),
  },
];

export function TrustLogos() {
  return (
    <div className="trust-marquee-wrapper">
      {/* Edge gradient fade masks */}
      <div
        aria-hidden="true"
        className="trust-marquee-fade-left"
        style={{
          background: "linear-gradient(to right, var(--bg-canvas), transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="trust-marquee-fade-right"
        style={{
          background: "linear-gradient(to left, var(--bg-canvas), transparent)",
        }}
      />

      <div className="trust-marquee-track" aria-label="Engineering brands that demand these fundamentals">
        {/* Double the list for seamless infinite loop */}
        {[...BRANDS, ...BRANDS].map((brand, idx) => (
          <div
            key={`${brand.name}-${idx}`}
            className="trust-marquee-item"
            title={brand.title}
            aria-hidden={idx >= BRANDS.length}
          >
            <span className="trust-logo-icon" aria-hidden="true">
              {brand.svg}
            </span>
            <span className="trust-logo-name">{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
