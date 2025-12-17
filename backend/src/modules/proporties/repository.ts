// =============================================================
// FILE: src/modules/properties/repository.ts
// FINAL: multi-select enum alanlar + tmp_* gallery fix + JSON filters
// =============================================================
import { randomUUID } from "node:crypto";
import { db } from "@/db/client";
import {
  properties,
  property_assets,
  type PropertyRow,
  type NewPropertyRow,
  type PropertyAssetRow,
  type NewPropertyAssetRow,
  rowToPublicView,
  rowToAdminView,
  type PropertyPublicView,
  type PropertyAdminView,
} from "./schema";

import {
  and,
  asc,
  desc,
  eq,
  gte,
  lte,
  like,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

// storage integration
import {
  getByIds as getStorageByIds,
  deleteManyByIds as deleteStorageManyByIds,
} from "@/modules/storage/repository";
import { destroyCloudinaryById, getCloudinaryConfig } from "@/modules/storage/cloudinary";
import { buildPublicUrl } from "@/modules/storage/util";

/** Güvenilir sıralama kolonları */
type Sortable = "created_at" | "updated_at" | "price" | "gross_m2" | "net_m2";
export type BoolLike = boolean | 0 | 1 | "0" | "1" | "true" | "false";

export type ListParams = {
  orderParam?: string;
  sort?: Sortable;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;

  is_active?: BoolLike;
  featured?: BoolLike;

  q?: string;
  slug?: string;
  district?: string;
  city?: string;
  neighborhood?: string;
  type?: string;
  status?: string;

  price_min?: number;
  price_max?: number;
  gross_m2_min?: number;
  gross_m2_max?: number;
  net_m2_min?: number;
  net_m2_max?: number;

  // legacy tekli
  rooms?: string;
  // ✅ multi-select (enum string[])
  rooms_multi?: string[] | string;

  bedrooms_min?: number;
  bedrooms_max?: number;

  building_age?: string;

  floor?: string;
  floor_no_min?: number;
  floor_no_max?: number;
  total_floors_min?: number;
  total_floors_max?: number;

  // legacy tekli
  heating?: string;
  // ✅ multi-select
  heating_multi?: string[] | string;

  // legacy tekli
  usage_status?: string;
  // ✅ multi-select
  usage_status_multi?: string[] | string;

  furnished?: BoolLike;
  in_site?: BoolLike;
  has_balcony?: BoolLike;
  has_parking?: BoolLike;
  has_elevator?: BoolLike;
  has_garden?: BoolLike;
  has_terrace?: BoolLike;
  credit_eligible?: BoolLike;
  swap?: BoolLike;
  has_video?: BoolLike;
  has_clip?: BoolLike;
  has_virtual_tour?: BoolLike;
  has_map?: BoolLike;
  accessible?: BoolLike;

  created_from?: string;
  created_to?: string;
};

export type PropertyAssetAdminView = {
  id: string;
  asset_id: string | null;
  url: string | null; // resolved
  alt: string | null;
  kind: "image" | "video" | "plan" | string;
  mime: string | null;
  is_cover: boolean;
  display_order: number;
};

const to01 = (v: BoolLike | undefined): 0 | 1 | undefined => {
  if (v === true || v === 1 || v === "1" || v === "true") return 1;
  if (v === false || v === 0 || v === "0" || v === "false") return 0;
  return undefined;
};

const parseOrder = (
  orderParam?: string,
  sort?: Sortable,
  ord?: "asc" | "desc",
): { col: Sortable; dir: "asc" | "desc" } | null => {
  if (orderParam) {
    const m = orderParam.match(/^([a-zA-Z0-9_]+)\.(asc|desc)$/);
    const col = m?.[1] as Sortable | undefined;
    const dir = m?.[2] as "asc" | "desc" | undefined;
    if (col && dir) {
      const ok: Sortable[] = ["created_at", "updated_at", "price", "gross_m2", "net_m2"];
      if (ok.includes(col)) return { col, dir };
    }
  }
  if (sort && ord) return { col: sort, dir: ord };
  return null;
};

const isNonEmpty = (s?: string | null) => typeof s === "string" && s.trim().length > 0;

function isUuid36(x: unknown): x is string {
  return typeof x === "string" && x.length === 36;
}

// query: string | string[] | "a,b,c"
function toArray(v: unknown): string[] | undefined {
  if (v == null) return undefined;
  if (Array.isArray(v)) {
    const out = v.map((x) => String(x).trim()).filter(Boolean);
    return out.length ? out : undefined;
  }
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return undefined;
    if (s.includes(",")) {
      const out = s.split(",").map((x) => x.trim()).filter(Boolean);
      return out.length ? out : undefined;
    }
    return [s];
  }
  return undefined;
}

