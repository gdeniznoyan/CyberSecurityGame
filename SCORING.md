# Security Scoring System

Each security component has a score representing its contribution to the overall architecture.

The score is calculated separately for each security area and then combined using area weights.

## Importance Levels

Components are classified as:

- Critical
- Important
- Optional
- Special

Critical components represent major Post-Zero-Trust security controls.

Important components significantly improve security but are not always mandatory.

Optional components provide additional protection.

Special components use custom evaluation rules, such as Third-Party Services and Protected Applications.

## Area Weights

Access Device: 15%

Trust and Identity Services: 20%

Secure Session: 20%

Third-Party Services: 10%

Invisible Network Protection: 20%

Policy and Access Control: 15%

Protected Application does not directly increase the Security Score because it represents the target instead of a security control.

## Area Score

Each area's score is calculated using:

Selected component points
/
Maximum possible points in the area
×
100

## Final Security Score

Final Security Score is calculated by multiplying each area score by its weight.

Final Score =

Access Device Score × 0.15
+
Trust and Identity Score × 0.20
+
Secure Session Score × 0.20
+
Third-Party Score × 0.10
+
Invisible Network Protection Score × 0.20
+
Policy and Access Control Score × 0.15

The final result is limited to the range 0–100.

## Security Levels

0–24:
Very Low Security

25–49:
Low Security

50–69:
Medium Security

70–84:
High Security

85–94:
Very High Security

95–100:
Post-Zero Trust

A high numerical score alone is not enough to qualify as Post-Zero Trust.

Critical architecture requirements must also be satisfied, especially:

- No Network Participation
- No Virtual Network Interface
- RAM Tunneling
- Policy Engine
- Least-Privilege Access
- Strong certificate-based trust

Third-party dependencies may reduce the Post-Zero-Trust result.
