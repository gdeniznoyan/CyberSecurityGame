import { getComponentById } from "./components.js";
import { getConnections, getPlacements } from "./state.js";
import type {
  ArchitecturalPropertyId,
  ArchitectureClassification,
  ComponentConfiguration,
  EffectiveArchitecture,
  Placement,
} from "./types.js";

const propertyIds: ArchitecturalPropertyId[] = [
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
  "usesMutualTls",
  "encryptsTransport",
  "usesPerfectForwardSecrecy",
  "persistsConnectionArtifacts",
  "supportsSessionTermination",
  "restrictsParallelApplications",
  "usesLeastPrivilege",
  "restrictsApplications",
  "validatesCertificate",
];
const bool = (configuration: ComponentConfiguration, key: string): boolean =>
  configuration[key] === true;
const value = (configuration: ComponentConfiguration, key: string): string =>
  String(configuration[key] ?? "");

function findAccessPath(placements: Placement[]): string[] {
  const connections = getConnections();
  const areaById = new Map(
    placements.map((item) => [item.componentId, item.areaId]),
  );
  const starts = placements
    .filter((item) => item.areaId === "user-device")
    .map((item) => item.componentId);
  let best: string[] = [];
  const visit = (id: string, path: string[]): void => {
    if (path.includes(id)) return;
    const nextPath = [...path, id];
    if (
      areaById.get(id) === "reachable-resources" &&
      nextPath.length > best.length
    )
      best = nextPath;
    connections
      .filter((item) => item.sourceComponentId === id)
      .forEach((item) => visit(item.targetComponentId, nextPath));
  };
  starts.forEach((id) => visit(id, []));
  return best;
}

function deriveProperties(
  path: string[],
  placements: Placement[],
): Record<ArchitecturalPropertyId, boolean> {
  const properties = Object.fromEntries(
    propertyIds.map((id) => [id, false]),
  ) as Record<ArchitecturalPropertyId, boolean>;
  const pathPlacements = path
    .map((id) => placements.find((item) => item.componentId === id))
    .filter((item): item is Placement => Boolean(item));
  pathPlacements.forEach((placement) => {
    const component = getComponentById(placement.componentId);
    if (!component) return;
    Object.entries(component.architecturalProperties).forEach(
      ([id, enabled]) => {
        if (enabled) properties[id as ArchitecturalPropertyId] = true;
      },
    );
    const config = placement.configuration;
    if (
      bool(config, "hardwareId") &&
      (bool(config, "biometric") ||
        bool(config, "clientPin") ||
        bool(config, "certificatePinProtection"))
    ) {
      properties.authenticatesUser = true;
      properties.usesHardwareBoundIdentity = true;
    }
    if (
      value(config, "identityRole") === "Primary Authenticator" ||
      path.includes("external-authentication-service")
    ) {
      properties.authenticatesUser = true;
      properties.dependsOnExternalIdentityProvider = true;
    }
    if (
      bool(config, "completeValidation") &&
      bool(config, "certificateChecked") &&
      bool(config, "expirationChecked") &&
      bool(config, "revocationChecked")
    ) {
      properties.validatesCertificate = true;
    }
    if (value(config, "policyTiming") === "Policy Before Connection")
      properties.authenticatesBeforeCommunication = true;
    if (bool(config, "leastPrivilege") && !bool(config, "broadRolePermission"))
      properties.usesLeastPrivilege = true;
    if (bool(config, "sessionRevocation"))
      properties.supportsSessionTermination = true;
    if (
      bool(config, "applicationAuthorization") ||
      bool(config, "applicationAllowList")
    )
      properties.restrictsApplications = true;
    if (bool(config, "parallelCommunicationRestricted"))
      properties.restrictsParallelApplications = true;
    if (bool(config, "virtualNetworkInterface"))
      properties.createsVirtualNetworkInterface = true;
    if (bool(config, "protectedNetworkAddress"))
      properties.assignsProtectedNetworkAddress = true;
    if (
      value(config, "accessLevel") === "Network-Level Access" ||
      ["Full Network Access", "Restricted Subnet Access"].includes(
        value(config, "accessScope"),
      )
    ) {
      properties.grantsNetworkAccess = true;
    }
    if (
      value(config, "accessLevel") === "Application-Level Access" ||
      value(config, "accessScope") === "Application-Specific Route" ||
      bool(config, "applicationSpecific")
    ) {
      properties.grantsApplicationAccess = true;
    }
    if (bool(config, "encryptedRam") || bool(config, "encryptedRamTunneling"))
      properties.usesEncryptedRam = true;
    if (
      bool(config, "persistentArtifacts") ||
      bool(config, "persistentConfiguration") ||
      value(config, "footprint") === "Persistent Footprint"
    ) {
      properties.persistsConnectionArtifacts = true;
    }
  });
  const hasCertificate =
    path.includes("user-certificate") || path.includes("x509-certificate");
  properties.usesOrganizationControlledIdentity =
    properties.usesOrganizationControlledIdentity &&
    hasCertificate &&
    properties.validatesCertificate;
  properties.validatesCertificate =
    properties.validatesCertificate && hasCertificate;
  if (
    properties.createsVirtualNetworkInterface ||
    properties.assignsProtectedNetworkAddress ||
    properties.grantsNetworkAccess
  ) {
    properties.exposesNetworkInformation = true;
  }
  return properties;
}

