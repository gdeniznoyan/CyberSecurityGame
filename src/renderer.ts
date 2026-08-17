import { componentList, getComponentById } from "./components.js";
import { evaluateArchitecture } from "./evaluator.js";
import {
  getLanguage,
  localizedComponentDescription,
  localizedComponentName,
  t,
  translateEvaluationText,
  translateText,
} from "./i18n.js";
import { getPlacements } from "./state.js";
import type { AreaId, ComponentDefinition, Placement } from "./types.js";

interface Stage {
  areaId: AreaId;
  title: string;
  image: string;
}
const stages: Stage[] = [
  {
    areaId: "user-device",
    title: "User & Device",
    image: "./assets/journey-v2/user-device.png?v=2",
  },
  {
    areaId: "identity-route",
    title: "Identity",
    image: "./assets/journey-v2/identity.png?v=2",
  },
  {
    areaId: "access-enforcement",
    title: "Access Control",
    image: "./assets/journey-v2/access-control.png?v=2",
  },
  {
    areaId: "connection-method",
    title: "Connection",
    image: "./assets/journey-v2/secure-connection.png?v=2",
  },
  {
    areaId: "reachable-resources",
    title: "Protected Resources",
    image: "./assets/journey-v2/protected-resource.png?v=2",
  },
];
const toolboxGroups: { title: string; areaId: AreaId }[] = [
  { title: "Device", areaId: "user-device" },
  { title: "Identity", areaId: "identity-route" },
  { title: "Access", areaId: "access-enforcement" },
  { title: "Connection", areaId: "connection-method" },
  { title: "Resources", areaId: "reachable-resources" },
  { title: "External", areaId: "third-party-systems" },
];

function getComponentTooltip(): HTMLElement {
  const existing = document.getElementById("component-tooltip");
  if (existing) return existing;

  const tooltip = document.createElement("div");
  tooltip.id = "component-tooltip";
  tooltip.className = "component-tooltip";
  tooltip.role = "tooltip";
  tooltip.setAttribute("aria-hidden", "true");
  document.body.append(tooltip);
  return tooltip;
}

function showComponentTooltip(
  anchor: HTMLElement,
  component: ComponentDefinition,
): void {
  const tooltip = getComponentTooltip();
  const eyebrow = document.createElement("span");
  eyebrow.className = "component-tooltip-eyebrow";
  eyebrow.textContent = t("Component overview");
  const title = document.createElement("strong");
  title.textContent = localizedComponentName(component);
  const description = document.createElement("span");
  description.className = "component-tooltip-description";
  description.textContent = localizedComponentDescription(component);
  tooltip.replaceChildren(eyebrow, title, description);
  tooltip.classList.add("is-visible");
  tooltip.setAttribute("aria-hidden", "false");

  const anchorBounds = anchor.getBoundingClientRect();
  const tooltipBounds = tooltip.getBoundingClientRect();
  const edgeGap = 12;
  let top = anchorBounds.top - tooltipBounds.height - edgeGap;
  let placement = "top";

  if (top < edgeGap) {
    top = anchorBounds.bottom + edgeGap;
    placement = "bottom";
  }

  const centeredLeft =
    anchorBounds.left + anchorBounds.width / 2 - tooltipBounds.width / 2;
  const left = Math.min(
    Math.max(centeredLeft, edgeGap),
    window.innerWidth - tooltipBounds.width - edgeGap,
  );

  tooltip.dataset.placement = placement;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideComponentTooltip(): void {
  const tooltip = document.getElementById("component-tooltip");
  if (!tooltip) return;
  tooltip.classList.remove("is-visible");
  tooltip.setAttribute("aria-hidden", "true");
}

function componentVisual(component: ComponentDefinition): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const imageBox = document.createElement("span");
  imageBox.className = "component-image";
  const image = document.createElement("img");
  image.src = component.icon;
  image.alt = "";
  imageBox.append(image);
  const copy = document.createElement("span");
  copy.className = "component-copy";
  const label = document.createElement("span");
  label.className = "component-label";
  label.textContent = localizedComponentName(component);
  copy.append(label);
  fragment.append(imageBox, copy);
  return fragment;
}

