import { initializeDragAndDrop } from "./dragdrop.js";
import { getArchitecturePreset } from "./presets.js";
import { renderBuilder, renderEvaluation } from "./renderer.js";
import {
  getArchitectureState,
  getPlacements,
  replaceArchitecture,
  resetArchitecture,
  subscribe,
} from "./state.js";
import type { ArchitectureState } from "./types.js";

const byId = <T extends HTMLElement>(id: string): T | null =>
  document.getElementById(id) as T | null;

function initialize(): void {
  const analysisDialog = byId<HTMLDialogElement>("analysis-dialog");
  const analyzeButton = byId<HTMLButtonElement>(
    "analyze-architecture-button",
  );
  const dialog = byId<HTMLDialogElement>("state-dialog");
  const textarea = byId<HTMLTextAreaElement>("state-json");
  const dialogTitle = byId<HTMLElement>("dialog-title");
  const dialogHelp = byId<HTMLElement>("dialog-help");
  const dialogError = byId<HTMLElement>("dialog-error");
  const copyButton = byId<HTMLButtonElement>("copy-json-button");
  const importButton = byId<HTMLButtonElement>("apply-import-button");

  const handleArchitectureChange = (): void => {
    renderBuilder();
    analysisDialog?.close();
    const canAnalyze = getPlacements().length > 0;
    if (analyzeButton) {
      analyzeButton.disabled = !canAnalyze;
      const hint = analyzeButton.querySelector("small");
      if (hint)
        hint.textContent = canAnalyze
          ? "Your architecture is ready"
          : "Build your architecture first";
    }
  };

  handleArchitectureChange();
  subscribe(handleArchitectureChange);
  initializeDragAndDrop();

  document.querySelectorAll<HTMLButtonElement>("[data-preset-id]").forEach(
    (button) => {
      button.addEventListener("click", () => {
        const preset = getArchitecturePreset(button.dataset.presetId ?? "");
        if (!preset) return;
        replaceArchitecture(preset.state);
        document.querySelectorAll(".preset-button").forEach((item) =>
          item.classList.remove("preset-active"),
        );
        button.classList.add("preset-active");
        byId<HTMLElement>("architecture-canvas")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    },
  );

  analyzeButton?.addEventListener(
    "click",
    () => {
      renderEvaluation();
      analysisDialog?.showModal();
    },
  );
  byId<HTMLButtonElement>("close-analysis-button")?.addEventListener(
    "click",
    () => analysisDialog?.close(),
  );
  analysisDialog?.addEventListener("click", (event) => {
    if (event.target === analysisDialog) analysisDialog.close();
  });

  byId<HTMLButtonElement>("reset-button")?.addEventListener("click", () => {
    resetArchitecture();
    document
      .querySelectorAll(".preset-button")
      .forEach((item) => item.classList.remove("preset-active"));
    analysisDialog?.close();
    const error = byId<HTMLElement>("error-message");
    if (error) error.textContent = "";
  });

  byId<HTMLButtonElement>("export-button")?.addEventListener("click", () => {
    if (!dialog || !textarea) return;
    textarea.value = JSON.stringify(getArchitectureState(), null, 2);
    if (dialogTitle) dialogTitle.textContent = "Export Architecture";
    if (dialogHelp)
      dialogHelp.textContent = "Copy the current architecture JSON.";
    if (dialogError) dialogError.textContent = "";
    if (copyButton) copyButton.hidden = false;
    if (importButton) importButton.hidden = true;
    dialog.showModal();
  });

  byId<HTMLButtonElement>("import-button")?.addEventListener("click", () => {
    if (!dialog || !textarea) return;
    textarea.value = "";
    if (dialogTitle) dialogTitle.textContent = "Import Architecture";
    if (dialogHelp)
      dialogHelp.textContent = "Paste an exported architecture JSON document.";
    if (dialogError) dialogError.textContent = "";
    if (copyButton) copyButton.hidden = true;
    if (importButton) importButton.hidden = false;
    dialog.showModal();
  });

  copyButton?.addEventListener("click", async () => {
    if (!textarea) return;
    await navigator.clipboard.writeText(textarea.value);
    if (dialogHelp) dialogHelp.textContent = "JSON copied.";
  });

  importButton?.addEventListener("click", () => {
    if (!textarea || !dialog) return;
    try {
      const parsed = JSON.parse(textarea.value) as ArchitectureState;
      if (!replaceArchitecture(parsed))
        throw new Error("Invalid architecture state.");
      if (dialogError) dialogError.textContent = "";
      dialog.close();
    } catch (error) {
      if (dialogError)
        dialogError.textContent =
          error instanceof Error ? error.message : "Invalid JSON.";
    }
  });
}

initialize();
