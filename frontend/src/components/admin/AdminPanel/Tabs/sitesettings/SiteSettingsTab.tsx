// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SiteSettingsTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useListSiteSettingsAdminQuery,
  useCreateSiteSettingAdminMutation,
  useUpdateSiteSettingAdminMutation,
  useDeleteSiteSettingAdminMutation,
  type SiteSetting,
} from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

// Alt sekme componentleri
import { SiteSettingsGeneralTab } from "./SiteSettingsGeneralTab";
import { SiteSettingsContactTab } from "./SiteSettingsContactTab";
import { SiteSettingsSmtpTab } from "./SiteSettingsSmtpTab";
import { SiteSettingsFreeInspectionTab } from "./SiteSettingsFreeInspectionTab";
import { SiteSettingsStorageTab } from "./SiteSettingsStorageTab";
import { SiteSettingsFooterMenuTab } from "./SiteSettingsFooterMenuTab";
import { SiteSettingsSeoGlobalTab } from "./SiteSettingsSeoGlobalTab";
import { SiteSettingsSeoPagesTab } from "./SiteSettingsSeoPagesTab";
import { SiteSettingsJsonLdTab } from "./SiteSettingsJsonLdTab";

type PrefixTab = "all" | "seo_" | "contact_" | "home_";

const PREFIX_LABEL: Record<PrefixTab, string> = {
  all: "Tümü",
  seo_: "SEO",
  contact_: "İletişim",
  home_: "Ana Sayfa",
};

type SettingsTab =
  | "general"
  | "contact"
  | "smtp"
  | "free_inspection"
  | "storage"
  | "footer_menu"
  | "seo_global"
  | "seo_pages"
  | "jsonld"
  | "advanced";

export type SettingsFormApi = {
  getValue: (key: string) => string;
  setValue: (key: string, value: string) => void;
};

export function tryParseValue(s: string): any {
  const t = s.trim();
  if (!t.length) return "";
  // json?
  if (
    (t.startsWith("{") && t.endsWith("}")) ||
    (t.startsWith("[") && t.endsWith("]"))
  ) {
    try {
      return JSON.parse(t);
    } catch {
      /* fallthrough */
    }
  }
  if (t === "true") return true;
  if (t === "false") return false;
  const num = Number(t);
  if (!Number.isNaN(num) && t !== "") return num;
  return t;
}

