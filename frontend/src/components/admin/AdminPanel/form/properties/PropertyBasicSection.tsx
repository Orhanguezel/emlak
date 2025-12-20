"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { RequiredMark } from "@/components/admin/AdminPanel/form/properties/RequiredMark";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PROPERTY_TYPES, PROPERTY_STATUSES } from "@/integrations/rtk/types/properties";

import {
  buildEnumOptionsTr,
  normalizeEnumValueTr,
  selectValueProps,
} from "@/components/admin/AdminPanel/form/properties/helpers";

type Props = {
  title: string; setTitle: (v: string) => void;
  slug: string; setSlug: (v: string) => void;
  autoSlug: boolean; setAutoSlug: (v: boolean) => void;

  type: string; setType: (v: string) => void;
  status: string; setStatus: (v: string) => void;

  typeOptions?: string[];
  statusOptions?: string[];

  address: string; setAddress: (v: string) => void;
  city: string; setCity: (v: string) => void;
  district: string; setDistrict: (v: string) => void;
  neighborhood: string; setNeighborhood: (v: string) => void;

  listedAt?: string | Date | null;
};

const parseDateSafe = (v: Props["listedAt"]): Date | null => {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isFinite(d.getTime()) ? d : null;
};

const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const daysSinceCalendar = (date: Date): number => {
  const a = startOfDay(date).getTime();
  const b = startOfDay(new Date()).getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.floor((b - a) / dayMs));
};

const formatDateTR = (d: Date): string => {
  try {
    return new Intl.DateTimeFormat("tr-TR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  } catch {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${dd}.${mm}.${yyyy}`;
  }
};

const formatPublishedTextTR = (days: number): string => {
  if (days <= 0) return "Bugün yayında";
  if (days === 1) return "1 gündür yayında";
  return `${days} gündür yayında`;
};

export function PropertyBasicSection(p: Props) {
  const listedDate = React.useMemo(() => parseDateSafe(p.listedAt), [p.listedAt]);
  const listedDays = React.useMemo(() => (listedDate ? daysSinceCalendar(listedDate) : null), [listedDate]);

  // ✅ value’ları normalize edip label’ları TR üret
  const typeOptions = React.useMemo(
    () => buildEnumOptionsTr(p.type, p.typeOptions, PROPERTY_TYPES),
    [p.type, p.typeOptions],
  );

  const statusOptions = React.useMemo(
    () => buildEnumOptionsTr(p.status, p.statusOptions, PROPERTY_STATUSES),
    [p.status, p.statusOptions],
  );

  // mevcut değeri de normalize ederek saklayalım
  const normalizedType = React.useMemo(() => normalizeEnumValueTr(p.type), [p.type]);
  const normalizedStatus = React.useMemo(() => normalizeEnumValueTr(p.status), [p.status]);

  return (
    <Section title="Temel Bilgiler">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <Label>
              Başlık<RequiredMark />
            </Label>

            {listedDate && listedDays != null ? (
              <div className="text-right text-xs text-gray-500">
                <div>
                  İlan tarihi: <span className="font-medium">{formatDateTR(listedDate)}</span>
                </div>
                <div>
                  <span className="font-medium">{formatPublishedTextTR(listedDays)}</span>
                </div>
              </div>
            ) : null}
          </div>

          <Input value={p.title} onChange={(e) => p.setTitle(e.target.value)} placeholder="Emlak başlığı" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label>
              Slug<RequiredMark />
            </Label>

            <label className="flex items-center gap-2 text-xs text-gray-500">
              <Switch
                checked={p.autoSlug}
                onCheckedChange={p.setAutoSlug}
                className="data-[state=checked]:bg-indigo-600"
              />
              otomatik
            </label>
          </div>

          <Input
            value={p.slug}
            onChange={(e) => {
              p.setSlug(e.target.value);
              p.setAutoSlug(false);
            }}
            placeholder="emlak-slug"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Tip<RequiredMark />
          </Label>

          <Select
            {...selectValueProps(normalizedType)}
            onValueChange={(v) => p.setType(normalizeEnumValueTr(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Durum<RequiredMark />
          </Label>

          <Select
            {...selectValueProps(normalizedStatus)}
            onValueChange={(v) => p.setStatus(normalizeEnumValueTr(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>
            Adres<RequiredMark />
          </Label>
          <Input value={p.address} onChange={(e) => p.setAddress(e.target.value)} placeholder="Açık adres" />
        </div>

        <div className="space-y-2">
          <Label>
            Şehir<RequiredMark />
          </Label>
          <Input value={p.city} onChange={(e) => p.setCity(e.target.value)} placeholder="örn: İstanbul" />
        </div>

        <div className="space-y-2">
          <Label>
            İlçe<RequiredMark />
          </Label>
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
