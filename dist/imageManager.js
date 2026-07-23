import { updateComponentImageUrl } from "./components.js";
let rerender = () => undefined;
export function initializeImageManager(callback) { rerender = callback; }
export function setSectionImage(role, imageUrl) { const box = document.querySelector(`[data-image-role="${role}"]`); if (!box)
    return; box.querySelector("img")?.remove(); box.classList.remove("image-loaded", "image-error", "image-hidden"); box.dataset.imageSrc = imageUrl; const text = box.querySelector("span"); if (text)
    text.hidden = Boolean(imageUrl); if (!imageUrl)
    return; const img = document.createElement("img"); img.alt = ""; img.addEventListener("load", () => box.classList.add("image-loaded")); img.addEventListener("error", () => { img.remove(); box.classList.add("image-error"); if (text)
    text.hidden = false; }); img.src = imageUrl; box.prepend(img); }
export function clearSectionImage(role) { setSectionImage(role, ""); }
export function updateComponentImage(id, imageUrl) { updateComponentImageUrl(id, imageUrl); rerender(); }
//# sourceMappingURL=imageManager.js.map