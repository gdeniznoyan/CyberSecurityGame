# Components

The toolbox is generated from `componentList` in `src/components.ts`. Every entry below is a separate TypeScript object rather than an anonymous object inside the list.

A component contains:

- `id`: stable kebab-case identifier used by placement and connections;
- `area`: its toolbox category and normal canvas destination;
- `description`: hover and settings help text;
- `icon`: its SVG asset path;
- `allowedAreaIds`: valid drag-and-drop targets;
- `configuration`: boolean or select settings with defaults;
- `architecturalProperties`: behavior contributed when the component is effective on the active route.

Descriptions do not affect evaluation. The evaluator uses IDs, connections, configuration and architectural properties.

## User and Device

- Client Device
- Secure Device
- sayTRUST Hardware Security Token
- Biometric Verification
- Client PIN

## Identity Route

- Private CA
- User Certificate
- X.509 Certificate
- Certificate Validation
- Certificate Revocation Check
- OTP

## Access Decision and Enforcement

- sayTRUST Server
- Policy Engine
- Client Privilege Management
- Least-Privilege Control
- Application Authorization
- Session Revocation

## Connection Method

- Gateway
- Network Connection
- Application Connection
- RAM Application Tunnel
- Encrypted RAM
- Mutual TLS
- AES-256 Encryption
- Perfect Forward Secrecy
- Virtual Network Interface

## Reachable Resources

- Corporate Network
- Restricted Subnet
- Internal Web Application
- Virtual Machine

## Third-Party Systems

- External Identity Provider
- External Authentication Service
- External Cloud Service
- External Monitoring Service

Each component is a separate object in `src/components.ts` with an ID, name, area, description, icon, configuration and architectural properties.
