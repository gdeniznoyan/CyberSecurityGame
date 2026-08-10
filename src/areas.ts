import type { ArchitectureArea } from "./types.js";

export const userDeviceArea: ArchitectureArea = {
  id: "user-device",
  name: "User and Device",
  description: "The user, endpoint and directly controlled identity factors.",
};

export const identityRouteArea: ArchitectureArea = {
  id: "identity-route",
  name: "Identity Route",
  description: "The trust chain used to establish identity.",
};

export const accessDecisionArea: ArchitectureArea = {
  id: "access-decision-enforcement",
  name: "Access Decision and Enforcement",
  description: "Policy evaluation, authorization and enforcement.",
};

export const connectionMethodArea: ArchitectureArea = {
  id: "connection-method",
  name: "Connection Method",
  description: "How the protected communication path is created.",
};

export const reachableResourcesArea: ArchitectureArea = {
  id: "reachable-resources",
  name: "Reachable Resources",
  description: "The resources the client can actually reach.",
};

export const thirdPartySystemsArea: ArchitectureArea = {
  id: "third-party-systems",
  name: "Third-Party Systems",
  description: "External systems connected to the function they influence.",
  sideLane: true,
};

export const architectureAreas: ArchitectureArea[] = [
  userDeviceArea,
  identityRouteArea,
  accessDecisionArea,
  connectionMethodArea,
  reachableResourcesArea,
  thirdPartySystemsArea,
];
