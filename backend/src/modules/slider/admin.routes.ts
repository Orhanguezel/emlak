// =============================================================
// FILE: src/modules/slider/admin.routes.ts  (ADMIN ROUTES)
// =============================================================
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { requireAdmin } from "@/common/middleware/roles";

import {
  adminListSlides,
  adminGetSlide,
  adminCreateSlide,
  adminUpdateSlide,
  adminDeleteSlide,
  adminReorderSlides,
  adminSetStatus,
  adminSetSliderImage,
} from "./admin.controller";

export async function registerSliderAdmin(app: FastifyInstance) {
  const BASE = "/sliders";

  // LIST
  app.get<{ Querystring: unknown }>(
    `${BASE}`,
    { preHandler: [requireAuth, requireAdmin] },
    adminListSlides
  );

  // DETAIL
  app.get<{ Params: { id: string } }>(
    `${BASE}/:id`,
    { preHandler: [requireAuth, requireAdmin] },
    adminGetSlide
  );

  // CREATE
  app.post<{ Body: unknown }>(
    `${BASE}`,
    { preHandler: [requireAuth, requireAdmin] },
    adminCreateSlide
  );

  // UPDATE (partial)
  app.patch<{ Params: { id: string }; Body: unknown }>(
    `${BASE}/:id`,
    { preHandler: [requireAuth, requireAdmin] },
    adminUpdateSlide
  );

  // DELETE
  app.delete<{ Params: { id: string } }>(
    `${BASE}/:id`,
    { preHandler: [requireAuth, requireAdmin] },
    adminDeleteSlide
  );

  // REORDER
  app.post<{ Body: unknown }>(
    `${BASE}/reorder`,
    { preHandler: [requireAuth, requireAdmin] },
    adminReorderSlides
  );

  // STATUS
  app.post<{ Params: { id: string }; Body: unknown }>(
    `${BASE}/:id/status`,
    { preHandler: [requireAuth, requireAdmin] },
    adminSetStatus
  );

  // IMAGE (storage ile set/kaldır)
  app.patch<{ Params: { id: string }; Body: unknown }>(
    `${BASE}/:id/image`,
    { preHandler: [requireAuth, requireAdmin] },
    adminSetSliderImage
  );
}
