// =============================================================
// FILE: src/modules/slider/repository.ts
// =============================================================
import { db } from "@/db/client";
import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import { slider, type SliderRow } from "./schema";
import { storageAssets } from "@/modules/storage/schema";
import type {
  AdminListQuery,
  CreateBody,
  PublicListQuery,
  UpdateBody,
  SetImageBody,
} from "./validation";
import { randomUUID } from "crypto";
import { env } from "@/core/env";

export type RowWithAsset = { sl: SliderRow; asset_url: string | null };

function toBoolNum(v: boolean) {
  return v ? 1 : 0;
}

const ORDER = {
  display_order: slider.display_order,
  name: slider.name,
  created_at: slider.created_at,
  updated_at: slider.updated_at,
} as const;

function orderExpr(sort: keyof typeof ORDER, dir: "asc" | "desc") {
  const col = ORDER[sort] ?? ORDER.display_order;
  return dir === "asc" ? asc(col) : desc(col);
}

/** Provider URL varsa onu, yoksa /storage/:bucket/:path */
function publicUrlOf(bucket?: string | null, path?: string | null, providerUrl?: string | null) {
  if (providerUrl) return providerUrl;
  if (!bucket || !path) return null;

  const encSeg = (s: string) => encodeURIComponent(s);
  const encPath = path.split("/").map(encSeg).join("/");

  const cdnBase = (env.CDN_PUBLIC_BASE || "").replace(/\/+$/, "");
  if (cdnBase) return `${cdnBase}/${encSeg(bucket)}/${encPath}`;

  const apiBase = (env.PUBLIC_API_BASE || "").replace(/\/+$/, "");
  return `${apiBase || ""}/storage/${encSeg(bucket)}/${encPath}`;
}

/* ===================== PUBLIC ===================== */

export async function repoListPublic(q: PublicListQuery): Promise<RowWithAsset[]> {
  const conds = [eq(slider.is_active, 1 as const)];
  if (q.q) {
    const s = `%${q.q.trim()}%`;
    conds.push(like(slider.name, s));
  }

  const rows = await db
    .select({
      sl: slider,
      asset_bucket: storageAssets.bucket,
      asset_path: storageAssets.path,
      asset_url0: storageAssets.url,
    })
    .from(slider)
    .leftJoin(storageAssets, eq(slider.image_asset_id, storageAssets.id))
    .where(and(...conds))
    .orderBy(orderExpr(q.sort, q.order), asc(slider.display_order), asc(slider.id))
    .limit(q.limit)
    .offset(q.offset);

  return rows.map((r) => ({
    sl: r.sl,
    asset_url: publicUrlOf(r.asset_bucket, r.asset_path, r.asset_url0) ?? r.sl.image_url ?? null,
  }));
}

export async function repoGetBySlug(slugStr: string): Promise<RowWithAsset | null> {
  const rows = await db
    .select({
      sl: slider,
      asset_bucket: storageAssets.bucket,
      asset_path: storageAssets.path,
      asset_url0: storageAssets.url,
    })
    .from(slider)
    .leftJoin(storageAssets, eq(slider.image_asset_id, storageAssets.id))
    .where(eq(slider.slug, slugStr))
    .limit(1);

  if (!rows.length) return null;
  const r = rows[0];
  return {
    sl: r.sl,
    asset_url: publicUrlOf(r.asset_bucket, r.asset_path, r.asset_url0) ?? r.sl.image_url ?? null,
  };
}

/* ===================== ADMIN ===================== */

export async function repoListAdmin(q: AdminListQuery): Promise<RowWithAsset[]> {
  const conds = [] as any[];
  if (typeof q.is_active === "boolean") conds.push(eq(slider.is_active, toBoolNum(q.is_active)));
  if (q.q) {
    const s = `%${q.q.trim()}%`;
    conds.push(like(slider.name, s));
  }
  const where = conds.length ? and(...conds) : undefined;

  const rows = await db
    .select({
      sl: slider,
      asset_bucket: storageAssets.bucket,
      asset_path: storageAssets.path,
      asset_url0: storageAssets.url,
    })
    .from(slider)
    .leftJoin(storageAssets, eq(slider.image_asset_id, storageAssets.id))
    .where(where as any)
    .orderBy(orderExpr(q.sort, q.order), asc(slider.display_order), asc(slider.id))
    .limit(q.limit)
    .offset(q.offset);

  return rows.map((r) => ({
    sl: r.sl,
    asset_url: publicUrlOf(r.asset_bucket, r.asset_path, r.asset_url0) ?? r.sl.image_url ?? null,
  }));
}

