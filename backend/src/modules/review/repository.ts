// =============================================================
// FILE: src/modules/review/repository.ts
// =============================================================
import type { FastifyInstance } from "fastify";
import type {
  ReviewCreateInput,
  ReviewListParams,
  ReviewUpdateInput,
} from "./validation";
import type { ReviewView } from "./schema";

/** MySQL tinyint(1) -> boolean, number coercion */
function mapRow(r: any): ReviewView {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    rating: Number(r.rating),
    comment: r.comment,
    is_active: Number(r.is_active) === 1,
    is_approved: Number(r.is_approved) === 1,
    display_order: Number(r.display_order),
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

function safeOrderBy(col?: string) {
  switch (col) {
    case "created_at":
    case "updated_at":
    case "display_order":
    case "rating":
    case "name":
      return col;
    default:
      return "display_order";
  }
}

/* ---------------- PUBLIC ---------------- */

export async function repoGetReviewPublic(
  app: FastifyInstance,
  id: string
): Promise<ReviewView | null> {
  const mysql = (app as any).mysql;
  const [rows] = await mysql.query(
    `SELECT r.* FROM reviews r WHERE r.id = ? LIMIT 1`,
    [id]
  );
  const row = (rows as any[])[0];
  return row ? mapRow(row) : null;
}

export async function repoCreateReviewPublic(
  app: FastifyInstance,
  body: ReviewCreateInput
): Promise<ReviewView> {
  const mysql = (app as any).mysql;

  const isActive = body.is_active ?? true;
  // Public gönderimler default onaysız
  const isApproved = body.is_approved ?? false;
  const displayOrder = body.display_order ?? 0;

  await mysql.query(
    `
    INSERT INTO reviews
    (id, name, email, rating, comment,
     is_active, is_approved, display_order,
     created_at, updated_at)
    VALUES
    (UUID(), ?, ?, ?, ?,
     ?, ?, ?,
     NOW(3), NOW(3))
    `,
    [
      body.name,
      body.email,
      body.rating,
      body.comment,
      isActive ? 1 : 0,
      isApproved ? 1 : 0,
      displayOrder,
    ]
  );

  const [rows] = await mysql.query(
    `
    SELECT r.*
    FROM reviews r
    WHERE r.email = ?
      AND r.comment = ?
    ORDER BY r.created_at DESC
    LIMIT 1
    `,
    [body.email, body.comment]
  );
  const row = (rows as any[])[0];
  if (!row) throw new Error("Review insert ok, but fetch failed.");
  return mapRow(row);
}

/* ---------------- ADMIN ---------------- */

// ❗️ TEK admin listesi: approved/active yalnızca belirtilirse filtrelenir.
export async function repoListReviewsAdmin(
  app: FastifyInstance,
  q: ReviewListParams
): Promise<ReviewView[]> {
  const mysql = (app as any).mysql;

  const where: string[] = [];
  const args: any[] = [];

  if (q.search) {
    const s = `%${q.search}%`;
    where.push("(name LIKE ? OR email LIKE ? OR comment LIKE ?)");
    args.push(s, s, s);
  }
  if (typeof q.approved === "boolean") {
    where.push("is_approved = ?");
    args.push(q.approved ? 1 : 0);
  }
  if (typeof q.active === "boolean") {
    where.push("is_active = ?");
    args.push(q.active ? 1 : 0);
  }
  if (typeof q.minRating === "number") {
    where.push("rating >= ?");
    args.push(q.minRating);
  }
  if (typeof q.maxRating === "number") {
    where.push("rating <= ?");
    args.push(q.maxRating);
  }

  const sql = `
    SELECT id, name, email, rating, comment,
           is_active, is_approved, display_order,
           created_at, updated_at
    FROM reviews
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY ${safeOrderBy(q.orderBy)} ${q.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"}
    LIMIT ? OFFSET ?
  `;
  args.push(q.limit ?? 100, q.offset ?? 0);

  const [rows] = await mysql.query(sql, args);
  return (rows as any[]).map(mapRow);
}


export async function repoGetReviewAdmin(
  app: FastifyInstance,
  id: string
): Promise<ReviewView | null> {
  return repoGetReviewPublic(app, id);
}

export async function repoCreateReviewAdmin(
  app: FastifyInstance,
  body: ReviewCreateInput
): Promise<ReviewView> {
  return repoCreateReviewPublic(app, body);
}

export async function repoUpdateReviewAdmin(
  app: FastifyInstance,
  id: string,
  body: ReviewUpdateInput
): Promise<ReviewView | null> {
  const mysql = (app as any).mysql;

  const fields: string[] = [];
  const binds: any[] = [];

  for (const [k, v] of Object.entries(body)) {
    if (v === undefined) continue;
    if (k === "is_active" || k === "is_approved") {
      fields.push(`${k} = ?`);
      binds.push(v ? 1 : 0);
    } else {
      fields.push(`${k} = ?`);
      binds.push(v);
    }
  }

  if (fields.length === 0) {
    return await repoGetReviewAdmin(app, id);
  }

  const sql = `
    UPDATE reviews
    SET ${fields.join(", ")}, updated_at = NOW(3)
    WHERE id = ?
    LIMIT 1
  `;
  await mysql.query(sql, [...binds, id]);

  return await repoGetReviewAdmin(app, id);
}

export async function repoDeleteReviewAdmin(
  app: FastifyInstance,
  id: string
): Promise<boolean> {
  const mysql = (app as any).mysql;
  const [res] = await mysql.query(`DELETE FROM reviews WHERE id = ? LIMIT 1`, [id]);
  return (res?.affectedRows ?? 0) > 0;
}

/* ---------------- PUBLIC ---------------- */

// ✅ Public liste: approved/active varsayılanı true
export async function repoListReviewsPublic(
  app: FastifyInstance,
  q: ReviewListParams
): Promise<ReviewView[]> {
  const mysql = (app as any).mysql;

  const where: string[] = [];
  const args: any[] = [];

  // Public’te defaultlar:
  const approved = typeof q.approved === "boolean" ? q.approved : true;
  const active   = typeof q.active   === "boolean" ? q.active   : true;

  if (q.search) {
    const s = `%${q.search}%`;
    where.push("(name LIKE ? OR email LIKE ? OR comment LIKE ?)");
    args.push(s, s, s);
  }

  // 🔒 Public: approved & active varsayılan olarak zorunlu
  where.push("is_approved = ?");
  args.push(approved ? 1 : 0);

  where.push("is_active = ?");
  args.push(active ? 1 : 0);

  if (typeof q.minRating === "number") {
    where.push("rating >= ?");
    args.push(q.minRating);
  }
  if (typeof q.maxRating === "number") {
    where.push("rating <= ?");
    args.push(q.maxRating);
  }

  const sql = `
    SELECT id, name, email, rating, comment,
           is_active, is_approved, display_order,
           created_at, updated_at
    FROM reviews
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY ${safeOrderBy(q.orderBy)} ${q.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"}
    LIMIT ? OFFSET ?
  `;
  args.push(q.limit ?? 100, q.offset ?? 0);

  const [rows] = await mysql.query(sql, args);
  return (rows as any[]).map(mapRow);
}

