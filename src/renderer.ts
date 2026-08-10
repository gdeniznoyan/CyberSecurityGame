import { architectureAreas } from "./areas.js";
import { componentList, getComponentById } from "./components.js";
import { evaluateArchitecture } from "./evaluator.js";
import {
  getComponentConfiguration,
  getConnections,
  getPlacements,
} from "./state.js";
import type {
  ArchitectureAnalysis,
  AreaId,
  ComponentDefinition,
} from "./types.js";

const areaVisuals: Record<AreaId, string> = {
  "user-device": "./assets/architecture-zones/user-device.png",
  "identity-route": "./assets/architecture-zones/identity-route.png",
  "access-decision-enforcement":
    "./assets/architecture-zones/access-decision-enforcement.png",
  "connection-method": "./assets/architecture-zones/connection-method.png",
  "reachable-resources": "./assets/architecture-zones/reachable-resources.png",
  "third-party-systems": "./assets/architecture-zones/third-party-systems.png",
};

let configuredComponentId: string | null = null;
let connectionSourceId: string | null = null;

export function getConnectionSourceId(): string | null {
  return connectionSourceId;
}

export function setConnectionSourceId(id: string | null): void {
  connectionSourceId = id;
  renderArchitecture();
}

export function setConfiguredComponentId(id: string | null): void {
  configuredComponentId = id;
  renderArchitecture();
}

function componentVisual(definition: ComponentDefinition): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const box = document.createElement("span");
  box.className = "component-image";
  const image = document.createElement("img");
  image.src = definition.icon;
  image.alt = "";
  image.addEventListener("error", () => box.remove());
  box.append(image);
  const label = document.createElement("span");
  label.className = "component-label";
  label.textContent = definition.name;
  fragment.append(box, label);
  return fragment;
}

function renderArea(areaId: AreaId): HTMLElement {
  const area = architectureAreas.find((item) => item.id === areaId);
  const section = document.createElement("article");
  section.className = "architecture-section";
  section.dataset.areaId = areaId;
  const heading = document.createElement("h3");
  heading.textContent = area?.name ?? areaId;
  const imageBox = document.createElement("div");
  imageBox.className = "image-placeholder";
  const image = document.createElement("img");
  image.src = areaVisuals[areaId];
  image.alt = "";
  imageBox.append(image);
  const zone = document.createElement("div");
  zone.className = "drop-slot area-drop-zone";
  zone.dataset.areaId = areaId;
  const placed = getPlacements().filter((item) => item.areaId === areaId);
  if (placed.length) {
    imageBox.classList.add("placed-icon-gallery");
    imageBox.replaceChildren(
      ...placed.flatMap(({ componentId }) => {
        const definition = getComponentById(componentId);
        if (!definition) return [];
        const placedIcon = document.createElement("img");
        placedIcon.src = definition.icon;
        placedIcon.alt = definition.name;
        placedIcon.title = definition.name;
        return [placedIcon];
      }),
    );
  }
  if (!placed.length) {
    const placeholder = document.createElement("span");
    placeholder.className = "slot-placeholder";
    placeholder.textContent = "Drop compatible components here";
    zone.append(placeholder);
  } else {
    zone.classList.add("occupied");
    const list = document.createElement("div");
    list.className = "placed-components";
    placed.forEach(({ componentId }) => {
      const definition = getComponentById(componentId);
      if (!definition) return;
      const row = document.createElement("div");
      row.className = "placed-component";
      if (connectionSourceId === componentId)
        row.classList.add("connection-source");
      const identity = document.createElement("span");
      identity.className = "placed-component-identity";
      const icon = document.createElement("img");
      icon.className = "placed-component-icon";
      icon.src = definition.icon;
      icon.alt = "";
      const name = document.createElement("span");
      name.textContent = definition.name;
      identity.append(icon, name);
      const actions = document.createElement("span");
      actions.className = "placed-component-actions";
      const connect = document.createElement("button");
      connect.type = "button";
      connect.className = "component-action-button";
      connect.dataset.connectComponent = componentId;
      connect.textContent = connectionSourceId ? "Link" : "Connect";
      actions.append(connect);
      if (Object.keys(definition.configuration).length) {
        const configure = document.createElement("button");
        configure.type = "button";
        configure.className = "component-action-button";
        configure.dataset.configureComponent = componentId;
        configure.textContent = "Configure";
        actions.append(configure);
      }
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-button";
      remove.dataset.removeComponent = componentId;
      remove.dataset.areaId = areaId;
      remove.textContent = "×";
      actions.append(remove);
      row.append(identity, actions);
      list.append(row);
    });
    zone.append(list);
  }
  section.append(heading, imageBox, zone);
  return section;
}

