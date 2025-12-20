// =============================================================
// FILE: src/modules/properties/admin.controller.ts (ADMIN)
// FINAL:
//  - coordinates optional (null/undefined OK)
//  - coordinates yoksa adresten geocode dener (Nominatim)
//  - price/min_price_admin: number | null | undefined güvenli
// =============================================================
import type { RouteHandler } from "fastify";
import { randomUUID } from "node:crypto";

import {
  listPropertiesAdmin as listPropertiesAdminRepo,
  getPropertyByIdAdmin as getPropertyByIdAdminRepo,
  getPropertyBySlugAdmin as getPropertyBySlugAdminRepo,
  createProperty as createPropertyRepo,
  updateProperty as updatePropertyRepo,
  deleteProperty as deletePropertyRepo,

  replacePropertyAssets,
  syncPropertyCoverFromAssets,
} from "./repository";

import {
  propertyListQuerySchema,
  upsertPropertyBodySchema,
  patchPropertyBodySchema,
  type PropertyListQuery,
  type UpsertPropertyBody,
  type PatchPropertyBody,
} from "./validation";

import { geocodeAddressNominatim } from "./geocode";

// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------
const toBool = (v: unknown): boolean => v === true || v === 1 || v === "1" || v === "true";

const dec6orNull = (v: number | string | null | undefined): string | null => {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v.toFixed(6) : null;
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(6) : null;
};

const dec2orNull = (v: number | string | null | undefined): string | null => {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v.toFixed(2) : null;
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : null;
};

const trimOrUndef = (v: unknown): string | undefined => (typeof v === "string" ? v.trim() : undefined);

const trimOrNull = (v: unknown): string | null | undefined => {
  if (typeof v === "undefined") return undefined;
  if (v === null) return null;
  if (typeof v === "string") {
    const s = v.trim();
    return s ? s : null;
  }
  return null;
};

const intOrNull = (v: unknown): number | null | undefined => {
  if (typeof v === "undefined") return undefined;
  if (v === null) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

const cleanStringArrayOrNull = (v: unknown): string[] | null | undefined => {
  if (typeof v === "undefined") return undefined;
  if (v === null) return null;
  if (!Array.isArray(v)) return null;

  const out = v
    .map((x) => (typeof x === "string" ? x.trim() : String(x).trim()))
    .filter(Boolean);

  return out.length ? out : [];
};

function buildGeocodeQuery(address: string, district: string, city: string) {
  const parts = [address, district, city].map((s) => String(s || "").trim()).filter(Boolean);
  return parts.join(", ");
}

// -------------------------------------------------------------
// LIST (admin)
// -------------------------------------------------------------
export const listPropertiesAdmin: RouteHandler<{ Querystring: PropertyListQuery }> = async (req, reply) => {
  const parsed = propertyListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_query", issues: parsed.error.issues },
    });
  }
  const q = parsed.data;

  try {
    const { items, total } = await listPropertiesAdminRepo({
      orderParam: typeof q.order === "string" ? q.order : undefined,
      sort: q.sort,
      order: q.orderDir,
      limit: q.limit,
      offset: q.offset,

      is_active: q.is_active,
      featured: q.featured,

      q: q.q,
      slug: q.slug,
      district: q.district,
      city: q.city,
      neighborhood: q.neighborhood,
      type: q.type,
      status: q.status,

      price_min: q.price_min,
      price_max: q.price_max,
      gross_m2_min: q.gross_m2_min,
      gross_m2_max: q.gross_m2_max,
      net_m2_min: q.net_m2_min,
      net_m2_max: q.net_m2_max,

      rooms: q.rooms,
      rooms_multi: q.rooms_multi,
      bedrooms_min: q.bedrooms_min,
      bedrooms_max: q.bedrooms_max,

      building_age: q.building_age,

      floor: q.floor,
      floor_no_min: q.floor_no_min,
      floor_no_max: q.floor_no_max,
      total_floors_min: q.total_floors_min,
      total_floors_max: q.total_floors_max,

      heating: q.heating,
      heating_multi: q.heating_multi,
      usage_status: q.usage_status,
      usage_status_multi: q.usage_status_multi,

      furnished: q.furnished,
      in_site: q.in_site,
      has_balcony: q.has_balcony,
      has_parking: q.has_parking,
      has_elevator: q.has_elevator,
      has_garden: q.has_garden,
      has_terrace: q.has_terrace,
      credit_eligible: q.credit_eligible,
      swap: q.swap,
      has_video: q.has_video,
      has_clip: q.has_clip,
      has_virtual_tour: q.has_virtual_tour,
      has_map: q.has_map,
      accessible: q.accessible,

      created_from: q.created_from,
      created_to: q.created_to,
    });

    reply.header("x-total-count", String(total ?? 0));
    return reply.send(items);
  } catch (err) {
    req.log.error({ err }, "properties_admin_list_failed");
    return reply.code(500).send({ error: { message: "properties_admin_list_failed" } });
  }
};

