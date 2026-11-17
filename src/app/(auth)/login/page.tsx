/**
 * @purpose Industrial Terminal Login Page.
 *   Provides Email/Password authentication plus 1-click Google and GitHub OAuth.
 * @security Client component using @supabase/ssr browser client. Sensitive inputs masked.
 * @reference docs/06_UI_DESIGN_SYSTEM.md, docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */
"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DrillButton } from "@/components/ui/industrial/DrillButton";
import { HudBracketHeader } from "@/components/ui/industrial/HudBracketHeader";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/roadmap";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError ? `Authentication error: ${urlError}` : null
  );

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Inspect profile for onboarding completion
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", data.user.id)
          .single();

        if (!profile?.onboarding_completed) {
          router.push("/onboarding");
        } else {
          router.push(next);
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to connect to authentication server."
      );
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    setErrorMessage(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      next
    )}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle Scanline Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--text-primary) 0, var(--text-primary) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-md border border-[var(--border-grid)] bg-[var(--bg-surface)] p-6 sm:p-8 relative z-10">
        {/* Header Badge */}
        <div className="mb-6 flex items-center justify-between">
          <HudBracketHeader variant="pass">
            TERMINAL ACCESS // LOGIN
          </HudBracketHeader>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            SEC_LEVEL: 01
          </span>
        </div>

        <h1 className="font-display text-xl sm:text-2xl text-[var(--text-primary)] uppercase tracking-wider mb-2">
          AUTHENTICATE CADET
        </h1>
        <p className="font-mono text-xs text-[var(--text-muted)] mb-6">
          Access your drills, telemetry logs, and Uncle Drill&apos;s Study Room.
        </p>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-950/40 border border-signal-fault text-signal-fault font-mono text-xs flex items-center gap-2">
            <span>[!]</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 border border-[var(--border-grid)] bg-[var(--bg-canvas)] hover:border-[var(--text-primary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] font-mono text-xs font-bold py-2.5 px-3 transition-colors rounded-none disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887C18.2 16.48 15.61 18.8 12.24 18.8c-3.75 0-6.8-3.05-6.8-6.8s3.05-6.8 6.8-6.8c1.67 0 3.2.61 4.38 1.62l2.36-2.36C17.38 2.87 14.96 2 12.24 2 6.58 2 2 6.58 2 12.24s4.58 10.24 10.24 10.24c6.33 0 10.24-4.45 10.24-10.24 0-.69-.07-1.37-.2-1.955H12.24z" />
            </svg>
            <span>GOOGLE</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("github")}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 border border-[var(--border-grid)] bg-[var(--bg-canvas)] hover:border-[var(--text-primary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] font-mono text-xs font-bold py-2.5 px-3 transition-colors rounded-none disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GITHUB</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-[var(--border-grid)] w-full" />
          <span className="bg-[var(--bg-surface)] px-2 font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider relative">
            OR VIA EMAIL
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1"
            >
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cadet@company.com"
              className="w-full border border-[var(--border-grid)] bg-[var(--bg-canvas)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono text-sm px-3.5 py-2.5 rounded-none outline-none focus:border-signal-cta transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider"
              >
                PASSWORD
              </label>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full border border-[var(--border-grid)] bg-[var(--bg-canvas)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono text-sm px-3.5 py-2.5 rounded-none outline-none focus:border-signal-cta transition-colors"
            />
          </div>

          <div className="pt-2">
            <DrillButton
              type="submit"
              variant="acid"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              [ ENTER TERMINAL ]
            </DrillButton>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-4 border-t border-[var(--border-grid)] text-center">
          <span className="font-mono text-xs text-[var(--text-muted)]">
            NEW TO UNCLE DRILL?{" "}
          </span>
          <Link
            href="/signup"
            className="font-mono text-xs text-signal-cta hover:underline font-bold"
          >
            REGISTER CADET ID &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-canvas)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">
          [ LOADING AUTHENTICATION TERMINAL... ]
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