/**
 * MySQL JSON array contains helper:
 * JSON_CONTAINS(col, JSON_QUOTE('kombi'), '$')
 * Drizzle: sql`JSON_CONTAINS(${col}, ${JSON.stringify(value)}, '$')`
 */
function jsonContains(col: any, value: string): SQL {
  return sql`JSON_CONTAINS(${col}, ${JSON.stringify(value)}, '$')`;
}

/** (multi) filter: any-of values */
function jsonContainsAny(col: any, values: string[]): SQL | undefined {
  const vs = values.map((x) => String(x).trim()).filter(Boolean);
  if (!vs.length) return undefined;
  const parts = vs.map((v) => jsonContains(col, v));
  return (or(...(parts as any)) as unknown) as SQL;
}

function buildWhere(params: ListParams): SQL | undefined {
  const filters: SQL[] = [];

  const act = to01(params.is_active);
  if (act !== undefined) filters.push(eq(properties.is_active, act));

  const feat = to01(params.featured);
  if (feat !== undefined) filters.push(eq(properties.featured, feat));

  if (isNonEmpty(params.slug)) filters.push(eq(properties.slug, params.slug!.trim()));
  if (isNonEmpty(params.district)) filters.push(eq(properties.district, params.district!.trim()));
  if (isNonEmpty(params.city)) filters.push(eq(properties.city, params.city!.trim()));
  if (isNonEmpty(params.neighborhood)) filters.push(eq(properties.neighborhood, params.neighborhood!.trim()));
  if (isNonEmpty(params.type)) filters.push(eq(properties.type, params.type!.trim()));
  if (isNonEmpty(params.status)) filters.push(eq(properties.status, params.status!.trim()));

  if (typeof params.price_min === "number") {
    filters.push(gte(sql`CAST(${properties.price} AS DECIMAL(12,2))`, params.price_min));
  }
  if (typeof params.price_max === "number") {
    filters.push(lte(sql`CAST(${properties.price} AS DECIMAL(12,2))`, params.price_max));
  }

  if (typeof params.gross_m2_min === "number") filters.push(gte(properties.gross_m2, params.gross_m2_min));
  if (typeof params.gross_m2_max === "number") filters.push(lte(properties.gross_m2, params.gross_m2_max));
  if (typeof params.net_m2_min === "number") filters.push(gte(properties.net_m2, params.net_m2_min));
  if (typeof params.net_m2_max === "number") filters.push(lte(properties.net_m2, params.net_m2_max));

  // legacy tekli
  if (isNonEmpty(params.rooms)) filters.push(eq(properties.rooms, params.rooms!.trim()));

  // ✅ multi rooms filter (JSON)
  const roomsMulti = toArray(params.rooms_multi);
  if (roomsMulti?.length) {
    const expr = jsonContainsAny(properties.rooms_multi, roomsMulti);
    if (expr) filters.push(expr);
  }

  if (typeof params.bedrooms_min === "number") filters.push(gte(properties.bedrooms, params.bedrooms_min));
  if (typeof params.bedrooms_max === "number") filters.push(lte(properties.bedrooms, params.bedrooms_max));

  if (isNonEmpty(params.building_age)) filters.push(eq(properties.building_age, params.building_age!.trim()));

  if (isNonEmpty(params.floor)) filters.push(eq(properties.floor, params.floor!.trim()));
  if (typeof params.floor_no_min === "number") filters.push(gte(properties.floor_no, params.floor_no_min));
  if (typeof params.floor_no_max === "number") filters.push(lte(properties.floor_no, params.floor_no_max));
  if (typeof params.total_floors_min === "number") filters.push(gte(properties.total_floors, params.total_floors_min));
  if (typeof params.total_floors_max === "number") filters.push(lte(properties.total_floors, params.total_floors_max));

  // legacy tekli
  if (isNonEmpty(params.heating)) filters.push(eq(properties.heating, params.heating!.trim()));
  // ✅ multi heating filter (JSON)
  const heatingMulti = toArray(params.heating_multi);
  if (heatingMulti?.length) {
    const expr = jsonContainsAny(properties.heating_multi, heatingMulti);
    if (expr) filters.push(expr);
  }

  // legacy tekli
  if (isNonEmpty(params.usage_status)) filters.push(eq(properties.usage_status, params.usage_status!.trim()));
  // ✅ multi usage filter (JSON)
  const usageMulti = toArray(params.usage_status_multi);
  if (usageMulti?.length) {
    const expr = jsonContainsAny(properties.usage_status_multi, usageMulti);
    if (expr) filters.push(expr);
  }

  const boolPairs: Array<[keyof ListParams, any]> = [
    ["furnished", properties.furnished],
    ["in_site", properties.in_site],
    ["has_balcony", properties.has_balcony],
    ["has_parking", properties.has_parking],
    ["has_elevator", properties.has_elevator],
    ["has_garden", properties.has_garden],
    ["has_terrace", properties.has_terrace],
    ["credit_eligible", properties.credit_eligible],
    ["swap", properties.swap],
    ["has_video", properties.has_video],
    ["has_clip", properties.has_clip],
    ["has_virtual_tour", properties.has_virtual_tour],
    ["has_map", properties.has_map],
    ["accessible", properties.accessible],
  ];

  for (const [k, col] of boolPairs) {
    const v01 = to01(params[k] as BoolLike | undefined);
    if (v01 !== undefined) filters.push(eq(col, v01));
  }

  if (isNonEmpty(params.created_from)) {
    filters.push(gte(properties.created_at, sql`CAST(${params.created_from!.trim()} AS DATETIME)`));
  }
  if (isNonEmpty(params.created_to)) {
    filters.push(lte(properties.created_at, sql`CAST(${params.created_to!.trim()} AS DATETIME)`));
  }

  if (isNonEmpty(params.q)) {
    const s = `%${params.q!.trim()}%`;
    filters.push(
      or(
        like(properties.title, s),
        like(properties.address, s),
        like(properties.district, s),
        like(properties.city, s),
        like(properties.neighborhood, s),
        like(properties.type, s),
        like(properties.status, s),
        like(properties.listing_no, s),
      ) as SQL,
    );
  }

  return filters.length ? (and(...filters) as SQL) : undefined;
}

