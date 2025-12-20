// =============================================================
// FILE: src/components/public/properties/properties.selectors.ts
// =============================================================
import type {
  Properties as PropertyView,
  PropertyAssetPublic,
} from "@/integrations/rtk/types/properties";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";

export type UiProperty = {
  id: string;
  slug: string;
  title: string;

  type: string;
  status: string;

  address: string;
  district: string;
  city: string;
  neighborhood?: string | null;

  description?: string | null;

  price?: string | null;
  currency?: string | null;

  rooms?: string | null;
  rooms_multi?: string[] | null;

  gross_m2?: number | null;

  created_at: string;
  display_order: number;

  image: string;
  images: string[];
};

/**
 * API bazen listeyi direkt [] döndürür, bazen {items:[]} / {rows:[]} gibi wrapper döndürür.
 */
export function unwrapList<T = any>(x: unknown): T[] {
  if (!x) return [];
  if (Array.isArray(x)) return x as T[];
  if (typeof x !== "object") return [];
  const o = x as any;

  const candidate = o.items ?? o.rows ?? o.list ?? o.data ?? o.result ?? o.payload ?? [];
  return Array.isArray(candidate) ? (candidate as T[]) : [];
}

/**
 * RTK endpoint bazen:
 * - doğrudan entity döndürür  => { ...property }
 * - veya wrapper döndürür     => { data: { ... } } / { item: { ... } } / { property: { ... } }
 */
export function unwrapOne<T = any>(x: unknown): T | null {
  if (!x || typeof x !== "object") return null;
  const o = x as any;
  const candidate = o.data ?? o.item ?? o.property ?? o.result ?? o.payload ?? null;
  return (candidate ?? o) as T;
}

export function toSelectOptions(arr: unknown): string[] {
  return Array.isArray(arr)
    ? (arr as any[])
        .map((x) => String(x ?? "").trim())
        .filter(Boolean)
    : [];
}

function safeImage(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : PLACEHOLDER_IMG;
}

function pickFirstImageFromAssets(assets: PropertyAssetPublic[] | undefined): string | null {
  if (!Array.isArray(assets) || !assets.length) return null;

  const images = assets
    .filter((a) => (a?.kind || "image") === "image")
    .sort((a, b) =>
      a.is_cover === b.is_cover
        ? (a.display_order ?? 0) - (b.display_order ?? 0)
        : a.is_cover
          ? -1
          : 1,
    );

  const first = images[0];
  const u = first?.url ? String(first.url) : "";
  return u.trim().length ? u.trim() : null;
}

function pickImagesFromAssets(assets: PropertyAssetPublic[] | undefined): string[] {
  if (!Array.isArray(assets) || !assets.length) return [PLACEHOLDER_IMG];

  const images = assets
    .filter((a) => (a?.kind || "image") === "image")
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((a) => safeImage(a?.url))
    .filter(Boolean);

  return images.length ? images : [PLACEHOLDER_IMG];
}

export function toUiProperty(p: PropertyView): UiProperty {
  const anyP = p as any;

  const assets = Array.isArray(anyP.assets) ? (anyP.assets as PropertyAssetPublic[]) : undefined;

  const imagesFromAssets = pickImagesFromAssets(assets);

  const cover = safeImage(
    anyP.image_effective_url ??
      anyP.image_url ??
      pickFirstImageFromAssets(assets) ??
      imagesFromAssets[0] ??
      PLACEHOLDER_IMG,
  );

  const rooms_multi =
    typeof anyP.rooms_multi !== "undefined" && Array.isArray(anyP.rooms_multi)
      ? (anyP.rooms_multi as any[]).map((x) => String(x)).filter(Boolean)
      : null;

  return {
    id: String(anyP.id),
    slug: String(anyP.slug ?? ""),
    title: String(anyP.title ?? ""),

    type: String(anyP.type ?? ""),
    status: String(anyP.status ?? ""),

    address: String(anyP.address ?? ""),
    district: String(anyP.district ?? ""),
    city: String(anyP.city ?? ""),
    neighborhood: typeof anyP.neighborhood !== "undefined" ? (anyP.neighborhood ?? null) : null,

    description: anyP.description ?? null,

    price: typeof anyP.price !== "undefined" && anyP.price !== null ? String(anyP.price) : null,
    currency: typeof anyP.currency !== "undefined" && anyP.currency !== null ? String(anyP.currency) : "TRY",

    rooms: typeof anyP.rooms !== "undefined" ? (anyP.rooms ?? null) : null,
    rooms_multi,

    gross_m2:
      typeof anyP.gross_m2 !== "undefined"
        ? (Number.isFinite(Number(anyP.gross_m2)) ? Number(anyP.gross_m2) : null)
        : null,

    created_at: String(anyP.created_at ?? ""),
    display_order: Number(anyP.display_order ?? 0),

    image: cover,
    images: imagesFromAssets,
  };
}
