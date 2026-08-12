$ErrorActionPreference = "Stop"

$icons = @(
  @{ Id="client-device"; Mark="PC"; Group="device" }, @{ Id="secure-device"; Mark="OK"; Group="device" },
  @{ Id="saytrust-hardware-security-token"; Mark="ID"; Group="saytrust" }, @{ Id="biometric-verification"; Mark="BIO"; Group="device" }, @{ Id="client-pin"; Mark="PIN"; Group="device" },
  @{ Id="private-ca"; Mark="CA"; Group="identity" }, @{ Id="user-certificate"; Mark="UC"; Group="identity" }, @{ Id="x509-certificate"; Mark="X.509"; Group="identity" },
  @{ Id="certificate-validation"; Mark="OK"; Group="identity" }, @{ Id="certificate-revocation-check"; Mark="CRL"; Group="identity" }, @{ Id="otp"; Mark="OTP"; Group="identity" },
  @{ Id="saytrust-server"; Mark="ST"; Group="saytrust" }, @{ Id="policy-engine"; Mark="PE"; Group="access" }, @{ Id="client-privilege-management"; Mark="CPM"; Group="access" },
  @{ Id="least-privilege-control"; Mark="LP"; Group="access" }, @{ Id="application-authorization"; Mark="APP"; Group="access" }, @{ Id="session-revocation"; Mark="OFF"; Group="access" },
  @{ Id="gateway"; Mark="GW"; Group="connection" }, @{ Id="network-connection"; Mark="NET"; Group="connection" }, @{ Id="application-connection"; Mark="APP"; Group="connection" },
  @{ Id="ram-application-tunnel"; Mark="RAM"; Group="saytrust" }, @{ Id="encrypted-ram"; Mark="RAM"; Group="connection" }, @{ Id="mutual-tls"; Mark="mTLS"; Group="connection" },
  @{ Id="aes-256-encryption"; Mark="AES"; Group="connection" }, @{ Id="perfect-forward-secrecy"; Mark="PFS"; Group="connection" }, @{ Id="virtual-network-interface"; Mark="VNI"; Group="connection" },
  @{ Id="corporate-network"; Mark="HQ"; Group="resource" }, @{ Id="restricted-subnet"; Mark="SUB"; Group="resource" }, @{ Id="internal-web-application"; Mark="WEB"; Group="resource" }, @{ Id="virtual-machine"; Mark="VM"; Group="resource" },
  @{ Id="external-identity-provider"; Mark="IDP"; Group="external" }, @{ Id="external-authentication-service"; Mark="AUTH"; Group="external" }, @{ Id="external-cloud-service"; Mark="CLD"; Group="external" }, @{ Id="external-monitoring-service"; Mark="MON"; Group="external" }
)

$accents = @{ device="#ef3340"; identity="#ff5a63"; access="#d80715"; connection="#ff2533"; resource="#bd0712"; external="#a5acb8"; saytrust="#ff0015" }
$outputDirectory = Join-Path $PSScriptRoot "..\assets\components-v2"
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

foreach ($icon in $icons) {
  $accent = $accents[$icon.Group]
  $badge = if ($icon.Group -eq "saytrust") { '<path d="M69 13h12v12H69z" fill="#ff0015"/><path d="m72 19 3 3 5-7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' } else { '' }
  $fontSize = if ($icon.Mark.Length -ge 4) { 15 } elseif ($icon.Mark.Length -eq 3) { 18 } else { 23 }
  $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="$($icon.Id)">
  <defs>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#f5f6f8"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1"><stop stop-color="$accent"/><stop offset="1" stop-color="#a60009"/></linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#18202b" flood-opacity=".18"/></filter>
  </defs>
  <rect x="5" y="5" width="86" height="86" rx="22" fill="url(#panel)" stroke="#d8dce2" stroke-width="2"/>
  <path d="M20 22h56M20 74h56" stroke="$accent" stroke-width="3" stroke-linecap="round" opacity=".65"/>
  <path d="M48 20 71 31v17c0 15-9 25-23 31-14-6-23-16-23-31V31z" fill="url(#accent)" filter="url(#shadow)"/>
  <path d="M48 27 64 35v13c0 10-6 18-16 23-10-5-16-13-16-23V35z" fill="#fff"/>
  <text x="48" y="54" text-anchor="middle" dominant-baseline="middle" fill="#171c25" font-family="Segoe UI,Arial,sans-serif" font-size="$fontSize" font-weight="800">$($icon.Mark)</text>
  $badge
</svg>
"@
  Set-Content -LiteralPath (Join-Path $outputDirectory "$($icon.Id).svg") -Value $svg -Encoding utf8
}
