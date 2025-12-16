// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SiteSettingsContactTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SettingsFormApi } from "./SiteSettingsTab";

type Props = {
  form: SettingsFormApi;
};

export function SiteSettingsContactTab({ form }: Props) {
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
        "contact_phone_display",
        "Telefon (Görünen)",
        "0533 483 89 71",
      )}
      {renderTextInput(
        "contact_phone_tel",
        "Telefon (tel: formatı)",
        "05334838971",
      )}
      {renderTextInput(
        "contact_email",
        "E-posta",
        "mezarisim.com@gmail.com",
      )}
      {renderTextInput(
        "contact_to_email",
        "İletişim Formu Hedef E-posta",
        "mezarisim.com@gmail.com",
      )}
      {renderTextInput(
        "contact_whatsapp_link",
        "WhatsApp Linki",
        "https://wa.me/905334838971",
      )}
      {renderTextarea("contact_address", "Adres", "Adres metni", 3)}
    </div>
  );
}
