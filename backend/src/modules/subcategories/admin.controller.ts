// =============================================================
// FILE: src/modules/subcategories/admin.controller.ts
// =============================================================
import type { RouteHandler } from "fastify";
import { db } from "@/db/client";
import { subCategories } from "./schema";
import { storageAssets } from "@/modules/storage/schema";
import { and, or, like, eq, sql, asc, desc } from "drizzle-orm";
import {
  subCategoryCreateSchema, subCategoryUpdateSchema, subCategorySetImageSchema,
  type SubCategoryCreateInput, type SubCategoryUpdateInput, type SubCategorySetImageInput,
} from "./validation";
import { buildInsertPayload, buildUpdatePayload } from "./controller";
import { env } from "@/core/env";

const toBool = (v: unknown): boolean | undefined => {
  if (v === undefined) return undefined;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase();
  if (s === "true" || s === "1") return true;
  if (s === "false" || s === "0") return false;
  return undefined;
};
const toNum = (v: unknown, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

// LIST QS tipi
export type AdminSubListQS = {
  q?: string;
  category_id?: string;
  is_active?: string | boolean;
  is_featured?: string | boolean;
  limit?: number | string;
  offset?: number | string;
  sort?: "display_order" | "name" | "created_at" | "updated_at";
  order?: "asc" | "desc";
};

function publicUrlOf(bucket: string, path: string, providerUrl?: string | null) {
  if (providerUrl) return providerUrl;
  const encSeg = (s: string) => encodeURIComponent(s);
  const encPath = (p: string) => p.split("/").map(encSeg).join("/");
  const cdnBase = (env.CDN_PUBLIC_BASE || "").replace(/\/+$/, "");
  if (cdnBase) return `${cdnBase}/${encSeg(bucket)}/${encPath(path)}`;
  const apiBase = (env.PUBLIC_API_BASE || "").replace(/\/+$/, "");
  return `${apiBase || ""}/storage/${encSeg(bucket)}/${encPath(path)}`;
}
const isDup = (e: any) => (e?.code ?? e?.errno) === "ER_DUP_ENTRY" || (e?.code ?? e?.errno) === 1062;
const isFk = (e: any) => (e?.code ?? e?.errno) === "ER_NO_REFERENCED_ROW_2" || (e?.code ?? e?.errno) === 1452;

/* CREATE */
export const adminCreateSubCategory: RouteHandler<{ Body: SubCategoryCreateInput }> = async (req, reply) => {
  const parsed = subCategoryCreateSchema.safeParse(req.body);
  if (!parsed.success) return reply.code(400).send({ error: { message: "invalid_body", issues: parsed.error.flatten() } });
  const payload = buildInsertPayload(parsed.data);
  try {
    await db.insert(subCategories).values(payload);
  } catch (err: any) {
    if (isDup(err)) return reply.code(409).send({ error: { message: "duplicate_slug_in_category" } });
    if (isFk(err)) return reply.code(400).send({ error: { message: "invalid_category_id" } });
    return reply.code(500).send({ error: { message: "db_error", detail: String(err?.message ?? err) } });
  }
  const [row] = await db.select().from(subCategories).where(eq(subCategories.id, payload.id)).limit(1);
  return reply.code(201).send(row);
};

/* PUT */
export const adminPutSubCategory: RouteHandler<{ Params: { id: string }; Body: SubCategoryUpdateInput }> =
  async (req, reply) => {
    const { id } = req.params;
    const parsed = subCategoryUpdateSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: { message: "invalid_body", issues: parsed.error.flatten() } });
    const set = buildUpdatePayload(parsed.data);
    try {
      await db.update(subCategories).set(set as any).where(eq(subCategories.id, id));
    } catch (err: any) {
      if (isDup(err)) return reply.code(409).send({ error: { message: "duplicate_slug_in_category" } });
      if (isFk(err)) return reply.code(400).send({ error: { message: "invalid_category_id" } });
      return reply.code(500).send({ error: { message: "db_error", detail: String(err?.message ?? err) } });
    }
    const rows = await db.select().from(subCategories).where(eq(subCategories.id, id)).limit(1);
    if (!rows.length) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(rows[0]);
  };

/* PATCH */
export const adminPatchSubCategory: RouteHandler<{ Params: { id: string }; Body: SubCategoryUpdateInput }> =
  async (req, reply) => {
    const { id } = req.params;
    const parsed = subCategoryUpdateSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: { message: "invalid_body", issues: parsed.error.flatten() } });
    const set = buildUpdatePayload(parsed.data);
    try {
      await db.update(subCategories).set(set as any).where(eq(subCategories.id, id));
    } catch (err: any) {
      if (isDup(err)) return reply.code(409).send({ error: { message: "duplicate_slug_in_category" } });
      if (isFk(err)) return reply.code(400).send({ error: { message: "invalid_category_id" } });
      return reply.code(500).send({ error: { message: "db_error", detail: String(err?.message ?? err) } });
    }
    const rows = await db.select().from(subCategories).where(eq(subCategories.id, id)).limit(1);
    if (!rows.length) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(rows[0]);
  };

/* DELETE */
export const adminDeleteSubCategory: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  await db.delete(subCategories).where(eq(subCategories.id, req.params.id));
  return reply.code(204).send();
};

