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
  // kelimeleri ayır, TR locale ile büyük/küçük
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
 * API’den gelen "Yazlık", "yazlik", "YAZLIK" gibi değerleri
 * enum/DB formatına çevirir.
 *
 * - Türkçe karakterleri normalize eder
 * - boşluk/-,/ benzeri ayırıcıları "_" yapar
 */
export const normalizeEnumValueTr = (input: unknown): string => {
  const raw = String(input ?? "").trim();
  if (!raw) return "";

  // TR -> ascii benzeri normalize (NFD + diacritics)
  const s = raw
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // TR özel harfler (NFD sonrası bazıları kalabilir)
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");

  // ayırıcıları "_" yap
  const underscored = s
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return underscored;
};

/**
 * Enum value -> kullanıcı label (TR)
 * - "_" "-" -> boşluk
 * - bazı özel düzeltmeler (istersen genişlet)
 */
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

  // genel dönüşüm: "koy_evi" => "Koy Evi" (sonra TR title case)
  const spaced = v.replace(/[_-]+/g, " ");
  return titleCaseTr(spaced);
};

/**
 * options üret:
 * - fallback enum listesi + api listesi + current değer
 * - hepsini normalize edip uniq yapar
 * - UI label’larını düzgün üretir
 */
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
