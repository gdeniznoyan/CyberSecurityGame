# Security Analysis

Security Analysis is produced dynamically from the effective access path. Component descriptions are only UI help text and are never used to classify the architecture.

## Evaluation Sequence

1. Find a connected route from `User and Device` to `Reachable Resources`.
2. Read the component properties on that route.
3. Apply configuration values such as policy timing, identity role and access level.
4. Resolve dependent properties such as certificate trust.
5. Detect unsafe or conflicting outcomes.
6. Select the architecture classification.
7. Calculate the secondary numerical score.
8. Generate analysis sentences from the resulting state.

## Panel Content

- Architecture Classification: the primary result.
- Security Score: a supporting 0-100 value.
- Access Path: the route currently evaluated.
- Authentication Model: whether identity is effective and hardware-bound.
- Authentication Dependency: whether primary authentication is external.
- Policy Evaluation and Enforcement: whether decisions are both made and applied.
- Connection Type: application, network or hybrid access.
- Client Visibility and Reachability: what the client can see and reach.
- Network Participation: whether the client joins the protected network.
- Detected Openings: conflicts found by the evaluator.
- Recommended Change: the first corrective action.

The panel refreshes after placement, removal, connection and configuration changes.
