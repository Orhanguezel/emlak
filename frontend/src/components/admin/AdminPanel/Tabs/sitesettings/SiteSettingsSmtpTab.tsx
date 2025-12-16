// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SiteSettingsSmtpTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { SettingsFormApi } from "./SiteSettingsTab";

type Props = {
  form: SettingsFormApi;
};

export function SiteSettingsSmtpTab({ form }: Props) {
  const { getValue, setValue } = form;

  const smtpSslChecked = React.useMemo(() => {
    const raw = getValue("smtp_ssl").trim().toLowerCase();
    if (!raw) return false;
    return (
      raw === "1" ||
      raw === "true" ||
      raw === "yes" ||
      raw === "on"
    );
  }, [getValue("smtp_ssl")]);

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
      {renderTextInput(
        "smtp_host",
        "SMTP Host",
        "smtp.hostinger.com / smtp.gmail.com",
      )}
      {renderTextInput("smtp_port", "SMTP Port", "465 veya 587")}
      {renderTextInput(
        "smtp_username",
        "SMTP Kullanıcı Adı",
        "info@mezarisim.com",
      )}

      {/* Şifre: password tipi */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          SMTP Şifre
        </label>
        <Input
          type="password"
          value={getValue("smtp_password")}
          onChange={(e) => setValue("smtp_password", e.target.value)}
        />
        <p className="mt-1 text-[11px] text-gray-400 font-mono">
          smtp_password
        </p>
      </div>

      {renderTextInput(
        "smtp_from_email",
        "Gönderen E-posta (From)",
        "info@mezarisim.com",
      )}
      {renderTextInput(
        "smtp_from_name",
        "Gönderen İsim",
        "Mezarisim.com",
      )}

      <div className="md:col-span-2 flex items-center gap-3">
        <Switch
          checked={smtpSslChecked}
          onCheckedChange={(v) => setValue("smtp_ssl", v ? "true" : "false")}
          className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
        />
        <div className="text-xs text-gray-700">
          <div className="font-medium">SSL (secure) bağlantı</div>
          <div className="text-[11px] text-gray-500">
            Genelde <strong>465</strong> portu için{" "}
            <code>secure: true</code> seçilir. 587 kullanıyorsan,
            çoğu sağlayıcı STARTTLS ister.
          </div>
          <p className="mt-1 text-[11px] text-gray-400 font-mono">
            smtp_ssl (true / false)
          </p>
        </div>
      </div>
    </div>
  );
}
