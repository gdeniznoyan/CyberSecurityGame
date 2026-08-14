const placement = (componentId, areaId, configuration = {}) => ({ componentId, areaId, configuration });
const connectPath = (componentIds) => componentIds.slice(0, -1).map((sourceComponentId, index) => ({
    sourceComponentId,
    targetComponentId: componentIds[index + 1],
}));
export const architecturePresets = [
    {
        id: "saytrust",
        state: {
            placements: [
                placement("client-device", "user-device", {
                    deviceTrust: "Untrusted Device",
                }),
                placement("saytrust-hardware-security-token", "user-device", {
                    hardwareId: true,
                    biometric: true,
                    clientPin: true,
                    certificatePinProtection: true,
                }),
                placement("biometric-verification", "user-device", {
                    biometric: true,
                }),
                placement("client-pin", "user-device", { clientPin: true }),
                placement("private-ca", "identity-route"),
                placement("user-certificate", "identity-route"),
                placement("certificate-validation", "identity-route", {
                    certificateChecked: true,
                    expirationChecked: true,
                    revocationChecked: true,
                    completeValidation: true,
                }),
                placement("certificate-revocation-check", "identity-route", {
                    revocationChecked: true,
                }),
                placement("saytrust-server", "access-enforcement", {
                    policyTiming: "Policy Before Connection",
                    leastPrivilege: true,
                    broadRolePermission: false,
                    sessionRevocation: true,
                    applicationAuthorization: true,
                }),
                placement("client-privilege-management", "access-enforcement", {
                    leastPrivilege: true,
                }),
                placement("least-privilege-control", "access-enforcement", {
                    leastPrivilege: true,
                }),
                placement("application-authorization", "access-enforcement", {
                    applicationAuthorization: true,
                }),
                placement("session-revocation", "access-enforcement", {
                    sessionRevocation: true,
                }),
                placement("encrypted-ram", "connection-method", {
                    encryptedRam: true,
                }),
                placement("mutual-tls", "connection-method"),
                placement("aes-256-encryption", "connection-method"),
                placement("perfect-forward-secrecy", "connection-method"),
                placement("ram-application-tunnel", "connection-method", {
                    encryptedRam: true,
                    applicationSpecific: true,
                    connectionKeyProtectsRam: true,
                    persistentArtifacts: false,
                }),
                placement("application-connection", "connection-method", {
                    accessLevel: "Application-Level Access",
                }),
                placement("internal-web-application", "reachable-resources"),
            ],
            connections: connectPath([
                "client-device",
                "saytrust-hardware-security-token",
                "biometric-verification",
                "client-pin",
                "private-ca",
                "user-certificate",
                "certificate-validation",
                "certificate-revocation-check",
                "encrypted-ram",
                "saytrust-server",
                "client-privilege-management",
                "least-privilege-control",
                "application-authorization",
                "session-revocation",
                "mutual-tls",
                "aes-256-encryption",
                "perfect-forward-secrecy",
                "ram-application-tunnel",
                "application-connection",
                "internal-web-application",
            ]),
        },
    },
    {
        id: "zero-trust",
        state: {
            placements: [
                placement("secure-device", "user-device", {
                    deviceTrust: "Managed / Secure Device",
                }),
                placement("external-identity-provider", "third-party-systems", {
                    identityRole: "Primary Authenticator",
                }),
                placement("policy-engine", "access-enforcement", {
                    policyTiming: "Policy Before Connection",
                    leastPrivilege: true,
                }),
                placement("least-privilege-control", "access-enforcement", {
                    leastPrivilege: true,
                }),
                placement("application-authorization", "access-enforcement", {
                    applicationAuthorization: true,
                }),
                placement("session-revocation", "access-enforcement", {
                    sessionRevocation: true,
                }),
                placement("mutual-tls", "connection-method"),
                placement("application-connection", "connection-method", {
                    accessLevel: "Application-Level Access",
                }),
                placement("internal-web-application", "reachable-resources"),
            ],
            connections: connectPath([
                "secure-device",
                "external-identity-provider",
                "policy-engine",
                "least-privilege-control",
                "application-authorization",
                "session-revocation",
                "mutual-tls",
                "application-connection",
                "internal-web-application",
            ]),
        },
    },
    {
        id: "vpn",
        state: {
            placements: [
                placement("client-device", "user-device", {
                    deviceTrust: "Untrusted Device",
                }),
                placement("otp", "identity-route"),
                placement("gateway", "connection-method", {
                    accessLevel: "Network-Level Access",
                    virtualNetworkInterface: true,
                    protectedNetworkAddress: true,
                }),
                placement("mutual-tls", "connection-method"),
                placement("aes-256-encryption", "connection-method"),
                placement("perfect-forward-secrecy", "connection-method"),
                placement("virtual-network-interface", "connection-method", {
                    virtualNetworkInterface: true,
                }),
                placement("network-connection", "connection-method", {
                    accessScope: "Full Network Access",
                    splitTunneling: false,
                }),
                placement("corporate-network", "reachable-resources"),
            ],
            connections: connectPath([
                "client-device",
                "otp",
                "gateway",
                "mutual-tls",
                "aes-256-encryption",
                "perfect-forward-secrecy",
                "virtual-network-interface",
                "network-connection",
                "corporate-network",
            ]),
        },
    },
];
export const getArchitecturePreset = (id) => architecturePresets.find((preset) => preset.id === id);
//# sourceMappingURL=presets.js.map