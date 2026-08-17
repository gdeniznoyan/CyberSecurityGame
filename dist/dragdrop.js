import { getComponentById } from "./components.js";
import { getLanguage, localizedComponentName } from "./i18n.js";
import { showComponentSettings } from "./renderer.js";
import { addConnection, addPlacement, getPlacements, hasPlacement, removeConnection, removePlacement, updateConfiguration, } from "./state.js";
let draggedComponentId = null;
let selectedComponentId = null;
let connectionSourceId = null;
function showError(message) {
    const error = document.getElementById("error-message");
    if (error)
        error.textContent = message;
}
function canPlace(componentId, areaId) {
    const component = getComponentById(componentId);
    if (!component ||
        !component.allowedAreaIds.includes(areaId) ||
        hasPlacement(componentId))
        return false;
    return true;
}
function place(componentId, areaId) {
    const component = getComponentById(componentId);
    if (!component?.allowedAreaIds.includes(areaId)) {
        const componentName = component
            ? localizedComponentName(component)
            : componentId;
        showError(getLanguage() === "tr"
            ? `${componentName} bu alana yerleştirilemez.`
            : `${componentName} cannot be placed in this area.`);
        return;
    }
    if (hasPlacement(componentId)) {
        const componentName = localizedComponentName(component);
        showError(getLanguage() === "tr"
            ? `${componentName} mimariye zaten yerleştirilmiş.`
            : `${componentName} is already placed in the architecture.`);
        return;
    }
    addPlacement(componentId, areaId);
    selectedComponentId = null;
    showError("");
}
function updateHighlights(componentId) {
    document.querySelectorAll(".area-drop-zone").forEach((zone) => {
        const areaId = zone.dataset.areaId;
        zone.classList.toggle("compatible", Boolean(componentId && canPlace(componentId, areaId)));
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
        if (!zone || !draggedComponentId)
            return;
        const areaId = zone.dataset.areaId;
        if (canPlace(draggedComponentId, areaId))
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
        const closeSettings = target.closest("[data-close-settings]");
        if (closeSettings) {
            const panel = document.getElementById("component-settings");
            if (panel)
                panel.hidden = true;
            return;
        }
        const edit = target.closest("[data-edit-component]");
        if (edit) {
            showComponentSettings(edit.dataset.editComponent ?? "");
            return;
        }
        const connectionButton = target.closest("[data-connect-component]");
        if (connectionButton) {
            const componentId = connectionButton.dataset.connectComponent ?? "";
            if (!connectionSourceId) {
                connectionSourceId = componentId;
                document
                    .querySelector(`[data-component-node="${componentId}"]`)
                    ?.classList.add("connection-source");
                showError("Now select ↗ on the destination component.");
            }
            else {
                if (!addConnection(connectionSourceId, componentId))
                    showError("This connection cannot be created.");
                else
                    showError("");
                connectionSourceId = null;
            }
            return;
        }
        const removeLink = target.closest("[data-remove-connection-source]");
        if (removeLink) {
            removeConnection(removeLink.dataset.removeConnectionSource ?? "", removeLink.dataset.removeConnectionTarget ?? "");
            showError("");
            return;
        }
        const remove = target.closest("[data-remove-component]");
        if (remove) {
            removePlacement(remove.dataset.removeComponent ?? "");
            showError("");
            return;
        }
        const zone = target.closest(".area-drop-zone");
        if (zone && selectedComponentId)
            place(selectedComponentId, zone.dataset.areaId);
    });
    canvas.addEventListener("change", (event) => {
        const control = event.target.closest("[data-configuration-key]");
        if (!control)
            return;
        const componentId = control.dataset.configurationComponent ?? "";
        const placement = getPlacements().find((item) => item.componentId === componentId);
        if (!placement)
            return;
        const configuration = {
            ...placement.configuration,
        };
        configuration[control.dataset.configurationKey ?? ""] =
            control instanceof HTMLInputElement && control.type === "checkbox"
                ? control.checked
                : control.value;
        updateConfiguration(componentId, configuration);
    });
}
//# sourceMappingURL=dragdrop.js.map