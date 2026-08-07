import { getComponentById } from "./components.js";
import type {
  ArchitectureState,
  AreaId,
  ComponentId,
  Placement,
} from "./types.js";

type Listener = () => void;
let placements: Placement[] = [];
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function getPlacements(): Placement[] {
  return placements.map((item) => ({ ...item }));
}

export function hasPlacement(
  componentId: ComponentId,
  areaId: AreaId,
): boolean {
  return placements.some(
    (item) => item.componentId === componentId && item.areaId === areaId,
  );
}

function isSinglePlacementArea(areaId: AreaId): boolean {
  return areaId === "protected-application";
}

export function addPlacement(
  componentId: ComponentId,
  areaId: AreaId,
): boolean {
  const component = getComponentById(componentId);
  if (
    !component ||
    !component.allowedAreaIds.includes(areaId) ||
    hasPlacement(componentId, areaId)
  )
    return false;
  if (
    isSinglePlacementArea(areaId) &&
    placements.some((item) => item.areaId === areaId)
  )
    return false;
  placements = [...placements, { componentId, areaId }];
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
  emit();
}

export function resetArchitecture(): void {
  placements = [];
  emit();
}

export function getArchitectureState(): ArchitectureState {
  return { placements: getPlacements() };
}

export function replaceArchitecture(state: ArchitectureState): boolean {
  if (!Array.isArray(state.placements)) return false;
  const unique = new Set<string>();
  const validated: Placement[] = [];
  for (const item of state.placements) {
    const component = getComponentById(item.componentId);
    const key = `${item.areaId}:${item.componentId}`;
    if (
      !component ||
      !component.allowedAreaIds.includes(item.areaId) ||
      unique.has(key)
    )
      return false;
    unique.add(key);
    validated.push({ componentId: item.componentId, areaId: item.areaId });
  }
  placements = validated;
  emit();
  return true;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
