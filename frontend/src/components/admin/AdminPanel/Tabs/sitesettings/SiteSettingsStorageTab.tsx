// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SiteSettingsStorageTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import type { SettingsFormApi } from "./SiteSettingsTab";

type Props = {
  form: SettingsFormApi;
};

export function SiteSettingsStorageTab({ form }: Props) {
  const { getValue, setValue } = form;

  const renderTextInput = (
    key: string,
    label: string,
    placeholder?: string,
  ) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <Input
        value={getValue(key)}
        onChange={(e) => setValue(key, e.target.value)}
        placeholder={placeholder}
      />
      <p className="mt-1 text-[11px] text-gray-400 font-mono">{key}</p>
    </div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {renderTextInput("storage_driver", "Storage Driver", "local")}
      {renderTextInput(
        "storage_local_root",
        "Local Root Dizini",
        "/www/wwwroot/mezartasi/uploads",
      )}
      {renderTextInput(
        "storage_local_base_url",
        "Local Base URL",
        "http://localhost:8083/uploads",
      )}
      {renderTextInput(
        "storage_cdn_public_base",
        "CDN Public Base",
        "https://cdn.mezartasi.com",
      )}
      {renderTextInput(
        "storage_public_api_base",
        "Public API Base",
        "https://mezartasi.com/api",
      )}

      {renderTextInput(
        "cloudinary_cloud_name",
        "Cloudinary Cloud Name",
      )}
      {renderTextInput("cloudinary_api_key", "Cloudinary API Key")}
      {renderTextInput("cloudinary_api_secret", "Cloudinary API Secret")}
      {renderTextInput(
        "cloudinary_folder",
        "Cloudinary Klasör",
        "uploads",
      )}
      {renderTextInput(
        "cloudinary_unsigned_preset",
        "Cloudinary Unsigned Preset",
        "mezartasi_unsigned_preset",
      )}
    </div>
  );
}
