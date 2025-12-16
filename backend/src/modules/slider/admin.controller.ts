// =============================================================
// FILE: src/modules/slider/admin.controller.ts
// =============================================================
import type { RouteHandler } from "fastify";
import {
  adminListQuerySchema,
  idParamSchema,
  createSchema,
  updateSchema,
  reorderSchema,
  setStatusSchema,
  setImageSchema,
  type AdminListQuery,
  type CreateBody,
  type UpdateBody,
  type SetImageBody,
} from "./validation";
import {
  repoListAdmin,
  repoGetById,
  repoCreate,
  repoUpdate,
  repoDelete,
  repoReorder,
  repoSetStatus,
  repoSetImage,
} from "./repository";

const toAdminView = (row: any) => {
  const a = row.sl;
  return {
    id: a.id,
    uuid: a.uuid,
    name: a.name,
    slug: a.slug,
    description: a.description ?? null,

    image_url: a.image_url ?? null,
    image_asset_id: a.image_asset_id ?? null,
    image_effective_url: row.asset_url ?? a.image_url ?? null,

    alt: a.alt ?? null,
    buttonText: a.buttonText ?? null,
    buttonLink: a.buttonLink ?? null,

    featured: !!a.featured,
    is_active: !!a.is_active,
    display_order: a.display_order,

    created_at: a.created_at,
    updated_at: a.updated_at,
  };
};

/** GET /admin/sliders */
export const adminListSlides: RouteHandler<{ Querystring: unknown }> = async (req, reply) => {
  const parsed = adminListQuerySchema.safeParse(req.query);
  if (!parsed.success) return reply.code(400).send({ error: { message: "invalid_query", issues: parsed.error.flatten() } });
  const q = parsed.data as AdminListQuery;
  const rows = await repoListAdmin(q);
  return rows.map(toAdminView);
};

/** GET /admin/sliders/:id */
export const adminGetSlide: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const v = idParamSchema.safeParse(req.params);
  if (!v.success) return reply.code(400).send({ error: { message: "invalid_params" } });
  const row = await repoGetById(v.data.id);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return toAdminView(row);
};

/** POST /admin/sliders */
export const adminCreateSlide: RouteHandler<{ Body: unknown }> = async (req, reply) => {
  const b = createSchema.safeParse(req.body);
  if (!b.success) return reply.code(400).send({ error: { message: "invalid_body", issues: b.error.flatten() } });
  const created = await repoCreate(b.data as CreateBody);
  return reply.code(201).send(toAdminView(created));
};

/** PATCH /admin/sliders/:id */
export const adminUpdateSlide: RouteHandler<{ Params: { id: string }; Body: unknown }> = async (req, reply) => {
  const p = idParamSchema.safeParse(req.params);
  if (!p.success) return reply.code(400).send({ error: { message: "invalid_params" } });
  const b = updateSchema.safeParse(req.body);
  if (!b.success) return reply.code(400).send({ error: { message: "invalid_body", issues: b.error.flatten() } });
  const updated = await repoUpdate(p.data.id, b.data as UpdateBody);
  if (!updated) return reply.code(404).send({ error: { message: "not_found" } });
  return toAdminView(updated);
};

/** DELETE /admin/sliders/:id */
export const adminDeleteSlide: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const p = idParamSchema.safeParse(req.params);
  if (!p.success) return reply.code(400).send({ error: { message: "invalid_params" } });
  await repoDelete(p.data.id);
  return { ok: true };
};

/** POST /admin/sliders/reorder */
export const adminReorderSlides: RouteHandler<{ Body: unknown }> = async (req, reply) => {
  const b = reorderSchema.safeParse(req.body);
  if (!b.success) return reply.code(400).send({ error: { message: "invalid_body", issues: b.error.flatten() } });
  await repoReorder(b.data.ids);
  return { ok: true };
};

/** POST /admin/sliders/:id/status */
export const adminSetStatus: RouteHandler<{ Params: { id: string }; Body: unknown }> = async (req, reply) => {
  const p = idParamSchema.safeParse(req.params);
  if (!p.success) return reply.code(400).send({ error: { message: "invalid_params" } });
  const b = setStatusSchema.safeParse(req.body);
  if (!b.success) return reply.code(400).send({ error: { message: "invalid_body", issues: b.error.flatten() } });
  const updated = await repoSetStatus(p.data.id, b.data.is_active);
  if (!updated) return reply.code(404).send({ error: { message: "not_found" } });
  return toAdminView(updated);
};

/** ✅ PATCH /admin/sliders/:id/image */
export const adminSetSliderImage: RouteHandler<{ Params: { id: string }; Body: unknown }> = async (req, reply) => {
  const p = idParamSchema.safeParse(req.params);
  if (!p.success) return reply.code(400).send({ error: { message: "invalid_params" } });
  const b = setImageSchema.safeParse(req.body);
  if (!b.success) return reply.code(400).send({ error: { message: "invalid_body", issues: b.error.flatten() } });
  const updated = await repoSetImage(p.data.id, b.data as SetImageBody);
  if (!updated) return reply.code(404).send({ error: { message: "not_found_or_asset_missing" } });
  return toAdminView(updated);
};
