"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImageWithFallback } from "../../figma/ImageWithFallback";

import { useListSimpleCampaignsQuery } from "@/integrations/rtk/endpoints/campaigns.endpoints";
import { useListAnnouncementsQuery } from "@/integrations/rtk/endpoints/announcements.endpoints";

import {
  pickImageUrl,
  PLACEHOLDER,
  resolveAnnouncementId,
  stripHtmlToText,
} from "./homepageUtils";

type Props = {
  onOpenCampaignsModal?: ((payload?: any) => void) | undefined;
  onOpenAnnouncementModal?: ((payload?: any) => void) | undefined;
};

function formatMonthYear(value: unknown): string {
  if (!value) return "";
  const d = new Date(value as any);
  if (Number.isNaN(d.getTime())) return "";

  const txt = d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

export function HomeRightColumn({ onOpenCampaignsModal, onOpenAnnouncementModal }: Props) {
  const { data: campRtk = [], isLoading: loadingCamps, isError: errorCamps } =
    useListSimpleCampaignsQuery();

  const { data: annRtk = [], isLoading: loadingAnns, isError: errorAnns } =
    useListAnnouncementsQuery();

  const campaignsUi = Array.isArray(campRtk)
    ? campRtk.map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description ?? "",
      date: c.created_at || c.date ? formatMonthYear(c.created_at ?? c.date) : "",
      type: c.tag ?? "Kampanya",
      image: pickImageUrl(c.images?.[0]) || PLACEHOLDER,
    }))
    : [];

  const announcementsUi = Array.isArray(annRtk)
    ? annRtk.map((a: any) => ({
      id: a.id,
      slug: a.slug,
      uuid: a.uuid,
      title: a.title,
      date: a.published_at || a.created_at ? formatMonthYear(a.published_at ?? a.created_at) : "",
      html: a.html as string | undefined,
      image: pickImageUrl(a.images?.[0]) || a.image || a.cover_image || PLACEHOLDER,
    }))
    : [];

  const [activeRightTab, setActiveRightTab] = useState<"campaigns" | "announcements">(
    "campaigns",
  );

  return (
    <>
      {/* DUYURU / KAMPANYALAR */}
      <div>
        <h2 className="text-xl md:text-2xl mb-4 md:mb-6 text-slate-900 font-semibold flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveRightTab("announcements")}
            className={`transition-colors ${activeRightTab === "announcements" ? "text-slate-900" : "opacity-70 hover:opacity-100"
              }`}
          >
            DUYURU
          </button>
          <span className="text-slate-400">/</span>
          <button
            type="button"
            onClick={() => setActiveRightTab("campaigns")}
            className={`transition-colors ${activeRightTab === "campaigns" ? "text-slate-900" : "opacity-70 hover:opacity-100"
              }`}
          >
            KAMPANYALAR
          </button>
        </h2>

        {activeRightTab === "campaigns" ? (
          <>
            {loadingCamps && <div className="text-sm text-gray-500 text-center">Yükleniyor…</div>}
            {errorCamps && <div className="text-sm text-red-600 text-center">Kampanyalar yüklenemedi.</div>}
            {!loadingCamps && !errorCamps && campaignsUi.length === 0 && (
              <div className="text-sm text-gray-500 text-center">Aktif kampanya bulunmuyor.</div>
            )}

            {!loadingCamps && !errorCamps && campaignsUi.length > 0 && (
              <div className="space-y-3 md:space-y-4">
                {campaignsUi.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => onOpenCampaignsModal?.(a)}
                    className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 md:p-5 rounded-lg border-l-4 border-slate-900 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-semibold">
                        {a.type || "Kampanya"}
                      </span>
                      {a.date && <span className="text-xs text-gray-500">{a.date}</span>}
                    </div>

                    <div className="flex space-x-3 md:space-x-4 items-start">
                      <ImageWithFallback
                        src={a.image}
                        alt={a.title}
                        className="w-16 h-12 md:w-20 md:h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm md:text-base mb-1 text-slate-900 font-semibold leading-tight">
                          {a.title}
                        </h4>
                        {a.description && (
                          <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                            {stripHtmlToText(a.description, 160)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {loadingAnns && <div className="text-sm text-gray-500 text-center">Yükleniyor…</div>}
            {errorAnns && <div className="text-sm text-red-600 text-center">Duyurular yüklenemedi.</div>}
            {!loadingAnns && !errorAnns && announcementsUi.length === 0 && (
              <div className="text-sm text-gray-500 text-center">Duyuru bulunmuyor.</div>
            )}

            {!loadingAnns && !errorAnns && announcementsUi.length > 0 && (
              <div className="space-y-3 md:space-y-4">
                {announcementsUi.map((a: any) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      if (!onOpenAnnouncementModal) {
                        toast.info("Duyuru modalı bağlanmamış görünüyor.");
                        return;
                      }
                      const id = resolveAnnouncementId(a);
                      onOpenAnnouncementModal(id ?? a);
                    }}
                    className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 md:p-5 rounded-lg border-l-4 border-slate-900 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-semibold">
                        Duyuru
                      </span>
                      {a.date && <span className="text-xs text-gray-500">{a.date}</span>}
                    </div>

                    <div className="flex space-x-3 md:space-x-4 items-start">
                      <ImageWithFallback
                        src={a.image}
                        alt={a.title}
                        className="w-16 h-12 md:w-20 md:h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm md:text-base mb-1 text-slate-900 font-semibold leading-tight">
                          {a.title}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                          {stripHtmlToText(a.html, 160) || "Detay için tıklayın."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Değerleme / Danışmanlık Güvencesi */}
      <div className="text-center">
        <h2 className="text-lg md:text-xl mb-4 md:mb-6 text-slate-900 leading-tight font-semibold">
          GAYRİMENKUL SATIŞ & KİRALAMADA ŞEFFAF SÜREÇ VE DOĞRU FİYATLANDIRMA!
        </h2>

        <div className="bg-slate-50 border border-slate-200 p-4 md:p-6 rounded-lg mb-4 md:mb-6">
          <p className="text-sm md:text-base leading-relaxed text-gray-700">
            X Emlak ile satış/kiralama sürecinizi güvenle yönetin. Bölgesel emsal analizi,
            doğru fiyat aralığı, profesyonel ilan yönetimi ve hızlı iletişim desteğiyle;
            mülkünüzün değerini en doğru şekilde konumlandırmanıza yardımcı oluyoruz.
            İster satılık, ister kiralık; hedef kitleye doğru kanallardan ulaşmanız için
            süreç boyunca yanınızdayız.
          </p>
        </div>

        <div className="flex justify-center items-center space-x-4 md:space-x-8">
          {/* 1 */}
          <div className="text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white mx-auto shadow-lg ring-4 ring-slate-200">
              <svg className="w-6 h-6 md:w-8 md:h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs md:text-sm font-semibold leading-tight">Doğru Fiyat</span>
            </div>
          </div>

          {/* 2 */}
          <div className="text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white mx-auto shadow-lg ring-4 ring-slate-200">
              <svg className="w-6 h-6 md:w-8 md:h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span className="text-xs md:text-sm font-semibold leading-tight">Şeffaf Süreç</span>
            </div>
          </div>

          {/* 3 */}
          <div className="text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white mx-auto shadow-lg ring-4 ring-slate-200">
              <svg className="w-6 h-6 md:w-8 md:h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
              </svg>
              <span className="text-xs md:text-sm font-semibold leading-tight text-center">
                Hızlı
                <br />
                Geri Dönüş
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