function renderPlacedComponent(placement: Placement): HTMLElement {
  const component = getComponentById(placement.componentId);
  const row = document.createElement("div");
  row.className = "placed-component";
  row.dataset.componentNode = placement.componentId;
  if (!component) return row;
  const image = document.createElement("img");
  image.src = component.icon;
  image.alt = "";
  const name = document.createElement("span");
  const localizedName = localizedComponentName(component);
  name.textContent = localizedName;
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "node-action remove-button";
  remove.dataset.removeComponent = component.id;
  remove.title = t("Remove");
  remove.setAttribute("aria-label", `${t("Remove")} ${localizedName}`);
  remove.textContent = "×";
  row.append(image, name, remove);
  return row;
}

function renderDropZone(areaId: AreaId): HTMLElement {
  const zone = document.createElement("div");
  zone.className = "drop-slot area-drop-zone";
  zone.dataset.areaId = areaId;
  const placements = getPlacements().filter((item) => item.areaId === areaId);
  if (!placements.length) {
    const placeholder = document.createElement("span");
    placeholder.className = "slot-placeholder";
    placeholder.textContent = t("Drop here");
    zone.append(placeholder);
    return zone;
  }
  zone.classList.add("occupied");
  const list = document.createElement("div");
  list.className = "placed-components";
  placements.forEach((item) => list.append(renderPlacedComponent(item)));
  zone.append(list);
  return zone;
}

function renderStage(stage: Stage, index: number): HTMLElement {
  const card = document.createElement("article");
  card.className = "journey-stage";
  card.dataset.stage = stage.areaId;
  if (getPlacements().some((item) => item.areaId === stage.areaId))
    card.classList.add("stage-active");
  if (stage.areaId === "reachable-resources")
    card.classList.add("protected-stage");
  const head = document.createElement("div");
  head.className = "stage-head";
  const step = document.createElement("span");
  step.className = "stage-step";
  step.textContent = String(index + 1);
  const copy = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = t(stage.title);
  copy.append(title);
  head.append(step, copy);
  const visual = document.createElement("div");
  visual.className = "stage-visual";
  const image = document.createElement("img");
  image.src = stage.image;
  image.alt = "";
  visual.append(image);
  card.append(head, visual, renderDropZone(stage.areaId));
  return card;
}

function renderConnector(index: number): HTMLElement {
  const connector = document.createElement("div");
  connector.className = "journey-connector";
  const line = document.createElement("span");
  const arrow = document.createElement("span");
  arrow.className = "connector-arrow";
  arrow.setAttribute("aria-hidden", "true");
  connector.append(line, arrow);
  if (index === 1) {
    connector.classList.add("internet-crossing");
    const label = document.createElement("span");
    label.className = "internet-label";
    label.textContent = t("PUBLIC INTERNET");
    const image = document.createElement("img");
    image.className = "internet-globe";
    image.src = "./assets/journey-v2/internet-crossing.png?v=2";
    image.alt = t("Public Internet");
    connector.append(image, label);
  }
  return connector;
}

function renderThirdParty(): HTMLElement {
  const panel = document.createElement("aside");
  panel.className = "external-services-panel";
  const visual = document.createElement("div");
  visual.className = "external-services-visual";
  const image = document.createElement("img");
  image.src = "./assets/journey-v2/third-party-systems.png?v=2";
  image.alt = "";
  visual.append(image);
  const copy = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = t("Third-Party Systems");
  copy.append(title);
  panel.append(visual, copy, renderDropZone("third-party-systems"));
  return panel;
}

export function renderArchitecture(): void {
  const canvas = document.getElementById("architecture-canvas");
  if (!canvas) return;
  const journey = document.createElement("div");
  journey.className = "customer-journey";
  stages.forEach((stage, index) => {
    if (index) journey.append(renderConnector(index - 1));
    journey.append(renderStage(stage, index));
  });
  const secondary = document.createElement("div");
  secondary.className = "canvas-secondary";
  secondary.append(renderThirdParty());
  canvas.replaceChildren(journey, secondary);
}

