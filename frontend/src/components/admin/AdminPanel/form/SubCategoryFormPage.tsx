// =============================================================
// FILE: src/components/admin/AdminPanel/form/SubCategoryFormPage.tsx
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
  useGetSubCategoryAdminByIdQuery,
  useCreateSubCategoryAdminMutation,
  useUpdateSubCategoryAdminMutation,
} from "@/integrations/rtk/endpoints/admin/sub_categories_admin.endpoints";

import {
  useListCategoriesAdminQuery,
  type ListParams as CatListParams,
} from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";

// 🔸 Category/Campaign ile aynı: public storage pattern
import { useUploadToBucketMutation } from "@/integrations/rtk/endpoints/storage_public.endpoints";

import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { CoverImageSection } from "@/components/admin/AdminPanel/form/sections/CoverImageSection";

// slugify (tr)
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

export default function SubCategoryFormPage() {
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  // kategori listesi (dropdown)
  const catParams: CatListParams = {
    sort: "display_order",
    order: "asc",
    limit: 200,
  };
  const { data: cats } = useListCategoriesAdminQuery(catParams as any);

  const { data: existing, isFetching: loadingExisting } =
    useGetSubCategoryAdminByIdQuery(String(id ?? ""), {
      skip: isNew,
    });

  // ---------- form state ----------
  const [categoryId, setCategoryId] = React.useState("");
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [autoSlug, setAutoSlug] = React.useState(true);

  const [description, setDescription] = React.useState("");
  const [icon, setIcon] = React.useState("");

  const [isActive, setIsActive] = React.useState(true);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [displayOrder, setDisplayOrder] = React.useState<number>(0);

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
    useCreateSubCategoryAdminMutation();
  const [updateOne, { isLoading: updating }] =
    useUpdateSubCategoryAdminMutation();

  // 🔸 public storage upload
  const [uploadToBucket, { isLoading: uploading }] =
    useUploadToBucketMutation();

  const saving = creating || updating || uploading;
  const savingImg = uploading || updating;

  // ---------- hydrate ----------
  React.useEffect(() => {
    if (!isNew && existing) {
      setCategoryId(String((existing as any).category_id ?? ""));
      setName(existing.name ?? "");
      setSlug(existing.slug ?? "");
      setDescription(existing.description ?? "");
      setIcon((existing as any).icon ?? "");
      setIsActive(!!existing.is_active);
      setIsFeatured(!!existing.is_featured);
      setDisplayOrder(Number(existing.display_order ?? 0));
      setImageUrl(existing.image_url ?? "");

      // alt default: varsa alt, yoksa name
      if (!existing.alt && existing.name) {
        _setAlt(existing.name);
        setAltTouched(false);
      } else {
        _setAlt(existing.alt ?? "");
        setAltTouched(!!existing.alt);
      }

      // olası eski asset id var ise sadece state'te tut (şimdilik kullanmıyoruz)
      const existingAssetId =
        (existing as any).asset_id ??
        (existing as any).storage_asset_id ??
        (existing as any).image_asset_id ??
        undefined;
      setCoverId(existingAssetId);
      setStagedCoverId(undefined);
    }
  }, [existing, isNew]);

  // name değişince, kullanıcı alt'a dokunmadıysa otomatik doldur
  React.useEffect(() => {
    if (!altTouched && !alt && name) {
      _setAlt(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  React.useEffect(() => {
    if (autoSlug) setSlug(slugifyTr(name));
  }, [name, autoSlug]);

  const onBack = () =>
    window.history.length
      ? window.history.back()
      : navigate("/admin/subcategories");

  // ---------- payload builder (UpsertSubCategoryBody ile uyumlu) ----------
  const buildPayload = () => ({
    category_id: categoryId,
    name,
    slug,
    description: description || null,
    image_url: imageUrl || null,
    alt: alt || null,
    icon: icon || null,
    is_active: isActive,
    is_featured: isFeatured,
    display_order: Number(displayOrder) || 0,
  });

  // ---------- create / update ----------
  const doCreate = async () => {
    if (!categoryId) {
      toast.error("Kategori zorunlu");
      return;
    }
    if (!name) {
      toast.error("Ad zorunlu");
      return;
    }
    if (!slug) {
      toast.error("Slug zorunlu");
      return;
    }
    try {
      const created = await createOne(buildPayload()).unwrap();
      toast.success(
        "Alt kategori oluşturuldu. Şimdi kapak görseli ekleyebilirsiniz.",
      );
      navigate(`/admin/subcategories/${created.id}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Oluşturma başarısız");
    }
  };

  const doUpdate = async () => {
    if (isNew || !id) return;
    if (!categoryId) {
      toast.error("Kategori zorunlu");
      return;
    }
    if (!name) {
      toast.error("Ad zorunlu");
      return;
    }
    if (!slug) {
      toast.error("Slug zorunlu");
      return;
    }
    try {
      await updateOne({ id: String(id), body: buildPayload() }).unwrap();
      toast.success("Alt kategori güncellendi");
      navigate("/admin/subcategories");
    } catch (e: any) {
      toast.error(e?.data?.message || "Güncelleme başarısız");
    }
  };

  // ---------- image handlers (Category/Campaign pattern) ----------

  /** Dosya yükle + public storage URL + anında kaydetme (edit modunda) */
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
        bucket: "sub_categories",
        files: file,
        path: `sub_categories/${id}/cover/${Date.now()}-${file.name}`,
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

      // yeni upload: sadece URL kullanıyoruz
      setImageUrl(publicUrl);
      setCoverId(undefined);
      setStagedCoverId(undefined);

      // Kayıtlı alt kategori: BE'ye tam payload ile yaz (tip ve validation safe)
      await updateOne({
        id: String(id),
        body: {
          ...buildPayload(),
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
          ...buildPayload(),
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
          ...buildPayload(),
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
      // URL'den basit bir alt üret
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
        <Button
          variant="secondary"
          onClick={onBack}
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

      {/* Temel Bilgiler */}
      <Section title="Temel Bilgiler">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Kategori */}
          <div className="space-y-2">
            <Label>
              Kategori
              <RequiredMark />
            </Label>
            <select
              className="h-10 w-full rounded border px-2 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              aria-required="true"
            >
              <option value="">Seçiniz…</option>
              {(cats ?? []).map((c: any) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name ?? c.slug ?? c.id}
                </option>
              ))}
            </select>
          </div>

          {/* Ad */}
          <div className="space-y-2">
            <Label>
              Ad
              <RequiredMark />
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alt kategori adı"
              required
              aria-required="true"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label>
                Slug
                <RequiredMark />
              </Label>
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
              placeholder="alt-kategori-slug"
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

          {/* Anasayfa (Öne çıkan) */}
          <div className="space-y-2">
            <Label>Anasayfa</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
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

          {/* İkon */}
          <div className="sm:col-span-2 space-y-2">
            <Label>İkon (opsiyonel)</Label>
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Örn: lucide:star veya sınıf adı / URL"
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
              Önce <b>Temel Bilgileri</b> kaydedin. Kayıt oluşturulduktan sonra
              kapak görselini ekleyebilirsiniz.
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
