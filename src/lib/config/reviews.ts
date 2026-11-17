/**
 * @purpose Canonical early engineer & fellow audit reviews configuration.
 *   Provides structured, realistic testimonials for the horizontal reviews carousel.
 *   Designed for straightforward updates via the /command Admin CMS.
 * @security Read-only client-side static configuration; no untrusted HTML is rendered.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md & docs/07_UX_WRITING_AND_VOICE.md
 */

export interface AuditReview {
  id: string;
  name: string;
  handle: string;
  role: string;
  track: string;
  auditBadge: string;
  metrics: string;
  quote: string;
  avatarSeed: number;
}

export const AUDIT_REVIEWS: AuditReview[] = [
  {
    id: "rev-01",
    name: "Tunde Bakare",
    handle: "@tbakare_dev",
    role: "Backend Fellow",
    track: "AltSchool / Linux & Python Core",
    auditBadge: "PASSED MILESTONE 1.2 • 0 STRIKES",
    metrics: "ACCURACY: 98.4% // TIME: 14m 20s",
    quote:
      "I thought I knew Linux until Uncle Drill failed my script for leaking stderr on file descriptor 2. No tutorial had ever tested my code in a real subshell before. That single audit changed how I write production bash forever.",
    avatarSeed: 1,
  },
  {
    id: "rev-02",
    name: "Amina Bello",
    handle: "@amina_systems",
    role: "CS Finalist & Contributor",
    track: "Unilag CS / Distributed Systems",
    auditBadge: "PASSED MILESTONE 2.1 • 1 STRIKE",
    metrics: "ACCURACY: 94.1% // TIME: 22m 05s",
    quote:
      "I spent 2 hours arguing with Uncle Drill on stack vs. heap allocation for custom hash tables. He didn't let me pass until I explained cache lines and pointer dereferences without buzzwords. Brutal, but 100x better than any lecture.",
    avatarSeed: 2,
  },
  {
    id: "rev-03",
    name: "Chidi Okonkwo",
    handle: "@chidi_fastapi",
    role: "Junior Python / FastAPI Dev",
    track: "Fintech Services / Concurrency",
    auditBadge: "PASSED MILESTONE 3.2 • 0 STRIKES",
    metrics: "ACCURACY: 99.1% // TIME: 18m 40s",
    quote:
      "I was generating API endpoints with Cursor and thought I was flying. Uncle Drill hit my endpoint with a concurrent double-submit chaos drill and proved my idempotency key was vulnerable to a race condition. It saved me from a catastrophic production bug.",
    avatarSeed: 3,
  },
  {
    id: "rev-04",
    name: "Kofi Mensah",
    handle: "@kmensah_ops",
    role: "DevOps & Cloud Intern",
    track: "Accra Tech Hub / Linux Git Internals",
    auditBadge: "PASSED MILESTONE 1.4 • 0 STRIKES",
    metrics: "ACCURACY: 96.8% // TIME: 09m 15s",
    quote:
      "Most courses give you multiple-choice questions you can guess. Uncle Drill gave me a corrupt git index with detached HEAD and said 'restore commit history using reflog in 10 minutes.' When I passed, I actually felt like an engineer.",
    avatarSeed: 4,
  },
  {
    id: "rev-05",
    name: "Ngozi Eze",
    handle: "@ngozi_code",
    role: "Systems Programming Student",
    track: "ALX Backend Specialization / Docker",
    auditBadge: "PASSED MILESTONE 4.1 • 1 STRIKE",
    metrics: "ACCURACY: 95.3% // TIME: 16m 50s",
    quote:
      "The roast feature sounds funny until Uncle Drill catches you trying to paste questions into ChatGPT. His warning made me close every other tab. That focus helped me nail multi-stage Docker builds with zero bloated layers.",
    avatarSeed: 5,
  },
];
