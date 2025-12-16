// src/modules/proporties/repository.ts
import { db } from "@/db/client";
import { properties, type PropertyRow, type NewPropertyRow, rowToView, type PropertyView } from "./schema";
import { and, asc, desc, eq, like, or, sql, type SQL } from "drizzle-orm";

/** Sadece güvenilir sıralama kolonları */
type Sortable = "created_at" | "updated_at";

export type ListParams = {
  orderParam?: string;
  sort?: Sortable;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;

  is_active?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  q?: string;
  slug?: string;
  district?: string;
  city?: string;
  type?: string;
  status?: string;
};

const to01 = (v: ListParams["is_active"]): 0 | 1 | undefined => {
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

/** list */
export async function listProperties(params: ListParams) {
  const filters: SQL[] = [];

  const act = to01(params.is_active);
  if (act !== undefined) filters.push(eq(properties.is_active, act));

  if (params.slug && params.slug.trim()) {
    filters.push(eq(properties.slug, params.slug.trim()));
  }
  if (params.district && params.district.trim()) {
    filters.push(eq(properties.district, params.district.trim()));
  }
  if (params.city && params.city.trim()) {
    filters.push(eq(properties.city, params.city.trim()));
  }
  if (params.type && params.type.trim()) {
    filters.push(eq(properties.type, params.type.trim()));
  }
  if (params.status && params.status.trim()) {
    filters.push(eq(properties.status, params.status.trim()));
  }
  if (params.q && params.q.trim()) {
    const s = `%${params.q.trim()}%`;
    const titleLike = like(properties.title, s);
    const addrLike = like(properties.address, s);
    const distLike = like(properties.district, s);
    const cityLike = like(properties.city, s);
    const typeLike = like(properties.type, s);
    const statusLike = like(properties.status, s);
    filters.push(or(titleLike, addrLike, distLike, cityLike, typeLike, statusLike) as SQL);
  }

  const whereExpr: SQL | undefined = filters.length ? (and(...filters) as SQL) : undefined;

  const ord = parseOrder(params.orderParam, params.sort, params.order);
  const orderBy = ord
    ? ord.dir === "asc" ? asc(properties[ord.col]) : desc(properties[ord.col])
    : asc(properties.display_order);

  const take = params.limit && params.limit > 0 ? params.limit : 100;
  const skip = params.offset && params.offset >= 0 ? params.offset : 0;

  const [rows, cnt] = await Promise.all([
    db.select().from(properties).where(whereExpr).orderBy(orderBy).limit(take).offset(skip),
    db.select({ c: sql<number>`COUNT(1)` }).from(properties).where(whereExpr),
  ]);

  const items: PropertyView[] = (rows as PropertyRow[]).map(rowToView);
  const total = cnt[0]?.c ?? 0;
  return { items, total };
}

/** get by id */
export async function getPropertyById(id: string) {
  const rows = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return rows[0] ? rowToView(rows[0] as PropertyRow) : null;
}

/** get by slug */
export async function getPropertyBySlug(slug: string) {
  const rows = await db.select().from(properties).where(eq(properties.slug, slug)).limit(1);
  return rows[0] ? rowToView(rows[0] as PropertyRow) : null;
}

/** create */
export async function createProperty(values: NewPropertyRow) {
  await db.insert(properties).values(values);
  return getPropertyById(values.id);
}

/** update (partial) */
export async function updateProperty(id: string, patch: Partial<NewPropertyRow>) {
  await db
    .update(properties)
    .set({ ...patch, updated_at: new Date() })
    .where(eq(properties.id, id));
  return getPropertyById(id);
}

/** delete (hard) */
export async function deleteProperty(id: string) {
  const res = await db.delete(properties).where(eq(properties.id, id)).execute();
  const affected =
    typeof (res as unknown as { affectedRows?: number }).affectedRows === "number"
      ? (res as unknown as { affectedRows: number }).affectedRows
      : 0;
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
