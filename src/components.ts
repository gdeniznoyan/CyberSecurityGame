import type { ComponentDefinition } from "./types.js";

const component = (definition: ComponentDefinition): ComponentDefinition =>
  definition;

export const userComponent = component({
  id: "user",
  name: "User",
  area: "user-device",
  description: "The person who initiates the access request.",
  icon: "./assets/components-individual/user.png",
  allowedAreaIds: ["user-device"],
  configuration: {},
  architecturalProperties: {},
});

export const clientDeviceComponent = component({
  id: "client-device",
  name: "Client Device",
  area: "user-device",
  description: "A home PC, BYOD device or otherwise untrusted endpoint.",
  icon: "./assets/components-individual/client-device.png",
  allowedAreaIds: ["user-device"],
  configuration: {},
  architecturalProperties: { persistsConnectionArtifacts: true },
});

export const saytecHardwareTokenComponent = component({
  id: "saytec-hardware-security-token",
  name: "Saytec Hardware Security Token",
  area: "user-device",
  description:
    "Hardware-bound identity and protected cryptographic operations.",
  icon: "./assets/components-individual/saytec-hardware-security-token.png",
  allowedAreaIds: ["user-device"],
  configuration: {},
  architecturalProperties: {
    authenticatesUser: true,
    usesHardwareBoundIdentity: true,
  },
});

export const biometricVerificationComponent = component({
  id: "biometric-verification",
  name: "Biometric Verification",
  area: "user-device",
  description: "Biometric verification of the user.",
  icon: "./assets/components-individual/biometric-verification.png",
  allowedAreaIds: ["user-device"],
  configuration: {},
  architecturalProperties: { authenticatesUser: true },
});

export const clientPinComponent = component({
  id: "client-pin",
  name: "Client PIN",
  area: "user-device",
  description: "A PIN that unlocks the token or client identity.",
  icon: "./assets/components-individual/client-pin.png",
  allowedAreaIds: ["user-device"],
  configuration: {},
  architecturalProperties: { authenticatesUser: true },
});

export const zeroFootprintClientComponent = component({
  id: "zero-footprint-client",
  name: "Zero-Footprint Client",
  area: "user-device",
  description:
    "A client designed not to retain useful session or network artifacts.",
  icon: "./assets/components-individual/zero-footprint-client.png",
  allowedAreaIds: ["user-device"],
  configuration: {
    persistentConfigurationEnabled: {
      type: "boolean",
      label: "Persistent Configuration Enabled",
      defaultValue: false,
    },
  },
  architecturalProperties: { persistsConnectionArtifacts: false },
});

export const privateCaComponent = component({
  id: "private-ca",
  name: "Private CA",
  area: "identity-route",
  description: "Organization-controlled certificate trust.",
  icon: "./assets/components-individual/private-ca.png",
  allowedAreaIds: ["identity-route"],
  configuration: {},
  architecturalProperties: { usesOrganizationControlledIdentity: true },
});

export const userCertificateComponent = component({
  id: "user-certificate",
  name: "User Certificate",
  area: "identity-route",
  description: "Certificate identity assigned to a user.",
  icon: "./assets/components-individual/user-certificate.png",
  allowedAreaIds: ["identity-route"],
  configuration: {},
  architecturalProperties: { authenticatesUser: true },
});

export const x509CertificateComponent = component({
  id: "x509-certificate",
  name: "X.509 Certificate",
  area: "identity-route",
  description: "Cryptographically verifiable user, device or service identity.",
  icon: "./assets/components-individual/x509-certificate.png",
  allowedAreaIds: ["identity-route"],
  configuration: {},
  architecturalProperties: { authenticatesUser: true },
});

