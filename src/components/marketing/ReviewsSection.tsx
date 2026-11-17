"use client";

/**
 * @purpose Full-viewport-width horizontal side-scrolling Reviews section.
 *   Features: 72×72px large portrait SVG avatars with subtle monochrome/emerald
 *   duotone that clears to vivid color on hover. Mouse-wheel (onWheel) translates
 *   vertical delta → horizontal scrollLeft for trackpad/mouse-wheel scroll.
 *   Edge gradient fade masks hide overflow on both sides.
 * @security Client component; static review data, no untrusted HTML injection.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md §7, docs/06_UI_DESIGN_SYSTEM.md
 */

import * as React from "react";
import { AUDIT_REVIEWS, type AuditReview } from "@/lib/config/reviews";

// 72×72 developer portrait SVGs with monochrome default, vivid on hover
function ReviewAvatar({ seed }: { seed: number }) {
  const portraits = [
    // Profile A: West African male developer — angular jaw, short hair, hoodie
    <svg key="A" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="72" height="72" fill="#0C0C0E"/>
      {/* Skin */}
      <ellipse cx="36" cy="30" rx="14" ry="16" fill="#3D2B1A"/>
      {/* Hoodie body */}
      <path d="M14 72C14 54 23 48 36 48C49 48 58 54 58 72H14Z" fill="#1A1A20"/>
      {/* Hoodie hood */}
      <path d="M22 48L36 44L50 48" stroke="#27272C" strokeWidth="1.5" fill="none"/>
      {/* Eyes */}
      <ellipse cx="30" cy="28" rx="2.5" ry="3" fill="#060607"/>
      <ellipse cx="42" cy="28" rx="2.5" ry="3" fill="#060607"/>
      {/* Glasses - emerald glow on hover (via CSS filter) */}
      <rect x="25" y="25" width="10" height="7" rx="0" stroke="#00FF66" strokeWidth="1.5" fill="none" className="portrait-accent"/>
      <rect x="37" y="25" width="10" height="7" rx="0" stroke="#00FF66" strokeWidth="1.5" fill="none" className="portrait-accent"/>
      <line x1="35" y1="28" x2="37" y2="28" stroke="#00FF66" strokeWidth="1.5" className="portrait-accent"/>
      {/* Flat cap */}
      <rect x="20" y="14" width="32" height="5" fill="#27272C"/>
      <ellipse cx="36" cy="14" rx="16" ry="4" fill="#1A1A20"/>
      {/* >_ badge */}
      <rect x="28" y="54" width="16" height="8" fill="#0C0C0E" stroke="#27272C" strokeWidth="1"/>
      <text x="31" y="61" fontSize="5" fill="#00FF66" fontFamily="monospace" className="portrait-accent">&gt;_</text>
    </svg>,

    // Profile B: Female developer, natural hair, terminal badge
    <svg key="B" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="72" height="72" fill="#0C0C0E"/>
      {/* Natural hair halo */}
      <ellipse cx="36" cy="24" rx="18" ry="17" fill="#2D1F0F"/>
      {/* Skin */}
      <ellipse cx="36" cy="28" rx="12" ry="14" fill="#5C3D2A"/>
      {/* Collar */}
      <path d="M16 72C16 55 24 49 36 49C48 49 56 55 56 72H16Z" fill="#121216"/>
      {/* Eyes */}
      <ellipse cx="31" cy="27" rx="2" ry="2.5" fill="#060607"/>
      <ellipse cx="41" cy="27" rx="2" ry="2.5" fill="#060607"/>
      {/* Smile */}
      <path d="M30 34C30 34 33 37 36 37C39 37 42 34 42 34" stroke="#3D2B1A" strokeWidth="1.5" fill="none"/>
      {/* Earrings */}
      <circle cx="23" cy="30" r="2" fill="#D4FF00" className="portrait-accent"/>
      <circle cx="49" cy="30" r="2" fill="#D4FF00" className="portrait-accent"/>
      {/* Badge */}
      <rect x="26" y="52" width="20" height="9" fill="#0C0C0E" stroke="#00FF66" strokeWidth="1" className="portrait-accent"/>
      <text x="29" y="59" fontSize="5" fill="#00FF66" fontFamily="monospace" className="portrait-accent">&gt;_</text>
    </svg>,

    // Profile C: Male developer, beard, beanie
    <svg key="C" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="72" height="72" fill="#0C0C0E"/>
      {/* Beanie */}
      <rect x="18" y="10" width="36" height="15" fill="#27272C"/>
      <ellipse cx="36" cy="25" rx="18" ry="5" fill="#1A1A20"/>
      {/* Skin */}
      <ellipse cx="36" cy="34" rx="14" ry="13" fill="#7A5533"/>
      {/* Beard */}
      <path d="M22 40C22 50 28 55 36 55C44 55 50 50 50 40L44 42L36 44L28 42Z" fill="#3D2B1A"/>
      {/* Body */}
      <path d="M12 72C12 55 22 49 36 49C50 49 60 55 60 72H12Z" fill="#121216"/>
      {/* Eyes */}
      <ellipse cx="30" cy="31" rx="2.5" ry="2.5" fill="#060607"/>
      <ellipse cx="42" cy="31" rx="2.5" ry="2.5" fill="#060607"/>
      {/* Glasses accent */}
      <rect x="26" y="28" width="10" height="7" rx="0" stroke="#FF9500" strokeWidth="1.5" fill="none" className="portrait-accent"/>
      <rect x="36" y="28" width="10" height="7" rx="0" stroke="#FF9500" strokeWidth="1.5" fill="none" className="portrait-accent"/>
    </svg>,

    // Profile D: East African female, braids
    <svg key="D" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="72" height="72" fill="#0C0C0E"/>
      {/* Braids */}
      <path d="M18 20C18 20 20 8 36 8C52 8 54 20 54 20" fill="#1A0F07" stroke="#2D1F0F" strokeWidth="2"/>
      {/* Braid strands */}
      <line x1="24" y1="8" x2="20" y2="35" stroke="#2D1F0F" strokeWidth="2"/>
      <line x1="36" y1="6" x2="36" y2="38" stroke="#2D1F0F" strokeWidth="2"/>
      <line x1="48" y1="8" x2="52" y2="35" stroke="#2D1F0F" strokeWidth="2"/>
      {/* Skin */}
      <ellipse cx="36" cy="30" rx="13" ry="15" fill="#8B5E3C"/>
      {/* Body */}
      <path d="M14 72C14 54 24 48 36 48C48 48 58 54 58 72H14Z" fill="#0C0C0E"/>
      {/* Eyes */}
      <ellipse cx="31" cy="28" rx="2" ry="2.5" fill="#060607"/>
      <ellipse cx="41" cy="28" rx="2" ry="2.5" fill="#060607"/>
      {/* Necklace with badge */}
      <rect x="29" y="48" width="14" height="7" fill="#0C0C0E" stroke="#D4FF00" strokeWidth="1" className="portrait-accent"/>
      <text x="32" y="54" fontSize="5" fill="#D4FF00" fontFamily="monospace" className="portrait-accent">&gt;_</text>
    </svg>,

    // Profile E: Male developer, glasses, clean cut
    <svg key="E" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="72" height="72" fill="#0C0C0E"/>
      {/* Hair */}
      <ellipse cx="36" cy="19" rx="15" ry="11" fill="#1A0F07"/>
      {/* Skin */}
      <ellipse cx="36" cy="30" rx="13" ry="14" fill="#4A2D18"/>
      {/* Body — hoodie with zip */}
      <path d="M14 72C14 54 23 48 36 48C49 48 58 54 58 72H14Z" fill="#0C0C0E"/>
      <line x1="36" y1="48" x2="36" y2="72" stroke="#27272C" strokeWidth="1.5"/>
      {/* Eyes */}
      <ellipse cx="30" cy="29" rx="2" ry="2.5" fill="#060607"/>
      <ellipse cx="42" cy="29" rx="2" ry="2.5" fill="#060607"/>
      {/* Glasses */}
      <rect x="26" y="26" width="10" height="7" rx="0" stroke="#00E5FF" strokeWidth="1.5" fill="none" className="portrait-accent"/>
      <rect x="36" y="26" width="10" height="7" rx="0" stroke="#00E5FF" strokeWidth="1.5" fill="none" className="portrait-accent"/>
      <line x1="36" y1="29" x2="36" y2="29" stroke="#00E5FF" strokeWidth="1.5" className="portrait-accent"/>
    </svg>,

    // Profile F: Female developer, hijab
    <svg key="F" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="72" height="72" fill="#0C0C0E"/>
      {/* Hijab drape */}
      <ellipse cx="36" cy="26" rx="20" ry="20" fill="#1A1A20"/>
      <path d="M16 36C16 36 16 60 20 65H52C56 60 56 36 56 36C56 36 50 50 36 50C22 50 16 36 16 36Z" fill="#121216"/>
      {/* Skin face window */}
      <ellipse cx="36" cy="30" rx="11" ry="12" fill="#C68642"/>
      {/* Eyes */}
      <ellipse cx="31" cy="28" rx="2" ry="2.5" fill="#060607"/>
      <ellipse cx="41" cy="28" rx="2" ry="2.5" fill="#060607"/>
      {/* Smile */}
      <path d="M31 35C33 37 39 37 41 35" stroke="#8B5E3C" strokeWidth="1" fill="none"/>
      {/* Badge pin on hijab */}
      <rect x="42" y="18" width="10" height="7" fill="#0C0C0E" stroke="#00FF66" strokeWidth="1" className="portrait-accent"/>
      <text x="44" y="24" fontSize="4" fill="#00FF66" fontFamily="monospace" className="portrait-accent">&gt;_</text>
    </svg>,
  ];

  const selected = portraits[(seed - 1) % portraits.length];

  return (
    <div className="review-avatar-wrapper">
      {selected}
      {/* Duotone scanline overlay — clears on card hover */}
      <div className="review-avatar-scanline" aria-hidden="true" />
    </div>
  );
}