/* REORDER */
export const adminReorderSubCategories: RouteHandler<{ Body: { items: Array<{ id: string; display_order: number }> } }> =
  async (req, reply) => {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!items.length) return reply.send({ ok: true });
    for (const it of items) {
      await db
        .update(subCategories)
        .set({ display_order: Number(it.display_order) || 0, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
        .where(eq(subCategories.id, it.id));
    }
    return reply.send({ ok: true });
  };

/* ACTIVE */
export const adminToggleSubActive: RouteHandler<{ Params: { id: string }; Body: { is_active: boolean } }> =
  async (req, reply) => {
    await db.update(subCategories)
      .set({ is_active: !!req.body?.is_active, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
      .where(eq(subCategories.id, req.params.id));
    const rows = await db.select().from(subCategories).where(eq(subCategories.id, req.params.id)).limit(1);
    if (!rows.length) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(rows[0]);
  };

/* FEATURED */
export const adminToggleSubFeatured: RouteHandler<{ Params: { id: string }; Body: { is_featured: boolean } }> =
  async (req, reply) => {
    await db.update(subCategories)
      .set({ is_featured: !!req.body?.is_featured, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
      .where(eq(subCategories.id, req.params.id));
    const rows = await db.select().from(subCategories).where(eq(subCategories.id, req.params.id)).limit(1);
    if (!rows.length) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(rows[0]);
  };

/* IMAGE (asset_id + alt) */
export const adminSetSubCategoryImage: RouteHandler<{ Params: { id: string }; Body: SubCategorySetImageInput }> =
  async (req, reply) => {
    const { id } = req.params;
    const parsed = subCategorySetImageSchema.safeParse(req.body ?? {});
    if (!parsed.success) return reply.code(400).send({ error: { message: "invalid_body", issues: parsed.error.flatten() } });
    const assetId = parsed.data.asset_id ?? null;
    const alt = parsed.data.alt;

    if (!assetId) {
      const patch: Record<string, unknown> = { image_url: null, storage_asset_id: null, updated_at: sql`CURRENT_TIMESTAMP(3)` };
      if (alt !== undefined) patch.alt = alt as string | null;
      await db.update(subCategories).set(patch as any).where(eq(subCategories.id, id));
      const rows = await db.select().from(subCategories).where(eq(subCategories.id, id)).limit(1);
      if (!rows.length) return reply.code(404).send({ error: { message: "not_found" } });
      return reply.send(rows[0]);
    }

    const [asset] = await db.select({ bucket: storageAssets.bucket, path: storageAssets.path, url: storageAssets.url })
      .from(storageAssets).where(eq(storageAssets.id, assetId)).limit(1);
    if (!asset) return reply.code(404).send({ error: { message: "asset_not_found" } });

    const publicUrl = publicUrlOf(asset.bucket, asset.path, asset.url ?? null);
    const patch: Record<string, unknown> = {
      image_url: publicUrl, storage_asset_id: assetId, updated_at: sql`CURRENT_TIMESTAMP(3)`,
    };
    if (alt !== undefined) patch.alt = alt as string | null;

    await db.update(subCategories).set(patch as any).where(eq(subCategories.id, id));
    const rows = await db.select().from(subCategories).where(eq(subCategories.id, id)).limit(1);
    if (!rows.length) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(rows[0]);
  };

/* LIST */
export const adminListSubCategories: RouteHandler<{ Querystring: AdminSubListQS }> = async (req, reply) => {
  const { q, category_id, is_active, is_featured, limit = 500, offset = 0, sort = "display_order", order = "asc" } = req.query ?? {};
  const conds: any[] = [];
  if (q && q.trim()) {
    const p = `%${q.trim()}%`;
    conds.push(or(like(subCategories.name, p), like(subCategories.slug, p)));
  }
  if (category_id) conds.push(eq(subCategories.category_id, category_id));
  const a = toBool(is_active); if (a !== undefined) conds.push(eq(subCategories.is_active, a));
  const f = toBool(is_featured); if (f !== undefined) conds.push(eq(subCategories.is_featured, f));

  const col =
    sort === "name" ? subCategories.name :
      sort === "created_at" ? subCategories.created_at :
        sort === "updated_at" ? subCategories.updated_at :
          subCategories.display_order;

  let qb = db.select().from(subCategories).$dynamic();
  if (conds.length) qb = qb.where(and(...conds));

  const rows = await qb
    .orderBy(order === "desc" ? desc(col) : asc(col))
    .limit(toNum(limit, 500))
    .offset(toNum(offset, 0));

  return reply.send(rows);
};

/* GET BY ID */
export const adminGetSubCategoryById: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const rows = await db.select().from(subCategories).where(eq(subCategories.id, req.params.id)).limit(1);
  if (!rows.length) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(rows[0]);
};

/* GET BY SLUG (opsiyonel category_id) */
export const adminGetSubCategoryBySlug: RouteHandler<{ Params: { slug: string }; Querystring: { category_id?: string } }> =
  async (req, reply) => {
    const conds: any[] = [eq(subCategories.slug, req.params.slug)];
    if (req.query?.category_id) conds.push(eq(subCategories.category_id, req.query.category_id));
    const rows = await db.select().from(subCategories).where(and(...conds)).limit(1);
    if (!rows.length) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(rows[0]);
  };