/* -------------------------------------------------------------------------- */
/*                               ASSETS HELPERS                               */
/* -------------------------------------------------------------------------- */

export type ReplaceAssetInput = {
  id?: string; // tmp_* olabilir
  asset_id?: string | null;
  url?: string | null;
  alt?: string | null;
  kind?: "image" | "video" | "plan" | string;
  mime?: string | null;
  is_cover?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  display_order?: number;
};

const toCover01 = (v: ReplaceAssetInput["is_cover"]): 0 | 1 => {
  if (v === true || v === 1 || v === "1" || v === "true") return 1;
  return 0;
};

async function assertStorageAssetIdsExist(assetIds: string[]) {
  if (!assetIds.length) return;
  const rows = await getStorageByIds(assetIds);
  if (rows.length !== assetIds.length) {
    throw new Error("invalid_asset_ids");
  }
}

/** Admin: property gallery list + resolved URLs (storage preferred) */
export async function listPropertyAssetsAdmin(propertyId: string): Promise<PropertyAssetAdminView[]> {
  const rows = await db
    .select()
    .from(property_assets)
    .where(eq(property_assets.property_id, propertyId))
    .orderBy(desc(property_assets.is_cover), asc(property_assets.display_order), asc(property_assets.created_at));

  if (!rows.length) return [];

  const assetIds = rows
    .map((r) => r.asset_id)
    .filter((x): x is string => isUuid36(x));

  const [cfg, storageRows] = await Promise.all([
    getCloudinaryConfig(),
    assetIds.length ? getStorageByIds(assetIds) : Promise.resolve([]),
  ]);

  const storageMap = new Map<string, any>();
  for (const s of storageRows) storageMap.set(String(s.id), s);

  return rows.map((r) => {
    const storage = r.asset_id ? storageMap.get(String(r.asset_id)) : null;
    const resolvedUrl = storage
      ? buildPublicUrl(storage.bucket, storage.path, storage.url, cfg ?? undefined)
      : (r.url ?? null);

    return {
      id: r.id,
      asset_id: r.asset_id ?? null,
      url: resolvedUrl,
      alt: r.alt ?? null,
      kind: (r.kind ?? "image") as any,
      mime: r.mime ?? null,
      is_cover: r.is_cover === 1,
      display_order: r.display_order ?? 0,
    };
  });
}

