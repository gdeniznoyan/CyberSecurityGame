export const sectionDefinitions = [{ id: "client-computer", title: "Client Computer", imageLabel: "Client Computer Image" }, { id: "authentication", title: "Authentication", imageLabel: "Authentication Image" }, { id: "wild-internet", title: "Wild Internet", imageLabel: "Wild Internet Image" }, { id: "third-party", title: "3rd Party", imageLabel: "Third Party Image" }, { id: "gateway", title: "Security Transition", subtitle: "Between Wild Internet and Target Network", imageLabel: "Security Transition Image" }, { id: "target-network", title: "Target Network", imageLabel: "Target Network Image" }];
const s = (id, label, section, slotType, ids, text) => ({ id, label, section, slotType, allowedComponentIds: ids, required: true, enabled: true, placeholderText: text });
export const slotDefinitions = [
    s("client-component", "Client Component", "client-computer", "client-component", ["password", "mfa", "biometric", "pki-certificate", "application-connection"], "Drop one client component"),
    s("authentication-component", "Authentication Component", "authentication", "authentication-component", ["authentication", "biometric", "pki-certificate", "certificate-authority"], "Drop one authentication component"),
    s("internet-component", "Internet Component", "wild-internet", "internet-component", ["network-connection", "application-connection", "connection-encryption", "controlled-access", "ram-encryption"], "Drop one connection component"),
    s("third-party-component", "Third-Party Service", "third-party", "third-party-component", ["identity-provider", "cloud-service", "external-api", "vpn-provider"], "Drop one third-party service"),
    s("transition-component", "Security Control", "gateway", "transition-component", ["dns", "firewall", "policy-engine", "relay-node", "certificate-authority"], "Drop one security component"),
    s("target-network-type", "Target Network", "target-network", "network-type", ["private-corporate-network", "private-virtual-network", "local-network", "public-network"], "Drop Target Network Here")
];
export function getSlotById(id) { return slotDefinitions.find(x => x.id === id); }
export function getSlotsBySection(section) { return slotDefinitions.filter(x => x.section === section); }
//# sourceMappingURL=slots.js.map