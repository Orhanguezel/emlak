// =============================================================
// FILE: src/modules/review/controller.ts (PUBLIC)
// =============================================================
import type { FastifyRequest } from "fastify";
import {
  ReviewListParams as ReviewListParamsSchema,
  ReviewCreateInput as ReviewCreateSchema,
  IdParam as IdParamSchema,
} from "./validation";
import {
  repoListReviewsPublic,
  repoGetReviewPublic,
  repoCreateReviewPublic,
} from "./repository";

export async function listReviewsPublic(req: FastifyRequest) {
  const q = ReviewListParamsSchema.parse(req.query);
  return await repoListReviewsPublic(req.server, q);
}

export async function getReviewPublic(req: FastifyRequest) {
  const { id } = IdParamSchema.parse(req.params);
  return await repoGetReviewPublic(req.server, id);
}

/** Public form submit */
export async function createReviewPublic(req: FastifyRequest) {
  const body = ReviewCreateSchema.parse((req as any).body);
  return await repoCreateReviewPublic(req.server, body);
}
