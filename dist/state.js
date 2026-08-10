import { getComponentById, getDefaultConfiguration } from "./components.js";
let placements = [];
let connections = [];
let configurations = {};
const listeners = new Set();
function emit() {
    listeners.forEach((listener) => listener());
}
export function getPlacements() {
    return placements.map((item) => ({ ...item }));
}
export function getConnections() {
    return connections.map((item) => ({ ...item }));
}
export function getComponentConfiguration(id) {
    return { ...getDefaultConfiguration(id), ...(configurations[id] ?? {}) };
}
export function hasPlacement(componentId, areaId) {
    return placements.some((item) => item.componentId === componentId && item.areaId === areaId);
}
export function addPlacement(componentId, areaId) {
    const definition = getComponentById(componentId);
    if (!definition ||
        !definition.allowedAreaIds.includes(areaId) ||
        hasPlacement(componentId, areaId))
        return false;
    placements = [...placements, { componentId, areaId }];
    configurations = {
        ...configurations,
        [componentId]: getDefaultConfiguration(componentId),
    };
    emit();
    return true;
}
export function removePlacement(componentId, areaId) {
    const next = placements.filter((item) => !(item.componentId === componentId && item.areaId === areaId));
    if (next.length === placements.length)
        return;
    placements = next;
    connections = connections.filter((item) => item.sourceComponentId !== componentId &&
        item.targetComponentId !== componentId);
    const { [componentId]: removed, ...rest } = configurations;
    void removed;
    configurations = rest;
    emit();
}
export function addConnection(sourceComponentId, targetComponentId) {
    const placedIds = new Set(placements.map((item) => item.componentId));
    if (sourceComponentId === targetComponentId ||
        !placedIds.has(sourceComponentId) ||
        !placedIds.has(targetComponentId))
        return false;
    if (connections.some((item) => item.sourceComponentId === sourceComponentId &&
        item.targetComponentId === targetComponentId))
        return false;
    connections = [...connections, { sourceComponentId, targetComponentId }];
    emit();
    return true;
}
export function removeConnection(sourceComponentId, targetComponentId) {
    const next = connections.filter((item) => item.sourceComponentId !== sourceComponentId ||
        item.targetComponentId !== targetComponentId);
    if (next.length === connections.length)
        return;
    connections = next;
    emit();
}
export function updateComponentConfiguration(componentId, key, value) {
    const definition = getComponentById(componentId);
    const field = definition?.configuration[key];
    if (!field || !placements.some((item) => item.componentId === componentId))
        return false;
    const valid = field.type === "boolean"
        ? typeof value === "boolean"
        : typeof value === "string" && field.options.includes(value);
    if (!valid)
        return false;
    configurations = {
        ...configurations,
        [componentId]: { ...getComponentConfiguration(componentId), [key]: value },
    };
    emit();
    return true;
}
export function resetArchitecture() {
    placements = [];
    connections = [];
    configurations = {};
    emit();
}
export function getArchitectureState() {
    return {
        placements: getPlacements(),
        connections: getConnections(),
        configurations: structuredClone(configurations),
    };
}
export function replaceArchitecture(state) {
    if (!Array.isArray(state.placements) ||
        !Array.isArray(state.connections) ||
        typeof state.configurations !== "object" ||
        state.configurations === null)
        return false;
    const uniquePlacements = new Set();
    for (const item of state.placements) {
        const definition = getComponentById(item.componentId);
        const key = `${item.areaId}:${item.componentId}`;
        if (!definition ||
            !definition.allowedAreaIds.includes(item.areaId) ||
            uniquePlacements.has(key))
            return false;
        uniquePlacements.add(key);
    }
    const placedIds = new Set(state.placements.map((item) => item.componentId));
    const uniqueConnections = new Set();
    for (const item of state.connections) {
        const key = `${item.sourceComponentId}>${item.targetComponentId}`;
        if (item.sourceComponentId === item.targetComponentId ||
            !placedIds.has(item.sourceComponentId) ||
            !placedIds.has(item.targetComponentId) ||
            uniqueConnections.has(key))
            return false;
        uniqueConnections.add(key);
    }
    placements = state.placements.map((item) => ({ ...item }));
    connections = state.connections.map((item) => ({ ...item }));
    configurations = {};
    for (const componentId of placedIds) {
        configurations[componentId] = getDefaultConfiguration(componentId);
        const imported = state.configurations[componentId] ?? {};
        for (const [key, value] of Object.entries(imported)) {
            const field = getComponentById(componentId)?.configuration[key];
            if (!field)
                continue;
            if (field.type === "boolean" && typeof value === "boolean")
                configurations[componentId][key] = value;
            if (field.type === "select" &&
                typeof value === "string" &&
                field.options.includes(value))
                configurations[componentId][key] = value;
        }
    }
    emit();
    return true;
}
export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
//# sourceMappingURL=state.js.map