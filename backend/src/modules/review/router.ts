// =============================================================
// FILE: src/modules/review/router.ts (PUBLIC)
// =============================================================
import type { FastifyInstance } from "fastify";
import {
  listReviewsPublic,
  getReviewPublic,
  createReviewPublic,
} from "./controller";

const BASE = "/reviews";

export async function registerReviews(app: FastifyInstance) {
  app.get(`${BASE}`,        { config: { public: true } }, listReviewsPublic);
  app.get(`${BASE}/:id`,    { config: { public: true } }, getReviewPublic);
  app.post(`${BASE}`,       { config: { public: true } }, createReviewPublic);
}
