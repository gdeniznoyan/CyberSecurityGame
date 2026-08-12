export type AreaId =
  | "user-device"
  | "identity-route"
  | "access-enforcement"
  | "connection-method"
  | "reachable-resources"
  | "third-party-systems";

export type ComponentId = string;
export type ConfigurationValue = boolean | string;
export type ComponentConfiguration = Record<string, ConfigurationValue>;

export type ArchitecturalPropertyId =
  | "authenticatesUser"
  | "authenticatesBeforeCommunication"
  | "dependsOnExternalIdentityProvider"
  | "usesOrganizationControlledIdentity"
  | "usesHardwareBoundIdentity"
  | "evaluatesAccessPolicy"
  | "enforcesAccessPolicy"
  | "grantsNetworkAccess"
  | "grantsApplicationAccess"
  | "createsVirtualNetworkInterface"
  | "assignsProtectedNetworkAddress"
  | "exposesNetworkInformation"
  | "usesEncryptedRam"
  | "persistsConnectionArtifacts"
  | "supportsSessionTermination"
  | "restrictsParallelApplications"
  | "usesLeastPrivilege"
  | "restrictsApplications"
  | "validatesCertificate";

export type ArchitecturalProperties = Partial<
  Record<ArchitecturalPropertyId, boolean>
>;

export interface ArchitectureArea {
  id: AreaId;
  name: string;
  description: string;
}

export interface BooleanConfigurationDefinition {
  id: string;
  label: string;
  type: "boolean";
  defaultValue: boolean;
}

export interface SelectConfigurationDefinition {
  id: string;
  label: string;
  type: "select";
  defaultValue: string;
  options: readonly string[];
}

export type ConfigurationDefinition =
  BooleanConfigurationDefinition | SelectConfigurationDefinition;

export interface ComponentDefinition {
  id: ComponentId;
  name: string;
  area: AreaId;
  description: string;
  icon: string;
  isSaytecComponent: boolean;
  allowedAreaIds: AreaId[];
  configuration: ConfigurationDefinition[];
  architecturalProperties: ArchitecturalProperties;
}

export interface Placement {
  componentId: ComponentId;
  areaId: AreaId;
  configuration: ComponentConfiguration;
}

export interface ArchitectureConnection {
  sourceComponentId: ComponentId;
  targetComponentId: ComponentId;
}

export interface ArchitectureState {
  placements: Placement[];
  connections: ArchitectureConnection[];
}

export type ArchitectureClassification =
  | "Traditional Access"
  | "Zero Trust"
  | "Saytec Post-Zero Trust"
  | "Hybrid Architecture"
  | "Incomplete Architecture"
  | "Broken or Unsafe Architecture";

export interface EffectiveArchitecture {
  properties: Record<ArchitecturalPropertyId, boolean>;
  classification: ArchitectureClassification;
  score: number;
  accessPath: string[];
  openings: string[];
  recommendation: string;
  authenticationModel: string;
  authenticationDependency: string;
  policyEvaluation: string;
  policyEnforcement: string;
  connectionType: string;
  clientNetworkVisibility: string;
  clientReachability: string;
  networkParticipation: string;
}
