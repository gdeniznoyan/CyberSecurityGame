export const userDeviceArea = {
    id: "user-device",
    name: "User and Device",
    description: "The user, endpoint and directly controlled identity factors.",
};
export const identityRouteArea = {
    id: "identity-route",
    name: "Identity Route",
    description: "The trust chain used to establish identity.",
};
export const accessDecisionArea = {
    id: "access-decision-enforcement",
    name: "Access Decision and Enforcement",
    description: "Policy evaluation, authorization and enforcement.",
};
export const connectionMethodArea = {
    id: "connection-method",
    name: "Connection Method",
    description: "How the protected communication path is created.",
};
export const reachableResourcesArea = {
    id: "reachable-resources",
    name: "Reachable Resources",
    description: "The resources the client can actually reach.",
};
export const thirdPartySystemsArea = {
    id: "third-party-systems",
    name: "Third-Party Systems",
    description: "External systems connected to the function they influence.",
    sideLane: true,
};
export const architectureAreas = [
    userDeviceArea,
    identityRouteArea,
    accessDecisionArea,
    connectionMethodArea,
    reachableResourcesArea,
    thirdPartySystemsArea,
];
//# sourceMappingURL=areas.js.map