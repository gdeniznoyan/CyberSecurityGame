import { getComponentById } from "./components.js";
import {
  getComponentConfiguration,
  getConnections,
  getPlacements,
} from "./state.js";
import type {
  ArchitectureAnalysis,
  ArchitectureClassification,
  ArchitectureProperties,
  ComponentId,
} from "./types.js";

const propertyKeys: (keyof ArchitectureProperties)[] = [
  "authenticatesUser",
  "authenticatesBeforeCommunication",
  "dependsOnExternalIdentityProvider",
  "usesOrganizationControlledIdentity",
  "usesHardwareBoundIdentity",
  "evaluatesAccessPolicy",
  "enforcesAccessPolicy",
  "grantsNetworkAccess",
  "grantsApplicationAccess",
  "createsVirtualNetworkInterface",
  "assignsProtectedNetworkAddress",
  "exposesNetworkInformation",
  "usesEncryptedRam",
  "persistsConnectionArtifacts",
  "supportsSessionTermination",
  "restrictsParallelApplications",
  "usesLeastPrivilege",
  "restrictsApplications",
  "validatesCertificate",
  "encryptsConnection",
  "monitorsSession",
];

const authenticationIds = new Set([
  "saytec-hardware-security-token",
  "biometric-verification",
  "client-pin",
  "user-certificate",
  "x509-certificate",
  "otp",
  "mutual-tls",
  "external-identity-provider",
  "external-sso",
]);
const resourceIds = new Set([
  "corporate-network",
  "restricted-subnet",
  "internal-web-application",
  "administrative-application",
  "partner-application",
  "virtual-machine",
  "multiple-internal-applications",
  "external-cloud-service",
]);

function findAccessPath(): ComponentId[] {
  const placements = getPlacements();
  const placedIds = new Set(placements.map((item) => item.componentId));
  const starts = placements
    .filter(
      (item) =>
        item.areaId === "user-device" &&
        (item.componentId === "user" || item.componentId === "client-device"),
    )
    .map((item) => item.componentId);
  const adjacency = new Map<ComponentId, ComponentId[]>();
  getConnections().forEach(({ sourceComponentId, targetComponentId }) => {
    if (!placedIds.has(sourceComponentId) || !placedIds.has(targetComponentId))
      return;
    adjacency.set(sourceComponentId, [
      ...(adjacency.get(sourceComponentId) ?? []),
      targetComponentId,
    ]);
  });
  const queue = starts.map((id) => [id]);
  const visited = new Set<ComponentId>();
  while (queue.length) {
    const path = queue.shift();
    if (!path) break;
    const current = path[path.length - 1];
    if (resourceIds.has(current) && path.length > 1) return path;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const next of adjacency.get(current) ?? [])
      if (!path.includes(next)) queue.push([...path, next]);
  }
  return [];
}

function mergePathProperties(path: ComponentId[]): ArchitectureProperties {
  const effective: ArchitectureProperties = {};
  path.forEach((id) => {
    const definition = getComponentById(id);
    if (!definition) return;
    propertyKeys.forEach((key) => {
      const value = definition.architecturalProperties[key];
      if (value === true) effective[key] = true;
      if (value === false && effective[key] !== true) effective[key] = false;
    });
  });
  applyConfiguration(path, effective);
  return effective;
}

