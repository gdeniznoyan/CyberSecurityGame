export type AreaId =
  | "access-device"
  | "trust-identity-services"
  | "secure-session"
  | "third-party-services"
  | "invisible-network-protection"
  | "policy-access-control"
  | "protected-application";

export type ComponentId = string;
export type ComponentImportance =
  "critical" | "important" | "optional" | "special";

export interface ArchitectureArea {
  id: AreaId;
  name: string;
}

export interface ComponentDefinition {
  id: ComponentId;
  name: string;
  area: AreaId;
  importance: ComponentImportance;
  selectedOutput: string;
  missingOutput: string;
  score: number;
  icon: string;
  allowedAreaIds: AreaId[];
}

export interface Placement {
  componentId: ComponentId;
  areaId: AreaId;
}

export interface ComponentEvaluation {
  componentId: ComponentId;
  areaId: AreaId;
  score: number;
}

export type AnalysisGroupId =
  | "selected-security-controls"
  | "missing-critical-controls"
  | "recommended-improvements"
  | "third-party-dependencies"
  | "target-application";

export interface AnalysisItem {
  group: AnalysisGroupId;
  output: string;
  componentId?: ComponentId;
}

export interface ArchitectureState {
  placements: Placement[];
}