function classify(
  properties: Record<ArchitecturalPropertyId, boolean>,
  path: string[],
  openings: string[],
): ArchitectureClassification {
  if (!path.length) return "Incomplete Architecture";
  const severe = openings.some((item) =>
    [
      "Policy Without Enforcement",
      "Authorization Too Late",
      "Certificate Misconfiguration",
    ].includes(item),
  );
  if (severe) return "Broken or Unsafe Architecture";
  const postZeroTrust =
    properties.authenticatesBeforeCommunication &&
    properties.usesHardwareBoundIdentity &&
    !properties.dependsOnExternalIdentityProvider &&
    properties.usesOrganizationControlledIdentity &&
    path.includes("saytrust-server") &&
    properties.evaluatesAccessPolicy &&
    properties.enforcesAccessPolicy &&
    properties.usesLeastPrivilege &&
    properties.restrictsApplications &&
    properties.supportsSessionTermination &&
    path.includes("ram-application-tunnel") &&
    properties.usesEncryptedRam &&
    !properties.createsVirtualNetworkInterface &&
    !properties.assignsProtectedNetworkAddress &&
    !properties.exposesNetworkInformation &&
    !properties.grantsNetworkAccess &&
    properties.grantsApplicationAccess &&
    !properties.persistsConnectionArtifacts;
  if (postZeroTrust) return "sayTRUST Post-Zero Trust";
  const zeroTrust =
    properties.authenticatesUser &&
    properties.authenticatesBeforeCommunication &&
    properties.evaluatesAccessPolicy &&
    properties.enforcesAccessPolicy &&
    properties.usesLeastPrivilege &&
    properties.restrictsApplications &&
    properties.supportsSessionTermination &&
    properties.grantsApplicationAccess &&
    !properties.grantsNetworkAccess;
  if (zeroTrust) return "Zero Trust";
  if (properties.grantsApplicationAccess && properties.grantsNetworkAccess)
    return "Hybrid Architecture";
  if (
    openings.length &&
    (properties.usesEncryptedRam ||
      properties.usesHardwareBoundIdentity ||
      properties.restrictsApplications)
  )
    return "Hybrid Architecture";
  if (properties.grantsNetworkAccess) return "Traditional Access";
  return "Broken or Unsafe Architecture";
}

