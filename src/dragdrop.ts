import{getComponentById}from"./components.js";
import{getSlotById}from"./slots.js";
import{
  getSelectedComponent,
  getSlotComponent,
  getSlotStates,
  isComponentDisabled,
  setSelectedComponent,
  setSlotComponent
}from"./state.js";
import type{ComponentId,SlotDefinition,SlotId}from"./types.js";

let dragged:ComponentId|null=null;
let reportError:(message:string,slotId?:SlotId)=>void=()=>undefined;
let refresh:()=>void=()=>undefined;

const connectionTypes:ComponentId[]=[
  "network-connection",
  "application-connection"
];

export function slotAcceptsComponent(
  slot:SlotDefinition,
  id:ComponentId
):boolean{
  const component=getComponentById(id);
  return Boolean(
    slot.enabled&&
    component&&
    component.allowedSlotTypes.includes(slot.slotType)&&
    (
      slot.allowedComponentIds?.includes(id)??
      slot.allowedCategories?.includes(component.category)??
      false
    )
  );
}

function hasConnection(excludedSlot?:SlotId):boolean{
  return getSlotStates().some(state=>
    state.slotId!==excludedSlot&&
    connectionTypes.includes(state.componentId as ComponentId)
  );
}

function canPlaceComponent(
  slot:SlotDefinition,
  id:ComponentId
):boolean{
  return slotAcceptsComponent(slot,id)&&
    (id!=="connection-encryption"||hasConnection());
}

export function placeComponent(
  slotId:SlotId,
  id:ComponentId
):boolean{
  const slot=getSlotById(slotId);
  const component=getComponentById(id);
  if(!slot||!component)return false;

  if(!slotAcceptsComponent(slot,id)){
    const accepted=(slot.allowedComponentIds??[])
      .map(componentId=>getComponentById(componentId)?.label??componentId)
      .join(", ")||"no components";
    reportError(
      `${slot.label} does not accept ${component.label}. Accepted: ${accepted}.`,
      slotId
    );
    return false;
  }

  if(id==="connection-encryption"&&!hasConnection()){
    reportError(
      "Connection Encryption requires Network Connection or Application Connection first.",
      slotId
    );
    return false;
  }

  if(isComponentDisabled(id)&&getSlotComponent(slotId)!==id){
    reportError(
      `${component.label} is already in use and is not reusable.`,
      slotId
    );
    return false;
  }

  setSlotComponent(slotId,id);
  setSelectedComponent(null);
  reportError("",slotId);
  return true;
}

function removeComponent(slotId:SlotId):boolean{
  const current=getSlotComponent(slotId);
  const encryptionIsPresent=getSlotStates().some(
    state=>state.componentId==="connection-encryption"
  );

  if(
    current&&
    connectionTypes.includes(current)&&
    encryptionIsPresent&&
    !hasConnection(slotId)
  ){
    reportError(
      "Remove Connection Encryption before removing the last connection type.",
      slotId
    );
    return false;
  }

  setSlotComponent(slotId,null);
  reportError("",slotId);
  return true;
}

export function initializeDragAndDrop(
  onError:(message:string,slotId?:SlotId)=>void,
  onRefresh:()=>void
):void{
  reportError=onError;
  refresh=onRefresh;
  const toolbox=document.getElementById("component-toolbox");
  const canvas=document.getElementById("architecture-canvas");
  if(!toolbox||!canvas)return;

  toolbox.addEventListener("click",event=>{
    const card=(event.target as HTMLElement)
      .closest<HTMLElement>(".component-card");
    if(!card||card.ariaDisabled==="true")return;
    event.stopPropagation();
    setSelectedComponent(card.dataset.componentId as ComponentId);
    highlight();
  });

  toolbox.addEventListener("dragstart",event=>{
    const card=(event.target as HTMLElement)
      .closest<HTMLElement>(".component-card");
    if(!card||card.ariaDisabled==="true"){
      event.preventDefault();
      return;
    }
    dragged=card.dataset.componentId as ComponentId;
    event.dataTransfer?.setData("text/plain",dragged);
    highlight();
  });

  toolbox.addEventListener("dragend",()=>{
    dragged=null;
    clearHighlights();
  });

  canvas.addEventListener("dragover",event=>{
    const slot=(event.target as HTMLElement)
      .closest<HTMLElement>(".drop-slot");
    if(slot){
      event.preventDefault();
      slot.classList.add("drag-over");
    }
  });

  canvas.addEventListener("dragleave",event=>
    (event.target as HTMLElement)
      .closest<HTMLElement>(".drop-slot")
      ?.classList.remove("drag-over")
  );

  canvas.addEventListener("drop",event=>{
    event.preventDefault();
    const slot=(event.target as HTMLElement)
      .closest<HTMLElement>(".drop-slot");
    const id=(
      event.dataTransfer?.getData("text/plain")||dragged
    )as ComponentId;
    if(slot&&id)placeComponent(slot.dataset.slotId??"",id);
    dragged=null;
    clearHighlights();
    refresh();
  });

  canvas.addEventListener("click",event=>{
    const target=event.target as HTMLElement;
    const remove=target.closest<HTMLButtonElement>("[data-remove-slot]");
    if(remove){
      removeComponent(remove.dataset.removeSlot??"");
      return;
    }
    const slot=target.closest<HTMLElement>(".drop-slot");
    const id=getSelectedComponent();
    if(slot&&id){
      placeComponent(slot.dataset.slotId??"",id);
      refresh();
    }
  });

  document.addEventListener("click",event=>{
    if(!(event.target as HTMLElement).closest(".component-card,.drop-slot")){
      setSelectedComponent(null);
      clearHighlights();
    }
  });
}

function highlight():void{
  const id=dragged??getSelectedComponent();
  document.querySelectorAll<HTMLElement>(".drop-slot").forEach(element=>{
    const slot=getSlotById(element.dataset.slotId??"");
    element.classList.toggle(
      "compatible",
      Boolean(id&&slot&&canPlaceComponent(slot,id))
    );
  });
}

function clearHighlights():void{
  document.querySelectorAll(".drop-slot").forEach(element=>
    element.classList.remove("compatible","drag-over")
  );
}
