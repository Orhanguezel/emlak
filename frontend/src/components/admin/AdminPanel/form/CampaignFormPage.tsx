// =============================================================
// FILE: src/components/admin/AdminPanel/form/CampaignFormPage.tsx
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
  useGetCampaignAdminByIdQuery,
  useCreateCampaignAdminMutation,
  useUpdateCampaignAdminMutation,
  useAttachCampaignImageAdminMutation,
  useDetachCampaignImageAdminMutation,
} from "@/integrations/rtk/endpoints/admin/campaigns_admin.endpoints";

// 🔸 Yeni public storage pattern
import { useUploadToBucketMutation } from "@/integrations/rtk/endpoints/storage_public.endpoints";

import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { CoverImageSection } from "@/components/admin/AdminPanel/form/sections/CoverImageSection";

export default function CampaignFormPage() {
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const { data: existing, isFetching } = useGetCampaignAdminByIdQuery(String(id ?? ""), {
    skip: isNew,
  });

  const hydratedOnce = React.useRef(false);

  // ---- form state
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [seoKeywordsText, setSeoKeywordsText] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  // ---- image state
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [alt, _setAlt] = React.useState<string>("");
  const [altTouched, setAltTouched] = React.useState(false);
  const [coverId, setCoverId] = React.useState<string | undefined>(undefined);
  const [stagedCoverId, setStagedCoverId] = React.useState<string | undefined>(undefined);

  // mutations
  const [createOne, { isLoading: creating }] = useCreateCampaignAdminMutation();
  const [updateOne, { isLoading: updating }] = useUpdateCampaignAdminMutation();
  const [attachImg, { isLoading: attaching }] = useAttachCampaignImageAdminMutation();
  const [detachImg, { isLoading: detaching }] = useDetachCampaignImageAdminMutation();

  // 🔸 Public storage upload (yeni pattern)
  const [uploadToBucket, { isLoading: uploading }] = useUploadToBucketMutation();

  const saving = creating || updating || attaching || detaching || uploading;
  const savingImg = attaching || detaching || uploading;

  const setAlt = (v: string) => {
    setAltTouched(true);
    _setAlt(v);
  };

  React.useEffect(() => {
    if (!altTouched && !alt && title) _setAlt(title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // ---- EDIT hydrate
  React.useEffect(() => {
    if (isNew || !existing) return;

    if (!hydratedOnce.current) {
      setTitle(existing.title ?? "");
      setDescription(existing.description ?? "");
      setSeoKeywordsText(
        Array.isArray(existing.seo_keywords)
          ? existing.seo_keywords.join(", ")
          : "",
      );
      setIsActive(!!existing.is_active);
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

  const toKeywords = React.useCallback(
    () =>
      seoKeywordsText
        .split(/[,\n]/g)
        .map((s) => s.trim())
        .filter(Boolean),
    [seoKeywordsText],
  );

  const onBack = () =>
    window.history.length ? window.history.back() : navigate("/admin/campaigns");

  const buildCreateBody = () => ({
    title,
    description,
    seoKeywords: toKeywords(),
    is_active: isActive,
  });

  const buildUpdateBody = () => ({
    title,
    description,
    seoKeywords: toKeywords(),
    is_active: isActive,
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

    try {
      await attachImg({ id: theId, body }).unwrap();
    } catch (e: any) {
      toast.error(e?.data?.message || "Görsel ilişkilendirilemedi");
    }
  };

  const doCreate = async () => {
    if (!title || !description || toKeywords().length === 0) {
      toast.error("Başlık, açıklama ve en az 1 anahtar kelime zorunlu.");
      return;
    }
    try {
      const created = await createOne(buildCreateBody()).unwrap();
      toast.success(
        "Kampanya oluşturuldu. Şimdi kapak görselini ekleyebilirsiniz.",
      );
      navigate(`/admin/campaigns/${created.id}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Oluşturma başarısız");
    }
  };

  const doUpdate = async () => {
    if (isNew || !id) return;
    if (!title || !description || toKeywords().length === 0) {
      toast.error("Başlık, açıklama ve en az 1 anahtar kelime zorunlu.");
      return;
    }
    try {
      await updateOne({ id: String(id), body: buildUpdateBody() }).unwrap();
      await attachCover(String(id));
      toast.success("Kampanya güncellendi");
      navigate("/admin/campaigns");
    } catch (e: any) {
      toast.error(e?.data?.message || "Güncelleme başarısız");
    }
  };

  // ⬇️ Yeni pattern: uploadToBucket ile public URL al, kampanyaya image_url olarak yaz
  const uploadCover = async (file: File): Promise<void> => {
    if (!id || isNew) {
      toast.error("Önce kampanyayı kaydedin, sonra kapak ekleyin.");
      return;
    }

    try {
      const res = await uploadToBucket({
        bucket: "campaigns",
        files: file,
        path: `campaigns/${id}/cover/${file.name}`,
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
      await detachImg({ id: String(id) }).unwrap();
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
      // Manuel URL girilince storage id'yi devre dışı bırak
      setCoverId(undefined);
      setStagedCoverId(undefined);
    }
  };

  if (!isNew && isFetching) {
    return <div className="p-4 text-sm text-gray-500">Yükleniyor…</div>;
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
            <Label>Başlık</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Kampanya başlığı"
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

          <div className="sm:col-span-2 space-y-2">
            <Label>Açıklama</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kısa açıklama"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label>SEO Keywords (virgül/enter ile)</Label>
            <Textarea
              rows={2}
              value={seoKeywordsText}
              onChange={(e) => setSeoKeywordsText(e.target.value)}
              placeholder="örn: kampanya, taş, mermer"
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