function renderConnections(): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "architecture-model-controls";
  const heading = document.createElement("h3");
  heading.textContent = "Component Connections";
  const help = document.createElement("p");
  help.textContent = connectionSourceId
    ? "Choose Link on the destination component."
    : "Choose Connect on a source component, then Link on its destination.";
  const list = document.createElement("div");
  list.className = "connection-list";
  const connections = getConnections();
  if (!connections.length) {
    const empty = document.createElement("span");
    empty.className = "connection-empty";
    empty.textContent = "No connections yet.";
    list.append(empty);
  }
  connections.forEach((connection) => {
    const row = document.createElement("div");
    row.className = "connection-row";
    const label = document.createElement("span");
    label.textContent = `${getComponentById(connection.sourceComponentId)?.name ?? connection.sourceComponentId} → ${getComponentById(connection.targetComponentId)?.name ?? connection.targetComponentId}`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.removeConnectionSource = connection.sourceComponentId;
    remove.dataset.removeConnectionTarget = connection.targetComponentId;
    remove.textContent = "Remove";
    row.append(label, remove);
    list.append(row);
  });
  panel.append(heading, help, list, renderConfiguration());
  return panel;
}

function renderConfiguration(): HTMLElement {
  const panel = document.createElement("div");
  panel.className = "configuration-panel";
  const definition = configuredComponentId
    ? getComponentById(configuredComponentId)
    : undefined;
  if (
    !definition ||
    !getPlacements().some((item) => item.componentId === definition.id)
  ) {
    configuredComponentId = null;
    return panel;
  }
  const heading = document.createElement("h3");
  heading.textContent = `${definition.name} Configuration`;
  const fields = document.createElement("div");
  fields.className = "configuration-fields";
  const values = getComponentConfiguration(definition.id);
  Object.entries(definition.configuration).forEach(([key, field]) => {
    const label = document.createElement("label");
    const text = document.createElement("span");
    text.textContent = field.label;
    if (field.type === "boolean") {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = values[key] === true;
      input.dataset.configurationComponent = definition.id;
      input.dataset.configurationKey = key;
      label.append(input, text);
    } else {
      const select = document.createElement("select");
      select.dataset.configurationComponent = definition.id;
      select.dataset.configurationKey = key;
      field.options.forEach((option) => {
        const item = document.createElement("option");
        item.value = option;
        item.textContent = option;
        item.selected = values[key] === option;
        select.append(item);
      });
      label.append(text, select);
    }
    fields.append(label);
  });
  panel.append(heading, fields);
  return panel;
}

export function renderArchitecture(): void {
  const canvas = document.getElementById("architecture-canvas");
  if (!canvas) return;
  const layout = document.createElement("div");
  layout.className = "architecture-layout";
  const path = document.createElement("div");
  path.className = "main-path architecture-access-path";
  architectureAreas
    .filter((area) => !area.sideLane)
    .forEach((area, index) => {
      if (index) {
        const arrow = document.createElement("div");
        arrow.className = "flow-arrow";
        arrow.textContent = "→";
        path.append(arrow);
      }
      path.append(renderArea(area.id));
    });
  const sideLane = document.createElement("div");
  sideLane.className = "third-party-lane architecture-side-lane";
  const sideLaneHeading = document.createElement("div");
  sideLaneHeading.className = "side-lane-heading";
  const sideLaneTitle = document.createElement("strong");
  sideLaneTitle.textContent = "External Side Lane";
  const sideLaneDescription = document.createElement("span");
  sideLaneDescription.textContent = "Outside the main access path";
  sideLaneHeading.append(sideLaneTitle, sideLaneDescription);
  sideLane.append(sideLaneHeading, renderArea("third-party-systems"));
  layout.append(path, sideLane);
  canvas.replaceChildren(layout, renderConnections());
}

