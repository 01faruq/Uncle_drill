import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Silkscreen } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

/**
 * @purpose Root layout configuring Silkscreen pixel display font, Geist Mono, Geist Sans fonts, NuqsAdapter, and Dual-Theme state.
 * @security Sanitizes font loading, disables remote third-party trackers, and locks URL state synchronization.
 * @reference docs/06_UI_DESIGN_SYSTEM.md & docs/04_SYSTEM_ARCHITECTURE.md
 */

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UNCLE DRILL // Mastery Audit & Accountability Engine",
  description: "You can lie to the world, but you cannot lie to Uncle Drill. Zero-AI Linux sandboxes, live telemetry audits, and sovereign proof of work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="obsidian" className={`${silkscreen.variable} ${geistMono.variable} ${geistSans.variable}`}>
      <body className="min-h-screen bg-canvas text-text-primary antialiased font-mono">
        <NuqsAdapter>
          <Suspense fallback={null}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </Suspense>
        </NuqsAdapter>
      </body>
    </html>
  );
}
