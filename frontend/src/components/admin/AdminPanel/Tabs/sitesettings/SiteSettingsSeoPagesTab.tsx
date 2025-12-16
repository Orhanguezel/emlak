// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SiteSettingsSeoPagesTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import type { SettingsFormApi } from "./SiteSettingsTab";

type Props = {
  form: SettingsFormApi;
};

export function SiteSettingsSeoPagesTab({ form }: Props) {
  const { getValue, setValue } = form;

  const renderTextarea = (
    key: string,
    label: string,
    placeholder?: string,
    rows = 6,
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
      {renderTextarea("seo_pages_home", "SEO - Anasayfa (JSON)")}
      {renderTextarea("seo_pages_models", "SEO - Modeller (JSON)")}
      {renderTextarea(
        "seo_pages_accessories",
        "SEO - Aksesuarlar (JSON)",
      )}
      {renderTextarea(
        "seo_pages_gardening",
        "SEO - Çiçeklendirme (JSON)",
      )}
      {renderTextarea(
        "seo_pages_soilfilling",
        "SEO - Toprak Doldurumu (JSON)",
      )}
      {renderTextarea(
        "seo_pages_contact",
        "SEO - İletişim (JSON)",
      )}
      {renderTextarea(
        "seo_pages_about",
        "SEO - Hakkımızda (JSON)",
      )}
      {renderTextarea(
        "seo_pages_pricing",
        "SEO - Fiyatlar (JSON)",
      )}
    </div>
  );
}
