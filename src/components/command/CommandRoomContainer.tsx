"use client";

/**
 * @purpose Main Interactive Container for the Founder Command Room (/command).
 *   Binds tab navigation directly to URL search params (?tab=overview|users|codes|cms|ai)
 *   via nuqs, ensuring deterministic Back-button and reload navigation.
 * @security Only mounted within server-guarded /command route for SUPER_ADMIN role.
 * @reference docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md (Section 5)
 */
import * as React from "react";
import { useQueryState } from "nuqs";
import { CommandNavTabs, tabParser, type CommandTab } from "./CommandNavTabs";
import { OverviewTab } from "./OverviewTab";
import { UsersTab } from "./UsersTab";
import { CodesTab } from "./CodesTab";
import { CmsTab } from "./CmsTab";
import { AiTab } from "./AiTab";
import {
  type PlatformOverviewMetrics,
  type ApologyAppealDetail,
  type CadetDetail,
  type PricingConfig,
  type AccessCodeDetail,
  type LandingCopyInput,
  type AiRouterConfig,
} from "@/modules/admin/command-types";

interface CommandRoomContainerProps {
  initialTab?: string;
  metrics: PlatformOverviewMetrics;
  appeals: ApologyAppealDetail[];
  cadets: CadetDetail[];
  pricing: PricingConfig;
  codes: AccessCodeDetail[];
  milestones: any[];
  resources: any[];
  landingCopy: LandingCopyInput;
  aiConfig: AiRouterConfig;
}

export function CommandRoomContainer({
  metrics,
  appeals,
  cadets,
  pricing,
  codes,
  milestones,
  resources,
  landingCopy,
  aiConfig,
}: CommandRoomContainerProps) {
  const [tab, setTab] = useQueryState("tab", tabParser);

  return (
    <div>
      <CommandNavTabs activeTab={tab as CommandTab} onTabChange={(t) => setTab(t)} />

      {tab === "overview" && <OverviewTab metrics={metrics} appeals={appeals} />}
      {tab === "users" && <UsersTab initialCadets={cadets} />}
      {tab === "codes" && <CodesTab initialPricing={pricing} initialCodes={codes} />}
      {tab === "cms" && (
        <CmsTab
          initialMilestones={milestones}
          initialResources={resources}
          initialLandingCopy={landingCopy}
        />
      )}
      {tab === "ai" && <AiTab initialConfig={aiConfig} />}
    </div>
  );
}
