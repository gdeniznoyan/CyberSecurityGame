import{getSlotStates}from"./state.js";
import{getSlotById}from"./slots.js";
import{t}from"./i18n.js";
import type{ComponentId,SectionId}from"./types.js";

const targetDescriptions:Partial<Record<ComponentId,string>>={
  "private-corporate-network":
    "The target is a private corporate network containing internal company resources. Access should be limited to authorized users and trusted devices.",
  "local-network":
    "The target is a local network where devices communicate within the same organization. It should be protected against unauthorized internal access and lateral movement.",
  "cloud-resource":
    "The target is a cloud-hosted resource protected by strong identity verification, dynamic access policies and encrypted connections. This target is the most suitable for a Post-Zero Trust architecture.",
  "public-network":
    "The target is a publicly accessible network or service. Because it is exposed to the Internet, it requires strong protection against unauthorized access and data breaches."
};

const thirdPartyDescriptions:Partial<Record<ComponentId,string>>={
  "external-authentication-service":
    "User authentication is handled by an external identity provider. This simplifies account management, but the system becomes dependent on the third party’s security and availability.",
  "external-cloud-storage":
    "System data is stored by an external cloud provider. This provides flexible storage, but sensitive data may be exposed if the provider is compromised or incorrectly configured.",
  "external-payment-service":
    "Payment operations are processed by an external service. This reduces the need to manage payment infrastructure internally, but financial transactions depend on the third party’s security controls.",
  "external-monitoring-service":
    "System logs and security events are sent to an external monitoring provider. This can improve visibility, but sensitive operational information is shared outside the organization."
};

const transitionDescriptions:Record<string,string>={
  firewall:
    "The Policy Engine evaluates access requests and the Relay Node protects the target from direct exposure. However, without a Firewall, malicious or unauthorized network traffic may reach the security layer more easily.",
  "policy-engine":
    "The Firewall filters network traffic and the Relay Node hides the target resource. However, without a Policy Engine, access decisions cannot be made dynamically based on user identity, device status or security conditions.",
  "relay-node":
    "The Firewall filters traffic and the Policy Engine controls access decisions. However, without a Relay Node, the target resource may be more directly exposed to incoming connections.",
  "firewall|policy-engine":
    "The Relay Node prevents direct access to the target resource. However, there is no traffic filtering or dynamic access control, which creates a major security weakness.",
  "firewall|relay-node":
    "The Policy Engine evaluates access requests. However, there is no network traffic filtering and the target resource may be directly exposed.",
  "policy-engine|relay-node":
    "The Firewall filters unauthorized traffic. However, access decisions are not identity-based and the target resource is not isolated from direct connections.",
  "firewall|policy-engine|relay-node":
    "There is no Firewall, Policy Engine or Relay Node protecting the target network. The system lacks traffic filtering, dynamic access control and target isolation.",
  none:
    "The Firewall filters malicious traffic, the Policy Engine makes dynamic access decisions and the Relay Node isolates the target resource from direct connections. Together, these components provide the strongest Security Transition configuration for a Post-Zero Trust architecture."
};

function selectedIn(section:SectionId):ComponentId[]{
  return getSlotStates()
    .filter(state=>getSlotById(state.slotId)?.section===section)
    .map(state=>state.componentId)
    .filter((id):id is ComponentId=>Boolean(id));
}

function insightItem(description:string):HTMLElement{
  const item=document.createElement("li");
  item.className="insight-item";
  item.textContent=t(description);
  return item;
}

export function renderArchitectureInsights():void{
  const container=document.getElementById("result-insights");
  if(!container)return;
  container.replaceChildren();

  const target=selectedIn("target-network")[0];
  if(target&&targetDescriptions[target]){
    container.append(
      insightItem(targetDescriptions[target])
    );
  }

  const selectedTransition=new Set(selectedIn("gateway"));
  const transitionOrder:ComponentId[]=[
    "firewall",
    "policy-engine",
    "relay-node"
  ];
  const missing=transitionOrder.filter(
    component=>!selectedTransition.has(component)
  );
  const transitionKey=missing.length?missing.join("|"):"none";
  const transition=transitionDescriptions[transitionKey];
  container.append(
    insightItem(transition)
  );

  const thirdParty=selectedIn("third-party");
  if(!thirdParty.length){
    container.append(
      insightItem(
        "The architecture does not depend on any external service for authentication, storage, payments or monitoring. This is the most suitable configuration for the project’s Post-Zero Trust model because no third party is automatically trusted or given access to system data."
      )
    );
  }else{
    thirdParty.forEach(component=>{
      const description=thirdPartyDescriptions[component];
      if(description){
        container.append(
          insightItem(description)
        );
      }
    });
  }
}
