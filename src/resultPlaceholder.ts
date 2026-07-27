import{getArchitectureState}from"./architectureState.js";
import{t}from"./i18n.js";
import type{ArchitectureAnalysisResult,ComponentId,SlotId}from"./types.js";

type ScenarioPlacement=Record<
  "client-component"|
  "authentication-component"|
  "internet-component"|
  "third-party-component"|
  "transition-component"|
  "target-network-type",
  ComponentId
>;

const placement=(
  client:ComponentId,
  authentication:ComponentId,
  internet:ComponentId,
  thirdParty:ComponentId,
  transition:ComponentId,
  target:ComponentId
):ScenarioPlacement=>({
  "client-component":client,
  "authentication-component":authentication,
  "internet-component":internet,
  "third-party-component":thirdParty,
  "transition-component":transition,
  "target-network-type":target
});

export const scenarios:ScenarioPlacement[]=[
  placement("password","authentication","network-connection","external-api","dns","public-network"),
  placement("password","authentication","network-connection","cloud-service","firewall","local-network"),
  placement("password","authentication","application-connection","external-api","firewall","public-network"),
  placement("password","authentication","connection-encryption","cloud-service","firewall","private-corporate-network"),
  placement("mfa","authentication","connection-encryption","identity-provider","firewall","private-corporate-network"),
  placement("biometric","authentication","connection-encryption","vpn-provider","firewall","private-virtual-network"),
  placement("pki-certificate","authentication","connection-encryption","identity-provider","certificate-authority","private-corporate-network"),
  placement("mfa","authentication","application-connection","cloud-service","firewall","private-corporate-network"),
  placement("mfa","authentication","controlled-access","identity-provider","policy-engine","private-corporate-network"),
  placement("pki-certificate","authentication","controlled-access","identity-provider","policy-engine","private-virtual-network"),
  placement("biometric","authentication","controlled-access","identity-provider","policy-engine","private-virtual-network"),
  placement("mfa","authentication","connection-encryption","vpn-provider","relay-node","private-virtual-network"),
  placement("pki-certificate","authentication","ram-encryption","cloud-service","relay-node","private-virtual-network"),
  placement("pki-certificate","authentication","controlled-access","identity-provider","policy-engine","private-corporate-network"),
  placement("mfa","authentication","controlled-access","identity-provider","policy-engine","public-network"),
  placement("password","authentication","connection-encryption","cloud-service","certificate-authority","private-corporate-network"),
  placement("password","authentication","network-connection","identity-provider","policy-engine","private-corporate-network"),
  placement("password","authentication","network-connection","vpn-provider","firewall","private-virtual-network")
];

const slotOrder:SlotId[]=[
  "client-component",
  "authentication-component",
  "internet-component",
  "third-party-component",
  "transition-component",
  "target-network-type"
];

const componentWeights:Partial<Record<ComponentId,number>>={
  "password":5,
  "mfa":14,
  "biometric":16,
  "pki-certificate":20,
  "authentication":8,
  "network-connection":2,
  "application-connection":8,
  "connection-encryption":15,
  "controlled-access":22,
  "ram-encryption":25,
  "external-api":2,
  "cloud-service":7,
  "vpn-provider":10,
  "identity-provider":15,
  "dns":2,
  "firewall":7,
  "certificate-authority":10,
  "relay-node":12,
  "policy-engine":15,
  "public-network":1,
  "local-network":4,
  "private-corporate-network":7,
  "private-virtual-network":10
};

export function getSecurityLevel(score:number):string{
  if(score<=29)return"Very Low Security";
  if(score<=49)return"Low Security";
  if(score<=64)return"Medium Security";
  if(score<=79)return"Good Security";
  if(score<=89)return"High Security";
  return"Advanced Security";
}

export function calculateSecurityScore(
  current:Record<SlotId,ComponentId|null>
):number{
  const selected=slotOrder
    .map(id=>current[id])
    .filter((id):id is ComponentId=>Boolean(id));

  let score=selected.reduce(
    (total,id)=>total+(componentWeights[id]??0),
    0
  );

  const client=current["client-component"];
  const internet=current["internet-component"];
  const third=current["third-party-component"];
  const transition=current["transition-component"];

  if(
    internet==="controlled-access"&&
    third==="identity-provider"&&
    transition==="policy-engine"
  )score+=6;

  if(
    internet==="ram-encryption"&&
    transition==="relay-node"
  )score+=16;

  if(
    internet==="connection-encryption"&&
    third==="vpn-provider"&&
    transition==="firewall"
  )score+=4;

  if(
    client==="pki-certificate"&&
    transition==="certificate-authority"
  )score+=4;

  if(
    transition==="policy-engine"&&
    internet!=="controlled-access"
  )score-=7;

  if(
    third==="vpn-provider"&&
    internet!=="connection-encryption"
  )score-=5;

  if(
    (client==="pki-certificate")!==
    (transition==="certificate-authority")
  )score-=5;

  return Math.max(0,Math.min(100,Math.round(score)));
}

export function analyzeArchitecture():ArchitectureAnalysisResult{
  const current=getArchitectureState().slots;
  const incomplete=slotOrder.some(id=>!current[id]);

  if(incomplete){
    return{
      score:null,
      scoreLabel:"Not Available",
      securityLevel:"Not Available",
      status:"incomplete"
    };
  }

  const score=calculateSecurityScore(current);
  const matched=scenarios.some(scenario=>
    slotOrder.every(id=>
      current[id]===scenario[id as keyof ScenarioPlacement]
    )
  );

  return{
    score,
    scoreLabel:`${score}/100`,
    securityLevel:getSecurityLevel(score),
    status:matched?"matched":"unknown"
  };
}

export function renderArchitectureResult(
  result:ArchitectureAnalysisResult|null
):void{
  const panel=document.getElementById("result-panel");
  const summary=panel?.querySelector<HTMLElement>(".result-summary");
  const circle=panel?.querySelector<HTMLElement>(".score-circle");
  const score=document.getElementById("result-score");
  const level=document.getElementById("result-security-level");

  if(!panel||!summary||!circle||!score||!level)return;

  circle.style.setProperty("--score-progress",String(result?.score??0));
  summary.hidden=!result;

  if(!result)return;

  score.textContent=result.score===null?"--":`${result.score}%`;
  level.textContent=result.score===null
    ?t(result.scoreLabel)
    :t(result.securityLevel);
}