/**
 * ✅ Galeriyi komple değiştir (transaction içinde delete+insert)
 * - tmp_* id kabul edilir (DB UUID üretir)
 * - cover teklenir (son true kazansın; yoksa 0)
 * - storage existence check
 * - ardından properties.cover alanları sync edilir
 */
export async function replacePropertyAssets(propertyId: string, assets: ReplaceAssetInput[]) {
  const assetIdsToCheck = assets
    .map((a) => (a.asset_id ? String(a.asset_id) : null))
    .filter((x): x is string => isUuid36(x));

  await assertStorageAssetIdsExist(assetIdsToCheck);

  await db.transaction(async (tx) => {
    await tx.delete(property_assets).where(eq(property_assets.property_id, propertyId));
    if (!assets.length) {
      // cover'ı da temizle
      await tx
        .update(properties)
        .set({
          image_asset_id: null,
          image_url: null,
          alt: null,
          updated_at: new Date(),
        } as any)
        .where(eq(properties.id, propertyId));
      return;
    }

    // ✅ cover normalize: "son true" kazansın; yoksa 0
    const lastCoverReverseIdx = [...assets].reverse().findIndex((a) => toCover01(a.is_cover) === 1);
    const coverIndex = lastCoverReverseIdx >= 0 ? assets.length - 1 - lastCoverReverseIdx : 0;

    const now = new Date();

    const inserts: NewPropertyAssetRow[] = assets.map((a, i) => {
      // ✅ tmp_* veya boş => DB UUID
      const id = isUuid36(a.id) ? String(a.id) : randomUUID();

      const asset_id = a.asset_id ? String(a.asset_id) : null;
      const url = a.url ? String(a.url) : null;

      // safety: en az biri dolu olmalı (validation zaten yapıyor, ama yine de)
      if (!asset_id && !(url && url.trim().length)) {
        throw new Error("asset_id_or_url_required");
      }

      return {
        id,
        property_id: propertyId,
        asset_id,
        url,
        alt: typeof a.alt === "string" ? a.alt : null,
        kind: (a.kind ?? "image") as any,
        mime: a.mime ? String(a.mime) : null,
        is_cover: i === coverIndex ? 1 : 0,
        display_order: typeof a.display_order === "number" ? Math.trunc(a.display_order) : i,
        created_at: now,
        updated_at: now,
      };
    });

    await tx.insert(property_assets).values(inserts as any);

    // ✅ cover sync (cover row’dan properties.image_* derive)
    const cover = inserts[coverIndex];

    const patch: Partial<NewPropertyRow> = {
      alt: cover?.alt ?? null,
      updated_at: new Date(),
    };

    if (cover?.asset_id) {
      patch.image_asset_id = cover.asset_id;
      patch.image_url = null;
    } else {
      patch.image_asset_id = null;
      patch.image_url = cover?.url ?? null;
    }

    await tx.update(properties).set(patch as any).where(eq(properties.id, propertyId));
  });
}

