"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";

type Props = {
  listingNo: string; setListingNo: (v: string) => void;
  badgeText: string; setBadgeText: (v: string) => void;
  featured: boolean; setFeatured: (v: boolean) => void;
};

export function PropertyMetaSection(p: Props) {
  return (
    <Section title="İlan Meta">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>İlan No (ops.)</Label>
          <Input value={p.listingNo} onChange={(e) => p.setListingNo(e.target.value)} placeholder="örn: ILN-IST-000001" />
        </div>
        <div className="space-y-2">
          <Label>Badge (ops.)</Label>
          <Input value={p.badgeText} onChange={(e) => p.setBadgeText(e.target.value)} placeholder="örn: Fırsat" />
        </div>
        <div className="space-y-2">
          <Label>Öne Çıkan</Label>
          <div className="flex h-10 items-center">
            <Switch checked={p.featured} onCheckedChange={p.setFeatured} className="data-[state=checked]:bg-amber-500" />
          </div>
        </div>
      </div>
    </Section>
  );
}
