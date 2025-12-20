// =============================================================
// FILE: src/modules/properties/controller.ts (PUBLIC)
// FINAL: select=enums desteği (backward compatible)
// =============================================================
import type { RouteHandler } from "fastify";
import {
  listPropertiesPublic as listPropertiesPublicRepo,
  getPropertyByIdPublic as getPropertyByIdPublicRepo,
  getPropertyBySlugPublic as getPropertyBySlugPublicRepo,
  listDistricts as listDistrictsRepo,
  listCities as listCitiesRepo,
  listNeighborhoods as listNeighborhoodsRepo,
  listTypes as listTypesRepo,
  listStatuses as listStatusesRepo,
} from "./repository";
import { propertyListQuerySchema, type PropertyListQuery, HEATING, USAGE_STATUS, ROOMS } from "./validation";

/** LIST (public) */
export const listPropertiesPublic: RouteHandler<{ Querystring: PropertyListQuery }> = async (req, reply) => {
  const parsed = propertyListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_query", issues: parsed.error.issues },
    });
  }

  const q = parsed.data;
  const select = Array.isArray(q.select) ? q.select : [];

  try {
    const { items, total } = await listPropertiesPublicRepo({
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

    // ✅ select=enums/meta istenirse object dön
    if (select.includes("enums") || select.includes("meta")) {
      return reply.send({
        items,
        total,
        enums: {
          rooms: ROOMS,
          heating: HEATING,
          usage_status: USAGE_STATUS,
        },
      });
    }

    // default: eski davranış (array)
    return reply.send(items);
  } catch (err) {
    req.log.error({ err }, "properties_public_list_failed");
    return reply.code(500).send({ error: { message: "properties_public_list_failed" } });
  }
};

/** GET BY ID (public) */
export const getPropertyPublic: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  try {
    const row = await getPropertyByIdPublicRepo(req.params.id);
    if (!row) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(row);
  } catch (err) {
    req.log.error({ err }, "properties_public_get_failed");
    return reply.code(500).send({ error: { message: "properties_public_get_failed" } });
  }
};

/** GET BY SLUG (public) */
export const getPropertyBySlugPublic: RouteHandler<{ Params: { slug: string } }> = async (req, reply) => {
  try {
    const row = await getPropertyBySlugPublicRepo(req.params.slug);
    if (!row) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(row);
  } catch (err) {
    req.log.error({ err }, "properties_public_get_by_slug_failed");
    return reply.code(500).send({ error: { message: "properties_public_get_by_slug_failed" } });
  }
};

/** META: districts */
export const listDistrictsPublic: RouteHandler = async (req, reply) => {
  try {
    const arr = await listDistrictsRepo();
    return reply.send(arr);
  } catch (err) {
    req.log.error({ err }, "properties_public_districts_failed");
    return reply.code(500).send({ error: { message: "properties_public_districts_failed" } });
  }
};

/** META: cities */
export const listCitiesPublic: RouteHandler = async (req, reply) => {
  try {
    const arr = await listCitiesRepo();
    return reply.send(arr);
  } catch (err) {
    req.log.error({ err }, "properties_public_cities_failed");
    return reply.code(500).send({ error: { message: "properties_public_cities_failed" } });
  }
};

/** META: neighborhoods */
export const listNeighborhoodsPublic: RouteHandler = async (req, reply) => {
  try {
    const arr = await listNeighborhoodsRepo();
    return reply.send(arr);
  } catch (err) {
    req.log.error({ err }, "properties_public_neighborhoods_failed");
    return reply.code(500).send({ error: { message: "properties_public_neighborhoods_failed" } });
  }
};

/** META: types */
export const listTypesPublic: RouteHandler = async (req, reply) => {
  try {
    const arr = await listTypesRepo();
    return reply.send(arr);
  } catch (err) {
    req.log.error({ err }, "properties_public_types_failed");
    return reply.code(500).send({ error: { message: "properties_public_types_failed" } });
  }
};

/** META: statuses */
export const listStatusesPublic: RouteHandler = async (req, reply) => {
  try {
    const arr = await listStatusesRepo();
    return reply.send(arr);
  } catch (err) {
    req.log.error({ err }, "properties_public_statuses_failed");
    return reply.code(500).send({ error: { message: "properties_public_statuses_failed" } });
  }
};