/** Cover alanlarını galeriden derive et (manuel çağrı için bırakıyorum) */
export async function syncPropertyCoverFromAssets(propertyId: string) {
  const rows = await db
    .select()
    .from(property_assets)
    .where(eq(property_assets.property_id, propertyId))
    .orderBy(desc(property_assets.is_cover), asc(property_assets.display_order), asc(property_assets.created_at))
    .limit(1);

  const cover = rows[0] as PropertyAssetRow | undefined;

  if (!cover) {
    await db
      .update(properties)
      .set({
        image_asset_id: null,
        image_url: null,
        alt: null,
        updated_at: new Date(),
      } as any)
      .where(eq(properties.id, propertyId));
    return;
  }

  const patch: Partial<NewPropertyRow> = {
    alt: cover.alt ?? null,
    updated_at: new Date(),
  };

  if (cover.asset_id) {
    patch.image_asset_id = cover.asset_id;
    patch.image_url = null;
  } else {
    patch.image_asset_id = null;
    patch.image_url = cover.url ?? null;
  }

  await db.update(properties).set(patch as any).where(eq(properties.id, propertyId));
}

/* -------------------------------------------------------------------------- */
/*                            COVER URL RESOLVE                                */
/* -------------------------------------------------------------------------- */

async function enrichCoverUrlIfNeeded(view: any) {
  const cfg = await getCloudinaryConfig();

  if (view?.image_asset_id) {
    const storage = await getStorageByIds([String(view.image_asset_id)]);
    const s = storage[0];
    if (s) {
      view.image_url = buildPublicUrl(s.bucket, s.path, s.url, cfg ?? undefined);
    } else {
      view.image_url = view.image_url ?? null;
    }
  }

  return view;
}

/* -------------------------------------------------------------------------- */
/*                    STORAGE CLEANUP ON PROPERTY DELETE                       */
/* -------------------------------------------------------------------------- */

async function cleanupStorageAssetsByIds(assetIds: string[]) {
  const ids = Array.from(new Set(assetIds.filter(isUuid36)));
  if (!ids.length) return;

  const rows = await getStorageByIds(ids);

  for (const r of rows as any[]) {
    const publicId = r.provider_public_id || String(r.path || "").replace(/\.[^.]+$/, "");
    try {
      await destroyCloudinaryById(
        publicId,
        r.provider_resource_type || undefined,
        r.provider || undefined,
      );
    } catch {
      // provider silinemese de devam
    }
  }

  await deleteStorageManyByIds(ids);
}

/* -------------------------------------------------------------------------- */
/*                               LIST / GET                                    */
/* -------------------------------------------------------------------------- */

/** list (PUBLIC) */
export async function listPropertiesPublic(params: ListParams) {
  const whereExpr = buildWhere(params);

  const ord = parseOrder(params.orderParam, params.sort, params.order);
  const orderBy = ord
    ? ord.dir === "asc"
      ? asc(properties[ord.col])
      : desc(properties[ord.col])
    : asc(properties.display_order);

  const take = params.limit && params.limit > 0 ? params.limit : 100;
  const skip = params.offset && params.offset >= 0 ? params.offset : 0;

  const [rows, cnt] = await Promise.all([
    db.select().from(properties).where(whereExpr).orderBy(orderBy).limit(take).offset(skip),
    db.select({ c: sql<number>`COUNT(1)` }).from(properties).where(whereExpr),
  ]);

  const items: PropertyPublicView[] = (rows as PropertyRow[]).map(rowToPublicView);
  const total = cnt[0]?.c ?? 0;
  return { items, total };
}

/** list (ADMIN) */
export async function listPropertiesAdmin(params: ListParams) {
  const whereExpr = buildWhere(params);

  const ord = parseOrder(params.orderParam, params.sort, params.order);
  const orderBy = ord
    ? ord.dir === "asc"
      ? asc(properties[ord.col])
      : desc(properties[ord.col])
    : asc(properties.display_order);

  const take = params.limit && params.limit > 0 ? params.limit : 100;
  const skip = params.offset && params.offset >= 0 ? params.offset : 0;

  const [rows, cnt] = await Promise.all([
    db.select().from(properties).where(whereExpr).orderBy(orderBy).limit(take).offset(skip),
    db.select({ c: sql<number>`COUNT(1)` }).from(properties).where(whereExpr),
  ]);

  const items: PropertyAdminView[] = (rows as PropertyRow[]).map(rowToAdminView);
  const total = cnt[0]?.c ?? 0;
  return { items, total };
}

