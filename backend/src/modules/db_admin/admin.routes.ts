// =============================================================
// FILE: src/routes/admin/registerDbAdmin.ts
// =============================================================
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import {
  adminExportSql,
  adminImportSqlText,
  adminImportSqlFromUrl,
  adminImportSqlFromFile,
  // NEW snapshot handlers
  adminListDbSnapshots,
  adminCreateDbSnapshot,
  adminRestoreDbSnapshot,
  adminDeleteDbSnapshot,
} from "./admin.controller";

export async function registerDbAdmin(app: FastifyInstance) {
  // Export (full backup - download)
  app.get("/db/export", { preHandler: [requireAuth] }, adminExportSql);

  // Import seçenekleri
  app.post("/db/import-sql", { preHandler: [requireAuth] }, adminImportSqlText);
  app.post("/db/import-url", { preHandler: [requireAuth] }, adminImportSqlFromUrl);
  app.post("/db/import-file", { preHandler: [requireAuth] }, adminImportSqlFromFile);

  // === SNAPSHOT API ===
  // Sunucuda saklanan snapshot listesi
  app.get("/db/snapshots", { preHandler: [requireAuth] }, adminListDbSnapshots);

  // Yeni snapshot oluştur (uploads/db_snapshots içine .sql kaydeder)
  app.post("/db/snapshots", { preHandler: [requireAuth] }, adminCreateDbSnapshot);

  // Snapshot'tan geri yükle
  app.post(
    "/db/snapshots/:id/restore",
    { preHandler: [requireAuth] },
    adminRestoreDbSnapshot
  );

  // Snapshot sil
  app.delete(
    "/db/snapshots/:id",
    { preHandler: [requireAuth] },
    adminDeleteDbSnapshot
  );
}
