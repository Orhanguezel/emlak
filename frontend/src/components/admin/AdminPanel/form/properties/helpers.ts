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
