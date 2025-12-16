// =============================================================
// FILE: src/modules/sub-categories/router.ts   (PUBLIC ROUTES ONLY)
// =============================================================
import type { FastifyInstance } from "fastify";
import {
  listSubCategories,
  getSubCategoryById,
  getSubCategoryBySlug,
} from "./controller";

export async function registerSubCategories(app: FastifyInstance) {
  // PUBLIC READ
  app.get("/sub-categories", { config: { public: true } }, listSubCategories);
  app.get<{ Params: { id: string } }>(
    "/sub-categories/:id",
    { config: { public: true } },
    getSubCategoryById
  );
  app.get<{ Params: { slug: string }; Querystring: { category_id?: string } }>(
    "/sub-categories/by-slug/:slug",
    { config: { public: true } },
    getSubCategoryBySlug
  );
}
