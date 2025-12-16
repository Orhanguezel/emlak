// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SiteSettingsFooterMenuTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import type { SettingsFormApi } from "./SiteSettingsTab";

type Props = {
  form: SettingsFormApi;
};

export function SiteSettingsFooterMenuTab({ form }: Props) {
  const { getValue, setValue } = form;

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
        "footer_keywords",
        "Footer Anahtar Kelimeler (JSON Array)",
        '["Ucuz Mezar Yapımı","Mezar Yapımı İşleri",...]',
        4,
      )}
      {renderTextarea(
        "footer_services",
        "Footer Hizmetler (JSON Array)",
        '["Mezar Yapımı","Mezar Bakımı",...]',
        4,
      )}
      {renderTextarea(
        "footer_quick_links",
        "Footer Hızlı Linkler (JSON Array)",
        '[{"title":"Anasayfa","path":"/","pageKey":"home"},...]',
        6,
      )}

      {renderTextarea(
        "menu_kurumsal",
        "Menü - Kurumsal (JSON Array)",
        undefined,
        6,
      )}
      {renderTextarea(
        "menu_other_services",
        "Menü - Diğer Hizmetler (JSON Array)",
        undefined,
        4,
      )}
    </div>
  );
}
