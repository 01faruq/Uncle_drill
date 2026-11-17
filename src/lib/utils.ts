/**
 * @purpose Utility functions for class name merging and common formatting.
 * @security Sanitizes and deduplicates Tailwind class names without runtime regex vulnerabilities.
 * @reference docs/06_UI_DESIGN_SYSTEM.md
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