function applyConfiguration(
  path: ComponentId[],
  effective: ArchitectureProperties,
): void {
  const ids = new Set(path);
  const config = (id: string) => getComponentConfiguration(id);
  const externalIdentity = ["external-identity-provider", "external-sso"].find(
    (id) => ids.has(id),
  );
  if (externalIdentity) {
    const role = config(externalIdentity).identityRole;
    if (role === "Primary Authenticator") {
      effective.authenticatesUser = true;
      effective.dependsOnExternalIdentityProvider = true;
    }
  }
  if (ids.has("saytec-server")) {
    const values = config("saytec-server");
    effective.authenticatesBeforeCommunication =
      values.policyTiming === "Before Connection";
    effective.usesLeastPrivilege =
      values.leastPrivilegeEnabled === true &&
      values.broadRolePermission !== true;
    effective.supportsSessionTermination =
      values.sessionRevocationEnabled === true;
  } else if (ids.has("policy-engine")) {
    effective.authenticatesBeforeCommunication =
      config("policy-engine").policyTiming === "Before Connection";
  }
  if (ids.has("vpn-gateway")) {
    const scope = config("vpn-gateway").accessScope;
    effective.grantsNetworkAccess = scope !== "Application-Specific Route";
    effective.grantsApplicationAccess = scope === "Application-Specific Route";
    effective.exposesNetworkInformation =
      scope !== "Application-Specific Route";
  }
  if (ids.has("ram-application-tunnel")) {
    const values = config("ram-application-tunnel");
    effective.usesEncryptedRam =
      ids.has("encrypted-ram") && values.encryptedRamTunnelingEnabled === true;
    effective.createsVirtualNetworkInterface =
      values.virtualNetworkInterfaceEnabled === true ||
      ids.has("virtual-network-interface");
    effective.assignsProtectedNetworkAddress =
      effective.createsVirtualNetworkInterface;
    effective.restrictsApplications =
      values.applicationAllowListEnabled === true;
    effective.restrictsParallelApplications =
      values.parallelExternalCommunicationRestricted === true;
    effective.persistsConnectionArtifacts =
      values.persistentConfigurationEnabled === true;
  }
  if (ids.has("zero-footprint-client"))
    effective.persistsConnectionArtifacts =
      config("zero-footprint-client").persistentConfigurationEnabled === true;
  if (ids.has("certificate-validation")) {
    const values = config("certificate-validation");
    effective.validatesCertificate =
      values.certificateChecked === true &&
      values.expirationChecked === true &&
      values.revocationChecked === true &&
      values.completeValidation === true;
  }
  const certificateInPath =
    ids.has("user-certificate") || ids.has("x509-certificate");
  effective.usesOrganizationControlledIdentity =
    ids.has("private-ca") &&
    certificateInPath &&
    effective.validatesCertificate === true;
  const hasEvaluator = ids.has("saytec-server") || ids.has("policy-engine");
  const hasEnforcer = ids.has("saytec-server") || ids.has("policy-enforcement");
  effective.evaluatesAccessPolicy = hasEvaluator;
  effective.enforcesAccessPolicy = hasEvaluator && hasEnforcer;
}

function buildOpenings(
  path: ComponentId[],
  properties: ArchitectureProperties,
): string[] {
  const ids = new Set(path);
  const openings: string[] = [];
  if (properties.encryptsConnection && properties.grantsNetworkAccess)
    openings.push(
      "Strong Encryption With Excessive Access: The traffic is encrypted, but the client still receives network-level reachability.",
    );
  if (properties.evaluatesAccessPolicy && !properties.enforcesAccessPolicy)
    openings.push(
      "Policy Without Enforcement: A policy decision is produced, but no connected component enforces it.",
    );
  if (
    properties.usesEncryptedRam &&
    properties.dependsOnExternalIdentityProvider
  )
    openings.push(
      "External Authentication Dependency: The RAM application path still relies on an external provider as its root of trust.",
    );
  if (ids.has("private-ca") && !properties.usesOrganizationControlledIdentity)
    openings.push(
      "Private CA Not Used: The private authority is present, but a completely validated certificate chain does not use it on this access path.",
    );
  if (properties.restrictsApplications && properties.grantsNetworkAccess)
    openings.push(
      "Application Restriction After Network Exposure: Application restrictions do not remove the broader network visibility already granted.",
    );
  if (
    properties.usesHardwareBoundIdentity &&
    properties.createsVirtualNetworkInterface
  )
    openings.push(
      "Wrong Connection Method: Strong Saytec identity is used, but a protected-network virtual interface is still created.",
    );
  if (
    properties.encryptsConnection &&
    properties.authenticatesBeforeCommunication === false
  )
    openings.push(
      "Authorization Too Late: The secure communication path is created before policy authorization is completed.",
    );
  if (
    (ids.has("user-certificate") || ids.has("x509-certificate")) &&
    !properties.validatesCertificate
  )
    openings.push(
      "Certificate Misconfiguration: Certificate expiration and revocation are not completely validated.",
    );
  return openings;
}

