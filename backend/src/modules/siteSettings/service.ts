// =============================================================
// FILE: src/modules/siteSettings/service.ts
// =============================================================

import { db } from "@/db/client";
import { siteSettings } from "./schema";
import { inArray } from "drizzle-orm";
import { env } from "@/core/env";

const SMTP_KEYS = [
  "smtp_host",
  "smtp_port",
  "smtp_username",
  "smtp_password",
  "smtp_from_email",
  "smtp_from_name",
  "smtp_ssl",
] as const;

// ---------------------------------------------------------------------------
// SMTP SETTINGS
// ---------------------------------------------------------------------------

export type SmtpSettings = {
  host: string | null;
  port: number | null;
  username: string | null;
  password: string | null;
  fromEmail: string | null;
  fromName: string | null;
  secure: boolean; // smtp_ssl
};

const toBool = (v: string | null | undefined): boolean => {
  if (!v) return false;
  const s = v.toLowerCase();
  return ["1", "true", "yes", "on"].includes(s);
};

export async function getSmtpSettings(): Promise<SmtpSettings> {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(inArray(siteSettings.key, SMTP_KEYS));

  const map = new Map<string, string>();
  for (const r of rows) {
    let v = r.value as string;
    try {
      const parsed = JSON.parse(v);
      if (typeof parsed === "string" || typeof parsed === "number") {
        v = String(parsed);
      }
    } catch {
      // value zaten plain string
    }
    map.set(r.key, v);
  }

  const host = map.get("smtp_host") ?? null;
  const portStr = map.get("smtp_port") ?? "";
  const port = portStr ? Number(portStr) : null;
  const username = map.get("smtp_username") ?? null;
  const password = map.get("smtp_password") ?? null;
  const fromEmail = map.get("smtp_from_email") ?? null;
  const fromName = map.get("smtp_from_name") ?? null;
  const secure = toBool(map.get("smtp_ssl"));

  return { host, port, username, password, fromEmail, fromName, secure };
}

// ---------------------------------------------------------------------------
// STORAGE SETTINGS (Cloudinary / Local) - site_settings tablosundan
// ---------------------------------------------------------------------------

const STORAGE_KEYS = [
  "storage_driver",
  "storage_local_root",
  "storage_local_base_url",
  "cloudinary_cloud_name",
  "cloudinary_api_key",
  "cloudinary_api_secret",
  "cloudinary_folder",
  "cloudinary_unsigned_preset",
  "storage_cdn_public_base",
  "storage_public_api_base",
] as const;

export type StorageDriver = "local" | "cloudinary";

export type StorageSettings = {
  driver: StorageDriver;
  localRoot: string | null;
  localBaseUrl: string | null;
  cloudName: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  folder: string | null;
  unsignedUploadPreset: string | null;
  cdnPublicBase?: string | null;
  publicApiBase?: string | null;
};

/**
 * Driver seçimi:
 *   1) site_settings.storage_driver  ✅ (öncelik)
 *   2) ENV (STORAGE_DRIVER)          🔁 (fallback)
 *   3) default: "cloudinary"
 */
const toDriver = (raw: string | null | undefined): StorageDriver => {
  const v = (raw || "").trim().toLowerCase();
  if (v === "local" || v === "cloudinary") return v;

  const envRaw = (env.STORAGE_DRIVER || "").trim().toLowerCase();
  if (envRaw === "local" || envRaw === "cloudinary") {
    return envRaw as StorageDriver;
  }

  return "cloudinary";
};

export async function getStorageSettings(): Promise<StorageSettings> {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(inArray(siteSettings.key, STORAGE_KEYS));

  const map = new Map<string, string>();
  for (const r of rows) {
    let v = r.value as string;
    try {
      const parsed = JSON.parse(v);
      if (typeof parsed === "string" || typeof parsed === "number") {
        v = String(parsed);
      }
    } catch {
      // plain string ise aynen bırak
    }
    map.set(r.key, v);
  }

  const driver = toDriver(map.get("storage_driver"));

  // 👇 Artık HER ALANDA önce site_settings, sonra env fallback
  const localRoot =
    map.get("storage_local_root") ??
    env.LOCAL_STORAGE_ROOT ??
    null;

  const localBaseUrl =
    map.get("storage_local_base_url") ??
    env.LOCAL_STORAGE_BASE_URL ??
    null;

  const cdnPublicBase =
    map.get("storage_cdn_public_base") ??
    env.STORAGE_CDN_PUBLIC_BASE ??
    null;

  const publicApiBase =
    map.get("storage_public_api_base") ??
    env.STORAGE_PUBLIC_API_BASE ??
    null;

  const cloudName =
    map.get("cloudinary_cloud_name") ??
    env.CLOUDINARY_CLOUD_NAME ??
    env.CLOUDINARY?.cloudName ??
    null;

  const apiKey =
    map.get("cloudinary_api_key") ??
    env.CLOUDINARY_API_KEY ??
    env.CLOUDINARY?.apiKey ??
    null;

  const apiSecret =
    map.get("cloudinary_api_secret") ??
    env.CLOUDINARY_API_SECRET ??
    env.CLOUDINARY?.apiSecret ??
    null;

  const folder =
    map.get("cloudinary_folder") ??
    env.CLOUDINARY_FOLDER ??
    env.CLOUDINARY?.folder ??
    null;

  const unsignedUploadPreset =
    map.get("cloudinary_unsigned_preset") ??
    env.CLOUDINARY_UNSIGNED_PRESET ??
    (env.CLOUDINARY as any)?.unsignedUploadPreset ??
    (env.CLOUDINARY as any)?.uploadPreset ??
    null;

  return {
    driver,
    localRoot,
    localBaseUrl,
    cloudName,
    apiKey,
    apiSecret,
    folder,
    unsignedUploadPreset,
  };
}
