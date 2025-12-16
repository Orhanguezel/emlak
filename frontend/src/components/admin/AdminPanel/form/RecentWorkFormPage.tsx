// =============================================================
// FILE: src/components/admin/AdminPanel/form/RecentWorkFormPage.tsx
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
  useGetRecentWorkAdminQuery,
  useCreateRecentWorkAdminMutation,
  useUpdateRecentWorkAdminMutation,
  useAttachRecentWorkImageAdminMutation,
  useDetachRecentWorkImageAdminMutation,
} from "@/integrations/rtk/endpoints/admin/recent_works_admin.endpoints";

// 🔸 Yeni public storage pattern
import { useUploadToBucketMutation } from "@/integrations/rtk/endpoints/storage_public.endpoints";

import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { CoverImageSection } from "@/components/admin/AdminPanel/form/sections/CoverImageSection";

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

export default function RecentWorkFormPage() {
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const { data: existing, isFetching } = useGetRecentWorkAdminQuery(
    String(id ?? ""),
    { skip: isNew },
  );

  const hydratedOnce = React.useRef(false);

  // ---- form state
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [autoSlug, setAutoSlug] = React.useState(true);
  const [description, setDescription] = React.useState("");

  const [category, setCategory] = React.useState("");
  const [seoKeywordsText, setSeoKeywordsText] = React.useState("");

  const [date, setDate] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [material, setMaterial] = React.useState("");
  const [price, setPrice] = React.useState<string>("");

  const [dimensions, setDimensions] = React.useState("");
  const [workTime, setWorkTime] = React.useState("");
  const [specialsText, setSpecialsText] = React.useState(""); // virgül/enter
  const [customerReview, setCustomerReview] = React.useState("");

  const [isActive, setIsActive] = React.useState(true);
  const [displayOrder, setDisplayOrder] = React.useState<number>(0);

  // ---- image state
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [alt, _setAlt] = React.useState<string>("");
  const [altTouched, setAltTouched] = React.useState(false);
  const [coverId, setCoverId] = React.useState<string | undefined>(undefined);
  const [stagedCoverId, setStagedCoverId] = React.useState<string | undefined>(
    undefined,
  );

  const setAlt = (v: string) => {
    setAltTouched(true);
    _setAlt(v);
  };

  // ---- mutations
  const [createOne, { isLoading: creating }] =
    useCreateRecentWorkAdminMutation();
  const [updateOne, { isLoading: updating }] =
    useUpdateRecentWorkAdminMutation();
  const [attachImg, { isLoading: attaching }] =
    useAttachRecentWorkImageAdminMutation();
  const [detachImg, { isLoading: detaching }] =
    useDetachRecentWorkImageAdminMutation();

  const [uploadToBucket, { isLoading: uploading }] =
    useUploadToBucketMutation();

  const saving = creating || updating || attaching || detaching || uploading;
  const savingImg = attaching || detaching || uploading;

  // ---- hydrate (EDIT)
  React.useEffect(() => {
    if (isNew || !existing) return;

    if (!hydratedOnce.current) {
      setTitle(existing.title ?? "");
      setSlug(existing.slug ?? "");
      setDescription(existing.description ?? "");

      setCategory(existing.category ?? "");
      setSeoKeywordsText(
        Array.isArray(existing.seo_keywords)
          ? existing.seo_keywords.join(", ")
          : "",
      );

      setDate(existing.date ?? "");
      setLocation(existing.location ?? "");
      setMaterial(existing.material ?? "");
      setPrice(existing.price ?? "");

      setDimensions(existing.details?.dimensions ?? "");
      setWorkTime(existing.details?.workTime ?? "");
      setSpecialsText(
        Array.isArray(existing.details?.specialFeatures)
          ? existing.details!.specialFeatures.join(", ")
          : "",
      );
      setCustomerReview(existing.details?.customerReview ?? "");

      setIsActive(!!existing.is_active);
      setDisplayOrder(Number(existing.display_order ?? 0));

      hydratedOnce.current = true;
    }

    setImageUrl(existing.image_effective_url ?? existing.image_url ?? "");
    if (!existing.alt && existing.title) {
      _setAlt(existing.title);
      setAltTouched(false);
    } else {
      _setAlt(existing.alt ?? "");
      setAltTouched(!!existing.alt);
    }
    setCoverId((existing as any).storage_asset_id ?? undefined);
    setStagedCoverId(undefined);
  }, [existing, isNew]);

  // Başlıktan otomatik slug
  React.useEffect(() => {
    if (autoSlug) setSlug(slugifyTr(title));
  }, [title, autoSlug]);

  // Başlık değişince alt elle dokunulmamışsa alt'ı başlığa eşitle
  React.useEffect(() => {
    if (!altTouched && !alt && title) {
      _setAlt(title);
    }
  }, [title, altTouched, alt]);

  const toKeywords = React.useCallback(
    () =>
      seoKeywordsText
        .split(/[,\n]/g)
        .map((s) => s.trim())
        .filter(Boolean),
    [seoKeywordsText],
  );
  const toSpecials = React.useCallback(
    () =>
      specialsText
        .split(/[,\n]/g)
        .map((s) => s.trim())
        .filter(Boolean),
    [specialsText],
  );

  const onBack = () =>
    window.history.length
      ? window.history.back()
      : navigate("/admin/recent_works");

  const buildCreateBody = () => ({
    title,
    slug,
    description,
    category,
    seoKeywords: toKeywords(),
    date,
    location,
    material,
    price: price ? price : null,
    details: {
      dimensions,
      workTime,
      specialFeatures: toSpecials(),
      customerReview: customerReview ? customerReview : null,
    },
    is_active: isActive,
    display_order: Number(displayOrder) || 0,
  });

  const buildUpdateBody = () => ({
    title,
    slug,
    description,
    category,
    seoKeywords: toKeywords(),
    date,
    location,
    material,
    price: price ? price : null,
    details: {
      dimensions,
      workTime,
      specialFeatures: toSpecials(),
      customerReview: customerReview ? customerReview : null,
    },
    is_active: isActive,
    display_order: Number(displayOrder) || 0,
  });

  // Kapak ilişkilendirme (URL varsa image_url, yoksa storage_asset_id)
  const attachCover = async (theId: string) => {
    const body =
      imageUrl
        ? { image_url: imageUrl, alt: alt || title || null }
        : coverId ?? stagedCoverId
          ? {
            storage_asset_id: (coverId ?? stagedCoverId)!,
            alt: alt || title || null,
          }
          : null;

    if (!body) return;

    await attachImg({ id: theId, body }).unwrap();
  };

  const doCreate = async () => {
    if (
      !title ||
      !slug ||
      !description ||
      !category ||
      !date ||
      !location ||
      !material ||
      !dimensions ||
      !workTime
    ) {
      toast.error("Zorunlu alanları doldurun.");
      return;
    }
    try {
      const created = await createOne(buildCreateBody()).unwrap();
      toast.success(
        "Çalışma oluşturuldu. Şimdi kapak görselini ekleyebilirsiniz.",
      );
      // Campaign pattern: önce temel bilgiler, sonra kapak
      navigate(`/admin/recent_works/${created.id}`);
    } catch (e: any) {
      const msg = e?.data?.error?.message || e?.data?.message;
      if (msg === "slug_already_exists")
        toast.error("Slug zaten kullanılıyor");
      else toast.error(msg || "Oluşturma başarısız");
    }
  };

  const doUpdate = async () => {
    if (isNew || !id) return;
    if (
      !title ||
      !slug ||
      !description ||
      !category ||
      !date ||
      !location ||
      !material ||
      !dimensions ||
      !workTime
    ) {
      toast.error("Zorunlu alanları doldurun.");
      return;
    }

    try {
      // 1) Ana kaydı güncelle
      await updateOne({ id: String(id), body: buildUpdateBody() }).unwrap();

      // 2) Kapak görselini BEST-EFFORT güncelle (hata navigasyonu engellemesin)
      try {
        await attachCover(String(id));
      } catch (imgErr: any) {
        const msg =
          imgErr?.data?.message ||
          imgErr?.message ||
          "Görsel ilişkilendirilemedi";
        toast.error(msg);
      }

      // 3) Her durumda (update başarılıysa) list eye dön
      toast.success("Çalışma güncellendi");
      navigate("/admin/recent_works");
      // alternatif istersen:
      // onBack();
    } catch (e: any) {
      const msg = e?.data?.error?.message || e?.data?.message;
      if (msg === "slug_already_exists")
        toast.error("Slug zaten kullanılıyor");
      else toast.error(msg || "Güncelleme başarısız");
    }
  };

  // 🔸 Public storage upload (kapak)
  const uploadCover = async (file: File): Promise<void> => {
    if (!id || isNew) {
      toast.error("Önce çalışmayı kaydedin, sonra kapak ekleyin.");
      return;
    }

    try {
      const res = await uploadToBucket({
        bucket: "recent_works",
        files: file,
        path: `recent_works/${id}/cover/${file.name}`,
        upsert: true,
      }).unwrap();

      const item = res.items?.[0];
      if (!item || !item.url) {
        toast.error("Yükleme cevabı beklenen formatta değil");
        return;
      }

      const publicUrl = item.url;

      // alt default: önce title, yoksa dosya adı
      if (!altTouched && !alt) {
        const base = file.name.replace(/\.[^.]+$/, "");
        _setAlt(title || base);
      }

      // Yeni upload'lar için storage id kullanmıyoruz, sadece URL
      setImageUrl(publicUrl);
      setCoverId(undefined);
      setStagedCoverId(undefined);

      // 1) image_url üzerinden ilişkilendir
      await attachImg({
        id: String(id),
        body: {
          image_url: publicUrl,
          alt:
            alt ||
            title ||
            file.name.replace(/\.[^.]+$/, "") ||
            null,
        },
      }).unwrap();

      // 2) Liste / diğer görünümler için image_url alanını da güncel tut
      await updateOne({
        id: String(id),
        body: { image_url: publicUrl },
      }).unwrap();

      toast.success("Kapak resmi güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Kapak yüklenemedi");
    }
  };

  const saveAltOnly = async () => {
    if (isNew || !id) return;

    const body =
      imageUrl
        ? { image_url: imageUrl, alt: alt || title || null }
        : coverId ?? stagedCoverId
          ? {
            storage_asset_id: (coverId ?? stagedCoverId)!,
            alt: alt || title || null,
          }
          : null;

    if (!body) {
      toast.error("Önce bir görsel ekleyin.");
      return;
    }
    try {
      await attachImg({ id: String(id), body }).unwrap();
      toast.success("Alt metin güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Alt metin güncellenemedi");
    }
  };

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
      await detachImg(String(id)).unwrap();

      // image_url'ı da local state'ten temizle
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
    if (v) {
      // Manuel URL girildiyse storage id devre dışı
      setCoverId(undefined);
      setStagedCoverId(undefined);
    }
  };

  if (!isNew && isFetching) {
    return (
      <div className="p-4 text-sm text-gray-500">Yükleniyor…</div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Button>
        {isNew ? (
          <Button
            type="button"
            onClick={doCreate}
            disabled={saving}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4" />
            Oluştur
          </Button>
        ) : (
          <Button
            type="button"
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
              Başlık
              <RequiredMark />
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Çalışma başlığı"
              required
              aria-required="true"
            />
          </div>

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
              placeholder="ornek-calisma"
              required
              aria-required="true"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label>
              Kısa Açıklama
              <RequiredMark />
            </Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Kategori
              <RequiredMark />
            </Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label>SEO Keywords (virgül/enter)</Label>
            <Textarea
              rows={2}
              value={seoKeywordsText}
              onChange={(e) => setSeoKeywordsText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Tarih
              <RequiredMark />
            </Label>
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="2024-06 gibi"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Konum
              <RequiredMark />
            </Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Malzeme
              <RequiredMark />
            </Label>
            <Input
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label>Fiyat (opsiyonel)</Label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="örn: 12.500 ₺"
            />
          </div>

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

          <div className="space-y-2">
            <Label>Sıra</Label>
            <Input
              inputMode="numeric"
              value={String(displayOrder)}
              onChange={(e) =>
                setDisplayOrder(Number(e.target.value) || 0)
              }
            />
          </div>
        </div>
      </Section>

      <Section title="Detaylar">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Ölçüler
              <RequiredMark />
            </Label>
            <Input
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="örn: 80x120 cm"
              required
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label>
              İş Süresi
              <RequiredMark />
            </Label>
            <Input
              value={workTime}
              onChange={(e) => setWorkTime(e.target.value)}
              placeholder="örn: 3 gün"
              required
              aria-required="true"
            />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Özel Özellikler (virgül/enter)</Label>
            <Textarea
              rows={2}
              value={specialsText}
              onChange={(e) => setSpecialsText(e.target.value)}
              placeholder="Parlak cila, Su tahliye kanalı, ..."
            />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Müşteri Yorumu (opsiyonel)</Label>
            <Textarea
              rows={3}
              value={customerReview}
              onChange={(e) => setCustomerReview(e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* Görsel bölümü: sadece EDIT modunda */}
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
