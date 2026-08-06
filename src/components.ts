import type{ComponentDefinition}from"./types.js";

export const passwordComponent:ComponentDefinition={
  id:"password",name:"Password",toolboxArea:"access-device",
  icon:"./assets/components/password.png",
  allowedAreaIds:["access-device"],outputByArea:{"access-device":""},scoreByArea:{"access-device":3}
};

export const biometricAuthenticationComponent:ComponentDefinition={
  id:"biometric-authentication",name:"Biometric Authentication",toolboxArea:"access-device",
  icon:"./assets/components/biometric-authentication.png",
  allowedAreaIds:["access-device"],outputByArea:{"access-device":""},scoreByArea:{"access-device":7}
};

export const hardwareSecurityTokenComponent:ComponentDefinition={
  id:"hardware-security-token",name:"Hardware Security Token",toolboxArea:"access-device",
  icon:"./assets/components/mfa.png",
  allowedAreaIds:["access-device"],outputByArea:{"access-device":""},scoreByArea:{"access-device":10}
};

export const zeroFootprintClientComponent:ComponentDefinition={
  id:"zero-footprint-client",name:"Zero-Footprint Client",toolboxArea:"access-device",
  icon:"./assets/components/endpoint-protection.png",
  allowedAreaIds:["access-device"],outputByArea:{"access-device":""},scoreByArea:{"access-device":10}
};

export const privateCaComponent:ComponentDefinition={
  id:"private-ca",name:"Private CA",toolboxArea:"trust-identity-services",
  icon:"./assets/components/certificate-authority.png",
  allowedAreaIds:["trust-identity-services"],outputByArea:{"trust-identity-services":""},scoreByArea:{"trust-identity-services":10}
};

export const x509CertificateComponent:ComponentDefinition={
  id:"x509-certificate",name:"X.509 Certificate",toolboxArea:"trust-identity-services",
  icon:"./assets/components/pki-certificate.png",
  allowedAreaIds:["trust-identity-services"],outputByArea:{"trust-identity-services":""},scoreByArea:{"trust-identity-services":9}
};

export const certificateRevocationCheckComponent:ComponentDefinition={
  id:"certificate-revocation-check",name:"Certificate Revocation Check",toolboxArea:"trust-identity-services",
  icon:"./assets/components/policy-engine.png",
  allowedAreaIds:["trust-identity-services"],outputByArea:{"trust-identity-services":""},scoreByArea:{"trust-identity-services":8}
};

export const otpComponent:ComponentDefinition={
  id:"otp",name:"OTP",toolboxArea:"trust-identity-services",
  icon:"./assets/components/mfa.png",
  allowedAreaIds:["trust-identity-services"],outputByArea:{"trust-identity-services":""},scoreByArea:{"trust-identity-services":7}
};

export const mutualTlsComponent:ComponentDefinition={
  id:"mutual-tls",name:"Mutual TLS",toolboxArea:"secure-session",
  icon:"./assets/components/connection-encryption.png",
  allowedAreaIds:["secure-session"],outputByArea:{"secure-session":""},scoreByArea:{"secure-session":10}
};

export const ramTunnelingComponent:ComponentDefinition={
  id:"ram-tunneling",name:"RAM Tunneling",toolboxArea:"secure-session",
  icon:"./assets/components/ram-encryption.png",
  allowedAreaIds:["secure-session"],outputByArea:{"secure-session":""},scoreByArea:{"secure-session":10}
};

export const aes256EncryptionComponent:ComponentDefinition={
  id:"aes-256-encryption",name:"AES-256 Encryption",toolboxArea:"secure-session",
  icon:"./assets/components/connection-encryption.png",
  allowedAreaIds:["secure-session"],outputByArea:{"secure-session":""},scoreByArea:{"secure-session":9}
};

export const perfectForwardSecrecyComponent:ComponentDefinition={
  id:"perfect-forward-secrecy",name:"Perfect Forward Secrecy",toolboxArea:"secure-session",
  icon:"./assets/components/vpn-tunnel.png",
  allowedAreaIds:["secure-session"],outputByArea:{"secure-session":""},scoreByArea:{"secure-session":8}
};

export const externalAuthenticationServiceComponent:ComponentDefinition={
  id:"external-authentication-service",name:"External Authentication Service",toolboxArea:"third-party-services",
  icon:"./assets/components/external-authentication-service.png",
  allowedAreaIds:["third-party-services"],outputByArea:{"third-party-services":""},scoreByArea:{"third-party-services":-10}
};

export const externalCloudStorageComponent:ComponentDefinition={
  id:"external-cloud-storage",name:"External Cloud Storage",toolboxArea:"third-party-services",
  icon:"./assets/components/external-cloud-storage.png",
  allowedAreaIds:["third-party-services"],outputByArea:{"third-party-services":""},scoreByArea:{"third-party-services":-8}
};

export const externalMonitoringServiceComponent:ComponentDefinition={
  id:"external-monitoring-service",name:"External Monitoring Service",toolboxArea:"third-party-services",
  icon:"./assets/components/external-monitoring-service.png",
  allowedAreaIds:["third-party-services"],outputByArea:{"third-party-services":""},scoreByArea:{"third-party-services":-6}
};

export const externalPaymentServiceComponent:ComponentDefinition={
  id:"external-payment-service",name:"External Payment Service",toolboxArea:"third-party-services",
  icon:"./assets/components/external-payment-service.png",
  allowedAreaIds:["third-party-services"],outputByArea:{"third-party-services":""},scoreByArea:{"third-party-services":-6}
};