export function renderToolbox(): void {
  const toolbox = document.getElementById("component-toolbox");
  if (!toolbox) return;
  const fragment = document.createDocumentFragment();
  architectureAreas.forEach((area) => {
    const group = document.createElement("section");
    group.className = "toolbox-group";
    const heading = document.createElement("h3");
    heading.textContent = area.name;
    const list = document.createElement("div");
    list.className = "component-list";
    componentList
      .filter((item) => item.area === area.id)
      .forEach((definition) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "component-card";
        card.draggable = true;
        card.dataset.componentId = definition.id;
        card.title = definition.description;
        card.append(componentVisual(definition));
        list.append(card);
      });
    group.append(heading, list);
    fragment.append(group);
  });
  toolbox.replaceChildren(fragment);
}

const analysisFields: [keyof ArchitectureAnalysis, string][] = [
  ["authenticationModel", "Authentication Model"],
  ["authenticationDependency", "Authentication Dependency"],
  ["policyEvaluation", "Policy Evaluation"],
  ["policyEnforcement", "Policy Enforcement"],
  ["connectionType", "Connection Type"],
  ["clientNetworkVisibility", "Client Network Visibility"],
  ["clientReachability", "Client Reachability"],
  ["networkParticipation", "Network Participation"],
];

function textSection(title: string, content: string | string[]): HTMLElement {
  const section = document.createElement("section");
  section.className = "analysis-group architecture-analysis-group";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const list = document.createElement("ul");
  list.className = "analysis-items";
  const values = Array.isArray(content) ? content : [content];
  (values.length ? values : ["None identified."]).forEach((value) => {
    const item = document.createElement("li");
    item.className = "insight-item";
    item.textContent = value;
    list.append(item);
  });
  section.append(heading, list);
  return section;
}

export function renderEvaluation(): void {
  const list = document.getElementById("result-insights");
  const score = document.getElementById("security-score-value");
  const classification = document.getElementById(
    "architecture-classification-value",
  );
  const chart = document.querySelector<HTMLElement>(".security-score-chart");
  if (!list || !score || !classification || !chart) return;
  const analysis = evaluateArchitecture();
  classification.textContent = analysis.classification;
  const path = analysis.accessPath
    .map((id) => getComponentById(id)?.name ?? id)
    .join(" → ");
  const sections = [
    textSection(
      "Access Path",
      path || "No complete connected access path was found.",
    ),
    ...analysisFields.map(([key, title]) =>
      textSection(title, String(analysis[key])),
    ),
    textSection("Identified Security Openings", analysis.openings),
    textSection("Recommended Architecture Changes", analysis.recommendations),
  ];
  list.replaceChildren(...sections);
  score.textContent = `${analysis.score}%`;
  chart.style.setProperty("--score-progress", String(analysis.score));
}

export function clearEvaluation(): void {
  const list = document.getElementById("result-insights");
  const score = document.getElementById("security-score-value");
  const classification = document.getElementById(
    "architecture-classification-value",
  );
  const chart = document.querySelector<HTMLElement>(".security-score-chart");
  list?.replaceChildren();
  if (score) score.textContent = "--";
  if (classification) classification.textContent = "Incomplete Architecture";
  chart?.style.setProperty("--score-progress", "0");
}

export function renderBuilder(): void {
  renderArchitecture();
  renderToolbox();
}
