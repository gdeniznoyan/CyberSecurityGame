import { getComponentById } from "./components.js";
import { getLanguage, localizedComponentName } from "./i18n.js";
import { showComponentSettings } from "./renderer.js";
import {
  addConnection,
  addPlacement,
  getPlacements,
  hasPlacement,
  removeConnection,
  removePlacement,
  updateConfiguration,
} from "./state.js";
import type { AreaId, ComponentConfiguration, ComponentId } from "./types.js";

let draggedComponentId: ComponentId | null = null;
let selectedComponentId: ComponentId | null = null;
let connectionSourceId: ComponentId | null = null;

function showError(message: string): void {
  const error = document.getElementById("error-message");
  if (error) error.textContent = message;
}

function canPlace(componentId: ComponentId, areaId: AreaId): boolean {
  const component = getComponentById(componentId);
  if (
    !component ||
    !component.allowedAreaIds.includes(areaId) ||
    hasPlacement(componentId)
  )
    return false;
  return true;
}

function place(componentId: ComponentId, areaId: AreaId): void {
  const component = getComponentById(componentId);
  if (!component?.allowedAreaIds.includes(areaId)) {
    const componentName = component
      ? localizedComponentName(component)
      : componentId;
    showError(
      getLanguage() === "tr"
        ? `${componentName} bu alana yerleştirilemez.`
        : `${componentName} cannot be placed in this area.`,
    );
    return;
  }
  if (hasPlacement(componentId)) {
    const componentName = localizedComponentName(component);
    showError(
      getLanguage() === "tr"
        ? `${componentName} mimariye zaten yerleştirilmiş.`
        : `${componentName} is already placed in the architecture.`,
    );
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
    const closeSettings = target.closest<HTMLButtonElement>(
      "[data-close-settings]",
    );
    if (closeSettings) {
      const panel = document.getElementById("component-settings");
      if (panel) panel.hidden = true;
      return;
    }
    const edit = target.closest<HTMLButtonElement>("[data-edit-component]");
    if (edit) {
      showComponentSettings(edit.dataset.editComponent ?? "");
      return;
    }
    const connectionButton = target.closest<HTMLButtonElement>(
      "[data-connect-component]",
    );
    if (connectionButton) {
      const componentId = connectionButton.dataset.connectComponent ?? "";
      if (!connectionSourceId) {
        connectionSourceId = componentId;
        document
          .querySelector(`[data-component-node="${componentId}"]`)
          ?.classList.add("connection-source");
        showError("Now select ↗ on the destination component.");
      } else {
        if (!addConnection(connectionSourceId, componentId))
          showError("This connection cannot be created.");
        else showError("");
        connectionSourceId = null;
      }
      return;
    }
    const removeLink = target.closest<HTMLButtonElement>(
      "[data-remove-connection-source]",
    );
    if (removeLink) {
      removeConnection(
        removeLink.dataset.removeConnectionSource ?? "",
        removeLink.dataset.removeConnectionTarget ?? "",
      );
      showError("");
      return;
    }
    const remove = target.closest<HTMLButtonElement>("[data-remove-component]");
    if (remove) {
      removePlacement(remove.dataset.removeComponent ?? "");
      showError("");
      return;
    }
    const zone = target.closest<HTMLElement>(".area-drop-zone");
    if (zone && selectedComponentId)
      place(selectedComponentId, zone.dataset.areaId as AreaId);
  });

  canvas.addEventListener("change", (event) => {
    const control = (event.target as HTMLElement).closest<
      HTMLInputElement | HTMLSelectElement
    >("[data-configuration-key]");
    if (!control) return;
    const componentId = control.dataset.configurationComponent ?? "";
    const placement = getPlacements().find(
      (item) => item.componentId === componentId,
    );
    if (!placement) return;
    const configuration: ComponentConfiguration = {
      ...placement.configuration,
    };
    configuration[control.dataset.configurationKey ?? ""] =
      control instanceof HTMLInputElement && control.type === "checkbox"
        ? control.checked
        : control.value;
    updateConfiguration(componentId, configuration);
  });
}
