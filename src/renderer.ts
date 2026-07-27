import{securityComponents,getComponentById}from"./components.js";
import{t,translateMessage}from"./i18n.js";
import{sectionDefinitions,getSlotsBySection}from"./slots.js";
import{
  getSelectedComponent,
  getSlotComponent,
  isComponentDisabled
}from"./state.js";
import type{
  ComponentCategory,
  SecurityComponent,
  SlotDefinition
}from"./types.js";

const categoryLabels:Record<ComponentCategory,string>={
  authentication:"Client Components",
  "connection-security":"Connection Components",
  "third-party":"Third Party",
  "network-components":"Network Components",
  "network-types":"Network Areas"
};

const make=(
  tag:string,
  className?:string,
  text?:string
):HTMLElement=>{
  const element=document.createElement(tag);
  if(className)element.className=className;
  if(text)element.textContent=text;
  return element;
};

function componentVisual(
  component:SecurityComponent
):DocumentFragment{
  const fragment=document.createDocumentFragment();
  const imageBox=make("div","component-image");

  if(component.futureImageUrl){
    const image=document.createElement("img");
    image.alt="";
    image.src=component.futureImageUrl;
    image.addEventListener("error",()=>imageBox.remove());
    imageBox.append(image);
  }

  fragment.append(
    imageBox,
    make("span","component-label",t(component.label))
  );
  return fragment;
}

function renderSlot(slot:SlotDefinition):HTMLElement{
  const element=make("div","drop-slot");
  element.dataset.slotId=slot.id;
  element.dataset.slotType=slot.slotType;
  element.tabIndex=slot.enabled?0:-1;
  element.setAttribute("role","button");
  element.setAttribute(
    "aria-label",
    `${t(slot.label)}. ${t(slot.placeholderText)}`
  );

  if(!slot.enabled)element.classList.add("disabled");

  const required=slot.required?" *":"";
  element.append(
    make("div","slot-label",`${t(slot.label)}${required}`)
  );

  const componentId=getSlotComponent(slot.id);
  if(!componentId){
    element.append(
      make("div","slot-placeholder",t(slot.placeholderText))
    );
    return element;
  }

  element.classList.add("occupied");
  const component=getComponentById(componentId);
  if(!component)return element;

  const content=make("div","slot-content");
  content.append(componentVisual(component));

  const removeButton=document.createElement("button");
  removeButton.type="button";
  removeButton.className="remove-button";
  removeButton.dataset.removeSlot=slot.id;
  removeButton.textContent=t("Remove");
  removeButton.setAttribute(
    "aria-label",
    `${t("Remove")}: ${t(component.label)} — ${t(slot.label)}`
  );
  content.append(removeButton);
  element.append(content);

  return element;
}

function renderArchitectureSection(
  section:(typeof sectionDefinitions)[number]
):HTMLElement{
  const card=make("article","architecture-section");
  card.dataset.section=section.id;

  const heading=document.createElement("h3");
  heading.textContent=t(section.title);
  card.append(heading);

  if(section.subtitle){
    card.append(
      make("p","section-subtitle",t(section.subtitle))
    );
  }

  const imageBox=make("div","image-placeholder");
  imageBox.dataset.imageRole=section.id;
  imageBox.dataset.imageSrc=
    `./assets/sections-centered/${section.id}.png`;

  const image=document.createElement("img");
  image.src=imageBox.dataset.imageSrc;
  image.alt=`${t(section.title)} ${t("illustration")}`;
  image.addEventListener("error",()=>image.remove());

  imageBox.append(
    image,
    make("span","",t(section.imageLabel))
  );
  card.append(imageBox);

  const slots=make("div","section-slots");
  getSlotsBySection(section.id).forEach(slot=>
    slots.append(renderSlot(slot))
  );
  card.append(slots);

  return card;
}

export function renderArchitecture():void{
  const canvas=document.getElementById("architecture-canvas");
  if(!canvas)return;

  canvas.replaceChildren();
  const thirdParty=sectionDefinitions.find(
    section=>section.id==="third-party"
  );

  if(thirdParty){
    const sideLane=make("div","third-party-lane");
    sideLane.append(renderArchitectureSection(thirdParty));
    canvas.append(sideLane);
  }

  const main=make("div","main-path");

  for(const section of sectionDefinitions.filter(
    item=>item.id!=="third-party"
  )){
    if(main.childElementCount){
      const arrow=make("div","flow-arrow","→");
      arrow.setAttribute("aria-hidden","true");
      main.append(arrow);
    }

    main.append(renderArchitectureSection(section));
  }

  canvas.append(main);
}

export function renderToolbox():void{
  const toolbox=document.getElementById("component-toolbox");
  if(!toolbox)return;

  toolbox.replaceChildren();

  for(const category of Object.keys(categoryLabels)as ComponentCategory[]){
    const group=make("section","toolbox-group");
    const heading=document.createElement("h3");
    heading.textContent=t(categoryLabels[category]);
    group.append(heading);

    const cards=make("div","component-list");
    securityComponents
      .filter(component=>component.category===category)
      .forEach(component=>{
        const card=document.createElement("button");
        const disabled=isComponentDisabled(component.id);

        card.type="button";
        card.className="component-card";
        card.draggable=!disabled;
        card.dataset.componentId=component.id;
        card.dataset.category=component.category;
        card.title=t(component.description);
        card.ariaDisabled=String(disabled);
        card.classList.toggle("disabled",disabled);
        card.classList.toggle(
          "selected",
          getSelectedComponent()===component.id
        );
        card.append(componentVisual(component));
        cards.append(card);
      });

    group.append(cards);
    toolbox.append(group);
  }
}

export function renderAll():void{
  renderArchitecture();
  renderToolbox();
}

export function showError(
  message:string,
  slotId?:string
):void{
  const error=document.getElementById("error-message");
  if(error){
    error.dataset.sourceMessage=message;
    error.textContent=translateMessage(message);
  }

  if(slotId){
    document
      .querySelector<HTMLElement>(`[data-slot-id="${slotId}"]`)
      ?.classList.toggle("invalid",Boolean(message));
  }
}

export function configureStateDialog():void{
  const dialog=document.getElementById(
    "state-dialog"
  )as HTMLDialogElement|null;
  if(!dialog)return;

  dialog.addEventListener("close",()=>{
    const error=document.getElementById("dialog-error");
    if(error)error.textContent="";
  });
}
