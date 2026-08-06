import { getComponentById } from "./components.js";
let placements = [];
const listeners = new Set();
function emit() { listeners.forEach(listener => listener()); }
export function getPlacements() { return placements.map(item => ({ ...item })); }
export function hasPlacement(componentId, areaId) {
    return placements.some(item => item.componentId === componentId && item.areaId === areaId);
}
export function addPlacement(componentId, areaId) {
    const component = getComponentById(componentId);
    if (!component || !component.allowedAreaIds.includes(areaId) || hasPlacement(componentId, areaId))
        return false;
    placements = [...placements, { componentId, areaId }];
    emit();
    return true;
}
export function removePlacement(componentId, areaId) {
    const next = placements.filter(item => !(item.componentId === componentId && item.areaId === areaId));
    if (next.length === placements.length)
        return;
    placements = next;
    emit();
}
export function resetArchitecture() {
    placements = [];
    emit();
}
export function getArchitectureState() { return { placements: getPlacements() }; }
export function replaceArchitecture(state) {
    if (!Array.isArray(state.placements))
        return false;
    const unique = new Set();
    const validated = [];
    for (const item of state.placements) {
        const component = getComponentById(item.componentId);
        const key = `${item.areaId}:${item.componentId}`;
        if (!component || !component.allowedAreaIds.includes(item.areaId) || unique.has(key))
            return false;
        unique.add(key);
        validated.push({ componentId: item.componentId, areaId: item.areaId });
    }
    placements = validated;
    emit();
    return true;
}
export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
//# sourceMappingURL=state.js.map