// -------------------------------------------------------------
// GET BY ID (admin)
// -------------------------------------------------------------
export const getPropertyAdmin: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  try {
    const row = await getPropertyByIdAdminRepo(req.params.id);
    if (!row) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(row);
  } catch (err) {
    req.log.error({ err }, "properties_admin_get_failed");
    return reply.code(500).send({ error: { message: "properties_admin_get_failed" } });
  }
};

// -------------------------------------------------------------
// GET BY SLUG (admin)
// -------------------------------------------------------------
export const getPropertyBySlugAdmin: RouteHandler<{ Params: { slug: string } }> = async (req, reply) => {
  try {
    const row = await getPropertyBySlugAdminRepo(req.params.slug);
    if (!row) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(row);
  } catch (err) {
    req.log.error({ err }, "properties_admin_get_by_slug_failed");
    return reply.code(500).send({ error: { message: "properties_admin_get_by_slug_failed" } });
  }
};

// -------------------------------------------------------------
// CREATE (admin)
// -------------------------------------------------------------
export const createPropertyAdmin: RouteHandler<{ Body: UpsertPropertyBody }> = async (req, reply) => {
  const parsed = upsertPropertyBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: "invalid_body", issues: parsed.error.issues } });
  }
  const b = parsed.data;

  try {
    // ✅ coordinates yoksa geocode dene
    let latNum: number | null = b.coordinates?.lat ?? null;
    let lngNum: number | null = b.coordinates?.lng ?? null;

    if (latNum == null || lngNum == null) {
      const q = buildGeocodeQuery(b.address, b.district, b.city);
      const point = await geocodeAddressNominatim(q);
      if (point) {
        latNum = point.lat;
        lngNum = point.lng;
      }
    }

    const lat = dec6orNull(latNum);
    const lng = dec6orNull(lngNum);

    // has_map: FE açıkça set etmediyse, coords varsa 1 yoksa 0
    const hasMap =
      typeof b.has_map !== "undefined" ? (toBool(b.has_map) ? 1 : 0) : lat && lng ? 1 : 0;

    const created = await createPropertyRepo({
      id: randomUUID(),

      title: b.title.trim(),
      slug: b.slug.trim(),
      type: b.type.trim(),
      status: b.status.trim(),

      address: b.address.trim(),
      district: b.district.trim(),
      city: b.city.trim(),
      neighborhood: typeof b.neighborhood === "string" ? b.neighborhood.trim() : null,

      lat,
      lng,

      description: typeof b.description === "string" ? b.description.trim() : b.description ?? null,

      price: typeof b.price === "number" ? dec2orNull(b.price) : b.price === null ? null : null,
      currency: (b.currency ?? "TRY").trim(),
      min_price_admin: typeof b.min_price_admin === "number" ? dec2orNull(b.min_price_admin) : b.min_price_admin === null ? null : null,

      listing_no: typeof b.listing_no === "string" ? b.listing_no.trim() : null,
      badge_text: typeof b.badge_text === "string" ? b.badge_text.trim() : null,
      featured: toBool(b.featured) ? 1 : 0,

      gross_m2: typeof b.gross_m2 === "number" ? b.gross_m2 : b.gross_m2 ?? null,
      net_m2: typeof b.net_m2 === "number" ? b.net_m2 : b.net_m2 ?? null,

      rooms: typeof b.rooms === "string" ? b.rooms.trim() : b.rooms ?? null,
      bedrooms: typeof b.bedrooms === "number" ? Math.trunc(b.bedrooms) : b.bedrooms ?? null,

      building_age: typeof b.building_age === "string" ? b.building_age.trim() : b.building_age ?? null,

      floor: typeof b.floor === "string" ? b.floor.trim() : b.floor ?? null,
      floor_no: typeof b.floor_no === "number" ? Math.trunc(b.floor_no) : b.floor_no ?? null,
      total_floors: typeof b.total_floors === "number" ? Math.trunc(b.total_floors) : b.total_floors ?? null,

      heating: typeof b.heating === "string" ? b.heating.trim() : b.heating ?? null,
      usage_status: typeof b.usage_status === "string" ? b.usage_status.trim() : b.usage_status ?? null,

      rooms_multi: cleanStringArrayOrNull((b as any).rooms_multi) ?? null,
      heating_multi: cleanStringArrayOrNull((b as any).heating_multi) ?? null,
      usage_status_multi: cleanStringArrayOrNull((b as any).usage_status_multi) ?? null,

      furnished: toBool(b.furnished) ? 1 : 0,
      in_site: toBool(b.in_site) ? 1 : 0,
      has_balcony: toBool(b.has_balcony) ? 1 : 0,
      has_parking: toBool(b.has_parking) ? 1 : 0,
      has_elevator: toBool(b.has_elevator) ? 1 : 0,
      has_garden: toBool(b.has_garden) ? 1 : 0,
      has_terrace: toBool(b.has_terrace) ? 1 : 0,

      credit_eligible: toBool(b.credit_eligible) ? 1 : 0,
      swap: toBool(b.swap) ? 1 : 0,
      has_video: toBool(b.has_video) ? 1 : 0,
      has_clip: toBool(b.has_clip) ? 1 : 0,
      has_virtual_tour: toBool(b.has_virtual_tour) ? 1 : 0,
      has_map: hasMap,
      accessible: toBool(b.accessible) ? 1 : 0,

      image_url: typeof b.image_url === "string" ? b.image_url.trim() : null,
      image_asset_id: typeof b.image_asset_id === "string" ? b.image_asset_id.trim() : null,
      alt: typeof b.alt === "string" ? b.alt.trim() : null,

      is_active: toBool(b.is_active) ? 1 : 0,
      display_order: typeof b.display_order === "number" ? Math.trunc(b.display_order) : 0,

      created_at: new Date(),
      updated_at: new Date(),
    } as any);

    if (!created) {
      return reply.code(500).send({ error: { message: "properties_admin_create_failed" } });
    }

    if (Array.isArray(b.assets)) {
      await replacePropertyAssets(created.id, b.assets);
      await syncPropertyCoverFromAssets(created.id);
    }

    const fresh = await getPropertyByIdAdminRepo(created.id);
    return reply.code(201).send(fresh);
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    if (e?.code === "ER_DUP_ENTRY") {
      return reply.code(409).send({ error: { message: "slug_already_exists" } });
    }
    if (e?.message === "invalid_asset_ids") {
      return reply.code(400).send({
        error: { message: "invalid_asset_ids", details: "assets[].asset_id not found in storage_assets" },
      });
    }
    if (e?.message === "asset_id_or_url_required") {
      return reply.code(400).send({ error: { message: "asset_id_or_url_required" } });
    }
    req.log.error({ err }, "properties_admin_create_failed");
    return reply.code(500).send({ error: { message: "properties_admin_create_failed" } });
  }
};

