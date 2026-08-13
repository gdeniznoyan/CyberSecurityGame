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

The score is built from six explicit point groups. A control earns points only when it is effective on the connected access path.

- Complete access path: 10 points.
- Authentication strength: 20 points.
- Policy and access control: 20 points.
- Secure connection and session handling: 20 points.
- Client and network isolation: 20 points.
- Organization-controlled trust: 10 points.

The maximum score is 100. Missing controls simply do not earn their points. Detected architectural conflicts then apply the following deductions:

- Policy without enforcement: -10.
- Authorization after connection: -10.
- Certificate misconfiguration: -8.
- External authentication dependency in a RAM-based route: -8.
- Hardware identity combined with the wrong connection method: -8.
- Application restriction after network exposure: -6.
- Strong encryption with excessive network access: -5.
- Private CA present but unused: -5.

The final result is rounded and constrained to 0-100. Classification remains the primary result: a high numerical score cannot independently produce Zero Trust or sayTRUST Post-Zero Trust.
