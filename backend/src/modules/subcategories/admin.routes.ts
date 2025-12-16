// =============================================================
// FILE: src/modules/subcategories/admin.routes.ts
// =============================================================
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { requireAdmin } from "@/common/middleware/roles";
import type {
  SubCategoryCreateInput, SubCategoryUpdateInput, SubCategorySetImageInput,
} from "./validation";
import {
  adminCreateSubCategory, adminPutSubCategory, adminPatchSubCategory, adminDeleteSubCategory,
  adminReorderSubCategories, adminToggleSubActive, adminToggleSubFeatured, adminSetSubCategoryImage,
  adminListSubCategories, adminGetSubCategoryById, adminGetSubCategoryBySlug, type AdminSubListQS,
} from "./admin.controller";

// idempotent guard (isteğe bağlı)
declare module "fastify" {
  interface FastifyInstance { subCategoriesAdminRoutesRegistered?: boolean; }
}

export async function registerSubCategoriesAdmin(app: FastifyInstance) {
  if (app.subCategoriesAdminRoutesRegistered) return;
  app.subCategoriesAdminRoutesRegistered = true;

  const BASE = "/sub-categories";

  // LIST (kategori patterniyle aynı: /list)
  app.get<{ Querystring: AdminSubListQS }>(
    `${BASE}/list`,
    { preHandler: [requireAuth, requireAdmin] },
    adminListSubCategories
  );

  // READ
  app.get<{ Params: { id: string } }>(`${BASE}/:id`, { preHandler: [requireAuth, requireAdmin] }, adminGetSubCategoryById);
  app.get<{ Params: { slug: string }; Querystring: { category_id?: string } }>(
    `${BASE}/by-slug/:slug`,
    { preHandler: [requireAuth, requireAdmin] },
    adminGetSubCategoryBySlug
  );

  // CRUD
  app.post<{ Body: SubCategoryCreateInput }>(`${BASE}`, { preHandler: [requireAuth, requireAdmin] }, adminCreateSubCategory);
  app.put<{ Params: { id: string }; Body: SubCategoryUpdateInput }>(`${BASE}/:id`, { preHandler: [requireAuth, requireAdmin] }, adminPutSubCategory);
  app.patch<{ Params: { id: string }; Body: SubCategoryUpdateInput }>(`${BASE}/:id`, { preHandler: [requireAuth, requireAdmin] }, adminPatchSubCategory);
  app.delete<{ Params: { id: string } }>(`${BASE}/:id`, { preHandler: [requireAuth, requireAdmin] }, adminDeleteSubCategory);

  // Mutations
  app.post<{ Body: { items: Array<{ id: string; display_order: number }> } }>(`${BASE}/reorder`, { preHandler: [requireAuth, requireAdmin] }, adminReorderSubCategories);
  app.patch<{ Params: { id: string }; Body: { is_active: boolean } }>(`${BASE}/:id/active`, { preHandler: [requireAuth, requireAdmin] }, adminToggleSubActive);
  app.patch<{ Params: { id: string }; Body: { is_featured: boolean } }>(`${BASE}/:id/featured`, { preHandler: [requireAuth, requireAdmin] }, adminToggleSubFeatured);

  // Image (asset_id + alt)
  app.patch<{ Params: { id: string }; Body: SubCategorySetImageInput }>(`${BASE}/:id/image`, { preHandler: [requireAuth, requireAdmin] }, adminSetSubCategoryImage);
}
