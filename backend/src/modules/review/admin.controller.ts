// =============================================================
// FILE: src/modules/review/admin.controller.ts (ADMIN)
// =============================================================
import type { FastifyRequest } from "fastify";
import {
  ReviewListParams as ReviewListParamsSchema,
  ReviewCreateInput as ReviewCreateSchema,
  ReviewUpdateInput as ReviewUpdateSchema,
  IdParam as IdParamSchema,
} from "./validation";
import {
  repoListReviewsAdmin,
  repoGetReviewAdmin,
  repoCreateReviewAdmin,
  repoUpdateReviewAdmin,
  repoDeleteReviewAdmin,
} from "./repository";

export async function listReviewsAdmin(req: FastifyRequest) {
  const q = ReviewListParamsSchema.parse(req.query);
  return await repoListReviewsAdmin(req.server, q);
}

export async function getReviewAdmin(req: FastifyRequest) {
  const { id } = IdParamSchema.parse(req.params);
  return await repoGetReviewAdmin(req.server, id);
}

export async function createReviewAdmin(req: FastifyRequest) {
  const body = ReviewCreateSchema.parse((req as any).body);
  return await repoCreateReviewAdmin(req.server, body);
}

export async function updateReviewAdmin(req: FastifyRequest) {
  const { id } = IdParamSchema.parse(req.params);
  const body = ReviewUpdateSchema.parse((req as any).body);
  return await repoUpdateReviewAdmin(req.server, id, body);
}

export async function removeReviewAdmin(req: FastifyRequest) {
  const { id } = IdParamSchema.parse(req.params);
  const ok = await repoDeleteReviewAdmin(req.server, id);
  return { ok };
}
