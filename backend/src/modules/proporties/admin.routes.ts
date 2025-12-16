// src/modules/proporties/admin.routes.ts
import type { FastifyInstance } from "fastify";
import {
  listPropertiesAdmin,
  getPropertyAdmin,
  getPropertyBySlugAdmin,
  createPropertyAdmin,
  updatePropertyAdmin,
  removePropertyAdmin,
} from "./admin.controller";

const BASE = "/properties";

export async function registerPropertiesAdmin(app: FastifyInstance) {
  app.get(`${BASE}`, { config: { auth: true } }, listPropertiesAdmin);
  app.get(`${BASE}/:id`, { config: { auth: true } }, getPropertyAdmin);
  app.get(`${BASE}/by-slug/:slug`, { config: { auth: true } }, getPropertyBySlugAdmin);

  app.post(`${BASE}`, { config: { auth: true } }, createPropertyAdmin);
  app.patch(`${BASE}/:id`, { config: { auth: true } }, updatePropertyAdmin);
  app.delete(`${BASE}/:id`, { config: { auth: true } }, removePropertyAdmin);
}
