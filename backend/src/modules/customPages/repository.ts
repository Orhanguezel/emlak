// =============================================================
// FILE: src/modules/customPages/repository.ts
// =============================================================
import { db } from "@/db/client";
import { customPages, type NewCustomPageRow, type CustomPageView } from "./schema";
import { storageAssets } from "@/modules/storage/schema";
import { and, asc, desc, eq, like, or, sql, type SQL } from "drizzle-orm";
import { env } from "@/core/env";
import type { SetImageBody } from "./validation";

/** Sadece güvenilir sıralama kolonları */
type Sortable = "created_at" | "updated_at";

export type ListParams = {
  orderParam?: string;
  sort?: Sortable;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;

  is_published?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  q?: string;
  slug?: string;
};

const to01 = (v: ListParams["is_published"]): 0 | 1 | undefined => {
  if (v === true || v === 1 || v === "1" || v === "true") return 1;
  if (v === false || v === 0 || v === "0" || v === "false") return 0;
  return undefined;
};

const parseOrder = (
  orderParam?: string,
  sort?: ListParams["sort"],
  ord?: ListParams["order"],
): { col: Sortable; dir: "asc" | "desc" } | null => {
  if (orderParam) {
    const m = orderParam.match(/^([a-zA-Z0-9_]+)\.(asc|desc)$/);
    const col = m?.[1] as Sortable | undefined;
    const dir = m?.[2] as "asc" | "desc" | undefined;
    if (col && dir && (col === "created_at" || col === "updated_at")) {
      return { col, dir };
    }
  }
  if (sort && ord) return { col: sort, dir: ord };
  return null;
};

const isRec = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

/** JSON-string saklayan content alanı için yardımcı */
export const packContent = (htmlOrJson: string): string => {
  try {
    const parsed = JSON.parse(htmlOrJson) as unknown;
    if (isRec(parsed) && typeof (parsed as any).html === "string") {
      return JSON.stringify({ html: (parsed as any).html });
    }
  } catch { }
  return JSON.stringify({ html: htmlOrJson });
};

/** Provider URL varsa onu, yoksa /storage/:bucket/:path üretir */
function publicUrlOf(bucket?: string | null, path?: string | null, providerUrl?: string | null) {
  if (providerUrl) return providerUrl;
  if (!bucket || !path) return null;

  const enc = (p: string) => p.split("/").map(encodeURIComponent).join("/");
  const cdnBase = (env.CDN_PUBLIC_BASE || "").replace(/\/+$/, "");
  if (cdnBase) return `${cdnBase}/${encodeURIComponent(bucket)}/${enc(path)}`;

  const apiBase = (env.PUBLIC_API_BASE || "").replace(/\/+$/, "");
  return `${apiBase || ""}/storage/${encodeURIComponent(bucket)}/${enc(path)}`;
}

function mapView(row: any): CustomPageView {
  const cp = row.cp ?? row;
  const effective =
    publicUrlOf(row.asset_bucket, row.asset_path, row.asset_url0) ?? cp.image_url ?? null;
  return { ...cp, image_effective_url: effective };
}

/** list (JOIN + effective url) */
export async function listCustomPages(params: ListParams) {
  const filters: SQL[] = [];

  const pub = to01(params.is_published);
  if (pub !== undefined) filters.push(eq(customPages.is_published, pub));

  if (params.slug && params.slug.trim()) {
    filters.push(eq(customPages.slug, params.slug.trim()));
  }

  if (params.q && params.q.trim()) {
    const s = `%${params.q.trim()}%`;
    const titleLike = like(customPages.title, s);
    const slugLike = like(customPages.slug, s);
    const metaTitleLike = like(customPages.meta_title, s);
    const metaDescLike = like(customPages.meta_description, s);
    filters.push(or(titleLike, slugLike, metaTitleLike, metaDescLike) as SQL);
  }

  const whereExpr: SQL | undefined = filters.length ? (and(...filters) as SQL) : undefined;

  const ord = parseOrder(params.orderParam, params.sort, params.order);
  const orderBy = ord
    ? ord.dir === "asc" ? asc(customPages[ord.col]) : desc(customPages[ord.col])
    : desc(customPages.created_at);

  const take = params.limit && params.limit > 0 ? params.limit : 50;
  const skip = params.offset && params.offset >= 0 ? params.offset : 0;

  const [items, cnt] = await Promise.all([
    db
      .select({
        cp: customPages,
        asset_bucket: storageAssets.bucket,
        asset_path: storageAssets.path,
        asset_url0: storageAssets.url,
      })
      .from(customPages)
      .leftJoin(storageAssets, eq(customPages.storage_asset_id, storageAssets.id))
      .where(whereExpr)
      .orderBy(orderBy)
      .limit(take)
      .offset(skip),
    db.select({ c: sql<number>`COUNT(1)` }).from(customPages).where(whereExpr),
  ]);

  const total = cnt[0]?.c ?? 0;
  return { items: items.map(mapView), total };
}

