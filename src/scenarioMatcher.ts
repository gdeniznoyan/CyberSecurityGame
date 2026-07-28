import{getSlotStates}from"./state.js";
import{getSlotById}from"./slots.js";
import{t}from"./i18n.js";
import type{
  ArchitectureAnalysisResult,
  ComponentId,
  SectionId
}from"./types.js";

type ScenarioDefinition={
  name:string;
  securityLevel:string;
  score:number;
  description:string;
  components:Record<SectionId,ComponentId[]>;
};

export const predefinedArchitectures:ScenarioDefinition[]=[
  {
    name:"Unprotected System",
    securityLevel:"Very Low",
    score:20,
    description:"Basic password authentication with no network protection or encryption.",
    components:{
      "client-computer":["password"],
      "authentication":["authentication-service"],
      "wild-internet":["network-connection"],
      "third-party":[],
      "gateway":[],
      "target-network":["public-network"]
    }
  },
  {
    name:"VPN-Based System",
    securityLevel:"Medium",
    score:60,
    description:"Uses a VPN tunnel and firewall to provide secure remote access to the corporate network.",
    components:{
      "client-computer":["password","mfa"],
      "authentication":["authentication-service"],
      "wild-internet":[
        "network-connection",
        "vpn-tunnel",
        "connection-encryption"
      ],
      "third-party":["vpn-provider"],
      "gateway":["firewall"],
      "target-network":["private-corporate-network"]
    }
  },
  {
    name:"Zero Trust Architecture",
    securityLevel:"High",
    score:85,
    description:"Every access request is verified using identity, endpoint protection and security policies.",
    components:{
      "client-computer":[
        "password",
        "mfa",
        "endpoint-protection"
      ],
      "authentication":[
        "authentication-service",
        "identity-provider"
      ],
      "wild-internet":[
        "application-connection",
        "connection-encryption"
      ],
      "third-party":["cloud-service"],
      "gateway":["firewall","policy-engine"],
      "target-network":["cloud-resource"]
    }
  },
  {
    name:"Post-Zero Trust Architecture",
    securityLevel:"Advanced",
    score:100,
    description:"Combines strong authentication, policy-based access and advanced security controls for maximum protection.",
    components:{
      "client-computer":[
        "password",
        "mfa",
        "biometric-authentication",
        "pki-certificate",
        "endpoint-protection"
      ],
      "authentication":[
        "authentication-service",
        "identity-provider"
      ],
      "wild-internet":[
        "application-connection",
        "connection-encryption"
      ],
      "third-party":["cloud-service","external-api"],
      "gateway":["firewall","policy-engine","relay-node"],
      "target-network":["cloud-resource"]
    }
  }
];

function selectedBySection():Record<SectionId,ComponentId[]>{
  const selected:Record<SectionId,ComponentId[]>={
    "client-computer":[],
    "authentication":[],
    "wild-internet":[],
    "third-party":[],
    "gateway":[],
    "target-network":[]
  };

  for(const state of getSlotStates()){
    if(!state.componentId)continue;
    const section=getSlotById(state.slotId)?.section;
    if(section)selected[section].push(state.componentId);
  }

  return selected;
}

function sameComponents(
  actual:ComponentId[],
  expected:ComponentId[]
):boolean{
  return actual.length===expected.length&&
    expected.every(component=>actual.includes(component));
}

export function analyzeArchitecture():ArchitectureAnalysisResult{
  const current=selectedBySection();
  const match=predefinedArchitectures.find(scenario=>
    (Object.keys(scenario.components)as SectionId[])
      .every(section=>
        sameComponents(
          current[section],
          scenario.components[section]
        )
      )
  );

  return match
    ?{
      scenarioName:match.name,
      securityLevel:match.securityLevel,
      score:match.score,
      description:match.description,
      status:"matched"
    }
    :{
      scenarioName:"Custom Architecture",
      securityLevel:"Not Available",
      score:null,
      description:"This component combination is not a predefined architecture.",
      status:"custom"
    };
}

export function renderArchitectureResult(
  result:ArchitectureAnalysisResult|null
):void{
  const name=document.getElementById("result-scenario");
  const level=document.getElementById("result-level");
  const score=document.getElementById("result-score");
  const description=document.getElementById("result-description");
  const hint=document.getElementById("result-hint");
  if(!name||!level||!score||!description||!hint)return;

  name.textContent=result?t(result.scenarioName):"—";
  name.classList.toggle("custom",result?.status==="custom");
  level.textContent=result?t(result.securityLevel):"—";
  score.textContent=result?.score===null||!result
    ?"—"
    :`${result.score}/100`;
  description.textContent=result?t(result.description):"—";
  hint.textContent=result
    ?t(result.status==="matched"?"Exact predefined architecture match.":"Custom Architecture")
    :t("Analyze the architecture to identify it.");
}
