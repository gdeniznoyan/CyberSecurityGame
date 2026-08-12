# Code Structure

## Runtime Flow

`main.ts` starts the application, then `renderer.ts` draws the UI. User actions are handled by `dragdrop.ts`, which updates `state.ts`. State notifies its subscribers, causing the builder and evaluator output to render again.

## Files

### `index.html`

Contains the permanent page structure and mount points for the canvas, toolbox, settings and Security Analysis.

### `css/style.css`

Controls the visual layout, responsive behavior, drag highlights, component cards, connection list, settings panel and score ring.

### `src/types.ts`

Defines the shared contracts: area IDs, component definitions, configuration types, placements, connections, architecture properties and evaluation results.

### `src/areas.ts`

Defines the six canvas areas. Area objects contain only an ID, name and description.

### `src/components.ts`

Defines every component as a separate object. Each object contains its identity, compatible area, description, icon, configuration schema and base architectural properties. It also builds the shared `componentList` and default configuration values.

### `src/state.ts`

Owns the current placements and connections. It validates placement, prevents duplicates, stores configuration changes and removes orphaned connections when a component is deleted.

### `src/dragdrop.ts`

Handles dragging, click-to-select placement, valid-area highlighting, component removal, connection creation/removal and configuration form changes.

### `src/evaluator.ts`

Finds the effective access path, derives active properties, detects conflicts, chooses a classification, calculates the score and creates causal analysis text.

### `src/renderer.ts`

Builds the canvas stages, component toolbox, placed component controls, Third-Party lane, connection list, settings panel and Security Analysis cards.

### `src/main.ts`

Initializes rendering and event handlers. It subscribes to state changes and connects the Reset button to the state reset operation.

### `dist`

Contains generated JavaScript. Edit files in `src`, then run `npm run build`; do not edit `dist` manually.
