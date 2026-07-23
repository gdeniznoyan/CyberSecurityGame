import { exportArchitectureState, importArchitectureState } from "./architectureState.js";
import { initializeDragAndDrop } from "./dragdrop.js";
import { initializeImageManager } from "./imageManager.js";
import { analyzeArchitecture, renderArchitectureResult } from "./resultPlaceholder.js";
import { configureStateDialog, renderAll, showError } from "./renderer.js";
import { resetState, subscribe } from "./state.js";
const byId = (id) => document.getElementById(id);
function initialize() {
    renderAll();
    subscribe(renderAll);
    initializeImageManager(renderAll);
    initializeDragAndDrop(showError, renderAll);
    configureStateDialog();
    renderArchitectureResult(null);
    byId("reset-button")?.addEventListener("click", () => { resetState(); showError(""); renderArchitectureResult(null); const textarea = byId("state-json"); if (textarea)
        textarea.value = ""; });
    byId("analyze-button")?.addEventListener("click", () => { const result = analyzeArchitecture(); renderArchitectureResult(result); });
    const dialog = byId("state-dialog"), textarea = byId("state-json"), help = byId("dialog-help"), copy = byId("copy-json-button"), apply = byId("apply-import-button"), error = byId("dialog-error");
    byId("export-button")?.addEventListener("click", () => { if (!dialog || !textarea || !help || !copy || !apply)
        return; textarea.value = exportArchitectureState(); help.textContent = "Copy the current architecture JSON."; copy.hidden = false; apply.hidden = true; dialog.showModal(); });
    byId("import-button")?.addEventListener("click", () => { if (!dialog || !textarea || !help || !copy || !apply)
        return; textarea.value = ""; help.textContent = "Paste architecture-state JSON, then choose Import JSON."; copy.hidden = true; apply.hidden = false; dialog.showModal(); textarea.focus(); });
    copy?.addEventListener("click", async () => { if (!textarea)
        return; try {
        await navigator.clipboard.writeText(textarea.value);
        if (help)
            help.textContent = "JSON copied.";
    }
    catch {
        textarea.select();
        document.execCommand("copy");
    } });
    apply?.addEventListener("click", () => { if (!textarea || !error || !dialog)
        return; const result = importArchitectureState(textarea.value); error.textContent = result.errors.join(" "); if (result.valid) {
        dialog.close();
        showError("");
    } });
}
initialize();
//# sourceMappingURL=main.js.map