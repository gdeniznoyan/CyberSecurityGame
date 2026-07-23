import { getComponentById } from "./components.js";
import { slotDefinitions } from "./slots.js";
const slots = new Map(slotDefinitions.map(x => [x.id, null]));
let selected = null;
const listeners = new Set();
const emit = () => listeners.forEach(x => x());
export function getSlotStates() { return slotDefinitions.map(x => ({ slotId: x.id, componentId: slots.get(x.id) ?? null })); }
export function getSlotComponent(id) { return slots.get(id) ?? null; }
export function setSlotComponent(id, value) { slots.set(id, value); emit(); }
export function setAllSlots(values) { slotDefinitions.forEach(x => slots.set(x.id, values[x.id] ?? null)); selected = null; emit(); }
export function getSelectedComponent() { return selected; }
export function setSelectedComponent(id) { selected = id; emit(); }
export function getComponentUsage(id) { return [...slots.values()].filter(x => x === id).length; }
export function isComponentDisabled(id) { const x = getComponentById(id); return Boolean(x && !x.reusable && getComponentUsage(id) > 0); }
export function resetState() { slots.forEach((_v, k) => slots.set(k, null)); selected = null; emit(); }
export function subscribe(x) { listeners.add(x); return () => listeners.delete(x); }
//# sourceMappingURL=state.js.map