export const certificateValidationComponent = component({
  id: "certificate-validation",
  name: "Certificate Validation",
  area: "identity-route",
  description: "Validation of certificate status and trust.",
  icon: "./assets/components-individual/certificate-validation.png",
  allowedAreaIds: ["identity-route"],
  configuration: {
    certificateChecked: {
      type: "boolean",
      label: "Certificate Checked",
      defaultValue: true,
    },
    expirationChecked: {
      type: "boolean",
      label: "Expiration Checked",
      defaultValue: true,
    },
    revocationChecked: {
      type: "boolean",
      label: "Revocation Checked",
      defaultValue: false,
    },
    completeValidation: {
      type: "boolean",
      label: "Complete Validation",
      defaultValue: false,
    },
  },
  architecturalProperties: { validatesCertificate: true },
});

export const certificateRevocationComponent = component({
  id: "certificate-revocation-check",
  name: "Certificate Revocation Check",
  area: "identity-route",
  description: "Rejects revoked or compromised certificates.",
  icon: "./assets/components-individual/certificate-revocation-check.png",
  allowedAreaIds: ["identity-route"],
  configuration: {},
  architecturalProperties: { validatesCertificate: true },
});

export const otpComponent = component({
  id: "otp",
  name: "OTP",
  area: "identity-route",
  description: "An additional one-time authentication factor.",
  icon: "./assets/components-individual/otp.png",
  allowedAreaIds: ["identity-route"],
  configuration: {},
  architecturalProperties: { authenticatesUser: true },
});

export const saytecServerComponent = component({
  id: "saytec-server",
  name: "Saytec Server",
  area: "access-decision-enforcement",
  description:
    "Evaluates and enforces access decisions for application connections.",
  icon: "./assets/components-individual/saytec-server.png",
  allowedAreaIds: ["access-decision-enforcement"],
  configuration: {
    policyTiming: {
      type: "select",
      label: "Policy Timing",
      options: ["Before Connection", "After Connection"],
      defaultValue: "Before Connection",
    },
    leastPrivilegeEnabled: {
      type: "boolean",
      label: "Least Privilege Enabled",
      defaultValue: true,
    },
    broadRolePermission: {
      type: "boolean",
      label: "Broad Role Permission",
      defaultValue: false,
    },
    sessionRevocationEnabled: {
      type: "boolean",
      label: "Session Revocation Enabled",
      defaultValue: true,
    },
  },
  architecturalProperties: {
    evaluatesAccessPolicy: true,
    enforcesAccessPolicy: true,
  },
});

export const policyEngineComponent = component({
  id: "policy-engine",
  name: "Policy Engine",
  area: "access-decision-enforcement",
  description: "Evaluates access requests against policy.",
  icon: "./assets/components-individual/policy-engine.png",
  allowedAreaIds: ["access-decision-enforcement"],
  configuration: {
    policyTiming: {
      type: "select",
      label: "Policy Timing",
      options: ["Before Connection", "After Connection"],
      defaultValue: "Before Connection",
    },
  },
  architecturalProperties: { evaluatesAccessPolicy: true },
});

export const policyEnforcementComponent = component({
  id: "policy-enforcement",
  name: "Policy Enforcement",
  area: "access-decision-enforcement",
  description: "Applies allow, deny, routing and termination decisions.",
  icon: "./assets/components-individual/policy-enforcement.png",
  allowedAreaIds: ["access-decision-enforcement"],
  configuration: {},
  architecturalProperties: { enforcesAccessPolicy: true },
});

export const leastPrivilegeComponent = component({
  id: "least-privilege-control",
  name: "Least-Privilege Control",
  area: "access-decision-enforcement",
  description: "Limits permissions to the minimum required scope.",
  icon: "./assets/components-individual/least-privilege-control.png",
  allowedAreaIds: ["access-decision-enforcement"],
  configuration: {},
  architecturalProperties: { usesLeastPrivilege: true },
});

export const applicationAuthorizationComponent = component({
  id: "application-authorization",
  name: "Application Authorization",
  area: "access-decision-enforcement",
  description: "Authorizes explicitly approved applications.",
  icon: "./assets/components-individual/application-authorization.png",
  allowedAreaIds: ["access-decision-enforcement"],
  configuration: {},
  architecturalProperties: { restrictsApplications: true },
});

