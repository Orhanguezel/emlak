// src/components/admin/AdminPanel/form/properties/helpers.ts

export const slugifyTr = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .substring(0, 120);

export const toNum = (v: string): number => {
  const x = Number(String(v).trim().replace(",", "."));
  return Number.isFinite(x) ? x : 0;
};

export const toFloatOrNull = (v: string): number | null => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

export const toIntOrNull = (v: string): number | null => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s.replace(",", "."));
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
};

export type UploadExtract = { id: string | null; url: string | null };

/**
 * ✅ TEKLİ upload response parse
 * (Mevcut davranışı BOZMADAN aynen koruyoruz)
 */
export const extractUploadResult = (res: any): UploadExtract => {
  const item =
    res?.items?.[0] ??
    res?.data?.items?.[0] ??
    res?.result?.items?.[0] ??
    res?.[0] ??
    null;

  const id =
    item?.id ??
    item?.asset_id ??
    item?.assetId ??
    item?.file_id ??
    res?.id ??
    res?.asset_id ??
    null;

  const url =
    item?.url ??
    item?.publicUrl ??
    item?.public_url ??
    item?.cdn_url ??
    res?.url ??
    res?.publicUrl ??
    null;

  return {
    id: typeof id === "string" && id.trim() ? id : null,
    url: typeof url === "string" && url.trim() ? url : null,
  };
};

/**
 * ✅ ÇOKLU upload response parse
 * - res.items / res.data.items / res.result.items / res.payload.items / res (array) destekler
 * - item başına id/url çıkarır
 */
const extractIdUrlFromItem = (item: any): UploadExtract => {
  const id =
    item?.id ??
    item?.asset_id ??
    item?.assetId ??
    item?.file_id ??
    null;

  const url =
    item?.url ??
    item?.publicUrl ??
    item?.public_url ??
    item?.cdn_url ??
    null;

  return {
    id: typeof id === "string" && id.trim() ? id : null,
    url: typeof url === "string" && url.trim() ? url : null,
  };
};

export const extractUploadResults = (res: any): UploadExtract[] => {
  const items =
    res?.items ??
    res?.data?.items ??
    res?.result?.items ??
    res?.payload?.items ??
    (Array.isArray(res) ? res : null) ??
    null;

  if (Array.isArray(items)) {
    return items
      .map(extractIdUrlFromItem)
      .filter((x) => x.id || x.url);
  }

  // Fallback: tekli gibi davran
  const one = extractUploadResult(res);
  return one.id || one.url ? [one] : [];
};

/* =========================================================
   ✅ Enum value/label normalizasyon helpers
   - value: DB/API için stabil (yazlik, koy_evi, devren_satilik)
   - label: kullanıcı için TR düzgün (Yazlık, Köy Evi, Devren Satılık)
========================================================= */

export type SelectOption = { value: string; label: string };

/** "Devren Satılık" gibi Title Case (TR) */
export const titleCaseTr = (s: string): string => {
  const t = String(s ?? "").trim();
  if (!t) return "";
  return t
    .split(/\s+/g)
    .filter(Boolean)
    .map((w) => {
      const lower = w.toLocaleLowerCase("tr-TR");
      return lower.charAt(0).toLocaleUpperCase("tr-TR") + lower.slice(1);
    })
    .join(" ");
};

/**
 * API’den gelen "Yazlık", "yazlik", "YAZLIK" gibi değerleri enum/DB formatına çevirir.
 * - Türkçe karakterleri normalize eder
 * - boşluk/-,/ benzeri ayırıcıları "_" yapar
 */
export const normalizeEnumValueTr = (input: unknown): string => {
  const raw = String(input ?? "").trim();
  if (!raw) return "";

  const s = raw
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");

  const underscored = s
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return underscored;
};

const LABEL_OVERRIDES: Record<string, string> = {
  yazlik: "Yazlık",
  dubleks: "Dubleks",
  triplex: "Triplex",
  penthouse: "Penthouse",
  koy_evi: "Köy Evi",
  ciftlik_evi: "Çiftlik Evi",
  devren_satilik: "Devren Satılık",
  satilik: "Satılık",
  kiralik: "Kiralık",
};

export const labelFromEnumValueTr = (value: unknown): string => {
  const v = normalizeEnumValueTr(value);
  if (!v) return "";

  if (LABEL_OVERRIDES[v]) return LABEL_OVERRIDES[v];

  const spaced = v.replace(/[_-]+/g, " ");
  return titleCaseTr(spaced);
};

export const buildEnumOptionsTr = (
  current: string,
  api?: string[],
  fallback?: readonly string[],
): SelectOption[] => {
  const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

  const mergedRaw = [
    ...(fallback ? [...fallback] : []),
    ...(api ? api : []),
    ...(current ? [current] : []),
  ];

  const normalizedValues = uniq(
    mergedRaw.map((x) => normalizeEnumValueTr(x)).filter(Boolean),
  );

  return normalizedValues.map((value) => ({
    value,
    label: labelFromEnumValueTr(value),
  }));
};

/**
 * Select için: exactOptionalPropertyTypes uyumlu value spread
 * - value boşsa prop göndermez
 */
export const selectValueProps = (v: string) => {
  const s = String(v ?? "").trim();
  return s ? ({ value: s } as const) : ({} as const);
};
