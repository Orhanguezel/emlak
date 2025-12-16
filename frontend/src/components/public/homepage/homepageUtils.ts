// =============================================================
// FILE: src/components/public/homepage/homepageUtils.ts
// =============================================================

export const PLACEHOLDER = "/photo.png";

/** Ortak image alanlarından ilk geçerli URL'i seçer */
export function pickImageUrl(x: unknown): string | undefined {
  if (!x) return;
  if (typeof x === "string") return x;
  const o = x as Record<string, any>;
  const cands = [
    o.image_effective_url,
    o.image_url,
    o.public_url,
    o.url,
    o.src,
    o.path,
    o.file_url,
    o.asset?.url,
    o.storage_asset?.public_url,
  ];
  return cands.find((v) => typeof v === "string" && v.trim());
}

/** Duyuru için slug/uuid/id/_id öncelik sırası ile **string** id üretir */
export function resolveAnnouncementId(a: any): string | undefined {
  if (a == null) return;
  if (typeof a === "string" || typeof a === "number") {
    return String(a).trim() || undefined;
  }
  if (typeof a === "object") {
    const cand = a.slug ?? a.uuid ?? a.id ?? a._id ?? a.ID;
    return cand != null ? String(cand).trim() || undefined : undefined;
  }
  return;
}

/** Kısa açıklama için HTML’i temizleyip kısaltır */
export function stripHtmlToText(html?: string, maxLength = 160): string {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!maxLength || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}
