# Cybersecurity Architecture Builder

This project is a browser-based security architecture game built with HTML, CSS and TypeScript. It does not use a framework.

## User Flow

1. The toolbox displays the component objects defined in `src/components.ts`.
2. A component can only be dropped into one of its `allowedAreaIds`.
3. A placed component receives its default configuration.
4. The user connects placed components with the connect button.
5. The evaluator follows the connected route from a device to a protected resource.
6. Only properties active on that route affect classification and score.
7. The canvas and Security Analysis update after every state change.

## Main Access Flow

User and Device -> Identity Route -> Access Decision and Enforcement -> Connection Method -> Reachable Resources

Third-Party Systems are shown separately. They affect the result only when connected to the evaluated route.

## Possible Results

- Traditional Access
- Zero Trust
- Saytec Post-Zero Trust
- Hybrid Architecture
- Incomplete Architecture
- Broken or Unsafe Architecture

## Build

Run `npm run build`. TypeScript compiles the files in `src` into browser-ready JavaScript in `dist`.
