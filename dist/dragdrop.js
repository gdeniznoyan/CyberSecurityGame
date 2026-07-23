import { getComponentById } from "./components.js";
import { getSlotById } from "./slots.js";
import { getSelectedComponent, getSlotComponent, isComponentDisabled, setSelectedComponent, setSlotComponent } from "./state.js";
let dragged = null;
let reportError = () => undefined;
let refresh = () => undefined;
export function slotAcceptsComponent(slot, id) { const component = getComponentById(id); return Boolean(slot.enabled && component && component.allowedSlotTypes.includes(slot.slotType) && (slot.allowedComponentIds?.includes(id) ?? slot.allowedCategories?.includes(component.category) ?? false)); }
export function placeComponent(slotId, id) { const slot = getSlotById(slotId), component = getComponentById(id); if (!slot || !component)
    return false; if (!slotAcceptsComponent(slot, id)) {
    const accepted = (slot.allowedComponentIds ?? []).map(x => getComponentById(x)?.label ?? x).join(", ") || "no components";
    reportError(`${slot.label} does not accept ${component.label}. Accepted: ${accepted}.`, slotId);
    return false;
} if (isComponentDisabled(id) && getSlotComponent(slotId) !== id) {
    reportError(`${component.label} is already in use and is not reusable.`, slotId);
    return false;
} setSlotComponent(slotId, id); setSelectedComponent(null); reportError("", slotId); return true; }
export function initializeDragAndDrop(onError, onRefresh) {
    reportError = onError;
    refresh = onRefresh;
    const toolbox = document.getElementById("component-toolbox"), canvas = document.getElementById("architecture-canvas");
    if (!toolbox || !canvas)
        return;
    toolbox.addEventListener("click", e => { const card = e.target.closest(".component-card"); if (!card || card.ariaDisabled === "true")
        return; e.stopPropagation(); setSelectedComponent(card.dataset.componentId); highlight(); });
    toolbox.addEventListener("dragstart", e => { const card = e.target.closest(".component-card"); if (!card || card.ariaDisabled === "true") {
        e.preventDefault();
        return;
    } dragged = card.dataset.componentId; e.dataTransfer?.setData("text/plain", dragged); highlight(); });
    toolbox.addEventListener("dragend", () => { dragged = null; clearHighlights(); });
    canvas.addEventListener("dragover", e => { const el = e.target.closest(".drop-slot"); if (el) {
        e.preventDefault();
        el.classList.add("drag-over");
    } });
    canvas.addEventListener("dragleave", e => e.target.closest(".drop-slot")?.classList.remove("drag-over"));
    canvas.addEventListener("drop", e => { e.preventDefault(); const el = e.target.closest(".drop-slot"), id = (e.dataTransfer?.getData("text/plain") || dragged); if (el && id)
        placeComponent(el.dataset.slotId ?? "", id); dragged = null; clearHighlights(); refresh(); });
    canvas.addEventListener("click", e => { const target = e.target, remove = target.closest("[data-remove-slot]"); if (remove) {
        setSlotComponent(remove.dataset.removeSlot ?? "", null);
        reportError("", remove.dataset.removeSlot);
        return;
    } const el = target.closest(".drop-slot"), id = getSelectedComponent(); if (el && id) {
        placeComponent(el.dataset.slotId ?? "", id);
        refresh();
    } });
    document.addEventListener("click", e => { if (!e.target.closest(".component-card,.drop-slot")) {
        setSelectedComponent(null);
        clearHighlights();
    } });
}
function highlight() { const id = dragged ?? getSelectedComponent(); document.querySelectorAll(".drop-slot").forEach(el => { const slot = getSlotById(el.dataset.slotId ?? ""); el.classList.toggle("compatible", Boolean(id && slot && slotAcceptsComponent(slot, id))); }); }
function clearHighlights() { document.querySelectorAll(".drop-slot").forEach(x => x.classList.remove("compatible", "drag-over")); }
//# sourceMappingURL=dragdrop.js.map