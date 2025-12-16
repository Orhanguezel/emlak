// =============================================================
// FILE: src/modules/slider/controller.ts  (PUBLIC)
// =============================================================
import type { RouteHandler } from "fastify";
import {
  publicListQuerySchema,
  idOrSlugParamSchema,
  type PublicListQuery,
} from "./validation";
import { repoListPublic, repoGetBySlug, type RowWithAsset } from "./repository";

/** FE SlideData (public) */
type SlideData = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt?: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
  priority?: "low" | "medium" | "high";
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
};

const rowToPublic = (row: RowWithAsset): SlideData => {
  const a = row.sl;
  const url = row.asset_url ?? a.image_url ?? "";
  return {
    id: String(a.id),
    title: a.name,
    description: a.description ?? "",
    image: url,
    alt: a.alt ?? undefined,
    buttonText: a.buttonText ?? "İncele",
    buttonLink: a.buttonLink ?? "",
    isActive: !!a.is_active,
    order: a.display_order ?? 0,
    priority: a.featured ? "high" : "medium",
    showOnMobile: true,
    showOnDesktop: true,
  };
};

/** GET /sliders (public, sadece aktifler) */
export const listPublicSlides: RouteHandler<{ Querystring: unknown }> = async (req, reply) => {
  const parsed = publicListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: "invalid_query", issues: parsed.error.flatten() } });
  }
  const q = parsed.data as PublicListQuery;
  const rows = await repoListPublic(q);
  return rows.map(rowToPublic);
};

/** GET /sliders/:idOrSlug (opsiyonel public detail) */
export const getPublicSlide: RouteHandler<{ Params: { idOrSlug: string } }> = async (req, reply) => {
  const v = idOrSlugParamSchema.safeParse(req.params);
  if (!v.success) return reply.code(400).send({ error: { message: "invalid_params" } });

  const slug = v.data.idOrSlug;
  const row = await repoGetBySlug(slug);
  if (!row || !row.sl?.is_active) return reply.code(404).send({ error: { message: "not_found" } });
  return rowToPublic(row);
};
