// =============================================================
// FILE: src/modules/customPages/controller.ts  (PUBLIC)
// =============================================================
import type { RouteHandler } from "fastify";
import {
  listCustomPages,
  getCustomPageById,
  getCustomPageBySlug,
} from "./repository";
import { customPageListQuerySchema, type CustomPageListQuery } from "./validation";

/** LIST (public) */
export const listPages: RouteHandler<{ Querystring: CustomPageListQuery }> = async (req, reply) => {
  const parsed = customPageListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: "invalid_query", issues: parsed.error.issues } });
  }
  const q = parsed.data;

  const { items, total } = await listCustomPages({
    orderParam: typeof q.order === "string" ? q.order : undefined,
    sort: q.sort,
    order: q.orderDir,
    limit: q.limit,
    offset: q.offset,
    is_published: q.is_published,
    q: q.q,
    slug: q.slug,
  });

  reply.header("x-total-count", String(total ?? 0));
  return reply.send(items);
};

/** GET BY ID (public) */
export const getPage: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const row = await getCustomPageById(req.params.id);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/** GET BY SLUG (public) */
export const getPageBySlug: RouteHandler<{ Params: { slug: string } }> = async (req, reply) => {
  const row = await getCustomPageBySlug(req.params.slug);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};