export function toDisplay(v: unknown): string {
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

// Aktif tab için ortak class
const TAB_TRIGGER_CLASS =
  "text-xs sm:text-sm rounded-md border border-transparent " +
  "data-[state=active]:!bg-emerald-600 data-[state=active]:!text-white " +
  "data-[state=active]:!border-emerald-600 data-[state=active]:shadow-sm";

export default function TabsSiteSettings() {
  // Üst seviye sekmeler
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("general");

  // Gelişmiş tab için filtreler
  const [prefixTab, setPrefixTab] = React.useState<PrefixTab>("all");
  const [search, setSearch] = React.useState("");

  // 🔧 TS tipi: sort "key" literal olmalı
  const params = React.useMemo(
    () => ({
      sort: "key" as const,
      order: "asc" as const,
    }),
    [],
  );

  const { data = [], isFetching, refetch } =
    useListSiteSettingsAdminQuery(params);

  const [createSetting, { isLoading: creating }] =
    useCreateSiteSettingAdminMutation();
  const [updateSetting, { isLoading: updating }] =
    useUpdateSiteSettingAdminMutation();
  const [deleteSetting, { isLoading: deleting }] =
    useDeleteSiteSettingAdminMutation();

  const [savingAll, setSavingAll] = React.useState(false);
  const [justSaved, setJustSaved] = React.useState(false);

  // Form state: her key için string değer
  const [formValues, setFormValues] = React.useState<Record<string, string>>(
    {},
  );

  // data değiştikçe yeni key'leri form state'e merge et
  React.useEffect(() => {
    if (!data.length) return;
    setFormValues((prev) => {
      const next: Record<string, string> = { ...prev };
      for (const s of data) {
        if (!(s.key in next)) {
          next[s.key] = toDisplay(s.value);
        }
      }
      return next;
    });
  }, [data]);

  const getValue = React.useCallback(
    (key: string) => formValues[key] ?? "",
    [formValues],
  );

  const setValue = React.useCallback(
    (key: string, value: string) => {
      setFormValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const handleSaveAll = async () => {
    if (!data.length) {
      toast.error("Kaydedilecek ayar bulunamadı.");
      return;
    }

    try {
      setSavingAll(true);
      setJustSaved(false);

      const byKey = new Map<string, SiteSetting>();
      for (const s of data) {
        byKey.set(s.key, s);
      }

      const ops: Promise<unknown>[] = [];

      for (const [key, displayVal] of Object.entries(formValues)) {
        const existing = byKey.get(key);
        const parsed = tryParseValue(displayVal);

        if (!existing) {
          // yeni key (oluştur)
          ops.push(createSetting({ key, value: parsed }).unwrap());
        } else {
          // değişmemişse atla
          const original = toDisplay(existing.value);
          if (original === displayVal) continue;
          ops.push(updateSetting({ key, value: parsed }).unwrap());
        }
      }

      if (!ops.length) {
        toast.info("Değişiklik bulunmuyor.");
        return;
      }

      await Promise.all(ops);
      toast.success("Ayarlar kaydedildi.");
      refetch();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    } catch (e) {
      console.error(e);
      toast.error("Ayarlar kaydedilirken bir hata oluştu.");
    } finally {
      setSavingAll(false);
    }
  };

  // Gelişmiş tab için client-side filtrelenmiş liste
  const filteredAdvancedData = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((r) => {
      if (prefixTab !== "all" && !r.key.startsWith(prefixTab)) return false;
      if (!q) return true;
      const valStr = toDisplay(r.value).toLowerCase();
      return (
        r.key.toLowerCase().includes(q) || valStr.includes(q)
      );
    });
  }, [data, prefixTab, search]);

  // === Gelişmiş mod (eski tablo + modal) için state ===
  const [openNew, setOpenNew] = React.useState(false);
  const [newKey, setNewKey] = React.useState("");
  const [newValue, setNewValue] = React.useState("");
  const [editing, setEditing] = React.useState<SiteSetting | null>(null);
  const [editValue, setEditValue] = React.useState("");

  const onCreate = async () => {
    const key = newKey.trim();
    if (!key) {
      toast.error("Key zorunludur");
      return;
    }
    try {
      const value = tryParseValue(newValue);
      await createSetting({ key, value }).unwrap();
      toast.success("Ayar oluşturuldu");
      setOpenNew(false);
      setNewKey("");
      setNewValue("");
      refetch();
      // Form state'e de yansıt
      setValue(key, toDisplay(value));
    } catch (e) {
      toast.error("Ayar oluşturulamadı");
    }
  };

  const onSaveSingle = async () => {
    if (!editing) return;
    try {
      const value = tryParseValue(editValue);
      await updateSetting({ key: editing.key, value }).unwrap();
      toast.success("Ayar güncellendi");
      setEditing(null);
      refetch();
      setValue(editing.key, toDisplay(value));
    } catch {
      toast.error("Güncelleme başarısız");
    }
  };

  const onDelete = async (key: string) => {
    if (!confirm(`${key} silinsin mi?`)) return;
    try {
      await deleteSetting(key).unwrap();
      toast.success("Silindi");
      refetch();
      setFormValues((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch {
      toast.error("Silme işlemi başarısız");
    }
  };

  // advanced tab içinde kullanacağımız küçük helper
  const renderAdvancedTable = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-3 py-2 text-left">Key</th>
            <th className="px-3 py-2 text-left">Value</th>
            <th className="px-3 py-2 text-left">Güncel</th>
            <th className="px-3 py-2 text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvancedData.map((r) => (
            <tr key={r.key} className="border-t align-top">
              <td className="px-3 py-2 font-mono text-xs">{r.key}</td>
              <td className="px-3 py-2">
                <pre className="max-w-[640px] whitespace-pre-wrap break-words text-[12px] leading-5">
                  {toDisplay(r.value)}
                </pre>
              </td>
              <td className="px-3 py-2 text-xs text-gray-500">
                {r.updated_at
                  ? new Date(r.updated_at).toLocaleString()
                  : "-"}
              </td>
              <td className="px-3 py-2">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(r);
                      setEditValue(toDisplay(r.value));
                    }}
                  >
                    Düzenle
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(r.key)}
                  >
                    Sil
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {!isFetching && filteredAdvancedData.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-3 py-8 text-center text-gray-500"
              >
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const formApi: SettingsFormApi = { getValue, setValue };

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as SettingsTab)}
        className="w-full"
      >
        {/* Üst bar: Tabs + Kaydet/Yenile */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <TabsList className="flex-wrap">
  <TabsTrigger value="general" className={TAB_TRIGGER_CLASS}>
    Genel / Marka
  </TabsTrigger>
  <TabsTrigger value="contact" className={TAB_TRIGGER_CLASS}>
    İletişim
  </TabsTrigger>
  <TabsTrigger value="smtp" className={TAB_TRIGGER_CLASS}>
    SMTP / Mail
  </TabsTrigger>
  <TabsTrigger
    value="free_inspection"
    className={TAB_TRIGGER_CLASS}
  >
    Ücretsiz Keşif
  </TabsTrigger>
  <TabsTrigger value="storage" className={TAB_TRIGGER_CLASS}>
    Depolama & Upload
  </TabsTrigger>
  <TabsTrigger
    value="footer_menu"
    className={TAB_TRIGGER_CLASS}
  >
    Footer & Menü
  </TabsTrigger>
  <TabsTrigger
    value="seo_global"
    className={TAB_TRIGGER_CLASS}
  >
    SEO Genel
  </TabsTrigger>
  <TabsTrigger
    value="seo_pages"
    className={TAB_TRIGGER_CLASS}
  >
    SEO Sayfalar
  </TabsTrigger>
  <TabsTrigger value="jsonld" className={TAB_TRIGGER_CLASS}>
    JSON-LD
  </TabsTrigger>
  <TabsTrigger
    value="advanced"
    className={TAB_TRIGGER_CLASS}
  >
    Gelişmiş
  </TabsTrigger>
</TabsList>


          <div className="flex items-center gap-3">
            {justSaved && (
              <span className="text-xs text-emerald-600 flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Kaydedildi
              </span>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isFetching || savingAll}
              >
                Yenile
              </Button>
              <Button
                onClick={handleSaveAll}
                disabled={savingAll || isFetching}
                className={`px-4 sm:px-6 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 ${
                  savingAll || isFetching ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {savingAll ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
              </Button>
            </div>
          </div>
        </div>

        {/* ============ ALT SEKME COMPONENTLERİ ============ */}
        <TabsContent value="general">
          <SiteSettingsGeneralTab form={formApi} />
        </TabsContent>

        <TabsContent value="contact">
          <SiteSettingsContactTab form={formApi} />
        </TabsContent>

        <TabsContent value="smtp">
          <SiteSettingsSmtpTab form={formApi} />
        </TabsContent>

        <TabsContent value="free_inspection">
          <SiteSettingsFreeInspectionTab form={formApi} />
        </TabsContent>

        <TabsContent value="storage">
          <SiteSettingsStorageTab form={formApi} />
        </TabsContent>

        <TabsContent value="footer_menu">
          <SiteSettingsFooterMenuTab form={formApi} />
        </TabsContent>

        <TabsContent value="seo_global">
          <SiteSettingsSeoGlobalTab form={formApi} />
        </TabsContent>

        <TabsContent value="seo_pages">
          <SiteSettingsSeoPagesTab form={formApi} />
        </TabsContent>

        <TabsContent value="jsonld">
          <SiteSettingsJsonLdTab form={formApi} />
        </TabsContent>

        {/* ============ GELİŞMİŞ (Eski JSON tablo görünümü) ============ */}
        <TabsContent value="advanced" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
            <div className="flex gap-2">
              {(["all", "seo_", "contact_", "home_"] as PrefixTab[]).map(
                (t) => (
                  <Button
                    key={t}
                    variant={t === prefixTab ? "default" : "outline"}
                    onClick={() => setPrefixTab(t)}
                    className={t === prefixTab ? "" : "bg-white"}
                    size="sm"
                  >
                    {PREFIX_LABEL[t]}
                    {t !== "all" && (
                      <Badge variant="outline" className="ml-2">
                        {t}
                      </Badge>
                    )}
                  </Button>
                ),
              )}
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Ara
              </label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="key veya değer içinde ara"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                Yenile
              </Button>
              <Button onClick={() => setOpenNew(true)}>+ Yeni Ayar</Button>
            </div>
          </div>

          {renderAdvancedTable()}
        </TabsContent>
      </Tabs>

      {/* Create Modal (Gelişmiş tab) */}
      {openNew && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Yeni Ayar</h3>
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setOpenNew(false)}
              >
                Kapat
              </button>
            </div>
            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Key
                </label>
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="örn: seo_pages_home"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Value (string/number/boolean/json)
                </label>
                <Textarea
                  rows={6}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={`"Merhaba"\n123\ntrue\n{"a":1}\n["a","b"]`}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpenNew(false)}
              >
                İptal
              </Button>
              <Button onClick={onCreate} disabled={creating}>
                Oluştur
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (Gelişmiş tab) */}
      {editing && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Ayar Düzenle</h3>
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setEditing(null)}
              >
                Kapat
              </button>
            </div>
            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Key
                </label>
                <Input value={editing.key} disabled />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Value
                </label>
                <Textarea
                  rows={8}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditing(null)}
              >
                İptal
              </Button>
              <Button onClick={onSaveSingle} disabled={updating}>
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
