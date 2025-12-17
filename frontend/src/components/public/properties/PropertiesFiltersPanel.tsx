"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";

import type { Filters } from "./usePropertiesFilters";
import {
  normalizeStatusLabel,
  normalizeTypeLabel,
} from "./properties.selectors";

import type { Rooms, Heating, UsageStatus } from "@/integrations/rtk/types/properties";
import { ROOMS, HEATING, USAGE_STATUS } from "@/integrations/rtk/types/properties";

// ----------------------------- local helpers -----------------------------

function toggleMulti<T extends string>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function Chip(props: { active: boolean; label: string; onClick: () => void }) {
  const { active, label, onClick } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-gray-200 bg-white text-slate-900 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

// ----------------------------- component -----------------------------

export function PropertiesFiltersPanel(props: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean | ((p: boolean) => boolean)) => void;
  clearLocalFilters: () => void;
  options: {
    cities: string[];
    districts: string[];
    neighborhoods: string[];
    types: string[];
    statuses: string[];
  };
}) {
  const { filters, setFilters, showAdvanced, setShowAdvanced, clearLocalFilters, options } = props;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div className="text-lg font-semibold text-slate-900">Filtreler</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced((p) => !p)}
            className="border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Gelişmiş
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearLocalFilters}
            className="border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white"
          >
            Filtreleri Temizle
          </Button>
        </div>
      </div>

      {/* Basic row */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="md:col-span-2">
          <div className="relative">
            <Input
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
              placeholder="İlan ara (başlık, adres, ilçe...)"
              className="pr-10"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <select
          value={filters.city}
          onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
        >
          <option value="">Şehir</option>
          {options.cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.district}
          onChange={(e) => setFilters((p) => ({ ...p, district: e.target.value }))}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
        >
          <option value="">İlçe</option>
          {options.districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
        >
          <option value="">Tür</option>
          {options.types.map((t) => (
            <option key={t} value={t}>
              {normalizeTypeLabel(t)}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
        >
          <option value="">Durum</option>
          {options.statuses.map((s) => (
            <option key={s} value={s}>
              {normalizeStatusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced */}
      {showAdvanced && (
        <div className="mt-5 border-t border-gray-100 pt-5 space-y-4">
          {/* Row 1: neighborhood + price + m2 */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <select
              value={filters.neighborhood}
              onChange={(e) => setFilters((p) => ({ ...p, neighborhood: e.target.value }))}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800 md:col-span-2"
            >
              <option value="">Mahalle</option>
              {options.neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <Input
              value={filters.price_min}
              onChange={(e) => setFilters((p) => ({ ...p, price_min: e.target.value }))}
              placeholder="Min fiyat"
              className="md:col-span-1"
            />
            <Input
              value={filters.price_max}
              onChange={(e) => setFilters((p) => ({ ...p, price_max: e.target.value }))}
              placeholder="Max fiyat"
              className="md:col-span-1"
            />

            <Input
              value={filters.gross_m2_min}
              onChange={(e) => setFilters((p) => ({ ...p, gross_m2_min: e.target.value }))}
              placeholder="Min brüt m²"
              className="md:col-span-1"
            />
            <Input
              value={filters.gross_m2_max}
              onChange={(e) => setFilters((p) => ({ ...p, gross_m2_max: e.target.value }))}
              placeholder="Max brüt m²"
              className="md:col-span-1"
            />
          </div>

          {/* Row 2: rooms single + bedrooms + building age */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <select
              value={filters.rooms}
              onChange={(e) => setFilters((p) => ({ ...p, rooms: e.target.value as Rooms | "" }))}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800 md:col-span-2"
            >
              <option value="">Oda (tek seçim)</option>
              {ROOMS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <Input
              value={filters.bedrooms_min}
              onChange={(e) => setFilters((p) => ({ ...p, bedrooms_min: e.target.value }))}
              placeholder="Min yatak odası"
              className="md:col-span-1"
            />
            <Input
              value={filters.bedrooms_max}
              onChange={(e) => setFilters((p) => ({ ...p, bedrooms_max: e.target.value }))}
              placeholder="Max yatak odası"
              className="md:col-span-1"
            />

            <Input
              value={filters.building_age}
              onChange={(e) => setFilters((p) => ({ ...p, building_age: e.target.value }))}
              placeholder="Bina yaşı (örn: 0-5, 10+)"
              className="md:col-span-2"
            />
          </div>

          {/* Rooms multi chips */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-900">Oda (çoklu seçim)</div>
            <div className="flex flex-wrap gap-2">
              {ROOMS.map((r) => (
                <Chip
                  key={r}
                  label={r}
                  active={filters.rooms_multi.includes(r)}
                  onClick={() =>
                    setFilters((p) => ({ ...p, rooms_multi: toggleMulti(p.rooms_multi, r) }))
                  }
                />
              ))}
              {filters.rooms_multi.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, rooms_multi: [] }))}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
                >
                  temizle
                </button>
              )}
            </div>
          </div>

          {/* Row 3: heating single + usage single */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <select
              value={filters.heating}
              onChange={(e) => setFilters((p) => ({ ...p, heating: e.target.value as Heating | "" }))}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800 md:col-span-3"
            >
              <option value="">Isıtma (tek seçim)</option>
              {HEATING.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            <select
              value={filters.usage_status}
              onChange={(e) =>
                setFilters((p) => ({ ...p, usage_status: e.target.value as UsageStatus | "" }))
              }
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800 md:col-span-3"
            >
              <option value="">Kullanım (tek seçim)</option>
              {USAGE_STATUS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Heating/Usage multi chips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-900">Isıtma (çoklu seçim)</div>
              <div className="flex flex-wrap gap-2">
                {HEATING.map((h) => (
                  <Chip
                    key={h}
                    label={h}
                    active={filters.heating_multi.includes(h)}
                    onClick={() =>
                      setFilters((p) => ({ ...p, heating_multi: toggleMulti(p.heating_multi, h) }))
                    }
                  />
                ))}
                {filters.heating_multi.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, heating_multi: [] }))}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
                  >
                    temizle
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-900">Kullanım (çoklu seçim)</div>
              <div className="flex flex-wrap gap-2">
                {USAGE_STATUS.map((u) => (
                  <Chip
                    key={u}
                    label={u}
                    active={filters.usage_status_multi.includes(u)}
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        usage_status_multi: toggleMulti(p.usage_status_multi, u),
                      }))
                    }
                  />
                ))}
                {filters.usage_status_multi.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, usage_status_multi: [] }))}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
                  >
                    temizle
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Switch grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {([
              ["featured", "Öne Çıkan"],
              ["furnished", "Eşyalı"],
              ["in_site", "Site İçinde"],
              ["has_elevator", "Asansör"],
              ["has_parking", "Otopark"],
              ["has_balcony", "Balkon"],
              ["has_garden", "Bahçe"],
              ["has_terrace", "Teras"],
              ["credit_eligible", "Krediye Uygun"],
              ["swap", "Takas"],
              ["has_virtual_tour", "Sanal Tur"],
              ["accessible", "Erişilebilir"],
            ] as const).map(([k, label]) => (
              <div
                key={k}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <Label className="text-sm text-slate-900">{label}</Label>
                <Switch
                  checked={(filters as any)[k]}
                  onCheckedChange={(v) => setFilters((p) => ({ ...p, [k]: Boolean(v) } as any))}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
