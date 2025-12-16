// =============================================================
// FILE: src/components/admin/AdminPanel/form/AccessoryFormPage.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, ArrowLeft, Info } from "lucide-react";

import {
  useAdminGetAccessoryQuery,
  useAdminCreateAccessoryMutation,
  useAdminUpdateAccessoryMutation,
} from "@/integrations/rtk/endpoints/admin/accessories_admin.endpoints";

// 🔸 Campaign / Category / SubCategory ile aynı: public storage pattern
import { useUploadToBucketMutation } from "@/integrations/rtk/endpoints/storage_public.endpoints";

import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { CoverImageSection } from "@/components/admin/AdminPanel/form/sections/CoverImageSection";
import type {
  AccessoryCreateInput,
  AccessoryUpdateInput,
  AccessoryKey as AccKey,
} from "@/integrations/rtk/types/accessories";

const RequiredMark = () => (
  <span className="ml-0.5 text-red-500" aria-hidden="true">
    *
  </span>
);

export default function AccessoryFormPage() {
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const { data: existing, isFetching: loadingExisting } =
    useAdminGetAccessoryQuery(String(id ?? ""), {
      skip: isNew,
    });

  // ---------- form state ----------
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState(""); // read-only (BE name'den üretiyor)
  const [category, setCategory] = React.useState<AccKey>("aksesuar");
  const [material, setMaterial] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [featured, setFeatured] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);
  const [displayOrder, setDisplayOrder] = React.useState<number>(0);

  // optional attrs
  const [dimensions, setDimensions] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [thickness, setThickness] = React.useState("");
  const [finish, setFinish] = React.useState("");
  const [warranty, setWarranty] = React.useState("");
  const [installationTime, setInstallationTime] = React.useState("");

  // ---------- image state ----------
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [alt, _setAlt] = React.useState<string>("");
  const [altTouched, setAltTouched] = React.useState(false);
  const [coverId, setCoverId] = React.useState<string | undefined>(undefined);
  const [stagedCoverId, setStagedCoverId] = React.useState<
    string | undefined
  >(undefined);

  const setAlt = (v: string) => {
    setAltTouched(true);
    _setAlt(v);
  };

  // ---------- mutations ----------
  const [createOne, { isLoading: creating }] =
    useAdminCreateAccessoryMutation();
  const [updateOne, { isLoading: updating }] =
    useAdminUpdateAccessoryMutation();

  // public storage upload
  const [uploadToBucket, { isLoading: uploading }] =
    useUploadToBucketMutation();

  const saving = creating || updating || uploading;
  const savingImg = uploading || updating;

  // ---------- hydrate ----------
  React.useEffect(() => {
    if (!isNew && existing) {
      setName(existing.name ?? "");
      setSlug(existing.slug ?? "");
      setCategory(existing.category as AccKey);
      setMaterial(existing.material ?? "");
      setPrice(existing.price ?? "");
      setDescription(existing.description ?? "");

      setFeatured(!!existing.featured);
      setIsActive(!!existing.is_active);
      setDisplayOrder(Number(existing.display_order ?? 0));

      setImageUrl(
        existing.image_effective_url ?? existing.image_url ?? "",
      );

      // alt default: varsa alt, yoksa name
      if (!existing.alt && existing.name) {
        _setAlt(existing.name);
        setAltTouched(false);
      } else {
        _setAlt(existing.alt ?? "");
        setAltTouched(!!existing.alt);
      }

      // eski storage asset kaydı varsa sadece state'te tut (şimdilik kullanmıyoruz)
      setCoverId(existing.storage_asset_id ?? undefined);
      setStagedCoverId(undefined);

      setDimensions(existing.dimensions ?? "");
      setWeight(existing.weight ?? "");
      setThickness(existing.thickness ?? "");
      setFinish(existing.finish ?? "");
      setWarranty(existing.warranty ?? "");
      setInstallationTime(existing.installation_time ?? "");
    }
  }, [existing, isNew]);

  // name değişince, kullanıcı alt'a dokunmadıysa otomatik doldur
  React.useEffect(() => {
    if (!altTouched && !alt && name) {
      _setAlt(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const onBack = () =>
    window.history.length
      ? window.history.back()
      : navigate("/admin/accessories");

  // ---------- payload builders ----------
  const buildCreatePayload = (): AccessoryCreateInput => {
    const body: AccessoryCreateInput = {
      name,
      category,
      material,
      price,
      display_order: Number(displayOrder) || 0,
      is_active: isActive,
      featured,
    };

    // description: boş değilse gönder
    if (description.trim()) {
      body.description = description;
    }

    // image_url + alt
    if (imageUrl) {
      body.image_url = imageUrl;
    }
    if (alt.trim()) {
      body.alt = alt;
    } else {
      body.alt = null; // optional ama verince string | null
    }

    // opsiyoneller: boşsa hiç gönderme
    if (dimensions.trim()) body.dimensions = dimensions;
    if (weight.trim()) body.weight = weight;
    if (thickness.trim()) body.thickness = thickness;
    if (finish.trim()) body.finish = finish;
    if (warranty.trim()) body.warranty = warranty;
    if (installationTime.trim())
      body.installation_time = installationTime;

    return body;
  };

  const buildUpdatePayload = (): AccessoryUpdateInput => ({
    name,
    category,
    material,
    price,
    description: description || null,
    image_url: imageUrl || null,
    alt: alt || null,
    // storage_asset_id: null, // istersen temizleyebilirsin; şimdilik dokunmuyoruz
    featured,
    dimensions: dimensions || null,
    weight: weight || null,
    thickness: thickness || null,
    finish: finish || null,
    warranty: warranty || null,
    installation_time: installationTime || null,
    display_order: Number(displayOrder) || 0,
    is_active: isActive,
  });

  // ---------- create / update ----------
  const doCreate = async () => {
    if (!name || !category || !material || !price) {
      toast.error("Ad, kategori, malzeme ve fiyat zorunlu");
      return;
    }
    try {
      const created = await createOne(buildCreatePayload()).unwrap();

      toast.success(
        "Aksesuar oluşturuldu. Şimdi kapak görseli ekleyebilirsiniz.",
      );
      // direkt detay sayfasına git → resim oradan eklensin
      navigate(`/admin/accessories/${created.id}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Oluşturma başarısız");
    }
  };

  const doUpdate = async () => {
    if (isNew || !id) return;
    if (!name || !category || !material || !price) {
      toast.error("Ad, kategori, malzeme ve fiyat zorunlu");
      return;
    }
    try {
      await updateOne({
        id: String(id),
        body: buildUpdatePayload(),
      }).unwrap();
      toast.success("Aksesuar güncellendi");
      navigate("/admin/accessories");
    } catch (e: any) {
      toast.error(e?.data?.message || "Güncelleme başarısız");
    }
  };

  // ---------- image handlers (Category/SubCategory pattern) ----------

  /** Dosya yükle + public URL + mevcut kayıtta anında kaydetme */
  const uploadCover = async (file: File): Promise<void> => {
    // 🔒 Yeni kayıt iken görsel ekleme yok
    if (isNew || !id) {
      toast.error(
        "Önce Temel Bilgileri kaydedin, sonra kapak görseli ekleyin.",
      );
      return;
    }

    try {
      const res = await uploadToBucket({
        bucket: "accessories",
        files: file,
        path: `accessories/${id}/cover/${Date.now()}-${file.name}`,
        upsert: true,
      }).unwrap();

      const item = (res as any)?.items?.[0];
      const publicUrl: string | undefined = item?.url;

      if (!publicUrl) {
        toast.error("Yükleme cevabı beklenen formatta değil");
        return;
      }

      // alt default: önce name, yoksa dosya adı
      let nextAlt = alt;
      if (!altTouched && !alt) {
        const base = file.name.replace(/\.[^.]+$/, "");
        nextAlt = name || base;
        _setAlt(nextAlt);
      }

      setImageUrl(publicUrl);
      setCoverId(undefined);
      setStagedCoverId(undefined);

      // Kayıtlı aksesuar → BE'de tam payload ile update
      await updateOne({
        id: String(id),
        body: {
          ...buildUpdatePayload(),
          image_url: publicUrl,
          alt: nextAlt || null,
        },
      }).unwrap();

      toast.success("Kapak resmi güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Kapak yüklenemedi");
    }
  };

  /** Sadece ALT bilgisini güncelle (mevcut kayıtta) */
  const saveAltOnly = async () => {
    if (isNew || !id) return;
    if (!imageUrl) {
      toast.error("Önce bir görsel ekleyin.");
      return;
    }
    try {
      await updateOne({
        id: String(id),
        body: {
          ...buildUpdatePayload(),
          alt: alt || null,
        },
      }).unwrap();
      toast.success("Alt metin güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Alt metin güncellenemedi");
    }
  };

  /** Kapak kaldır */
  const removeCover = async () => {
    if (isNew) {
      setCoverId(undefined);
      setStagedCoverId(undefined);
      setImageUrl("");
      _setAlt("");
      setAltTouched(false);
      toast.info("Görsel yerelden kaldırıldı (kayıt yok).");
      return;
    }
    if (!id) return;
    try {
      await updateOne({
        id: String(id),
        body: {
          ...buildUpdatePayload(),
          image_url: null,
          alt: null,
        },
      }).unwrap();
      setCoverId(undefined);
      setStagedCoverId(undefined);
      setImageUrl("");
      _setAlt("");
      setAltTouched(false);
      toast.success("Görsel kaldırıldı");
    } catch (e: any) {
      toast.error(e?.data?.message || "Görsel kaldırılamadı");
    }
  };

  const onUrlChange = (v: string) => {
    setImageUrl(v);
    if (!altTouched && !alt && v) {
      try {
        const u = new URL(v);
        const base = u.pathname.split("/").pop() || "";
        _setAlt(name || base.replace(/\.[^.]+$/, ""));
      } catch {
        // noop
      }
    }
  };

  if (!isNew && loadingExisting) {
    return <div className="p-4 text-sm text-gray-500">Yükleniyor…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack} className="gap-2">
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

      {/* Temel Bilgiler */}
      <Section title="Temel Bilgiler">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Ad */}
          <div className="space-y-2">
            <Label>
              Ad
              <RequiredMark />
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aksesuar adı"
              required
              aria-required="true"
            />
          </div>

          {/* Slug (read-only) */}
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={slug}
              readOnly
              placeholder="name’den otomatik üretilir"
            />
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <Label>
              Kategori
              <RequiredMark />
            </Label>
            <select
              className="h-10 w-full rounded border px-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value as AccKey)}
              required
              aria-required="true"
            >
              <option value="suluk">Suluk</option>
              <option value="sutun">Sütun</option>
              <option value="vazo">Vazo</option>
              <option value="aksesuar">Aksesuar</option>
            </select>
          </div>

          {/* Malzeme */}
          <div className="space-y-2">
            <Label>
              Malzeme
              <RequiredMark />
            </Label>
            <Input
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="Granit / Mermer ..."
              required
              aria-required="true"
            />
          </div>

          {/* Fiyat */}
          <div className="space-y-2">
            <Label>
              Fiyat
              <RequiredMark />
            </Label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Örn: 3.500 ₺"
              required
              aria-required="true"
            />
          </div>

          {/* Aktif */}
          <div className="space-y-2">
            <Label>Aktif</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>

          {/* Öne Çıkan */}
          <div className="space-y-2">
            <Label>Öne Çıkan</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={featured}
                onCheckedChange={setFeatured}
                className="data-[state=checked]:bg-amber-500"
              />
            </div>
          </div>

          {/* Sıra */}
          <div className="space-y-2">
            <Label>Sıra</Label>
            <Input
              inputMode="numeric"
              value={String(displayOrder)}
              onChange={(e) =>
                setDisplayOrder(Number(e.target.value) || 0)
              }
              placeholder="0"
            />
          </div>

          {/* Açıklama */}
          <div className="sm:col-span-2 space-y-2">
            <Label>Açıklama (opsiyonel)</Label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* Ek Alanlar */}
      <Section title="Ek Alanlar">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <Label>Ölçüler</Label>
            <Input
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="Örn: 30×20×10 cm"
            />
          </div>
          <div className="space-y-1">
            <Label>Ağırlık</Label>
            <Input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Örn: 2.3 kg"
            />
          </div>
          <div className="space-y-1">
            <Label>Kalınlık</Label>
            <Input
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              placeholder="Örn: 12 mm"
            />
          </div>
          <div className="space-y-1">
            <Label>Yüzey</Label>
            <Input
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              placeholder="Örn: Parlak / Mat"
            />
          </div>
          <div className="space-y-1">
            <Label>Garanti</Label>
            <Input
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              placeholder="Örn: 24 ay"
            />
          </div>
          <div className="space-y-1">
            <Label>Montaj Süresi</Label>
            <Input
              value={installationTime}
              onChange={(e) =>
                setInstallationTime(e.target.value)
              }
              placeholder="Örn: 2 saat"
            />
          </div>
        </div>
      </Section>

      {/* KAPAK GÖRSELİ */}
      {!isNew ? (
        <CoverImageSection
          title="Kapak Görseli"
          coverId={coverId}
          stagedCoverId={stagedCoverId}
          imageUrl={imageUrl}
          alt={alt}
          saving={savingImg}
          onPickFile={uploadCover}
          onRemove={removeCover}
          onUrlChange={onUrlChange}
          onAltChange={setAlt}
          onSaveAlt={id ? saveAltOnly : undefined}
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
