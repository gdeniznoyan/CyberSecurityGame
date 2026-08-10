import { getComponentById } from "./components.js";
import { getConnectionSourceId, setConfiguredComponentId, setConnectionSourceId, } from "./renderer.js";
import { addConnection, addPlacement, hasPlacement, removeConnection, removePlacement, updateComponentConfiguration, } from "./state.js";
let draggedComponentId = null;
let selectedComponentId = null;
function showError(message) {
    const error = document.getElementById("error-message");
    if (error)
        error.textContent = message;
}
function canPlace(componentId, areaId) {
    const definition = getComponentById(componentId);
    return Boolean(definition?.allowedAreaIds.includes(areaId) &&
        !hasPlacement(componentId, areaId));
}
function place(componentId, areaId) {
    const definition = getComponentById(componentId);
    if (!definition?.allowedAreaIds.includes(areaId)) {
        showError(`${definition?.name ?? componentId} cannot be placed in this architectural zone.`);
        return;
    }
    if (!addPlacement(componentId, areaId)) {
        showError(`${definition.name} is already placed in this zone.`);
        return;
    }
    selectedComponentId = null;
    showError("");
}
function updateHighlights(componentId) {
    document.querySelectorAll(".area-drop-zone").forEach((zone) => {
        zone.classList.toggle("compatible", Boolean(componentId && canPlace(componentId, zone.dataset.areaId)));
    });
}
export function initializeDragAndDrop() {
    const toolbox = document.getElementById("component-toolbox");
    const canvas = document.getElementById("architecture-canvas");
    if (!toolbox || !canvas)
        return;
    toolbox.addEventListener("dragstart", (event) => {
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
    toolbox.addEventListener("click", (event) => {
        const card = event.target.closest(".component-card");
        if (!card)
            return;
        selectedComponentId = card.dataset.componentId ?? null;
        document
            .querySelectorAll(".component-card")
            .forEach((item) => item.classList.remove("selected"));
        card.classList.add("selected");
        updateHighlights(selectedComponentId);
    });
    canvas.addEventListener("dragover", (event) => {
        const zone = event.target.closest(".area-drop-zone");
        if (zone &&
            draggedComponentId &&
            canPlace(draggedComponentId, zone.dataset.areaId))
            event.preventDefault();
    });
    canvas.addEventListener("drop", (event) => {
        event.preventDefault();
        const zone = event.target.closest(".area-drop-zone");
        const componentId = event.dataTransfer?.getData("text/plain") || draggedComponentId;
        if (zone && componentId)
            place(componentId, zone.dataset.areaId);
        draggedComponentId = null;
        updateHighlights(null);
    });
    canvas.addEventListener("click", (event) => {
        const target = event.target;
        const remove = target.closest("[data-remove-component]");
        if (remove) {
            removePlacement(remove.dataset.removeComponent ?? "", remove.dataset.areaId);
            setConnectionSourceId(null);
            showError("");
            return;
        }
        const configure = target.closest("[data-configure-component]");
        if (configure?.dataset.configureComponent) {
            setConfiguredComponentId(configure.dataset.configureComponent);
            showError("");
            return;
        }
        const connect = target.closest("[data-connect-component]");
        if (connect?.dataset.connectComponent) {
            const selected = getConnectionSourceId();
            const current = connect.dataset.connectComponent;
            if (!selected) {
                setConnectionSourceId(current);
                showError("Source selected. Choose Link on the destination component.");
            }
            else if (selected === current) {
                setConnectionSourceId(null);
                showError("Connection selection cancelled.");
            }
            else if (addConnection(selected, current)) {
                setConnectionSourceId(null);
                showError("");
            }
            else
                showError("This connection already exists or is invalid.");
            return;
        }
        const unlink = target.closest("[data-remove-connection-source]");
        if (unlink) {
            removeConnection(unlink.dataset.removeConnectionSource ?? "", unlink.dataset.removeConnectionTarget ?? "");
            showError("");
            return;
        }
        const zone = target.closest(".area-drop-zone");
        if (zone && selectedComponentId)
            place(selectedComponentId, zone.dataset.areaId);
    });
    canvas.addEventListener("change", (event) => {
        const control = event.target.closest("[data-configuration-component]");
        if (!control)
            return;
        const value = control instanceof HTMLInputElement && control.type === "checkbox"
            ? control.checked
            : control.value;
        updateComponentConfiguration(control.dataset.configurationComponent ?? "", control.dataset.configurationKey ?? "", value);
        showError("");
    });
}
//# sourceMappingURL=dragDrop.js.map