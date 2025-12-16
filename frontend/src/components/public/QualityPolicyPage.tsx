// =============================================================
// FILE: src/pages/QualityPolicyPage.tsx
// =============================================================
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useGetCustomPageBySlugQuery } from "@/integrations/rtk/endpoints/custom_pages.endpoints";
import { PAGE_SLUGS } from "@/data/pageSlugs";
import { QUALITY_POLICY_HTML_FALLBACK } from "@/data/qualityPolicyFallback";

import backgroundImage from "figma:asset/2756699d70cd757056d783eb9a7f34264d5bc04d.png";
import qualityImage from "figma:asset/86ac622a937f78742905aa1b265687cf5a66c70f.png";

interface QualityPolicyPageProps {
  onNavigate: (page: string) => void;
  locale?: string;
}

export function QualityPolicyPage({ onNavigate, locale = "tr" }: QualityPolicyPageProps) {
  // ✅ Obje argüman ile sorgu (slug+locale)
  const { data, isFetching, isError } = useGetCustomPageBySlugQuery({
    slug: PAGE_SLUGS.qualityPolicy,
    locale,
  });

  // ✅ DB content "string" (Tailwind sınıfları içerir). Boş ise fallback.
  const html =
    typeof data?.content === "string" && data.content.trim().length > 0
      ? data.content
      : QUALITY_POLICY_HTML_FALLBACK;

  const title = data?.title || "Kalite Politikamız";
  const breadcrumb = `Anasayfa > ${title}`;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="relative bg-teal-500 py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-teal-500 bg-opacity-90" />
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <nav className="flex items-center space-x-2 text-sm mb-4">
                <button onClick={() => onNavigate("home")} className="hover:text-teal-200 transition-colors">
                  Anasayfa
                </button>
                <span>&gt;</span>
                <span>{title}</span>
              </nav>
              <h1 className="text-4xl mb-2">{title.toUpperCase()}</h1>
              <p className="text-lg opacity-90">{breadcrumb}</p>
            </div>

            {/* 3D Gear Illustration */}
            <div className="hidden lg:block">
              <div className="w-48 h-32 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-white rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-white rounded-full" />
                  </div>
                  <div className="absolute inset-0">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-4 bg-white"
                        style={{
                          top: "50%",
                          left: "50%",
                          transformOrigin: "50% 0",
                          transform: `translate(-50%, -40px) rotate(${i * 45}deg)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* /3D */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-teal-500 mb-4">{title.toUpperCase()}</h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                <strong>İstanbul'da mezar yapımı sektöründe kalite lideri</strong> olarak, <em>25 yıllık deneyimimizle</em> müşterilerimize <strong>A+ kalite garantisi</strong> sunuyoruz
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Sol: DB HTML (Tailwind sınıfları içerir). */}
              <div className="lg:w-2/3">
                {isFetching ? (
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-100 rounded animate-pulse" />
                    <div className="h-40 bg-gray-100 rounded animate-pulse" />
                    <div className="h-40 bg-gray-100 rounded animate-pulse" />
                  </div>
                ) : (
                  // Küçük scope class (isteğe bağlı)
                  <section className="cms-html" dangerouslySetInnerHTML={{ __html: html }} />
                )}
                {isError && (
                  <p className="mt-4 text-sm text-amber-600">
                    Canlı içerik yüklenemedi; yedek içerik gösteriliyor.
                  </p>
                )}
              </div>

              {/* Sağ sidebar */}
              <div className="lg:w-1/3">
                <div className="sticky top-8">
                  <div className="w-full h-48 md:h-64 bg-white rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
                    <img
                      src="/mezartasi.png"            // public/mezartasi.png
                      alt="Mezartaşı – marka görseli"
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg mt-6">
                    <h3 className="text-lg mb-4 text-gray-800 flex items-center">
                      <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-xs">📊</span>
                      Mezar Yapım Kalite Metrikleri
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-700">Müşteri Memnuniyeti</span>
                          <div className="text-xs text-gray-500">İstanbul mezar yapımı</div>
                        </div>
                        <span className="text-xl text-teal-600">98%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-700">Zamanında Teslimat</span>
                          <div className="text-xs text-gray-500">Söz verdiğimiz tarih</div>
                        </div>
                        <span className="text-xl text-blue-600">95%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-700">Kalite Kontrolü</span>
                          <div className="text-xs text-gray-500">Her proje kontrol</div>
                        </div>
                        <span className="text-xl text-green-600">100%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-700">Sektör Deneyimi</span>
                          <div className="text-xs text-gray-500">Mezar yapımı tecrübesi</div>
                        </div>
                        <span className="text-xl text-purple-600">25+ Yıl</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-700">Garanti Süresi</span>
                          <div className="text-xs text-gray-500">Tüm işçilik garantili</div>
                        </div>
                        <span className="text-xl text-orange-600">5 Yıl</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-xl shadow-lg mt-6">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">🛡️</span>
                      </div>
                      <h3 className="text-lg mb-2">5 Yıl Kalite Garantisi</h3>
                      <p className="text-sm opacity-90">
                        <strong>İstanbul mezar yapımında</strong> tüm işlerimizde <em>kalite garantisi</em> veriyoruz
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => window.open("tel:+905334838971")}
                        className="w-full bg-white text-orange-600 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <span>📞</span> <strong>Kalite Garantili Teklif</strong>
                      </button>
                      <button
                        onClick={() => {
                          const whatsappMessage = "Merhaba, kalite garantili mezar yapım hizmeti hakkında bilgi almak istiyorum.";
                          window.open(`https://wa.me/905334838971?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <span>💬</span> <strong>WhatsApp ile Bilgi Al</strong>
                      </button>
                      <button
                        onClick={() => onNavigate("contact")}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <span>📋</span> <strong>Detaylı Bilgi</strong>
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/30 text-center">
                      <p className="text-xs opacity-75">
                        💎 <strong>A+ Kalite Malzeme</strong> • ⚡ <strong>Hızlı Teslimat</strong> • 🏆 <strong>25 Yıl Deneyim</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Sağ */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
