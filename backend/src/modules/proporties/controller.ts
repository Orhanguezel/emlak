// src/modules/proporties/controller.ts
import type { RouteHandler } from "fastify";
import {
  listProperties,
  getPropertyById,
  getPropertyBySlug,
  listDistricts,
  listCities,
  listTypes,
  listStatuses,
} from "./repository";
import { propertyListQuerySchema, type PropertyListQuery } from "./validation";

/** LIST (public) */
export const listPropertiesPublic: RouteHandler<{ Querystring: PropertyListQuery }> = async (req, reply) => {
  const parsed = propertyListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: "invalid_query", issues: parsed.error.issues } });
  }
  const q = parsed.data;

  const { items, total } = await listProperties({
    orderParam: typeof q.order === "string" ? q.order : undefined,
    sort: q.sort,
    order: q.orderDir,
    limit: q.limit,
    offset: q.offset,

    is_active: q.is_active,
    q: q.q,
    slug: q.slug,
    district: q.district,
    city: q.city,
    type: q.type,
    status: q.status,
  });

  reply.header("x-total-count", String(total ?? 0));
  return reply.send(items);
};

/** GET BY ID (public) */
export const getPropertyPublic: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const row = await getPropertyById(req.params.id);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/** GET BY SLUG (public) */
export const getPropertyBySlugPublic: RouteHandler<{ Params: { slug: string } }> = async (req, reply) => {
  const row = await getPropertyBySlug(req.params.slug);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/** META: districts */
export const listDistrictsPublic: RouteHandler = async (_req, reply) => {
  const arr = await listDistricts();
  return reply.send(arr);
};

/** META: cities */
export const listCitiesPublic: RouteHandler = async (_req, reply) => {
  const arr = await listCities();
  return reply.send(arr);
};

/** META: types */
export const listTypesPublic: RouteHandler = async (_req, reply) => {
  const arr = await listTypes();
  return reply.send(arr);
};

/** META: statuses */
export const listStatusesPublic: RouteHandler = async (_req, reply) => {
  const arr = await listStatuses();
  return reply.send(arr);
};
