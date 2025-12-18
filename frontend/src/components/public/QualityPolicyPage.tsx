// =============================================================
// FILE: src/pages/QualityPolicyPage.tsx
// X Emlak theme: bg-slate-950
// DB-first: custom_pages by slug+locale; fallback HTML if empty.
// Sidebar: slate theme + settings-driven tel/whatsapp.
// NOTE: DB HTML uses Tailwind-like classes; add CSS fallbacks to avoid purge/JIT issues.
// =============================================================
"use client";

import * as React from "react";
import { useGetCustomPageBySlugQuery } from "@/integrations/rtk/endpoints/custom_pages.endpoints";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

interface QualityPolicyPageProps {
  onNavigate: (page: string) => void;
  locale?: string;
}

type SiteSettingLike = { key?: string; name?: string; value?: any };

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
          return (unquoted as unknown) as T;
        }
      }
      return (unquoted as unknown) as T;
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

/**
 * ✅ content normalize:
 * - DB JSON_OBJECT('html', '...') => { html: "..." } (object)
 * - DB JSON string => "{\"html\":\"...\"}" (string)
 * - Direkt HTML => "<section>...</section>" (string)
 */
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

export function QualityPolicyPage({ onNavigate, locale = "tr" }: QualityPolicyPageProps) {
  const { data, isFetching, isError } = useGetCustomPageBySlugQuery({
    locale,
    slug: "kalite-politikamiz",
  });

  const { data: settingsRes } = useListSiteSettingsQuery({
    keys: [
      "brand_name",

      // contact
      "contact_phone_display",
      "contact_phone_tel",
      "contact_whatsapp_link",

      // brand visuals (opsiyonel) — varsa bunlardan birini kullan
      "brand_logo_url",
      "brand_logo",
      "brand_image_url",
      "brand_image",
      "brand_logo_alt",

      // page overrides
      "quality_policy_page_title",
      "quality_policy_page_hero_image",
      "quality_policy_page_lead",
    ],
  });

  const settings = React.useMemo(() => toSettingsMap(settingsRes), [settingsRes]);

  const brandName = safeJson<string>(settings["brand_name"], "X Emlak");

  const title =
    (data?.title && String(data.title)) ||
    safeJson<string>(settings["quality_policy_page_title"], "Kalite Politikamız");

  const heroImage = safeJson<string>(settings["quality_policy_page_hero_image"], "").trim();

  const breadcrumb = `Anasayfa / ${title}`;

  const lead = safeJson<string>(
    settings["quality_policy_page_lead"],
    `${brandName} olarak müşterilerimize kalite odaklı, şeffaf ve sürdürülebilir bir hizmet standardı sunarız.`,
  );

  // DB content parse
  const htmlFromDb = extractHtmlFromContent((data as any)?.content);

  const fallbackHtml = React.useMemo(
    () =>
      `
      <section>
        <h2>Kalite Politikamız</h2>
        <p>İçerik şu anda yüklenemedi. Lütfen daha sonra tekrar deneyin veya bizimle iletişime geçin.</p>
      </section>
    `.trim(),
    [],
  );

  const html = htmlFromDb || fallbackHtml;

  // contact CTA
  const contactPhoneDisplay = safeJson<string>(settings["contact_phone_display"], "+49 000 000000");
  const contactPhoneRaw = safeJson<string>(settings["contact_phone_tel"], contactPhoneDisplay);

  const telHref = buildTelHref(contactPhoneRaw);
  const waHref =
    safeJson<string>(settings["contact_whatsapp_link"], "").trim() || buildWhatsappHref(contactPhoneRaw);

  const waMessage = "Merhaba, kalite politikası ve hizmet standartları hakkında bilgi almak istiyorum.";
  const waHrefWithText = waHref.includes("?")
    ? `${waHref}&text=${encodeURIComponent(waMessage)}`
    : `${waHref}?text=${encodeURIComponent(waMessage)}`;

  // ✅ sidebar brand image (NO mezar fallback)
  const brandLogo =
    safeJson<string>(settings["brand_logo_url"], "").trim() ||
    safeJson<string>(settings["brand_logo"], "").trim() ||
    safeJson<string>(settings["brand_image_url"], "").trim() ||
    safeJson<string>(settings["brand_image"], "").trim();

  const brandLogoAlt = safeJson<string>(settings["brand_logo_alt"], `${brandName} – Logo`);

  // ✅ CSS fallbacks for DB HTML (Tailwind purge/JIT fix)
  const cmsFallbackCss = React.useMemo(
    () => `
      /* ---------- Base typography ---------- */
      .cms-html { color: #0f172a; }
      .cms-html section { max-width: 100%; }
      .cms-html h1 { font-size: 1.875rem; line-height: 2.25rem; font-weight: 800; margin: 0 0 0.75rem; color: #0f172a; }
      .cms-html h2 { font-size: 1.5rem; line-height: 2rem; font-weight: 800; margin: 0 0 0.75rem; color: #0f172a; }
      .cms-html h3 { font-size: 1rem; line-height: 1.5rem; font-weight: 700; margin: 0 0 0.25rem; color: #0f172a; }
      .cms-html p { margin: 0 0 1rem; color: #334155; line-height: 1.75; }
      .cms-html ul { margin: 0.5rem 0 1rem; padding-left: 1.25rem; color: #334155; }
      .cms-html li { margin: 0.25rem 0; }

      /* ---------- Utility fallbacks (minimal set used by seeds) ---------- */
      .cms-html .text-white { color: #ffffff !important; }
      .cms-html .text-white\\/95 { color: rgba(255,255,255,0.95) !important; }
      .cms-html .text-slate-700 { color: #334155 !important; }
      .cms-html .text-slate-900 { color: #0f172a !important; }
      .cms-html .text-blue-800 { color: #1e40af !important; }
      .cms-html .text-blue-600 { color: #2563eb !important; }
      .cms-html .text-yellow-700 { color: #a16207 !important; }
      .cms-html .text-yellow-800 { color: #854d0e !important; }

      .cms-html .bg-white { background: #ffffff !important; }
      .cms-html .bg-slate-50 { background: #f8fafc !important; }
      .cms-html .bg-slate-100 { background: #f1f5f9 !important; }
      .cms-html .bg-slate-900 { background: #0f172a !important; }
      .cms-html .bg-blue-50 { background: #eff6ff !important; }
      .cms-html .bg-blue-600 { background: #2563eb !important; }
      .cms-html .bg-blue-700 { background: #1d4ed8 !important; }
      .cms-html .bg-yellow-50 { background: #fefce8 !important; }

      .cms-html .border { border-width: 1px; border-style: solid; border-color: #e2e8f0; }
      .cms-html .border-slate-200 { border-color: #e2e8f0 !important; }
      .cms-html .border-blue-200 { border-color: #bfdbfe !important; }
      .cms-html .border-yellow-200 { border-color: #fde68a !important; }
      .cms-html .border-l-4 { border-left-width: 4px !important; }
      .cms-html .border-blue-600 { border-color: #2563eb !important; }
      .cms-html .border-slate-900 { border-color: #0f172a !important; }

      .cms-html .rounded-xl { border-radius: 0.75rem !important; }
      .cms-html .rounded-lg { border-radius: 0.5rem !important; }
      .cms-html .rounded { border-radius: 0.25rem !important; }

      .cms-html .p-8 { padding: 2rem !important; }
      .cms-html .p-6 { padding: 1.5rem !important; }
      .cms-html .p-4 { padding: 1rem !important; }
      .cms-html .mb-8 { margin-bottom: 2rem !important; }
      .cms-html .mb-6 { margin-bottom: 1.5rem !important; }
      .cms-html .mb-4 { margin-bottom: 1rem !important; }

      /* grid fallbacks */
      .cms-html .grid { display: grid !important; }
      .cms-html .gap-6 { gap: 1.5rem !important; }
      .cms-html .gap-8 { gap: 2rem !important; }

      /* gradient fallbacks */
      .cms-html .bg-gradient-to-r {
        background-image: linear-gradient(to right, #0f172a, #1d4ed8) !important;
      }
      .cms-html .bg-gradient-to-br {
        background-image: linear-gradient(135deg, #f8fafc, #eff6ff) !important;
      }
      .cms-html .from-slate-900 { --_from: #0f172a; }
      .cms-html .to-blue-700 { --_to: #1d4ed8; }

      /* ensure "taahhüt" block contrast even if classes are missing */
      .cms-html .bg-gradient-to-r,
      .cms-html .bg-slate-900 {
        color: #fff !important;
      }
      .cms-html .bg-gradient-to-r p,
      .cms-html .bg-slate-900 p,
      .cms-html .bg-gradient-to-r h2,
      .cms-html .bg-slate-900 h2 {
        color: #fff !important;
      }
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
                {title}
              </h1>

              <p className="text-base md:text-lg text-white/80">{breadcrumb}</p>
            </div>

            {/* 3D Gear Illustration - slate */}
            <div className="hidden lg:block">
              <div className="w-48 h-32 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-white/80 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-white/80 rounded-full" />
                  </div>
                  <div className="absolute inset-0">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-4 bg-white/80"
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
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 mb-3">
                {title}
              </h2>
              <p className="text-base md:text-lg text-slate-600 max-w-4xl mx-auto">
                {lead}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 md:gap-12">
              {/* Sol: DB HTML / fallback */}
              <div className="lg:w-2/3">
                {/* CSS fallback injection (sol içerik için) */}
                <style>{cmsFallbackCss}</style>

                {isFetching ? (
                  <div className="space-y-4">
                    <div className="h-8 bg-slate-100 rounded animate-pulse" />
                    <div className="h-40 bg-slate-100 rounded animate-pulse" />
                    <div className="h-40 bg-slate-100 rounded animate-pulse" />
                  </div>
                ) : (
                  <section className="cms-html" dangerouslySetInnerHTML={{ __html: html }} />
                )}

                {isError && (
                  <p className="mt-4 text-sm text-amber-700">
                    Canlı içerik yüklenemedi; yedek içerik gösteriliyor.
                  </p>
                )}
              </div>

              {/* Sağ sidebar */}
              <div className="lg:w-1/3">
                <div className="lg:sticky lg:top-8">
                  {/* ✅ Logo: settings'ten; yoksa mezar resmi yok, monogram var */}
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

                  {/* Metrikler - slate */}
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mt-6">
                    <h3 className="text-base md:text-lg font-extrabold mb-4 text-slate-900 flex items-center">
                      <span className="w-7 h-7 bg-slate-950 rounded-full flex items-center justify-center mr-3 text-white text-xs">
                        📊
                      </span>
                      Kalite Metrikleri
                    </h3>

                    <div className="space-y-3">
                      {[
                        { label: "Müşteri Memnuniyeti", sub: "Geri bildirim ortalaması", value: "98%" },
                        { label: "Zamanında Teslimat", sub: "Planlanan termin", value: "95%" },
                        { label: "Kalite Kontrol", sub: "Her işte kontrol", value: "100%" },
                        { label: "Deneyim", sub: "Sektör tecrübesi", value: "25+ Yıl" },
                        { label: "Garanti", sub: "İşçilik garantisi", value: "5 Yıl" },
                      ].map((m, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200"
                        >
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{m.label}</div>
                            <div className="text-xs text-slate-500">{m.sub}</div>
                          </div>
                          <div className="text-lg font-extrabold text-slate-950">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA - slate (no hardcode) */}
                  <div className="bg-slate-950 text-white p-6 rounded-2xl shadow-sm mt-6 border border-white/10">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">🛡️</span>
                      </div>
                      <h3 className="text-lg font-extrabold mb-2">Kalite Odaklı Hizmet</h3>
                      <p className="text-sm text-white/80">
                        Süreç, malzeme ve işçilikte standartlarımızı şeffaf şekilde uyguluyoruz.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={telHref}
                        className="w-full bg-white text-slate-950 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm flex items-center justify-center gap-2 font-semibold"
                      >
                        <span>📞</span> <strong>Hemen Ara</strong>
                      </a>

                      <a
                        href={waHrefWithText}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 font-semibold border border-white/10"
                      >
                        <span>💬</span> <strong>WhatsApp</strong>
                      </a>

                      <button
                        onClick={() => onNavigate("contact")}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 font-semibold border border-white/10"
                      >
                        <span>📋</span> <strong>Detaylı Bilgi</strong>
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 text-center">
                      <p className="text-xs text-white/70">
                        💎 <strong>A+ Malzeme</strong> • ⚡ <strong>Planlı Teslim</strong> • 🏆{" "}
                        <strong>Deneyimli Ekip</strong>
                      </p>
                      <p className="text-xs text-white/60 mt-1">
                        İletişim:{" "}
                        <span className="font-semibold text-white/80">{contactPhoneDisplay}</span>
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
