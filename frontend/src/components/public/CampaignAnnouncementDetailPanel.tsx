// =============================================================
// FILE: src/components/public/CampaignAnnouncementDetailPanel.tsx
// =============================================================
"use client";

import * as React from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";
import {
  useGetSimpleCampaignByIdQuery,
} from "@/integrations/rtk/endpoints/campaigns.endpoints";
import {
  useGetAnnouncementByIdQuery,
} from "@/integrations/rtk/endpoints/announcements.endpoints";

import type { SimpleCampaignView } from "@/integrations/rtk/types/campaigns";

type Kind = "campaign" | "announcement";

interface DetailPanelProps {
  kind: Kind;
  id: string;
}

/* ---------- helpers: site settings ---------- */
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

const sanitizePhoneDigits = (s: string) => (s || "").replace(/[^\d]/g, "");

function buildTelHref(raw: string): string {
  const trimmed = (raw || "").replace(/\s+/g, "");
  if (trimmed.startsWith("+")) return `tel:${trimmed}`;
  const digits = sanitizePhoneDigits(trimmed);
  let intl = digits;
  if (digits.startsWith("90")) intl = digits;
  else if (digits.startsWith("0")) intl = `9${digits}`;
  else if (digits.length === 10) intl = `90${digits}`;
  return `tel:+${intl}`;
}

function buildWhatsappHref(raw: string): string {
  const digits = sanitizePhoneDigits(raw);
  let intl = digits;
  if (digits.startsWith("90")) intl = digits;
  else if (digits.startsWith("0")) intl = `9${digits}`;
  else if (digits.length === 10) intl = `90${digits}`;
  return `https://wa.me/${intl}`;
}

/** Haziran 2024 formatı */
function formatMonthYear(raw?: string | Date | null): string {
  if (!raw) return "";
  const d = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(d.getTime())) {
    // Bazı kampanyalarda "Haziran 2024" string olarak gelebilir, onu hiç bozma
    return String(raw);
  }
  return d.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });
}

/** SimpleCampaignView için geçerlilik tarihi (created_at / updated_at) */
function getCampaignValidity(c: SimpleCampaignView): string {
  const cand = c.created_at ?? c.updated_at ?? null;
  return formatMonthYear(cand);
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ kind, id }) => {
  // ---- Site settings
  const { data: siteSettingsData } = useListSiteSettingsQuery(undefined);
  const settings = React.useMemo(
    () => toSettingsMap(siteSettingsData),
    [siteSettingsData],
  );

  const phoneDisplay = settings["contact_phone_display"] || "0532 395 45 58";
  const phoneTel = settings["contact_phone_tel"] || phoneDisplay;
  const email = settings["contact_email"] || "mezarisim.com@gmail.com";
  const brandName = settings["brand_name"] || "mezarisim.com";

  const telHref = buildTelHref(phoneTel);
  const waHref = buildWhatsappHref(phoneTel);

  // ---- RTK: kampanya / duyuru detay
  const {
    data: campaign,
    isLoading: loadingCampaign,
    isError: errorCampaign,
  } = useGetSimpleCampaignByIdQuery(kind === "campaign" ? id : (undefined as any), {
    skip: kind !== "campaign",
  });

  const {
    data: announcement,
    isLoading: loadingAnn,
    isError: errorAnn,
  } = useGetAnnouncementByIdQuery(
    kind === "announcement" ? id : (undefined as any),
    {
      skip: kind !== "announcement",
    },
  );

  const isLoading = loadingCampaign || loadingAnn;
  const isError = errorCampaign || errorAnn;

  if (isLoading) {
    return (
      <div className="bg-white max-w-2xl mx-auto p-6 text-center text-sm text-gray-500">
        Yükleniyor…
      </div>
    );
  }

  if (isError || (!campaign && !announcement)) {
    return (
      <div className="bg-white max-w-2xl mx-auto p-6 text-center text-sm text-red-600">
        Detay bilgisi yüklenemedi.
      </div>
    );
  }

  /* ---------------------- KAMPANYA DETAYI ---------------------- */
  if (kind === "campaign" && campaign) {
    const c = campaign as SimpleCampaignView;

    const title = c.title ?? "Kampanya";
    const desc = c.description ?? "";
    const image =
      c.images?.[0]?.image_effective_url ||
      c.images?.[0]?.image_url ||
      c.image_effective_url ||
      c.image_url ||
      "/mezartasi.png";

    const validityText = getCampaignValidity(c);
    const isActive = c.is_active;
    const typeLabel = (c as any).tag || "Kampanya";

    return (
      <div className="bg-white max-w-2xl mx-auto p-6 space-y-6">
        {/* Header with Type Badge */}
        <div className="text-center space-y-4">
          <Badge className="bg-teal-500 text-white px-3 py-1 text-sm">
            {typeLabel}
          </Badge>

          <h1 className="text-xl text-teal-600 leading-tight">
            {title}
          </h1>

          {desc && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {desc}
            </p>
          )}

          {validityText && (
            <div className="text-sm text-gray-500">
              {validityText}
            </div>
          )}
        </div>

        {/* Main Image */}
        <div className="flex justify-center">
          <div className="w-80 h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <ImageWithFallback
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <p className="text-lg text-teal-600">Bu Kampanyadan Yararlanın</p>

          <div className="flex gap-3 justify-center">
            <Button
              className="bg-teal-500 hover:bg-teal-600 text-white px-6"
              onClick={() => window.open(telHref)}
            >
              Bilgi Al
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 px-6"
              onClick={() => window.open(waHref, "_blank")}
            >
              📱 WhatsApp&apos;tan Sor
            </Button>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="space-y-3">
          <h3 className="text-center text-gray-800 mb-4">
            Kampanya Detayları
          </h3>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Kampanya Türü:</span>
              <span className="text-gray-800">{typeLabel}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Geçerlilik Tarihi:</span>
              <span className="text-gray-800">
                {validityText || "Belirtilmemiş"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Durumu:</span>
              <span className={isActive ? "text-green-600" : "text-red-600"}>
                {isActive ? "Aktif" : "Pasif"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Detaylı bilgi için bizimle iletişime geçin</p>
          <p>
            📞 {phoneDisplay} | 🌐 {brandName}
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------- DUYURU DETAYI ---------------------- */
  const a: any = announcement;
  const title = a?.title ?? "Duyuru";
  const html = a?.html as string | undefined;
  const image =
    a?.image_url ||
    a?.cover_image ||
    "/mezartasi.png";
  const dateRaw =
    a?.published_at || a?.updated_at || a?.created_at || null;
  const dateText = formatMonthYear(dateRaw);

  return (
    <div className="bg-white max-w-2xl mx-auto p-6 space-y-6">
      {/* Header with Type Badge */}
      <div className="text-center space-y-4">
        <Badge className="bg-teal-500 text-white px-3 py-1 text-sm">
          Duyuru
        </Badge>

        <h1 className="text-xl text-teal-600 leading-tight">
          {title}
        </h1>

        {dateText && (
          <div className="text-sm text-gray-500">
            {dateText}
          </div>
        )}
      </div>

      {/* Main Image */}
      <div className="flex justify-center">
        <div className="w-80 h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Announcement Content */}
      <div className="space-y-3 text-sm text-gray-700">
        {html ? (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p>Bu duyuru için detaylı açıklama bulunmuyor.</p>
        )}
      </div>

      {/* Contact Info */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>Detaylı bilgi için bizimle iletişime geçin</p>
        <p>
          📞 {phoneDisplay} | 📧 {email} | 🌐 {brandName}
        </p>
      </div>
    </div>
  );
};
