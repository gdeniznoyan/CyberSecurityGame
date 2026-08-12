# Classification and Score

Classification is the primary result. The numerical score is secondary and cannot independently produce Saytec Post-Zero Trust.

## Classification Order

1. No complete route: `Incomplete Architecture`.
2. Severe configuration conflict: `Broken or Unsafe Architecture`.
3. All Saytec requirements satisfied: `Saytec Post-Zero Trust`.
4. Identity, policy, least privilege and application-only requirements satisfied: `Zero Trust`.
5. Both network and application access: `Hybrid Architecture`.
6. Network access without a severe conflict: `Traditional Access`.
7. Any remaining invalid route: `Broken or Unsafe Architecture`.

## Detected Conflicts

- Policy evaluation without effective enforcement
- Strong encryption combined with excessive network access
- RAM tunneling with external primary authentication
- Private CA present but not used by the certificate route
- Application restrictions applied after network exposure
- Hardware-bound identity combined with a virtual network interface
- Policy authorization performed after connection
- Certificate used without complete validation

## Score Calculation

The score starts at 10 for a complete route.

Positive points include authentication, pre-connection verification, organization-controlled trust, hardware identity, policy evaluation and enforcement, encrypted RAM, session revocation, least privilege, application restrictions, certificate validation and application-only access.

Risk deductions include external primary authentication, network-level access, virtual network interfaces, protected address assignment, visible network information and persistent connection artifacts.

Each detected opening removes 4 additional points. The final result is rounded and limited to 0-100.
