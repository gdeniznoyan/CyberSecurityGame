import { getComponentById, getDefaultConfiguration } from "./components.js";
import type {
  ArchitectureState,
  AreaId,
  ComponentConfiguration,
  ComponentConnection,
  ComponentId,
  Placement,
} from "./types.js";

type Listener = () => void;
let placements: Placement[] = [];
let connections: ComponentConnection[] = [];
let configurations: Record<ComponentId, ComponentConfiguration> = {};
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function getPlacements(): Placement[] {
  return placements.map((item) => ({ ...item }));
}

export function getConnections(): ComponentConnection[] {
  return connections.map((item) => ({ ...item }));
}

export function getComponentConfiguration(
  id: ComponentId,
): ComponentConfiguration {
  return { ...getDefaultConfiguration(id), ...(configurations[id] ?? {}) };
}

export function hasPlacement(
  componentId: ComponentId,
  areaId: AreaId,
): boolean {
  return placements.some(
    (item) => item.componentId === componentId && item.areaId === areaId,
  );
}

export function addPlacement(
  componentId: ComponentId,
  areaId: AreaId,
): boolean {
  const definition = getComponentById(componentId);
  if (
    !definition ||
    !definition.allowedAreaIds.includes(areaId) ||
    hasPlacement(componentId, areaId)
  )
    return false;
  placements = [...placements, { componentId, areaId }];
  configurations = {
    ...configurations,
    [componentId]: getDefaultConfiguration(componentId),
  };
  emit();
  return true;
}

export function removePlacement(
  componentId: ComponentId,
  areaId: AreaId,
): void {
  const next = placements.filter(
    (item) => !(item.componentId === componentId && item.areaId === areaId),
  );
  if (next.length === placements.length) return;
  placements = next;
  connections = connections.filter(
    (item) =>
      item.sourceComponentId !== componentId &&
      item.targetComponentId !== componentId,
  );
  const { [componentId]: removed, ...rest } = configurations;
  void removed;
  configurations = rest;
  emit();
}

export function addConnection(
  sourceComponentId: ComponentId,
  targetComponentId: ComponentId,
): boolean {
  const placedIds = new Set(placements.map((item) => item.componentId));
  if (
    sourceComponentId === targetComponentId ||
    !placedIds.has(sourceComponentId) ||
    !placedIds.has(targetComponentId)
  )
    return false;
  if (
    connections.some(
      (item) =>
        item.sourceComponentId === sourceComponentId &&
        item.targetComponentId === targetComponentId,
    )
  )
    return false;
  connections = [...connections, { sourceComponentId, targetComponentId }];
  emit();
  return true;
}

export function removeConnection(
  sourceComponentId: ComponentId,
  targetComponentId: ComponentId,
): void {
  const next = connections.filter(
    (item) =>
      item.sourceComponentId !== sourceComponentId ||
      item.targetComponentId !== targetComponentId,
  );
  if (next.length === connections.length) return;
  connections = next;
  emit();
}

export function updateComponentConfiguration(
  componentId: ComponentId,
  key: string,
  value: string | boolean,
): boolean {
  const definition = getComponentById(componentId);
  const field = definition?.configuration[key];
  if (!field || !placements.some((item) => item.componentId === componentId))
    return false;
  const valid =
    field.type === "boolean"
      ? typeof value === "boolean"
      : typeof value === "string" && field.options.includes(value);
  if (!valid) return false;
  configurations = {
    ...configurations,
    [componentId]: { ...getComponentConfiguration(componentId), [key]: value },
  };
  emit();
  return true;
}

export function resetArchitecture(): void {
  placements = [];
  connections = [];
  configurations = {};
  emit();
}

export function getArchitectureState(): ArchitectureState {
  return {
    placements: getPlacements(),
    connections: getConnections(),
    configurations: structuredClone(configurations),
  };
}

export function replaceArchitecture(state: ArchitectureState): boolean {
  if (
    !Array.isArray(state.placements) ||
    !Array.isArray(state.connections) ||
    typeof state.configurations !== "object" ||
    state.configurations === null
  )
    return false;
  const uniquePlacements = new Set<string>();
  for (const item of state.placements) {
    const definition = getComponentById(item.componentId);
    const key = `${item.areaId}:${item.componentId}`;
    if (
      !definition ||
      !definition.allowedAreaIds.includes(item.areaId) ||
      uniquePlacements.has(key)
    )
      return false;
    uniquePlacements.add(key);
  }
  const placedIds = new Set(state.placements.map((item) => item.componentId));
  const uniqueConnections = new Set<string>();
  for (const item of state.connections) {
    const key = `${item.sourceComponentId}>${item.targetComponentId}`;
    if (
      item.sourceComponentId === item.targetComponentId ||
      !placedIds.has(item.sourceComponentId) ||
      !placedIds.has(item.targetComponentId) ||
      uniqueConnections.has(key)
    )
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
      if (!field) continue;
      if (field.type === "boolean" && typeof value === "boolean")
        configurations[componentId][key] = value;
      if (
        field.type === "select" &&
        typeof value === "string" &&
        field.options.includes(value)
      )
        configurations[componentId][key] = value;
    }
  }
  emit();
  return true;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
