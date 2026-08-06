import { getComponentById } from "./components.js";
import { getPlacements } from "./state.js";
const scoreRules = {
    "access-device": { maximum: 30, weight: 0.15 },
    "trust-identity-services": { maximum: 34, weight: 0.20 },
    "secure-session": { maximum: 37, weight: 0.20 },
    "invisible-network-protection": { maximum: 38, weight: 0.20 },
    "policy-access-control": { maximum: 37, weight: 0.15 }
};
const postZeroTrustRequirements = [
    "no-network-participation",
    "no-virtual-network-interface",
    "ram-tunneling",
    "policy-engine",
    "least-privilege-access"
];
export function evaluateArchitecture() {
    return getPlacements().flatMap(placement => {
        const component = getComponentById(placement.componentId);
        if (!component)
            return [];
        return [{
                componentId: component.id,
                areaId: placement.areaId,
                output: component.outputByArea[placement.areaId] ?? "",
                score: component.scoreByArea[placement.areaId] ?? 0
            }];
    });
}
export function getTotalScore(evaluations) {
    const weightedSecurityScore = Object.entries(scoreRules).reduce((total, [areaId, rule]) => {
        if (!rule)
            return total;
        const selectedScore = evaluations
            .filter(evaluation => evaluation.areaId === areaId)
            .reduce((sum, evaluation) => sum + Math.max(0, evaluation.score), 0);
        const areaPercentage = Math.min(100, (selectedScore / rule.maximum) * 100);
        return total + (areaPercentage * rule.weight);
    }, 0);
    const thirdPartyPenalties = evaluations
        .filter(evaluation => evaluation.areaId === "third-party-services")
        .reduce((total, evaluation) => total + Math.abs(Math.min(0, evaluation.score)), 0);
    const thirdPartyPercentage = Math.max(0, 100 - thirdPartyPenalties);
    const finalScore = Math.round(weightedSecurityScore + (thirdPartyPercentage * 0.10));
    return Math.max(0, Math.min(100, finalScore));
}
export function getSecurityResult(score, evaluations) {
    if (score >= 95 && meetsPostZeroTrustRequirements(evaluations))
        return "Post-Zero Trust";
    if (score >= 85)
        return "Very High Security";
    if (score >= 70)
        return "High Security";
    if (score >= 50)
        return "Medium Security";
    if (score >= 25)
        return "Low Security";
    return "Very Low Security";
}
function meetsPostZeroTrustRequirements(evaluations) {
    const selectedIds = new Set(evaluations.map(evaluation => evaluation.componentId));
    const thirdPartyIsEmpty = !evaluations.some(evaluation => evaluation.areaId === "third-party-services");
    return thirdPartyIsEmpty && postZeroTrustRequirements.every(id => selectedIds.has(id));
}
//# sourceMappingURL=evaluator.js.map