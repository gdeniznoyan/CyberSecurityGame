import{getComponentById}from"./components.js";
import{slotDefinitions}from"./slots.js";
import type{ComponentId,SlotId,SlotState}from"./types.js";

export type StateChange="architecture"|"selection";
type Listener=(change:StateChange)=>void;

const slots=new Map<SlotId,ComponentId|null>(
  slotDefinitions.map(slot=>[slot.id,null])
);
let selected:ComponentId|null=null;
const listeners=new Set<Listener>();

const emit=(change:StateChange):void=>
  listeners.forEach(listener=>listener(change));

export function getSlotStates():SlotState[]{
  return slotDefinitions.map(slot=>({
    slotId:slot.id,
    componentId:slots.get(slot.id)??null
  }));
}

export function getSlotComponent(id:SlotId):ComponentId|null{
  return slots.get(id)??null;
}

export function setSlotComponent(
  id:SlotId,
  value:ComponentId|null
):void{
  if((slots.get(id)??null)===value)return;
  slots.set(id,value);
  emit("architecture");
}

export function setAllSlots(
  values:Record<SlotId,ComponentId|null>
):void{
  slotDefinitions.forEach(slot=>
    slots.set(slot.id,values[slot.id]??null)
  );
  selected=null;
  emit("architecture");
}

export function getSelectedComponent():ComponentId|null{
  return selected;
}

export function setSelectedComponent(id:ComponentId|null):void{
  if(selected===id)return;
  selected=id;
  emit("selection");
}

export function getComponentUsage(id:ComponentId):number{
  return[...slots.values()].filter(value=>value===id).length;
}

export function isComponentDisabled(id:ComponentId):boolean{
  const component=getComponentById(id);
  return Boolean(
    component&&
    !component.reusable&&
    getComponentUsage(id)>0
  );
}

export function resetState():void{
  slots.forEach((_value,key)=>slots.set(key,null));
  selected=null;
  emit("architecture");
}

export function subscribe(listener:Listener):()=>void{
  listeners.add(listener);
  return()=>listeners.delete(listener);
}
