const c = (id, label, category, description, allowedSlotTypes) => ({ id, label, category, description, allowedSlotTypes, reusable: false, futureImageUrl: `./assets/components/${id}.png`, futureMetadata: {} });
export const securityComponents = [
    c("password", "Password", "client-components", "Password-based client credential.", ["client-component"]),
    c("mfa", "MFA", "client-components", "Multi-factor client authentication.", ["client-component"]),
    c("biometric-authentication", "Biometric Authentication", "client-components", "Biometric client authentication.", ["client-component"]),
    c("pki-certificate", "PKI Certificate", "client-components", "Certificate-based client credential.", ["client-component"]),
    c("endpoint-protection", "Endpoint Protection", "client-components", "Security protection for the client endpoint.", ["client-component"]),
    c("authentication-service", "Authentication Service", "authentication-services", "Primary authentication service.", ["authentication-component"]),
    c("identity-provider", "Identity Provider", "authentication-services", "Centralized identity service.", ["authentication-component"]),
    c("network-connection", "Network Connection", "connection-security", "Network-level connection.", ["internet-component"]),
    c("application-connection", "Application Connection", "connection-security", "Application-level connection.", ["internet-component"]),
    c("connection-encryption", "Connection Encryption", "connection-security", "Encryption layered over a network or application connection.", ["internet-component"]),
    c("vpn-tunnel", "VPN Tunnel", "connection-security", "Encrypted VPN communication tunnel.", ["internet-component"]),
    c("external-authentication-service", "External Authentication Service", "third-party", "External service for identity authentication.", ["third-party-component"]),
    c("external-cloud-storage", "External Cloud Storage", "third-party", "External service for cloud data storage.", ["third-party-component"]),
    c("external-payment-service", "External Payment Service", "third-party", "External service for payment processing.", ["third-party-component"]),
    c("external-monitoring-service", "External Monitoring Service", "third-party", "External service for system monitoring.", ["third-party-component"]),
    c("firewall", "Firewall", "network-components", "Network traffic filtering.", ["transition-component"]),
    c("policy-engine", "Policy Engine", "network-components", "Policy evaluation.", ["transition-component"]),
    c("relay-node", "Relay Node", "network-components", "Connection relay.", ["transition-component"]),
    c("private-corporate-network", "Private Corporate Network", "network-types", "Private corporate target.", ["network-type"]),
    c("local-network", "Local Network", "network-types", "Local network target.", ["network-type"]),
    c("cloud-resource", "Cloud Resource", "network-types", "Cloud-hosted target resource.", ["network-type"]),
    c("public-network", "Public Network", "network-types", "Public network target.", ["network-type"])
];
export function getComponentById(id) { return securityComponents.find(x => x.id === id); }
export function updateComponentImageUrl(id, url) { const x = getComponentById(id); if (x)
    x.futureImageUrl = url; }
//# sourceMappingURL=components.js.map