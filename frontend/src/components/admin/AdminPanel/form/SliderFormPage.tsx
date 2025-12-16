// =============================================================
// FILE: src/components/admin/AdminPanel/form/SliderFormPage.tsx
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
  useAdminGetSlideQuery,
  useAdminCreateSlideMutation,
  useAdminUpdateSlideMutation,
  useAdminSetSlideStatusMutation,
} from "@/integrations/rtk/endpoints/admin/sliders_admin.endpoints";

// ✅ public storage (services’te kullandığın)
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

export default function SliderFormPage() {
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const { data: existing, isFetching } = useAdminGetSlideQuery(
    String(id ?? ""),
    { skip: isNew },
  );

  // form state
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [autoSlug, setAutoSlug] = React.useState(true);
  const [description, setDescription] = React.useState<string>("");

  const [buttonText, setButtonText] = React.useState<string>("");
  const [buttonLink, setButtonLink] = React.useState<string>("");

  const [featured, setFeatured] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);
  const [displayOrder, setDisplayOrder] = React.useState<number>(0);

  // tek görsel
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [alt, setAlt] = React.useState<string>("");

  const [createOne, { isLoading: creating }] =
    useAdminCreateSlideMutation();
  const [updateOne, { isLoading: updating }] =
    useAdminUpdateSlideMutation();
  const [setStatus] = useAdminSetSlideStatusMutation();

  const [uploadToBucket, { isLoading: uploading }] =
    useUploadToBucketMutation();

  const saving = creating || updating;
  const savingImg = uploading;

  // hydrate
  React.useEffect(() => {
    if (!isNew && existing) {
      setName(existing.name ?? "");
      setSlug(existing.slug ?? "");
      setDescription(existing.description ?? "");
      setButtonText(existing.buttonText ?? "");
      setButtonLink(existing.buttonLink ?? "");
      setFeatured(!!existing.featured);
      setIsActive(!!existing.is_active);
      setDisplayOrder(Number(existing.display_order ?? 0));

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
      : navigate("/admin/sliders");

  /* ------------ payload builders (exactOptional ile uyumlu) ------------ */
  const buildCreateBody = () => ({
    name,
    slug,
    description: description || null,

    // ❗ burada undefined yok, ya string ya null
    image_url: imageUrl || null,
    alt: alt || null,

    buttonText: buttonText || null,
    buttonLink: buttonLink || null,

    featured,
    is_active: isActive,
    display_order: Number(displayOrder) || 0,
  });

  const buildUpdateBody = () => ({
    name,
    slug,
    description: description || null,
    image_url: imageUrl || null,
    alt: alt || null,
    buttonText: buttonText || null,
    buttonLink: buttonLink || null,
    featured,
    is_active: isActive,
    display_order: Number(displayOrder) || 0,
  });

  /* ------------ actions ------------ */
  const doCreate = async () => {
    if (!name) return toast.error("Ad zorunlu");

    try {
      const created = await createOne(buildCreateBody()).unwrap();
      toast.success(
        "Slider oluşturuldu. İsterseniz kapak görseli ekleyebilirsiniz.",
      );
      navigate(`/admin/sliders/${created.id}`);
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

      toast.success("Slider güncellendi");
      navigate("/admin/sliders");
    } catch (e: any) {
      const msg = e?.data?.error?.message || e?.data?.message;
      toast.error(msg || "Güncelleme başarısız");
    }
  };

  const uploadCover = async (file: File) => {
    if (isNew || !id) {
      toast.error("Önce slider kaydedin, sonra kapak ekleyin.");
      return;
    }

    try {
      const res = await uploadToBucket({
        bucket: "slider", // eski bucket ismiyle hizalı
        files: file,
        path: `sliders/${id}/cover/${file.name}`,
        upsert: true,
      }).unwrap();

      const item = (res as any)?.items?.[0];
      if (!item || !item.url) {
        toast.error("Yükleme cevabı beklenen formatta değil");
        return;
      }

      const publicUrl: string = item.url;
      setImageUrl(publicUrl);

      // default alt: adı ya da dosya adı
      if (!alt) {
        const base = file.name.replace(/\.[^.]+$/, "");
        setAlt(name || base);
      }

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
    if (!imageUrl) {
      toast.error("Önce bir görsel ekleyin.");
      return;
    }

    try {
      await updateOne({
        id: String(id),
        body: { alt: alt || null },
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
          <ArrowLeft className="h-4 w-4" /> Geri
        </Button>
        {isNew ? (
          <Button
            onClick={doCreate}
            disabled={saving}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4" /> Oluştur
          </Button>
        ) : (
          <Button
            onClick={doUpdate}
            disabled={saving}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4" /> Kaydet
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
              placeholder="Slider adı"
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
              placeholder="slider-slug"
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
            <Label>Buton Yazısı (ops.)</Label>
            <Input
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="İncele"
            />
          </div>

          <div className="space-y-2">
            <Label>Buton Link (ops.)</Label>
            <Input
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="/urunler"
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
                      toast.error("Aktiflik durumu güncellenemedi");
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
                setDisplayOrder(Number(e.target.value) || 0)
              }
            />
          </div>
        </div>
      </Section>

      {/* Kapak görseli */}
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
