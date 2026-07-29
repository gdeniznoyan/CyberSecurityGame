import { exportArchitectureState, importArchitectureState } from "./architectureState.js";
import { initializeDragAndDrop } from "./dragDrop.js";
import { applyPageTranslations, getLanguage, initializeLanguage, setLanguage, subscribeToLanguage, t, translateMessage } from "./i18n.js";
import { initializeImageManager } from "./imageManager.js";
import { configureStateDialog, renderAll, showError } from "./renderer.js";
import { renderArchitectureInsights } from "./resultInsights.js";
import { resetState, subscribe } from "./state.js";
const byId = (id) => document.getElementById(id);
function initialize() {
    initializeLanguage();
    let dialogMode = null;
    const renderInterface = () => {
        renderAll();
        applyPageTranslations();
    };
    const dialog = byId("state-dialog");
    const textarea = byId("state-json");
    const help = byId("dialog-help");
    const copy = byId("copy-json-button");
    const apply = byId("apply-import-button");
    const error = byId("dialog-error");
    const languageSelect = byId("language-select");
    const updateDialogHelp = () => {
        if (!help)
            return;
        if (dialogMode === "export") {
            help.textContent = t("Copy the current architecture JSON.");
        }
        else if (dialogMode === "import") {
            help.textContent = t("Paste architecture-state JSON, then choose Import JSON.");
        }
    };
    renderInterface();
    renderArchitectureInsights();
    configureStateDialog();
    subscribe(() => {
        renderInterface();
        renderArchitectureInsights();
    });
    initializeImageManager(renderInterface);
    initializeDragAndDrop(showError, renderInterface);
    if (languageSelect) {
        languageSelect.value = getLanguage();
        languageSelect.addEventListener("change", () => {
            setLanguage(languageSelect.value === "tr" ? "tr" : "en");
        });
    }
    subscribeToLanguage(() => {
        renderInterface();
        renderArchitectureInsights();
        updateDialogHelp();
    });
    byId("reset-button")?.addEventListener("click", () => {
        resetState();
        showError("");
        if (textarea)
            textarea.value = "";
    });
    byId("analyze-button")?.addEventListener("click", () => {
        renderArchitectureInsights();
    });
    byId("export-button")?.addEventListener("click", () => {
        if (!dialog || !textarea || !copy || !apply)
            return;
        dialogMode = "export";
        textarea.value = exportArchitectureState();
        updateDialogHelp();
        copy.hidden = false;
        apply.hidden = true;
        dialog.showModal();
    });
    byId("import-button")?.addEventListener("click", () => {
        if (!dialog || !textarea || !copy || !apply)
            return;
        dialogMode = "import";
        textarea.value = "";
        updateDialogHelp();
        copy.hidden = true;
        apply.hidden = false;
        dialog.showModal();
        textarea.focus();
    });
    copy?.addEventListener("click", async () => {
        if (!textarea)
            return;
        try {
            await navigator.clipboard.writeText(textarea.value);
            if (help)
                help.textContent = t("JSON copied.");
        }
        catch {
            textarea.select();
            document.execCommand("copy");
        }
    });
    apply?.addEventListener("click", () => {
        if (!textarea || !error || !dialog)
            return;
        const result = importArchitectureState(textarea.value);
        error.dataset.sourceMessages = JSON.stringify(result.errors);
        error.textContent = result.errors
            .map(message => translateMessage(message))
            .join(" ");
        if (result.valid) {
            dialog.close();
            showError("");
        }
    });
}
initialize();
//# sourceMappingURL=main.js.map