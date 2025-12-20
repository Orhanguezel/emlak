// =============================================================
// FILE: src/components/public/PropertyDetailPage.tsx
// X Emlak – Property Detail (PUBLIC) – MULTI IMAGE + SAFE MAPPING
// =============================================================
"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Home as HomeIcon, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";

import { useGetPropertyBySlugQuery, useListPropertiesQuery } from "@/integrations/rtk/endpoints/properties.endpoints";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";
import { useCreateContactMutation } from "@/integrations/rtk/endpoints/contacts.endpoints";

import type { ContactCreateInput } from "@/integrations/rtk/types/contacts";
import type { Properties as PropertyView } from "@/integrations/rtk/types/properties";
import { getPropertyStatusLabel, getPropertyTypeLabel } from "@/integrations/rtk/types/properties";

import { toUiProperty, unwrapList, unwrapOne } from "@/components/public/properties/properties.selectors";

// ----------------------------- helpers: site settings -----------------------------

type SiteSettingLike = { key?: string; name?: string; value?: string | null };

function toSettingsMap(data: unknown): Record<string, string> {
  if (!data) return {};
  if (Array.isArray(data)) {
    const m: Record<string, string> = {};
    for (const it of data as SiteSettingLike[]) {
      const k = (it?.key ?? it?.name ?? "").toString();
      const v = (it?.value ?? "").toString();
      if (k) m[k] = v;
    }
    return m;
  }
  if (typeof data === "object") return data as Record<string, string>;
  return {};
}

function sanitizePhoneDigits(s: string): string {
  return (s || "").replace(/[^\d]/g, "");
}

