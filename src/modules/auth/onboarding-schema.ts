/**
 * @purpose Onboarding Zod Schema & TypeScript Types.
 *   Kept strictly separated from "use server" actions to comply with Next.js Server Actions export rules.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */
import { z } from "zod";

export const onboardingSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "Name too long"),
  casualAddress: z.enum(["bro", "sis", "first_name"]),
  experienceLevel: z.enum([
    "COMPLETE_BEGINNER",
    "STUCK_IN_TUTORIAL_HELL",
    "EXPERIENCED_DEV",
  ]),
  preferredAnalogies: z
    .array(z.string())
    .min(1, "Select at least 1 analogy domain"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export interface OnboardingResult {
  success: boolean;
  error?: string;
}
