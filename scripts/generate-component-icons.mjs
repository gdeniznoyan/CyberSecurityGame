import { writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDirectory = join(process.cwd(), "assets", "components-v2");

const symbols = {
  "client-device": `<rect x="22" y="23" width="52" height="34" rx="5"/><path d="M16 68h64l-6 7H22z"/><circle class="red fill-red" cx="48" cy="40" r="6"/><path d="M38 53c2-7 18-7 20 0"/>`,
  "secure-device": `<rect x="18" y="22" width="55" height="39" rx="5"/><path d="M13 70h64"/><path class="fill-dark" d="M60 42l18 8v13c0 11-7 18-18 24-11-6-18-13-18-24V50z"/><path class="white" d="m52 63 5 5 11-14"/>`,
  "saytrust-hardware-security-token": `<rect x="31" y="17" width="34" height="62" rx="10"/><circle class="red fill-red" cx="48" cy="35" r="8"/><path d="M41 54h14M41 63h14"/><path d="M43 17V9h10v8"/>`,
  "biometric-verification": `<path d="M31 68c-8-15-5-38 17-38 19 0 23 18 17 33"/><path class="red" d="M39 65c-6-12-3-25 9-25s15 12 10 24M47 72c-5-8-5-21 2-23 8-1 9 11 4 19"/><path d="M27 22h-9v10M69 22h9v10M27 78h-9V68M69 78h9V68"/>`,
  "client-pin": `<rect x="27" y="15" width="42" height="67" rx="8"/><path d="M40 24h16"/><circle class="red fill-red" cx="39" cy="45" r="3"/><circle cx="49" cy="45" r="3"/><circle cx="59" cy="45" r="3"/><circle cx="39" cy="56" r="3"/><circle cx="49" cy="56" r="3"/><circle cx="59" cy="56" r="3"/><path class="red" d="M42 70h12"/>`,
  "private-ca": `<path class="fill-dark" d="M48 13l27 11v20c0 19-11 31-27 39-16-8-27-20-27-39V24z"/><path class="white" d="m35 49 8 8 17-21"/><circle class="red fill-red" cx="70" cy="67" r="12"/><path class="white" d="M65 67h10M70 62v10"/>`,
  "user-certificate": `<rect x="17" y="19" width="62" height="52" rx="6"/><circle cx="36" cy="39" r="8"/><path d="M25 58c2-10 20-10 22 0M53 32h16M53 42h16"/><circle class="red fill-red" cx="64" cy="67" r="12"/><path class="white" d="m58 67 4 4 8-9"/>`,
  "x509-certificate": `<path d="M20 17h50l9 9v46H20z"/><path d="M70 17v12h9M31 36h35M31 47h28"/><circle class="red fill-red" cx="56" cy="65" r="12"/><path class="white" d="M50 65h12M56 59v12"/>`,
  "certificate-validation": `<rect x="18" y="18" width="48" height="61" rx="5"/><path d="M29 34h27M29 45h22"/><path class="fill-dark" d="M66 47l16 7v12c0 10-6 17-16 22-10-5-16-12-16-22V54z"/><path class="white" d="m58 66 5 5 10-13"/>`,
  "certificate-revocation-check": `<rect x="17" y="18" width="50" height="61" rx="5"/><path d="M29 34h26M29 45h20"/><circle class="red fill-red" cx="67" cy="66" r="16"/><path class="white" d="M59 58l16 16M75 58 59 74"/>`,
  "otp": `<rect x="27" y="14" width="42" height="68" rx="8"/><path d="M40 24h16"/><circle class="red fill-red" cx="35" cy="48" r="4"/><circle class="red fill-red" cx="48" cy="48" r="4"/><circle class="red fill-red" cx="61" cy="48" r="4"/><path d="M36 65h24"/>`,
  "saytrust-server": `<rect x="17" y="18" width="62" height="20" rx="5"/><rect x="17" y="42" width="62" height="20" rx="5"/><rect x="17" y="66" width="62" height="15" rx="5"/><circle class="red fill-red" cx="27" cy="28" r="3"/><circle class="red fill-red" cx="27" cy="52" r="3"/><path class="red" d="M60 28h10M60 52h10"/><path class="fill-dark" d="M48 36l15 7v11c0 10-6 17-15 22-9-5-15-12-15-22V43z"/><path class="white" d="m41 54 5 5 9-11"/>`,
  "policy-engine": `<circle cx="48" cy="48" r="25"/><path d="M48 13v12M48 71v12M13 48h12M71 48h12M23 23l9 9M64 64l9 9M73 23l-9 9M32 64l-9 9"/><path class="red" d="m36 49 8 8 17-20"/>`,
  "client-privilege-management": `<circle cx="35" cy="35" r="11"/><path d="M19 64c2-15 30-15 32 0"/><path class="fill-dark" d="M66 36l16 7v12c0 11-6 18-16 23-10-5-16-12-16-23V43z"/><path class="white" d="M59 56h14M66 49v14"/>`,
  "least-privilege-control": `<path d="M16 51h49"/><circle class="red fill-red" cx="34" cy="51" r="8"/><path d="M66 29h14v44H66zM22 29h14"/><path class="fill-dark" d="M63 17l19 8v12c0 12-7 20-19 26-12-6-19-14-19-26V25z"/><path class="white" d="m55 38 5 5 10-12"/>`,
  "application-authorization": `<rect x="15" y="20" width="66" height="54" rx="7"/><path d="M15 34h66M27 27h1M37 27h1"/><path d="M29 48h17M29 59h12"/><circle class="red fill-red" cx="66" cy="59" r="14"/><path class="white" d="m59 59 5 5 9-11"/>`,
  "session-revocation": `<path d="M25 26a31 31 0 1 1-5 35"/><path class="red" d="M17 26h19v19"/><path class="red" d="m17 26 18 18"/><path d="M48 32v18l12 8"/><circle class="red fill-red" cx="48" cy="50" r="4"/>`,
  "gateway": `<path d="M17 66V34h62v32M10 73h76"/><path class="red" d="M25 54h46"/><path d="m34 45-9 9 9 9M62 45l9 9-9 9"/><path class="fill-dark" d="M48 12l17 7v13c0 10-6 17-17 23-11-6-17-13-17-23V19z"/><path class="white" d="m41 32 5 5 9-11"/>`,
  "network-connection": `<circle cx="48" cy="48" r="30"/><path d="M18 48h60M48 18c-10 10-13 20-13 30s3 20 13 30M48 18c10 10 13 20 13 30s-3 20-13 30M24 32h48M24 64h48"/><circle class="red fill-red" cx="70" cy="67" r="7"/>`,
  "application-connection": `<rect x="13" y="23" width="70" height="50" rx="7"/><path d="M13 37h70M25 30h1M35 30h1"/><path class="red" d="M31 56h22M47 48l9 8-9 8"/><circle class="fill-dark" cx="68" cy="56" r="8"/>`,
  "ram-application-tunnel": `<path d="M15 61V43c0-18 14-30 33-30s33 12 33 30v18"/><path d="M24 61V44c0-12 9-21 24-21s24 9 24 21v17"/><rect x="12" y="58" width="72" height="18" rx="6"/><path class="red" d="M28 67h40M57 59l10 8-10 8"/>`,
  "encrypted-ram": `<rect x="22" y="25" width="52" height="47" rx="6"/><path d="M30 17v8M42 17v8M54 17v8M66 17v8M30 72v8M42 72v8M54 72v8M66 72v8M14 34h8M14 46h8M14 58h8M74 34h8M74 46h8M74 58h8"/><rect class="fill-red red" x="37" y="43" width="22" height="18" rx="3"/><path class="white" d="M41 43v-4a7 7 0 0114 0v4"/>`,
  "mutual-tls": `<path class="fill-dark" d="M29 22l16 7v12c0 11-6 18-16 23-10-5-16-12-16-23V29z"/><path class="fill-red red" d="M67 32l16 7v12c0 11-6 18-16 23-10-5-16-12-16-23V39z"/><path class="white" d="m60 51 5 5 10-12"/><path class="red" d="M38 68h23M54 62l7 6-7 6"/>`,
  "aes-256-encryption": `<path d="M18 40h60v39H18z"/><path d="M29 40V29c0-12 8-19 19-19s19 7 19 19v11"/><circle class="red fill-red" cx="48" cy="57" r="6"/><path class="red" d="M48 63v8"/><path d="M28 20h6M62 20h6"/>`,
  "perfect-forward-secrecy": `<path d="M20 48a28 28 0 0 1 48-19"/><path class="red" d="M66 16v16H50"/><path d="M76 48a28 28 0 0 1-48 19"/><path class="red" d="M30 80V64h16"/><path class="fill-dark" d="M48 33l14 6v10c0 9-5 15-14 20-9-5-14-11-14-20V39z"/>`,
  "virtual-network-interface": `<rect x="17" y="21" width="62" height="48" rx="6"/><path d="M31 79v-10M65 79v-10M24 79h48"/><circle class="red fill-red" cx="32" cy="45" r="6"/><circle cx="64" cy="45" r="6"/><path class="red" d="M38 45h20M50 38l8 7-8 7"/>`,
  "corporate-network": `<path d="M14 77h68M22 77V37h22v40M52 77V20h25v57"/><path d="M28 46h5M28 56h5M28 66h5M59 31h5M68 31h3M59 42h5M68 42h3M59 53h5M68 53h3"/><path class="red" d="M58 20v-9l15 6-15 6"/>`,
  "restricted-subnet": `<circle cx="27" cy="33" r="8"/><circle cx="69" cy="33" r="8"/><circle cx="48" cy="69" r="8"/><path d="M34 38l10 22M62 38 52 60M35 33h26"/><path class="red" d="M18 51h60"/><path class="fill-red red" d="M43 46h10v10H43z"/>`,
  "internal-web-application": `<rect x="14" y="20" width="68" height="55" rx="7"/><path d="M14 35h68M25 28h1M35 28h1"/><path d="M27 49h28M27 60h19"/><path class="fill-dark" d="M67 47l14 6v10c0 9-5 15-14 20-9-5-14-11-14-20V53z"/><path class="white" d="m61 63 4 4 8-10"/>`,
  "virtual-machine": `<path d="m48 12 31 18v36L48 84 17 66V30z"/><path d="m17 30 31 18 31-18M48 48v36"/><path class="red" d="M32 31 48 22l16 9-16 9z"/><rect class="fill-dark" x="32" y="53" width="18" height="14" rx="2"/>`,
  "external-identity-provider": `<circle cx="34" cy="35" r="11"/><path d="M17 66c2-18 32-18 34 0"/><path class="red" d="M57 35h22M68 24v22"/><path class="fill-dark" d="M67 48l16 7v11c0 10-6 17-16 22-10-5-16-12-16-22V55z"/>`,
  "external-authentication-service": `<path d="M13 48h23M60 48h23"/><circle cx="48" cy="48" r="20"/><path class="fill-red red" d="M48 30l13 6v10c0 9-5 15-13 19-8-4-13-10-13-19V36z"/><path class="white" d="m42 47 4 4 8-10"/><circle cx="13" cy="48" r="5"/><circle cx="83" cy="48" r="5"/>`,
  "external-cloud-service": `<path d="M27 68h43c12 0 17-8 14-17-2-7-8-10-15-9-2-13-12-21-24-18-10 2-16 10-16 20-10 0-16 5-16 13 0 7 5 11 14 11Z"/><path class="red" d="M48 45v27M38 62l10 10 10-10"/>`,
  "external-monitoring-service": `<rect x="14" y="20" width="68" height="54" rx="7"/><path class="red" d="M23 53h11l6-14 10 26 8-18 6 6h9"/><circle cx="72" cy="31" r="3"/><path d="M27 81h42M39 74v7M57 74v7"/>`,
};

const shell = (symbol) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
  <defs><filter id="shadow" x="-25%" y="-25%" width="150%" height="165%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#111720" flood-opacity=".2"/></filter></defs>
  <path d="M48 4 85 25v46L48 92 11 71V25L48 4Z" fill="#fff" stroke="#D2D7DE" stroke-width="2"/>
  <path d="M48 10 79 28v40L48 86 17 68V28L48 10Z" fill="#F5F6F8"/>
  <g filter="url(#shadow)" stroke="#111720" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${symbol}</g>
  <style>.red{stroke:#DF0712}.fill-red{fill:#DF0712}.fill-dark{fill:#111720}.white{stroke:#fff}</style>
</svg>`;

for (const [id, symbol] of Object.entries(symbols)) {
  writeFileSync(join(outputDirectory, `${id}.svg`), shell(symbol), "utf8");
}

console.log(`Generated ${Object.keys(symbols).length} component icons.`);
