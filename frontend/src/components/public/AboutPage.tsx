// =============================================================
// FILE: src/components/public/AboutPage.tsx
// DB-first render (NO fallback)
// X Emlak style: bg-slate-950 hakim
// =============================================================
"use client";

import * as React from "react";
import backgroundImage from "figma:asset/49bae4cd4b172781dc5d9ea5d642274ea5ea27b6.png";

import { useGetCustomPageBySlugQuery } from "@/integrations/rtk/endpoints/custom_pages.endpoints";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

type SiteSettingLike = { key?: string; name?: string; value?: any };

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

function safeJson<T>(v: any, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === "object") return v as T;
  if (typeof v !== "string") return fallback;

  const s = v.trim();
  if (!s) return fallback;

  try {
    return JSON.parse(s) as T;
  } catch {
    try {
      const unquoted = JSON.parse(s);
      if (typeof unquoted === "string") {
        try {
          return JSON.parse(unquoted) as T;
        } catch {
          return unquoted as unknown as T;
        }
      }
      return unquoted as unknown as T;
    } catch {
      return fallback;
    }
  }
}

function toSettingsMap(data: unknown): Record<string, any> {
  if (!data) return {};
  const normalized = (data as any)?.data ?? data;

  if (Array.isArray(normalized)) {
    const m: Record<string, any> = {};
    for (const it of normalized as SiteSettingLike[]) {
      const k = String(it?.key ?? it?.name ?? "").trim();
      if (!k) continue;
      m[k] = it?.value;
    }
    return m;
  }

  if (typeof normalized === "object") return normalized as Record<string, any>;
  return {};
}

function sanitizePhoneDigits(s: string): string {
  return (s || "").replace(/[^\d+]/g, "").replace(/\s+/g, "");
}

function buildTelHref(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "tel:+49000000000";
  if (trimmed.startsWith("tel:")) return trimmed;

  const cleaned = sanitizePhoneDigits(trimmed);
  if (!cleaned) return "tel:+49000000000";
  if (cleaned.startsWith("+")) return `tel:${cleaned}`;
  return `tel:+${cleaned}`;
}

