# SUB-TASK 1.2 IMPLEMENTATION LOG: AUTHENTICATION, 3-QUESTION ONBOARDING & ADAPTIVE VIEWPORT GUARD

**Date:** 2026-10-27  
**Sub-Task:** 1.2 — Authentication (Email + Google/GitHub OAuth), 3-Question Onboarding Flow (`nuqs`), Next.js Edge Middleware (`supabase.auth.getUser()`), Adaptive Viewport Guard (`<DesktopDrillGuard />`), and Server-Side Profile Upsert Fallback  
**Status:** COMPLETE & VERIFIED GREEN (27/27 Unit Tests Passing, Next.js Build 13/13 Pages Clean, Zero UI Slop, Dev Server 200 OK)

---

## 1. Architectural Role & Deliverables Built

Sub-Task 1.2 delivers the foundational user lifecycle and route access control for Uncle Drill, bridging anonymous visitors into authenticated students with verified learning profiles:

1. **PostgreSQL RLS Recursion Safeguard & Resilient Provisioning:**
   - In `supabase/migrations/0002_dual_brain_and_command_room.sql`, established `public.is_super_admin()` as a `SECURITY DEFINER` function returning `BOOLEAN`.
   - Used inside the `"super_admin_manage_profiles"` policy and `protect_profile_sensitive_columns()` trigger function to prevent infinite RLS query recursion when evaluating super admin status against `profiles`.
   - In `supabase/migrations/0001_initial_schema.sql`, updated `handle_new_user()` to use `SECURITY DEFINER SET search_path = public`, `ON CONFLICT (id) DO NOTHING`, and an internal `EXCEPTION WHEN OTHERS THEN RAISE WARNING ...` block so `auth.users` insertions are never aborted by a trigger exception.

