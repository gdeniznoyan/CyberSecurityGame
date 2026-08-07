# Code Structure

The project is organized so that architecture data, evaluation logic and user interface logic are separated from each other.

## areas.ts

Contains the Architecture Canvas area definitions.

This file stores information such as:

- Area ID
- Area name
- Area description

It does not store component outputs or scores.

## components.ts

Contains all security component objects.

Each component is stored as its own object.

A component may contain:

- ID
- Name
- Area
- Description
- Importance level
- Score
- Selected output
- Missing output

The component's security behavior belongs to the component itself rather than to the area.

## architecture.ts

Contains shared TypeScript types and interfaces.

Examples include:

- Area IDs
- Component types
- Importance levels
- Evaluation result types

This file defines the structure of the data used by the rest of the application.

## evaluationService.ts

Contains the security evaluation logic.

This file determines:

- Which components are selected
- Which critical components are missing
- Which important components are missing
- Component scores
- Area scores
- Final Security Score
- Third-party dependency results
- Post-Zero-Trust eligibility

The evaluation service reads the necessary information from component objects.

It should not contain large hardcoded lists of component-specific output messages.

## outputRenderer.ts

Controls how evaluation results are displayed in the Security Analysis panel.

This file is responsible for displaying sections such as:

- Selected Security Controls
- Missing Critical Controls
- Recommended Improvements
- Third-Party Dependencies
- Target Application

It receives evaluation results and renders them in the user interface.

It does not decide the security meaning of individual components.

## main.ts

Connects the main parts of the application.

It manages:

- Drag and drop
- Adding components
- Removing components
- Updating the Architecture Canvas
- Triggering security evaluation
- Refreshing the output panel

## HTML Files

HTML files contain the structure of the user interface.

They define elements such as:

- Toolbox
- Architecture Canvas
- Security Analysis panel
- Score display
- Buttons

## CSS Files

CSS files contain the visual design of the application.

They manage:

- Layout
- Component appearance
- Canvas styling
- Security result panel
- Responsive design
- Drag-and-drop visual feedback
