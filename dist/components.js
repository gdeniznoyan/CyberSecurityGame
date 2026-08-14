const icon = (id) => `./assets/component-icons-raster/${id}.png?v=1`;
const bool = (id, label, defaultValue) => ({
    id,
    label,
    type: "boolean",
    defaultValue,
});
const select = (id, label, defaultValue, options) => ({ id, label, type: "select", defaultValue, options });
export const clientDeviceComponent = {
    id: "client-device",
    name: "Client Device",
    area: "user-device",
    description: "Represents the endpoint device used by the user to initiate access. The device may be a personal computer, BYOD device, or another endpoint that is not automatically trusted.",
    icon: icon("client-device"),
    isSaytecComponent: false,
    allowedAreaIds: ["user-device"],
    configuration: [
        select("deviceTrust", "Device posture", "Untrusted Device", [
            "Untrusted Device",
            "Managed / Secure Device",
        ]),
    ],
    architecturalProperties: {},
};
export const secureDeviceComponent = {
    id: "secure-device",
    name: "Secure Device",
    area: "user-device",
    description: "Represents a managed and security-controlled endpoint that meets the organization's security requirements before accessing protected resources.",
    icon: icon("secure-device"),
    isSaytecComponent: false,
    allowedAreaIds: ["user-device"],
    configuration: [
        select("deviceTrust", "Device posture", "Managed / Secure Device", [
            "Untrusted Device",
            "Managed / Secure Device",
        ]),
    ],
    architecturalProperties: {},
};
export const saytrustHardwareSecurityTokenComponent = {
    id: "saytrust-hardware-security-token",
    name: "sayTRUST Hardware Security Token",
    area: "user-device",
    description: "Represents the sayTRUST hardware-based security token used to provide hardware-bound identity and protect sensitive authentication and cryptographic operations outside the client device.",
    icon: icon("saytrust-hardware-security-token"),
    isSaytecComponent: true,
    allowedAreaIds: ["user-device"],
    configuration: [
        bool("hardwareId", "Hardware ID", true),
        bool("biometric", "Biometric verification", true),
        bool("clientPin", "Client PIN", true),
        bool("certificatePinProtection", "Certificate / PIN protection", true),
    ],
    architecturalProperties: {
        authenticatesUser: true,
        usesHardwareBoundIdentity: true,
    },
};
export const biometricVerificationComponent = {
    id: "biometric-verification",
    name: "Biometric Verification",
    area: "user-device",
    description: "Uses a biometric characteristic such as a fingerprint or facial feature to verify that the person requesting access is the authorized user.",
    icon: icon("biometric-verification"),
    isSaytecComponent: false,
    allowedAreaIds: ["user-device"],
    configuration: [bool("biometric", "Biometric verification", true)],
    architecturalProperties: { authenticatesUser: true },
};
export const clientPinComponent = {
    id: "client-pin",
    name: "Client PIN",
    area: "user-device",
    description: "Represents a PIN known by the user and used as an additional authentication factor when accessing the secure client or hardware token.",
    icon: icon("client-pin"),
    isSaytecComponent: false,
    allowedAreaIds: ["user-device"],
    configuration: [bool("clientPin", "Client PIN enabled", true)],
    architecturalProperties: { authenticatesUser: true },
};
export const privateCaComponent = {
    id: "private-ca",
    name: "Private CA",
    area: "identity-route",
    description: "Represents an organization-controlled Certificate Authority used to issue and manage trusted digital certificates without relying on an external certificate authority for the critical identity chain.",
    icon: icon("private-ca"),
    isSaytecComponent: false,
    allowedAreaIds: ["identity-route"],
    configuration: [],
    architecturalProperties: { usesOrganizationControlledIdentity: true },
};
export const userCertificateComponent = {
    id: "user-certificate",
    name: "User Certificate",
    area: "identity-route",
    description: "Represents a digital certificate associated with the user and used to establish certificate-based identity during authentication.",
    icon: icon("user-certificate"),
    isSaytecComponent: false,
    allowedAreaIds: ["identity-route"],
    configuration: [bool("otp", "Additional OTP factor", false)],
    architecturalProperties: { authenticatesUser: true },
};
export const x509CertificateComponent = {
    id: "x509-certificate",
    name: "X.509 Certificate",
    area: "identity-route",
    description: "Represents a standard X.509 digital certificate used to cryptographically verify the identity of a user, device, or service.",
    icon: icon("x509-certificate"),
    isSaytecComponent: false,
    allowedAreaIds: ["identity-route"],
    configuration: [],
    architecturalProperties: { authenticatesUser: true },
};
export const certificateValidationComponent = {
    id: "certificate-validation",
    name: "Certificate Validation",
    area: "identity-route",
    description: "Verifies that a certificate is valid before it is trusted, including checks such as certificate integrity, validity period, issuer, and trust chain.",
    icon: icon("certificate-validation"),
    isSaytecComponent: false,
    allowedAreaIds: ["identity-route"],
    configuration: [
        bool("certificateChecked", "Certificate checked", true),
        bool("expirationChecked", "Expiration checked", true),
        bool("revocationChecked", "Revocation checked", true),
        bool("completeValidation", "Complete validation", true),
    ],
    architecturalProperties: { validatesCertificate: true },
};
export const certificateRevocationCheckComponent = {
    id: "certificate-revocation-check",
    name: "Certificate Revocation Check",
    area: "identity-route",
    description: "Checks whether a previously issued certificate has been revoked and prevents revoked or compromised certificates from being trusted.",
    icon: icon("certificate-revocation-check"),
    isSaytecComponent: false,
    allowedAreaIds: ["identity-route"],
    configuration: [bool("revocationChecked", "Revocation checked", true)],
    architecturalProperties: { validatesCertificate: true },
};
export const otpComponent = {
    id: "otp",
    name: "OTP",
    area: "identity-route",
    description: "Represents a One-Time Password used as an additional authentication factor that is valid only for a single login or a short period of time.",
    icon: icon("otp"),
    isSaytecComponent: false,
    allowedAreaIds: ["identity-route"],
    configuration: [],
    architecturalProperties: { authenticatesUser: true },
};
export const saytrustServerComponent = {
    id: "saytrust-server",
    name: "sayTRUST Server",
    area: "access-enforcement",
    description: "Represents the central sayTRUST security server that evaluates identity, permissions, target applications, and access policies and can also enforce the resulting access decision.",
    icon: icon("saytrust-server"),
    isSaytecComponent: true,
    allowedAreaIds: ["access-enforcement"],
    configuration: [
        select("policyTiming", "Policy timing", "Policy Before Connection", [
            "Policy Before Connection",
            "Policy After Connection",
        ]),
        bool("leastPrivilege", "Least privilege", true),
        bool("broadRolePermission", "Broad role permission", false),
        bool("sessionRevocation", "Session revocation", true),
        bool("applicationAuthorization", "Application authorization", true),
    ],
    architecturalProperties: {
        evaluatesAccessPolicy: true,
        enforcesAccessPolicy: true,
    },
};
export const policyEngineComponent = {
    id: "policy-engine",
    name: "Policy Engine",
    area: "access-enforcement",
    description: "Evaluates contextual and security information to determine whether an access request should be allowed or denied according to defined organizational policies.",
    icon: icon("policy-engine"),
    isSaytecComponent: false,
    allowedAreaIds: ["access-enforcement"],
    configuration: [
        select("policyTiming", "Policy timing", "Policy Before Connection", [
            "Policy Before Connection",
            "Policy After Connection",
        ]),
        bool("leastPrivilege", "Least privilege", true),
    ],
    architecturalProperties: { evaluatesAccessPolicy: true },
};
export const clientPrivilegeManagementComponent = {
    id: "client-privilege-management",
    name: "Client Privilege Management",
    area: "access-enforcement",
    description: "Controls and limits the privileges available to the client device or user so that unnecessary administrative or elevated permissions are not available during the access session.",
    icon: icon("client-privilege-management"),
    isSaytecComponent: false,
    allowedAreaIds: ["access-enforcement"],
    configuration: [bool("leastPrivilege", "Least privilege", true)],
    architecturalProperties: { usesLeastPrivilege: true },
};
export const leastPrivilegeControlComponent = {
    id: "least-privilege-control",
    name: "Least-Privilege Control",
    area: "access-enforcement",
    description: "Restricts access to the minimum permissions and resources required for the user's current task, reducing the impact of a compromised account or device.",
    icon: icon("least-privilege-control"),
    isSaytecComponent: false,
    allowedAreaIds: ["access-enforcement"],
    configuration: [bool("leastPrivilege", "Least privilege", true)],
    architecturalProperties: { usesLeastPrivilege: true },
};
export const applicationAuthorizationComponent = {
    id: "application-authorization",
    name: "Application Authorization",
    area: "access-enforcement",
    description: "Determines which specific applications the authenticated user is authorized to access and prevents access to applications that have not been explicitly approved.",
    icon: icon("application-authorization"),
    isSaytecComponent: false,
    allowedAreaIds: ["access-enforcement"],
    configuration: [
        bool("applicationAuthorization", "Application authorization", true),
    ],
    architecturalProperties: {
        restrictsApplications: true,
        enforcesAccessPolicy: true,
    },
};
export const sessionRevocationComponent = {
    id: "session-revocation",
    name: "Session Revocation",
    area: "access-enforcement",
    description: "Allows an active access session to be terminated when authorization changes, suspicious activity is detected, or the user is no longer permitted to continue the session.",
    icon: icon("session-revocation"),
    isSaytecComponent: false,
    allowedAreaIds: ["access-enforcement"],
    configuration: [bool("sessionRevocation", "Session revocation", true)],
    architecturalProperties: { supportsSessionTermination: true },
};
export const gatewayComponent = {
    id: "gateway",
    name: "Gateway",
    area: "connection-method",
    description: "Represents the controlled entry point between the external client and protected resources. Its configuration determines whether it provides network-level or application-level access.",
    icon: icon("gateway"),
    isSaytecComponent: false,
    allowedAreaIds: ["connection-method"],
    configuration: [
        select("accessLevel", "Access level", "Application-Level Access", [
            "Network-Level Access",
            "Application-Level Access",
        ]),
        bool("virtualNetworkInterface", "Virtual network interface", false),
        bool("protectedNetworkAddress", "Protected network address assigned", false),
    ],
    architecturalProperties: {},
};
export const networkConnectionComponent = {
    id: "network-connection",
    name: "Network Connection",
    area: "connection-method",
    description: "Represents a connection that provides the client with access at the network level, potentially allowing the client to reach multiple systems or network resources.",
    icon: icon("network-connection"),
    isSaytecComponent: false,
    allowedAreaIds: ["connection-method"],
    configuration: [
        select("accessScope", "Access scope", "Full Network Access", [
            "Full Network Access",
            "Restricted Subnet Access",
            "Application-Specific Route",
        ]),
        bool("splitTunneling", "Split tunneling", false),
    ],
    architecturalProperties: { grantsNetworkAccess: true },
};
export const applicationConnectionComponent = {
    id: "application-connection",
    name: "Application Connection",
    area: "connection-method",
    description: "Represents a connection that provides access only to a specific authorized application instead of exposing the broader protected network.",
    icon: icon("application-connection"),
    isSaytecComponent: false,
    allowedAreaIds: ["connection-method"],
    configuration: [
        select("accessLevel", "Access level", "Application-Level Access", [
            "Network-Level Access",
            "Application-Level Access",
        ]),
    ],
    architecturalProperties: { grantsApplicationAccess: true },
};
export const ramApplicationTunnelComponent = {
    id: "ram-application-tunnel",
    name: "RAM Application Tunnel",
    area: "connection-method",
    description: "Represents an application-specific secure tunnel whose connection state is established and maintained in RAM rather than as a conventional persistent network connection.",
    icon: icon("ram-application-tunnel"),
    isSaytecComponent: true,
    allowedAreaIds: ["connection-method"],
    configuration: [
        bool("encryptedRam", "Encrypted RAM", true),
        bool("applicationSpecific", "Application-specific connection", true),
        bool("connectionKeyProtectsRam", "Connection key protects RAM", true),
        bool("persistentArtifacts", "Persistent connection artifacts", false),
    ],
    architecturalProperties: {
        grantsApplicationAccess: true,
        usesEncryptedRam: true,
    },
};
export const encryptedRamComponent = {
    id: "encrypted-ram",
    name: "Encrypted RAM",
    area: "connection-method",
    description: "Represents the protection of sensitive session and connection information while it is stored temporarily in memory using encryption.",
    icon: icon("encrypted-ram"),
    isSaytecComponent: false,
    allowedAreaIds: ["connection-method"],
    configuration: [bool("encryptedRam", "Encrypted RAM", true)],
    architecturalProperties: { usesEncryptedRam: true },
};
export const mutualTlsComponent = {
    id: "mutual-tls",
    name: "Mutual TLS",
    area: "connection-method",
    description: "Represents Mutual Transport Layer Security, where both the client and server authenticate each other using certificates before establishing a trusted encrypted connection.",
    icon: icon("mutual-tls"),
    isSaytecComponent: false,
    allowedAreaIds: ["connection-method"],
    configuration: [],
    architecturalProperties: {
        authenticatesBeforeCommunication: true,
        usesMutualTls: true,
        encryptsTransport: true,
    },
};
export const aes256EncryptionComponent = {
    id: "aes-256-encryption",
    name: "AES-256 Encryption",
    area: "connection-method",
    description: "Represents strong AES-256 encryption used to protect sensitive data and connection information against unauthorized reading.",
    icon: icon("aes-256-encryption"),
    isSaytecComponent: false,
    allowedAreaIds: ["connection-method"],
    configuration: [],
    architecturalProperties: { encryptsTransport: true },
};
export const perfectForwardSecrecyComponent = {
    id: "perfect-forward-secrecy",
    name: "Perfect Forward Secrecy",
    area: "connection-method",
    description: "Uses independent temporary session keys so that compromise of long-term cryptographic material does not automatically expose previously protected sessions.",
    icon: icon("perfect-forward-secrecy"),
    isSaytecComponent: false,
    allowedAreaIds: ["connection-method"],
    configuration: [],
    architecturalProperties: { usesPerfectForwardSecrecy: true },
};
export const virtualNetworkInterfaceComponent = {
    id: "virtual-network-interface",
    name: "Virtual Network Interface",
    area: "connection-method",
    description: "Represents a virtual network adapter created on the client that can make the client participate in or interact with the protected network at the network level.",
    icon: icon("virtual-network-interface"),
    isSaytecComponent: false,
    allowedAreaIds: ["connection-method"],
    configuration: [
        bool("virtualNetworkInterface", "Virtual network interface", true),
    ],
    architecturalProperties: { createsVirtualNetworkInterface: true },
};
export const corporateNetworkComponent = {
    id: "corporate-network",
    name: "Corporate Network",
    area: "reachable-resources",
    description: "Represents broad access to the organization's internal network, where multiple protected systems and services may become reachable by the client.",
    icon: icon("corporate-network"),
    isSaytecComponent: false,
    allowedAreaIds: ["reachable-resources"],
    configuration: [],
    architecturalProperties: {
        grantsNetworkAccess: true,
        exposesNetworkInformation: true,
    },
};
export const restrictedSubnetComponent = {
    id: "restricted-subnet",
    name: "Restricted Subnet",
    area: "reachable-resources",
    description: "Represents network-level access limited to a specific internal subnet rather than the entire corporate network.",
    icon: icon("restricted-subnet"),
    isSaytecComponent: false,
    allowedAreaIds: ["reachable-resources"],
    configuration: [],
    architecturalProperties: {
        grantsNetworkAccess: true,
        exposesNetworkInformation: true,
    },
};
export const internalWebApplicationComponent = {
    id: "internal-web-application",
    name: "Internal Web Application",
    area: "reachable-resources",
    description: "Represents a protected internal web application that the user can access without necessarily receiving access to the wider corporate network.",
    icon: icon("internal-web-application"),
    isSaytecComponent: false,
    allowedAreaIds: ["reachable-resources"],
    configuration: [],
    architecturalProperties: { grantsApplicationAccess: true },
};
export const virtualMachineComponent = {
    id: "virtual-machine",
    name: "Virtual Machine",
    area: "reachable-resources",
    description: "Represents a specific virtual machine that can be accessed as an authorized protected resource.",
    icon: icon("virtual-machine"),
    isSaytecComponent: false,
    allowedAreaIds: ["reachable-resources"],
    configuration: [],
    architecturalProperties: { grantsApplicationAccess: true },
};
export const externalIdentityProviderComponent = {
    id: "external-identity-provider",
    name: "External Identity Provider",
    area: "third-party-systems",
    description: "Represents an external service that provides user identity information or identity assertions to the architecture. It may act as the primary identity source, a secondary identity signal, or a supporting identity service depending on its configuration.",
    icon: icon("external-identity-provider"),
    isSaytecComponent: false,
    allowedAreaIds: ["third-party-systems"],
    configuration: [
        select("identityRole", "Identity role", "Secondary Identity Signal", [
            "Primary Authenticator",
            "Secondary Identity Signal",
            "SSO After Authentication",
            "Application-Only Dependency",
        ]),
    ],
    architecturalProperties: {},
};
export const externalAuthenticationServiceComponent = {
    id: "external-authentication-service",
    name: "External Authentication Service",
    area: "third-party-systems",
    description: "Represents an external service that directly performs or participates in the authentication decision used to determine whether the user may access protected resources.",
    icon: icon("external-authentication-service"),
    isSaytecComponent: false,
    allowedAreaIds: ["third-party-systems"],
    configuration: [],
    architecturalProperties: { dependsOnExternalIdentityProvider: true },
};
export const externalCloudServiceComponent = {
    id: "external-cloud-service",
    name: "External Cloud Service",
    area: "third-party-systems",
    description: "Represents a cloud-hosted service operated by an external provider that the architecture depends on for application functionality, infrastructure, storage, or processing.",
    icon: icon("external-cloud-service"),
    isSaytecComponent: false,
    allowedAreaIds: ["third-party-systems"],
    configuration: [],
    architecturalProperties: {},
};
export const externalMonitoringServiceComponent = {
    id: "external-monitoring-service",
    name: "External Monitoring Service",
    area: "third-party-systems",
    description: "Represents an externally operated monitoring or security service that receives logs, telemetry, security events, or operational information from the architecture.",
    icon: icon("external-monitoring-service"),
    isSaytecComponent: false,
    allowedAreaIds: ["third-party-systems"],
    configuration: [],
    architecturalProperties: {},
};
export const componentList = [
    clientDeviceComponent,
    secureDeviceComponent,
    saytrustHardwareSecurityTokenComponent,
    biometricVerificationComponent,
    clientPinComponent,
    privateCaComponent,
    userCertificateComponent,
    x509CertificateComponent,
    certificateValidationComponent,
    certificateRevocationCheckComponent,
    otpComponent,
    saytrustServerComponent,
    policyEngineComponent,
    clientPrivilegeManagementComponent,
    leastPrivilegeControlComponent,
    applicationAuthorizationComponent,
    sessionRevocationComponent,
    gatewayComponent,
    networkConnectionComponent,
    applicationConnectionComponent,
    ramApplicationTunnelComponent,
    encryptedRamComponent,
    mutualTlsComponent,
    aes256EncryptionComponent,
    perfectForwardSecrecyComponent,
    virtualNetworkInterfaceComponent,
    corporateNetworkComponent,
    restrictedSubnetComponent,
    internalWebApplicationComponent,
    virtualMachineComponent,
    externalIdentityProviderComponent,
    externalAuthenticationServiceComponent,
    externalCloudServiceComponent,
    externalMonitoringServiceComponent,
];
const componentIndex = new Map(componentList.map((component) => [component.id, component]));
export function getComponentById(id) {
    return componentIndex.get(id);
}
export function getDefaultConfiguration(component) {
    return Object.fromEntries(component.configuration.map((item) => [item.id, item.defaultValue]));
}
//# sourceMappingURL=components.js.map