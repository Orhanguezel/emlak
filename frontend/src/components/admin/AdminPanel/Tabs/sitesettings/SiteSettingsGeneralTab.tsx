// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SiteSettingsGeneralTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SettingsFormApi } from "./SiteSettingsTab";

type Props = {
  form: SettingsFormApi;
};

export function SiteSettingsGeneralTab({ form }: Props) {
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
      {renderTextInput("brand_name", "Marka Adı", "xemlak.com")}
      {renderTextInput(
        "brand_tagline",
        "Kısa Slogan",
        "online mezar yapımı",
      )}
      {renderTextarea(
        "ui_theme",
        "Tema Ayarları (JSON)",
        '{"color":"teal","primaryHex":"#009688","darkMode":false,"navbarHeight":96}',
        6,
      )}
      {renderTextInput("site_version", "Site Versiyonu", "1.0.0")}
      {renderTextInput(
        "admin_path",
        "Admin Paneli URL Path",
        "/adminkontrol",
      )}

      {renderTextInput(
        "header_info_text",
        "Header Bilgi Metni",
        "Ürünlerimiz Hakkında Detaylı Bilgi İçin",
      )}
      {renderTextInput(
        "header_cta_label",
        "Header CTA Buton Yazısı",
        "HEMEN ARA",
      )}
    </div>
  );
}
