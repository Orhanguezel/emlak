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

/**
 * ✅ Çoklu upload response parse (items tamamını çıkarır)
 */
export const extractUploadResults = (res: any): UploadExtract[] => {
  const raw =
    res?.items ??
    res?.data?.items ??
    res?.result?.items ??
    res?.data ??
    res?.result ??
    res ??
    [];

  const arr = Array.isArray(raw) ? raw : [raw];
  const flat = arr.flat().filter(Boolean);

  const mapped = flat.map((it: any) => {
    const id =
      it?.id ??
      it?.asset_id ??
      it?.assetId ??
      it?.file_id ??
      null;

    const url =
      it?.url ??
      it?.publicUrl ??
      it?.public_url ??
      it?.cdn_url ??
      null;

    return {
      id: typeof id === "string" && id.trim() ? id : null,
      url: typeof url === "string" && url.trim() ? url : null,
    };
  });

  // uniq by id/url (en azından aynı item tekrarı olmasın)
  const key = (x: UploadExtract) => `${x.id ?? ""}|${x.url ?? ""}`;
  return Array.from(new Map(mapped.map((x) => [key(x), x])).values());
};

/* =========================================================
   ✅ Enum value/label normalizasyon helpers
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
 * Genel enum normalize (snake_case)  ✅
 * NOT: rooms gibi "2+0" alanlarında kullanılmamalı.
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

/**
 * ✅ ROOMS normalize: backend enum formatı "N+M"
 * - "2+0" => "2+0"
 * - "2_0" / "2-0" / "2 0" / "2 x 0" => "2+0"
 */
export const normalizeRoomsValueTr = (input: unknown): string => {
  const raw = String(input ?? "").trim();
  if (!raw) return "";

  // 2_0 / 2-0 / 2 0 / 2+0 / 2x0 / 2×0 -> 2+0
  const m = raw.match(/^\s*(\d+)\s*([+x×_\-\s])\s*(\d+)\s*$/i);
  if (m) return `${m[1]}+${m[3]}`;

  // Son çare: içindeki sayıları yakala (örn "2 + 0 oda")
  const nums = raw.match(/\d+/g);
  if (nums && nums.length >= 2) return `${nums[0]}+${nums[1]}`;

  return raw; // fallback
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

export const selectValueProps = (v: string) => {
  const s = String(v ?? "").trim();
  return s ? ({ value: s } as const) : ({} as const);
};
