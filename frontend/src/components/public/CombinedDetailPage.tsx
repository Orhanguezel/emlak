// =============================================================
// FILE: src/pages/CombinedDetailPage.tsx
// =============================================================
import React from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  useGetSimpleCampaignByIdQuery,
} from "@/integrations/rtk/endpoints/campaigns.endpoints";
import {
  useGetAnnouncementByIdQuery,
} from "@/integrations/rtk/endpoints/announcements.endpoints";
import type { SimpleCampaignView } from "@/integrations/rtk/types/campaigns";

const placeholderImg =
  "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800&h=500&fit=crop";

// images[] içindeki obje/alanları string URL’e indirger
function campaignImageUrl(c: SimpleCampaignView): string {
  return (
    c.images?.[0]?.image_effective_url ??
    c.images?.[0]?.image_url ??
    c.image_effective_url ??
    c.image_url ??
    placeholderImg
  );
}

// Duyuru HTML’inden ilk img src’sini al
function firstImgFromHtml(html?: string | null): string {
  if (!html) return placeholderImg;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? placeholderImg;
}

export type Selected = { kind: "campaign"; id: string } | { kind: "announcement"; id: string };

export const CombinedDetailPage: React.FC<{
  selected: Selected;
  onBack: () => void;
}> = ({ selected, onBack }) => {
  const isCampaign = selected.kind === "campaign";
  const id = selected.id?.trim();

  const {
    data: campaign,
    isFetching: fetchingC,
    isError: errorC,
  } = useGetSimpleCampaignByIdQuery(id!, { skip: !isCampaign || !id });

  const {
    data: announcement,
    isFetching: fetchingA,
    isError: errorA,
  } = useGetAnnouncementByIdQuery(id!, { skip: isCampaign || !id });

  const isFetching = fetchingC || fetchingA;
  const isError = errorC || errorA;

  if (!id) {
    return (
      <div className="bg-white max-w-2xl mx-auto p-6 rounded-2xl shadow text-center">
        <p className="text-sm text-slate-600 mb-4">Kayıt seçilmedi.</p>
        <Button onClick={onBack} className="bg-slate-600 hover:bg-slate-700 text-white">
          ← Listeye Dön
        </Button>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="bg-white max-w-2xl mx-auto p-6 space-y-6 rounded-2xl shadow">
        <div className="h-6 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 bg-gray-100 rounded animate-pulse" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (isError || (!campaign && !announcement)) {
    return (
      <div className="bg-white max-w-2xl mx-auto p-6 rounded-2xl shadow text-center">
        <p className="text-sm text-red-600 mb-4">Kayıt yüklenemedi.</p>
        <Button onClick={onBack} className="bg-slate-600 hover:bg-slate-700 text-white">
          ← Listeye Dön
        </Button>
      </div>
    );
  }

  // === Kampanya ===
  if (isCampaign && campaign) {
    const imgSrc = campaignImageUrl(campaign); // <- her zaman string
    const date = campaign.created_at
      ? new Date(campaign.created_at).toLocaleDateString("tr-TR")
      : null;

    return (
      <div className="bg-white max-w-2xl mx-auto p-6 space-y-6 rounded-2xl shadow">
        <div className="text-center space-y-4">
          <Badge className="bg-teal-500 text-white px-3 py-1 text-sm">Kampanya</Badge>
          <h1 className="text-xl text-teal-600 leading-tight">{campaign.title}</h1>
          <p className="text-gray-600 text-sm leading-relaxed">{campaign.description}</p>
          {date && <div className="text-sm text-gray-500">{date}</div>}
        </div>

        <div className="flex justify-center">
          <div className="w-80 h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <ImageWithFallback src={imgSrc} alt={campaign.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-teal-600">Bu Kampanyadan Yararlanın</p>
          <div className="flex gap-3 justify-center">
            <Button
              className="bg-teal-500 hover:bg-teal-600 text-white px-6"
              onClick={() => window.open("tel:+905334838971")}
            >
              Bilgi Al
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 px-6"
              onClick={() => {
                const msg = `Merhaba, "${campaign.title}" kampanyası hakkında bilgi almak istiyorum.`;
                window.open(`https://wa.me/905334838971?text=${encodeURIComponent(msg)}`, "_blank");
              }}
            >
              📱 WhatsApp'tan Sor
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-center text-gray-800 mb-4">Kampanya Detayları</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
            {date && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tarih:</span>
                <span className="text-gray-800">{date}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Durum:</span>
              <span className={campaign.is_active ? "text-green-600" : "text-slate-600"}>
                {campaign.is_active ? "Aktif" : "Pasif"}
              </span>
            </div>
            {campaign.seo_keywords?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {campaign.seo_keywords.map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded"
                  >
                    #{k}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <Button onClick={onBack} className="bg-slate-600 hover:bg-slate-700 text-white">
            ← Listeye Dön
          </Button>
        </div>
      </div>
    );
  }

  // === Duyuru ===
  const a = announcement!;
  const date = a.created_at ? new Date(a.created_at).toLocaleDateString("tr-TR") : null;
  const imgSrc = firstImgFromHtml(a.html);

  return (
    <div className="bg-white max-w-2xl mx-auto p-6 space-y-6 rounded-2xl shadow">
      <div className="text-center space-y-4">
        <Badge className="bg-emerald-600 text-white px-3 py-1 text-sm">Duyuru</Badge>
        <h1 className="text-xl text-emerald-700 leading-tight">{a.title}</h1>
        {date && <div className="text-sm text-gray-500">{date}</div>}
      </div>

      {!!imgSrc && (
        <div className="flex justify-center">
          <div className="w-80 h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <ImageWithFallback src={imgSrc} alt={a.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {a.html && (
        <div
          className="prose prose-sm max-w-none prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: a.html }}
        />
      )}

      <div className="text-center">
        <Button onClick={onBack} className="bg-slate-600 hover:bg-slate-700 text-white">
          ← Listeye Dön
        </Button>
      </div>
    </div>
  );
};
