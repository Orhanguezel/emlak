// -------------------------------------------------------------
// FILE: src/.../ContactPage.tsx
// -------------------------------------------------------------
"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import backgroundImage from "figma:asset/0a9012ca17bfb48233c0877277b7fb8427a12d4c.png";

import { toast } from "sonner";

import { useCreateContactMutation } from "@/integrations/rtk/endpoints/contacts.endpoints";
import type { ContactCreateInput } from "@/integrations/rtk/types/contacts";
import {
  useListSiteSettingsQuery,
  type SiteSetting,
} from "@/integrations/rtk/endpoints/site_settings.endpoints";

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

function toSettingsMap(settings?: SiteSetting[]) {
  const map = new Map<string, unknown>();
  if (settings) {
    for (const s of settings) {
      map.set(s.key, s.value);
    }
  }
  return map;
}

const getStringFromSettings = (
  map: Map<string, unknown>,
  key: string,
  fallback: string
): string => {
  const v = map.get(key);
  return typeof v === "string" ? v : fallback;
};

/** 0 ile başlayan TR numarasını tel: için +90 formatına çevirir */
const toTelHref = (phoneRaw: string): string => {
  const clean = phoneRaw.replace(/\D/g, ""); // sadece rakam
  if (!clean) return "";
  const withoutZero = clean.startsWith("0") ? clean.slice(1) : clean;
  return `+90${withoutZero}`;
};

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

  // 🔽 site_settings'ten contact + brand + whatsapp (ve SMTP) ayarlarını çek
  const { data: settings } = useListSiteSettingsQuery({
    keys: [
      "brand_name",
      "contact_phone_display",
      "contact_phone_tel",
      "contact_email",
      "contact_address",
      "contact_whatsapp_link",
      // Bu üçü UI'da kullanılmıyor ama cache’te durması sorun değil
      "smtp_host",
      "smtp_port",
      "smtp_from_email",
    ],
  });

  const settingsMap = React.useMemo(() => toSettingsMap(settings), [settings]);

  const brandName = getStringFromSettings(
    settingsMap,
    "brand_name",
    "Mezarisim.com"
  );
  const contactPhoneDisplay = getStringFromSettings(
    settingsMap,
    "contact_phone_display",
    "0533 483 89 71"
  );
  const contactPhoneTel = getStringFromSettings(
    settingsMap,
    "contact_phone_tel",
    "05334838971"
  );
  const contactEmail = getStringFromSettings(
    settingsMap,
    "contact_email",
    "mezarisim.com@gmail.com"
  );
  const contactAddress = getStringFromSettings(
    settingsMap,
    "contact_address",
    "Hekimbaşı Mah. Yıldıztepe Cad. No:41 Ümraniye / İstanbul"
  );
  const contactWhatsappLink = getStringFromSettings(
    settingsMap,
    "contact_whatsapp_link",
    "https://wa.me/905334838971?text=Merhaba,%20mezar%20yapımı%20hakkında%20bilgi%20almak%20istiyorum."
  );

  const telHref = `tel:${toTelHref(contactPhoneTel)}`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Trimlenmiş değerler
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();
    const websiteTrim = formData.website.trim();

    // ✅ Basit FE validasyonu (backend 400 atmadan önce yakala)
    if (!name || !email || !phone || !subject || !message) {
      toast.error("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    if (message.length < 10) {
      toast.error("Mesajınız en az 10 karakter olmalıdır.");
      return;
    }

    // çok kaba email kontrolü (asıl kontrol backend'de)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    const basePayload = {
      name,
      email,
      phone,
      subject,
      message,
    };

    // website'i boşsa hiç gönderme (schema optional/nullable zaten destekliyor)
    const payload: ContactCreateInput = websiteTrim
      ? { ...basePayload, website: websiteTrim }
      : (basePayload as ContactCreateInput);

    try {
      const res = await createContact(payload).unwrap();
      console.log("Contact created:", res);

      toast.success(
        "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        website: "",
      });
    } catch (err: any) {
      console.error("Contact create error:", err);

      // Zod body hatası
      if (err?.status === 400 && err?.data?.error === "INVALID_BODY") {
        const fieldErrors = err.data.details?.fieldErrors as
          | Record<string, string[]>
          | undefined;

        const firstError =
          fieldErrors && Object.values(fieldErrors).flat()[0];

        toast.error(
          firstError ??
            "Form alanlarını kontrol edin ve tekrar deneyin (geçersiz veri)."
        );
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
          ? `Mesaj gönderilirken bir hata oluştu (${code}). Lütfen tekrar deneyin.`
          : "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero section with green background */}
      <div
        className="relative bg-teal-500 py-12 md:py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-teal-500 bg-opacity-90"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-white">
            <nav className="flex items-center space-x-2 text-sm mb-4">
              <button
                onClick={() => onNavigate("home")}
                className="hover:text-teal-200 transition-colors"
              >
                Anasayfa
              </button>
              <span>&gt;</span>
              <span>İletişim</span>
            </nav>
            <h1 className="text-2xl md:text-4xl mb-2">BİZE ULAŞIN!</h1>
            <p className="text-base md:text-lg opacity-90">
              Daha fazla bilgi edinmek ve fiyat teklifi almak için bizimle
              iletişime geçin!
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content Section */}
      <div className="bg-white py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Left Column - Contact Information */}
            <div className="space-y-6 md:space-y-8">
              <div className="bg-gray-50 rounded-lg p-6 md:p-8">
                <h2 className="text-lg md:text-xl text-teal-500 mb-6">
                  {brandName}
                </h2>
                <div className="space-y-4 md:space-y-6">
                  {/* Company Name */}
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-500 text-sm md:text-lg">
                        🏢
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base text-gray-800 mb-1">
                        Şirket Adı
                      </h3>
                      <p className="text-sm md:text-base text-gray-600">
                        {brandName}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-500 text-sm md:text-lg">
                        📍
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base text-gray-800 mb-1">
                        Adres
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {contactAddress}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-500 text-sm md:text-lg">
                        ✉️
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base text-gray-800 mb-1">
                        E-posta
                      </h3>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="text-sm md:text-base text-teal-500 hover:text-teal-600 transition-colors break-all"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-500 text-sm md:text-lg">
                        📞
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base text-gray-800 mb-1">
                        Telefon
                      </h3>
                      <a
                        href={telHref}
                        className="text-sm md:text-base text-teal-500 hover:text-teal-600 transition-colors"
                      >
                        {contactPhoneDisplay}
                      </a>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-4 md:pt-6 border-t border-gray-200">
                    <div className="space-y-3">
                      <a
                        href={telHref}
                        className="w-full bg-teal-500 text-white px-4 md:px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
                      >
                        <span>📞</span>
                        <span>Hemen Ara</span>
                      </a>
                      <a
                        href={contactWhatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-600 text-white px-4 md:px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
                      >
                        <span>💬</span>
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-gray-50 rounded-lg p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Honeypot (gizli) */}
                <div className="hidden">
                  <Label
                    htmlFor="website"
                    className="text-gray-700 mb-2 block text-sm md:text-base"
                  >
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
                  />
                </div>

                {/* Name Field */}
                <div>
                  <Label
                    htmlFor="name"
                    className="text-gray-700 mb-2 block text-sm md:text-base"
                  >
                    AD SOYAD
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-gray-700 mb-2 block text-sm md:text-base"
                  >
                    EMAIL ADRESİNİZ
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-gray-700 mb-2 block text-sm md:text-base"
                  >
                    TELEFON NUMARANIZ
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <Label
                    htmlFor="subject"
                    className="text-gray-700 mb-2 block text-sm md:text-base"
                  >
                    KONU
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <Label
                    htmlFor="message"
                    className="text-gray-700 mb-2 block text-sm md:text-base"
                  >
                    MESAJINIZI BURAYA YAZINIZ
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full min-h-24 md:min-h-32 resize-none"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 text-sm md:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "GÖNDERİLİYOR..." : "MESAJ GÖNDER"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-50 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl text-teal-500 mb-6 md:mb-8 text-center">
              HARİTA ÜZERİNDE YERİMİZ
            </h2>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative w-full h-64 md:h-96">
                <iframe
                  src="https://maps.google.com/maps?q=Hekimba%C5%9F%C4%B1%20Mahallesi%20Y%C4%B1ld%C4%B1ztepe%20Caddesi%20No%3A41%20%C3%9Cmraniye%20%C4%B0stanbul&output=embed&z=16"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mezarisim.com Konum - Hekimbaşı Mah. Yıldıztepe Cad. No:41 Ümraniye/İstanbul"
                ></iframe>

                {/* Map overlay with directions link */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Hekimba%C5%9F%C4%B1+Mahallesi+Y%C4%B1ld%C4%B1ztepe+Caddesi+No%3A41+%C3%9Cmraniye+%C4%B0stanbul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors text-xs md:text-sm flex items-center space-x-1 md:space-x-2"
                  >
                    <span>🧭</span>
                    <span className="hidden sm:inline">Yol Tarifi Al</span>
                    <span className="sm:hidden">Tarif</span>
                  </a>
                </div>
              </div>

              {/* Map info footer */}
              <div className="bg-white p-4 md:p-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                  <div>
                    <h3 className="text-base md:text-lg text-gray-800 mb-1">
                      Hekimbaşı Mezarlığı
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Hekimbaşı, 34766 Ümraniye/İstanbul
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Hekimba%C5%9F%C4%B1+Mahallesi+Y%C4%B1ld%C4%B1ztepe+Caddesi+No%3A41+%C3%9Cmraniye+%C4%B0stanbul"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-500 hover:text-teal-600 transition-colors text-sm"
                    >
                      📍 Haritada Görüntüle
                    </a>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <button
                      onClick={() => onNavigate("faq")}
                      className="text-teal-500 hover:text-teal-600 transition-colors text-sm"
                    >
                      ❓ S.S.S.
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
