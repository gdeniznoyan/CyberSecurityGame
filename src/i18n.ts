import type { ComponentDefinition } from "./types.js";

export type Language = "en" | "tr";

const uiTranslations: Record<string, string> = {
  Cybersecurity: "Siber Güvenlik",
  "Architecture Builder": "Mimari Oluşturucu",
  "Architecture Builder home": "Mimari Oluşturucu ana sayfası",
  Reset: "Sıfırla",
  Language: "Dil",
  "Your architecture": "Mimariniz",
  "Build the access journey": "Erişim yolculuğunu oluşturun",
  "Move from the user to the protected resource.":
    "Kullanıcıdan korunan kaynağa uzanan yolu oluşturun.",
  Analyze: "Analiz Et",
  "Instant examples": "Hazır örnekler",
  "Show sayTRUST": "sayTRUST'u Göster",
  "Show Zero Trust": "Zero Trust'ı Göster",
  "Show VPN Connection": "VPN Bağlantısını Göster",
  "Security toolkit": "Güvenlik araçları",
  "Choose your components": "Componentlerinizi seçin",
  "Drag each control into its matching stage above.":
    "Her kontrolü yukarıdaki uygun alana sürükleyin.",
  "Architecture report": "Mimari raporu",
  "Architecture Analysis": "Mimari Analizi",
  "What your design protects, what it exposes and what you should change next.":
    "Tasarımınızın neyi koruduğunu, neyi açığa çıkardığını ve sonraki değişiklikleri görün.",
  "Close analysis": "Analizi kapat",
  "Architecture classification": "Mimari sınıflandırması",
  "Start building": "Oluşturmaya başlayın",
  "Security Score": "Güvenlik Puanı",
  score: "puan",
  "Effective security posture": "Etkin güvenlik duruşu",
  "Based on the connected access path and configuration.":
    "Bağlı erişim yolu ve konfigürasyona göre hesaplanır.",
  "Component overview": "Component özeti",
  Configuration: "Konfigürasyon",
  Remove: "Kaldır",
  "Drop here": "Buraya bırakın",
  "PUBLIC INTERNET": "AÇIK İNTERNET",
  "Public Internet": "Açık İnternet",
  "Third-Party Systems": "Üçüncü Taraf Sistemleri",
  Device: "Cihaz",
  Identity: "Kimlik",
  Access: "Erişim",
  Connection: "Bağlantı",
  Resources: "Kaynaklar",
  External: "Harici",
  "User & Device": "Kullanıcı ve Cihaz",
  "Access Control": "Erişim Kontrolü",
  "Protected Resources": "Korunan Kaynaklar",
  "Access Path": "Erişim Yolu",
  "A complete route has not been created yet":
    "Henüz eksiksiz bir erişim yolu oluşturulmadı",
  "No complete path from user to resource.":
    "Kullanıcıdan kaynağa uzanan eksiksiz bir yol yok.",
  "Authentication Model": "Kimlik Doğrulama Modeli",
  "Authentication Dependency": "Kimlik Doğrulama Bağımlılığı",
  "Policy Evaluation": "Politika Değerlendirmesi",
  "Policy Enforcement": "Politika Uygulaması",
  "Connection Type": "Bağlantı Türü",
  "Client Network Visibility": "İstemcinin Ağ Görünürlüğü",
  "Client Reachability": "İstemcinin Erişebildiği Alan",
  "Network Participation": "Ağ Katılımı",
  "Detected Openings": "Tespit Edilen Açıklar",
  "Recommended Change": "Önerilen Değişiklik",
  "No opening detected on the effective path.":
    "Etkin erişim yolunda bir güvenlik açığı tespit edilmedi.",
  "Traditional Access": "Geleneksel Erişim",
  "Zero Trust": "Zero Trust",
  "sayTRUST Post-Zero Trust": "sayTRUST Post-Zero Trust",
  "Hybrid Architecture": "Hibrit Mimari",
  "Incomplete Architecture": "Eksik Mimari",
  "Broken or Unsafe Architecture": "Bozuk veya Güvensiz Mimari",
  User: "Kullanıcı",
};

const componentTranslations: Record<
  string,
  { name: string; description: string }
