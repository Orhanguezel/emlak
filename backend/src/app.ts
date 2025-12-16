// src/app.ts
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';

import fs from 'node:fs';
import path from 'node:path';

import authPlugin from "./plugins/authPlugin";
import mysqlPlugin from '@/plugins/mysql';

import type { FastifyInstance } from 'fastify';
import { env } from '@/core/env';
import { registerErrorHandlers } from '@/core/error';

// Public modüller
import { registerAuth } from '@/modules/auth/router';
import { registerStorage } from '@/modules/storage/router';
import { registerProfiles } from '@/modules/profiles/router';
import { registerCategories } from '@/modules/categories/router';
import { registerSubCategories } from '@/modules/subcategories/router';
import { registerCustomPages } from '@/modules/customPages/router';
import { registerSiteSettings } from '@/modules/siteSettings/router';
import { registerUserRoles } from "@/modules/userRoles/router";
import { registerProperties } from "@/modules/proporties/router";
import { registerReviews } from "@/modules/review/router";
import { registerContacts } from "@/modules/contact/router";
import { registerSlider } from "@/modules/slider/router";
import { registerMail } from "@/modules/mail/router";
import { registerNotifications } from "@/modules/notifications/router";
import { registerFaqs } from '@/modules/faqs/router';

// Admin modüller
import { registerCustomPagesAdmin } from "@/modules/customPages/admin.routes";
import { registerSiteSettingsAdmin } from '@/modules/siteSettings/admin.routes';
import { registerUserAdmin } from "@/modules/auth/admin.routes";
import { registerPropertiesAdmin } from "@/modules/proporties/admin.routes";
import { registerReviewsAdmin } from "@/modules/review/admin.routes";
import { registerContactsAdmin } from "@/modules/contact/admin.routes";
import { registerSliderAdmin } from "@/modules/slider/admin.routes";
import { registerStorageAdmin } from '@/modules/storage/admin.routes';
import { registerCategoriesAdmin } from '@/modules/categories/admin.routes';
import { registerSubCategoriesAdmin } from '@/modules/subcategories/admin.routes';
import { registerDbAdmin } from "@/modules/db_admin/admin.routes";
import { registerFaqsAdmin } from '@/modules/faqs/admin.routes';

// Storage config (site_settings + env) — localBaseUrl için kullanacağız
import { getStorageSettings } from "@/modules/siteSettings/service";

function parseCorsOrigins(v?: string | string[]): boolean | string[] {
  if (!v) return true;
  if (Array.isArray(v)) return v;
  const s = String(v).trim();
  if (!s) return true;
  const arr = s.split(",").map(x => x.trim()).filter(Boolean);
  return arr.length ? arr : true;
}

/** uploads root seçimi: env → site_settings → cwd/uploads, ama path yoksa veya izin yoksa cwd/uploads'a düş */
function pickUploadsRoot(rawFromSettings?: string | null): string {
  const fallback = path.join(process.cwd(), "uploads");

  // ENV local override (dev/prod)
  const envRoot = env.LOCAL_STORAGE_ROOT && String(env.LOCAL_STORAGE_ROOT).trim();
  const candidate = envRoot || (rawFromSettings || "").trim() || fallback;

  const ensureDir = (p: string): string => {
    try {
      if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true });
      }
      return p;
    } catch {
      // izin yok / hata → fallback
      if (!fs.existsSync(fallback)) {
        fs.mkdirSync(fallback, { recursive: true });
      }
      return fallback;
    }
  };

  return ensureDir(candidate);
}

/** uploads prefix seçimi: env → site_settings → "/uploads"  (başında / , sonunda tek / ) */
function pickUploadsPrefix(rawFromSettings?: string | null): string {
  const envBase = env.LOCAL_STORAGE_BASE_URL && String(env.LOCAL_STORAGE_BASE_URL).trim();
  let p = envBase || (rawFromSettings || "").trim() || "/uploads";

  if (!p.startsWith("/")) p = `/${p}`;
  p = p.replace(/\/+$/, ""); // sondaki slash'ları temizle
  return `${p}/`; // fastify-static prefix (örn: "/uploads/")
}

