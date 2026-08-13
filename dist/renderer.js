import { componentList, getComponentById } from "./components.js";
import { evaluateArchitecture } from "./evaluator.js";
import { getConnections, getPlacements } from "./state.js";
const stages = [
    {
        areaId: "user-device",
        title: "User & Device",
        image: "./assets/journey-v2/user-device.png",
    },
    {
        areaId: "identity-route",
        title: "Identity",
        image: "./assets/journey-v2/identity.png",
    },
    {
        areaId: "access-enforcement",
        title: "Access Control",
        image: "./assets/journey-v2/access-control.png",
    },
    {
        areaId: "connection-method",
        title: "Connection",
        image: "./assets/journey-v2/secure-connection.png",
    },
    {
        areaId: "reachable-resources",
        title: "Protected Resources",
        image: "./assets/journey-v2/protected-resource.png",
    },
];
const toolboxGroups = [
    { title: "Device", areaId: "user-device" },
    { title: "Identity", areaId: "identity-route" },
    { title: "Access", areaId: "access-enforcement" },
    { title: "Connection", areaId: "connection-method" },
    { title: "Resources", areaId: "reachable-resources" },
    { title: "External", areaId: "third-party-systems" },
];
function componentVisual(component) {
    const fragment = document.createDocumentFragment();
    const imageBox = document.createElement("span");
    imageBox.className = "component-image";
    const image = document.createElement("img");
    image.src = component.icon;
    image.alt = "";
    imageBox.append(image);
    const copy = document.createElement("span");
    copy.className = "component-copy";
    const label = document.createElement("span");
    label.className = "component-label";
    label.textContent = component.name;
    copy.append(label);
    fragment.append(imageBox, copy);
    return fragment;
}
function renderPlacedComponent(placement) {
    const component = getComponentById(placement.componentId);
    const row = document.createElement("div");
    row.className = "placed-component";
    row.dataset.componentNode = placement.componentId;
    if (!component)
        return row;
    const image = document.createElement("img");
    image.src = component.icon;
    image.alt = "";
    const name = document.createElement("span");
    name.textContent = component.name;
    const actions = document.createElement("span");
    actions.className = "placed-actions";
    const link = document.createElement("button");
    link.type = "button";
    link.className = "node-action connect-button";
    link.dataset.connectComponent = component.id;
    link.title = "Connect this component";
    link.textContent = "↗";
    const settings = document.createElement("button");
    settings.type = "button";
    settings.className = "node-action";
    settings.dataset.editComponent = component.id;
    settings.title = "Configure";
    settings.textContent = "⚙";
    settings.hidden = component.configuration.length === 0;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "node-action remove-button";
    remove.dataset.removeComponent = component.id;
    remove.title = "Remove";
    remove.textContent = "×";
    actions.append(link, settings, remove);
    row.append(image, name, actions);
    return row;
}
function renderDropZone(areaId) {
    const zone = document.createElement("div");
    zone.className = "drop-slot area-drop-zone";
    zone.dataset.areaId = areaId;
    const placements = getPlacements().filter((item) => item.areaId === areaId);
    if (!placements.length) {
        const placeholder = document.createElement("span");
        placeholder.className = "slot-placeholder";
        placeholder.textContent = "Drop here";
        zone.append(placeholder);
        return zone;
    }
    zone.classList.add("occupied");
    const list = document.createElement("div");
    list.className = "placed-components";
    placements.forEach((item) => list.append(renderPlacedComponent(item)));
    zone.append(list);
    return zone;
}
function renderStage(stage, index) {
    const card = document.createElement("article");
    card.className = "journey-stage";
    card.dataset.stage = stage.areaId;
    if (getPlacements().some((item) => item.areaId === stage.areaId))
        card.classList.add("stage-active");
    if (stage.areaId === "reachable-resources")
        card.classList.add("protected-stage");
    const head = document.createElement("div");
    head.className = "stage-head";
    const step = document.createElement("span");
    step.className = "stage-step";
    step.textContent = String(index + 1);
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = stage.title;
    copy.append(title);
    head.append(step, copy);
    const visual = document.createElement("div");
    visual.className = "stage-visual";
    const image = document.createElement("img");
    image.src = stage.image;
    image.alt = "";
    visual.append(image);
    card.append(head, visual, renderDropZone(stage.areaId));
    return card;
}
function renderConnector(index) {
    const connector = document.createElement("div");
    connector.className = "journey-connector";
    const line = document.createElement("span");
    const arrow = document.createElement("span");
    arrow.className = "connector-arrow";
    arrow.setAttribute("aria-hidden", "true");
    connector.append(line, arrow);
    if (index === 1) {
        connector.classList.add("internet-crossing");
        const label = document.createElement("span");
        label.className = "internet-label";
        label.textContent = "PUBLIC INTERNET";
        const image = document.createElement("img");
        image.className = "internet-globe";
        image.src = "./assets/journey-v2/internet-crossing.png";
        image.alt = "Public Internet";
        connector.append(image, label);
    }
    return connector;
}
function renderConnectionMap() {
    const box = document.createElement("section");
    box.className = "connection-map";
    const heading = document.createElement("div");
    heading.className = "connection-map-heading";
    heading.innerHTML = "<strong>Active connections</strong>";
    box.append(heading);
    const list = document.createElement("div");
    list.className = "connection-list";
    const connections = getConnections();
    if (!connections.length) {
        const empty = document.createElement("span");
        empty.className = "connection-empty";
        empty.textContent = "No component links yet";
        list.append(empty);
    }
    connections.forEach((connection) => {
        const item = document.createElement("div");
        item.className = "connection-item";
        const source = getComponentById(connection.sourceComponentId)?.name ??
            connection.sourceComponentId;
        const target = getComponentById(connection.targetComponentId)?.name ??
            connection.targetComponentId;
        const text = document.createElement("span");
        text.textContent = `${source}  →  ${target}`;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.dataset.removeConnectionSource = connection.sourceComponentId;
        remove.dataset.removeConnectionTarget = connection.targetComponentId;
        remove.textContent = "×";
        item.append(text, remove);
        list.append(item);
    });
    box.append(list);
    return box;
}
function renderSettingsPanel() {
    const panel = document.createElement("aside");
    panel.id = "component-settings";
    panel.className = "component-settings";
    panel.hidden = true;
    return panel;
}
function renderThirdParty() {
    const panel = document.createElement("aside");
    panel.className = "external-services-panel";
    const visual = document.createElement("div");
    visual.className = "external-services-visual";
    const image = document.createElement("img");
    image.src = "./assets/journey-v2/third-party-systems.png";
    image.alt = "";
    visual.append(image);
    const copy = document.createElement("div");
    copy.innerHTML = "<h3>Third-Party Systems</h3>";
    panel.append(visual, copy, renderDropZone("third-party-systems"));
    return panel;
}
export function renderArchitecture() {
    const canvas = document.getElementById("architecture-canvas");
    if (!canvas)
        return;
    const journey = document.createElement("div");
    journey.className = "customer-journey";
    stages.forEach((stage, index) => {
        if (index)
            journey.append(renderConnector(index - 1));
        journey.append(renderStage(stage, index));
    });
    const secondary = document.createElement("div");
    secondary.className = "canvas-secondary";
    secondary.append(renderThirdParty());
    canvas.replaceChildren(journey, secondary, renderConnectionMap(), renderSettingsPanel());
}
export function showComponentSettings(componentId) {
    const panel = document.getElementById("component-settings");
    const placement = getPlacements().find((item) => item.componentId === componentId);
    const component = getComponentById(componentId);
    if (!panel || !placement || !component || !component.configuration.length)
        return;
    panel.hidden = false;
    panel.dataset.settingsComponent = componentId;
    const header = document.createElement("div");
    header.className = "settings-header";
    const title = document.createElement("div");
    title.innerHTML = `<small>Configuration</small><strong>${component.name}</strong>`;
    const close = document.createElement("button");
    close.type = "button";
    close.dataset.closeSettings = "true";
    close.textContent = "×";
    header.append(title, close);
    const description = document.createElement("p");
    description.className = "settings-description";
    description.textContent = component.description;
    const form = document.createElement("div");
    form.className = "settings-form";
    component.configuration.forEach((definition) => {
        const label = document.createElement("label");
        label.className = "setting-row";
        const text = document.createElement("span");
        text.textContent = definition.label;
        let control;
        if (definition.type === "boolean") {
            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked = placement.configuration[definition.id] === true;
            control = input;
        }
        else {
            const select = document.createElement("select");
            definition.options.forEach((option) => {
                const item = document.createElement("option");
                item.value = option;
                item.textContent = option;
                select.append(item);
            });
            select.value = String(placement.configuration[definition.id]);
            control = select;
        }
        control.dataset.configurationKey = definition.id;
        control.dataset.configurationComponent = componentId;
        label.append(text, control);
        form.append(label);
    });
    panel.replaceChildren(header, description, form);
}
export function renderToolbox() {
    const toolbox = document.getElementById("component-toolbox");
    if (!toolbox)
        return;
    const fragment = document.createDocumentFragment();
    toolboxGroups.forEach((definition) => {
        const group = document.createElement("section");
        group.className = "toolbox-group";
        const heading = document.createElement("div");
        heading.className = "toolbox-group-heading";
        const title = document.createElement("span");
        title.textContent = definition.title;
        const components = componentList.filter((item) => item.allowedAreaIds.includes(definition.areaId));
        const count = document.createElement("span");
        count.textContent = String(components.length);
        heading.append(title, count);
        const list = document.createElement("div");
        list.className = "component-list";
        components.forEach((component) => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "component-card";
            card.draggable = true;
            card.dataset.componentId = component.id;
            card.title = component.description;
            card.append(componentVisual(component));
            list.append(card);
        });
        group.append(heading, list);
        fragment.append(group);
    });
    toolbox.replaceChildren(fragment);
}
function insight(title, output, status = "neutral", featured = false) {
    const card = document.createElement("section");
    card.className = "insight-card";
    card.dataset.status = status;
    if (featured)
        card.classList.add("insight-featured");
    const heading = document.createElement("h3");
    heading.textContent = title;
    const text = document.createElement("p");
    text.textContent = output;
    card.append(heading, text);
    return card;
}
export function renderEvaluation() {
    const list = document.getElementById("result-insights");
    const score = document.getElementById("security-score-value");
    const chart = document.querySelector(".security-score-chart");
    const classification = document.getElementById("architecture-result-value");
    if (!list || !score || !chart || !classification)
        return;
    const result = evaluateArchitecture();
    classification.textContent = result.classification;
    score.textContent = String(result.score);
    chart.style.setProperty("--score-progress", String(result.score));
    list.replaceChildren(insight("Access Path", result.accessPath.length
        ? result.accessPath.join(" → ")
        : "No complete path from user to resource.", result.accessPath.length ? "good" : "warning", true), insight("Authentication Model", result.authenticationModel), insight("Authentication Dependency", result.authenticationDependency), insight("Policy Evaluation", result.policyEvaluation, result.properties.evaluatesAccessPolicy ? "good" : "warning"), insight("Policy Enforcement", result.policyEnforcement, result.properties.enforcesAccessPolicy ? "good" : "warning"), insight("Connection Type", result.connectionType), insight("Client Network Visibility", result.clientNetworkVisibility, result.properties.exposesNetworkInformation ? "warning" : "good"), insight("Client Reachability", result.clientReachability), insight("Network Participation", result.networkParticipation, result.properties.createsVirtualNetworkInterface ? "warning" : "good"), insight("Detected Openings", result.openings.length
        ? result.openings.join(" · ")
        : "No opening detected on the effective path.", result.openings.length ? "warning" : "good", true), insight("Recommended Change", result.recommendation, "neutral", true));
}
export function renderBuilder() {
    renderArchitecture();
    renderToolbox();
}
//# sourceMappingURL=renderer.js.map