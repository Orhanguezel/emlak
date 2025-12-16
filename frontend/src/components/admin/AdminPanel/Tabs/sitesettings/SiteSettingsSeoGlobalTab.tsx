// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SiteSettingsSeoGlobalTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SettingsFormApi } from "./SiteSettingsTab";

type Props = {
  form: SettingsFormApi;
};

export function SiteSettingsSeoGlobalTab({ form }: Props) {
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

  const renderTextarea = (
    key: string,
    label: string,
    placeholder?: string,
    rows = 4,
  ) => (
    <div className="md:col-span-2">
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <Textarea
        rows={rows}
        value={getValue(key)}
        onChange={(e) => setValue(key, e.target.value)}
        placeholder={placeholder}
      />
      <p className="mt-1 text-[11px] text-gray-400 font-mono">{key}</p>
    </div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {renderTextarea(
        "seo_defaults",
        "SEO Varsayılan Ayarları (JSON)",
        undefined,
        6,
      )}
      {renderTextarea(
        "seo_social_same_as",
        "SEO Social sameAs (JSON Array)",
        undefined,
        4,
      )}
      {renderTextarea(
        "seo_app_icons",
        "App Icons (JSON)",
        undefined,
        4,
      )}
      {renderTextInput(
        "seo_amp_google_client_id_api",
        "AMP Google Client Id API",
        "googleanalytics",
      )}
      {renderTextInput(
        "seo_contact_title",
        "SEO İletişim Title (Örnek Ekstra)",
      )}
    </div>
  );
}