export const sessionRevocationComponent = component({
  id: "session-revocation",
  name: "Session Revocation",
  area: "access-decision-enforcement",
  description: "Allows an active session to be terminated.",
  icon: "./assets/components-individual/session-revocation.png",
  allowedAreaIds: ["access-decision-enforcement"],
  configuration: {},
  architecturalProperties: { supportsSessionTermination: true },
});

export const vpnGatewayComponent = component({
  id: "vpn-gateway",
  name: "VPN Gateway",
  area: "connection-method",
  description: "A configurable remote-access network gateway.",
  icon: "./assets/components-individual/vpn-gateway.png",
  allowedAreaIds: ["connection-method"],
  configuration: {
    accessScope: {
      type: "select",
      label: "Access Scope",
      options: [
        "Full Network Access",
        "Restricted Subnet Access",
        "Application-Specific Route",
      ],
      defaultValue: "Full Network Access",
    },
    splitTunnelingEnabled: {
      type: "boolean",
      label: "Split Tunneling Enabled",
      defaultValue: false,
    },
  },
  architecturalProperties: {
    grantsNetworkAccess: true,
    assignsProtectedNetworkAddress: true,
  },
});

export const networkConnectionComponent = component({
  id: "network-connection",
  name: "Network Connection",
  area: "connection-method",
  description: "Network-level access from the client to protected resources.",
  icon: "./assets/components-individual/network-connection.png",
  allowedAreaIds: ["connection-method"],
  configuration: {},
  architecturalProperties: {
    grantsNetworkAccess: true,
    exposesNetworkInformation: true,
  },
});

export const applicationConnectionComponent = component({
  id: "application-connection",
  name: "Application Connection",
  area: "connection-method",
  description: "A connection limited to a specific application.",
  icon: "./assets/components-individual/application-connection.png",
  allowedAreaIds: ["connection-method"],
  configuration: {
    applicationAllowListEnabled: {
      type: "boolean",
      label: "Application Allow List Enabled",
      defaultValue: true,
    },
    parallelExternalCommunicationRestricted: {
      type: "boolean",
      label: "Parallel External Communication Restricted",
      defaultValue: false,
    },
  },
  architecturalProperties: { grantsApplicationAccess: true },
});

export const ramApplicationTunnelComponent = component({
  id: "ram-application-tunnel",
  name: "RAM Application Tunnel",
  area: "connection-method",
  description: "An application-specific tunnel created in temporary memory.",
  icon: "./assets/components-individual/ram-application-tunnel.png",
  allowedAreaIds: ["connection-method"],
  configuration: {
    encryptedRamTunnelingEnabled: {
      type: "boolean",
      label: "Encrypted RAM Tunneling Enabled",
      defaultValue: true,
    },
    virtualNetworkInterfaceEnabled: {
      type: "boolean",
      label: "Virtual Network Interface Enabled",
      defaultValue: false,
    },
    applicationAllowListEnabled: {
      type: "boolean",
      label: "Application Allow List Enabled",
      defaultValue: true,
    },
    parallelExternalCommunicationRestricted: {
      type: "boolean",
      label: "Parallel External Communication Restricted",
      defaultValue: true,
    },
    persistentConfigurationEnabled: {
      type: "boolean",
      label: "Persistent Configuration Enabled",
      defaultValue: false,
    },
  },
  architecturalProperties: { grantsApplicationAccess: true },
});

