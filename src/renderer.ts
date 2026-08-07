import { architectureAreas } from "./areas.js";
import { componentList, getComponentById } from "./components.js";
import {
  evaluateArchitecture,
  evaluateSecurityAnalysis,
  getTotalScore,
} from "./evaluator.js";
import { getPlacements } from "./state.js";
import type { AnalysisGroupId, AreaId, ComponentDefinition } from "./types.js";

const analysisGroups: { id: AnalysisGroupId; title: string }[] = [
  { id: "selected-security-controls", title: "Selected Security Controls" },
  { id: "missing-critical-controls", title: "Missing Critical Controls" },
  { id: "recommended-improvements", title: "Recommended Improvements" },
  { id: "third-party-dependencies", title: "Third-Party Dependencies" },
  { id: "target-application", title: "Target Application" },
];

const areaVisuals: Record<AreaId, string> = {
  "access-device": "./assets/sections-centered/client-computer.png",
  "trust-identity-services": "./assets/sections-centered/authentication.png",
  "secure-session": "./assets/sections-centered/wild-internet.png",
  "third-party-services": "./assets/sections-centered/third-party.png",
  "invisible-network-protection": "./assets/sections-centered/gateway.png",
  "policy-access-control": "./assets/components/policy-engine.png",
  "protected-application": "./assets/sections-centered/target-network.png",
};

function componentVisual(component: ComponentDefinition): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const box = document.createElement("span");
  box.className = "component-image";
  const image = document.createElement("img");
  image.src = component.icon;
  image.alt = "";
  image.addEventListener("error", () => box.remove());
  box.append(image);
  const label = document.createElement("span");
  label.className = "component-label";
  label.textContent = component.name;
  fragment.append(box, label);
  return fragment;
}

export function renderArchitecture(): void {
  const canvas = document.getElementById("architecture-canvas");
  if (!canvas) return;
  const thirdPartyLane = document.createElement("div");
  thirdPartyLane.className = "third-party-lane";
  const path = document.createElement("div");
  path.className = "main-path six-stage-path";
  const placements = getPlacements();

  architectureAreas.forEach((area) => {
    const target = area.id === "third-party-services" ? thirdPartyLane : path;
    if (target === path && path.children.length) {
      const arrow = document.createElement("div");
      arrow.className = "flow-arrow";
      arrow.textContent = "→";
      path.append(arrow);
    }
    const section = document.createElement("article");
    section.className = "architecture-section";
    section.dataset.areaId = area.id;
    const heading = document.createElement("h3");
    heading.textContent = area.name;
    const imageBox = document.createElement("div");
    imageBox.className = "image-placeholder";
    const image = document.createElement("img");
    image.src = areaVisuals[area.id];
    image.alt = "";
    imageBox.append(image);
    const dropZone = document.createElement("div");
    dropZone.className = "drop-slot area-drop-zone";
    dropZone.dataset.areaId = area.id;
    const placed = placements.filter((item) => item.areaId === area.id);
    if (!placed.length) {
      const placeholder = document.createElement("span");
      placeholder.className = "slot-placeholder";
      placeholder.textContent = "Drop compatible components here";
      dropZone.append(placeholder);
    } else {
      dropZone.classList.add("occupied");
      const list = document.createElement("div");
      list.className = "placed-components";
      placed.forEach((item) => {
        const component = getComponentById(item.componentId);
        if (!component) return;
        const row = document.createElement("div");
        row.className = "placed-component";
        const name = document.createElement("span");
        name.textContent = component.name;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-button";
        remove.dataset.removeComponent = component.id;
        remove.dataset.areaId = area.id;
        remove.textContent = "×";
        row.append(name, remove);
        list.append(row);
      });
      dropZone.append(list);
    }
    section.append(heading, imageBox, dropZone);
    target.append(section);
  });
  canvas.replaceChildren(thirdPartyLane, path);
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
      .filter((component) => component.area === area.id)
      .forEach((component) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "component-card";
        card.draggable = true;
        card.dataset.componentId = component.id;
        card.append(componentVisual(component));
        list.append(card);
      });
    group.append(heading, list);
    fragment.append(group);
  });
  toolbox.replaceChildren(fragment);
}

export function renderEvaluation(): void {
  const list = document.getElementById("result-insights");
  const score = document.getElementById("security-score-value");
  const chart = document.querySelector<HTMLElement>(".security-score-chart");
  if (!list || !score || !chart) return;
  const evaluations = evaluateArchitecture();
  const analysis = evaluateSecurityAnalysis();
  const groups = analysisGroups.map((groupDefinition) => {
    const group = document.createElement("section");
    group.className = "analysis-group";
    group.dataset.analysisGroup = groupDefinition.id;
    const heading = document.createElement("h3");
    heading.textContent = groupDefinition.title;
    const items = document.createElement("ul");
    items.className = "analysis-items";
    analysis
      .filter((item) => item.group === groupDefinition.id)
      .forEach((result) => {
        const item = document.createElement("li");
        item.className = "insight-item";
        const output = document.createElement("span");
        output.className = "analysis-output";
        output.textContent = result.output;
        if (result.componentId) {
          item.dataset.componentId = result.componentId;
          const component = getComponentById(result.componentId);
          if (component) {
            const name = document.createElement("strong");
            name.className = "analysis-component-name";
            name.textContent = component.name;
            item.append(name);
          }
        }
        item.append(output);
        items.append(item);
      });
    group.append(heading, items);
    return group;
  });
  const total = getTotalScore(evaluations);
  list.replaceChildren(...groups);
  score.textContent = `${total}%`;
  chart.style.setProperty(
    "--score-progress",
    String(Math.max(0, Math.min(100, total))),
  );
}

export function clearEvaluation(): void {
  const list = document.getElementById("result-insights");
  const score = document.getElementById("security-score-value");
  const chart = document.querySelector<HTMLElement>(".security-score-chart");
  if (!list || !score || !chart) return;

  list.replaceChildren();
  score.textContent = "--";
  chart.style.setProperty("--score-progress", "0");
}

export function renderBuilder(): void {
  renderArchitecture();
  renderToolbox();
}