export async function repoGetById(id: number): Promise<RowWithAsset | null> {
  const rows = await db
    .select({
      sl: slider,
      asset_bucket: storageAssets.bucket,
      asset_path: storageAssets.path,
      asset_url0: storageAssets.url,
    })
    .from(slider)
    .leftJoin(storageAssets, eq(slider.image_asset_id, storageAssets.id))
    .where(eq(slider.id, id))
    .limit(1);

  if (!rows.length) return null;
  const r = rows[0];
  return {
    sl: r.sl,
    asset_url: publicUrlOf(r.asset_bucket, r.asset_path, r.asset_url0) ?? r.sl.image_url ?? null,
  };
}

export async function repoCreate(b: CreateBody): Promise<RowWithAsset> {
  const nowMaxOrder = await db
    .select({ maxOrder: sql<number>`COALESCE(MAX(${slider.display_order}), 0)` })
    .from(slider);

  const toInsert = {
    uuid: randomUUID(),
    name: b.name,
    slug: (b.slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")).slice(0, 255),
    description: b.description ?? null,

    image_url: b.image_url ?? null,
    image_asset_id: b.image_asset_id ?? null,

    alt: b.alt ?? null,
    buttonText: b.buttonText ?? null,
    buttonLink: b.buttonLink ?? null,

    featured: b.featured ? 1 : 0,
    is_active: b.is_active ? 1 : 0,

    display_order: b.display_order ?? (nowMaxOrder[0]?.maxOrder ?? 0) + 1,
  };

  await db.insert(slider).values(toInsert);
  const row = await repoGetBySlug(toInsert.slug);
  if (!row) throw new Error("create_failed");
  return row;
}

export async function repoUpdate(id: number, b: UpdateBody): Promise<RowWithAsset | null> {
  const set: Record<string, unknown> = {
    updated_at: sql`CURRENT_TIMESTAMP(3)`,
  };
  if (b.name !== undefined) set.name = b.name;
  if (b.slug !== undefined) set.slug = b.slug;
  if (b.description !== undefined) set.description = b.description ?? null;

  if (b.image_url !== undefined) set.image_url = b.image_url ?? null;
  if (b.image_asset_id !== undefined) set.image_asset_id = b.image_asset_id ?? null;

  if (b.alt !== undefined) set.alt = b.alt ?? null;
  if (b.buttonText !== undefined) set.buttonText = b.buttonText ?? null;
  if (b.buttonLink !== undefined) set.buttonLink = b.buttonLink ?? null;

  if (b.featured !== undefined) set.featured = b.featured ? 1 : 0;
  if (b.is_active !== undefined) set.is_active = b.is_active ? 1 : 0;
  if (b.display_order !== undefined) set.display_order = b.display_order;

  await db.update(slider).set(set as any).where(eq(slider.id, id));
  return repoGetById(id);
}

export async function repoDelete(id: number): Promise<void> {
  await db.delete(slider).where(eq(slider.id, id));
}

export async function repoReorder(ids: number[]): Promise<void> {
  for (let i = 0; i < ids.length; i++) {
    await db
      .update(slider)
      .set({ display_order: i + 1, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
      .where(eq(slider.id, ids[i]));
  }
}

export async function repoSetStatus(id: number, isActive: boolean): Promise<RowWithAsset | null> {
  await db
    .update(slider)
    .set({ is_active: isActive ? 1 : 0, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
    .where(eq(slider.id, id));
  return repoGetById(id);
}

/** ✅ Kategori ile aynı davranış: asset_id verilirse URL/asset_id set; null/undefined ⇒ temizle */
export async function repoSetImage(id: number, body: SetImageBody): Promise<RowWithAsset | null> {
  const assetId = body.asset_id ?? null;

  if (!assetId) {
    await db
      .update(slider)
      .set({ image_url: null, image_asset_id: null, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
      .where(eq(slider.id, id));
    return repoGetById(id);
  }

  const [asset] = await db
    .select({ bucket: storageAssets.bucket, path: storageAssets.path, url: storageAssets.url })
    .from(storageAssets)
    .where(eq(storageAssets.id, assetId))
    .limit(1);

  if (!asset) return null;

  const url = publicUrlOf(asset.bucket, asset.path, asset.url ?? null);

  await db
    .update(slider)
    .set({ image_url: url, image_asset_id: assetId, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
    .where(eq(slider.id, id));

  return repoGetById(id);
}
