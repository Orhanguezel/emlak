// -------------------------------------------------------------
// FILE: src/components/public/ContactPage.tsx
// -------------------------------------------------------------
"use client";

import * as React from "react";
import backgroundImage from "figma:asset/0a9012ca17bfb48233c0877277b7fb8427a12d4c.png";

import { toast } from "sonner";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { useCreateContactMutation } from "@/integrations/rtk/endpoints/contacts.endpoints";
import type { ContactCreateInput } from "@/integrations/rtk/types/contacts";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string; // honeypot
};

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

/**
 * tel: formatı üretir:
 * - "+49 123" => tel:+49123
 * - "tel:+49..." => aynen döner
 * - "0533..." gibi yerel => tel:+<digits> (başına + ekler)
 */
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

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = React.useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "",
  });

  const [createContact, { isLoading }] = useCreateContactMutation();

  const { data: settingsRes } = useListSiteSettingsQuery({
    keys: [
      "brand_name",
      "contact_phone_display",
      "contact_phone_tel",
      "contact_email",
      "contact_address",
      "contact_whatsapp_link",

      // harita
      "contact_map_embed_url",
      "contact_map_open_url",

      // (opsiyonel) UI metinleri
      "contact_page_title",
      "contact_page_lead",
      "contact_page_hero_image",
    ],
  });

  const settings = React.useMemo(() => toSettingsMap(settingsRes), [settingsRes]);

  const brandName = safeJson<string>(settings["brand_name"], "X Emlak");

  const pageTitle = safeJson<string>(settings["contact_page_title"], "Bize Ulaşın");
  const pageLead = safeJson<string>(
    settings["contact_page_lead"],
    "Daha fazla bilgi almak veya randevu oluşturmak için bizimle iletişime geçin.",
  );

  const heroImage = safeJson<string>(settings["contact_page_hero_image"], "");

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();
    const websiteTrim = formData.website.trim();

    if (!name || !email || !phone || !subject || !message) {
      toast.error("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    if (message.length < 10) {
      toast.error("Mesajınız en az 10 karakter olmalıdır.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    const basePayload = { name, email, phone, subject, message };

    const payload: ContactCreateInput = websiteTrim
      ? ({ ...basePayload, website: websiteTrim } as ContactCreateInput)
      : (basePayload as ContactCreateInput);

    try {
      await createContact(payload).unwrap();
      toast.success("Mesajınız gönderildi. En kısa sürede dönüş yapacağız.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
    } catch (err: any) {
      // Zod body hatası (backend sözleşmene göre uyarlayabilirsin)
      if (err?.status === 400 && (err?.data?.error === "INVALID_BODY" || err?.data?.error?.message === "invalid_body")) {
        const fieldErrors =
          (err?.data?.details?.fieldErrors as Record<string, string[]>) ||
          (err?.data?.error?.issues?.fieldErrors as Record<string, string[]>);

        const firstError = fieldErrors && Object.values(fieldErrors).flat()[0];
        toast.error(firstError ?? "Form alanlarını kontrol edin ve tekrar deneyin.");
        return;
      }

      const code =
        typeof err?.data?.error === "string"
          ? err.data.error
          : typeof err?.error === "string"
            ? err.error
            : null;

      toast.error(
        code
          ? `Mesaj gönderilirken bir hata oluştu (${code}).`
          : "Mesaj gönderilirken bir hata oluştu.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div
        className="relative py-14 md:py-20 bg-slate-950 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage || backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="relative container mx-auto px-4 max-w-7xl">
          <div className="text-white">
            <nav className="flex items-center space-x-2 text-sm mb-4 opacity-90">
              <button
                onClick={() => onNavigate("home")}
                className="hover:text-slate-200 transition-colors"
              >
                Anasayfa
              </button>
              <span>/</span>
              <span className="font-semibold">İletişim</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              {pageTitle}
            </h1>
            <p className="text-base md:text-lg text-white/80">{pageLead}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Left - Contact info */}
            <div className="space-y-6 md:space-y-8">
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">{brandName}</h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <span>🏢</span>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Şirket</div>
                      <div className="font-semibold text-slate-900">{brandName}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <span>📍</span>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Adres</div>
                      <div className="text-slate-800 whitespace-pre-wrap">{contactAddress}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <span>✉️</span>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">E-posta</div>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="font-semibold text-slate-900 hover:underline break-all"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <span>📞</span>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Telefon</div>
                      <a href={telHref} className="font-semibold text-slate-900 hover:underline">
                        {contactPhoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-200 flex flex-col gap-3">
                    <a
                      href={telHref}
                      className="w-full bg-slate-950 text-white px-6 py-3 rounded-xl hover:bg-slate-900 transition-colors text-center font-semibold"
                    >
                      Hemen Ara
                    </a>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white text-slate-950 px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors text-center font-semibold border border-slate-300"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Honeypot */}
                <div className="hidden">
                  <Label htmlFor="website" className="text-slate-700 mb-2 block">
                    Website
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={handleInputChange}
                    autoComplete="off"
                    tabIndex={-1}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="name" className="text-slate-700 mb-2 block">
                    Ad Soyad
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-slate-700 mb-2 block">
                    E-posta
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-slate-700 mb-2 block">
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-slate-700 mb-2 block">
                    Konu
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-slate-700 mb-2 block">
                    Mesaj
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="min-h-28 resize-none"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Gönderiliyor..." : "Mesaj Gönder"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-slate-950 py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-white mb-6 md:mb-8 text-center">
              Harita Üzerinde
            </h2>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-white/10">
              <div className="relative w-full h-72 md:h-96">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${brandName} Konum`}
                />
                <div className="absolute top-3 right-3">
                  <a
                    href={mapOpenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-950 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-slate-900 transition-colors text-xs md:text-sm border border-white/10"
                  >
                    Yol Tarifi / Büyük Görünüm
                  </a>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 border-t border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="text-base md:text-lg font-bold text-slate-900">{brandName}</div>
                    <div className="text-sm md:text-base text-slate-600">{contactAddress}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={mapOpenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-950 hover:underline text-sm font-semibold"
                    >
                      Haritada Aç
                    </a>
                    <button
                      onClick={() => onNavigate("faq")}
                      className="text-slate-950 hover:underline text-sm font-semibold text-left"
                    >
                      S.S.S.
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* /Map Card */}
          </div>
        </div>
      </div>
    </div>
  );
}
