export type AreaId =
  | "user-device"
  | "identity-route"
  | "access-decision-enforcement"
  | "connection-method"
  | "reachable-resources"
  | "third-party-systems";

export type ComponentId = string;

export interface ArchitectureArea {
  id: AreaId;
  name: string;
  description: string;
  sideLane?: boolean;
}

export interface ArchitectureProperties {
  authenticatesUser?: boolean;
  authenticatesBeforeCommunication?: boolean;
  dependsOnExternalIdentityProvider?: boolean;
  usesOrganizationControlledIdentity?: boolean;
  usesHardwareBoundIdentity?: boolean;
  evaluatesAccessPolicy?: boolean;
  enforcesAccessPolicy?: boolean;
  grantsNetworkAccess?: boolean;
  grantsApplicationAccess?: boolean;
  createsVirtualNetworkInterface?: boolean;
  assignsProtectedNetworkAddress?: boolean;
  exposesNetworkInformation?: boolean;
  usesEncryptedRam?: boolean;
  persistsConnectionArtifacts?: boolean;
  supportsSessionTermination?: boolean;
  restrictsParallelApplications?: boolean;
  usesLeastPrivilege?: boolean;
  restrictsApplications?: boolean;
  validatesCertificate?: boolean;
  encryptsConnection?: boolean;
  monitorsSession?: boolean;
}

export interface BooleanConfigurationField {
  type: "boolean";
  label: string;
  defaultValue: boolean;
}

export interface SelectConfigurationField {
  type: "select";
  label: string;
  options: readonly string[];
  defaultValue: string;
}

export type ConfigurationField =
  BooleanConfigurationField | SelectConfigurationField;
export type ConfigurationSchema = Record<string, ConfigurationField>;
export type ConfigurationValue = string | boolean;
export type ComponentConfiguration = Record<string, ConfigurationValue>;

export interface ComponentDefinition {
  id: ComponentId;
  name: string;
  area: AreaId;
  description: string;
  icon: string;
  allowedAreaIds: AreaId[];
  configuration: ConfigurationSchema;
  architecturalProperties: ArchitectureProperties;
}

export interface Placement {
  componentId: ComponentId;
  areaId: AreaId;
}

export interface ComponentConnection {
  sourceComponentId: ComponentId;
  targetComponentId: ComponentId;
}

export interface ArchitectureState {
  placements: Placement[];
  connections: ComponentConnection[];
  configurations: Record<ComponentId, ComponentConfiguration>;
}

export type ArchitectureClassification =
  | "Traditional Access"
  | "Zero Trust"
  | "Saytec Post-Zero Trust"
  | "Hybrid Architecture"
  | "Incomplete Architecture"
  | "Broken or Unsafe Architecture";

export interface ArchitectureAnalysis {
  classification: ArchitectureClassification;
  score: number;
  accessPath: ComponentId[];
  effectiveProperties: ArchitectureProperties;
  authenticationModel: string;
  authenticationDependency: string;
  policyEvaluation: string;
  policyEnforcement: string;
  connectionType: string;
  clientNetworkVisibility: string;
  clientReachability: string;
  networkParticipation: string;
  openings: string[];
  recommendations: string[];
}
