// =============================================================
// FILE: src/components/public/FAQPage.tsx   (X Emlak)
// NO fallback (DB-first)
// =============================================================
"use client";

import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

import { useListFaqsQuery } from "@/integrations/rtk/endpoints/faqs.endpoints";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

import type { Faq } from "@/integrations/rtk/types/faqs";

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

type FaqLike = Partial<Faq> & { question: string; answer: string };
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

function toBool(v: any, fallback = true): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "1" || s === "true" || s === "yes") return true;
    if (s === "0" || s === "false" || s === "no") return false;
  }
  return fallback;
}

function toNumber(v: any, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeFaqs(list: FaqLike[]): Faq[] {
  return list.map((item, i) => {
    const slug =
      item.slug ??
      item.question
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 80);

    const base: Omit<Faq, "created_at" | "updated_at"> = {
      id: item.id ?? `faq-${i}`,
      slug: slug || `faq-${i}`,
      question: item.question,
      answer: item.answer,
      category: typeof item.category === "string" ? item.category : null,
      is_active: toBool(item.is_active, true),
      display_order: toNumber(item.display_order, i + 1),
    };

    return {
      ...base,
      ...(typeof item.created_at === "string" ? { created_at: item.created_at } : {}),
      ...(typeof item.updated_at === "string" ? { updated_at: item.updated_at } : {}),
    };
  });
}

function sanitizePhoneDigits(s: string): string {
  return (s || "").replace(/[^\d+]/g, "").replace(/\s+/g, "");
}

function buildTelHref(raw: string): string {
  const trimmed = (raw || "").replace(/\s+/g, "");
  if (!trimmed) return "tel:+49000000000";
  if (trimmed.startsWith("tel:")) return trimmed;
  if (trimmed.startsWith("+")) return `tel:${trimmed}`;
  const digits = sanitizePhoneDigits(trimmed).replace(/^\+/, "");
  return `tel:+${digits || "49000000000"}`;
}

function buildWhatsappHref(raw: string): string {
  const digits = sanitizePhoneDigits(raw).replace(/^\+/, "");
  if (!digits) return "https://wa.me/49000000000";
  return `https://wa.me/${digits}`;
}

