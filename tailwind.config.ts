import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      none: "0px",
      DEFAULT: "0px",
      pill: "9999px",
    },
    extend: {
      colors: {
        canvas: "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        highlight: "var(--bg-highlight)",
        "border-subtle": "var(--border-subtle)",
        "border-grid": "var(--border-grid)",
        "border-focus": "var(--border-focus)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-inverse": "var(--text-inverse)",
        "signal-cta": "var(--signal-cta)",
        "signal-pass": "var(--signal-pass)",
        "signal-warn": "var(--signal-warn)",
        "signal-fault": "var(--signal-fault)",
        "signal-info": "var(--signal-info)",
        "paper-canvas": "var(--paper-canvas)",
        "paper-surface": "var(--paper-surface)",
        "paper-ink": "var(--paper-ink)",
        "paper-border": "var(--paper-border)",
      },
      fontFamily: {
        display: ["var(--font-display)", "monospace"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        hud: "0.12em",
        tightest: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