> = {
  "client-device": {
    name: "İstemci Cihazı",
    description:
      "Kullanıcının erişimi başlatmak için kullandığı uç noktayı temsil eder. Kişisel bilgisayar, BYOD cihazı veya otomatik olarak güvenilmeyen başka bir uç nokta olabilir.",
  },
  "secure-device": {
    name: "Güvenli Cihaz",
    description:
      "Korunan kaynaklara erişmeden önce kurumun güvenlik gereksinimlerini karşılayan, yönetilen ve güvenlik kontrolleri uygulanan uç noktayı temsil eder.",
  },
  "saytrust-hardware-security-token": {
    name: "sayTRUST Donanım Güvenlik Tokenı",
    description:
      "Donanıma bağlı kimlik sağlamak ve hassas kimlik doğrulama ile kriptografik işlemleri istemci cihazının dışında korumak için kullanılan sayTRUST güvenlik tokenını temsil eder.",
  },
  "biometric-verification": {
    name: "Biyometrik Doğrulama",
    description:
      "Erişim isteyen kişinin yetkili kullanıcı olduğunu doğrulamak için parmak izi veya yüz özelliği gibi biyometrik bir nitelik kullanır.",
  },
  "client-pin": {
    name: "İstemci PIN'i",
    description:
      "Kullanıcının bildiği ve güvenli istemciye veya donanım tokenına erişirken ek kimlik doğrulama faktörü olarak kullanılan PIN'i temsil eder.",
  },
  "private-ca": {
    name: "Özel Sertifika Otoritesi",
    description:
      "Kritik kimlik zincirinde harici bir sertifika otoritesine bağlı kalmadan güvenilir dijital sertifikaları yayımlayan ve yöneten kurum kontrollü Sertifika Otoritesini temsil eder.",
  },
  "user-certificate": {
    name: "Kullanıcı Sertifikası",
    description:
      "Kullanıcıyla ilişkilendirilmiş ve kimlik doğrulama sırasında sertifika tabanlı kimlik oluşturmak için kullanılan dijital sertifikayı temsil eder.",
  },
  "x509-certificate": {
    name: "X.509 Sertifikası",
    description:
      "Bir kullanıcı, cihaz veya servisin kimliğini kriptografik olarak doğrulamak için kullanılan standart X.509 dijital sertifikasını temsil eder.",
  },
  "certificate-validation": {
    name: "Sertifika Doğrulaması",
    description:
      "Sertifika bütünlüğü, geçerlilik süresi, yayımlayan otorite ve güven zinciri gibi kontrollerle bir sertifikaya güvenilmeden önce geçerli olduğunu doğrular.",
  },
  "certificate-revocation-check": {
    name: "Sertifika İptal Kontrolü",
    description:
      "Daha önce yayımlanmış bir sertifikanın iptal edilip edilmediğini kontrol eder ve iptal edilmiş ya da ele geçirilmiş sertifikalara güvenilmesini önler.",
  },
  otp: {
    name: "Tek Kullanımlık Parola (OTP)",
    description:
      "Yalnızca tek bir giriş veya kısa bir süre için geçerli olan ek kimlik doğrulama faktörünü temsil eder.",
  },
  "saytrust-server": {
    name: "sayTRUST Sunucusu",
    description:
      "Kimliği, izinleri, hedef uygulamaları ve erişim politikalarını değerlendiren ve oluşan erişim kararını uygulayabilen merkezi sayTRUST güvenlik sunucusunu temsil eder.",
  },
  "policy-engine": {
    name: "Politika Motoru",
    description:
      "Tanımlı kurum politikalarına göre bir erişim isteğine izin verilip verilmeyeceğini belirlemek için bağlamsal bilgileri ve güvenlik verilerini değerlendirir.",
  },
  "client-privilege-management": {
    name: "İstemci Ayrıcalık Yönetimi",
    description:
      "Erişim oturumu sırasında gereksiz yönetici veya yükseltilmiş izinlerin kullanılmaması için istemci cihazına ya da kullanıcıya sunulan ayrıcalıkları sınırlar.",
  },
  "least-privilege-control": {
    name: "En Az Ayrıcalık Denetimi",
    description:
      "Erişimi kullanıcının mevcut görevi için gereken en düşük izinler ve kaynaklarla sınırlandırarak ele geçirilmiş hesap veya cihazın etkisini azaltır.",
  },
  "application-authorization": {
    name: "Uygulama Yetkilendirmesi",
    description:
      "Kimliği doğrulanan kullanıcının hangi uygulamalara erişebileceğini belirler ve açıkça onaylanmamış uygulamalara erişimi engeller.",
  },
  "session-revocation": {
    name: "Oturum İptali",
    description:
      "Yetkilendirme değiştiğinde, şüpheli etkinlik algılandığında veya kullanıcının izni sona erdiğinde etkin erişim oturumunun sonlandırılmasını sağlar.",
  },
  gateway: {
    name: "Ağ Geçidi",
    description:
      "Harici istemci ile korunan kaynaklar arasındaki kontrollü giriş noktasını temsil eder. Konfigürasyonu ağ veya uygulama düzeyinde erişim sağlayıp sağlamadığını belirler.",
  },
  "network-connection": {
    name: "Ağ Bağlantısı",
    description:
      "İstemciye ağ düzeyinde erişim sağlayan ve birden fazla sisteme veya ağ kaynağına ulaşabilmesine imkân verebilen bağlantıyı temsil eder.",
  },
  "application-connection": {
    name: "Uygulama Bağlantısı",
    description:
      "Daha geniş korunan ağı açığa çıkarmak yerine yalnızca belirli bir yetkili uygulamaya erişim sağlayan bağlantıyı temsil eder.",
  },
  "ram-application-tunnel": {
    name: "RAM Uygulama Tüneli",
    description:
      "Bağlantı durumunun geleneksel kalıcı ağ bağlantısı yerine RAM üzerinde oluşturulduğu ve tutulduğu uygulamaya özel güvenli tüneli temsil eder.",
  },
  "encrypted-ram": {
    name: "Şifrelenmiş RAM",
    description:
      "Hassas oturum ve bağlantı bilgilerinin bellekte geçici olarak tutulurken şifrelemeyle korunmasını temsil eder.",
  },
  "mutual-tls": {
    name: "Karşılıklı TLS",
    description:
      "Güvenilir ve şifreli bağlantı kurulmadan önce istemci ile sunucunun sertifikalar kullanarak birbirini doğruladığı Karşılıklı Taşıma Katmanı Güvenliğini temsil eder.",
  },
  "aes-256-encryption": {
    name: "AES-256 Şifreleme",
    description:
      "Hassas verileri ve bağlantı bilgilerini yetkisiz okumaya karşı korumak için kullanılan güçlü AES-256 şifrelemeyi temsil eder.",
  },
  "perfect-forward-secrecy": {
    name: "Mükemmel İleri Gizlilik",
    description:
      "Uzun süreli kriptografik materyalin ele geçirilmesi durumunda geçmiş oturumların otomatik olarak açığa çıkmaması için bağımsız geçici oturum anahtarları kullanır.",
  },
  "virtual-network-interface": {
    name: "Sanal Ağ Arayüzü",
    description:
      "İstemcide oluşturulan ve istemcinin korunan ağa ağ düzeyinde katılmasını veya ağla etkileşim kurmasını sağlayabilen sanal ağ adaptörünü temsil eder.",
  },
  "corporate-network": {
    name: "Kurumsal Ağ",
    description:
      "İstemcinin birden fazla korunan sistem ve servise ulaşabildiği kurum iç ağına geniş kapsamlı erişimi temsil eder.",
  },
  "restricted-subnet": {
    name: "Kısıtlı Alt Ağ",
    description:
      "Tüm kurumsal ağ yerine belirli bir iç alt ağla sınırlandırılmış ağ düzeyi erişimi temsil eder.",
  },
  "internal-web-application": {
    name: "İç Web Uygulaması",
    description:
      "Kullanıcının daha geniş kurumsal ağa erişim almadan kullanabileceği korunan bir iç web uygulamasını temsil eder.",
  },
  "virtual-machine": {
    name: "Sanal Makine",
    description:
      "Yetkilendirilmiş korunan kaynak olarak erişilebilen belirli bir sanal makineyi temsil eder.",
  },
  "external-identity-provider": {
    name: "Harici Kimlik Sağlayıcı",
    description:
      "Mimariye kullanıcı kimlik bilgisi veya kimlik beyanı sağlayan harici servisi temsil eder. Konfigürasyonuna göre birincil kimlik kaynağı, ikincil kimlik sinyali veya destekleyici servis olabilir.",
  },
  "external-authentication-service": {
    name: "Harici Kimlik Doğrulama Servisi",
    description:
      "Kullanıcının korunan kaynaklara erişip erişemeyeceğini belirleyen kimlik doğrulama kararını doğrudan gerçekleştiren veya bu karara katılan harici servisi temsil eder.",
  },
  "external-cloud-service": {
    name: "Harici Bulut Servisi",
    description:
      "Mimarinin uygulama işlevleri, altyapı, depolama veya işleme için bağımlı olduğu, harici sağlayıcı tarafından işletilen bulut servisini temsil eder.",
  },
  "external-monitoring-service": {
    name: "Harici İzleme Servisi",
    description:
      "Mimariden günlükleri, telemetriyi, güvenlik olaylarını veya operasyonel bilgileri alan harici izleme ya da güvenlik servisini temsil eder.",
  },
};

