// =============================================================
// FILE: src/modules/properties/admin.controller.ts (ADMIN)
// =============================================================
import type { RouteHandler } from "fastify";
import { randomUUID } from "crypto";
import {
  listPropertiesAdmin,
  getPropertyByIdAdmin,
  getPropertyBySlugAdmin,
  createProperty,
  updateProperty,
  deleteProperty,
} from "./repository";
import {
  propertyListQuerySchema,
  upsertPropertyBodySchema,
  patchPropertyBodySchema,
  type PropertyListQuery,
  type UpsertPropertyBody,
  type PatchPropertyBody,
} from "./validation";

const toBool = (v: unknown): boolean => v === true || v === 1 || v === "1" || v === "true";

// DECIMAL(10,6) alanlarına string yazmak için normalize
const dec6 = (v: number | string): string => {
  if (typeof v === "number") return v.toFixed(6);
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(6) : String(v);
};

// DECIMAL(12,2) fiyat alanları normalize
const dec2 = (v: number | string): string => {
  if (typeof v === "number") return v.toFixed(2);
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : String(v);
};

const trimOrUndef = (v: unknown): string | undefined => (typeof v === "string" ? v.trim() : undefined);
const trimOrNull = (v: unknown): string | null | undefined => {
  if (typeof v === "undefined") return undefined;
  if (v === null) return null;
  if (typeof v === "string") return v.trim() || null;
  return null;
};

const numOrUndef = (v: unknown): number | undefined => {
  if (typeof v === "undefined") return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const intOrUndef = (v: unknown): number | undefined => {
  const n = numOrUndef(v);
  if (typeof n === "undefined") return undefined;
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
};

/** LIST (admin) */
export const listPropertiesAdminController: RouteHandler<{ Querystring: PropertyListQuery }> = async (
  req,
  reply,
) => {
  const parsed = propertyListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: "invalid_query", issues: parsed.error.issues } });
  }
  const q = parsed.data;

  try {
    const { items, total } = await listPropertiesAdmin({
      orderParam: typeof q.order === "string" ? q.order : undefined,
      sort: q.sort,
      order: q.orderDir,
      limit: q.limit,
      offset: q.offset,

      is_active: q.is_active,
      featured: q.featured,

      q: q.q,
      district: q.district,
      city: q.city,
      neighborhood: q.neighborhood,
      type: q.type,
      status: q.status,
      slug: q.slug,
    });

    reply.header("x-total-count", String(total ?? 0));
    return reply.send(items);
  } catch (err) {
    req.log.error({ err }, "properties_list_failed");
    return reply.code(500).send({ error: { message: "properties_list_failed" } });
  }
};

/** GET BY ID (admin) */
export const getPropertyAdminController: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const row = await getPropertyByIdAdmin(req.params.id);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/** GET BY SLUG (admin) */
export const getPropertyBySlugAdminController: RouteHandler<{ Params: { slug: string } }> = async (
  req,
  reply,
) => {
  const row = await getPropertyBySlugAdmin(req.params.slug);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/** CREATE (admin) */
export const createPropertyAdminController: RouteHandler<{ Body: UpsertPropertyBody }> = async (req, reply) => {
  const parsed = upsertPropertyBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: "invalid_body", issues: parsed.error.issues } });
  }
  const b = parsed.data;

  try {
    const row = await createProperty({
      id: randomUUID(),

      title: b.title.trim(),
      slug: b.slug.trim(),
      type: b.type.trim(),
      status: b.status.trim(),

      address: b.address.trim(),
      district: b.district.trim(),
      city: b.city.trim(),

      neighborhood: typeof b.neighborhood === "string" ? b.neighborhood.trim() : null,

      lat: dec6(b.coordinates.lat),
      lng: dec6(b.coordinates.lng),

      description: typeof b.description === "string" ? b.description.trim() : b.description ?? null,

      // fiyatlar
      price: typeof b.price === "number" ? dec2(b.price) : null,
      currency: (b.currency ?? "TRY").trim(),
      min_price_admin: typeof b.min_price_admin === "number" ? dec2(b.min_price_admin) : null,

      // meta
      listing_no: typeof b.listing_no === "string" ? b.listing_no.trim() : null,
      badge_text: typeof b.badge_text === "string" ? b.badge_text.trim() : null,
      featured: toBool(b.featured) ? 1 : 0,

      // detay
      gross_m2: typeof b.gross_m2 === "number" ? b.gross_m2 : null,
      net_m2: typeof b.net_m2 === "number" ? b.net_m2 : null,
      rooms: typeof b.rooms === "string" ? b.rooms.trim() : null,
      building_age: typeof b.building_age === "string" ? b.building_age.trim() : null,
      floor: typeof b.floor === "string" ? b.floor.trim() : null,
      total_floors: typeof b.total_floors === "number" ? b.total_floors : null,

      heating: typeof b.heating === "string" ? b.heating.trim() : null,
      furnished: toBool(b.furnished) ? 1 : 0,
      in_site: toBool(b.in_site) ? 1 : 0,
      has_balcony: toBool(b.has_balcony) ? 1 : 0,
      has_parking: toBool(b.has_parking) ? 1 : 0,
      has_elevator: toBool(b.has_elevator) ? 1 : 0,

      // görsel
      image_url: typeof b.image_url === "string" ? b.image_url.trim() : null,
      image_asset_id: typeof b.image_asset_id === "string" ? b.image_asset_id.trim() : null,
      alt: typeof b.alt === "string" ? b.alt.trim() : null,

      is_active: toBool(b.is_active) ? 1 : 0,
      display_order: typeof b.display_order === "number" ? b.display_order : 0,

      created_at: new Date(),
      updated_at: new Date(),
    });

    return reply.code(201).send(row);
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e?.code === "ER_DUP_ENTRY") {
      return reply.code(409).send({ error: { message: "slug_already_exists" } });
    }
    req.log.error({ err }, "properties_create_failed");
    return reply.code(500).send({ error: { message: "properties_create_failed" } });
  }
};

