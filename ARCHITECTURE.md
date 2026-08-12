# Architecture

The application stores a graph, not just a list of selected components.

## Stored State

- A placement stores the component ID, its canvas area and current configuration.
- A connection stores a source component ID and a target component ID.
- Removing a component also removes every connection that references it.
- Reset clears all placements and connections.

## Evaluation Path

The evaluator starts from placed components in `User and Device`. It follows outgoing connections and finds a route that ends in `Reachable Resources`. If several routes exist, the longest complete route is evaluated.

Components outside the selected route do not automatically provide security. For example, a Private CA does not establish organization-controlled trust unless a certificate and validation are also active on the same route.

## Effective Properties

Component properties and configuration are converted into architecture behavior such as:

- authenticates the user;
- evaluates and enforces policy;
- grants network-level or application-level access;
- creates a virtual network interface;
- exposes protected network information;
- uses encrypted RAM;
- applies least privilege;
- validates certificates.

Conflicting properties are preserved. Application access does not hide the risk when the same route also grants broad network access.

## Area Rules

Each component declares its compatible areas. A component can be placed once. `Reachable Resources` accepts one target, while the other areas may contain multiple compatible components.