/** get by id (ADMIN) + assets[] + cover resolved */
export async function getPropertyByIdAdmin(id: string) {
  const rows = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  if (!rows[0]) return null;

  const base = rowToAdminView(rows[0] as PropertyRow) as any;
  await enrichCoverUrlIfNeeded(base);

  base.assets = await listPropertyAssetsAdmin(String(base.id));
  return base as PropertyAdminView & { assets: PropertyAssetAdminView[] };
}

/** get by slug (ADMIN) + assets[] + cover resolved */
export async function getPropertyBySlugAdmin(slug: string) {
  const rows = await db.select().from(properties).where(eq(properties.slug, slug)).limit(1);
  if (!rows[0]) return null;

  const base = rowToAdminView(rows[0] as PropertyRow) as any;
  await enrichCoverUrlIfNeeded(base);

  base.assets = await listPropertyAssetsAdmin(String(base.id));
  return base as PropertyAdminView & { assets: PropertyAssetAdminView[] };
}

/** create (ADMIN) */
export async function createProperty(values: NewPropertyRow) {
  // ✅ Multi alanlar schema’da var; values içinde gelebilir
  await db.insert(properties).values(values as any);
  return getPropertyByIdAdmin(values.id);
}

/** update (ADMIN, partial) */
export async function updateProperty(id: string, patch: Partial<NewPropertyRow>) {
  await db.update(properties).set({ ...patch, updated_at: new Date() } as any).where(eq(properties.id, id));
  return getPropertyByIdAdmin(id);
}

/** delete (hard, ADMIN) - ✅ deletes property_assets + related storage files/rows */
export async function deleteProperty(id: string) {
  const [galleryRows, propRows] = await Promise.all([
    db
      .select({ asset_id: property_assets.asset_id })
      .from(property_assets)
      .where(eq(property_assets.property_id, id)),
    db
      .select({ image_asset_id: properties.image_asset_id })
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1),
  ]);

  const assetIds: string[] = [];

  for (const r of galleryRows) {
    if (isUuid36(r.asset_id)) assetIds.push(String(r.asset_id));
  }
  const coverId = propRows[0]?.image_asset_id;
  if (isUuid36(coverId)) assetIds.push(String(coverId));

  await db.delete(property_assets).where(eq(property_assets.property_id, id));

  const res = await db.delete(properties).where(eq(properties.id, id)).execute();
  const affected =
    typeof (res as unknown as { affectedRows?: number }).affectedRows === "number"
      ? (res as unknown as { affectedRows: number }).affectedRows
      : 0;

  if (affected > 0) {
    await cleanupStorageAssetsByIds(assetIds);
  }

  return affected;
}

/** meta: distinct districts */
export async function listDistricts(): Promise<string[]> {
  const rows = await db
    .select({ d: properties.district })
    .from(properties)
    .groupBy(properties.district)
    .orderBy(asc(properties.district));
  return rows.map((r) => r.d);
}

/** meta: distinct cities */
export async function listCities(): Promise<string[]> {
  const rows = await db
    .select({ c: properties.city })
    .from(properties)
    .groupBy(properties.city)
    .orderBy(asc(properties.city));
  return rows.map((r) => r.c);
}

/** meta: distinct neighborhoods */
export async function listNeighborhoods(): Promise<string[]> {
  const rows = await db
    .select({ n: properties.neighborhood })
    .from(properties)
    .where(sql`${properties.neighborhood} IS NOT NULL`)
    .groupBy(properties.neighborhood)
    .orderBy(asc(properties.neighborhood));
  return rows.map((r) => String(r.n));
}

/** meta: distinct types */
export async function listTypes(): Promise<string[]> {
  const rows = await db
    .select({ t: properties.type })
    .from(properties)
    .groupBy(properties.type)
    .orderBy(asc(properties.type));
  return rows.map((r) => r.t);
}

/** meta: distinct statuses */
export async function listStatuses(): Promise<string[]> {
  const rows = await db
    .select({ s: properties.status })
    .from(properties)
    .groupBy(properties.status)
    .orderBy(asc(properties.status));
  return rows.map((r) => r.s);
}