export function FAQPage({ onNavigate }: FAQPageProps) {
  const { data: faqsRes, isLoading, isError } = useListFaqsQuery({
    active: true,
    limit: 200,
    orderBy: "display_order",
    order: "asc",
  });

  const { data: settingsRes } = useListSiteSettingsQuery({
    keys: [
      "brand_name",
      "contact_phone_display",
      "contact_phone_tel",
      "contact_email",
      "contact_address",
      "contact_whatsapp_link",
      "faq_page_title",
      "faq_page_breadcrumb",
      "faq_page_lead_title",
      "faq_page_lead_body",
      "faq_page_hero_image",
      "contact_map_embed_url",
      "contact_map_open_url",
    ],
  });

  const settings = useMemo(() => toSettingsMap(settingsRes), [settingsRes]);

  const brandName = safeJson<string>(settings["brand_name"], "X Emlak");

  const pageTitle = safeJson<string>(settings["faq_page_title"], "Sık Sorulan Sorular");
  const breadcrumbTitle = safeJson<string>(settings["faq_page_breadcrumb"], "Sık Sorulan Sorular");
  const leadTitle = safeJson<string>(settings["faq_page_lead_title"], "Sık Sorulan Sorular");
  const leadBody = safeJson<string>(settings["faq_page_lead_body"], "En sık gelen soruları derledik.");

  const heroImage = safeJson<string>(settings["faq_page_hero_image"], "");

  const contactPhoneDisplay = safeJson<string>(settings["contact_phone_display"], "+49 000 000000");
  const contactPhoneRaw = safeJson<string>(settings["contact_phone_tel"], contactPhoneDisplay);
  const contactEmail = safeJson<string>(settings["contact_email"], "info@xemlak.com");
  const contactAddress = safeJson<string>(settings["contact_address"], "Grevenbroich, Deutschland");

  const telHref = buildTelHref(contactPhoneRaw);
  const waHref =
    safeJson<string>(settings["contact_whatsapp_link"], "") || buildWhatsappHref(contactPhoneRaw);

  const mapEmbedUrl =
    safeJson<string>(settings["contact_map_embed_url"], "") ||
    `https://maps.google.com/maps?q=${encodeURIComponent(contactAddress)}&output=embed&z=16`;

  const mapOpenUrl =
    safeJson<string>(settings["contact_map_open_url"], "") ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress)}`;

  // NO fallback: sadece API datası
  const source: FaqLike[] = useMemo(() => {
    const arr = Array.isArray(faqsRes) ? (faqsRes as FaqLike[]) : [];
    return arr;
  }, [faqsRes]);

  const faqs: Faq[] = useMemo(() => normalizeFaqs(source), [source]);

  const showEmpty = !isLoading && !isError && faqs.length === 0;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div
        className="relative py-16 md:py-20 bg-slate-950 bg-cover bg-center"
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
                <span className="font-semibold">{breadcrumbTitle}</span>
              </nav>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                {pageTitle}
              </h1>
              <p className="text-base md:text-lg text-white/80">
                {brandName} • {breadcrumbTitle}
              </p>

              {isLoading && (
                <div className="mt-6 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-white text-sm">
                  Yükleniyor…
                </div>
              )}
              {isError && (
                <div className="mt-6 inline-flex items-center rounded-md bg-red-500/20 px-3 py-1 text-white text-sm">
                  SSS verisi yüklenemedi.
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="w-48 h-32 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center ring-1 ring-white/20">
                  <span className="text-4xl text-white">?</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-950 mb-3">
                {leadTitle}
              </h2>
              <p className="text-slate-700 text-base md:text-lg">{leadBody}</p>
            </div>

            {/* FAQ Accordion / Empty */}
            <div className="mb-14">
              {showEmpty ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                  Henüz SSS içeriği yayınlanmadı.
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.id || faq.slug || `item-${index}`}
                      value={`item-${index}`}
                      className="border border-slate-200 rounded-xl px-4 bg-white"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="text-slate-950 font-semibold text-base">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="text-slate-700 leading-relaxed text-base">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>

            {/* Contact + Map */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-950 mb-6">{brandName}</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Map */}
                <div className="order-2 lg:order-1">
                  <div className="w-full h-64 rounded-xl shadow-sm overflow-hidden relative border border-slate-200 bg-white">
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="256"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${brandName} Konum`}
                    />
                    <div className="absolute top-2 right-2">
                      <a
                        href={mapOpenUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-slate-950 px-3 py-1 rounded-md shadow-sm hover:bg-slate-50 transition-colors text-xs border border-slate-200"
                      >
                        Büyük Görünüm
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="order-1 lg:order-2">
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-950">İletişim Bilgileri</h4>

                    <div className="flex items-start gap-3">
                      <span className="text-slate-950 mt-1">📍</span>
                      <div className="text-slate-700">
                        <div className="font-semibold">Adres</div>
                        <div className="whitespace-pre-wrap">{contactAddress}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-slate-950 mt-1">📞</span>
                      <div className="text-slate-700">
                        <div className="font-semibold">Telefon</div>
                        <a href={telHref} className="text-slate-950 font-bold hover:underline">
                          {contactPhoneDisplay}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-slate-950 mt-1">✉️</span>
                      <div className="text-slate-700">
                        <div className="font-semibold">E-posta</div>
                        <a
                          href={`mailto:${contactEmail}`}
                          className="text-slate-950 font-bold hover:underline"
                        >
                          {contactEmail}
                        </a>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                      <a
                        href={telHref}
                        className="bg-slate-950 text-white px-6 py-3 rounded-xl hover:bg-slate-900 transition-colors text-center font-semibold"
                      >
                        Hemen Ara
                      </a>

                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-slate-950 px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors text-center font-semibold border border-slate-300"
                      >
                        WhatsApp ile İletişim
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Contact + Map */}
          </div>
        </div>
      </div>
    </div>
  );
}