function isPostZeroTrust(properties: ArchitectureProperties): boolean {
  return (
    properties.authenticatesUser === true &&
    properties.authenticatesBeforeCommunication === true &&
    properties.usesHardwareBoundIdentity === true &&
    properties.dependsOnExternalIdentityProvider !== true &&
    properties.usesOrganizationControlledIdentity === true &&
    properties.evaluatesAccessPolicy === true &&
    properties.enforcesAccessPolicy === true &&
    properties.usesLeastPrivilege === true &&
    properties.restrictsApplications === true &&
    properties.supportsSessionTermination === true &&
    properties.grantsApplicationAccess === true &&
    properties.usesEncryptedRam === true &&
    properties.createsVirtualNetworkInterface !== true &&
    properties.assignsProtectedNetworkAddress !== true &&
    properties.grantsNetworkAccess !== true &&
    properties.exposesNetworkInformation !== true
  );
}

function isZeroTrust(properties: ArchitectureProperties): boolean {
  return (
    properties.authenticatesUser === true &&
    properties.authenticatesBeforeCommunication === true &&
    properties.evaluatesAccessPolicy === true &&
    properties.enforcesAccessPolicy === true &&
    properties.usesLeastPrivilege === true &&
    properties.restrictsApplications === true &&
    (properties.supportsSessionTermination === true ||
      properties.monitorsSession === true) &&
    properties.grantsNetworkAccess !== true
  );
}

function classify(
  path: ComponentId[],
  properties: ArchitectureProperties,
  openings: string[],
): ArchitectureClassification {
  if (!path.length) return "Incomplete Architecture";
  if (
    openings.some(
      (item) =>
        item.startsWith("Policy Without Enforcement") ||
        item.startsWith("Authorization Too Late") ||
        item.startsWith("Certificate Misconfiguration"),
    )
  )
    return "Broken or Unsafe Architecture";
  if (openings.length) return "Hybrid Architecture";
  if (isPostZeroTrust(properties)) return "Saytec Post-Zero Trust";
  if (properties.grantsNetworkAccess && properties.grantsApplicationAccess)
    return "Hybrid Architecture";
  if (isZeroTrust(properties)) return "Zero Trust";
  if (properties.grantsNetworkAccess) return "Traditional Access";
  if (properties.grantsApplicationAccess)
    return openings.length
      ? "Broken or Unsafe Architecture"
      : "Hybrid Architecture";
  return "Incomplete Architecture";
}

