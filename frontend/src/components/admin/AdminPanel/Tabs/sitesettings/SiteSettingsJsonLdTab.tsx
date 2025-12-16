// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SiteSettingsJsonLdTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import type { SettingsFormApi } from "./SiteSettingsTab";

type Props = {
  form: SettingsFormApi;
};

export function SiteSettingsJsonLdTab({ form }: Props) {
  const { getValue, setValue } = form;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          LocalBusiness JSON-LD (JSON)
        </label>
        <Textarea
          rows={10}
          value={getValue("seo_local_business")}
          onChange={(e) => setValue("seo_local_business", e.target.value)}
        />
        <p className="mt-1 text-[11px] text-gray-400 font-mono">
          seo_local_business
        </p>
      </div>
    </div>
  );
}
