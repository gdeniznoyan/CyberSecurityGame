import { getComponentById } from "./components.js";
import { addPlacement, hasPlacement, removePlacement } from "./state.js";
let draggedComponentId = null;
let selectedComponentId = null;
function showError(message) {
    const error = document.getElementById("error-message");
    if (error)
        error.textContent = message;
}
function canPlace(componentId, areaId) {
    const component = getComponentById(componentId);
    return Boolean(component?.allowedAreaIds.includes(areaId) && !hasPlacement(componentId, areaId));
}
function place(componentId, areaId) {
    const component = getComponentById(componentId);
    if (!component?.allowedAreaIds.includes(areaId)) {
        showError(`${component?.name ?? componentId} cannot be placed in this area.`);
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
function updateHighlights(componentId) {
    document.querySelectorAll(".area-drop-zone").forEach(zone => {
        const areaId = zone.dataset.areaId;
        zone.classList.toggle("compatible", Boolean(componentId && canPlace(componentId, areaId)));
    });
}
export function initializeDragAndDrop() {
    const toolbox = document.getElementById("component-toolbox");
    const canvas = document.getElementById("architecture-canvas");
    if (!toolbox || !canvas)
        return;
    toolbox.addEventListener("dragstart", event => {
        const card = event.target.closest(".component-card");
        if (!card)
            return;
        draggedComponentId = card.dataset.componentId ?? null;
        if (draggedComponentId)
            event.dataTransfer?.setData("text/plain", draggedComponentId);
        updateHighlights(draggedComponentId);
    });
    toolbox.addEventListener("dragend", () => {
        draggedComponentId = null;
        updateHighlights(null);
    });
    toolbox.addEventListener("click", event => {
        const card = event.target.closest(".component-card");
        if (!card)
            return;
        selectedComponentId = card.dataset.componentId ?? null;
        document.querySelectorAll(".component-card").forEach(item => item.classList.remove("selected"));
        card.classList.add("selected");
        updateHighlights(selectedComponentId);
    });
    canvas.addEventListener("dragover", event => {
        const zone = event.target.closest(".area-drop-zone");
        if (!zone || !draggedComponentId)
            return;
        const areaId = zone.dataset.areaId;
        if (canPlace(draggedComponentId, areaId))
            event.preventDefault();
    });
    canvas.addEventListener("drop", event => {
        event.preventDefault();
        const zone = event.target.closest(".area-drop-zone");
        const componentId = event.dataTransfer?.getData("text/plain") || draggedComponentId;
        if (zone && componentId)
            place(componentId, zone.dataset.areaId);
        draggedComponentId = null;
        updateHighlights(null);
    });
    canvas.addEventListener("click", event => {
        const target = event.target;
        const remove = target.closest("[data-remove-component]");
        if (remove) {
            removePlacement(remove.dataset.removeComponent ?? "", remove.dataset.areaId);
            showError("");
            return;
        }
        const zone = target.closest(".area-drop-zone");
        if (zone && selectedComponentId)
            place(selectedComponentId, zone.dataset.areaId);
    });
}
//# sourceMappingURL=dragDrop.js.map