function calculateScore(
  properties: ArchitectureProperties,
  openings: string[],
): number {
  const positive: [keyof ArchitectureProperties, number][] = [
    ["authenticatesUser", 10],
    ["authenticatesBeforeCommunication", 8],
    ["usesHardwareBoundIdentity", 7],
    ["usesOrganizationControlledIdentity", 7],
    ["evaluatesAccessPolicy", 9],
    ["enforcesAccessPolicy", 11],
    ["usesLeastPrivilege", 9],
    ["restrictsApplications", 8],
    ["supportsSessionTermination", 6],
    ["encryptsConnection", 8],
    ["usesEncryptedRam", 8],
    ["restrictsParallelApplications", 4],
    ["validatesCertificate", 5],
  ];
  let score = positive.reduce(
    (total, [key, value]) => total + (properties[key] === true ? value : 0),
    0,
  );
  if (properties.grantsNetworkAccess) score -= 12;
  if (properties.createsVirtualNetworkInterface) score -= 8;
  if (properties.exposesNetworkInformation) score -= 7;
  if (properties.dependsOnExternalIdentityProvider) score -= 5;
  if (properties.persistsConnectionArtifacts) score -= 5;
  score -= openings.length * 6;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function recommendations(
  properties: ArchitectureProperties,
  openings: string[],
): string[] {
  const result: string[] = [];
  if (!properties.authenticatesBeforeCommunication)
    result.push(
      "Move identity and policy authorization before the protected connection is created.",
    );
  if (!properties.enforcesAccessPolicy)
    result.push(
      "Connect the policy evaluator to an enforcement component on the active path.",
    );
  if (properties.grantsNetworkAccess)
    result.push(
      "Replace broad network reachability with an explicitly authorized application connection.",
    );
  if (!properties.usesLeastPrivilege)
    result.push("Enable least privilege on the access decision path.");
  if (!properties.validatesCertificate)
    result.push("Complete certificate, expiration and revocation validation.");
  if (properties.createsVirtualNetworkInterface)
    result.push(
      "Remove the protected-network virtual interface for application-isolated access.",
    );
  if (!openings.length && !result.length)
    result.push(
      "No immediate architecture change is required; continue validating runtime policy and session telemetry.",
    );
  return result;
}

export function evaluateArchitecture(): ArchitectureAnalysis {
  const accessPath = findAccessPath();
  const effectiveProperties = mergePathProperties(accessPath);
  const openings = buildOpenings(accessPath, effectiveProperties);
  const classification = classify(accessPath, effectiveProperties, openings);
  const names = accessPath.map((id) => getComponentById(id)?.name ?? id);
  return {
    classification,
    score: calculateScore(effectiveProperties, openings),
    accessPath,
    effectiveProperties,
    authenticationModel: effectiveProperties.authenticatesUser
      ? `${effectiveProperties.usesHardwareBoundIdentity ? "Hardware-bound" : "Software or provider-based"} identity is active on the access path${effectiveProperties.authenticatesBeforeCommunication ? " before communication begins." : ", but authorization is not completed before communication."}`
      : "No effective user authentication was found on the connected access path.",
    authenticationDependency:
      effectiveProperties.dependsOnExternalIdentityProvider
        ? "The primary access decision depends on an external identity provider."
        : "The active path does not use an external provider as the primary root of access trust.",
    policyEvaluation: effectiveProperties.evaluatesAccessPolicy
      ? "A connected policy component evaluates the request."
      : "No connected component evaluates access policy.",
    policyEnforcement: effectiveProperties.enforcesAccessPolicy
      ? "The policy decision is enforced on the active path."
      : "No effective enforcement of a policy decision was found.",
    connectionType:
      effectiveProperties.grantsNetworkAccess &&
      effectiveProperties.grantsApplicationAccess
        ? "The path combines application and network-level connections."
        : effectiveProperties.grantsNetworkAccess
          ? "The path grants network-level access."
          : effectiveProperties.grantsApplicationAccess
            ? "The path grants application-level access."
            : "No effective connection method reaches a protected resource.",
    clientNetworkVisibility: effectiveProperties.exposesNetworkInformation
      ? "Protected network addresses or routes can become visible to the client."
      : "The active path does not expose protected-network routing information to the client.",
    clientReachability: names.length
      ? `The connected path reaches ${names[names.length - 1]}.`
      : "No protected resource is reachable through a complete connected path.",
    networkParticipation:
      effectiveProperties.createsVirtualNetworkInterface ||
      effectiveProperties.assignsProtectedNetworkAddress ||
      effectiveProperties.grantsNetworkAccess
        ? "The client participates in or receives reachability into the protected network."
        : "The client does not join the protected network and receives only path-specific reachability.",
    openings,
    recommendations: recommendations(effectiveProperties, openings),
  };
}
