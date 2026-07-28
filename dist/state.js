import { getComponentById } from "./components.js";
import { slotDefinitions } from "./slots.js";
const slots = new Map(slotDefinitions.map(slot => [slot.id, null]));
let selected = null;
const listeners = new Set();
const emit = (change) => listeners.forEach(listener => listener(change));
export function getSlotStates() {
    return slotDefinitions.map(slot => ({
        slotId: slot.id,
        componentId: slots.get(slot.id) ?? null
    }));
}
export function getSlotComponent(id) {
    return slots.get(id) ?? null;
}
export function setSlotComponent(id, value) {
    if ((slots.get(id) ?? null) === value)
        return;
    slots.set(id, value);
    emit("architecture");
}
export function setAllSlots(values) {
    slotDefinitions.forEach(slot => slots.set(slot.id, values[slot.id] ?? null));
    selected = null;
    emit("architecture");
}
export function getSelectedComponent() {
    return selected;
}
export function setSelectedComponent(id) {
    if (selected === id)
        return;
    selected = id;
    emit("selection");
}
export function getComponentUsage(id) {
    return [...slots.values()].filter(value => value === id).length;
}
export function isComponentDisabled(id) {
    const component = getComponentById(id);
    return Boolean(component &&
        !component.reusable &&
        getComponentUsage(id) > 0);
}
export function resetState() {
    slots.forEach((_value, key) => slots.set(key, null));
    selected = null;
    emit("architecture");
}
export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
//# sourceMappingURL=state.js.map