/** UPDATE (admin, partial) */
export const updatePropertyAdminController: RouteHandler<{ Params: { id: string }; Body: PatchPropertyBody }> = async (
  req,
  reply,
) => {
  const parsed = patchPropertyBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: "invalid_body", issues: parsed.error.issues } });
  }
  const b = parsed.data;

  try {
    const patch: Record<string, any> = {};

    // zorunlu stringler (patch)
    const title = trimOrUndef(b.title);
    if (typeof title !== "undefined") patch.title = title;

    const slug = trimOrUndef(b.slug);
    if (typeof slug !== "undefined") patch.slug = slug;

    const type = trimOrUndef(b.type);
    if (typeof type !== "undefined") patch.type = type;

    const status = trimOrUndef(b.status);
    if (typeof status !== "undefined") patch.status = status;

    const address = trimOrUndef(b.address);
    if (typeof address !== "undefined") patch.address = address;

    const district = trimOrUndef(b.district);
    if (typeof district !== "undefined") patch.district = district;

    const city = trimOrUndef(b.city);
    if (typeof city !== "undefined") patch.city = city;

    // nullable stringler
    const neighborhood = trimOrNull(b.neighborhood);
    if (typeof neighborhood !== "undefined") patch.neighborhood = neighborhood;

    const description = typeof b.description !== "undefined" ? (b.description ?? null) : undefined;
    if (typeof description !== "undefined") patch.description = typeof description === "string" ? description.trim() : description;

    // coords
    if (typeof b.coordinates?.lat !== "undefined") patch.lat = dec6(b.coordinates.lat);
    if (typeof b.coordinates?.lng !== "undefined") patch.lng = dec6(b.coordinates.lng);

    // fiyatlar
    if (typeof b.price !== "undefined") patch.price = b.price === null ? null : dec2(b.price);
    if (typeof b.currency !== "undefined") patch.currency = (b.currency ?? "TRY").trim();
    if (typeof b.min_price_admin !== "undefined")
      patch.min_price_admin = b.min_price_admin === null ? null : dec2(b.min_price_admin);

    // meta
    if (typeof b.listing_no !== "undefined") patch.listing_no = b.listing_no ?? null;
    if (typeof b.badge_text !== "undefined") patch.badge_text = b.badge_text ?? null;
    if (typeof b.featured !== "undefined") patch.featured = toBool(b.featured) ? 1 : 0;

    // detay
    if (typeof b.gross_m2 !== "undefined") patch.gross_m2 = b.gross_m2 ?? null;
    if (typeof b.net_m2 !== "undefined") patch.net_m2 = b.net_m2 ?? null;
    if (typeof b.rooms !== "undefined") patch.rooms = b.rooms ?? null;
    if (typeof b.building_age !== "undefined") patch.building_age = b.building_age ?? null;
    if (typeof b.floor !== "undefined") patch.floor = b.floor ?? null;
    if (typeof b.total_floors !== "undefined") patch.total_floors = b.total_floors ?? null;

    if (typeof b.heating !== "undefined") patch.heating = b.heating ?? null;
    if (typeof b.furnished !== "undefined") patch.furnished = toBool(b.furnished) ? 1 : 0;
    if (typeof b.in_site !== "undefined") patch.in_site = toBool(b.in_site) ? 1 : 0;
    if (typeof b.has_balcony !== "undefined") patch.has_balcony = toBool(b.has_balcony) ? 1 : 0;
    if (typeof b.has_parking !== "undefined") patch.has_parking = toBool(b.has_parking) ? 1 : 0;
    if (typeof b.has_elevator !== "undefined") patch.has_elevator = toBool(b.has_elevator) ? 1 : 0;

    // görsel
    if (typeof b.image_url !== "undefined") patch.image_url = b.image_url ?? null;
    if (typeof b.image_asset_id !== "undefined") patch.image_asset_id = b.image_asset_id ?? null;
    if (typeof b.alt !== "undefined") patch.alt = b.alt ?? null;

    // yayın/sıralama
    if (typeof b.is_active !== "undefined") patch.is_active = toBool(b.is_active) ? 1 : 0;
    if (typeof b.display_order !== "undefined")
      patch.display_order = typeof b.display_order === "number" ? b.display_order : undefined;

    const patched = await updateProperty(req.params.id, patch);

    if (!patched) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(patched);
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e?.code === "ER_DUP_ENTRY") {
      return reply.code(409).send({ error: { message: "slug_already_exists" } });
    }
    req.log.error({ err }, "properties_update_failed");
    return reply.code(500).send({ error: { message: "properties_update_failed" } });
  }
};

/** DELETE (admin) */
export const removePropertyAdminController: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const affected = await deleteProperty(req.params.id);
  if (!affected) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.code(204).send();
};
