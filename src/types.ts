export type AreaId=
  |"access-device"
  |"trust-identity-services"
  |"secure-session"
  |"third-party-services"
  |"invisible-network-protection"
  |"policy-access-control"
  |"protected-application";

export type ComponentId=string;

export interface ArchitectureArea{
  id:AreaId;
  name:string;
}

export interface ComponentDefinition{
  id:ComponentId;
  name:string;
  toolboxArea:AreaId;
  icon:string;
  allowedAreaIds:AreaId[];
  outputByArea:Partial<Record<AreaId,string>>;
  scoreByArea:Partial<Record<AreaId,number>>;
}

export interface Placement{
  componentId:ComponentId;
  areaId:AreaId;
}

export interface ComponentEvaluation{
  componentId:ComponentId;
  areaId:AreaId;
  output:string;
  score:number;
}

export interface ArchitectureState{
  placements:Placement[];
}
