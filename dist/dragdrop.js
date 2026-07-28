import { getComponentById } from "./components.js";
import { getSlotById } from "./slots.js";
import { getSelectedComponent, getSlotComponent, getSlotStates, isComponentDisabled, setSelectedComponent, setSlotComponent } from "./state.js";
let dragged = null;
let reportError = () => undefined;
let refresh = () => undefined;
const connectionTypes = [
    "network-connection",
    "application-connection"
];
export function slotAcceptsComponent(slot, id) {
    const component = getComponentById(id);
    return Boolean(slot.enabled &&
        component &&
        component.allowedSlotTypes.includes(slot.slotType) &&
        (slot.allowedComponentIds?.includes(id) ??
            slot.allowedCategories?.includes(component.category) ??
            false));
}
function hasConnection(excludedSlot) {
    return getSlotStates().some(state => state.slotId !== excludedSlot &&
        connectionTypes.includes(state.componentId));
}
function canPlaceComponent(slot, id) {
    return slotAcceptsComponent(slot, id) &&
        (id !== "connection-encryption" || hasConnection());
}
export function placeComponent(slotId, id) {
    const slot = getSlotById(slotId);
    const component = getComponentById(id);
    if (!slot || !component)
        return false;
    if (!slotAcceptsComponent(slot, id)) {
        const accepted = (slot.allowedComponentIds ?? [])
            .map(componentId => getComponentById(componentId)?.label ?? componentId)
            .join(", ") || "no components";
        reportError(`${slot.label} does not accept ${component.label}. Accepted: ${accepted}.`, slotId);
        return false;
    }
    if (id === "connection-encryption" && !hasConnection()) {
        reportError("Connection Encryption requires Network Connection or Application Connection first.", slotId);
        return false;
    }
    if (isComponentDisabled(id) && getSlotComponent(slotId) !== id) {
        reportError(`${component.label} is already in use and is not reusable.`, slotId);
        return false;
    }
    setSlotComponent(slotId, id);
    setSelectedComponent(null);
    reportError("", slotId);
    return true;
}
function removeComponent(slotId) {
    const current = getSlotComponent(slotId);
    const encryptionIsPresent = getSlotStates().some(state => state.componentId === "connection-encryption");
    if (current &&
        connectionTypes.includes(current) &&
        encryptionIsPresent &&
        !hasConnection(slotId)) {
        reportError("Remove Connection Encryption before removing the last connection type.", slotId);
        return false;
    }
    setSlotComponent(slotId, null);
    reportError("", slotId);
    return true;
}
export function initializeDragAndDrop(onError, onRefresh) {
    reportError = onError;
    refresh = onRefresh;
    const toolbox = document.getElementById("component-toolbox");
    const canvas = document.getElementById("architecture-canvas");
    if (!toolbox || !canvas)
        return;
    toolbox.addEventListener("click", event => {
        const card = event.target
            .closest(".component-card");
        if (!card || card.ariaDisabled === "true")
            return;
        event.stopPropagation();
        setSelectedComponent(card.dataset.componentId);
        highlight();
    });
    toolbox.addEventListener("dragstart", event => {
        const card = event.target
            .closest(".component-card");
        if (!card || card.ariaDisabled === "true") {
            event.preventDefault();
            return;
        }
        dragged = card.dataset.componentId;
        event.dataTransfer?.setData("text/plain", dragged);
        highlight();
    });
    toolbox.addEventListener("dragend", () => {
        dragged = null;
        clearHighlights();
    });
    canvas.addEventListener("dragover", event => {
        const slot = event.target
            .closest(".drop-slot");
        if (slot) {
            event.preventDefault();
            slot.classList.add("drag-over");
        }
    });
    canvas.addEventListener("dragleave", event => event.target
        .closest(".drop-slot")
        ?.classList.remove("drag-over"));
    canvas.addEventListener("drop", event => {
        event.preventDefault();
        const slot = event.target
            .closest(".drop-slot");
        const id = (event.dataTransfer?.getData("text/plain") || dragged);
        if (slot && id)
            placeComponent(slot.dataset.slotId ?? "", id);
        dragged = null;
        clearHighlights();
        refresh();
    });
    canvas.addEventListener("click", event => {
        const target = event.target;
        const remove = target.closest("[data-remove-slot]");
        if (remove) {
            removeComponent(remove.dataset.removeSlot ?? "");
            return;
        }
        const slot = target.closest(".drop-slot");
        const id = getSelectedComponent();
        if (slot && id) {
            placeComponent(slot.dataset.slotId ?? "", id);
            refresh();
        }
    });
    document.addEventListener("click", event => {
        if (!event.target.closest(".component-card,.drop-slot")) {
            setSelectedComponent(null);
            clearHighlights();
        }
    });
}
function highlight() {
    const id = dragged ?? getSelectedComponent();
    document.querySelectorAll(".drop-slot").forEach(element => {
        const slot = getSlotById(element.dataset.slotId ?? "");
        element.classList.toggle("compatible", Boolean(id && slot && canPlaceComponent(slot, id)));
    });
}
function clearHighlights() {
    document.querySelectorAll(".drop-slot").forEach(element => element.classList.remove("compatible", "drag-over"));
}
//# sourceMappingURL=dragDrop.js.map