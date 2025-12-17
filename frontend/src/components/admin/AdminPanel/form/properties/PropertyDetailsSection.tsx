"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";

type Props = {
  grossM2: string; setGrossM2: (v: string) => void;
  netM2: string; setNetM2: (v: string) => void;
  rooms: string; setRooms: (v: string) => void;

  buildingAge: string; setBuildingAge: (v: string) => void;
  floor: string; setFloor: (v: string) => void;
  totalFloors: string; setTotalFloors: (v: string) => void;

  heating: string; setHeating: (v: string) => void;

  furnished: boolean; setFurnished: (v: boolean) => void;
  inSite: boolean; setInSite: (v: boolean) => void;
  hasBalcony: boolean; setHasBalcony: (v: boolean) => void;
  hasParking: boolean; setHasParking: (v: boolean) => void;
  hasElevator: boolean; setHasElevator: (v: boolean) => void;
};

export function PropertyDetailsSection(p: Props) {
  return (
    <Section title="Detaylar">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Brüt m² (ops.)</Label>
          <Input value={p.grossM2} onChange={(e) => p.setGrossM2(e.target.value)} placeholder="örn: 110" />
        </div>
        <div className="space-y-2">
          <Label>Net m² (ops.)</Label>
          <Input value={p.netM2} onChange={(e) => p.setNetM2(e.target.value)} placeholder="örn: 92" />
        </div>
        <div className="space-y-2">
          <Label>Oda (ops.)</Label>
          <Input value={p.rooms} onChange={(e) => p.setRooms(e.target.value)} placeholder='örn: "2+1"' />
        </div>

        <div className="space-y-2">
          <Label>Bina Yaşı (ops.)</Label>
          <Input value={p.buildingAge} onChange={(e) => p.setBuildingAge(e.target.value)} placeholder='örn: "5-10"' />
        </div>
        <div className="space-y-2">
          <Label>Kat (ops.)</Label>
          <Input value={p.floor} onChange={(e) => p.setFloor(e.target.value)} placeholder='örn: "3" / "Zemin"' />
        </div>
        <div className="space-y-2">
          <Label>Toplam Kat (ops.)</Label>
          <Input value={p.totalFloors} onChange={(e) => p.setTotalFloors(e.target.value)} placeholder="örn: 6" />
        </div>

        <div className="space-y-2 sm:col-span-3">
          <Label>Isınma (ops.)</Label>
          <Input value={p.heating} onChange={(e) => p.setHeating(e.target.value)} placeholder="örn: Kombi" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:col-span-3">
          {[
            ["Eşyalı", p.furnished, p.setFurnished],
            ["Site İçinde", p.inSite, p.setInSite],
            ["Balkon", p.hasBalcony, p.setHasBalcony],
            ["Otopark", p.hasParking, p.setHasParking],
            ["Asansör", p.hasElevator, p.setHasElevator],
          ].map(([label, val, setVal], i) => (
            <div key={String(label)} className="space-y-2">
              <Label>{String(label)}</Label>
              <div className="flex h-10 items-center">
                <Switch
                  checked={Boolean(val)}
                  onCheckedChange={setVal as any}
                  className="data-[state=checked]:bg-emerald-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