function calculateScore(
  properties: Record<ArchitecturalPropertyId, boolean>,
  openings: string[],
): number {
  const hasConnection =
    properties.grantsApplicationAccess || properties.grantsNetworkAccess;
  const points: Array<[boolean, number]> = [
    // A complete source-to-resource path: 10 points.
    [hasConnection, 10],

    // Authentication strength: 20 points.
    [properties.authenticatesUser, 10],
    [properties.authenticatesBeforeCommunication, 5],
    [properties.usesHardwareBoundIdentity, 5],

    // Policy and access control: 20 points.
    [properties.evaluatesAccessPolicy, 4],
    [properties.enforcesAccessPolicy, 5],
    [properties.usesLeastPrivilege, 4],
    [properties.restrictsApplications, 4],
    [properties.supportsSessionTermination, 3],

    // Secure connection and session handling: 20 points.
    [properties.usesMutualTls, 4],
    [properties.encryptsTransport, 5],
    [properties.usesPerfectForwardSecrecy, 3],
    [properties.usesEncryptedRam, 5],
    [hasConnection && !properties.persistsConnectionArtifacts, 3],

    // Client and network isolation: 20 points.
    [properties.grantsApplicationAccess && !properties.grantsNetworkAccess, 6],
    [hasConnection && !properties.grantsNetworkAccess, 5],
    [hasConnection && !properties.createsVirtualNetworkInterface, 3],
    [hasConnection && !properties.assignsProtectedNetworkAddress, 2],
    [hasConnection && !properties.exposesNetworkInformation, 4],

    // Organization-controlled trust: 10 points.
    [properties.usesOrganizationControlledIdentity, 4],
    [properties.validatesCertificate, 3],
    [properties.authenticatesUser && !properties.dependsOnExternalIdentityProvider, 3],
  ];
  const openingPenalties: Readonly<Record<string, number>> = {
    "Policy Without Enforcement": 10,
    "Authorization Too Late": 10,
    "Certificate Misconfiguration": 8,
    "External Authentication Dependency": 8,
    "Wrong Connection Method": 8,
    "Application Restriction After Network Exposure": 6,
    "Strong Encryption With Excessive Access": 5,
    "Private CA Not Used": 5,
  };
  let score = points.reduce(
    (total, [condition, awardedPoints]) =>
      total + (condition ? awardedPoints : 0),
    0,
  );
  score -= openings.reduce(
    (total, opening) => total + (openingPenalties[opening] ?? 4),
    0,
  );
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function evaluateArchitecture(): EffectiveArchitecture {
  const placements = getPlacements();
  const accessPath = findAccessPath(placements);
  const properties = deriveProperties(accessPath, placements);
  const openings: string[] = [];
  const pathSet = new Set(accessPath);
  const config = (id: string): ComponentConfiguration =>
    placements.find((item) => item.componentId === id)?.configuration ?? {};
  if (properties.evaluatesAccessPolicy && !properties.enforcesAccessPolicy)
    openings.push("Policy Without Enforcement");
  if (
    (properties.encryptsTransport || properties.usesEncryptedRam) &&
    properties.grantsNetworkAccess
  )
    openings.push("Strong Encryption With Excessive Access");
  if (
    properties.usesEncryptedRam &&
    properties.dependsOnExternalIdentityProvider
  )
    openings.push("External Authentication Dependency");
  if (
    pathSet.has("private-ca") &&
    !properties.usesOrganizationControlledIdentity
  )
    openings.push("Private CA Not Used");
  if (properties.restrictsApplications && properties.grantsNetworkAccess)
    openings.push("Application Restriction After Network Exposure");
  if (
    properties.usesHardwareBoundIdentity &&
    properties.createsVirtualNetworkInterface
  )
    openings.push("Wrong Connection Method");
  if (
    ["Policy After Connection"].includes(
      value(config("saytrust-server"), "policyTiming"),
    ) ||
    ["Policy After Connection"].includes(
      value(config("policy-engine"), "policyTiming"),
    )
  )
    openings.push("Authorization Too Late");
  if (
    (pathSet.has("user-certificate") || pathSet.has("x509-certificate")) &&
    !properties.validatesCertificate
  )
    openings.push("Certificate Misconfiguration");
  const classification = classify(properties, accessPath, openings);
  const score = accessPath.length
    ? calculateScore(properties, openings)
    : 0;
  const names = [
    "User",
    ...accessPath.map((id) => getComponentById(id)?.name ?? id),
  ];
  return {
    properties,
    classification,
    score,
    accessPath: names,
    openings,
    recommendation: openings.length
      ? `Resolve ${openings[0]} and verify the complete access path again.`
      : classification === "Incomplete Architecture"
        ? "Connect components from the user and device stage to a protected resource."
        : classification === "Traditional Access"
          ? "The VPN path protects the session, but still grants network-level access. Use application-level access and policy enforcement when stronger isolation is required."
        : "The current path has no detected architectural conflict.",
    authenticationModel: properties.usesHardwareBoundIdentity
      ? "Hardware-bound identity is used on the active path."
      : properties.authenticatesUser
        ? "Identity is verified on the active path."
        : "No effective user authentication is present on the active path.",
    authenticationDependency: properties.dependsOnExternalIdentityProvider
      ? "Primary authentication depends on an external identity provider."
      : "Primary authentication is not externally dependent.",
    policyEvaluation: properties.evaluatesAccessPolicy
      ? "Access policy is evaluated on the active path."
      : "No effective policy evaluation occurs on the active path.",
    policyEnforcement: properties.enforcesAccessPolicy
      ? "The access decision is enforced before the resource."
      : "No effective enforcement point applies the access decision.",
    connectionType:
      properties.grantsNetworkAccess && properties.grantsApplicationAccess
        ? "Hybrid network and application access"
        : properties.grantsNetworkAccess
          ? "Network-level access"
          : properties.grantsApplicationAccess
            ? "Application-level access"
            : "No effective connection",
    clientNetworkVisibility: properties.exposesNetworkInformation
      ? "Protected network information may be visible to the client."
      : "Protected network details remain hidden from the client.",
    clientReachability: properties.grantsNetworkAccess
      ? "The client can reach network-level resources."
      : properties.grantsApplicationAccess
        ? "The client can reach only explicitly connected applications."
        : "No protected resource is reachable.",
    networkParticipation:
      properties.createsVirtualNetworkInterface ||
      properties.assignsProtectedNetworkAddress
        ? "The client participates in the protected network."
        : "The client does not join the protected network.",
  };
}
