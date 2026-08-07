# Security Analysis Output System

The Security Analysis panel explains why the current architecture is secure or insecure.

Outputs are generated from the component objects.

Each security component can contain:

- selectedOutput
- missingOutput
- importance

## Selected Components

When a component is selected, its selectedOutput is displayed.

Example:

RAM Tunneling

The secure session operates in temporary memory, reducing persistent traces on the client device.

## Missing Critical Components

If a Critical component is not selected, its missingOutput is displayed.

Example:

No Network Participation

The client may gain unnecessary network participation or visibility, increasing the risk of network discovery and lateral movement.

## Missing Important Components

If an Important component is not selected, its missingOutput can be displayed as a recommended security improvement.

## Optional Components

If an Optional component is selected, its selectedOutput is displayed.

If it is not selected, no warning is required.

## Third-Party Services

Third-Party components use different evaluation logic.

When a Third-Party Service is selected, its dependency warning is displayed.

If no Third-Party Services are selected, one positive result is displayed explaining that unnecessary external trust dependencies have been avoided.

## Protected Application

Protected Application components represent targets rather than security controls.

When a target is selected, the output explains what resource is being accessed.

If no target is selected, the analysis displays a warning that the architecture does not have a valid destination.

## Automatic Updates

The Security Analysis panel is recalculated whenever:

- A component is added
- A component is removed
- A component is moved
- The protected target changes

Outputs should always reflect the current Architecture Canvas state.
