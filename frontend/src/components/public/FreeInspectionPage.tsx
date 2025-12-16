// FILE: src/components/public/FreeInspectionPage.tsx
import { Button } from "../ui/button";
import {
  Calendar,
  Tag,
  ArrowLeft,
  MapPin,
  CheckCircle,
  Clock,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

interface FreeInspectionPageProps {
  onNavigate: (page: string) => void;
}

type InspectionStep = {
  step: string;
  title: string;
  description: string;
};

export function FreeInspectionPage({ onNavigate }: FreeInspectionPageProps) {
  // 🔹 Site settings'ten verileri çek
  const { data: settings } = useListSiteSettingsQuery({
    keys: [
      // contact
      "contact_phone_display",
      "contact_phone_tel",
      "contact_whatsapp_link",

      // free inspection page content
      "free_inspection_hero_image",
      "free_inspection_meta_date",
      "free_inspection_meta_tag",
      "free_inspection_title",
      "free_inspection_lead_title",
      "free_inspection_lead_body",
      "free_inspection_steps",
      "free_inspection_service_areas",
      "free_inspection_service_areas_title",
      "free_inspection_service_areas_intro",
      "free_inspection_scope_title",
      "free_inspection_scope_items",
      "free_inspection_speed_title",
      "free_inspection_speed_items",
      "free_inspection_cta_title",
      "free_inspection_cta_body",
      "free_inspection_info_title",
      "free_inspection_info_body",
    ],
    limit: 50,
  });

  const findSettingValue = (key: string) =>
    settings?.find((s) => s.key === key)?.value;

  const getSettingStr = (key: string, fallback: string): string => {
    const v = findSettingValue(key);
    return typeof v === "string" && v.trim().length > 0 ? v : fallback;
  };

  const getStringArray = (key: string, fallback: string[]): string[] => {
    const v = findSettingValue(key);
    if (Array.isArray(v)) {
      const arr = v.map((item) =>
        typeof item === "string" ? item : String(item)
      );
      return arr.length ? arr : fallback;
    }
    return fallback;
  };

  const getStepsArray = (key: string, fallback: InspectionStep[]): InspectionStep[] => {
    const v = findSettingValue(key);
    if (Array.isArray(v)) {
      const out: InspectionStep[] = [];
      for (const [idx, item] of v.entries()) {
        if (item && typeof item === "object") {
          const obj = item as {
            step?: string;
            title?: string;
            description?: string;
          };
          if (obj.title || obj.description) {
            out.push({
              step: obj.step ?? String(idx + 1),
              title: obj.title ?? "",
              description: obj.description ?? "",
            });
          }
        } else if (typeof item === "string") {
          out.push({
            step: String(idx + 1),
            title: item,
            description: "",
          });
        }
      }
      if (out.length) return out;
    }
    return fallback;
  };

  // 🔹 Fallback değerler (şu an sayfada olan statik içerik)
  const defaultServiceAreas = [
    "Üsküdar",
    "Kadıköy",
    "Kartal",
    "Maltepe",
    "Pendik",
    "Tuzla",
    "Çekmeköy",
    "Sancaktepe",
    "Sultanbeyli",
    "Şile",
    "Beykoz",
    "Ümraniye",
    "Ataşehir",
    "Samandıra",
    "Kavacık",
    "Aydos",
    "Ağva",
  ];

  const defaultInspectionSteps: InspectionStep[] = [
    {
      step: "1",
      title: "Randevu Alın",
      description:
        "Telefon veya WhatsApp ile iletişime geçin, uygun tarihi belirleyin",
    },
    {
      step: "2",
      title: "Keşif Ziyareti",
      description:
        "Uzman ekibimiz mezarlığa gelerek ölçüm ve inceleme yapar",
    },
    {
      step: "3",
      title: "Teknik Rapor",
      description:
        "Zemin durumu, ölçüler ve uygun model önerilerini içeren rapor hazırlanır",
    },
    {
      step: "4",
      title: "Fiyat Teklifi",
      description: "Detaylı fiyat teklifi ve çalışma takvimi sunulur",
    },
  ];

  const defaultScopeItems = [
    "Mezar yerinin detaylı ölçümü",
    "Zemin yapısının analizi",
    "Mevcut durumun fotoğraflanması",
    "Uygun model önerilerinin sunulması",
    "Teknik rapor hazırlanması",
    "Detaylı fiyat teklifinin verilmesi",
  ];

  const defaultSpeedItems = [
    "24 saat içinde randevu",
    "Keşif işlemi 30-45 dakika",
    "Aynı gün fiyat teklifi",
    "Hafta sonu da hizmet",
    "Uzman ekip ile çalışma",
    "Yükümlülük getirmez",
  ];

  // 🔹 Site settings'ten override edilmiş değerler
  const heroImage = getSettingStr(
    "free_inspection_hero_image",
    "https://images.unsplash.com/photo-1672684089414-7174386a1fd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJibGUlMjBzdG9uZSUyMGNlbWV0ZXJ5fGVufDF8fHx8MTc1NjA3MTEzNnww&ixlib=rb-4.1.0&q=80&w=800&h=400&fit=crop&crop=center"
  );

  const metaDate = getSettingStr("free_inspection_meta_date", "Şubat 2024");
  const metaTag = getSettingStr("free_inspection_meta_tag", "Hizmet");
  const pageTitle = getSettingStr(
    "free_inspection_title",
    "İstanbul Anadolu Yakası Ücretsiz Keşif Hizmeti"
  );

  const leadTitle = getSettingStr(
    "free_inspection_lead_title",
    "🆓 Tamamen Ücretsiz Keşif ve Ölçüm"
  );
  const leadBody = getSettingStr(
    "free_inspection_lead_body",
    "İstanbul Anadolu yakası tüm mezarlıklarında profesyonel keşif ve ölçüm hizmeti sunuyoruz. Uzman ekibimiz, mezarlığa gelerek zemin analizi, ölçüm işlemleri ve teknik değerlendirme yapar. Bu hizmet tamamen ücretsizdir ve herhangi bir yükümlülük getirmez."
  );

  const stepsTitle = getSettingStr(
    "free_inspection_steps_title",
    "Keşif Süreci Nasıl İşler?"
  );
  const inspectionSteps = getStepsArray(
    "free_inspection_steps",
    defaultInspectionSteps
  );

  const serviceAreasTitle = getSettingStr(
    "free_inspection_service_areas_title",
    "Hizmet Verdiğimiz Bölgeler"
  );
  const serviceAreasIntro = getSettingStr(
    "free_inspection_service_areas_intro",
    "İstanbul Anadolu yakasındaki tüm mezarlıklarda hizmet veriyoruz:"
  );
  const serviceAreas = getStringArray(
    "free_inspection_service_areas",
    defaultServiceAreas
  );

  const scopeTitle = getSettingStr(
    "free_inspection_scope_title",
    "Keşif Hizmeti Kapsamı"
  );
  const scopeItems = getStringArray(
    "free_inspection_scope_items",
    defaultScopeItems
  );

  const speedTitle = getSettingStr(
    "free_inspection_speed_title",
    "Hızlı ve Pratik"
  );
  const speedItems = getStringArray(
    "free_inspection_speed_items",
    defaultSpeedItems
  );

  const ctaTitle = getSettingStr(
    "free_inspection_cta_title",
    "📞 Ücretsiz Keşif İçin Randevu Alın"
  );
  const ctaBody = getSettingStr(
    "free_inspection_cta_body",
    "Mezar yapımı konusunda en doğru kararı verebilmeniz için profesyonel keşif hizmetimizden yararlanın. Uzman ekibimiz size en uygun çözümü sunar ve detaylı bilgi verir."
  );

  const infoTitle = getSettingStr(
    "free_inspection_info_title",
    "💡 Önemli Bilgi"
  );
  const infoBody = getSettingStr(
    "free_inspection_info_body",
    "Keşif hizmetimiz tamamen ücretsizdir ve herhangi bir yükümlülük getirmez. Teklif aldıktan sonra düşünme süreniz olacak ve istediğiniz zaman bizimle çalışmaya karar verebilirsiniz. Amacımız size en iyi hizmeti sunmaktır."
  );

  // 🔹 Telefon & WhatsApp (contact site_settings)
  const phoneDisplay = getSettingStr("contact_phone_display", "0533 483 89 71");
  const phoneTelRaw = getSettingStr("contact_phone_tel", "05334838971");
  const whatsappBase = getSettingStr(
    "contact_whatsapp_link",
    "https://wa.me/905334838971"
  );

  const phoneDigits = phoneTelRaw.replace(/\D+/g, "");
  const phoneE164 =
    phoneDigits.length === 11 && phoneDigits.startsWith("0")
      ? `+90${phoneDigits.slice(1)}`
      : phoneDigits.startsWith("90")
        ? `+${phoneDigits}`
        : phoneDigits.startsWith("+")
          ? phoneDigits
          : `+${phoneDigits}`;
  const telHref = `tel:${phoneE164}`;

  const whatsappUrl = `${whatsappBase}?text=${encodeURIComponent(
    "Ücretsiz keşif hizmeti için randevu almak istiyorum"
  )}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button
          onClick={() => onNavigate("home")}
          variant="outline"
          className="mb-6 flex items-center gap-2 hover:bg-teal-50 border-teal-500 text-teal-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Button>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-64 md:h-80">
            <ImageWithFallback
              src={heroImage}
              alt="Ücretsiz Keşif Hizmeti - Mezarlık Ziyareti"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                {metaTag}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{metaDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{metaTag}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {pageTitle}
            </h1>

            {/* Content */}
            <div className="prose max-w-none space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                <h2 className="text-xl font-semibold text-green-700 mb-3">
                  {leadTitle}
                </h2>
                <p className="text-gray-700 leading-relaxed">{leadBody}</p>
              </div>

              {/* Service Process */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  {stepsTitle}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {inspectionSteps.map((step, index) => (
                    <div
                      key={`${step.step}-${index}`}
                      className="bg-white border border-gray-200 p-6 rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {step.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-green-600" />
                  {serviceAreasTitle}
                </h3>
                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4">{serviceAreasIntro}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {serviceAreas.map((area, index) => (
                      <div
                        key={`${area}-${index}`}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {scopeTitle}
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {scopeItems.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    {speedTitle}
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {speedItems.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {ctaTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">{ctaBody}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => window.open(telHref)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Randevu Al: {phoneDisplay}
                  </Button>
                  <Button
                    onClick={() => window.open(whatsappUrl)}
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    WhatsApp ile Randevu
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  {infoTitle}
                </h3>
                <p className="text-blue-700 leading-relaxed">{infoBody}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Button
            onClick={() => onNavigate("cemeteries")}
            variant="outline"
            className="h-auto p-4 text-left border-green-500 text-green-600 hover:bg-green-50"
          >
            <div>
              <h4 className="font-semibold mb-1">Mezarlık Listesi</h4>
              <p className="text-sm text-gray-600">
                İstanbul mezarlıklarının listesi
              </p>
            </div>
          </Button>
          <Button
            onClick={() => onNavigate("models")}
            variant="outline"
            className="h-auto p-4 text-left border-green-500 text-green-600 hover:bg-green-50"
          >
            <div>
              <h4 className="font-semibold mb-1">Mezar Modelleri</h4>
              <p className="text-sm text-gray-600">
                Tüm mezar modellerimizi inceleyin
              </p>
            </div>
          </Button>
          <Button
            onClick={() => onNavigate("pricing")}
            variant="outline"
            className="h-auto p-4 text-left border-green-500 text-green-600 hover:bg-green-50"
          >
            <div>
              <h4 className="font-semibold mb-1">Fiyat Listesi</h4>
              <p className="text-sm text-gray-600">
                Güncel fiyatları görüntüleyin
              </p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