export const encryptedRamComponent = component({
  id: "encrypted-ram",
  name: "Encrypted RAM",
  area: "connection-method",
  description: "Protects connection material held in temporary memory.",
  icon: "./assets/components-individual/encrypted-ram.png",
  allowedAreaIds: ["connection-method"],
  configuration: {},
  architecturalProperties: { usesEncryptedRam: true },
});
export const mutualTlsComponent = component({
  id: "mutual-tls",
  name: "Mutual TLS",
  area: "connection-method",
  description: "Mutually authenticates both ends of the connection.",
  icon: "./assets/components-individual/mutual-tls.png",
  allowedAreaIds: ["connection-method"],
  configuration: {},
  architecturalProperties: {
    authenticatesUser: true,
    encryptsConnection: true,
  },
});
export const aes256Component = component({
  id: "aes-256-encryption",
  name: "AES-256 Encryption",
  area: "connection-method",
  description: "Strong encryption for connection data.",
  icon: "./assets/components-individual/aes-256-encryption.png",
  allowedAreaIds: ["connection-method"],
  configuration: {},
  architecturalProperties: { encryptsConnection: true },
});
export const pfsComponent = component({
  id: "perfect-forward-secrecy",
  name: "Perfect Forward Secrecy",
  area: "connection-method",
  description: "Independent session keys limit historical exposure.",
  icon: "./assets/components-individual/perfect-forward-secrecy.png",
  allowedAreaIds: ["connection-method"],
  configuration: {},
  architecturalProperties: { encryptsConnection: true },
});
export const virtualNetworkInterfaceComponent = component({
  id: "virtual-network-interface",
  name: "Virtual Network Interface",
  area: "connection-method",
  description: "Creates a protected-network interface on the client.",
  icon: "./assets/components-individual/virtual-network-interface.png",
  allowedAreaIds: ["connection-method"],
  configuration: {},
  architecturalProperties: {
    createsVirtualNetworkInterface: true,
    assignsProtectedNetworkAddress: true,
    exposesNetworkInformation: true,
  },
});

export const corporateNetworkComponent = component({
  id: "corporate-network",
  name: "Corporate Network",
  area: "reachable-resources",
  description: "Broad access to the protected corporate network.",
  icon: "./assets/components-individual/corporate-network.png",
  allowedAreaIds: ["reachable-resources"],
  configuration: {},
  architecturalProperties: {
    grantsNetworkAccess: true,
    exposesNetworkInformation: true,
  },
});
export const restrictedSubnetComponent = component({
  id: "restricted-subnet",
  name: "Restricted Subnet",
  area: "reachable-resources",
  description: "Network access limited to a defined subnet.",
  icon: "./assets/components-individual/restricted-subnet.png",
  allowedAreaIds: ["reachable-resources"],
  configuration: {},
  architecturalProperties: {
    grantsNetworkAccess: true,
    exposesNetworkInformation: true,
  },
});
export const internalWebApplicationComponent = component({
  id: "internal-web-application",
  name: "Internal Web Application",
  area: "reachable-resources",
  description: "An approved internal web application.",
  icon: "./assets/components-individual/internal-web-application.png",
  allowedAreaIds: ["reachable-resources"],
  configuration: {},
  architecturalProperties: { grantsApplicationAccess: true },
});
export const administrativeApplicationComponent = component({
  id: "administrative-application",
  name: "Administrative Application",
  area: "reachable-resources",
  description: "A privileged administrative application.",
  icon: "./assets/components-individual/administrative-application.png",
  allowedAreaIds: ["reachable-resources"],
  configuration: {},
  architecturalProperties: { grantsApplicationAccess: true },
});
export const partnerApplicationComponent = component({
  id: "partner-application",
  name: "Partner Application",
  area: "reachable-resources",
  description: "An application exposed specifically to a partner.",
  icon: "./assets/components-individual/partner-application.png",
  allowedAreaIds: ["reachable-resources"],
  configuration: {},
  architecturalProperties: { grantsApplicationAccess: true },
});
export const virtualMachineComponent = component({
  id: "virtual-machine",
  name: "Virtual Machine",
  area: "reachable-resources",
  description: "A specific protected virtual machine.",
  icon: "./assets/components-individual/virtual-machine.png",
  allowedAreaIds: ["reachable-resources"],
  configuration: {},
  architecturalProperties: { grantsApplicationAccess: true },
});
export const multipleApplicationsComponent = component({
  id: "multiple-internal-applications",
  name: "Multiple Internal Applications",
  area: "reachable-resources",
  description: "Several internal resources reachable by the client.",
  icon: "./assets/components-individual/multiple-internal-applications.png",
  allowedAreaIds: ["reachable-resources"],
  configuration: {},
  architecturalProperties: {
    grantsNetworkAccess: true,
    exposesNetworkInformation: true,
  },
});

