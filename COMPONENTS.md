# Security Components

## Access Device

### Password

Provides basic user authentication using a secret known by the user.

Importance:
Optional

Selected Output:
Basic password authentication is enabled to verify the user's identity.

---

### Biometric Authentication

Uses physical characteristics such as fingerprint or facial recognition as an authentication factor.

Importance:
Important

Selected Output:
Biometric verification adds an additional identity factor that is difficult to share or steal.

Missing Output:
Biometric verification is missing, reducing the strength of user identity verification.

---

### Hardware Security Token

Uses dedicated protected hardware for sensitive authentication and cryptographic operations.

Importance:
Critical

Selected Output:
Sensitive authentication and cryptographic operations are protected by a dedicated hardware security token.

Missing Output:
No hardware security token is used, leaving sensitive authentication operations more dependent on the client device.

---

### Zero-Footprint Client

Prevents useful session and network information from remaining on the client after the session ends.

Importance:
Critical

Selected Output:
The session is designed to leave no useful access or network traces on the client after it ends.

Missing Output:
The client may retain useful session or network artifacts after access ends, increasing exposure if the device is compromised.

---

# Trust and Identity Services

### Private CA

Allows the organization to manage its own certificate trust infrastructure.

Importance:
Critical

Selected Output:
Trust is managed internally through a private certificate authority instead of relying on an external identity dependency.

Missing Output:
No private certificate authority is present, weakening the organization's control over certificate-based trust.

---

### X.509 Certificate

Provides a cryptographically verifiable digital identity.

Importance:
Critical

Selected Output:
X.509 certificates provide cryptographically verifiable identities for trusted users, devices or services.

Missing Output:
Certificate-based identity verification is missing, weakening cryptographic trust between system components.

---

### Certificate Revocation Check

Checks whether a certificate has been revoked or is no longer trusted.

Importance:
Important

Selected Output:
Certificate status is checked so revoked or compromised certificates cannot continue to be trusted.

Missing Output:
Revoked or compromised certificates may remain usable if their status is not checked.

---

### OTP

Provides a temporary one-time authentication code.

Importance:
Optional

Selected Output:
A one-time password adds an additional authentication factor for user verification.

---

# Secure Session

### Mutual TLS

Authenticates both the client and the server using certificates.

Importance:
Important

Selected Output:
Mutual TLS verifies both sides of the connection before establishing the secure session.

Missing Output:
The client and server are not mutually authenticated, weakening trust between both ends of the connection.

---

### RAM Tunneling

Keeps session information in temporary memory instead of persistent storage.

Importance:
Critical

Selected Output:
The secure session operates in temporary memory, reducing persistent traces on the client device.

Missing Output:
Session information may leave persistent traces on the client, weakening the zero-trace security model.

---

### AES-256 Encryption

Protects session data using strong encryption.

Importance:
Critical

Selected Output:
Session data is protected with strong AES-256 encryption against unauthorized reading.

Missing Output:
Session data lacks the intended strong encryption protection and may be more exposed if intercepted.

---

### Perfect Forward Secrecy

Uses independent session keys to reduce the impact of future key compromise.

Importance:
Important

Selected Output:
Independent session keys help protect previous sessions even if a future key is compromised.

Missing Output:
Compromise of long-term cryptographic material may have a greater impact on previously protected sessions.

---

# Third-Party Services

### External Authentication Service

Uses an external provider for authentication.

Importance:
Special

Selected Output:
Authentication depends on an external provider, introducing a third-party trust and availability dependency.

---

### External Cloud Storage

Stores organizational data using an external cloud provider.

Importance:
Special

Selected Output:
Sensitive data is stored outside the organization, introducing dependency on an external provider's security controls.

---

### External Monitoring Service

Sends security logs or operational information to an external monitoring provider.

Importance:
Special

Selected Output:
Security logs and operational information are shared with an external monitoring provider.

---

### External Payment Service

Processes payments using an external provider.

Importance:
Special

Selected Output:
Payment operations depend on an external service, introducing an additional third-party trust relationship.

---

# Invisible Network Protection

### Port Cloaking

Hides protected service ports from unauthorized discovery.

Importance:
Important

Selected Output:
Protected service ports are hidden from unauthorized discovery, reducing the visible attack surface.

Missing Output:
Network services may be easier to discover, increasing the visible attack surface.

---

### Hidden IP Path

Hides backend IP addresses and routing information from the client.

Importance:
Critical

Selected Output:
Backend IP addresses and routing information remain hidden from the client device.

Missing Output:
Backend addresses or network paths may become visible, making internal infrastructure easier to discover.

---

### No Virtual Network Interface

Prevents a corporate virtual network adapter from being created on the client.

Importance:
Critical

Selected Output:
No corporate virtual network interface is created on the client device.

Missing Output:
A virtual network interface may expose additional corporate network information to the client device.

---

### No Network Participation

Prevents the client from becoming a direct member of the protected corporate network.

Importance:
Critical

Selected Output:
The client accesses approved applications without becoming a member of the protected network.

Missing Output:
The client may gain unnecessary network participation or visibility, increasing the risk of network discovery and lateral movement.

---

# Policy and Access Control

### Policy Engine

Evaluates access requests according to security policies.

Importance:
Critical

Selected Output:
Access requests are evaluated against security policies before access is granted.

Missing Output:
Access requests cannot be centrally evaluated against security policies, weakening dynamic access control.

---

### Least-Privilege Access

Provides only the minimum permissions required for the user's task.

Importance:
Critical

Selected Output:
The user receives only the minimum permissions required to access approved resources.

Missing Output:
Users may receive broader permissions than necessary, increasing the impact of a compromised account.

---

### Application Allow List

Allows access only to explicitly approved applications.

Importance:
Important

Selected Output:
Access is restricted to explicitly approved applications.

Missing Output:
Application access is not restricted by an allow list, increasing the possibility of access to unnecessary resources.

---

### PAM-Like Control

Adds stronger access controls for privileged or administrative accounts.

Importance:
Optional

Selected Output:
Privileged and administrative access receives additional security control and restriction.

---

# Protected Application

### Internal Web Application

Represents an approved internal web application.

Importance:
Special

Selected Output:
Access is limited to an approved internal web application instead of the entire corporate network.

---

### Administrative Application

Represents a privileged administrative application.

Importance:
Special

Selected Output:
Access is restricted to an approved administrative application with controlled privileged access.

---

### Partner Application

Represents an application made available to approved external partners.

Importance:
Special

Selected Output:
The partner receives access only to the approved application without receiving general corporate network access.

---

### Virtual Machine

Represents an approved virtual machine that the user may access.

Importance:
Special

Selected Output:
Access is limited to the approved virtual machine without exposing the broader protected network.
