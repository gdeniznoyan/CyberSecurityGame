export type Language="en"|"tr";

const turkishTranslations:Record<string,string>={
  "Cybersecurity Architecture Builder":"Siber Güvenlik Mimari Oluşturucu",
  "Builder":"Oluşturucu",
  "Learn":"Öğren",
  "Build":"Oluştur",
  "Protect":"Koru",
  "About":"Hakkında",
  "How to Play":"Nasıl Oynanır",
  "1. Drag components from the toolbox.":"1. Bileşenleri araç kutusundan sürükleyin.",
  "2. Drop one into each architecture slot.":"2. Her mimari alanına bir bileşen bırakın.",
  "3. Combine compatible components.":"3. Uyumlu bileşenleri birleştirin.",
  "4. Export your architecture when ready.":"4. Hazır olduğunda mimarinizi dışa aktarın.",
  "Build secure architectures by placing the right security components in the correct locations.":"Doğru güvenlik bileşenlerini doğru konumlara yerleştirerek güvenli mimariler oluşturun.",
  "Show help":"Yardımı göster",
  "Help":"Yardım",
  "Reset":"Sıfırla",
  "Analyze Architecture":"Mimariyi Analiz Et",
  "Architecture Canvas":"Mimari Alanı",
  "Architecture Result":"Mimari Sonucu",
  "Result":"Sonuç",
  "Security Score":"Güvenlik Puanı",
  "Component Toolbox":"Bileşen Araç Kutusu",
  "Export Current State":"Mevcut Durumu Dışa Aktar",
  "Import State":"Durumu İçe Aktar",
  "Languages":"Diller",
  "Architecture data actions":"Mimari veri işlemleri",
  "Primary navigation":"Ana navigasyon",
  "Client Computer":"İstemci Bilgisayar",
  "Authentication":"Kimlik Doğrulama",
  "Wild Internet":"Açık İnternet",
  "3rd Party":"Üçüncü Taraf",
  "Security Transition":"Güvenlik Geçişi",
  "Target Network":"Hedef Ağ",
  "Between Wild Internet and Target Network":"Açık İnternet ile Hedef Ağ arasında",
  "Client Computer Image":"İstemci Bilgisayar Görseli",
  "Authentication Image":"Kimlik Doğrulama Görseli",
  "Wild Internet Image":"Açık İnternet Görseli",
  "Third Party Image":"Üçüncü Taraf Görseli",
  "Security Transition Image":"Güvenlik Geçişi Görseli",
  "Target Network Image":"Hedef Ağ Görseli",
  "Client Security":"İstemci Güvenliği",
  "Authentication Flow":"Kimlik Doğrulama Akışı",
  "Internet Connection":"İnternet Bağlantısı",
  "Third-Party Service":"Üçüncü Taraf Hizmeti",
  "Security Control":"Güvenlik Kontrolü",
  "Drop a client component":"Bir istemci bileşeni bırakın",
  "Drop an authentication component":"Bir kimlik doğrulama bileşeni bırakın",
  "Drop a connection component":"Bir bağlantı bileşeni bırakın",
  "Drop a third-party service":"Bir üçüncü taraf hizmeti bırakın",
  "Drop a security control":"Bir güvenlik kontrolü bırakın",
  "Drop one target network":"Bir hedef ağ bırakın",
  "Client Components":"İstemci Bileşenleri",
  "Authentication Components":"Kimlik Doğrulama Bileşenleri",
  "Connection Components":"Bağlantı Bileşenleri",
  "Third Party":"Üçüncü Taraf",
  "Network Components":"Ağ Bileşenleri",
  "Network Areas":"Ağ Alanları",
  "Password":"Parola",
  "MFA":"Çok Faktörlü Doğrulama",
  "Biometric Authentication":"Biyometrik Kimlik Doğrulama",
  "PKI Certificate":"PKI Sertifikası",
  "Endpoint Protection":"Uç Nokta Koruması",
  "Authentication Service":"Kimlik Doğrulama Hizmeti",
  "Network Connection":"Ağ Bağlantısı",
  "Application Connection":"Uygulama Bağlantısı",
  "Connection Encryption":"Bağlantı Şifreleme",
  "VPN Tunnel":"VPN Tüneli",
  "Identity Provider":"Kimlik Sağlayıcı",
  "External Authentication Service":"Harici Kimlik Doğrulama Hizmeti",
  "External Cloud Storage":"Harici Bulut Depolama",
  "External Payment Service":"Harici Ödeme Hizmeti",
  "External Monitoring Service":"Harici İzleme Hizmeti",
  "Firewall":"Güvenlik Duvarı",
  "Policy Engine":"Politika Motoru",
  "Relay Node":"Aktarım Düğümü",
  "Private Corporate Network":"Özel Kurumsal Ağ",
  "Local Network":"Yerel Ağ",
  "Cloud Resource":"Bulut Kaynağı",
  "Public Network":"Herkese Açık Ağ",
  "illustration":"görseli",
  "Password-based client credential.":"Parola tabanlı istemci kimlik bilgisi.",
  "Multi-factor client authentication.":"Çok faktörlü istemci kimlik doğrulaması.",
  "Biometric client authentication.":"Biyometrik istemci kimlik doğrulaması.",
  "Certificate-based client credential.":"Sertifika tabanlı istemci kimlik bilgisi.",
  "Security protection for the client endpoint.":"İstemci uç noktası için güvenlik koruması.",
  "Primary authentication service.":"Birincil kimlik doğrulama hizmeti.",
  "Centralized identity service.":"Merkezi kimlik hizmeti.",
  "Network-level connection.":"Ağ seviyesinde bağlantı.",
  "Application-level connection.":"Uygulama seviyesinde bağlantı.",
  "Encryption layered over a network or application connection.":"Ağ veya uygulama bağlantısı üzerine eklenen şifreleme.",
  "Encrypted VPN communication tunnel.":"Şifrelenmiş VPN iletişim tüneli.",
  "External service for identity authentication.":"Kimlik doğrulama için harici hizmet.",
  "External service for cloud data storage.":"Bulut veri depolama için harici hizmet.",
  "External service for payment processing.":"Ödeme işlemleri için harici hizmet.",
  "External service for system monitoring.":"Sistem izleme için harici hizmet.",
  "Network traffic filtering.":"Ağ trafiği filtreleme.",
  "Policy evaluation.":"Politika değerlendirme.",
  "Connection relay.":"Bağlantı aktarımı.",
  "Private corporate target.":"Özel kurumsal hedef.",
  "Local network target.":"Yerel ağ hedefi.",
  "Cloud-hosted target resource.":"Bulutta barındırılan hedef kaynak.",
  "Public network target.":"Herkese açık ağ hedefi.",
  "Remove":"Kaldır",
  "Architecture State":"Mimari Durumu",
  "Close dialog":"Pencereyi kapat",
  "Architecture state JSON":"Mimari durumu JSON",
  "Copy JSON":"JSON'u Kopyala",
  "Import JSON":"JSON'u İçe Aktar",
  "Close":"Kapat",
  "Copy the current architecture JSON.":"Mevcut mimarinin JSON verisini kopyalayın.",
  "JSON copied.":"JSON kopyalandı.",
  "Paste architecture-state JSON, then choose Import JSON.":"Mimari durumu JSON verisini yapıştırın ve ardından JSON'u İçe Aktar seçeneğini kullanın.",
  "The text is not valid JSON.":"Metin geçerli bir JSON değil.",
  "Expected an object with a slots object.":"Slots nesnesi içeren bir nesne bekleniyor."
};

