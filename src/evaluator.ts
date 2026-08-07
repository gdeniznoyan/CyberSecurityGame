import { componentList, getComponentById } from "./components.js";
import { getPlacements } from "./state.js";
import type {
  AnalysisGroupId,
  AnalysisItem,
  AreaId,
  ComponentEvaluation,
  ComponentImportance,
} from "./types.js";

const scoreRules: Partial<Record<AreaId, { maximum: number; weight: number }>> =
  {
    "access-device": { maximum: 30, weight: 0.15 },
    "trust-identity-services": { maximum: 34, weight: 0.2 },
    "secure-session": { maximum: 37, weight: 0.2 },
    "invisible-network-protection": { maximum: 38, weight: 0.2 },
    "policy-access-control": { maximum: 37, weight: 0.15 },
  };

const postZeroTrustRequirements = [
  "password",
  "biometric-authentication",
  "hardware-security-token",
  "zero-footprint-client",
  "private-certificate-authority",
  "x509-certificate",
  "certificate-revocation-check",
  "otp",
  "mutual-transport-layer-security",
  "ram-tunneling",
  "aes-256-encryption",
  "perfect-forward-secrecy",
  "port-cloaking",
  "hidden-ip-path",
  "no-virtual-network-interface",
  "no-network-participation",
  "policy-engine",
  "least-privilege-access",
  "application-allow-list",
  "privileged-access-management",
] as const;

const postZeroTrustProtectedApplications = [
  "internal-web-application",
  "administrative-application",
  "partner-application",
  "virtual-machine",
] as const;

export function evaluateArchitecture(): ComponentEvaluation[] {
  return getPlacements().flatMap((placement) => {
    const component = getComponentById(placement.componentId);
    if (!component) return [];
    return [
      {
        componentId: component.id,
        areaId: placement.areaId,
        score: component.score,
      },
    ];
  });
}

const selectedGroups: Partial<Record<ComponentImportance, AnalysisGroupId>> = {
  critical: "selected-security-controls",
  important: "selected-security-controls",
  optional: "selected-security-controls",
};

const missingGroups: Partial<Record<ComponentImportance, AnalysisGroupId>> = {
  critical: "missing-critical-controls",
  important: "recommended-improvements",
};

export function evaluateSecurityAnalysis(): AnalysisItem[] {
  const selectedIds = new Set(
    getPlacements().map((placement) => placement.componentId),
  );
  const items: AnalysisItem[] = [];

  componentList
    .filter((component) => component.importance !== "special")
    .forEach((component) => {
      const selected = selectedIds.has(component.id);
      const group = selected
        ? selectedGroups[component.importance]
        : missingGroups[component.importance];
      const output = selected
        ? component.selectedOutput
        : component.missingOutput;
      if (group && output)
        items.push({ group, output, componentId: component.id });
    });

  addSpecialAreaAnalysis(
    "third-party-services",
    "third-party-dependencies",
    "No Third-Party Dependency: Critical security functions remain under organizational control without introducing additional external trust dependencies.",
    selectedIds,
    items,
  );
  addSpecialAreaAnalysis(
    "protected-application",
    "target-application",
    "No Target Selected: No protected application has been selected, so the architecture does not yet have a valid access destination.",
    selectedIds,
    items,
  );
  return items;
}

function addSpecialAreaAnalysis(
  areaId: AreaId,
  group: AnalysisGroupId,
  emptyOutput: string,
  selectedIds: Set<string>,
  items: AnalysisItem[],
): void {
  const areaComponents = componentList.filter(
    (component) =>
      component.area === areaId && component.importance === "special",
  );
  const selectedComponents = areaComponents.filter((component) =>
    selectedIds.has(component.id),
  );
  if (selectedComponents.length) {
    selectedComponents.forEach((component) =>
      items.push({
        group,
        output: component.selectedOutput,
        componentId: component.id,
      }),
    );
    return;
  }
  items.push({ group, output: emptyOutput });
}

export function getTotalScore(evaluations: ComponentEvaluation[]): number {
  const weightedSecurityScore = Object.entries(scoreRules).reduce(
    (total, [areaId, rule]) => {
      if (!rule) return total;
      const selectedScore = evaluations
        .filter((evaluation) => evaluation.areaId === areaId)
        .reduce((sum, evaluation) => sum + Math.max(0, evaluation.score), 0);
      const areaPercentage = Math.min(
        100,
        (selectedScore / rule.maximum) * 100,
      );
      return total + areaPercentage * rule.weight;
    },
    0,
  );

  const thirdPartyPenalties = evaluations
    .filter((evaluation) => evaluation.areaId === "third-party-services")
    .reduce(
      (total, evaluation) => total + Math.abs(Math.min(0, evaluation.score)),
      0,
    );
  const thirdPartyPercentage = Math.max(0, 100 - thirdPartyPenalties);
  const finalScore = Math.round(
    weightedSecurityScore + thirdPartyPercentage * 0.1,
  );
  return Math.max(0, Math.min(100, finalScore));
}

export function getSecurityResult(
  score: number,
  evaluations: ComponentEvaluation[],
): string {
  if (score >= 95 && meetsPostZeroTrustRequirements(evaluations))
    return "Post-Zero Trust";
  if (score >= 85) return "Very High Security";
  if (score >= 70) return "High Security";
  if (score >= 50) return "Medium Security";
  if (score >= 25) return "Low Security";
  return "Very Low Security";
}

function meetsPostZeroTrustRequirements(
  evaluations: ComponentEvaluation[],
): boolean {
  const selectedIds = new Set(
    evaluations.map((evaluation) => evaluation.componentId),
  );
  const thirdPartyIsEmpty = !evaluations.some(
    (evaluation) => evaluation.areaId === "third-party-services",
  );
  const hasProtectedApplication = postZeroTrustProtectedApplications.some(
    (id) => selectedIds.has(id),
  );
  return (
    thirdPartyIsEmpty &&
    hasProtectedApplication &&
    postZeroTrustRequirements.every((id) => selectedIds.has(id))
  );
}