const textTranslations: Record<string, string> = {
  "Device posture": "Cihaz güvenlik durumu",
  "Untrusted Device": "Güvenilmeyen Cihaz",
  "Managed / Secure Device": "Yönetilen / Güvenli Cihaz",
  "Hardware ID": "Donanım Kimliği",
  "Biometric verification": "Biyometrik doğrulama",
  "Client PIN": "İstemci PIN'i",
  "Client PIN enabled": "İstemci PIN'i etkin",
  "Certificate / PIN protection": "Sertifika / PIN koruması",
  "Additional OTP factor": "Ek OTP faktörü",
  "Certificate checked": "Sertifika kontrol edildi",
  "Expiration checked": "Geçerlilik süresi kontrol edildi",
  "Revocation checked": "İptal durumu kontrol edildi",
  "Complete validation": "Eksiksiz doğrulama",
  "Policy timing": "Politika zamanı",
  "Policy Before Connection": "Bağlantıdan Önce Politika",
  "Policy After Connection": "Bağlantıdan Sonra Politika",
  "Least privilege": "En az ayrıcalık",
  "Broad role permission": "Geniş rol izni",
  "Session revocation": "Oturum iptali",
  "Application authorization": "Uygulama yetkilendirmesi",
  "Access level": "Erişim düzeyi",
  "Network-Level Access": "Ağ Düzeyinde Erişim",
  "Application-Level Access": "Uygulama Düzeyinde Erişim",
  "Virtual network interface": "Sanal ağ arayüzü",
  "Protected network address assigned": "Korunan ağ adresi atandı",
  "Access scope": "Erişim kapsamı",
  "Full Network Access": "Tam Ağ Erişimi",
  "Restricted Subnet Access": "Kısıtlı Alt Ağ Erişimi",
  "Application-Specific Route": "Uygulamaya Özel Rota",
  "Split tunneling": "Bölünmüş tünelleme",
  "Encrypted RAM": "Şifrelenmiş RAM",
  "Application-specific connection": "Uygulamaya özel bağlantı",
  "Connection key protects RAM": "Bağlantı anahtarı RAM'i korur",
  "Persistent connection artifacts": "Kalıcı bağlantı kalıntıları",
  "Identity role": "Kimlik rolü",
  "Primary Authenticator": "Birincil Kimlik Doğrulayıcı",
  "Secondary Identity Signal": "İkincil Kimlik Sinyali",
  "SSO After Authentication": "Kimlik Doğrulama Sonrası SSO",
  "Application-Only Dependency": "Yalnızca Uygulama Bağımlılığı",
  "Authentication Too Late": "Kimlik Doğrulama Çok Geç",
  "Policy Without Enforcement": "Uygulama Noktası Olmayan Politika",
  "Authorization Too Late": "Yetkilendirme Çok Geç",
  "Certificate Misconfiguration": "Hatalı Sertifika Konfigürasyonu",
  "External Authentication Dependency": "Harici Kimlik Doğrulama Bağımlılığı",
  "Wrong Connection Method": "Yanlış Bağlantı Yöntemi",
  "Application Restriction After Network Exposure":
    "Ağ Açığa Çıktıktan Sonra Uygulama Kısıtlaması",
  "Strong Encryption With Excessive Access":
    "Aşırı Erişimle Birlikte Güçlü Şifreleme",
  "Private CA Not Used": "Özel Sertifika Otoritesi Kullanılmıyor",
  "Hardware-bound identity is verified before communication begins.":
    "Donanıma bağlı kimlik, iletişim başlamadan önce doğrulanıyor.",
  "Hardware-bound identity exists, but it is not verified before communication begins.":
    "Donanıma bağlı kimlik mevcut ancak iletişim başlamadan önce doğrulanmıyor.",
  "Identity is verified before communication begins.":
    "Kimlik, iletişim başlamadan önce doğrulanıyor.",
  "Identity is verified too late in the active path.":
    "Kimlik, etkin erişim yolunda çok geç doğrulanıyor.",
  "No effective user authentication is present on the active path.":
    "Etkin erişim yolunda geçerli bir kullanıcı kimlik doğrulaması yok.",
  "Primary authentication depends on an external identity provider.":
    "Birincil kimlik doğrulama harici bir kimlik sağlayıcıya bağlı.",
  "Primary authentication is not externally dependent.":
    "Birincil kimlik doğrulama harici bir sağlayıcıya bağlı değil.",
  "Access policy is evaluated before the communication path is created.":
    "Erişim politikası iletişim yolu oluşturulmadan önce değerlendiriliyor.",
  "Access policy exists, but it is evaluated after communication begins.":
    "Erişim politikası mevcut ancak iletişim başladıktan sonra değerlendiriliyor.",
  "No effective policy evaluation occurs on the active path.":
    "Etkin erişim yolunda geçerli bir politika değerlendirmesi yapılmıyor.",
  "The access decision is enforced before the resource.":
    "Erişim kararı kaynağa ulaşılmadan önce uygulanıyor.",
  "No effective enforcement point applies the access decision.":
    "Erişim kararını uygulayan geçerli bir enforcement noktası yok.",
  "Hybrid network and application access": "Hibrit ağ ve uygulama erişimi",
  "Network-level access": "Ağ düzeyinde erişim",
  "Application-level access": "Uygulama düzeyinde erişim",
  "No effective connection": "Geçerli bağlantı yok",
  "Protected network information may be visible to the client.":
    "Korunan ağ bilgileri istemci tarafından görülebilir.",
  "Protected network details remain hidden from the client.":
    "Korunan ağ ayrıntıları istemciden gizli kalıyor.",
  "The client can reach network-level resources.":
    "İstemci ağ düzeyindeki kaynaklara erişebiliyor.",
  "The client can reach only explicitly connected applications.":
    "İstemci yalnızca açıkça bağlanmış uygulamalara erişebiliyor.",
  "No protected resource is reachable.": "Korunan hiçbir kaynağa erişilemiyor.",
  "The client participates in the protected network.":
    "İstemci korunan ağa katılıyor.",
  "The client does not join the protected network.":
    "İstemci korunan ağa katılmıyor.",
  "Connect components from the user and device stage to a protected resource.":
    "Kullanıcı ve cihaz aşamasından korunan bir kaynağa kadar componentleri bağlayın.",
  "The VPN path protects the session, but still grants network-level access. Use application-level access and policy enforcement when stronger isolation is required.":
    "VPN yolu oturumu korur ancak yine de ağ düzeyinde erişim verir. Daha güçlü izolasyon gerektiğinde uygulama düzeyinde erişim ve politika uygulaması kullanın.",
  "The current path has no detected architectural conflict.":
    "Mevcut erişim yolunda tespit edilmiş bir mimari çakışma yok.",
};

