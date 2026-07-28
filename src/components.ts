import type{ComponentCategory,ComponentId,SecurityComponent,SlotType}from"./types.js";
const c=(id:ComponentId,label:string,category:ComponentCategory,description:string,allowedSlotTypes:SlotType[]):SecurityComponent=>({id,label,category,description,allowedSlotTypes,reusable:false,futureImageUrl:`./assets/components/${id}.png`,futureMetadata:{}});
export const securityComponents:SecurityComponent[]=[
c("password","Password","client-components","Password-based client credential.",["client-component"]),
c("mfa","MFA","client-components","Multi-factor client authentication.",["client-component"]),
c("biometric-authentication","Biometric Authentication","client-components","Biometric client authentication.",["client-component"]),
c("pki-certificate","PKI Certificate","client-components","Certificate-based client credential.",["client-component"]),
c("endpoint-protection","Endpoint Protection","client-components","Security protection for the client endpoint.",["client-component"]),
c("authentication-service","Authentication Service","authentication-services","Primary authentication service.",["authentication-component"]),
c("identity-provider","Identity Provider","authentication-services","Centralized identity service.",["authentication-component"]),
c("network-connection","Network Connection","connection-security","Network-level connection.",["internet-component"]),
c("application-connection","Application Connection","connection-security","Application-level connection.",["internet-component"]),
c("connection-encryption","Connection Encryption","connection-security","Encryption layered over a network or application connection.",["internet-component"]),
c("vpn-tunnel","VPN Tunnel","connection-security","Encrypted VPN communication tunnel.",["internet-component"]),
c("cloud-service","Cloud Service","third-party","External cloud service.",["third-party-component"]),
c("external-api","External API","third-party","External application programming interface.",["third-party-component"]),
c("vpn-provider","VPN Provider","third-party","External VPN service provider.",["third-party-component"]),
c("firewall","Firewall","network-components","Network traffic filtering.",["transition-component"]),
c("policy-engine","Policy Engine","network-components","Policy evaluation.",["transition-component"]),
c("relay-node","Relay Node","network-components","Connection relay.",["transition-component"]),
c("private-corporate-network","Private Corporate Network","network-types","Private corporate target.",["network-type"]),
c("local-network","Local Network","network-types","Local network target.",["network-type"]),
c("cloud-resource","Cloud Resource","network-types","Cloud-hosted target resource.",["network-type"]),
c("public-network","Public Network","network-types","Public network target.",["network-type"])];
export function getComponentById(id:string):SecurityComponent|undefined{return securityComponents.find(x=>x.id===id)}export function updateComponentImageUrl(id:ComponentId,url:string):void{const x=getComponentById(id);if(x)x.futureImageUrl=url}