/* -------------------------------------------------------------------------- */
/*                           PUBLIC ASSETS HELPERS                             */
/* -------------------------------------------------------------------------- */

export type PropertyAssetPublicView = {
  id: string;
  url: string;
  alt: string | null;
  kind: "image" | "video" | "plan" | string;
  mime: string | null;
  is_cover: boolean;
  display_order: number;
};

async function listPropertyAssetsPublic(propertyId: string): Promise<PropertyAssetPublicView[]> {
  const rows = await db
    .select()
    .from(property_assets)
    .where(eq(property_assets.property_id, propertyId))
    .orderBy(desc(property_assets.is_cover), asc(property_assets.display_order), asc(property_assets.created_at));

  if (!rows.length) return [];

  const assetIds = rows
    .map((r) => r.asset_id)
    .filter((x): x is string => isUuid36(x));

  const [cfg, storageRows] = await Promise.all([
    getCloudinaryConfig(),
    assetIds.length ? getStorageByIds(assetIds) : Promise.resolve([]),
  ]);

  const storageMap = new Map<string, any>();
  for (const s of storageRows) storageMap.set(String(s.id), s);

  return rows
    .map((r) => {
      const storage = r.asset_id ? storageMap.get(String(r.asset_id)) : null;
      const resolvedUrl = storage
        ? buildPublicUrl(storage.bucket, storage.path, storage.url, cfg ?? undefined)
        : (r.url ?? "");

      const url = String(resolvedUrl || "").trim();
      if (!url) return null;

      return {
        id: String(r.id),
        url,
        alt: r.alt ?? null,
        kind: (r.kind ?? "image") as any,
        mime: r.mime ?? null,
        is_cover: r.is_cover === 1,
        display_order: r.display_order ?? 0,
      } as PropertyAssetPublicView;
    })
    .filter(Boolean) as PropertyAssetPublicView[];
}

function attachPublicGallery(base: any, assets: PropertyAssetPublicView[]) {
  const sorted = [...assets].sort((a, b) => {
    if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });

  const images = sorted
    .filter((a) => (a.kind || "").toString().toLowerCase() === "image")
    .map((a) => a.url);

  const cover = typeof base?.image_url === "string" ? base.image_url.trim() : "";
  const imagesFinal = images.length ? images : (cover ? [cover] : []);

  return {
    ...base,
    assets: sorted,
    images: imagesFinal,
    image: imagesFinal[0] ?? cover ?? null,
  };
}

function stripPublicSensitiveFields(view: any) {
  const v = { ...view };
  if ("min_price_admin" in v) v.min_price_admin = null;
  if ("admin_note" in v) v.admin_note = null;
  if ("note_admin" in v) v.note_admin = null;
  if ("internal_note" in v) v.internal_note = null;
  return v;
}

/* -------------------------------------------------------------------------- */
/*                               GET (PUBLIC)                                  */
/* -------------------------------------------------------------------------- */

export async function getPropertyByIdPublic(id: string) {
  const rows = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  if (!rows[0]) return null;

  let base: any = rowToPublicView(rows[0] as PropertyRow);
  base = await enrichCoverUrlIfNeeded(base);

  const assets = await listPropertyAssetsPublic(String(base.id));
  base = attachPublicGallery(base, assets);
  base = stripPublicSensitiveFields(base);

  return base as (PropertyPublicView & { assets: PropertyAssetPublicView[]; images: string[]; image: string | null });
}

export async function getPropertyBySlugPublic(slug: string) {
  const rows = await db.select().from(properties).where(eq(properties.slug, slug)).limit(1);
  if (!rows[0]) return null;

  let base: any = rowToPublicView(rows[0] as PropertyRow);
  base = await enrichCoverUrlIfNeeded(base);

  const assets = await listPropertyAssetsPublic(String(base.id));
  base = attachPublicGallery(base, assets);
  base = stripPublicSensitiveFields(base);

  return base as (PropertyPublicView & { assets: PropertyAssetPublicView[]; images: string[]; image: string | null });
}
