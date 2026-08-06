import type{ArchitectureArea}from"./types.js";

export const accessDeviceArea:ArchitectureArea={
  id:"access-device",
  name:"Access Device"
};

export const trustIdentityServicesArea:ArchitectureArea={
  id:"trust-identity-services",
  name:"Trust and Identity Services"
};

export const secureSessionArea:ArchitectureArea={
  id:"secure-session",
  name:"Secure Session"
};

export const thirdPartyServicesArea:ArchitectureArea={
  id:"third-party-services",
  name:"Third-Party Services"
};

export const invisibleNetworkProtectionArea:ArchitectureArea={
  id:"invisible-network-protection",
  name:"Invisible Network Protection"
};

export const policyAccessControlArea:ArchitectureArea={
  id:"policy-access-control",
  name:"Policy and Access Control"
};

export const protectedApplicationArea:ArchitectureArea={
  id:"protected-application",
  name:"Protected Application"
};

export const architectureAreas:ArchitectureArea[]=[
  accessDeviceArea,
  trustIdentityServicesArea,
  secureSessionArea,
  thirdPartyServicesArea,
  invisibleNetworkProtectionArea,
  policyAccessControlArea,
  protectedApplicationArea
];