export const portCloakingComponent:ComponentDefinition={
  id:"port-cloaking",name:"Port Cloaking",toolboxArea:"invisible-network-protection",
  icon:"./assets/components/firewall.png",
  allowedAreaIds:["invisible-network-protection"],outputByArea:{"invisible-network-protection":""},scoreByArea:{"invisible-network-protection":9}
};

export const hiddenIpPathComponent:ComponentDefinition={
  id:"hidden-ip-path",name:"Hidden IP Path",toolboxArea:"invisible-network-protection",
  icon:"./assets/components/relay-node.png",
  allowedAreaIds:["invisible-network-protection"],outputByArea:{"invisible-network-protection":""},scoreByArea:{"invisible-network-protection":9}
};

export const noVirtualNetworkInterfaceComponent:ComponentDefinition={
  id:"no-virtual-network-interface",name:"No Virtual Network Interface",toolboxArea:"invisible-network-protection",
  icon:"./assets/components/vpn-tunnel.png",
  allowedAreaIds:["invisible-network-protection"],outputByArea:{"invisible-network-protection":""},scoreByArea:{"invisible-network-protection":10}
};

export const noNetworkParticipationComponent:ComponentDefinition={
  id:"no-network-participation",name:"No Network Participation",toolboxArea:"invisible-network-protection",
  icon:"./assets/components/network-connection.png",
  allowedAreaIds:["invisible-network-protection"],outputByArea:{"invisible-network-protection":""},scoreByArea:{"invisible-network-protection":10}
};

export const policyEngineComponent:ComponentDefinition={
  id:"policy-engine",name:"Policy Engine",toolboxArea:"policy-access-control",
  icon:"./assets/components/policy-engine.png",
  allowedAreaIds:["policy-access-control"],outputByArea:{"policy-access-control":""},scoreByArea:{"policy-access-control":10}
};

export const leastPrivilegeAccessComponent:ComponentDefinition={
  id:"least-privilege-access",name:"Least-Privilege Access",toolboxArea:"policy-access-control",
  icon:"./assets/components/controlled-access.png",
  allowedAreaIds:["policy-access-control"],outputByArea:{"policy-access-control":""},scoreByArea:{"policy-access-control":10}
};

export const applicationAllowListComponent:ComponentDefinition={
  id:"application-allow-list",name:"Application Allow List",toolboxArea:"policy-access-control",
  icon:"./assets/components/application-connection.png",
  allowedAreaIds:["policy-access-control"],outputByArea:{"policy-access-control":""},scoreByArea:{"policy-access-control":9}
};

export const pamLikeControlComponent:ComponentDefinition={
  id:"pam-like-control",name:"PAM-Like Control",toolboxArea:"policy-access-control",
  icon:"./assets/components/identity-provider.png",
  allowedAreaIds:["policy-access-control"],outputByArea:{"policy-access-control":""},scoreByArea:{"policy-access-control":8}
};

export const internalWebApplicationComponent:ComponentDefinition={
  id:"internal-web-application",name:"Internal Web Application",toolboxArea:"protected-application",
  icon:"./assets/components/application-connection.png",
  allowedAreaIds:["protected-application"],outputByArea:{"protected-application":""},scoreByArea:{"protected-application":0}
};

export const administrativeApplicationComponent:ComponentDefinition={
  id:"administrative-application",name:"Administrative Application",toolboxArea:"protected-application",
  icon:"./assets/components/identity-provider.png",
  allowedAreaIds:["protected-application"],outputByArea:{"protected-application":""},scoreByArea:{"protected-application":0}
};

export const partnerApplicationComponent:ComponentDefinition={
  id:"partner-application",name:"Partner Application",toolboxArea:"protected-application",
  icon:"./assets/components/external-api.png",
  allowedAreaIds:["protected-application"],outputByArea:{"protected-application":""},scoreByArea:{"protected-application":0}
};

export const virtualMachineComponent:ComponentDefinition={
  id:"virtual-machine",name:"Virtual Machine",toolboxArea:"protected-application",
  icon:"./assets/components/private-corporate-network.png",
  allowedAreaIds:["protected-application"],outputByArea:{"protected-application":""},scoreByArea:{"protected-application":0}
};

export const componentList:ComponentDefinition[]=[
  passwordComponent,biometricAuthenticationComponent,hardwareSecurityTokenComponent,zeroFootprintClientComponent,
  privateCaComponent,x509CertificateComponent,certificateRevocationCheckComponent,otpComponent,
  mutualTlsComponent,ramTunnelingComponent,aes256EncryptionComponent,perfectForwardSecrecyComponent,
  externalAuthenticationServiceComponent,externalCloudStorageComponent,externalMonitoringServiceComponent,externalPaymentServiceComponent,
  portCloakingComponent,hiddenIpPathComponent,noVirtualNetworkInterfaceComponent,noNetworkParticipationComponent,
  policyEngineComponent,leastPrivilegeAccessComponent,applicationAllowListComponent,pamLikeControlComponent,
  internalWebApplicationComponent,administrativeApplicationComponent,partnerApplicationComponent,virtualMachineComponent
];

const componentIndex=new Map(componentList.map(component=>[component.id,component]));

export function getComponentById(id:string):ComponentDefinition|undefined{
  return componentIndex.get(id);
}
