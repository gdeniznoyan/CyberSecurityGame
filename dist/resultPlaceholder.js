import { getArchitectureState } from "./architectureState.js";
import { getComponentById } from "./components.js";
const p = (client, authentication, internet, thirdParty, transition, target) => ({ "client-component": client, "authentication-component": authentication, "internet-component": internet, "third-party-component": thirdParty, "transition-component": transition, "target-network-type": target });
export const scenarios = [
    { id: "scenario-1", name: "Public Network Access", placements: p("password", "authentication", "network-connection", "external-api", "dns", "public-network") },
    { id: "scenario-2", name: "Local Network Access", placements: p("password", "authentication", "network-connection", "vpn-provider", "firewall", "local-network") },
    { id: "scenario-3", name: "Secure Corporate Access", placements: p("password", "authentication", "connection-encryption", "cloud-service", "firewall", "private-corporate-network") },
    { id: "scenario-4", name: "MFA Corporate Access", placements: p("mfa", "authentication", "connection-encryption", "identity-provider", "firewall", "private-corporate-network") },
    { id: "scenario-5", name: "Biometric VPN Access", placements: p("biometric", "biometric", "connection-encryption", "vpn-provider", "firewall", "private-virtual-network") },
    { id: "scenario-6", name: "Certificate-Based Access", placements: p("pki-certificate", "certificate-authority", "connection-encryption", "identity-provider", "firewall", "private-corporate-network") },
    { id: "scenario-7", name: "Cloud Application Access", placements: p("application-connection", "authentication", "application-connection", "cloud-service", "firewall", "private-corporate-network") },
    { id: "scenario-8", name: "Controlled Zero Trust Access", placements: p("mfa", "authentication", "controlled-access", "identity-provider", "policy-engine", "private-corporate-network") },
    { id: "scenario-9", name: "Certificate Zero Trust", placements: p("pki-certificate", "certificate-authority", "controlled-access", "identity-provider", "policy-engine", "private-virtual-network") },
    { id: "scenario-10", name: "Relay Protected Access", placements: p("mfa", "authentication", "connection-encryption", "vpn-provider", "relay-node", "private-virtual-network") },
    { id: "scenario-11", name: "RAM Encryption Architecture", placements: p("pki-certificate", "certificate-authority", "ram-encryption", "cloud-service", "relay-node", "private-virtual-network") },
    { id: "scenario-12", name: "Advanced Zero Trust", placements: p("biometric", "pki-certificate", "controlled-access", "identity-provider", "policy-engine", "private-virtual-network") }
];
const slotOrder = ["client-component", "authentication-component", "internet-component", "third-party-component", "transition-component", "target-network-type"];
export function analyzeArchitecture() { const current = getArchitectureState().slots; const scenario = scenarios.find(item => slotOrder.every(id => current[id] === item.placements[id])); if (!scenario)
    return null; return { architectureId: scenario.id, architectureName: `Scenario ${Number(scenario.id.split("-")[1])} – ${scenario.name}`, description: "The current architecture exactly matches this scenario.", enabledFeatures: slotOrder.map(id => getComponentById(current[id] ?? "")?.label ?? ""), remainingRisks: [], recommendation: "" }; }
export function renderArchitectureResult(result) { const initial = document.getElementById("result-initial-message"), description = document.getElementById("result-description"), features = document.getElementById("result-enabled-features"), risks = document.getElementById("result-risks"), recommendation = document.getElementById("result-recommendation"); if (!initial || !description || !features || !risks || !recommendation)
    return; initial.textContent = result ? result.architectureName : "No matching scenario. Complete all six areas with one component each."; description.hidden = !result; features.hidden = !result; risks.hidden = true; recommendation.hidden = true; if (result) {
    description.textContent = result.description;
    features.textContent = `Components: ${result.enabledFeatures.join(" → ")}`;
    risks.textContent = "";
    recommendation.textContent = "";
} }
//# sourceMappingURL=resultPlaceholder.js.map