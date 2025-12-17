"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { RequiredMark } from "@/components/admin/AdminPanel/form/properties/RequiredMark";


type Props = {
  title: string; setTitle: (v: string) => void;
  slug: string; setSlug: (v: string) => void;
  autoSlug: boolean; setAutoSlug: (v: boolean) => void;

  type: string; setType: (v: string) => void;
  status: string; setStatus: (v: string) => void;

  address: string; setAddress: (v: string) => void;
  city: string; setCity: (v: string) => void;
  district: string; setDistrict: (v: string) => void;
  neighborhood: string; setNeighborhood: (v: string) => void;
};

export function PropertyBasicSection(p: Props) {
  return (
    <Section title="Temel Bilgiler">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Başlık<RequiredMark /></Label>
          <Input value={p.title} onChange={(e) => p.setTitle(e.target.value)} placeholder="Emlak başlığı" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label>Slug<RequiredMark /></Label>
            <label className="flex items-center gap-2 text-xs text-gray-500">
              <Switch checked={p.autoSlug} onCheckedChange={p.setAutoSlug} className="data-[state=checked]:bg-indigo-600" />
              otomatik
            </label>
          </div>
          <Input
            value={p.slug}
            onChange={(e) => { p.setSlug(e.target.value); p.setAutoSlug(false); }}
            placeholder="emlak-slug"
          />
        </div>

        <div className="space-y-2">
          <Label>Tip<RequiredMark /></Label>
          <Input value={p.type} onChange={(e) => p.setType(e.target.value)} placeholder="örn: Daire" />
        </div>

        <div className="space-y-2">
          <Label>Durum<RequiredMark /></Label>
          <Input value={p.status} onChange={(e) => p.setStatus(e.target.value)} placeholder="örn: satilik / kiralik" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Adres<RequiredMark /></Label>
          <Input value={p.address} onChange={(e) => p.setAddress(e.target.value)} placeholder="Açık adres" />
        </div>

        <div className="space-y-2">
          <Label>Şehir<RequiredMark /></Label>
          <Input value={p.city} onChange={(e) => p.setCity(e.target.value)} placeholder="örn: İstanbul" />
        </div>

        <div className="space-y-2">
          <Label>İlçe<RequiredMark /></Label>
          <Input value={p.district} onChange={(e) => p.setDistrict(e.target.value)} placeholder="örn: Kadıköy" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Mahalle (ops.)</Label>
          <Input value={p.neighborhood} onChange={(e) => p.setNeighborhood(e.target.value)} placeholder="örn: Moda" />
        </div>
      </div>
    </Section>
  );
}
