import{
  exportArchitectureState,
  importArchitectureState
}from"./architectureState.js";
import{initializeDragAndDrop}from"./dragdrop.js";
import{
  applyPageTranslations,
  getLanguage,
  initializeLanguage,
  setLanguage,
  subscribeToLanguage,
  t,
  translateMessage
}from"./i18n.js";
import{initializeImageManager}from"./imageManager.js";
import{
  analyzeArchitecture,
  renderArchitectureResult
}from"./resultPlaceholder.js";
import{
  configureStateDialog,
  renderAll,
  showError
}from"./renderer.js";
import{resetState,subscribe}from"./state.js";
import type{ArchitectureAnalysisResult}from"./types.js";

const byId=<T extends HTMLElement>(id:string):T|null=>
  document.getElementById(id)as T|null;

function initialize():void{
  initializeLanguage();

  let lastResult:ArchitectureAnalysisResult|null=null;
  let dialogMode:"export"|"import"|null=null;

  const renderInterface=():void=>{
    renderAll();
    applyPageTranslations();
  };

  const dialog=byId<HTMLDialogElement>("state-dialog");
  const textarea=byId<HTMLTextAreaElement>("state-json");
  const help=byId<HTMLElement>("dialog-help");
  const copy=byId<HTMLButtonElement>("copy-json-button");
  const apply=byId<HTMLButtonElement>("apply-import-button");
  const error=byId<HTMLElement>("dialog-error");
  const languageSelect=byId<HTMLSelectElement>("language-select");

  const updateDialogHelp=():void=>{
    if(!help)return;
    if(dialogMode==="export"){
      help.textContent=t("Copy the current architecture JSON.");
    }else if(dialogMode==="import"){
      help.textContent=t(
        "Paste architecture-state JSON, then choose Import JSON."
      );
    }
  };

  renderInterface();
  renderArchitectureResult(null);
  configureStateDialog();
  subscribe(renderInterface);
  initializeImageManager(renderInterface);
  initializeDragAndDrop(showError,renderInterface);

  if(languageSelect){
    languageSelect.value=getLanguage();
    languageSelect.addEventListener("change",()=>{
      setLanguage(languageSelect.value==="tr"?"tr":"en");
    });
  }

  subscribeToLanguage(()=>{
    renderInterface();
    renderArchitectureResult(lastResult);
    updateDialogHelp();
  });

  byId<HTMLButtonElement>("reset-button")?.addEventListener("click",()=>{
    resetState();
    lastResult=null;
    showError("");
    renderArchitectureResult(null);
    if(textarea)textarea.value="";
  });

  byId<HTMLButtonElement>("analyze-button")?.addEventListener("click",()=>{
    lastResult=analyzeArchitecture();
    renderArchitectureResult(lastResult);
  });

  byId<HTMLButtonElement>("export-button")?.addEventListener("click",()=>{
    if(!dialog||!textarea||!copy||!apply)return;
    dialogMode="export";
    textarea.value=exportArchitectureState();
    updateDialogHelp();
    copy.hidden=false;
    apply.hidden=true;
    dialog.showModal();
  });

  byId<HTMLButtonElement>("import-button")?.addEventListener("click",()=>{
    if(!dialog||!textarea||!copy||!apply)return;
    dialogMode="import";
    textarea.value="";
    updateDialogHelp();
    copy.hidden=true;
    apply.hidden=false;
    dialog.showModal();
    textarea.focus();
  });

  copy?.addEventListener("click",async()=>{
    if(!textarea)return;
    try{
      await navigator.clipboard.writeText(textarea.value);
      if(help)help.textContent=t("JSON copied.");
    }catch{
      textarea.select();
      document.execCommand("copy");
    }
  });

  apply?.addEventListener("click",()=>{
    if(!textarea||!error||!dialog)return;
    const result=importArchitectureState(textarea.value);
    error.dataset.sourceMessages=JSON.stringify(result.errors);
    error.textContent=result.errors
      .map(message=>translateMessage(message))
      .join(" ");
    if(result.valid){
      dialog.close();
      showError("");
    }
  });
}

initialize();
