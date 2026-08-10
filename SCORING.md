# Security Scoring System

## Role of the Score

The numerical score is secondary to architecture classification. It summarises effective security outcomes on the discovered access path. It is not calculated from the number of placed components.

A score of 100 does not automatically create a Saytec Post-Zero Trust result. Classification still requires every mandatory architectural outcome.

## Positive Property Values

The evaluator starts at zero and adds points for effective properties:

- User authentication adds 10.
- Authentication before communication adds 8.
- Hardware-bound identity adds 7.
- Organisation-controlled identity adds 7.
- Policy evaluation adds 9.
- Policy enforcement adds 11.
- Least privilege adds 9.
- Application restriction adds 8.
- Session termination adds 6.
- Connection encryption adds 8.
- Encrypted RAM adds 8.
- Restricted parallel applications adds 4.
- Complete certificate validation adds 5.

The maximum positive total is 100.

## Exposure Deductions

The evaluator subtracts points for effective exposure:

- Network-level access subtracts 12.
- A virtual network interface subtracts 8.
- Exposed network information subtracts 7.
- Primary external identity dependency subtracts 5.
- Persistent connection artifacts subtract 5.

## Security-Opening Deduction

Each detected security opening subtracts 6 additional points. This deduction is applied after property additions and exposure deductions.

## Final Formula

The implemented calculation is:

```text
raw score =
  sum of effective positive property values
  - effective exposure deductions
  - (identified opening count × 6)

final score = round(raw score), limited to 0 through 100
```

## Why Properties Must Be Effective

A component's static definition does not immediately add score. It must be on the actual access path, and relationship/configuration rules must make the property effective.

Examples:

- Encrypted RAM scores only when the active RAM Application Tunnel uses it.
- Private CA scores only when a certificate and complete validation use its trust chain.
- Policy Enforcement scores only when policy is also evaluated.
- External Identity Provider is deducted only when it is the connected Primary Authenticator.
- An unused component elsewhere on the canvas contributes nothing.

## Classification Is Independent

After openings and effective properties are derived, classification rules run independently of score thresholds.

For example, broad network access may still be classified as Traditional Access even when strong controls produce a respectable score. Conversely, an application-isolated path cannot be Saytec Post-Zero Trust if hardware identity, organisation-controlled trust, pre-connection policy, RAM protection or network-isolation conditions are missing.
