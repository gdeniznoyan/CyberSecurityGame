import { getComponentById } from "./components.js";
import { slotAcceptsComponent } from "./dragDrop.js";
import { getSlotStates, setAllSlots } from "./state.js";
import { getSlotById } from "./slots.js";
export function getArchitectureState() {
    return {
        slots: Object.fromEntries(getSlotStates().map(state => [state.slotId, state.componentId]))
    };
}
export function exportArchitectureState() {
    return JSON.stringify(getArchitectureState(), null, 2);
}
export function validateImportedState(input) {
    const errors = [];
    let parsed;
    try {
        parsed = JSON.parse(input);
    }
    catch {
        return {
            valid: false,
            errors: ["The text is not valid JSON."],
            state: null
        };
    }
    if (typeof parsed !== "object" ||
        parsed === null ||
        !("slots" in parsed) ||
        typeof parsed.slots !== "object" ||
        parsed.slots === null) {
        return {
            valid: false,
            errors: ["Expected an object with a slots object."],
            state: null
        };
    }
    const raw = parsed.slots;
    const values = {};
    const used = new Set();
    for (const [id, value] of Object.entries(raw)) {
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
        const componentId = value;
        if (!slotAcceptsComponent(slot, componentId)) {
            errors.push(`${value} is not compatible with ${slot.label}.`);
            continue;
        }
        if (used.has(componentId)) {
            errors.push(`${value} cannot be used more than once.`);
            continue;
        }
        used.add(componentId);
        values[id] = componentId;
    }
    const selected = Object.values(values);
    const hasEncryption = selected.includes("connection-encryption");
    const hasConnection = selected.some(value => value === "network-connection" ||
        value === "application-connection");
    if (hasEncryption && !hasConnection) {
        errors.push("Connection Encryption requires Network Connection or Application Connection.");
    }
    return {
        valid: errors.length === 0,
        errors,
        state: errors.length ? null : { slots: values }
    };
}
export function importArchitectureState(input) {
    const result = validateImportedState(input);
    if (result.valid && result.state)
        setAllSlots(result.state.slots);
    return result;
}
//# sourceMappingURL=architectureState.js.map