/** get by id (JOIN) */
export async function getCustomPageById(id: string) {
  const rows = await db
    .select({
      cp: customPages,
      asset_bucket: storageAssets.bucket,
      asset_path: storageAssets.path,
      asset_url0: storageAssets.url,
    })
    .from(customPages)
    .leftJoin(storageAssets, eq(customPages.storage_asset_id, storageAssets.id))
    .where(eq(customPages.id, id))
    .limit(1);
  return rows[0] ? mapView(rows[0]) : null;
}

/** get by slug (JOIN) */
export async function getCustomPageBySlug(slug: string) {
  const rows = await db
    .select({
      cp: customPages,
      asset_bucket: storageAssets.bucket,
      asset_path: storageAssets.path,
      asset_url0: storageAssets.url,
    })
    .from(customPages)
    .leftJoin(storageAssets, eq(customPages.storage_asset_id, storageAssets.id))
    .where(eq(customPages.slug, slug))
    .limit(1);
  return rows[0] ? mapView(rows[0]) : null;
}

/** create */
export async function createCustomPage(values: NewCustomPageRow) {
  await db.insert(customPages).values(values);
  return getCustomPageById(values.id);
}

/** update */
export async function updateCustomPage(id: string, patch: Partial<NewCustomPageRow>) {
  await db
    .update(customPages)
    .set({ ...patch, updated_at: new Date() })
    .where(eq(customPages.id, id));
  return getCustomPageById(id);
}

/** ✅ Tek uç: set image (storage patern) */
export async function setCustomPageImage(id: string, body: SetImageBody) {
  const patch: Partial<typeof customPages.$inferInsert> = {};

  // Öncelik: asset_id verildiyse storage’a bağla ve direct URL'i sıfırla.
  if (typeof body.asset_id !== "undefined") {
    patch.storage_asset_id = body.asset_id ?? null;
    if (body.asset_id) {
      patch.image_url = null; // storage aktifken direct URL’yi temizle
    }
  }

  // image_url verildiyse ayarla; çoğu durumda storage’i temizlemek istenir
  if (typeof body.image_url !== "undefined") {
    patch.image_url = body.image_url; // null da olabilir (temizle)
    if (body.image_url) {
      // direct URL kullanıyorsak storage bağını kaldır
      if (typeof patch.storage_asset_id === "undefined") {
        patch.storage_asset_id = null;
      }
    }
  }

  if (typeof body.alt !== "undefined") {
    patch.alt = body.alt; // null veya string
  }

  patch.updated_at = new Date();

  const res = await db.update(customPages)
    .set(patch)
    .where(eq(customPages.id, id))
    .execute();

  // etkilenen satır yoksa id hatalıdır
  if (!("affectedRows" in res) || (res as any).affectedRows === 0) return null;

  // Güncel kaydı döndür
  return await getCustomPageById(id);
}

/** ✅ delete (hard) – kaç satır etkilendiğini döndürür */
export async function deleteCustomPage(id: string) {
  const res = await db.delete(customPages).where(eq(customPages.id, id)).execute();
  const affected =
    typeof (res as unknown as { affectedRows?: number }).affectedRows === "number"
      ? (res as unknown as { affectedRows: number }).affectedRows
      : 0;
  return affected;
}