export function showComponentSettings(componentId: string): void {
  const panel = document.getElementById("component-settings");
  const placement = getPlacements().find(
    (item) => item.componentId === componentId,
  );
  const component = getComponentById(componentId);
  if (!panel || !placement || !component || !component.configuration.length)
    return;
  panel.hidden = false;
  panel.dataset.settingsComponent = componentId;
  const header = document.createElement("div");
  header.className = "settings-header";
  const title = document.createElement("div");
  const eyebrow = document.createElement("small");
  eyebrow.textContent = t("Configuration");
  const componentTitle = document.createElement("strong");
  componentTitle.textContent = localizedComponentName(component);
  title.append(eyebrow, componentTitle);
  const close = document.createElement("button");
  close.type = "button";
  close.dataset.closeSettings = "true";
  close.textContent = "×";
  header.append(title, close);
  const description = document.createElement("p");
  description.className = "settings-description";
  description.textContent = localizedComponentDescription(component);
  const form = document.createElement("div");
  form.className = "settings-form";
  component.configuration.forEach((definition) => {
    const label = document.createElement("label");
    label.className = "setting-row";
    const text = document.createElement("span");
    text.textContent = translateText(definition.label);
    let control: HTMLInputElement | HTMLSelectElement;
    if (definition.type === "boolean") {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = placement.configuration[definition.id] === true;
      control = input;
    } else {
      const select = document.createElement("select");
      definition.options.forEach((option) => {
        const item = document.createElement("option");
        item.value = option;
        item.textContent = translateText(option);
        select.append(item);
      });
      select.value = String(placement.configuration[definition.id]);
      control = select;
    }
    control.dataset.configurationKey = definition.id;
    control.dataset.configurationComponent = componentId;
    label.append(text, control);
    form.append(label);
  });
  panel.replaceChildren(header, description, form);
}

export function renderToolbox(): void {
  const toolbox = document.getElementById("component-toolbox");
  if (!toolbox) return;
  hideComponentTooltip();
  const fragment = document.createDocumentFragment();
  toolboxGroups.forEach((definition) => {
    const group = document.createElement("section");
    group.className = "toolbox-group";
    const heading = document.createElement("div");
    heading.className = "toolbox-group-heading";
    const title = document.createElement("span");
    title.textContent = t(definition.title);
    const components = componentList.filter((item) =>
      item.allowedAreaIds.includes(definition.areaId),
    );
    const count = document.createElement("span");
    count.textContent = String(components.length);
    heading.append(title, count);
    const list = document.createElement("div");
    list.className = "component-list";
    components.forEach((component) => {
      const isPlaced = getPlacements().some(
        (placement) => placement.componentId === component.id,
      );
      const card = document.createElement("button");
      card.type = "button";
      card.className = "component-card";
      card.draggable = !isPlaced;
      card.disabled = isPlaced;
      if (isPlaced) card.classList.add("component-placed");
      card.dataset.componentId = component.id;
      card.setAttribute("aria-describedby", "component-tooltip");
      card.addEventListener("mouseenter", () =>
        showComponentTooltip(card, component),
      );
      card.addEventListener("mouseleave", hideComponentTooltip);
      card.addEventListener("focus", () => showComponentTooltip(card, component));
      card.addEventListener("blur", hideComponentTooltip);
      card.addEventListener("dragstart", hideComponentTooltip);
      card.append(componentVisual(component));
      list.append(card);
    });
    group.append(heading, list);
    fragment.append(group);
  });
  toolbox.replaceChildren(fragment);
}

function insight(
  title: string,
  output: string,
  status = "neutral",
  featured = false,
): HTMLElement {
  const card = document.createElement("section");
  card.className = "insight-card";
  card.dataset.status = status;
  if (featured) card.classList.add("insight-featured");
  const heading = document.createElement("h3");
  heading.textContent = t(title);
  const text = document.createElement("p");
  text.textContent = translateEvaluationText(output);
  card.append(heading, text);
  return card;
}

