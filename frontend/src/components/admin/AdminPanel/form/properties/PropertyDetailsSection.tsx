"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";

import type { Heating, Rooms } from "@/integrations/rtk/types/properties";

import {
  labelFromEnumValueTr,
  normalizeEnumValueTr,
  normalizeRoomsValueTr, // ✅
} from "@/components/admin/AdminPanel/form/properties/helpers";

type Props = {
  grossM2: string; setGrossM2: (v: string) => void;
  netM2: string; setNetM2: (v: string) => void;

  rooms: Rooms | ""; setRooms: (v: Rooms | "") => void;
  roomsOptions: readonly Rooms[];

  buildingAge: string; setBuildingAge: (v: string) => void;
  floor: string; setFloor: (v: string) => void;
  totalFloors: string; setTotalFloors: (v: string) => void;

  heating: Heating | ""; setHeating: (v: Heating | "") => void;
  heatingOptions: readonly Heating[];

  furnished: boolean; setFurnished: (v: boolean) => void;
  inSite: boolean; setInSite: (v: boolean) => void;
  hasBalcony: boolean; setHasBalcony: (v: boolean) => void;
  hasParking: boolean; setHasParking: (v: boolean) => void;
  hasElevator: boolean; setHasElevator: (v: boolean) => void;
};

export function PropertyDetailsSection(p: Props) {
  // ✅ rooms: backend enum "N+M" olduğu için özel normalize
  const roomsValue = React.useMemo(() => normalizeRoomsValueTr(p.rooms), [p.rooms]);

  // heating için genel normalize OK
  const heatingValue = React.useMemo(() => normalizeEnumValueTr(p.heating), [p.heating]);

  return (
    <Section title="Detaylar">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Brüt m² (ops.)</Label>
          <Input
            value={p.grossM2}
            onChange={(e) => p.setGrossM2(e.target.value)}
            placeholder="örn: 110"
            inputMode="numeric"
          />
        </div>

        <div className="space-y-2">
          <Label>Net m² (ops.)</Label>
          <Input
            value={p.netM2}
            onChange={(e) => p.setNetM2(e.target.value)}
            placeholder="örn: 92"
            inputMode="numeric"
          />
        </div>

        <div className="space-y-2">
          <Label>Oda (ops.)</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={roomsValue}
            onChange={(e) => {
              const v = normalizeRoomsValueTr(e.target.value);
              p.setRooms((v || "") as Rooms | "");
            }}
          >
            <option value="">Seçiniz</option>

            {/* ✅ value backend enum ile birebir: "2+0" */}
            {p.roomsOptions.map((x) => (
              <option key={x} value={x}>
                {x /* UI’da 2+0 zaten doğru görünür */}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Bina Yaşı (ops.)</Label>
          <Input
            value={p.buildingAge}
            onChange={(e) => p.setBuildingAge(e.target.value)}
            placeholder='örn: "5-10"'
          />
        </div>

        <div className="space-y-2">
          <Label>Kat (ops.)</Label>
          <Input
            value={p.floor}
            onChange={(e) => p.setFloor(e.target.value)}
            placeholder='örn: "3" / "Zemin"'
          />
        </div>

        <div className="space-y-2">
          <Label>Toplam Kat (ops.)</Label>
          <Input
            value={p.totalFloors}
            onChange={(e) => p.setTotalFloors(e.target.value)}
            placeholder="örn: 6"
            inputMode="numeric"
          />
        </div>

        <div className="space-y-2 sm:col-span-3">
          <Label>Isınma (ops.)</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={heatingValue}
            onChange={(e) =>
              p.setHeating((normalizeEnumValueTr(e.target.value) || "") as Heating | "")
            }
          >
            <option value="">Seçiniz</option>
            {p.heatingOptions.map((x) => {
              const v = normalizeEnumValueTr(x); // burada sorun yok
              return (
                <option key={v} value={v}>
                  {labelFromEnumValueTr(v)}
                </option>
              );
            })}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:col-span-3">
          {(
            [
              ["Eşyalı", p.furnished, p.setFurnished],
              ["Site İçinde", p.inSite, p.setInSite],
              ["Balkon", p.hasBalcony, p.setHasBalcony],
              ["Otopark", p.hasParking, p.setHasParking],
              ["Asansör", p.hasElevator, p.setHasElevator],
            ] as const
          ).map(([label, val, setVal]) => (
            <div key={label} className="space-y-2">
              <Label>{label}</Label>
              <div className="flex h-10 items-center">
                <Switch
                  checked={val}
                  onCheckedChange={setVal}
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