let currentLanguage: Language = "en";

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(language: Language): void {
  currentLanguage = language;
  document.documentElement.lang = language;
  try {
    localStorage.setItem("architecture-builder-language", language);
  } catch {
    // The interface still works when storage is unavailable.
  }
}

export function getSavedLanguage(): Language {
  try {
    return localStorage.getItem("architecture-builder-language") === "tr"
      ? "tr"
      : "en";
  } catch {
    return "en";
  }
}

export function t(text: string): string {
  return currentLanguage === "tr" ? (uiTranslations[text] ?? text) : text;
}

export function translateText(text: string): string {
  if (currentLanguage !== "tr") return text;
  const component = Object.values(componentTranslations).find(
    (item) => item.name === text,
  );
  return uiTranslations[text] ?? textTranslations[text] ?? component?.name ?? text;
}

export function localizedComponentName(component: ComponentDefinition): string {
  return currentLanguage === "tr"
    ? (componentTranslations[component.id]?.name ?? component.name)
    : component.name;
}

export function localizedComponentDescription(
  component: ComponentDefinition,
): string {
  return currentLanguage === "tr"
    ? (componentTranslations[component.id]?.description ?? component.description)
    : component.description;
}

export function translateEvaluationText(text: string): string {
  if (currentLanguage !== "tr") return text;
  const direct = uiTranslations[text] ?? textTranslations[text];
  if (direct) return direct;
  const recommendation = /^Resolve (.+) and verify the complete access path again\.$/.exec(
    text,
  );
  if (recommendation)
    return `${translateText(recommendation[1])} sorununu giderin ve eksiksiz erişim yolunu yeniden doğrulayın.`;
  return text;
}

export function translatePage(): void {
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const source = element.dataset.i18n ?? "";
    element.textContent = t(source);
  });
  document
    .querySelectorAll<HTMLElement>("[data-i18n-aria-label]")
    .forEach((element) => {
      const source = element.dataset.i18nAriaLabel ?? "";
      element.setAttribute("aria-label", t(source));
    });
  document.title =
    currentLanguage === "tr"
      ? "Siber Güvenlik Mimari Oluşturucu"
      : "Cybersecurity Architecture Builder";
  const description = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );
  if (description)
    description.content =
      currentLanguage === "tr"
        ? "Etkileşimli bir siber güvenlik yolculuğuyla güvenli erişim mimarileri oluşturun ve keşfedin."
        : "Build and explore a secure access architecture through an interactive cybersecurity journey.";
}
