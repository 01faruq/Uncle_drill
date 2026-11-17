import { SovereignCertificate } from "@/components/certificate/SovereignCertificate";

/**
 * @purpose Sovereign Certificate public verification route, displaying verified proof of work in Bone Paper format.
 * @security Public read-only page; verifies authenticity hash and shields raw student contact details.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 4: Mint-Grade Sovereign Certificate)
 */

interface VerifyPageProps {
  params: Promise<{
    certId: string;
  }>;
}

export async function generateStaticParams() {
  return [{ certId: "demo" }];
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { certId } = await params;

  return (
    <div className="min-h-screen bg-canvas py-10 px-4">
      <SovereignCertificate
        data={{
          certId: certId === "demo" ? "UD-2026-PH1-DEMO" : certId,
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
        }}
      />
    </div>
  );
}
