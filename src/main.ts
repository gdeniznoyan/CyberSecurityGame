import{initializeDragAndDrop}from"./dragDrop.js";
import{renderAll,renderEvaluation}from"./renderer.js";
import{getArchitectureState,replaceArchitecture,resetArchitecture,subscribe}from"./state.js";
import type{ArchitectureState}from"./types.js";

const byId=<T extends HTMLElement>(id:string):T|null=>document.getElementById(id)as T|null;

function initialize():void{
  const dialog=byId<HTMLDialogElement>("state-dialog");
  const textarea=byId<HTMLTextAreaElement>("state-json");
  const dialogTitle=byId<HTMLElement>("dialog-title");
  const dialogHelp=byId<HTMLElement>("dialog-help");
  const dialogError=byId<HTMLElement>("dialog-error");
  const copyButton=byId<HTMLButtonElement>("copy-json-button");
  const importButton=byId<HTMLButtonElement>("apply-import-button");

  renderAll();
  subscribe(renderAll);
  initializeDragAndDrop();

  byId<HTMLButtonElement>("reset-button")?.addEventListener("click",()=>{
    resetArchitecture();
    const error=byId<HTMLElement>("error-message");
    if(error)error.textContent="";
  });

  byId<HTMLButtonElement>("analyze-button")?.addEventListener("click",renderEvaluation);

  byId<HTMLButtonElement>("export-button")?.addEventListener("click",()=>{
    if(!dialog||!textarea)return;
    textarea.value=JSON.stringify(getArchitectureState(),null,2);
    if(dialogTitle)dialogTitle.textContent="Export Architecture";
    if(dialogHelp)dialogHelp.textContent="Copy the current architecture JSON.";
    if(dialogError)dialogError.textContent="";
    if(copyButton)copyButton.hidden=false;
    if(importButton)importButton.hidden=true;
    dialog.showModal();
  });

  byId<HTMLButtonElement>("import-button")?.addEventListener("click",()=>{
    if(!dialog||!textarea)return;
    textarea.value="";
    if(dialogTitle)dialogTitle.textContent="Import Architecture";
    if(dialogHelp)dialogHelp.textContent="Paste an exported architecture JSON document.";
    if(dialogError)dialogError.textContent="";
    if(copyButton)copyButton.hidden=true;
    if(importButton)importButton.hidden=false;
    dialog.showModal();
  });

  copyButton?.addEventListener("click",async()=>{
    if(!textarea)return;
    await navigator.clipboard.writeText(textarea.value);
    if(dialogHelp)dialogHelp.textContent="JSON copied.";
  });

  importButton?.addEventListener("click",()=>{
    if(!textarea||!dialog)return;
    try{
      const parsed=JSON.parse(textarea.value)as ArchitectureState;
      if(!replaceArchitecture(parsed))throw new Error("Invalid architecture state.");
      if(dialogError)dialogError.textContent="";
      dialog.close();
    }catch(error){
      if(dialogError)dialogError.textContent=error instanceof Error?error.message:"Invalid JSON.";
    }
  });
}

initialize();