function buildWhatsappHref(raw: string): string {
  const cleaned = sanitizePhoneDigits(raw).replace(/^\+/, "");
  if (!cleaned) return "https://wa.me/49000000000";
  return `https://wa.me/${cleaned}`;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  // DB page (slug: hakkimizda)
  const {
    data: page,
    isLoading: pageLoading,
    isFetching: pageFetching,
    isError: pageError,
  } = useGetCustomPageBySlugQuery({ slug: "hakkimizda" });

  // Site settings: brand + contact + about hero
  const { data: settingsRes } = useListSiteSettingsQuery({
    keys: [
      "brand_name",
      "contact_phone_display",
      "contact_phone_tel",
      "contact_whatsapp_link",
      "contact_address",
      "contact_map_open_url",

      // about page meta
      "about_page_title",
      "about_page_breadcrumb",
      "about_page_hero_title",
      "about_page_lead_body",
      "about_page_hero_image",
    ],
  });

  const settings = React.useMemo(() => toSettingsMap(settingsRes), [settingsRes]);

  const brandName = safeJson<string>(settings["brand_name"], "X Emlak");

  // Title / hero / breadcrumb (öncelik: custom_pages -> settings -> default)
  const pageTitle =
    (page?.title && String(page.title)) ||
    safeJson<string>(settings["about_page_title"], "Hakkımızda");

  const heroTitle =
    (page?.meta_title && String(page.meta_title)) ||
    safeJson<string>(settings["about_page_hero_title"], pageTitle);

  const breadcrumbText = safeJson<string>(
    settings["about_page_breadcrumb"],
    "Kurumsal"
  );

  const leadBody = safeJson<string>(
    settings["about_page_lead_body"],
    ""
  );

  const heroImage = safeJson<string>(settings["about_page_hero_image"], "") || backgroundImage;

  const htmlContent = page?.content ? String(page.content) : "";

  const contactPhoneDisplay = safeJson<string>(
    settings["contact_phone_display"],
    "+49 000 000000"
  );
  const contactPhoneRaw = safeJson<string>(
    settings["contact_phone_tel"],
    contactPhoneDisplay
  );

  const telHref = buildTelHref(contactPhoneRaw);

  const waHref =
    safeJson<string>(settings["contact_whatsapp_link"], "") ||
    buildWhatsappHref(contactPhoneRaw);

  const contactAddress = safeJson<string>(settings["contact_address"], "");
  const mapOpenUrl =
    safeJson<string>(settings["contact_map_open_url"], "") ||
    (contactAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress)}`
      : "");

  const loading = pageLoading || pageFetching;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div
        className="relative py-14 md:py-20 bg-slate-950 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="relative container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between gap-6">
            <div className="text-white">
              <nav className="flex items-center space-x-2 text-sm mb-4 opacity-90">
                <button
                  onClick={() => onNavigate("home")}
                  className="hover:text-slate-200 transition-colors"
                >
                  Anasayfa
                </button>
                <span>/</span>
                <span className="font-semibold">{pageTitle}</span>
              </nav>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                {heroTitle}
              </h1>

              <p className="text-base md:text-lg text-white/80">
                {brandName} • {breadcrumbText}
              </p>

              {leadBody ? (
                <p className="mt-3 text-sm md:text-base text-white/70 max-w-2xl">
                  {leadBody}
                </p>
              ) : null}

              {loading && (
                <div className="mt-6 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-white text-sm">
                  Yükleniyor…
                </div>
              )}

              {pageError && (
                <div className="mt-6 inline-flex items-center rounded-md bg-red-500/20 px-3 py-1 text-white text-sm">
                  İçerik yüklenemedi.
                </div>
              )}
            </div>

            {/* Sağdaki dekor kutu */}
            <div className="hidden xl:block">
              <div className="w-44 h-28 md:w-56 md:h-36 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                <div className="w-28 h-18 md:w-36 md:h-24 bg-white/90 rounded-xl shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
              {/* Sol */}
              <div className="lg:w-2/3">
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-950 mb-6">
                  {pageTitle}
                </h2>

                {loading ? (
                  <div className="space-y-3">
                    <div className="h-5 bg-slate-100 rounded animate-pulse" />
                    <div className="h-5 bg-slate-100 rounded animate-pulse" />
                    <div className="h-5 bg-slate-100 rounded animate-pulse" />
                    <div className="h-24 bg-slate-100 rounded animate-pulse" />
                  </div>
                ) : htmlContent ? (
                  <div
                    className="prose max-w-none text-slate-700 leading-relaxed text-sm md:text-base"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                    İçerik hazırlanıyor. Lütfen daha sonra tekrar ziyaret edin.
                  </div>
                )}
              </div>

              {/* Sağ */}
              <div className="lg:w-1/3">
                <div className="lg:sticky lg:top-8">
                  {/* Marka görseli */}
                  <div className="w-full h-48 md:h-64 bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center border border-slate-200">
                    <img
                      src="/mezartasi.png"
                      alt={`${brandName} – marka görseli`}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* İletişim kartı */}
                  <div className="bg-slate-50 p-5 md:p-6 rounded-2xl mt-6 border border-slate-200">
                    <h3 className="text-base md:text-lg font-extrabold mb-4 text-slate-950">
                      İletişim
                    </h3>

                    {contactAddress ? (
                      <div className="text-xs md:text-sm text-slate-700 mb-4">
                        <div className="font-semibold text-slate-900 mb-1">Adres</div>
                        <div className="whitespace-pre-wrap">{contactAddress}</div>
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-2">
                      <a
                        href={telHref}
                        className="bg-slate-950 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs md:text-sm transition-colors text-center font-semibold"
                      >
                        📞 {contactPhoneDisplay}
                      </a>

                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-slate-50 text-slate-950 px-4 py-2 rounded-xl text-xs md:text-sm transition-colors text-center font-semibold border border-slate-300"
                      >
                        💬 WhatsApp’tan Yazın
                      </a>

                      {!!mapOpenUrl && (
                        <a
                          href={mapOpenUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-950 hover:underline text-xs md:text-sm text-center font-semibold"
                        >
                          📍 Haritada Aç
                        </a>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                      Not: Bu alanlar site_settings üzerinden yönetilir.
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
