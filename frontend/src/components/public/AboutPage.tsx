// =============================================================
// FILE: src/components/public/AboutPage.tsx
// DB-first render; fallback: pageContent (stil aynı kalır)
// =============================================================
import { ImageWithFallback } from "../figma/ImageWithFallback";
import backgroundImage from "figma:asset/49bae4cd4b172781dc5d9ea5d642274ea5ea27b6.png";

// Statik fallback veriler
import { getAboutPageData } from "../../data/pageContent";

// RTK – custom_pages
import { useGetCustomPageBySlugQuery } from "@/integrations/rtk/endpoints/custom_pages.endpoints";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const fallback = getAboutPageData();
  // DB’den sayfa (slug: hakkimizda)
  const { data: page, isLoading, isError, isFetching } =
    useGetCustomPageBySlugQuery({ slug: "hakkimizda" });

  const pageTitle = page?.title || fallback.title;
  const heroTitle = page?.meta_title || fallback.heroTitle;
  const breadcrumb = fallback.breadcrumb;

  // DB yoksa fallback paragrafları HTML’e çevir
  const fallbackHtml =
    `<div class="space-y-4 md:space-y-5">` +
    fallback.mainContent.paragraphs.map((p) => `<p>${p}</p>`).join("") +
    `</div>`;

  const htmlContent = (page?.content && String(page.content)) || fallbackHtml;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="relative bg-teal-500 py-12 md:py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-teal-500 bg-opacity-90"></div>
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <nav className="flex items-center space-x-2 text-sm mb-4">
                <button
                  onClick={() => onNavigate("home")}
                  className="hover:text-teal-200 transition-colors"
                >
                  Anasayfa
                </button>
                <span>&gt;</span>
                <span>{pageTitle}</span>
              </nav>
              <h1 className="text-2xl md:text-4xl mb-2">{heroTitle}</h1>
              <p className="text-base md:text-lg opacity-90">{breadcrumb}</p>
            </div>

            {/* 3D kutu */}
            <div className="hidden xl:block">
              <div className="w-40 h-24 md:w-48 md:h-32 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <div className="w-24 h-16 md:w-32 md:h-20 bg-white rounded transform perspective-1000 rotate-y-12 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
              {/* Sol */}
              <div className="lg:w-2/3">
                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl text-teal-500 mb-6">
                    {fallback.mainContent.title}
                  </h2>

                  {/* DB HTML (varsa) ya da fallback paragraflar */}
                  <div
                    className="prose prose-teal max-w-none text-gray-700 leading-relaxed text-sm md:text-base"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />


                  {/* Popüler linkler (statik fallback içeriği) */}
                  <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-base md:text-lg mb-4 text-gray-800">
                      {fallback.popularServices.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                      {fallback.popularServices.items.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => onNavigate(item.link)}
                          className="text-teal-500 hover:text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-lg text-xs md:text-sm transition-colors text-left"
                        >
                          {item.icon} {item.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {(isLoading || isFetching) && (
                  <div className="text-xs text-gray-500 mt-2">Yükleniyor…</div>
                )}
                {isError && (
                  <div className="text-xs text-red-600 mt-2">
                    Sayfa içeriği yüklenemedi (fallback gösteriliyor).
                  </div>
                )}
              </div>

              {/* Sağ */}
              <div className="lg:w-1/3">
                <div className="lg:sticky lg:top-8">
                  {/* Sağ üstteki boş çerçeve içine logo */}
                  <div className="w-full h-48 md:h-64 bg-white rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
                    <img
                      src="/mezartasi.png"            // public/mezartasi.png
                      alt="Mezartaşı – marka görseli"
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  </div>


                  <div className="bg-teal-50 p-4 md:p-6 rounded-lg mt-6">
                    <h3 className="text-base md:text-lg mb-4 text-teal-700">
                      {fallback.sidebarServices.title}
                    </h3>
                    <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
                      {fallback.sidebarServices.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>{item.title}</strong> - {item.description}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Contact CTA */}
                    <div className="mt-4 md:mt-6 pt-4 border-t border-teal-200">
                      <p className="text-xs text-gray-600 mb-3">
                        <strong>{fallback.contactInfo.message}</strong>
                      </p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            window.open(
                              `tel:+90${fallback.contactInfo.phone.replace(/\s/g, "")}`
                            )
                          }
                          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm transition-colors"
                        >
                          📞 {fallback.contactInfo.phone}
                        </button>
                        <button
                          onClick={() => {
                            window.open(
                              `https://wa.me/90${fallback.contactInfo.phone.replace(
                                /\s/g,
                                ""
                              )}?text=${encodeURIComponent(
                                fallback.contactInfo.whatsappMessage
                              )}`,
                              "_blank"
                            );
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm transition-colors"
                        >
                          💬 WhatsApp'tan Yazın
                        </button>
                      </div>
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
