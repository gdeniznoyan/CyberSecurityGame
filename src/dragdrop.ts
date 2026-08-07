import { getComponentById } from "./components.js";
import {
  addPlacement,
  getPlacements,
  hasPlacement,
  removePlacement,
} from "./state.js";
import type { AreaId, ComponentId } from "./types.js";

let draggedComponentId: ComponentId | null = null;
let selectedComponentId: ComponentId | null = null;

function showError(message: string): void {
  const error = document.getElementById("error-message");
  if (error) error.textContent = message;
}

function canPlace(componentId: ComponentId, areaId: AreaId): boolean {
  const component = getComponentById(componentId);
  if (
    !component ||
    !component.allowedAreaIds.includes(areaId) ||
    hasPlacement(componentId, areaId)
  )
    return false;
  if (
    areaId === "protected-application" &&
    getPlacements().some((item) => item.areaId === areaId)
  )
    return false;
  return true;
}

function place(componentId: ComponentId, areaId: AreaId): void {
  const component = getComponentById(componentId);
  if (!component?.allowedAreaIds.includes(areaId)) {
    showError(
      `${component?.name ?? componentId} cannot be placed in this area.`,
    );
    return;
  }
  if (hasPlacement(componentId, areaId)) {
    showError(`${component.name} is already placed in this area.`);
    return;
  }
  addPlacement(componentId, areaId);
  selectedComponentId = null;
  showError("");
}

function updateHighlights(componentId: ComponentId | null): void {
  document.querySelectorAll<HTMLElement>(".area-drop-zone").forEach((zone) => {
    const areaId = zone.dataset.areaId as AreaId;
    zone.classList.toggle(
      "compatible",
      Boolean(componentId && canPlace(componentId, areaId)),
    );
  });
}

export function initializeDragAndDrop(): void {
  const toolbox = document.getElementById("component-toolbox");
  const canvas = document.getElementById("architecture-canvas");
  if (!toolbox || !canvas) return;

  toolbox.addEventListener("dragstart", (event) => {
    const card = (event.target as HTMLElement).closest<HTMLElement>(
      ".component-card",
    );
    if (!card) return;
    draggedComponentId = card.dataset.componentId ?? null;
    if (draggedComponentId)
      event.dataTransfer?.setData("text/plain", draggedComponentId);
    updateHighlights(draggedComponentId);
  });

  toolbox.addEventListener("dragend", () => {
    draggedComponentId = null;
    updateHighlights(null);
  });

  toolbox.addEventListener("click", (event) => {
    const card = (event.target as HTMLElement).closest<HTMLElement>(
      ".component-card",
    );
    if (!card) return;
    selectedComponentId = card.dataset.componentId ?? null;
    document
      .querySelectorAll(".component-card")
      .forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    updateHighlights(selectedComponentId);
  });

  canvas.addEventListener("dragover", (event) => {
    const zone = (event.target as HTMLElement).closest<HTMLElement>(
      ".area-drop-zone",
    );
    if (!zone || !draggedComponentId) return;
    const areaId = zone.dataset.areaId as AreaId;
    if (canPlace(draggedComponentId, areaId)) event.preventDefault();
  });

  canvas.addEventListener("drop", (event) => {
    event.preventDefault();
    const zone = (event.target as HTMLElement).closest<HTMLElement>(
      ".area-drop-zone",
    );
    const componentId =
      event.dataTransfer?.getData("text/plain") || draggedComponentId;
    if (zone && componentId) place(componentId, zone.dataset.areaId as AreaId);
    draggedComponentId = null;
    updateHighlights(null);
  });

  canvas.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const remove = target.closest<HTMLButtonElement>("[data-remove-component]");
    if (remove) {
      removePlacement(
        remove.dataset.removeComponent ?? "",
        remove.dataset.areaId as AreaId,
      );
      showError("");
      return;
    }
    const zone = target.closest<HTMLElement>(".area-drop-zone");
    if (zone && selectedComponentId)
      place(selectedComponentId, zone.dataset.areaId as AreaId);
  });
}