export function ReviewsSection() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -400 : 400, behavior: "smooth" });
  };

  /**
   * Translate vertical wheel delta → horizontal scroll so mouse-wheel and
   * two-finger trackpad swipes naturally navigate the review carousel.
   * Stops propagating to prevent page scroll while inside the track.
   */
  const handleWheel = React.useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // Only intercept predominantly vertical wheel events
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  }, []);

  return (
    <section id="reports" className="w-full mb-24">
      <div
        className="max-w-[1440px] mx-auto px-4 sm:px-6"
      >
        <div
          className="dot-matrix-bg p-7 sm:p-12 relative overflow-hidden"
          style={{ border: "1px solid var(--border-grid)" }}
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div
                className="font-mono text-xs font-bold tracking-[0.16em] uppercase mb-2"
                style={{ color: "var(--signal-warn)" }}
              >
                ⌈ EARLY ENGINEER &amp; FELLOW REPORTS ⌋
              </div>
              <h2 className="font-display font-bold text-xl sm:text-3xl text-text-primary uppercase leading-[1.25]">
                VERIFIED AUDIT TRANSCRIPTS FROM THE FRONT LINES
              </h2>
              <p className="text-text-secondary text-sm sm:text-base mt-2 font-sans" style={{ maxWidth: "60ch" }}>
                What happens when confident engineers face an unassisted, proctored sandbox with zero AI crutches.
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
              <button
                onClick={() => scrollByAmount("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll reviews left"
                className="px-3 py-2 uppercase font-bold border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  border: "1px solid var(--border-grid)",
                  background: "var(--bg-canvas)",
                  color: canScrollLeft ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                [ &lt; PREV ]
              </button>
              <button
                onClick={() => scrollByAmount("right")}
                disabled={!canScrollRight}
                aria-label="Scroll reviews right"
                className="px-3 py-2 uppercase font-bold border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  border: "1px solid var(--border-grid)",
                  background: "var(--bg-canvas)",
                  color: canScrollRight ? "var(--signal-cta)" : "var(--text-muted)",
                }}
              >
                [ NEXT &gt; ]
              </button>
            </div>
          </div>

          {/* Horizontal Carousel — wheel translates to horizontal scroll */}
          <div
            ref={scrollContainerRef}
            onWheel={handleWheel}
            className="reviews-scroll-track"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {AUDIT_REVIEWS.map((review: AuditReview) => (
              <div
                key={review.id}
                className="review-card group"
                style={{
                  border: "1px solid var(--border-grid)",
                  background: "var(--bg-surface)",
                }}
              >
                <div>
                  {/* Header: Large Portrait + Identity */}
                  <div className="flex items-center gap-4 mb-5">
                    <ReviewAvatar seed={review.avatarSeed} />
                    <div>
                      <div className="font-display font-bold text-xs sm:text-sm text-text-primary uppercase tracking-tight">
                        {review.name}
                      </div>
                      <div className="font-mono text-[11px] text-text-secondary">
                        {review.role}
                      </div>
                      <div className="font-mono text-[10px] text-text-muted">
                        {review.track}
                      </div>
                    </div>
                  </div>

                  {/* Audit Badge */}
                  <div
                    className="font-mono text-[10px] px-2.5 py-1 mb-4 inline-block font-bold tracking-wider"
                    style={{
                      background: "var(--bg-canvas)",
                      border: "1px solid var(--border-grid)",
                      color: "var(--signal-pass)",
                    }}
                  >
                    [ {review.auditBadge} ]
                  </div>

                  {/* Testimonial Quote */}
                  <p
                    className="font-sans text-xs sm:text-sm text-text-secondary leading-relaxed italic pl-3"
                    style={{ borderLeft: "2px solid var(--signal-cta)" }}
                  >
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>

                {/* Card Footer Telemetry */}
                <div
                  className="mt-6 pt-3 font-mono text-[10px] flex items-center justify-between"
                  style={{
                    borderTop: "1px dashed var(--border-subtle)",
                    color: "var(--text-muted)",
                  }}
                >
                  <span>{review.handle}</span>
                  <span style={{ color: "var(--signal-cta)" }}>{review.metrics}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Sub-Telemetry */}
          <div
            className="mt-6 pt-4 font-mono text-[10px] text-text-muted flex flex-wrap items-center justify-between gap-3"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-2 h-2 inline-block"
                style={{ background: "var(--signal-pass)" }}
              />
              TELEMETRY: 100% UNASSISTED SANDBOX LOGS
            </span>
            <span className="text-text-secondary">
              [ SCROLL WHEEL / DRAG / ARROW CONTROLS ENABLED ]
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
