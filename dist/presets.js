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
                placement("secure-device", "user-device"),
                placement("saytrust-hardware-security-token", "user-device"),
                placement("private-ca", "identity-route"),
                placement("user-certificate", "identity-route"),
                placement("certificate-validation", "identity-route"),
                placement("saytrust-server", "access-enforcement"),
                placement("mutual-tls", "connection-method"),
                placement("ram-application-tunnel", "connection-method"),
                placement("internal-web-application", "reachable-resources"),
            ],
            connections: connectPath([
                "secure-device",
                "saytrust-hardware-security-token",
                "private-ca",
                "user-certificate",
                "certificate-validation",
                "saytrust-server",
                "mutual-tls",
                "ram-application-tunnel",
                "internal-web-application",
            ]),
        },
    },
    {
        id: "zero-trust",
        state: {
            placements: [
                placement("secure-device", "user-device"),
                placement("external-identity-provider", "third-party-systems", {
                    identityRole: "Primary Authenticator",
                }),
                placement("mutual-tls", "connection-method"),
                placement("policy-engine", "access-enforcement"),
                placement("least-privilege-control", "access-enforcement"),
                placement("application-authorization", "access-enforcement"),
                placement("session-revocation", "access-enforcement"),
                placement("application-connection", "connection-method"),
                placement("internal-web-application", "reachable-resources"),
            ],
            connections: connectPath([
                "secure-device",
                "external-identity-provider",
                "mutual-tls",
                "policy-engine",
                "least-privilege-control",
                "application-authorization",
                "session-revocation",
                "application-connection",
                "internal-web-application",
            ]),
        },
    },
    {
        id: "vpn",
        state: {
            placements: [
                placement("client-device", "user-device"),
                placement("otp", "identity-route"),
                placement("gateway", "connection-method", {
                    accessLevel: "Network-Level Access",
                    virtualNetworkInterface: true,
                    protectedNetworkAddress: true,
                }),
                placement("mutual-tls", "connection-method"),
                placement("aes-256-encryption", "connection-method"),
                placement("network-connection", "connection-method"),
                placement("corporate-network", "reachable-resources"),
            ],
            connections: connectPath([
                "client-device",
                "otp",
                "mutual-tls",
                "aes-256-encryption",
                "gateway",
                "network-connection",
                "corporate-network",
            ]),
        },
    },
];
export const getArchitecturePreset = (id) => architecturePresets.find((preset) => preset.id === id);
//# sourceMappingURL=presets.js.map