2. **Industrial Terminal Authentication Pages:**
   - [src/app/(auth)/login/page.tsx](file:///home/abu-hafs/Desktop/Uncle_drill/src/app/(auth)/login/page.tsx): Industrial Terminal login interface featuring Email + Password authentication, 1-click Google OAuth and GitHub OAuth triggers via Supabase SSR, and zero SaaS styling.
   - [src/app/(auth)/signup/page.tsx](file:///home/abu-hafs/Desktop/Uncle_drill/src/app/(auth)/signup/page.tsx): Industrial Terminal signup with password confirmation and instant OAuth options. Features `FREE STARTER ACCESS` badge (avoiding pixel font `₦0` / `NO` ambiguity).
   - [src/app/auth/callback/route.ts](file:///home/abu-hafs/Desktop/Uncle_drill/src/app/auth/callback/route.ts): PKCE OAuth code exchange Route Handler redirecting to `/onboarding` or `/roadmap`.
   - [src/app/auth/signout/route.ts](file:///home/abu-hafs/Desktop/Uncle_drill/src/app/auth/signout/route.ts): Server-side signout handler clearing authentication cookies and redirecting to `/login`.

3. **URL-Synced 3-Question Onboarding Flow (`nuqs`) & Admin Upsert Fallback:**
   - [src/app/(auth)/onboarding/page.tsx](file:///home/abu-hafs/Desktop/Uncle_drill/src/app/(auth)/onboarding/page.tsx): A 3-question progressive profile configurator synced to `?step=1|2|3` via `nuqs` (`useQueryState`), enabling browser Back/Forward navigation with zero state loss:
     - **Question 1 (Identity):** First Name + form of address (`bro`, `sis`, `first_name`).
     - **Question 2 (Starting Bedrock):** Current experience level (`BEDROCK_BEGINNER`, `DEV_NO_LINUX`, `EXPERIENCED_RELEARNING`).
     - **Question 3 (Learning DNA):** Analogy domains (`TRADING`, `AUTOMOTIVE`, `CONSTRUCTION`, `AVIATION`, `COOKING`, `CHESS`, `MEDICINE`, `NONE`).
     - Visual avatar: Uncle Drill official portrait (`/brand/uncle-avatar.jpg`) with industrial HUD brackets (`⌈ UNCLE'S BRIEFING ⌋`).
   - [src/modules/auth/onboarding-actions.ts](file:///home/abu-hafs/Desktop/Uncle_drill/src/modules/auth/onboarding-actions.ts): Server action `completeOnboardingAction` with Zod validation (`onboardingSchema`), utilizing the service-role admin client with `.upsert({ id: user.id, ... })` to guarantee that even if a profile row was missing, it is provisioned with `role = isFounder ? 'SUPER_ADMIN' : 'STUDENT'`, marked `onboarding_completed = true`, and redirects to `/roadmap`.

4. **Edge Middleware Session Security:**
   - [src/middleware.ts](file:///home/abu-hafs/Desktop/Uncle_drill/src/middleware.ts): Edge middleware using `createServerClient` from `@supabase/ssr`:
     - Calls `await supabase.auth.getUser()` on every matched request (never relying solely on `getSession()`) to cryptographically validate JWT freshness and refresh session cookies.
     - Automatically routes unauthenticated users from `/roadmap`, `/study/*`, `/drill/*`, `/onboarding`, and `/command` to `/login?next=<path>`.
     - Forces incomplete onboarding accounts (`onboarding_completed === false`) to `/onboarding`.
     - Restricts `/command` strictly to users with `role === 'SUPER_ADMIN'`.

5. **Adaptive Desktop vs. Mobile Guard:**
   - [src/components/drill-room/DesktopDrillGuard.tsx](file:///home/abu-hafs/Desktop/Uncle_drill/src/components/drill-room/DesktopDrillGuard.tsx): Responsive guard wrapping `/drill/[milestoneId]` that inspects viewport width (`< 1024px`) and physically locks mobile screens with:
     - `⌈ DESKTOP TERMINAL REQUIRED // NO MOBILE SHORTCUTS ⌋`
     - Direct routing actions: `[ GO TO STUDY ROOM // MOBILE READY ]` and `[ READ FIELD MANUAL (.MD) ]`.

6. **Authenticated Shell Routes:**
   - `/roadmap`: Industrial roadmap layout displaying Phase index and navigation controls.
   - `/study/[milestoneId]`: Study room shell featuring milestone ID telemetry.
   - `/drill/[milestoneId]`: Drill terminal shell wrapped in `<DesktopDrillGuard />`.
   - `/command`: Super Admin command room shell with `[ FOUNDER COMMAND ROOM // SUPER_ADMIN ]` header and `[ SIGN OUT ]` action.

---

## 2. Test & Verification Matrix

| Test Suite | Purpose | Status |
| :--- | :--- | :--- |
| `tests/unit/auth-and-guard.test.tsx` | Verifies `/login`, `/signup` (`FREE STARTER ACCESS` badge), `/onboarding` step progression with `nuqs`, `<DesktopDrillGuard />` mobile viewport lockout, `UncleDrillAvatar` inline SVG fallback, and `CONTINUE ->` button text | **PASS (9/9)** |
| `src/modules/access-control/__tests__/quota-and-schema.test.ts` | Validates atomic quota deduction RPC, QuotaError codes, and Supabase client typing | **PASS (6/6)** |
| `tests/unit/industrial-primitives.test.tsx` | Verifies Industrial HUD headers, badges, buttons, cards, metrics, and terminal tabs | **PASS (7/7)** |
| `tests/unit/marketing-components.test.tsx` | Verifies Landing Page marquee, pricing cards, and interactive components | **PASS (7/7)** |
| `bash scripts/check-ui-slop.sh` | Scans `src/` for forbidden rounded corners (`rounded-lg`), gradients, blurs, and SaaS colors | **PASS (0 violations)** |
| `npm run build` | Next.js 15 production build compiling all 13 routes and Edge Middleware | **PASS (0 errors)** |
| Dev Server Status (`http://localhost:3000`) | Serves `/`, `/login`, `/signup`, `/design-system` with `200 OK`, `/onboarding` and `/roadmap` with `307 Redirect` to `/login` | **PASS (200 OK)** |

---

## 3. How to Test Locally

1. **Verify Unit Tests:**
   ```bash
   npm test
   ```
2. **Verify Anti-Slop Linter:**
   ```bash
   bash scripts/check-ui-slop.sh
   ```
3. **Verify Dev Server Routing:**
   ```bash
   curl -I http://localhost:3000/
   curl -I http://localhost:3000/login
   curl -I http://localhost:3000/signup
   curl -I http://localhost:3000/onboarding  # Returns 307 Redirect to /login
   curl -I http://localhost:3000/roadmap     # Returns 307 Redirect to /login
   ```
