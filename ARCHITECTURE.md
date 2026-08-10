# Architecture Model

## Purpose

The builder models the behaviour of a connected access architecture. The user does not choose an architecture label. The evaluator derives the label from the active path, effective component properties and configuration conflicts.

## Architecture Zones

The main access path contains five zones in order:

1. User and Device
2. Identity Route
3. Access Decision and Enforcement
4. Connection Method
5. Reachable Resources

Third-Party Systems is displayed as a separate side lane. Its components may connect to identity, decision or resource components without automatically becoming the root of trust.

Zones are organisational UI boundaries. They do not themselves provide security, output text, scoring or component-specific rules.

## Directed Access Graph

Every connection has a source component and a target component. The evaluator builds a directed adjacency graph from saved connections.

Path discovery starts at a placed `User` or `Client Device`. Breadth-first traversal follows outgoing connections until it reaches a recognised resource. The first complete reachable route becomes the active access path.

If no complete route reaches a resource, the result is `Incomplete Architecture`.

Only components on the active path contribute effective architectural properties. This prevents unused controls from improving the result merely because they are present on the canvas.

## Effective Architectural Properties

Components describe possible architectural outcomes through `ArchitectureProperties`. Important properties include:

- user authentication and pre-communication authentication;
- external or organisation-controlled identity dependency;
- hardware-bound identity;
- policy evaluation and enforcement;
- application-level or network-level access;
- virtual interface and protected-network address creation;
- network-information exposure;
- encrypted RAM and persistent artifacts;
- session termination and monitoring;
- least privilege and application restriction;
- certificate validation and connection encryption.

Static properties are merged only from the active path. Configuration-sensitive rules then refine or cancel them.

Examples:

- Private CA becomes effective organisational trust only when a user/X.509 certificate and complete certificate validation are also on the active path.
- Policy Engine evaluates policy, but enforcement remains false unless Policy Enforcement or Saytec Server is connected on the path.
- Saytec Server provides both evaluation and enforcement, but its timing, least-privilege and revocation outcomes depend on configuration.
- Encrypted RAM is effective only when it and RAM Application Tunnel are both in the path and encrypted RAM tunnelling is enabled.
- VPN Gateway can grant full network access, restricted subnet access or an application-specific route according to its access-scope setting.
- An external provider creates an external identity dependency only when it is in the path and configured as Primary Authenticator.

## Architecture Classifications

### Incomplete Architecture

No complete directed path connects a user/client start to a reachable resource.

### Traditional Access

The active path grants network-level access. Typical outcomes include a virtual interface, protected-network address, visible network information, corporate network access, restricted subnet access or several reachable internal applications.

Traditional Access is not automatically unsafe. It may use strong authentication and encryption while intentionally granting network reachability.

### Zero Trust

Zero Trust requires effective user authentication before communication, policy evaluation, policy enforcement, least privilege, explicit application restriction, session termination or monitoring, and no broad network access. An external identity provider may be the authenticator.

### Saytec Post-Zero Trust

All of the following must be effective on the path:

- the user is authenticated before protected communication;
- identity is hardware-bound;
- critical identity does not depend on an external primary authenticator;
- an organisation-controlled CA and completely validated certificate chain are used;
- policy is evaluated and enforced;
- least privilege and application restriction are active;
- session termination is supported;
- access is application-specific;
- RAM Application Tunnel uses Encrypted RAM;
- no virtual network interface or protected-network address is created;
- no broad network access or network-information exposure exists.

External SSO may appear after Saytec authentication as application convenience without becoming the root of trust.

### Hybrid Architecture

Hybrid is returned when application-level and network-level outcomes coexist, or when conflicting controls weaken otherwise isolated access. Examples include application restrictions after broad network exposure, a Private CA unused by the real identity path, or a Saytec identity route combined with a virtual network interface.

### Broken or Unsafe Architecture

Broken or Unsafe is returned for critical failures such as policy without enforcement, authorization after connection establishment, or incomplete certificate validation on a certificate path.

## Conflict Priority

Exposure takes precedence over weaker isolation claims. If both `grantsApplicationAccess` and `grantsNetworkAccess` are true, the evaluator does not claim pure application isolation. A virtual interface, protected-network address or exposed routing information similarly prevents a Saytec Post-Zero Trust result.

## State Persistence

Exported JSON contains three structures:

- `placements`: component and zone pairs;
- `connections`: directed source and target pairs;
- `configurations`: current values keyed by component ID.

Import validates component existence, allowed zones, uniqueness, connection endpoints and configuration field types before replacing live state.
