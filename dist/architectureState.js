import { getComponentById } from "./components.js";
import { slotAcceptsComponent } from "./dragdrop.js";
import { getSlotStates, setAllSlots } from "./state.js";
import { getSlotById } from "./slots.js";
export function getArchitectureState() { return { slots: Object.fromEntries(getSlotStates().map(x => [x.slotId, x.componentId])) }; }
export function exportArchitectureState() { return JSON.stringify(getArchitectureState(), null, 2); }
export function validateImportedState(input) { const errors = []; let parsed; try {
    parsed = JSON.parse(input);
}
catch {
    return { valid: false, errors: ["The text is not valid JSON."], state: null };
} if (typeof parsed !== "object" || parsed === null || !("slots" in parsed) || typeof parsed.slots !== "object" || parsed.slots === null)
    return { valid: false, errors: ["Expected an object with a slots object."], state: null }; const raw = parsed.slots, values = {}; for (const [id, value] of Object.entries(raw)) {
    const slot = getSlotById(id);
    if (!slot) {
        errors.push(`Unknown slot ID: ${id}.`);
        continue;
    }
    if (value === null) {
        values[id] = null;
        continue;
    }
    if (typeof value !== "string" || !getComponentById(value)) {
        errors.push(`Invalid component ID for ${slot.label}.`);
        continue;
    }
    if (!slotAcceptsComponent(slot, value)) {
        errors.push(`${value} is not compatible with ${slot.label}.`);
        continue;
    }
    values[id] = value;
} return { valid: errors.length === 0, errors, state: errors.length ? null : { slots: values } }; }
export function importArchitectureState(input) { const result = validateImportedState(input); if (result.valid && result.state)
    setAllSlots(result.state.slots); return result; }
//# sourceMappingURL=architectureState.js.map