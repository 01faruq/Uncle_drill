"use client";

/**
 * @purpose Mint-Grade Sovereign Certificate component rendered in Off-Grid Bone Paper atmosphere.
 * @security Cryptographic SHA-256 hash representation; safe share links without credential leakage.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 4: The Mint-Grade Sovereign Certificate)
 */
import * as React from "react";
import Link from "next/link";
import { DrillButton } from "@/components/ui/industrial/DrillButton";

export interface CertificateData {
  certId: string;
  candidateName: string;
  candidateLocation: string;
  milestoneTitle: string;
  phaseTitle: string;
  sha256Hash: string;
  issueDate: string;
  scores: {
    explain: number;
    produce: number;
    debug: number;
    stressTest: number;
    weightedTotal: number;
  };
  cheatStrikes: number;
  consistencyMultiplier: number;
  sponsorName?: string;
}

const DEFAULT_DEMO_CERT: CertificateData = {
  certId: "UD-2026-PH1-0842",
  candidateName: "IBRAHIM FARUQ",
  candidateLocation: "KWARA // NIGERIA",
  milestoneTitle: "PHASE 01: SYSTEMS FOUNDATIONS // LINUX, GIT & PYTHON",
  phaseTitle: "PHASE 01 CHECKPOINT VERIFIED",
  sha256Hash: "9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08",
  issueDate: "2026-10-23",
  scores: {
    explain: 92,
    produce: 95,
    debug: 88,
    stressTest: 85,
    weightedTotal: 90.8,
  },
  cheatStrikes: 0,
  consistencyMultiplier: 1.8,
  sponsorName: "LEARN2EARN // COHORT 01",
};

