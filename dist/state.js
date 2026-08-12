import { getComponentById, getDefaultConfiguration } from "./components.js";
let placements = [];
let connections = [];
const listeners = new Set();
function emit() {
    listeners.forEach((listener) => listener());
}
export function getPlacements() {
    return placements.map((item) => ({
        ...item,
        configuration: { ...item.configuration },
    }));
}
export function getConnections() {
    return connections.map((item) => ({ ...item }));
}
export function hasPlacement(componentId) {
    return placements.some((item) => item.componentId === componentId);
}
export function addPlacement(componentId, areaId) {
    const component = getComponentById(componentId);
    if (!component ||
        !component.allowedAreaIds.includes(areaId) ||
        hasPlacement(componentId))
        return false;
    if (areaId === "reachable-resources" &&
        placements.some((item) => item.areaId === areaId))
        return false;
    placements = [
        ...placements,
        { componentId, areaId, configuration: getDefaultConfiguration(component) },
    ];
    emit();
    return true;
}
export function removePlacement(componentId) {
    if (!hasPlacement(componentId))
        return;
    placements = placements.filter((item) => item.componentId !== componentId);
    connections = connections.filter((item) => item.sourceComponentId !== componentId &&
        item.targetComponentId !== componentId);
    emit();
}
export function updateConfiguration(componentId, configuration) {
    const placement = placements.find((item) => item.componentId === componentId);
    const component = getComponentById(componentId);
    if (!placement || !component)
        return;
    const allowed = new Set(component.configuration.map((item) => item.id));
    placement.configuration = Object.fromEntries(Object.entries(configuration).filter(([key]) => allowed.has(key)));
    placements = [...placements];
    emit();
}
export function addConnection(sourceComponentId, targetComponentId) {
    if (sourceComponentId === targetComponentId ||
        !hasPlacement(sourceComponentId) ||
        !hasPlacement(targetComponentId))
        return false;
    if (connections.some((item) => item.sourceComponentId === sourceComponentId &&
        item.targetComponentId === targetComponentId))
        return false;
    connections = [...connections, { sourceComponentId, targetComponentId }];
    emit();
    return true;
}
export function removeConnection(sourceComponentId, targetComponentId) {
    connections = connections.filter((item) => !(item.sourceComponentId === sourceComponentId &&
        item.targetComponentId === targetComponentId));
    emit();
}
export function resetArchitecture() {
    placements = [];
    connections = [];
    emit();
}
export function getArchitectureState() {
    return { placements: getPlacements(), connections: getConnections() };
}
export function replaceArchitecture(state) {
    if (!Array.isArray(state.placements) || !Array.isArray(state.connections))
        return false;
    const ids = new Set();
    const validated = [];
    for (const item of state.placements) {
        const component = getComponentById(item.componentId);
        if (!component ||
            ids.has(item.componentId) ||
            !component.allowedAreaIds.includes(item.areaId))
            return false;
        ids.add(item.componentId);
        validated.push({
            componentId: item.componentId,
            areaId: item.areaId,
            configuration: {
                ...getDefaultConfiguration(component),
                ...item.configuration,
            },
        });
    }
    if (state.connections.some((item) => !ids.has(item.sourceComponentId) ||
        !ids.has(item.targetComponentId) ||
        item.sourceComponentId === item.targetComponentId))
        return false;
    placements = validated;
    connections = state.connections.map((item) => ({ ...item }));
    emit();
    return true;
}
export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
//# sourceMappingURL=state.js.map