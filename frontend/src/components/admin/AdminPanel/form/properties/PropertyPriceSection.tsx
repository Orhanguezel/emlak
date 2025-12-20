"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { selectValueProps } from "@/components/admin/AdminPanel/form/properties/helpers";

type Props = {
  price: string; setPrice: (v: string) => void;
  currency: string; setCurrency: (v: string) => void;
  minPriceAdmin: string; setMinPriceAdmin: (v: string) => void;
};

// İstersen bunu types/properties.ts içine alıp tek kaynaktan da yönetebiliriz.
const CURRENCIES = ["TRY", "EUR", "USD", "GBP"] as const;

export function PropertyPriceSection(p: Props) {
  return (
    <Section title="Fiyat">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-2">
          <Label>Fiyat (ops.)</Label>
          <Input
            value={p.price}
            onChange={(e) => p.setPrice(e.target.value)}
            placeholder="örn: 8950000"
            inputMode="numeric"
          />
        </div>

        <div className="space-y-2">
          <Label>Para Birimi</Label>

          <Select
            {...selectValueProps(p.currency)}
            onValueChange={(v) => p.setCurrency(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>

            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* İstersen currency boşsa default atayabilirsin:
              React.useEffect(() => { if (!p.currency) p.setCurrency("TRY") }, [p.currency])
          */}
        </div>

        <div className="space-y-2 sm:col-span-3">
          <Label>Min Fiyat (Admin) (ops.)</Label>
          <Input
            value={p.minPriceAdmin}
            onChange={(e) => p.setMinPriceAdmin(e.target.value)}
            placeholder="örn: 8200000"
            inputMode="numeric"
          />
          <div className="text-xs text-gray-500">Bu alan sadece admin tarafında görünür.</div>
        </div>
      </div>
    </Section>
  );
}