export function SovereignCertificate({ data = DEFAULT_DEMO_CERT }: { data?: CertificateData }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const text = encodeURIComponent(
      `Uncle Drill audited my Linux and systems fundamentals in a locked sandbox with 00 Cheat Strikes.\n\nVerified Sovereign Certificate (${data.certId}):`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top share control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs border border-border-grid bg-surface p-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-text-secondary hover:text-signal-cta font-bold">
            &larr; WORKSPACE
          </Link>
          <span className="text-border-grid">|</span>
          <span className="text-signal-pass font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-signal-pass inline-block" />
            CRYPTOGRAPHIC PROOF OF WORK VERIFIED
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DrillButton variant="terminal" size="sm" onClick={handleCopyLink}>
            {copied ? "[ LINK COPIED ]" : "[ COPY VERIFY LINK ]"}
          </DrillButton>
          <DrillButton variant="acid" size="sm" onClick={handleShareX}>
            [ SHARE PROOF ON X ]
          </DrillButton>
        </div>
      </div>

      {/* THE PHYSICAL BONE PAPER CERTIFICATE */}
      <div
        data-theme="paper"
        className="bg-[#EAE6DF] text-[#0A0A0B] border-2 border-[#0A0A0B] p-6 sm:p-10 font-mono select-text relative shadow-none"
      >
        {/* Certificate Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#BDB7AD] pb-6">
          <div>
            <div className="text-[11px] font-bold tracking-hud uppercase text-[#71717A]">
              SOVEREIGN ENGINEERING CREDENTIAL // ID: {data.certId}
            </div>
            <div className="font-display text-2xl sm:text-3xl text-[#0A0A0B] uppercase mt-1">
              UNCLE DRILL MASTERY AUDIT
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-block border border-[#0A0A0B] px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#E2DDD4]">
              PROCTORED NO-AI SANDBOX
            </span>
            <div className="text-[10px] text-[#71717A] mt-1">ISSUED: {data.issueDate}</div>
          </div>
        </div>

        {/* Candidate & Curriculum Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-[#BDB7AD]">
          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-[10px] tracking-hud uppercase text-[#71717A] block">
                ENGINEER CANDIDATE
              </span>
              <div className="font-display text-3xl sm:text-4xl text-[#0A0A0B] mt-1">
                {data.candidateName}
              </div>
              <div className="text-xs font-bold text-[#71717A] tracking-wider mt-0.5">
                {data.candidateLocation}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] tracking-hud uppercase text-[#71717A] block">
                VERIFIED CURRICULUM
              </span>
              <div className="text-sm font-bold text-[#0A0A0B] mt-0.5">
                {data.milestoneTitle}
              </div>
              <p className="font-sans text-xs text-[#3F3F46] mt-1 leading-relaxed max-w-xl">
                This document certifies that the candidate has successfully defended all foundational and stress-test engineering rubrics inside an isolated Linux sandbox with <strong>zero external AI assistance</strong>.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 border-l border-[#BDB7AD] pl-0 md:pl-6 space-y-4">
            <div className="border border-[#BDB7AD] p-3 bg-[#E2DDD4]">
              <span className="text-[10px] tracking-hud uppercase text-[#71717A] block">
                WEIGHTED AUDIT SCORE
              </span>
              <div className="font-display text-4xl text-[#0A0A0B]">
                {data.scores.weightedTotal}%
              </div>
              <div className="text-[10px] text-[#059669] font-bold mt-1">
                ✓ 100% NON-NEGOTIABLES PASSED
              </div>
            </div>

            <div className="border border-[#BDB7AD] p-3 bg-[#E2DDD4]">
              <span className="text-[10px] tracking-hud uppercase text-[#71717A] block">
                INTEGRITY TELEMETRY
              </span>
              <div className="text-xs font-bold text-[#0A0A0B] mt-1">
                00 CHEAT STRIKES DETECTED
              </div>
              <div className="text-[10px] text-[#71717A]">
                {data.consistencyMultiplier}x GRIT XP MULTIPLIER
              </div>
            </div>
          </div>
        </div>

        {/* 4-Pillar Scorecard Grid */}
        <div className="py-6 border-b border-[#BDB7AD]">
          <span className="text-[10px] tracking-hud uppercase text-[#71717A] block mb-3 font-bold">
            VERIFIED 4-PILLAR BREAKDOWN
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="border border-[#BDB7AD] p-3 bg-[#E2DDD4]">
              <span className="text-[10px] text-[#71717A] block">PILLAR 1: EXPLAIN (25%)</span>
              <span className="font-display text-2xl text-[#0A0A0B]">{data.scores.explain}%</span>
              <span className="text-[10px] text-[#71717A] block mt-0.5">First-Principles Defense</span>
            </div>
            <div className="border border-[#BDB7AD] p-3 bg-[#E2DDD4]">
              <span className="text-[10px] text-[#71717A] block">PILLAR 2: PRODUCE (30%)</span>
              <span className="font-display text-2xl text-[#0A0A0B]">{data.scores.produce}%</span>
              <span className="text-[10px] text-[#71717A] block mt-0.5">Live Code from Scratch</span>
            </div>
            <div className="border border-[#BDB7AD] p-3 bg-[#E2DDD4]">
              <span className="text-[10px] text-[#71717A] block">PILLAR 3: DEBUG (25%)</span>
              <span className="font-display text-2xl text-[#0A0A0B]">{data.scores.debug}%</span>
              <span className="text-[10px] text-[#71717A] block mt-0.5">Production Bug Hunt</span>
            </div>
            <div className="border border-[#BDB7AD] p-3 bg-[#E2DDD4]">
              <span className="text-[10px] text-[#71717A] block">PILLAR 4: STRESS (20%)</span>
              <span className="font-display text-2xl text-[#0A0A0B]">{data.scores.stressTest}%</span>
              <span className="text-[10px] text-[#71717A] block mt-0.5">50GB Scale Edge Cases</span>
            </div>
          </div>
        </div>

        {/* Triple Authority Signatures & Cryptographic Barcode */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="border-t border-[#0A0A0B] pt-2">
                <span className="text-[10px] text-[#71717A] block uppercase">FOUNDER &amp; ARCHITECT</span>
                <span className="font-bold font-display text-sm">Faruq O.</span>
                <span className="text-[10px] text-[#71717A] block">Uncle Drill Core</span>
              </div>
              <div className="border-t border-[#0A0A0B] pt-2">
                <span className="text-[10px] text-[#71717A] block uppercase">AI AUDITOR SEAL</span>
                <span className="font-bold font-display text-sm">Uncle Drill Brain</span>
                <span className="text-[10px] text-[#71717A] block">SHA-256 Validated</span>
              </div>
              <div className="border-t border-[#0A0A0B] pt-2">
                <span className="text-[10px] text-[#71717A] block uppercase">CO-SIGNING BODY</span>
                <span className="font-bold text-xs">{data.sponsorName || "Direct Candidate"}</span>
                <span className="text-[10px] text-[#71717A] block">Cohort Certified</span>
              </div>
            </div>

            <div>
              <div
                className="w-full h-12 mt-2 opacity-90"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #0A0A0B 0px, #0A0A0B 3px, transparent 3px, transparent 6px, #0A0A0B 6px, #0A0A0B 7px, transparent 7px, transparent 11px)",
                }}
              />
              <div className="text-[9px] text-[#71717A] font-mono mt-1 break-all">
                SHA256: {data.sha256Hash}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 text-right space-y-1">
            <div className="inline-block border border-[#0A0A0B] p-3 text-center bg-[#E2DDD4]">
              <span className="font-display text-xs text-[#0A0A0B] block">OFFICIAL AUDIT EMBOSS</span>
              <span className="text-[10px] text-[#71717A] block uppercase mt-0.5">AUTHENTICATED TERMINAL</span>
              <span className="font-bold text-xs text-[#059669] block mt-1">MINT-GRADE VALID</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
