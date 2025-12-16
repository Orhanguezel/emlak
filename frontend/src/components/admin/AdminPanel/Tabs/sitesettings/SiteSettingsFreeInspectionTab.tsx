// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SiteSettingsFreeInspectionTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SettingsFormApi } from "./SiteSettingsTab";

type Props = {
  form: SettingsFormApi;
};

export function SiteSettingsFreeInspectionTab({ form }: Props) {
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
      {renderTextInput(
        "free_inspection_hero_image",
        "Hero Görsel URL",
      )}
      {renderTextInput(
        "free_inspection_meta_date",
        "Meta Tarih",
        "Şubat 2024",
      )}
      {renderTextInput(
        "free_inspection_meta_tag",
        "Meta Etiket",
        "Hizmet",
      )}
      {renderTextarea(
        "free_inspection_title",
        "Sayfa Başlığı",
        undefined,
        2,
      )}
      {renderTextarea(
        "free_inspection_lead_title",
        "Lead Başlık",
        undefined,
        2,
      )}
      {renderTextarea(
        "free_inspection_lead_body",
        "Lead Açıklama",
        undefined,
        4,
      )}

      {renderTextarea(
        "free_inspection_steps_title",
        "Adımlar Başlığı",
        undefined,
        2,
      )}
      {renderTextarea(
        "free_inspection_steps",
        "Adımlar (JSON Array)",
        `[{"step":"1","title":"Randevu Alın","description":"..."}]`,
        6,
      )}

      {renderTextarea(
        "free_inspection_service_areas_title",
        "Hizmet Bölgeleri Başlığı",
        undefined,
        2,
      )}
      {renderTextarea(
        "free_inspection_service_areas_intro",
        "Hizmet Bölgeleri Giriş Metni",
        undefined,
        3,
      )}
      {renderTextarea(
        "free_inspection_service_areas",
        "Hizmet Bölgeleri (JSON Array)",
        '["Üsküdar","Kadıköy", ...]',
        4,
      )}

      {renderTextarea(
        "free_inspection_scope_title",
        "Kapsam Başlığı",
        undefined,
        2,
      )}
      {renderTextarea(
        "free_inspection_scope_items",
        "Kapsam Maddeleri (JSON Array)",
        '["Mezar yerinin detaylı ölçümü", "..."]',
        4,
      )}

      {renderTextarea(
        "free_inspection_speed_title",
        "Hız / Pratik Başlık",
        undefined,
        2,
      )}
      {renderTextarea(
        "free_inspection_speed_items",
        "Hız Maddeleri (JSON Array)",
        undefined,
        4,
      )}

      {renderTextarea(
        "free_inspection_cta_title",
        "CTA Başlığı",
        undefined,
        2,
      )}
      {renderTextarea(
        "free_inspection_cta_body",
        "CTA Metni",
        undefined,
        4,
      )}

      {renderTextarea(
        "free_inspection_info_title",
        "Bilgi Kutusu Başlık",
        undefined,
        2,
      )}
      {renderTextarea(
        "free_inspection_info_body",
        "Bilgi Kutusu Metin",
        undefined,
        4,
      )}
    </div>
  );
}
