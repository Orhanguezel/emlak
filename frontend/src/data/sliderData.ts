// src/data/sliderData.ts
// ============================================================
// RTK entegre sürüm: PUBLIC slider verisini backend'den çeker.
// Önerilen: useActiveSlidesRtk / useAllSlidesRtk / useSlidePublicRtk
// ============================================================

import { useEffect, useMemo } from "react";
import {
  useListSlidesPublicQuery,
  useGetSlidePublicQuery,
} from "@/integrations/rtk/endpoints/slider_public.endpoints";
import type {
  SliderPublic,
  SliderListParams,
} from "@/integrations/rtk/types/slider";

// --------- FE tipi ---------
export interface SlideData {
  id: string;
  title: string;
  description: string;
  image: string;
  alt?: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
  priority?: "low" | "medium" | "high";
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

// --------- PLACEHOLDER ----------
const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=1200&h=600&fit=crop";

// --------- RTK → FE map ----------
const toSlideData = (s: SliderPublic | any): SlideData => {
  const id = String(s?.id ?? s?.uuid ?? Math.random());
  const title = String(s?.title ?? s?.name ?? "");
  const description = String(s?.description ?? "");
  const image = String(
    s?.image ??
    s?.image_effective_url ??
    s?.asset_url ??
    s?.image_url ??
    PLACEHOLDER_IMG
  );
  const buttonText = String(s?.buttonText ?? "İncele");
  const buttonLink = String(s?.buttonLink ?? "contact");
  const isActive = Boolean(s?.isActive ?? s?.is_active ?? true);
  const order = Number(s?.order ?? s?.display_order ?? 0);

  const result: SlideData = {
    id,
    title,
    description,
    image,
    buttonText,
    buttonLink,
    isActive,
    order,
  };

  // exactOptionalPropertyTypes nedeniyle opsiyonelleri sadece varsa ekliyoruz
  if (s?.alt != null) result.alt = String(s.alt);
  if (s?.priority === "low" || s?.priority === "medium" || s?.priority === "high") {
    result.priority = s.priority;
  }
  if (typeof s?.showOnMobile === "boolean") result.showOnMobile = s.showOnMobile;
  if (typeof s?.showOnDesktop === "boolean") result.showOnDesktop = s.showOnDesktop;

  return result;
};

// ============================================================
//               ✅ RTK HOOK’LARI
// ============================================================

/** Aktif slider’ları (public) çeker, order’a göre sıralar */
export function useActiveSlidesRtk(
  params?: Partial<SliderListParams>
): { slides: SlideData[]; isFetching: boolean; isError: boolean; refetch: () => any } {
  const q: SliderListParams = {
    limit: 200,
    offset: 0,
    order: "asc",
    sort: "display_order",
    ...params,
  };

  const { data = [], isFetching, isError, refetch } = useListSlidesPublicQuery(q);

  const slides = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr
      .map(toSlideData)
      .filter((s) => s.isActive)
      .sort((a, b) => a.order - b.order);
  }, [data]);

  // Panelden "slider-data-updated" event'i atarsan otomatik tazeler
  useEffect(() => {
    const onUpd = () => refetch();
    window.addEventListener("slider-data-updated", onUpd);
    return () => window.removeEventListener("slider-data-updated", onUpd);
  }, [refetch]);

  return { slides, isFetching, isError, refetch };
}

/** Tüm slider’ları (public) çeker, order’a göre sıralar */
export function useAllSlidesRtk(
  params?: Partial<SliderListParams>
): { slides: SlideData[]; isFetching: boolean; isError: boolean; refetch: () => any } {
  const q: SliderListParams = {
    limit: 200,
    offset: 0,
    order: "asc",
    sort: "display_order",
    ...params,
  };

  const { data = [], isFetching, isError, refetch } = useListSlidesPublicQuery(q);

  const slides = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr.map(toSlideData).sort((a, b) => a.order - b.order);
  }, [data]);

  useEffect(() => {
    const onUpd = () => refetch();
    window.addEventListener("slider-data-updated", onUpd);
    return () => window.removeEventListener("slider-data-updated", onUpd);
  }, [refetch]);

  return { slides, isFetching, isError, refetch };
}

/** Tek bir slide’ı (public) id veya slug ile getirir */
export function useSlidePublicRtk(
  idOrSlug: string | undefined
): { slide: SlideData | null; isFetching: boolean; isError: boolean; refetch: () => any } {
  const skip = !idOrSlug || String(idOrSlug).trim() === "";
  const { data, isFetching, isError, refetch } = useGetSlidePublicQuery(idOrSlug ?? "", { skip });
  const slide = useMemo(() => (data ? toSlideData(data) : null), [data]);
  return { slide, isFetching, isError, refetch };
}