export async function createApp() {
  const { default: buildFastify } =
    (await import('fastify')) as unknown as {
      default: (opts?: Parameters<FastifyInstance['log']['child']>[0]) => FastifyInstance
    };

  const app = buildFastify({
    logger: env.NODE_ENV !== 'production',
  }) as FastifyInstance;

  // --- CORS ---
  await app.register(cors, {
    origin: parseCorsOrigins(env.CORS_ORIGIN as any),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 'Authorization', 'Prefer', 'Accept', 'Accept-Language',
      'x-skip-auth', 'Range',
    ],
    exposedHeaders: ['x-total-count', 'content-range', 'range'],
  });

  // --- Cookie ---
  const cookieSecret =
    (globalThis as any).Bun?.env?.COOKIE_SECRET ??
    process.env.COOKIE_SECRET ?? 'cookie-secret';

  await app.register(cookie, {
    secret: cookieSecret,
    hook: 'onRequest',
    parseOptions: {
      httpOnly: true,
      path: '/',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
    },
  });

  // --- JWT ---
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: { cookieName: 'access_token', signed: false },
  });

  // 🔒 Guard & 🗄️ MySQL
  await app.register(authPlugin);
  await app.register(mysqlPlugin);

  // === 📁 UPLOADS STATIC SERVE ===
  // site_settings + env'ten storage ayarlarını çek (DB hazır çünkü mysqlPlugin'i register ettik)
  let storageSettings: Awaited<ReturnType<typeof getStorageSettings>> | null = null;
  try {
    storageSettings = await getStorageSettings();
  } catch {
    storageSettings = null;
  }

  const uploadsRoot = pickUploadsRoot(storageSettings?.localRoot);
  const uploadsPrefix = pickUploadsPrefix(storageSettings?.localBaseUrl);

  // Örnek: root = /home/orhan/Documents/mezarTasi/backend/uploads
  //         prefix = /uploads/
  await app.register(fastifyStatic, {
    root: uploadsRoot,
    prefix: uploadsPrefix,
    decorateReply: false,
  });

  // Health hem kökte hem /api altında
  app.get('/health', async () => ({ ok: true }));
  app.get('/api/health', async () => ({ ok: true }));

  // Multipart
  await app.register(multipart, {
    throwFileSizeLimit: true,
    limits: { fileSize: 20 * 1024 * 1024 },
  });

  // === TÜM ROUTER’LARI /api ALTINDA TOPLA ===
  await app.register(async (api) => {
    // --- Admin modüller → /api/admin/...
    await api.register(registerCustomPagesAdmin, { prefix: "/admin" });
    await api.register(registerSiteSettingsAdmin, { prefix: "/admin" });
    await api.register(registerUserAdmin, { prefix: "/admin" });
    await api.register(registerPropertiesAdmin, { prefix: "/admin" });
    await api.register(registerReviewsAdmin, { prefix: "/admin" });
    await api.register(registerContactsAdmin, { prefix: "/admin" });
    await api.register(registerSliderAdmin, { prefix: "/admin" });
    await api.register(registerStorageAdmin, { prefix: "/admin" });
    await api.register(registerCategoriesAdmin, { prefix: "/admin" });
    await api.register(registerSubCategoriesAdmin, { prefix: "/admin" });
    await api.register(registerDbAdmin, { prefix: "/admin" });
    await api.register(registerFaqsAdmin, { prefix: "/admin" });

    // --- Public modüller → /api/...
    await registerAuth(api);
    await registerStorage(api);
    await registerProfiles(api);
    await registerCategories(api);
    await registerSubCategories(api);
    await registerCustomPages(api);
    await registerSiteSettings(api);
    await registerUserRoles(api);
    await registerReviews(api);
    await registerContacts(api);
    await registerSlider(api);
    await registerMail(api);
    await registerNotifications(api);
    await registerProperties(api);
    await registerFaqs(api);


  }, { prefix: "/api" });

  registerErrorHandlers(app);
  return app;
}
