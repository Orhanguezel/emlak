// -------------------------------------------------------------
// FILE: src/components/public/ContactInfo.tsx
// -------------------------------------------------------------
"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

type SiteSettingLike = { key?: string; name?: string; value?: any };

function safeJson<T>(v: any, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === "object") return v as T;
  if (typeof v !== "string") return fallback;
  const s = v.trim();
  if (!s) return fallback;

  try {
    return JSON.parse(s) as T;
  } catch {
    try {
      const unquoted = JSON.parse(s);
      if (typeof unquoted === "string") {
        try {
          return JSON.parse(unquoted) as T;
        } catch {
          return (unquoted as unknown) as T;
        }
      }
      return (unquoted as unknown) as T;
    } catch {
      return fallback;
    }
  }
}

function toSettingsMap(data: unknown): Record<string, any> {
  if (!data) return {};
  const normalized = (data as any)?.data ?? data;

  if (Array.isArray(normalized)) {
    const m: Record<string, any> = {};
    for (const it of normalized as SiteSettingLike[]) {
      const k = String(it?.key ?? it?.name ?? "").trim();
      if (!k) continue;
      m[k] = it?.value;
    }
    return m;
  }

  if (typeof normalized === "object") return normalized as Record<string, any>;
  return {};
}

function sanitizePhoneDigits(s: string): string {
  return (s || "").replace(/[^\d+]/g, "").replace(/\s+/g, "");
}

function buildTelHref(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "tel:+49000000000";
  if (trimmed.startsWith("tel:")) return trimmed;

  const cleaned = sanitizePhoneDigits(trimmed);
  if (!cleaned) return "tel:+49000000000";
  if (cleaned.startsWith("+")) return `tel:${cleaned}`;
  return `tel:+${cleaned}`;
}

export function ContactInfo() {
  const { data: settingsRes } = useListSiteSettingsQuery({
    keys: ["contact_phone_display", "contact_phone_tel", "contact_email", "contact_address"],
  });

  const settings = React.useMemo(() => toSettingsMap(settingsRes), [settingsRes]);

  const phoneDisplay = safeJson<string>(settings["contact_phone_display"], "+49 000 000000");
  const phoneTelRaw = safeJson<string>(settings["contact_phone_tel"], phoneDisplay);
  const email = safeJson<string>(settings["contact_email"], "info@xemlak.com");
  const address = safeJson<string>(settings["contact_address"], "Grevenbroich, Deutschland");

  const phoneHref = buildTelHref(phoneTelRaw);

  return (
    <section className="py-8 bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* TELEFON */}
          <div className="text-center text-white border border-white/10 rounded-2xl p-5">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-wide text-white/70 mb-1">Telefon</div>
            <a href={phoneHref} className="font-semibold hover:underline">
              {phoneDisplay}
            </a>
          </div>

          {/* E-POSTA */}
          <div className="text-center text-white border border-white/10 rounded-2xl p-5">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-wide text-white/70 mb-1">E-posta</div>
            <a href={`mailto:${email}`} className="font-semibold hover:underline break-all">
              {email}
            </a>
          </div>

          {/* ADRES */}
          <div className="text-center text-white border border-white/10 rounded-2xl p-5">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-wide text-white/70 mb-1">Adres</div>
            <div className="text-white/85 leading-snug">{address}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
