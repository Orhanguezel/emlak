"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";

type Props = {
  lat: string; setLat: (v: string) => void;
  lng: string; setLng: (v: string) => void;
};

export function PropertyMapSection(p: Props) {
  return (
    <Section title="Harita">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Latitude</Label>
          <Input value={p.lat} onChange={(e) => p.setLat(e.target.value)} placeholder="40.987200" />
        </div>
        <div className="space-y-2">
          <Label>Longitude</Label>
          <Input value={p.lng} onChange={(e) => p.setLng(e.target.value)} placeholder="29.026600" />
        </div>
        <div className="sm:col-span-2 text-xs text-gray-500">
          Not: Backend dec6 bekliyor. 0/0 göndermemek için doldurmanı öneririm.
        </div>
      </div>
    </Section>
  );
}
