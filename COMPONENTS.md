# Component Reference

The project contains 38 components. Every component is an individual `ComponentDefinition` object in `src/components.ts` and belongs to one toolbox zone.

Each definition contains:

- `id`: stable state and connection identifier;
- `name`: visible label;
- `area`: owning toolbox zone;
- `description`: short semantic explanation and card tooltip;
- `icon`: independent PNG asset path;
- `allowedAreaIds`: valid drop targets;
- `configuration`: typed behavioural controls and defaults;
- `architecturalProperties`: possible architecture outcomes.

Components do not contain selected or missing output text. The evaluator generates explanations from the effective connected architecture.

## User and Device

### User (`user`)

Represents the person initiating access. It is a valid graph starting point and contributes no security property by itself.

### Client Device (`client-device`)

Represents a home PC, BYOD device or untrusted endpoint. Its base model allows persistent connection artifacts.

### Saytec Hardware Security Token (`saytec-hardware-security-token`)

Contributes user authentication and hardware-bound identity when it is on the active path.

### Biometric Verification (`biometric-verification`)

Contributes a directly controlled user-authentication factor.

### Client PIN (`client-pin`)

Contributes user authentication through a client/token PIN factor.

### Zero-Footprint Client (`zero-footprint-client`)

Models a client intended not to retain useful artifacts. `Persistent Configuration Enabled` defaults to false. Enabling it changes the effective `persistsConnectionArtifacts` outcome to true.

## Identity Route

### Private CA (`private-ca`)

Potentially contributes organisation-controlled identity. This property is effective only when a User Certificate or X.509 Certificate and complete Certificate Validation are all used on the active path.

### User Certificate (`user-certificate`)

Contributes certificate-based user authentication.

### X.509 Certificate (`x509-certificate`)

Contributes cryptographically verifiable certificate authentication.

### Certificate Validation (`certificate-validation`)

Provides four boolean settings:

- Certificate Checked, default true;
- Expiration Checked, default true;
- Revocation Checked, default false;
- Complete Validation, default false.

`validatesCertificate` is effective only when all four values are true.

### Certificate Revocation Check (`certificate-revocation-check`)

Represents explicit rejection of revoked certificates. It contributes certificate validation when connected, but a certificate path using the configurable Certificate Validation component must still have complete validation enabled.

### OTP (`otp`)

Adds a one-time authentication factor.

## Access Decision and Enforcement

### Saytec Server (`saytec-server`)

Provides both policy evaluation and policy enforcement on the active path.

Its configuration includes:

- Policy Timing: Before Connection or After Connection;
- Least Privilege Enabled, default true;
- Broad Role Permission, default false;
- Session Revocation Enabled, default true.

Effective least privilege requires Least Privilege Enabled and no Broad Role Permission. Pre-communication authorization requires Before Connection. Session termination requires revocation to remain enabled.

### Policy Engine (`policy-engine`)

Evaluates access policy but does not enforce it alone. Policy Timing may be Before Connection or After Connection.

### Policy Enforcement (`policy-enforcement`)

Enforces a decision. It becomes effective policy enforcement only when a Policy Engine is also on the active path. Saytec Server does not require this separate component because it performs both roles.

### Least-Privilege Control (`least-privilege-control`)

Contributes `usesLeastPrivilege` on the active path.

### Application Authorization (`application-authorization`)

Restricts access to explicitly authorised applications.

### Session Revocation (`session-revocation`)

Contributes the ability to terminate an active session.

## Connection Method

### VPN Gateway (`vpn-gateway`)

Models configurable remote access.

Access Scope choices are Full Network Access, Restricted Subnet Access and Application-Specific Route. The first two grant network access and expose network information. Application-Specific Route grants application access instead. Split Tunneling Enabled is stored for architecture state and future rule expansion.

### Network Connection (`network-connection`)

Grants network-level access and exposes network information.

### Application Connection (`application-connection`)

Grants application-level access. Application Allow List Enabled defaults to true. Parallel External Communication Restricted defaults to false.

### RAM Application Tunnel (`ram-application-tunnel`)

Grants application-level access and exposes the primary Saytec client settings:

- Encrypted RAM Tunneling Enabled, default true;
- Virtual Network Interface Enabled, default false;
- Application Allow List Enabled, default true;
- Parallel External Communication Restricted, default true;
- Persistent Configuration Enabled, default false.

Encrypted RAM becomes effective only if Encrypted RAM is also on the path. Enabling the virtual interface creates a protected-network interface and address. Allow-list and parallel-communication settings drive application restriction outcomes.

### Encrypted RAM (`encrypted-ram`)

Provides RAM protection only when the actual RAM Application Tunnel path uses it with tunnelling enabled.

### Mutual TLS (`mutual-tls`)

Contributes mutual authentication and encrypted communication.

### AES-256 Encryption (`aes-256-encryption`)

Contributes strong connection encryption.

### Perfect Forward Secrecy (`perfect-forward-secrecy`)

Contributes encrypted-session key isolation.

### Virtual Network Interface (`virtual-network-interface`)

Creates a client network interface, assigns a protected-network address and exposes network information. This is normal in many Traditional Access designs but conflicts with Saytec Post-Zero Trust isolation.

## Reachable Resources

### Corporate Network (`corporate-network`)

Represents broad protected-network reachability and visible network information.

### Restricted Subnet (`restricted-subnet`)

Represents network-level access restricted to a subnet. It remains network participation rather than application isolation.

### Internal Web Application (`internal-web-application`)

Represents an application-level internal web target.

### Administrative Application (`administrative-application`)

Represents an application-level privileged target.

### Partner Application (`partner-application`)

Represents an application exposed specifically to a partner.

### Virtual Machine (`virtual-machine`)

Represents access limited to a specific virtual machine.

### Multiple Internal Applications (`multiple-internal-applications`)

Represents broad reachability to several internal resources. It grants network access and exposes network information.

## Third-Party Systems

Third-party components live in a side lane. Their presence alone does not create a security penalty or identity dependency.

### External Identity Provider (`external-identity-provider`)

Represents Microsoft IdP, Okta or another provider. Identity Role choices are Primary Authenticator, Secondary Identity Signal, SSO After Authentication and Application-Only Dependency.

Only Primary Authenticator sets `dependsOnExternalIdentityProvider` when this component participates in the active path.

### External SSO (`external-sso`)

Uses the same Identity Role choices. It defaults to SSO After Authentication, allowing application convenience without automatically becoming the root of trust.

### External Monitoring Service (`external-monitoring-service`)

Contributes session monitoring when it participates in the active path. Monitoring can satisfy the Zero Trust requirement for session oversight when termination is unavailable.

### External Cloud Service (`external-cloud-service`)

Represents an externally hosted application or data dependency. It is recognised as a reachable resource when connected from the active path.

## Icon Assets

Every component uses its own independently generated transparent 256×256 PNG under `assets/components-individual/`. No component icon is cropped from a shared sprite sheet.
