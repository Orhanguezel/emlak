"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";

type Props = {
  isActive: boolean; setIsActive: (v: boolean) => void;
  displayOrder: number; setDisplayOrder: (v: number) => void;
};

export function PropertyPublishSection(p: Props) {
  return (
    <Section title="Yayın / Sıralama">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Aktif</Label>
          <div className="flex h-10 items-center">
            <Switch checked={p.isActive} onCheckedChange={p.setIsActive} className="data-[state=checked]:bg-emerald-600" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Display Order</Label>
          <Input
            type="number"
            value={String(p.displayOrder)}
            onChange={(e) => p.setDisplayOrder(Number(e.target.value || 0))}
            placeholder="0"
          />
        </div>
      </div>
    </Section>
  );
}
