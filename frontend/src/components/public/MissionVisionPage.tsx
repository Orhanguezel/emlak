// =============================================================
// FILE: src/components/public/MissionVisionPage.tsx
// DB-first (NO fallback) — X Emlak slate theme (bg-slate-950)
// Fixes:
// - remove hardcoded /mezartasi.png fallback image
// - support DB content as JSON_OBJECT('html',...) / JSON-string / raw HTML
// - add minimal CSS fallbacks for Tailwind-like classes in DB HTML (purge/JIT)
// =============================================================
"use client";

import * as React from "react";
import backgroundImage from "figma:asset/b107ffe2a64e8432874267abb6c79d28b131e216.png";

import { useGetCustomPageBySlugQuery } from "@/integrations/rtk/endpoints/custom_pages.endpoints";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

type SiteSettingLike = { key?: string; name?: string; value?: any };

interface MissionVisionPageProps {
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

export function MissionVisionPage({ onNavigate }: MissionVisionPageProps) {
  const { data: page, isLoading, isError, isFetching } = useGetCustomPageBySlugQuery({
    slug: "misyon-vizyon",
  });

  const { data: settingsRes } = useListSiteSettingsQuery({
    keys: [
      "brand_name",

      // contact
      "contact_phone_display",
      "contact_phone_tel",
      "contact_whatsapp_link",

      // brand visuals (opsiyonel)
      "brand_logo_url",
      "brand_logo",
      "brand_image_url",
      "brand_image",
      "brand_logo_alt",

      // opsiyonel hero override
      "mission_vision_page_title",
      "mission_vision_page_breadcrumb",
      "mission_vision_page_hero_title",
      "mission_vision_page_hero_image",

      // opsiyonel sağ blok metinleri
      "mission_vision_sidebar_title",
      "mission_vision_sidebar_subtitle",
    ],
  });

  const settings = React.useMemo(() => toSettingsMap(settingsRes), [settingsRes]);

  const brandName = safeJson<string>(settings["brand_name"], "X Emlak");

  const title =
    (page?.title && String(page.title)) ||
    safeJson<string>(settings["mission_vision_page_title"], "Misyon & Vizyon");

  const heroTitle =
    (page?.meta_title && String(page.meta_title)) ||
    safeJson<string>(settings["mission_vision_page_hero_title"], title);

  const breadcrumb = safeJson<string>(
    settings["mission_vision_page_breadcrumb"],
    `Anasayfa / ${title}`,
  );

  const heroImageSetting = safeJson<string>(settings["mission_vision_page_hero_image"], "").trim();
  const heroImage = heroImageSetting || backgroundImage;

  // Contact CTA (settings)
  const contactPhoneDisplay = safeJson<string>(settings["contact_phone_display"], "+49 000 000000");
  const contactPhoneRaw = safeJson<string>(settings["contact_phone_tel"], contactPhoneDisplay);
  const telHref = buildTelHref(contactPhoneRaw);

  const waHref =
    safeJson<string>(settings["contact_whatsapp_link"], "").trim() || buildWhatsappHref(contactPhoneRaw);

  // Sol içerik: DB HTML (string/JSON)
  const html = extractHtmlFromContent((page as any)?.content);
  const hasDbHtml = html.trim().length > 0;

  // Sağ blok: sabit değer kartları
  const valueCards = [
    { id: "trust", icon: "🏠", title: "Güven", subtitle: "Şeffaf süreç" },
    { id: "speed", icon: "⚡", title: "Hız", subtitle: "Hızlı dönüş" },
    { id: "quality", icon: "🧭", title: "Uzmanlık", subtitle: "Doğru yönlendirme" },
    { id: "support", icon: "🤝", title: "Destek", subtitle: "Süreç boyunca" },
  ] as const;

  const coreValues = [
    { title: "Şeffaflık", description: "Net bilgi, net süreç." },
    { title: "Doğruluk", description: "Güncel ve teyitli veriler." },
    { title: "Hızlı İletişim", description: "Kısa sürede geri dönüş." },
    { title: "Müşteri Odaklılık", description: "İhtiyaca uygun çözüm." },
  ] as const;

  const sidebarTitle = safeJson<string>(
    settings["mission_vision_sidebar_title"],
    "Bizimle İletişime Geçin",
  );
  const sidebarSubtitle = safeJson<string>(
    settings["mission_vision_sidebar_subtitle"],
    "İlan, yatırım veya danışmanlık için hızlıca ulaşın.",
  );

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
                <span className="font-semibold">{title}</span>
              </nav>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                {heroTitle}
              </h1>
              <p className="text-base md:text-lg text-white/80">
                {brandName} • {breadcrumb}
              </p>

              {(isLoading || isFetching) && (
                <div className="mt-6 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-white text-sm">
                  Yükleniyor…
                </div>
              )}
              {isError && (
                <div className="mt-6 inline-flex items-center rounded-md bg-red-500/20 px-3 py-1 text-white text-sm">
                  Sayfa içeriği yüklenemedi.
                </div>
              )}
            </div>

            {/* 3D Box - slate */}
            <div className="hidden lg:block">
              <div className="w-48 h-32 flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-20 bg-white/70 rounded-xl shadow-sm transform perspective-1000 rotate-y-12" />
                  <div className="absolute -top-2 left-2 w-32 h-6 bg-white/90 rounded-xl transform perspective-1000 rotate-x-45 shadow-sm" />
                  <div className="absolute top-0 -right-2 w-6 h-20 bg-white/60 rounded-xl transform perspective-1000 rotate-y-45 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-10 md:gap-12">
              {/* Sol (DB HTML only) */}
              <div className="lg:w-2/3">
                <style>{cmsFallbackCss}</style>

                {isLoading || isFetching ? (
                  <div className="space-y-4">
                    <div className="h-8 bg-slate-100 rounded animate-pulse" />
                    <div className="h-40 bg-slate-100 rounded animate-pulse" />
                    <div className="h-40 bg-slate-100 rounded animate-pulse" />
                  </div>
                ) : hasDbHtml ? (
                  <div className="cms-html" dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                    Henüz içerik yayınlanmadı.
                  </div>
                )}

                {isError && (
                  <p className="mt-4 text-sm text-amber-700">
                    İçerik alınamadı. Lütfen daha sonra tekrar deneyin.
                  </p>
                )}
              </div>

              {/* Sağ sidebar */}
              <div className="lg:w-1/3">
                <div className="lg:sticky lg:top-8">
                  {/* ✅ Brand: settings -> image, else monogram (NO mezar fallback) */}
                  <div className="mb-6">
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
                  </div>

                  {/* Value cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {valueCards.map((card) => (
                      <div
                        key={card.id}
                        className="bg-slate-950 text-white p-4 rounded-2xl text-center border border-white/10 shadow-sm hover:bg-slate-900 transition-colors"
                      >
                        <div className="text-2xl mb-2">{card.icon}</div>
                        <h4 className="text-xs uppercase tracking-wide text-white/90">
                          {card.title}
                        </h4>
                        <p className="text-xs mt-1 text-white/70">{card.subtitle}</p>
                      </div>
                    ))}
                  </div>

                  {/* Core values */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                    <h3 className="text-base md:text-lg font-extrabold mb-4 text-slate-950 flex items-center">
                      <span className="w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center mr-3 text-white text-sm">
                        ✓
                      </span>
                      Temel İlkelerimiz
                    </h3>

                    <ul className="space-y-3 text-sm text-slate-700">
                      {coreValues.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="w-2.5 h-2.5 bg-slate-950 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                          <span>
                            <strong>{item.title}</strong> {item.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact CTA */}
                  <div className="bg-slate-950 text-white p-6 rounded-2xl border border-white/10 shadow-sm">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">📩</span>
                      </div>
                      <h3 className="text-lg font-extrabold mb-2">{sidebarTitle}</h3>
                      <p className="text-sm text-white/80">{sidebarSubtitle}</p>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={telHref}
                        className="w-full bg-white text-slate-950 px-4 py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 font-semibold hover:bg-slate-50"
                      >
                        <span>📞</span> <strong>{contactPhoneDisplay}</strong>
                      </a>

                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 font-semibold hover:bg-slate-800 border border-white/10"
                      >
                        <span>💬</span> <strong>WhatsApp</strong>
                      </a>

                      <button
                        onClick={() => onNavigate("contact")}
                        className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 font-semibold hover:bg-slate-800 border border-white/10"
                      >
                        <span>📋</span> <strong>İletişim Formu</strong>
                      </button>
                    </div>

                    <div className="mt-4 text-xs text-white/60 text-center">
                      Not: İletişim bilgileri site ayarlarından alınır.
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