export const externalIdentityProviderComponent = component({
  id: "external-identity-provider",
  name: "External Identity Provider",
  area: "third-party-systems",
  description: "Microsoft IdP, Okta or another external identity provider.",
  icon: "./assets/components-individual/external-identity-provider.png",
  allowedAreaIds: ["third-party-systems"],
  configuration: {
    identityRole: {
      type: "select",
      label: "Identity Role",
      options: [
        "Primary Authenticator",
        "Secondary Identity Signal",
        "SSO After Authentication",
        "Application-Only Dependency",
      ],
      defaultValue: "Primary Authenticator",
    },
  },
  architecturalProperties: {},
});
export const externalSsoComponent = component({
  id: "external-sso",
  name: "External SSO",
  area: "third-party-systems",
  description: "External application sign-on after or during authentication.",
  icon: "./assets/components-individual/external-sso.png",
  allowedAreaIds: ["third-party-systems"],
  configuration: {
    identityRole: {
      type: "select",
      label: "Identity Role",
      options: [
        "Primary Authenticator",
        "Secondary Identity Signal",
        "SSO After Authentication",
        "Application-Only Dependency",
      ],
      defaultValue: "SSO After Authentication",
    },
  },
  architecturalProperties: {},
});
export const externalMonitoringComponent = component({
  id: "external-monitoring-service",
  name: "External Monitoring Service",
  area: "third-party-systems",
  description: "External monitoring and security-event processing.",
  icon: "./assets/components-individual/external-monitoring-service.png",
  allowedAreaIds: ["third-party-systems"],
  configuration: {},
  architecturalProperties: { monitorsSession: true },
});
export const externalCloudComponent = component({
  id: "external-cloud-service",
  name: "External Cloud Service",
  area: "third-party-systems",
  description: "An externally hosted application or data dependency.",
  icon: "./assets/components-individual/external-cloud-service.png",
  allowedAreaIds: ["third-party-systems"],
  configuration: {},
  architecturalProperties: {},
});

export const componentList: ComponentDefinition[] = [
  userComponent,
  clientDeviceComponent,
  saytecHardwareTokenComponent,
  biometricVerificationComponent,
  clientPinComponent,
  zeroFootprintClientComponent,
  privateCaComponent,
  userCertificateComponent,
  x509CertificateComponent,
  certificateValidationComponent,
  certificateRevocationComponent,
  otpComponent,
  saytecServerComponent,
  policyEngineComponent,
  policyEnforcementComponent,
  leastPrivilegeComponent,
  applicationAuthorizationComponent,
  sessionRevocationComponent,
  vpnGatewayComponent,
  networkConnectionComponent,
  applicationConnectionComponent,
  ramApplicationTunnelComponent,
  encryptedRamComponent,
  mutualTlsComponent,
  aes256Component,
  pfsComponent,
  virtualNetworkInterfaceComponent,
  corporateNetworkComponent,
  restrictedSubnetComponent,
  internalWebApplicationComponent,
  administrativeApplicationComponent,
  partnerApplicationComponent,
  virtualMachineComponent,
  multipleApplicationsComponent,
  externalIdentityProviderComponent,
  externalSsoComponent,
  externalMonitoringComponent,
  externalCloudComponent,
];

const componentIndex = new Map(componentList.map((item) => [item.id, item]));

export function getComponentById(id: string): ComponentDefinition | undefined {
  return componentIndex.get(id);
}

export function getDefaultConfiguration(
  id: string,
): Record<string, string | boolean> {
  const definition = getComponentById(id);
  if (!definition) return {};
  return Object.fromEntries(
    Object.entries(definition.configuration).map(([key, field]) => [
      key,
      field.defaultValue,
    ]),
  );
}