function architecturePathInsight(accessPath: string[]): HTMLElement {
  const card = document.createElement("section");
  card.className = "insight-card insight-featured access-path-card";
  card.dataset.status = "muted";

  const heading = document.createElement("div");
  heading.className = "access-path-heading";
  const title = document.createElement("h3");
  title.textContent = t("Access Path");
  const summary = document.createElement("span");
  summary.textContent = accessPath.length
    ? getLanguage() === "tr"
      ? `Girişten hedefe bağlı ${accessPath.length} adım`
      : `${accessPath.length} connected steps from entry to destination`
    : t("A complete route has not been created yet");
  heading.append(title, summary);

  const flow = document.createElement("div");
  flow.className = "access-path-flow";

  if (!accessPath.length) {
    const empty = document.createElement("p");
    empty.className = "access-path-empty";
    empty.textContent = t("No complete path from user to resource.");
    flow.append(empty);
  } else {
    accessPath.forEach((step, index) => {
      const item = document.createElement("div");
      item.className = "access-path-step";
      const node = document.createElement("span");
      node.className = "access-path-node";
      const label = document.createElement("strong");
      const component = componentList.find((item) => item.name === step);
      label.textContent = component
        ? localizedComponentName(component)
        : translateText(step);
      node.append(label);
      item.append(node);

      if (index < accessPath.length - 1) {
        const arrow = document.createElement("span");
        arrow.className = "access-path-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        item.append(arrow);
      }

      flow.append(item);
    });
  }

  card.append(heading, flow);
  return card;
}

export function renderEvaluation(): void {
  const list = document.getElementById("result-insights");
  const score = document.getElementById("security-score-value");
  const chart = document.querySelector<HTMLElement>(".security-score-chart");
  const classification = document.getElementById("architecture-result-value");
  if (!list || !score || !chart || !classification) return;
  const result = evaluateArchitecture();
  classification.textContent = translateEvaluationText(result.classification);
  score.textContent = String(result.score);
  chart.style.setProperty("--score-progress", String(result.score));
  const scoreColor =
    result.score < 50
      ? { ring: "#c90018", glow: "rgba(201, 0, 24, 0.25)" }
      : result.score < 80
        ? { ring: "#e2aa00", glow: "rgba(226, 170, 0, 0.28)" }
        : { ring: "#14a947", glow: "rgba(20, 169, 71, 0.27)" };
  chart.style.setProperty("--score-color", scoreColor.ring);
  chart.style.setProperty("--score-glow", scoreColor.glow);
  list.replaceChildren(
    architecturePathInsight(result.accessPath),
    insight(
      "Authentication Model",
      result.authenticationModel,
      result.properties.authenticatesUser &&
        result.properties.authenticatesBeforeCommunication
        ? "good"
        : "warning",
    ),
    insight(
      "Authentication Dependency",
      result.authenticationDependency,
      result.properties.dependsOnExternalIdentityProvider ? "warning" : "good",
    ),
    insight(
      "Policy Evaluation",
      result.policyEvaluation,
      result.properties.evaluatesAccessPolicy ? "good" : "warning",
    ),
    insight(
      "Policy Enforcement",
      result.policyEnforcement,
      result.properties.enforcesAccessPolicy ? "good" : "warning",
    ),
    insight(
      "Connection Type",
      result.connectionType,
      result.properties.grantsApplicationAccess &&
        !result.properties.grantsNetworkAccess
        ? "good"
        : "warning",
    ),
    insight(
      "Client Network Visibility",
      result.clientNetworkVisibility,
      result.properties.exposesNetworkInformation ? "warning" : "good",
    ),
    insight(
      "Client Reachability",
      result.clientReachability,
      result.properties.grantsApplicationAccess &&
        !result.properties.grantsNetworkAccess
        ? "good"
        : "warning",
    ),
    insight(
      "Network Participation",
      result.networkParticipation,
      result.properties.createsVirtualNetworkInterface ? "warning" : "good",
    ),
    insight(
      "Detected Openings",
      result.openings.length
        ? result.openings.map(translateEvaluationText).join(" · ")
        : "No opening detected on the effective path.",
      "muted",
      true,
    ),
    insight(
      "Recommended Change",
      result.recommendation,
      "muted",
      true,
    ),
  );
}

export function renderBuilder(): void {
  renderArchitecture();
  renderToolbox();
}
