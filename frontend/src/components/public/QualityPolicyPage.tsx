// =============================================================
// FILE: src/pages/QualityPolicyPage.tsx
// X Emlak theme: bg-slate-950
// DB-first: custom_pages by slug+locale; fallback HTML if empty.
// Sidebar: slate theme + settings-driven tel/whatsapp.
// =============================================================
"use client";

import * as React from "react";
import { useGetCustomPageBySlugQuery } from "@/integrations/rtk/endpoints/custom_pages.endpoints";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

import backgroundImage from "figma:asset/2756699d70cd757056d783eb9a7f34264d5bc04d.png";

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

export function QualityPolicyPage({ onNavigate, locale = "tr" }: QualityPolicyPageProps) {
  const { data, isFetching, isError } = useGetCustomPageBySlugQuery({
    locale,
    slug: "quality-policy",
  });

  // settings: brand + contact + hero override (opsiyonel)
  const { data: settingsRes } = useListSiteSettingsQuery({
    keys: [
      "brand_name",
      "contact_phone_display",
      "contact_phone_tel",
      "contact_whatsapp_link",

      // opsiyonel sayfa metinleri/görseli
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

  const heroImage = safeJson<string>(settings["quality_policy_page_hero_image"], "") || backgroundImage;

  // DB content "string" (Tailwind sınıfları içerebilir). Boş ise fallback.
  const html =
    typeof data?.content === "string" && data.content.trim().length > 0
      ? data.content
      : "";

  const breadcrumb = `Anasayfa / ${title}`;

  const lead =
    safeJson<string>(
      settings["quality_policy_page_lead"],
      `${brandName} olarak müşterilerimize kalite odaklı, şeffaf ve sürdürülebilir bir hizmet standardı sunarız.`,
    );

  // contact CTA
  const contactPhoneDisplay = safeJson<string>(settings["contact_phone_display"], "+49 000 000000");
  const contactPhoneRaw = safeJson<string>(settings["contact_phone_tel"], contactPhoneDisplay);

  const telHref = buildTelHref(contactPhoneRaw);
  const waHref =
    safeJson<string>(settings["contact_whatsapp_link"], "") || buildWhatsappHref(contactPhoneRaw);

  const waMessage = "Merhaba, kalite politikası ve hizmet standartları hakkında bilgi almak istiyorum.";
  const waHrefWithText =
    waHref.includes("?") ? `${waHref}&text=${encodeURIComponent(waMessage)}` : `${waHref}?text=${encodeURIComponent(waMessage)}`;

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
                <span className="font-semibold">{title}</span>
              </nav>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                {title}
              </h1>

              <p className="text-base md:text-lg text-white/80">
                {breadcrumb}
              </p>
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
                  <div className="w-full h-48 md:h-64 bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center border border-slate-200">
                    <img
                      src="/mezartasi.png"
                      alt={`${brandName} – marka görseli`}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
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
                        İletişim: <span className="font-semibold text-white/80">{contactPhoneDisplay}</span>
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
