// =============================================================
// FILE: src/modules/properties/controller.ts (PUBLIC)
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
import { propertyListQuerySchema, type PropertyListQuery } from "./validation";

/** LIST (public) */
export const listPropertiesPublic: RouteHandler<{ Querystring: PropertyListQuery }> = async (req, reply) => {
  const parsed = propertyListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_query", issues: parsed.error.issues },
    });
  }
  const q = parsed.data;

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
    });

    reply.header("x-total-count", String(total ?? 0));
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
