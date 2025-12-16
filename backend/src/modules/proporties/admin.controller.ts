// src/modules/proporties/admin.controller.ts
import type { RouteHandler } from "fastify";
import { randomUUID } from "crypto";
import {
  listProperties,
  getPropertyById,
  getPropertyBySlug,
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

const toBool = (v: unknown): boolean =>
  v === true || v === 1 || v === "1" || v === "true";

// DECIMAL(10,6) alanlarına string yazmak için normalize
const dec6 = (v: number | string): string => {
  if (typeof v === "number") return v.toFixed(6);
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(6) : String(v);
};

/** LIST (admin) */
export const listPropertiesAdmin: RouteHandler<{ Querystring: PropertyListQuery }> = async (req, reply) => {
  const parsed = propertyListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: "invalid_query", issues: parsed.error.issues } });
  }
  const q = parsed.data;

  try {
    const { items, total } = await listProperties({
      orderParam: typeof q.order === "string" ? q.order : undefined,
      sort: q.sort,
      order: q.orderDir,
      limit: q.limit,
      offset: q.offset,

      is_active: q.is_active,
      q: q.q,
      district: q.district,
      city: q.city,
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
export const getPropertyAdmin: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const row = await getPropertyById(req.params.id);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/** GET BY SLUG (admin) */
export const getPropertyBySlugAdmin: RouteHandler<{ Params: { slug: string } }> = async (req, reply) => {
  const row = await getPropertyBySlug(req.params.slug);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/** CREATE (admin) */
export const createPropertyAdmin: RouteHandler<{ Body: UpsertPropertyBody }> = async (req, reply) => {
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

      lat: dec6(b.coordinates.lat),
      lng: dec6(b.coordinates.lng),

      description: typeof b.description === "string" ? b.description.trim() : b.description ?? null,

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
export const updatePropertyAdmin: RouteHandler<{ Params: { id: string }; Body: PatchPropertyBody }> = async (req, reply) => {
  const parsed = patchPropertyBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: "invalid_body", issues: parsed.error.issues } });
  }
  const b = parsed.data;

  try {
    const patched = await updateProperty(req.params.id, {
      title: typeof b.title === "string" ? b.title.trim() : undefined,
      slug: typeof b.slug === "string" ? b.slug.trim() : undefined,
      type: typeof b.type === "string" ? b.type.trim() : undefined,
      status: typeof b.status === "string" ? b.status.trim() : undefined,

      address: typeof b.address === "string" ? b.address.trim() : undefined,
      district: typeof b.district === "string" ? b.district.trim() : undefined,
      city: typeof b.city === "string" ? b.city.trim() : undefined,

      lat: typeof b.coordinates?.lat !== "undefined" ? dec6(b.coordinates.lat) : undefined,
      lng: typeof b.coordinates?.lng !== "undefined" ? dec6(b.coordinates.lng) : undefined,

      description: typeof b.description !== "undefined" ? (b.description ?? null) : undefined,

      is_active: typeof b.is_active !== "undefined" ? (toBool(b.is_active) ? 1 : 0) : undefined,
      display_order: typeof b.display_order === "number" ? b.display_order : undefined,
    });

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
export const removePropertyAdmin: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const affected = await deleteProperty(req.params.id);
  if (!affected) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.code(204).send();
};
