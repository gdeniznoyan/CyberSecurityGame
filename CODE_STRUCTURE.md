# Code Structure

This document explains how the complete application is organised and how control moves through it at runtime.

## Root Files

### `index.html`

Defines the static page shell. Important elements are:

- `reset-button` resets all architecture state.
- `analyze-button` manually requests analysis, although analysis also updates after state changes.
- `architecture-canvas` receives the generated canvas zones and connection/configuration controls.
- `component-toolbox` receives generated toolbox groups and component buttons.
- `architecture-classification-value` shows the primary classification.
- `security-score-value` and `.security-score-chart` show the secondary score.
- `result-insights` receives architecture-level analysis sections.
- `state-dialog`, `state-json`, export/import controls and error elements implement JSON persistence.

The only application script loaded by HTML is `dist/main.js`.

### `css/style.css`

Contains the complete visual system: page/sidebar/header layout, canvas zones, third-party side lane, component cards, drag states, placed-component galleries, connection editor, configuration controls, analysis sidebar, score ring, dialog and responsive breakpoints.

The generated images are under:

- `assets/components-individual/` for 38 individually generated component icons;
- `assets/architecture-zones/` for six independently generated canvas illustrations.

## TypeScript Files

### `src/types.ts`

Defines every shared contract.

`AreaId` is the exact union of six zone IDs.

`ArchitectureArea` stores zone ID, name, description and optional `sideLane` display metadata.

`ArchitectureProperties` contains behavioural outcomes. These booleans are not component scores.

`BooleanConfigurationField` and `SelectConfigurationField` describe typed UI controls. `ConfigurationSchema`, `ConfigurationValue` and `ComponentConfiguration` form the complete configuration model.

`ComponentDefinition` requires ID, name, owning area, description, icon, allowed areas, configuration schema and possible architectural properties. It contains no prewritten selected/missing output.

`Placement` records a component in a zone. `ComponentConnection` records a directed edge.

`ArchitectureState` is the serialisable combination of placements, connections and configurations.

`ArchitectureClassification` limits results to six supported labels.

`ArchitectureAnalysis` is the evaluator result consumed by the renderer.

### `src/areas.ts`

Creates every area as its own object and combines them in `architectureAreas`. The array order drives toolbox order and main-path rendering. Third-Party Systems has `sideLane: true`, so the renderer places it beside the main path.

### `src/components.ts`

Creates each of the 38 components as a separate typed object. `componentList` combines them for toolbox rendering and lookup. A private map supports `getComponentById`.

`getDefaultConfiguration` reads each schema and creates a key/value object from field defaults. Defaults therefore remain next to the component that owns them.

### `src/state.ts`

Owns all mutable application state. Its internal variables are not exported directly.

Read functions return copies to prevent external mutation:

- `getPlacements`
- `getConnections`
- `getComponentConfiguration`
- `getArchitectureState`

Mutation functions validate before changing state:

- `addPlacement`
- `removePlacement`
- `addConnection`
- `removeConnection`
- `updateComponentConfiguration`
- `resetArchitecture`
- `replaceArchitecture`

`removePlacement` also deletes every edge touching that component and removes its configuration. Each successful mutation calls `emit`. Subscribers registered with `subscribe` then rerender and reevaluate the app.

### `src/evaluator.ts`

Implements architecture intelligence.

`findAccessPath` constructs adjacency from directed connections and performs breadth-first path discovery.

`mergePathProperties` merges possible properties only from components on the active path.

`applyConfiguration` derives configuration-sensitive outcomes and relationships such as certificate-chain use, policy enforcement, VPN scope, RAM protection and identity-provider role.

`buildOpenings` detects named security conflicts and misconfigurations.

`isPostZeroTrust` and `isZeroTrust` check complete required outcomes.

`classify` applies classification priority: incomplete, critical unsafe states, hybrid conflicts, Saytec Post-Zero Trust, Zero Trust, Traditional Access and remaining incomplete/hybrid cases.

`calculateScore` produces the secondary effective-property score.

`recommendations` converts missing outcomes and exposure into actionable changes.

`evaluateArchitecture` is the public entry point. It returns the classification, score, path, properties and every explanation needed by the sidebar.

### `src/renderer.ts`

Creates DOM from state and definitions.

`renderArchitecture` renders the five-zone main path, Third-Party side lane, placed component icons, Connect/Configure/Remove actions, connection list and configuration panel.

`renderToolbox` groups all components by owning area and makes each card draggable.

`renderEvaluation` calls the evaluator and renders classification, access path, authentication model/dependency, policy status, connection type, visibility, reachability, network participation, openings, recommendations and score.

`renderBuilder` rerenders canvas and toolbox. Small module variables track the currently selected connection source and configuration component.

### `src/dragDrop.ts`

Uses event delegation on toolbox and canvas.

It supports native drag-and-drop, click-to-select placement, compatible-zone highlighting, component removal, two-step Connect/Link creation, connection deletion and configuration input changes. It delegates validation and persistence to `state.ts` rather than owning architecture data.

### `src/main.ts`

Is the application entry point.

Initialization renders the UI, performs the first analysis, subscribes to state changes and activates drag-and-drop. Every state mutation calls `renderBuilder` and `renderEvaluation` through the subscription.

It also wires Reset, Analyze, Export, Import, clipboard copy and dialog feedback.

## Runtime Data Flow

1. `main.ts` initializes renderer and event handlers.
2. `renderer.ts` reads areas, components and state to build the UI.
3. A user action reaches `dragDrop.ts` or a header/dialog handler.
4. The action calls a validated mutation in `state.ts`.
5. `state.ts` emits a change notification.
6. `main.ts` rerenders the builder and requests evaluation.
7. `evaluator.ts` discovers the active graph path and derives effective outcomes.
8. `renderer.ts` writes the new classification, explanations and score to the sidebar.

## Build Output

`npm run build` executes TypeScript with `strict`, `noEmitOnError`, ES2022 modules and source maps. Generated files in `dist/` mirror TypeScript source names. Source files, not `dist`, are the editing authority.