// -------------------------------------------------------------
// UPDATE (admin)
// -------------------------------------------------------------
export const updatePropertyAdmin: RouteHandler<{
  Params: { id: string };
  Body: PatchPropertyBody;
}> = async (req, reply) => {
  const parsed = patchPropertyBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: "invalid_body", issues: parsed.error.issues } });
  }
  const b = parsed.data;

  try {
    const patch: Record<string, any> = {};

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

    const neighborhood = trimOrNull(b.neighborhood);
    if (typeof neighborhood !== "undefined") patch.neighborhood = neighborhood;

    if (typeof b.description !== "undefined") {
      patch.description = typeof b.description === "string" ? b.description.trim() : b.description ?? null;
    }

    // ✅ coordinates partial patch
    if (typeof b.coordinates?.lat !== "undefined") patch.lat = dec6orNull(b.coordinates.lat);
    if (typeof b.coordinates?.lng !== "undefined") patch.lng = dec6orNull(b.coordinates.lng);

    // ✅ eğer address/district/city değişti ve coords verilmediyse (lat/lng patch yoksa) geocode dene
    const addressChanged = typeof address !== "undefined" || typeof district !== "undefined" || typeof city !== "undefined";
    const coordsTouched = typeof b.coordinates?.lat !== "undefined" || typeof b.coordinates?.lng !== "undefined";

    if (addressChanged && !coordsTouched) {
      // mevcut kaydı çekip tamamla (adres patch’lenmiş olabilir)
      const current = await getPropertyByIdAdminRepo(req.params.id);
      if (current) {
        const q = buildGeocodeQuery(
          typeof address !== "undefined" ? address : current.address,
          typeof district !== "undefined" ? district! : current.district,
          typeof city !== "undefined" ? city! : current.city,
        );
        const point = await geocodeAddressNominatim(q);
        if (point) {
          patch.lat = dec6orNull(point.lat);
          patch.lng = dec6orNull(point.lng);
          if (typeof b.has_map === "undefined") patch.has_map = 1;
        }
      }
    }

    // price
    if (typeof b.price !== "undefined") patch.price = b.price === null ? null : dec2orNull(b.price);
    if (typeof b.currency !== "undefined") patch.currency = (b.currency ?? "TRY").trim();
    if (typeof b.min_price_admin !== "undefined") {
      patch.min_price_admin = b.min_price_admin === null ? null : dec2orNull(b.min_price_admin);
    }

    // meta
    if (typeof b.listing_no !== "undefined") patch.listing_no = b.listing_no ?? null;
    if (typeof b.badge_text !== "undefined") patch.badge_text = b.badge_text ?? null;
    if (typeof b.featured !== "undefined") patch.featured = toBool(b.featured) ? 1 : 0;

    // m2
    if (typeof b.gross_m2 !== "undefined") patch.gross_m2 = b.gross_m2 ?? null;
    if (typeof b.net_m2 !== "undefined") patch.net_m2 = b.net_m2 ?? null;

    // core
    if (typeof b.rooms !== "undefined") patch.rooms = b.rooms ?? null;
    if (typeof b.bedrooms !== "undefined") patch.bedrooms = b.bedrooms === null ? null : Math.trunc(b.bedrooms);

    if (typeof b.building_age !== "undefined") patch.building_age = b.building_age ?? null;

    if (typeof b.floor !== "undefined") patch.floor = b.floor ?? null;
    const floorNo = intOrNull(b.floor_no);
    if (typeof floorNo !== "undefined") patch.floor_no = floorNo;

    if (typeof b.total_floors !== "undefined") patch.total_floors = b.total_floors ?? null;

    if (typeof b.heating !== "undefined") patch.heating = b.heating ?? null;
    if (typeof b.usage_status !== "undefined") patch.usage_status = b.usage_status ?? null;

    // ✅ multi json
    if (typeof (b as any).rooms_multi !== "undefined") patch.rooms_multi = cleanStringArrayOrNull((b as any).rooms_multi);
    if (typeof (b as any).heating_multi !== "undefined") patch.heating_multi = cleanStringArrayOrNull((b as any).heating_multi);
    if (typeof (b as any).usage_status_multi !== "undefined") patch.usage_status_multi = cleanStringArrayOrNull((b as any).usage_status_multi);

    // bools
    if (typeof b.furnished !== "undefined") patch.furnished = toBool(b.furnished) ? 1 : 0;
    if (typeof b.in_site !== "undefined") patch.in_site = toBool(b.in_site) ? 1 : 0;
    if (typeof b.has_balcony !== "undefined") patch.has_balcony = toBool(b.has_balcony) ? 1 : 0;
    if (typeof b.has_parking !== "undefined") patch.has_parking = toBool(b.has_parking) ? 1 : 0;
    if (typeof b.has_elevator !== "undefined") patch.has_elevator = toBool(b.has_elevator) ? 1 : 0;
    if (typeof b.has_garden !== "undefined") patch.has_garden = toBool(b.has_garden) ? 1 : 0;
    if (typeof b.has_terrace !== "undefined") patch.has_terrace = toBool(b.has_terrace) ? 1 : 0;

    if (typeof b.credit_eligible !== "undefined") patch.credit_eligible = toBool(b.credit_eligible) ? 1 : 0;
    if (typeof b.swap !== "undefined") patch.swap = toBool(b.swap) ? 1 : 0;
    if (typeof b.has_video !== "undefined") patch.has_video = toBool(b.has_video) ? 1 : 0;
    if (typeof b.has_clip !== "undefined") patch.has_clip = toBool(b.has_clip) ? 1 : 0;
    if (typeof b.has_virtual_tour !== "undefined") patch.has_virtual_tour = toBool(b.has_virtual_tour) ? 1 : 0;
    if (typeof b.has_map !== "undefined") patch.has_map = toBool(b.has_map) ? 1 : 0;
    if (typeof b.accessible !== "undefined") patch.accessible = toBool(b.accessible) ? 1 : 0;

    // legacy cover
    if (typeof b.image_url !== "undefined") patch.image_url = b.image_url ?? null;
    if (typeof b.image_asset_id !== "undefined") patch.image_asset_id = b.image_asset_id ?? null;
    if (typeof b.alt !== "undefined") patch.alt = b.alt ?? null;

    if (typeof b.is_active !== "undefined") patch.is_active = toBool(b.is_active) ? 1 : 0;
    if (typeof b.display_order !== "undefined") {
      patch.display_order = typeof b.display_order === "number" ? Math.trunc(b.display_order) : 0;
    }

    const updated = await updatePropertyRepo(req.params.id, patch);
    if (!updated) return reply.code(404).send({ error: { message: "not_found" } });

    if (Array.isArray(b.assets)) {
      await replacePropertyAssets(req.params.id, b.assets);
      await syncPropertyCoverFromAssets(req.params.id);
    }

    const fresh = await getPropertyByIdAdminRepo(req.params.id);
    return reply.send(fresh);
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    if (e?.code === "ER_DUP_ENTRY") {
      return reply.code(409).send({ error: { message: "slug_already_exists" } });
    }
    if (e?.message === "invalid_asset_ids") {
      return reply.code(400).send({
        error: { message: "invalid_asset_ids", details: "assets[].asset_id not found in storage_assets" },
      });
    }
    if (e?.message === "asset_id_or_url_required") {
      return reply.code(400).send({ error: { message: "asset_id_or_url_required" } });
    }
    req.log.error({ err }, "properties_admin_update_failed");
    return reply.code(500).send({ error: { message: "properties_admin_update_failed" } });
  }
};

// -------------------------------------------------------------
// DELETE (admin)
// -------------------------------------------------------------
export const removePropertyAdmin: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  try {
    const affected = await deletePropertyRepo(req.params.id);
    if (!affected) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.code(204).send();
  } catch (err) {
    req.log.error({ err }, "properties_admin_delete_failed");
    return reply.code(500).send({ error: { message: "properties_admin_delete_failed" } });
  }
};
