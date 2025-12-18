// =============================================================
// FILE: src/components/public/AboutPage.tsx
// DB-first render (NO hardcode fallback image)
// X Emlak style: bg-slate-950 hakim
// Fixes:
// - remove hardcoded /mezartasi.png
// - support DB content as JSON_OBJECT('html',...) / JSON-string / raw HTML
// - add minimal CSS fallbacks for Tailwind-like classes in DB HTML (purge/JIT)
// - hero image style only if available
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

function extractHtmlFromContent(v: unknown): string {
  if (!v) return "";

  if (typeof v === "object") {
    const html = (v as any)?.html;
    return typeof html === "string" ? html : "";
  }

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return "";

    if (s.startsWith("{") || s.startsWith("[")) {
      const obj = safeJson<any>(s, null);
      const html = obj?.html;
      if (typeof html === "string" && html.trim()) return html.trim();
    }

    return s;
  }

  return "";
}

function initials(name: string): string {
  const s = (name || "").trim();
  if (!s) return "XE";
  const parts = s.split(/\s+/g).filter(Boolean);
  const a = parts[0]?.[0] ?? "X";
  const b = (parts[1]?.[0] ?? parts[0]?.[1] ?? "E") as string;
  return (a + b).toUpperCase();
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  // DB page (slug: hakkimizda)
  const {
    data: page,
    isLoading: pageLoading,
    isFetching: pageFetching,
    isError: pageError,
  } = useGetCustomPageBySlugQuery({ slug: "hakkimizda" });

  // Site settings: brand + contact + about hero + brand visuals
  const { data: settingsRes } = useListSiteSettingsQuery({
    keys: [
      "brand_name",

      // brand visuals (opsiyonel)
      "brand_logo_url",
      "brand_logo",
      "brand_image_url",
      "brand_image",
      "brand_logo_alt",

      // contact
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

  const breadcrumbText = safeJson<string>(settings["about_page_breadcrumb"], "Kurumsal");

  const leadBody = safeJson<string>(settings["about_page_lead_body"], "");

  const heroImageSetting = safeJson<string>(settings["about_page_hero_image"], "").trim();
  const heroImage = heroImageSetting || backgroundImage;

  // ✅ DB HTML parse (JSON/raw)
  const htmlContent = extractHtmlFromContent((page as any)?.content);

  const contactPhoneDisplay = safeJson<string>(settings["contact_phone_display"], "+49 000 000000");
  const contactPhoneRaw = safeJson<string>(settings["contact_phone_tel"], contactPhoneDisplay);
  const telHref = buildTelHref(contactPhoneRaw);

  const waHref =
    safeJson<string>(settings["contact_whatsapp_link"], "").trim() ||
    buildWhatsappHref(contactPhoneRaw);

  const contactAddress = safeJson<string>(settings["contact_address"], "");
  const mapOpenUrl =
    safeJson<string>(settings["contact_map_open_url"], "").trim() ||
    (contactAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress)}`
      : "");

  const loading = pageLoading || pageFetching;

  // ✅ sidebar brand image (NO hardcoded mezar fallback)
  const brandLogo =
    safeJson<string>(settings["brand_logo_url"], "").trim() ||
    safeJson<string>(settings["brand_logo"], "").trim() ||
    safeJson<string>(settings["brand_image_url"], "").trim() ||
    safeJson<string>(settings["brand_image"], "").trim();

  const brandLogoAlt = safeJson<string>(settings["brand_logo_alt"], `${brandName} – Logo`);

  // ✅ CSS fallbacks for DB HTML (Tailwind purge/JIT fix)
  const cmsFallbackCss = React.useMemo(
    () => `
      .cms-html { color: #0f172a; }
      .cms-html h1 { font-size: 1.875rem; line-height: 2.25rem; font-weight: 800; margin: 0 0 0.75rem; color: #0f172a; }
      .cms-html h2 { font-size: 1.5rem; line-height: 2rem; font-weight: 800; margin: 0 0 0.75rem; color: #0f172a; }
      .cms-html h3 { font-size: 1rem; line-height: 1.5rem; font-weight: 700; margin: 0 0 0.25rem; color: #0f172a; }
      .cms-html p { margin: 0 0 1rem; color: #334155; line-height: 1.75; }
      .cms-html ul { margin: 0.5rem 0 1rem; padding-left: 1.25rem; color: #334155; }
      .cms-html li { margin: 0.25rem 0; }

      /* minimal utility fallbacks used by seeds */
      .cms-html .text-white { color: #ffffff !important; }
      .cms-html .text-slate-700 { color: #334155 !important; }
      .cms-html .text-slate-900 { color: #0f172a !important; }
      .cms-html .text-blue-800 { color: #1e40af !important; }
      .cms-html .bg-white { background: #ffffff !important; }
      .cms-html .bg-slate-50 { background: #f8fafc !important; }
      .cms-html .bg-slate-100 { background: #f1f5f9 !important; }
      .cms-html .bg-slate-900 { background: #0f172a !important; }
      .cms-html .bg-blue-50 { background: #eff6ff !important; }
      .cms-html .bg-blue-600 { background: #2563eb !important; }
      .cms-html .bg-blue-700 { background: #1d4ed8 !important; }
      .cms-html .border { border-width: 1px; border-style: solid; border-color: #e2e8f0; }
      .cms-html .border-slate-200 { border-color: #e2e8f0 !important; }
      .cms-html .border-blue-200 { border-color: #bfdbfe !important; }
      .cms-html .border-l-4 { border-left-width: 4px !important; }
      .cms-html .border-blue-600 { border-color: #2563eb !important; }
      .cms-html .rounded-xl { border-radius: 0.75rem !important; }
      .cms-html .rounded-lg { border-radius: 0.5rem !important; }
      .cms-html .p-8 { padding: 2rem !important; }
      .cms-html .p-6 { padding: 1.5rem !important; }
      .cms-html .p-4 { padding: 1rem !important; }
      .cms-html .mb-8 { margin-bottom: 2rem !important; }
      .cms-html .mb-6 { margin-bottom: 1.5rem !important; }
      .cms-html .mb-4 { margin-bottom: 1rem !important; }
      .cms-html .grid { display: grid !important; }
      .cms-html .gap-6 { gap: 1.5rem !important; }
      .cms-html .gap-8 { gap: 2rem !important; }

      .cms-html .bg-gradient-to-r {
        background-image: linear-gradient(to right, #0f172a, #1d4ed8) !important;
        color: #fff !important;
      }
      .cms-html .bg-gradient-to-br {
        background-image: linear-gradient(135deg, #f8fafc, #eff6ff) !important;
      }
      .cms-html .bg-gradient-to-r p,
      .cms-html .bg-gradient-to-r h2,
      .cms-html .bg-slate-900 p,
      .cms-html .bg-slate-900 h2 { color: #fff !important; }
    `,
    [],
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div
        className="relative py-14 md:py-20 bg-slate-950 bg-cover bg-center"
        style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
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
                <style>{cmsFallbackCss}</style>

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
                  <div className="cms-html" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                    İçerik hazırlanıyor. Lütfen daha sonra tekrar ziyaret edin.
                  </div>
                )}
              </div>

              {/* Sağ */}
              <div className="lg:w-1/3">
                <div className="lg:sticky lg:top-8">
                  {/* ✅ Brand visual: settings -> image, else monogram (NO mezar fallback) */}
                  <div className="w-full h-48 md:h-64 bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center border border-slate-200">
                    {brandLogo ? (
                      <img
                        src={brandLogo}
                        alt={brandLogoAlt}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <div className="w-20 h-20 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-2xl font-extrabold">
                          {initials(brandName)}
                        </div>
                      </div>
                    )}
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
