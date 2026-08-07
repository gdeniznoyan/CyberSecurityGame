# System Architecture

The architecture follows a layered security model.

The user begins from an Access Device and passes through identity verification, secure session establishment, network protection and policy-based access control before reaching an approved application.

The main architecture flow is:

Access Device
↓
Trust and Identity Services
↓
Secure Session
↓
Invisible Network Protection
↓
Policy and Access Control
↓
Protected Application

Third-Party Services are represented as a separate optional area.

## Access Device

Represents the device used to start the connection.

Components:

- Password
- Biometric Authentication
- Hardware Security Token
- Zero-Footprint Client

## Trust and Identity Services

Provides identity verification and certificate-based trust.

Components:

- Private CA
- X.509 Certificate
- Certificate Revocation Check
- OTP

## Secure Session

Protects the communication session between the client and the protected environment.

Components:

- Mutual TLS
- RAM Tunneling
- AES-256 Encryption
- Perfect Forward Secrecy

## Third-Party Services

Represents services provided by external organizations.

Components:

- External Authentication Service
- External Cloud Storage
- External Monitoring Service
- External Payment Service

In the project's Post-Zero-Trust model, the strongest configuration avoids unnecessary third-party dependencies.

## Invisible Network Protection

Reduces the amount of internal network information exposed to the client.

Components:

- Port Cloaking
- Hidden IP Path
- No Virtual Network Interface
- No Network Participation

## Policy and Access Control

Determines what an authenticated user is allowed to access.

Components:

- Policy Engine
- Least-Privilege Access
- Application Allow List
- PAM-Like Control

## Protected Application

Represents the final resource the user wants to access.

Components:

- Internal Web Application
- Administrative Application
- Partner Application
- Virtual Machine

The client should receive access to the approved application rather than broad access to the protected corporate network.
