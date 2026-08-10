# Security Analysis Output System

## Overview

The right sidebar reports architecture-level behaviour. It does not list selected components or generic missing-component warnings.

`evaluateArchitecture` returns structured facts. `renderEvaluation` turns those facts into DOM sections. Output sentences are generated from effective path properties, configuration and conflicts rather than stored in component definitions.

## Update Lifecycle

Analysis runs during initial application startup and after every successful architecture-state mutation. It also runs when the Analyze Architecture button is pressed.

A state mutation includes:

- adding or removing a component;
- adding or removing a connection;
- changing a configuration value;
- resetting the architecture;
- importing a valid architecture state.

## Sidebar Order

### Architecture Classification

The primary result. It shows one of the six supported classifications.

### Security Score

The secondary result. The percentage and circular progress ring show the property-based score. Score never overrides classification requirements.

### Access Path

Shows the connected component sequence using component names. If no complete route exists, it explains that no connected access path reaches a resource.

### Authentication Model

Explains whether authentication is effective, whether it is hardware-bound and whether it finishes before protected communication.

### Authentication Dependency

Explains whether the active path relies on an external identity provider as the primary root of trust.

### Policy Evaluation

Reports whether a connected policy component evaluates the request.

### Policy Enforcement

Reports whether the evaluation is actually enforced on the same active path.

### Connection Type

Distinguishes network-level, application-level, combined/hybrid or missing effective connection methods.

### Client Network Visibility

Explains whether protected addresses or routes become visible to the client.

### Client Reachability

Names the resource reached at the end of the active path.

### Network Participation

Explains whether the client joins or reaches the protected network, receives a protected address or remains application-isolated.

### Identified Security Openings

Lists causal findings. An empty list renders `None identified.`

Supported findings are:

- Strong Encryption With Excessive Access;
- Policy Without Enforcement;
- External Authentication Dependency;
- Private CA Not Used;
- Application Restriction After Network Exposure;
- Wrong Connection Method;
- Authorization Too Late;
- Certificate Misconfiguration.

### Recommended Architecture Changes

Produces changes from missing outcomes and exposure, such as moving policy before connection, connecting enforcement, replacing broad network access, enabling least privilege, completing certificate validation or removing a virtual interface.

## Causal Feedback Examples

Encryption plus broad network reachability produces an explanation that encryption protects traffic but does not limit what a compromised client can reach.

A Policy Engine without an enforcement component produces an explanation that a decision exists but is not applied.

A Private CA outside a complete certificate-validation chain produces an explanation that the authority is present but unused by the real identity route.

An external SSO configured after authentication does not create primary external dependency. The same component configured as Primary Authenticator does.

## Rendering Safety

All analysis text is assigned through `textContent`. The application does not insert evaluator output as HTML.
