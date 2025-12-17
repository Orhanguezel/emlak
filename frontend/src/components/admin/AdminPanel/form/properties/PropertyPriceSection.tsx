"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";

type Props = {
  price: string; setPrice: (v: string) => void;
  currency: string; setCurrency: (v: string) => void;
  minPriceAdmin: string; setMinPriceAdmin: (v: string) => void;
};

export function PropertyPriceSection(p: Props) {
  return (
    <Section title="Fiyat">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-2">
          <Label>Fiyat (ops.)</Label>
          <Input value={p.price} onChange={(e) => p.setPrice(e.target.value)} placeholder="örn: 8950000" />
        </div>
        <div className="space-y-2">
          <Label>Para Birimi</Label>
          <Input value={p.currency} onChange={(e) => p.setCurrency(e.target.value)} placeholder="TRY" />
        </div>

        <div className="space-y-2 sm:col-span-3">
          <Label>Min Fiyat (Admin) (ops.)</Label>
          <Input value={p.minPriceAdmin} onChange={(e) => p.setMinPriceAdmin(e.target.value)} placeholder="örn: 8200000" />
          <div className="text-xs text-gray-500">Bu alan sadece admin tarafında görünür.</div>
        </div>
      </div>
    </Section>
  );
}
