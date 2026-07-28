export const sectionDefinitions = [{ id: "client-computer", title: "Client Computer", imageLabel: "Client Computer Image" }, { id: "authentication", title: "Authentication", imageLabel: "Authentication Image" }, { id: "wild-internet", title: "Wild Internet", imageLabel: "Wild Internet Image" }, { id: "third-party", title: "3rd Party", imageLabel: "Third Party Image" }, { id: "gateway", title: "Security Transition", subtitle: "Between Wild Internet and Target Network", imageLabel: "Security Transition Image" }, { id: "target-network", title: "Target Network", imageLabel: "Target Network Image" }];
const s = (id, label, section, slotType, ids, text, required = false) => ({ id, label, section, slotType, allowedComponentIds: ids, required, enabled: true, placeholderText: text });
const clientComponents = ["password", "mfa", "biometric-authentication", "pki-certificate", "endpoint-protection"];
const authenticationComponents = ["authentication-service", "identity-provider"];
const internetComponents = ["network-connection", "application-connection", "connection-encryption", "vpn-tunnel"];
const thirdPartyComponents = ["cloud-service", "external-api", "vpn-provider"];
const transitionComponents = ["firewall", "policy-engine", "relay-node"];
const targetNetworks = ["private-corporate-network", "local-network", "cloud-resource", "public-network"];
export const slotDefinitions = [
    s("client-component-1", "Client Security", "client-computer", "client-component", clientComponents, "Drop a client component"),
    s("client-component-2", "Client Security", "client-computer", "client-component", clientComponents, "Drop a client component"),
    s("client-component-3", "Client Security", "client-computer", "client-component", clientComponents, "Drop a client component"),
    s("client-component-4", "Client Security", "client-computer", "client-component", clientComponents, "Drop a client component"),
    s("client-component-5", "Client Security", "client-computer", "client-component", clientComponents, "Drop a client component"),
    s("authentication-component-1", "Authentication Flow", "authentication", "authentication-component", authenticationComponents, "Drop an authentication component"),
    s("authentication-component-2", "Authentication Flow", "authentication", "authentication-component", authenticationComponents, "Drop an authentication component"),
    s("internet-component-1", "Internet Connection", "wild-internet", "internet-component", internetComponents, "Drop a connection component"),
    s("internet-component-2", "Internet Connection", "wild-internet", "internet-component", internetComponents, "Drop a connection component"),
    s("internet-component-3", "Internet Connection", "wild-internet", "internet-component", internetComponents, "Drop a connection component"),
    s("internet-component-4", "Internet Connection", "wild-internet", "internet-component", internetComponents, "Drop a connection component"),
    s("third-party-component-1", "Third-Party Service", "third-party", "third-party-component", thirdPartyComponents, "Drop a third-party service"),
    s("third-party-component-2", "Third-Party Service", "third-party", "third-party-component", thirdPartyComponents, "Drop a third-party service"),
    s("third-party-component-3", "Third-Party Service", "third-party", "third-party-component", thirdPartyComponents, "Drop a third-party service"),
    s("transition-component-1", "Security Control", "gateway", "transition-component", transitionComponents, "Drop a security control"),
    s("transition-component-2", "Security Control", "gateway", "transition-component", transitionComponents, "Drop a security control"),
    s("transition-component-3", "Security Control", "gateway", "transition-component", transitionComponents, "Drop a security control"),
    s("target-network-type", "Target Network", "target-network", "network-type", targetNetworks, "Drop one target network", true)
];
export function getSlotById(id) { return slotDefinitions.find(x => x.id === id); }
export function getSlotsBySection(section) { return slotDefinitions.filter(x => x.section === section); }
//# sourceMappingURL=slots.js.map