let currentLanguage:Language="en";
const listeners=new Set<()=>void>();

export function getLanguage():Language{
  return currentLanguage;
}

export function t(text:string):string{
  return currentLanguage==="tr"
    ?turkishTranslations[text]??text
    :text;
}

export function translateMessage(message:string):string{
  const exact=t(message);
  if(exact!==message||currentLanguage==="en")return exact;

  const invalidDrop=message.match(/^(.+) does not accept (.+)\. Accepted: (.+)\.$/);
  if(invalidDrop){
    const accepted=invalidDrop[3]
      .split(", ")
      .map(item=>t(item))
      .join(", ");
    return`${t(invalidDrop[1])}, ${t(invalidDrop[2])} bileşenini kabul etmiyor. Kabul edilenler: ${accepted}.`;
  }

  const alreadyUsed=message.match(/^(.+) is already in use and is not reusable\.$/);
  if(alreadyUsed){
    return`${t(alreadyUsed[1])} zaten kullanılıyor ve yeniden kullanılamaz.`;
  }

  const unknownSlot=message.match(/^Unknown slot ID: (.+)\.$/);
  if(unknownSlot)return`Bilinmeyen alan kimliği: ${unknownSlot[1]}.`;

  const invalidComponent=message.match(/^Invalid component ID for (.+)\.$/);
  if(invalidComponent)return`${t(invalidComponent[1])} için geçersiz bileşen kimliği.`;

  const incompatible=message.match(/^(.+) is not compatible with (.+)\.$/);
  if(incompatible)return`${t(incompatible[1])}, ${t(incompatible[2])} ile uyumlu değil.`;

  return message;
}

export function applyPageTranslations():void{
  document.documentElement.lang=currentLanguage;
  document.title=t("Cybersecurity Architecture Builder");

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach(element=>{
    const key=element.dataset.i18n;
    if(key)element.textContent=t(key);
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-aria-label]").forEach(element=>{
    const key=element.dataset.i18nAriaLabel;
    if(key)element.setAttribute("aria-label",t(key));
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach(element=>{
    const key=element.dataset.i18nTitle;
    if(key)element.setAttribute("title",t(key));
  });

  document.querySelectorAll<HTMLElement>("[data-source-message]").forEach(element=>{
    element.textContent=translateMessage(
      element.dataset.sourceMessage??""
    );
  });

  document.querySelectorAll<HTMLElement>("[data-source-messages]").forEach(element=>{
    try{
      const messages=JSON.parse(
        element.dataset.sourceMessages??"[]"
      )as string[];
      element.textContent=messages
        .map(message=>translateMessage(message))
        .join(" ");
    }catch{
      element.textContent="";
    }
  });
}

export function setLanguage(language:Language):void{
  if(currentLanguage===language)return;
  currentLanguage=language;
  localStorage.setItem("architecture-language",language);
  listeners.forEach(listener=>listener());
}

export function initializeLanguage():void{
  const saved=localStorage.getItem("architecture-language");
  currentLanguage=saved==="tr"?"tr":"en";
}

export function subscribeToLanguage(listener:()=>void):()=>void{
  listeners.add(listener);
  return()=>listeners.delete(listener);
}
