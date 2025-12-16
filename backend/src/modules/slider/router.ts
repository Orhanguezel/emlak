// =============================================================
// FILE: src/modules/slider/router.ts  (PUBLIC ROUTES ONLY)
// =============================================================
import type { FastifyInstance } from "fastify";
import { listPublicSlides, getPublicSlide } from "./controller";

export async function registerSlider(app: FastifyInstance) {
  app.get<{ Querystring: unknown }>(
    "/sliders",
    { config: { public: true } },
    listPublicSlides
  );

  // detail gerekiyorsa (slug ile)
  app.get<{ Params: { idOrSlug: string } }>(
    "/sliders/:idOrSlug",
    { config: { public: true } },
    getPublicSlide
  );
}