function buildTelHref(raw: string): string {
  const trimmed = (raw || "").replace(/\s+/g, "");
  if (trimmed.startsWith("+")) return `tel:${trimmed}`;
  const digits = sanitizePhoneDigits(trimmed);
  if (digits.startsWith("49")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+49${digits.slice(1)}`;
  return `tel:+${digits}`;
}

function buildWhatsappHref(raw: string): string {
  const digits = sanitizePhoneDigits(raw);
  if (digits.startsWith("49")) return `https://wa.me/${digits}`;
  if (digits.startsWith("0")) return `https://wa.me/49${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

// ----------------------------- props -----------------------------

interface PropertyDetailPageProps {
  slug: string;
  onNavigate: (page: string) => void;
  onPropertyDetail?: (slug: string) => void;
}

// ----------------------------- component -----------------------------

export function PropertyDetailPage({ slug, onNavigate, onPropertyDetail }: PropertyDetailPageProps) {
  const routerNavigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "",
  });

  const [createContact, { isLoading: contactSaving }] = useCreateContactMutation();

  const { data: siteSettingsData } = useListSiteSettingsQuery(undefined);
  const settings = useMemo(() => toSettingsMap(siteSettingsData), [siteSettingsData]);

  const contactPhoneDisplay =
    settings["contact_phone_display"] || settings["contact_phone_tel"] || "+49 000 000000";
  const contactPhoneRaw =
    settings["contact_phone_tel"] || settings["contact_phone_display"] || "+49 000 000000";

  const telHref = buildTelHref(contactPhoneRaw);
  const waHref = settings["contact_whatsapp_link"] || buildWhatsappHref(contactPhoneRaw);

  const { data: detailRaw, isFetching: loadingDetail, isError } = useGetPropertyBySlugQuery(slug, { skip: !slug });

  const property = useMemo(() => {
    const unwrapped = unwrapOne<PropertyView>(detailRaw);
    if (!unwrapped) return null;
    return toUiProperty(unwrapped);
  }, [detailRaw]);

  useEffect(() => setCurrentImageIndex(0), [slug]);

  useEffect(() => {
    if (property && !formData.subject.trim()) {
      setFormData((p) => ({ ...p, subject: `İlan bilgi talebi: ${property.title}`.trim() }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property]);

  const { data: otherRaw } = useListPropertiesQuery({ active: true, limit: 24, offset: 0 });

  const otherProps = useMemo(() => {
    const arr = unwrapList<PropertyView>(otherRaw);
    const mapped = arr.map(toUiProperty);

    const filtered = property ? mapped.filter((x) => x.id !== property.id && x.slug !== property.slug) : mapped;
    return filtered.slice(0, 8);
  }, [otherRaw, property]);

  const onContactInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const canSubmit =
    formData.name.trim().length > 1 &&
    formData.email.trim().length > 5 &&
    formData.phone.trim().length > 5 &&
    formData.subject.trim().length > 0 &&
    formData.message.trim().length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Lütfen tüm gerekli alanları doldurunuz.");
      return;
    }

    const messageFinal = [
      formData.message.trim(),
      property?.title ? `\n\nİlan: ${property.title}` : "",
      property?.district || property?.city
        ? `\nKonum: ${property.district}${property.city ? `, ${property.city}` : ""}`
        : "",
      property?.slug ? `\nSlug: ${property.slug}` : "",
    ]
      .join("")
      .trim();

    const payload: ContactCreateInput = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: messageFinal,
      website: formData.website.trim() ? formData.website.trim() : null,
    };

    try {
      await createContact(payload).unwrap();
      toast.success("Talebiniz alındı! En kısa sürede size dönüş yapacağız.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: property ? `İlan bilgi talebi: ${property.title}` : "",
        message: "",
        website: "",
      });
    } catch (err: any) {
      toast.error(typeof err?.data?.error === "string" ? `Hata: ${err.data.error}` : "Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  const goDetail = (p: { slug: string }) => {
    const s = (p.slug || "").trim();
    if (!s) return;
    onPropertyDetail?.(s);
  };

  if (loadingDetail && !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-600">Yükleniyor…</div>
      </div>
    );
  }

  if (isError || !property || !property.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">İlan bulunamadı</h2>
          <p className="text-gray-600 mb-6">Bu ilan kaldırılmış olabilir veya bağlantı hatalı.</p>
          <Button
            onClick={() => {
              routerNavigate("/emlaklar");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            İlanlara Dön
          </Button>
        </div>
      </div>
    );
  }

  const images = property.images.length ? property.images : [property.image];
  const safeIndex = Math.min(Math.max(0, currentImageIndex), images.length - 1);
  const current = images[safeIndex] ?? property.image;

  const formatPrice = (price?: string | null, currency?: string | null) => {
    if (!price) return null;
    return `${price} ${currency || "TRY"}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <button
              onClick={() => {
                routerNavigate("/");
                onNavigate("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-slate-900 hover:text-slate-700 flex items-center gap-1 font-semibold"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfa
            </button>

            <span className="text-gray-400">/</span>
            <button
              onClick={() => {
                routerNavigate("/emlaklar");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-slate-900 hover:text-slate-700 font-semibold"
              type="button"
            >
              Emlaklar
            </button>

            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-bold">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
              <ImageWithFallback
                src={current}
                alt={`${property.title} - Görsel ${safeIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={`${property.id}-${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      idx === safeIndex ? "border-slate-900 ring-2 ring-slate-200" : "border-gray-200 hover:border-gray-300"
                    }`}
                    type="button"
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${property.title} küçük görsel ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-500 font-medium">{Math.max(1, images.length)} fotoğraf mevcut</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge className="bg-slate-900 text-white hover:bg-slate-800">
                  <span className="inline-flex items-center gap-1">
                    <HomeIcon className="w-3.5 h-3.5" />
                    {getPropertyTypeLabel(property.type)}
                  </span>
                </Badge>

                <Badge variant="outline" className="border-slate-900 text-slate-900 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {getPropertyStatusLabel(property.status)}
                  </span>
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">{property.title}</h1>

              <div className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-5 h-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-semibold">
                    {property.district}, {property.city}
                  </div>
                  <div className="text-gray-600">
                    {property.neighborhood ? `${property.neighborhood} • ` : ""}
                    {property.address}
                  </div>
                </div>
              </div>

              {(property.price || property.rooms || typeof property.gross_m2 === "number") && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {property.price && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800 font-semibold">
                      {formatPrice(property.price, property.currency)}
                    </span>
                  )}
                  {property.rooms && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800 font-semibold">{property.rooms}</span>
                  )}
                  {typeof property.gross_m2 === "number" && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800 font-semibold">{property.gross_m2} m²</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Açıklama</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {property.description || "Bu ilan için açıklama girilmemiş."}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-2">Hızlı İletişim</div>
              <div className="flex flex-wrap gap-2">
                <a href={telHref}>
                  <Button
                    variant="outline"
                    className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                    disabled={contactSaving}
                  >
                    Ara: {contactPhoneDisplay}
                  </Button>
                </a>
                <a href={waHref} target="_blank" rel="noreferrer">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white" disabled={contactSaving}>
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="text-lg font-bold text-slate-900 mb-4">Bilgi Talep Formu</div>
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input name="name" value={formData.name} onChange={onContactInput} placeholder="Ad Soyad *" />
                  <Input name="email" value={formData.email} onChange={onContactInput} placeholder="E-posta *" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input name="phone" value={formData.phone} onChange={onContactInput} placeholder="Telefon *" />
                  <Input name="website" value={formData.website} onChange={onContactInput} placeholder="Website (opsiyonel)" />
                </div>
                <Input name="subject" value={formData.subject} onChange={onContactInput} placeholder="Konu *" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={onContactInput}
                  placeholder="Mesajınız *"
                  className="min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                />
                <Button type="submit" disabled={!canSubmit || contactSaving} className="bg-slate-900 hover:bg-slate-800 text-white w-full">
                  {contactSaving ? "Gönderiliyor..." : "Gönder"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {otherProps.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-5">Benzer İlanlar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherProps.map((p) => (
                <button
                  key={p.id}
                  onClick={() => goDetail(p)}
                  className="text-left bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition"
                  type="button"
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <ImageWithFallback src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-bold text-slate-900 line-clamp-2">{p.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {p.district}, {p.city}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
