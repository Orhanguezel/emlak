// =============================================================
// FILE: src/components/admin/AdminPanel/form/ServiceFormPage.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Save, ArrowLeft, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useGetServiceAdminByIdQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,
  useSetServiceStatusAdminMutation,
  // ❌ BURADA useAttachServiceImageMutation / useDetachServiceImageMutation OLMAYACAK
} from "@/integrations/rtk/endpoints/admin/services_admin.endpoints";

// ✅ Sadece bu storage hook kalsın
import { useUploadToBucketMutation } from "@/integrations/rtk/endpoints/storage_public.endpoints";

import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { CoverImageSection } from "@/components/admin/AdminPanel/form/sections/CoverImageSection";

import type { ServiceType } from "@/integrations/rtk/types/services.types";


const slugifyTr = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .substring(0, 120);

const RequiredMark = () => (
  <span className="ml-0.5 text-red-500" aria-hidden="true">
    *
  </span>
);

export default function ServiceFormPage() {
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const { data: existing, isFetching } = useGetServiceAdminByIdQuery(
    String(id ?? ""),
    { skip: isNew },
  );

  // form state
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [autoSlug, setAutoSlug] = React.useState(true);

  const [type, setType] = React.useState<ServiceType>("other");
  const [category, setCategory] = React.useState("general");

  const [material, setMaterial] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [featured, setFeatured] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);
  const [displayOrder, setDisplayOrder] = React.useState<number>(1);

  // gardening
  const [area, setArea] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [maintenance, setMaintenance] = React.useState("");
  const [season, setSeason] = React.useState("");

  // soil
  const [soilType, setSoilType] = React.useState("");
  const [thickness, setThickness] = React.useState("");
  const [equipment, setEquipment] = React.useState("");

  // common
  const [warranty, setWarranty] = React.useState("");
  const [includes, setIncludes] = React.useState("");

  // image state (tek kapak pattern)
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [alt, setAlt] = React.useState<string>("");

  // Supabase upload
  const [uploadToBucket, { isLoading: uploading }] =
    useUploadToBucketMutation();

  // mutations
  const [createOne, { isLoading: creating }] =
    useCreateServiceAdminMutation();
  const [updateOne, { isLoading: updating }] =
    useUpdateServiceAdminMutation();
  const [setStatus] = useSetServiceStatusAdminMutation();

  const saving = creating || updating;
  const savingImg = uploading;

  // hydrate
  React.useEffect(() => {
    if (!isNew && existing) {
      setName(existing.name ?? "");
      setSlug(existing.slug ?? "");
      setType((existing.type as ServiceType) || "other");
      setCategory(existing.category ?? "general");

      setMaterial(existing.material ?? "");
      setPrice(existing.price ?? "");
      setDescription(existing.description ?? "");

      setFeatured(!!existing.featured);
      setIsActive(!!existing.is_active);
      setDisplayOrder(Number(existing.display_order ?? 1));

      setArea(existing.area ?? "");
      setDuration(existing.duration ?? "");
      setMaintenance(existing.maintenance ?? "");
      setSeason(existing.season ?? "");

      setSoilType(existing.soil_type ?? "");
      setThickness(existing.thickness ?? "");
      setEquipment(existing.equipment ?? "");

      setWarranty(existing.warranty ?? "");
      setIncludes(existing.includes ?? "");

      setImageUrl(
        existing.image_effective_url ?? existing.image_url ?? "",
      );
      setAlt(existing.alt ?? "");
    }
  }, [existing, isNew]);

  React.useEffect(() => {
    if (autoSlug) setSlug(slugifyTr(name));
  }, [name, autoSlug]);

  const onBack = () =>
    window.history.length
      ? window.history.back()
      : navigate("/admin/services");

  /* ------------ payload builders ------------ */
  const buildCreateBody = () => ({
    name,
    slug,
    type,
    category,
    material: material || null,
    price: price || null,
    description: description || null,

    image_url: imageUrl || null,
    image_asset_id: null,
    alt: alt || null,

    featured,
    is_active: isActive,
    display_order: Number(displayOrder) || 1,

    // gardening
    area: area || null,
    duration: duration || null,
    maintenance: maintenance || null,
    season: season || null,

    // soil
    soil_type: soilType || null,
    thickness: thickness || null,
    equipment: equipment || null,

    // common
    warranty: warranty || null,
    includes: includes || null,
  });

  const buildUpdateBody = () => ({
    name,
    slug,
    type,
    category,
    material: material || null,
    price: price || null,
    description: description || null,

    image_url: imageUrl || null,
    image_asset_id: null,
    alt: alt || null,

    featured,
    is_active: isActive,
    display_order: Number(displayOrder) || 1,

    area: area || null,
    duration: duration || null,
    maintenance: maintenance || null,
    season: season || null,

    soil_type: soilType || null,
    thickness: thickness || null,
    equipment: equipment || null,

    warranty: warranty || null,
    includes: includes || null,
  });

  /* ------------ actions ------------ */
  const doCreate = async () => {
    if (!name) return toast.error("Ad zorunlu");

    try {
      const created = await createOne(buildCreateBody()).unwrap();
      const newId = String(created.id);

      toast.success(
        "Servis oluşturuldu. Şimdi kapak görselini ekleyebilirsiniz.",
      );
      navigate(`/admin/services/${newId}`);
    } catch (e: any) {
      const msg = e?.data?.error?.message || e?.data?.message;
      toast.error(msg || "Oluşturma başarısız");
    }
  };

  const doUpdate = async () => {
    if (isNew || !id) return;
    if (!name) return toast.error("Ad zorunlu");

    try {
      await updateOne({
        id: String(id),
        body: buildUpdateBody(),
      }).unwrap();

      toast.success("Servis güncellendi");
      navigate("/admin/services");
    } catch (e: any) {
      const msg = e?.data?.error?.message || e?.data?.message;
      toast.error(msg || "Güncelleme başarısız");
    }
  };

  const uploadCover = async (file: File) => {
    if (isNew || !id) {
      toast.error("Önce servisi kaydedin, sonra kapak ekleyin.");
      return;
    }

    try {
      const res = await uploadToBucket({
        bucket: "services",
        files: file,
        path: `services/${id}/cover/${file.name}`,
        upsert: true,
      }).unwrap();

      const item = (res as any)?.items?.[0];
      if (!item || !item.url) {
        toast.error("Yükleme cevabı beklenen formatta değil");
        return;
      }

      const publicUrl: string = item.url;

      setImageUrl(publicUrl);

      if (!alt) {
        const base = file.name.replace(/\.[^.]+$/, "");
        setAlt(name || base);
      }

      // image_url + alt’ı direkt servise yaz
      await updateOne({
        id: String(id),
        body: {
          image_url: publicUrl,
          alt: alt || name || null,
        },
      }).unwrap();

      toast.success("Kapak resmi güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Kapak yüklenemedi");
    }
  };

  const saveAltOnly = async () => {
    if (isNew || !id) return;

    try {
      await updateOne({
        id: String(id),
        body: { alt: alt || name || null },
      }).unwrap();
      toast.success("Alt metin güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Alt metin güncellenemedi");
    }
  };

  const removeCover = async () => {
    if (isNew) {
      setImageUrl("");
      setAlt("");
      toast.info("Görsel yerelden kaldırıldı (kayıt yok).");
      return;
    }
    if (!id) return;

    try {
      await updateOne({
        id: String(id),
        body: { image_url: null, alt: null },
      }).unwrap();

      setImageUrl("");
      setAlt("");
      toast.success("Görsel kaldırıldı");
    } catch (e: any) {
      toast.error(e?.data?.message || "Görsel kaldırılamadı");
    }
  };

  const onUrlChange = (v: string) => {
    setImageUrl(v);
  };

  if (!isNew && isFetching) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Yükleniyor…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => onBack()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Button>
        {isNew ? (
          <Button
            onClick={doCreate}
            disabled={saving}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4" />
            Oluştur
          </Button>
        ) : (
          <Button
            onClick={doUpdate}
            disabled={saving}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4" />
            Kaydet
          </Button>
        )}
      </div>

      <Section title="Temel Bilgiler">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Ad
              <RequiredMark />
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Servis adı"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label>Slug</Label>
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <Switch
                  checked={autoSlug}
                  onCheckedChange={setAutoSlug}
                  className="data-[state=checked]:bg-indigo-600"
                />
                otomatik
              </label>
            </div>
            <Input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
              }}
              placeholder="servis-slug"
            />
          </div>

          <div className="space-y-2">
            <Label>Tür</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as ServiceType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tür" />
              </SelectTrigger>
              <SelectContent className=" bg-amber-50 " >
                <SelectItem value="gardening">Gardening</SelectItem>
                <SelectItem value="soil">Soil</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Malzeme (ops.)</Label>
            <Input
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Fiyat (ops.)</Label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="örn: 5.000 ₺"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label>Açıklama (ops.)</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Aktif</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={isActive}
                onCheckedChange={(v) => {
                  setIsActive(v);
                  if (!isNew && id) {
                    setStatus({
                      id: String(id),
                      body: { is_active: v },
                    }).catch(() => {
                      toast.error(
                        "Aktiflik durumu güncellenemedi",
                      );
                      setIsActive(!v);
                    });
                  }
                }}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Öne Çıkan</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={featured}
                onCheckedChange={async (v) => {
                  setFeatured(v);
                  if (!isNew && id) {
                    try {
                      await updateOne({
                        id: String(id),
                        body: { featured: v },
                      }).unwrap();
                    } catch {
                      toast.error("Öne çıkarma güncellenemedi");
                      setFeatured(!v);
                    }
                  }
                }}
                className="data-[state=checked]:bg-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sıra</Label>
            <Input
              inputMode="numeric"
              value={String(displayOrder)}
              onChange={(e) =>
                setDisplayOrder(Number(e.target.value) || 1)
              }
            />
          </div>
        </div>
      </Section>

      {/* Type-specific fields */}
      {type === "gardening" && (
        <Section title="Gardening Bilgileri">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Alan</Label>
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Süre</Label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Bakım</Label>
              <Input
                value={maintenance}
                onChange={(e) => setMaintenance(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sezon</Label>
              <Input
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              />
            </div>
          </div>
        </Section>
      )}

      {type === "soil" && (
        <Section title="Soil Bilgileri">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Toprak Türü</Label>
              <Input
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Kalınlık</Label>
              <Input
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ekipman</Label>
              <Input
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
              />
            </div>
          </div>
        </Section>
      )}

      <Section title="Genel Bilgiler (ops.)">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Garanti</Label>
            <Input
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Dahil Olanlar</Label>
            <Input
              value={includes}
              onChange={(e) => setIncludes(e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* Kapak görseli: sadece EDIT modunda */}
      {!isNew ? (
        <CoverImageSection
          title="Kapak Görseli"
          coverId={undefined}
          stagedCoverId={undefined}
          imageUrl={imageUrl}
          alt={alt}
          saving={savingImg}
          onPickFile={uploadCover}
          onRemove={removeCover}
          onUrlChange={onUrlChange}
          onAltChange={setAlt}
          onSaveAlt={!isNew && !!id ? saveAltOnly : undefined}
          accept="image/*"
        />
      ) : (
        <Section title="Kapak Görseli">
          <div className="flex items-start gap-3 rounded-md border p-3 bg-amber-50 text-amber-800">
            <Info className="mt-0.5 h-4 w-4" />
            <div className="text-sm">
              Önce <b>Temel Bilgileri</b> kaydedin. Kayıt oluşturulduktan
              sonra kapak görselini ekleyebilirsiniz.
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
