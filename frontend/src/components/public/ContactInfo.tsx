// FILE: src/components/public/ContactInfo.tsx
import { Phone, Mail, MapPin } from "lucide-react";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

export function ContactInfo() {
  // İhtiyacımız olan key’leri tek istekte çekiyoruz
  const { data: settings } = useListSiteSettingsQuery({
    keys: [
      "contact_phone_display",
      "contact_phone_tel",
      "contact_email",
      "contact_address",
    ],
    limit: 50,
  });

  const getSetting = (key: string, fallback: string): string => {
    const found = settings?.find((s) => s.key === key);
    const v = found?.value;
    return typeof v === "string" && v.trim().length > 0 ? v : fallback;
  };

  // Seed’deki default’ları fallback olarak kullan
  const phoneDisplay = getSetting("contact_phone_display", "0533 483 89 71");
  const phoneTel = getSetting("contact_phone_tel", "05334838971");
  const email = getSetting("contact_email", "mezarisim.com@gmail.com");
  const address = getSetting(
    "contact_address",
    "Hekimbaşı Mah. Yıldıztepe Cad. No:41 Ümraniye/İstanbul"
  );

  // tel: için boşlukları temizleyelim
  const phoneHref = `tel:${phoneTel.replace(/\s+/g, "")}`;

  // Adresi iki satıra bölmek istersen basit bir split kullanabiliriz (opsiyonel)
  // Şu haliyle " / " ile ikiye bölmeyi deneyelim, yoksa tek satır:
  const [addressLine1, addressLine2] = (() => {
    // özel bir format yoksa direkt full string’i tek satırda göster
    if (address.includes("No:41 ")) {
      // Eski statik haline yakın bir bölme
      const idx = address.indexOf("No:41 ");
      const first = address.slice(0, idx + "No:41".length);
      const second = address.slice(idx + "No:41 ".length);
      return [first.trim(), second.trim()];
    }
    return [address, ""];
  })();

  return (
    <section className="py-6 bg-teal-500">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-3 gap-2 md:gap-6">
          {/* TELEFON */}
          <div className="text-center text-white group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-white/30 transition-colors">
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-xs md:text-sm mb-1 text-white/90">TELEFON</h3>
            <div className="space-y-0.5">
              <a
                href={phoneHref}
                className="block text-xs md:text-sm text-white hover:text-white/80 transition-colors cursor-pointer"
              >
                {phoneDisplay}
              </a>
            </div>
          </div>

          {/* E-POSTA */}
          <div className="text-center text-white group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-white/30 transition-colors">
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-xs md:text-sm mb-1 text-white/90">E-POSTA</h3>
            <div className="space-y-0.5">
              <a
                href={`mailto:${email}`}
                className="block text-xs md:text-sm text-white hover:text-white/80 transition-colors cursor-pointer break-all"
              >
                {email}
              </a>
            </div>
          </div>

          {/* ADRES */}
          <div className="text-center text-white group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-white/30 transition-colors">
              <MapPin className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-xs md:text-sm mb-1 text-white/90">ADRES</h3>
            <div className="space-y-0.5">
              <p className="text-xs md:text-sm text-white/90 leading-tight">
                {addressLine1}
              </p>
              {addressLine2 && (
                <p className="text-xs md:text-sm text-white/90 leading-tight">
                  {addressLine2}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
