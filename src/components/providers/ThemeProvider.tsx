"use client";

/**
 * @purpose URL-driven Dual-Theme provider synchronizing Obsidian Dark and Blueprint Paper atmospheres.
 * @security Zero third-party tracking scripts, safe string validation against known theme keys.
 * @reference docs/06_UI_DESIGN_SYSTEM.md (Section 2: Color Tokens) & docs/04_SYSTEM_ARCHITECTURE.md (nuqs URL State)
 */
import * as React from "react";
import { useQueryState, parseAsStringLiteral } from "nuqs";

export const THEMES = ["obsidian", "paper"] as const;
export type Theme = (typeof THEMES)[number];

const themeParser = parseAsStringLiteral(THEMES).withDefault("obsidian");

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useQueryState("theme", themeParser);

  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}

export function useTheme() {
  const [theme, setTheme] = useQueryState("theme", themeParser);
  const toggleTheme = React.useCallback(() => {
    setTheme((current) => (current === "obsidian" ? "paper" : "obsidian"));
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}
