// =============================================================
// FILE: src/components/admin/AdminPanel/form/CustomPageFormPage.tsx
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
  useGetCustomPageAdminByIdQuery,
  useCreateCustomPageAdminMutation,
  useUpdateCustomPageAdminMutation,
} from "@/integrations/rtk/endpoints/admin/custom_pages_admin.endpoints";

// 🔸 Category / SubCategory / Accessory ile aynı: public storage pattern
import { useUploadToBucketMutation } from "@/integrations/rtk/endpoints/storage_public.endpoints";

import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { CoverImageSection } from "@/components/admin/AdminPanel/form/sections/CoverImageSection";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import type {
  UpsertCustomPageBody,
  PatchCustomPageBody,
} from "@/integrations/rtk/types/customPages";

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

export default function CustomPageFormPage() {
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const { data: existing, isFetching: loadingExisting } =
    useGetCustomPageAdminByIdQuery(String(id ?? ""), {
      skip: isNew,
    });

  // --- form state
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [autoSlug, setAutoSlug] = React.useState(true);

  const [content, setContent] = React.useState("");
  const [metaTitle, setMetaTitle] = React.useState("");
  const [metaDesc, setMetaDesc] = React.useState("");
  const [isPublished, setIsPublished] = React.useState(false);

  // --- image state (tek kapak pattern)
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

  // --- mutations
  const [createOne, { isLoading: creating }] =
    useCreateCustomPageAdminMutation();
  const [updateOne, { isLoading: updating }] =
    useUpdateCustomPageAdminMutation();

  // public storage upload
  const [uploadToBucket, { isLoading: uploading }] =
    useUploadToBucketMutation();

  const saving = creating || updating || uploading;
  const savingImg = uploading || updating;

  // --- hydrate
  React.useEffect(() => {
    if (!isNew && existing) {
      setTitle(existing.title ?? "");
      setSlug(existing.slug ?? "");
      setContent(existing.content ?? "");
      setMetaTitle(existing.meta_title ?? "");
      setMetaDesc(existing.meta_description ?? "");
      setIsPublished(!!existing.is_published);

      setImageUrl(existing.image_effective_url ?? existing.image_url ?? "");

      // alt default: varsa alt, yoksa title
      if (!existing.alt && existing.title) {
        _setAlt(existing.title);
        setAltTouched(false);
      } else {
        _setAlt(existing.alt ?? "");
        setAltTouched(!!existing.alt);
      }

      // eski storage_asset_id vs olursa sadece state'te tut (şimdilik kullanılmıyor)
      setCoverId(undefined);
      setStagedCoverId(undefined);
    }
  }, [existing, isNew]);

  React.useEffect(() => {
    if (autoSlug) setSlug(slugifyTr(title));
  }, [title, autoSlug]);

  // name değişince, kullanıcı alt'a dokunmadıysa otomatik doldur
  React.useEffect(() => {
    if (!altTouched && !alt && title) {
      _setAlt(title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const onBack = () =>
    window.history.length ? window.history.back() : navigate("/admin/pages");

  // --- payload builders (sadece metin alanları)
  const buildCreatePayload = (): UpsertCustomPageBody => ({
    title,
    slug,
    content,
    meta_title: metaTitle || null,
    meta_description: metaDesc || null,
    is_published: isPublished,
  });

  const buildUpdatePayload = (): PatchCustomPageBody => ({
    title,
    slug,
    content,
    meta_title: metaTitle || null,
    meta_description: metaDesc || null,
    is_published: isPublished,
  });

  // --- actions
  const doCreate = async () => {
    if (!title || !slug || !content) {
      toast.error("Başlık, slug ve içerik zorunlu");
      return;
    }
    try {
      const created = await createOne(buildCreatePayload()).unwrap();

      toast.success(
        "Sayfa oluşturuldu. Şimdi kapak görseli ekleyebilirsiniz.",
      );
      // detay sayfasına git → kapak oradan eklenecek
      navigate(`/admin/pages/${created.id}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Oluşturma başarısız");
    }
  };

  const doUpdate = async () => {
    if (isNew || !id) return;
    if (!title || !slug || !content) {
      toast.error("Başlık, slug ve içerik zorunlu");
      return;
    }
    try {
      await updateOne({
        id: String(id),
        body: buildUpdatePayload(),
      }).unwrap();

      toast.success("Sayfa güncellendi");
      navigate("/admin/pages");
    } catch (e: any) {
      toast.error(e?.data?.message || "Güncelleme başarısız");
    }
  };

  // --- image handlers (Category/SubCategory/Accessory pattern) ---

  /** Dosya yükle + public URL + mevcut kayıtta anında kaydetme */
  const uploadCover = async (file: File): Promise<void> => {
    // 🔒 Yeni sayfada görsel ekleme yok
    if (isNew || !id) {
      toast.error(
        "Önce Temel Bilgileri kaydedin, sonra kapak görseli ekleyin.",
      );
      return;
    }

    try {
      const res = await uploadToBucket({
        bucket: "custom_pages",
        files: file,
        path: `custom_pages/${id}/cover/${Date.now()}-${file.name}`,
        upsert: true,
      }).unwrap();

      const item = (res as any)?.items?.[0];
      const publicUrl: string | undefined = item?.url;

      if (!publicUrl) {
        toast.error("Yükleme cevabı beklenen formatta değil");
        return;
      }

      // alt default: önce title, yoksa dosya adı
      let nextAlt = alt;
      if (!altTouched && !alt) {
        const base = file.name.replace(/\.[^.]+$/, "");
        nextAlt = title || base;
        _setAlt(nextAlt);
      }

      setImageUrl(publicUrl);
      setCoverId(undefined);
      setStagedCoverId(undefined);

      // sadece görsel alanlarını PATCH et
      await updateOne({
        id: String(id),
        body: {
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
        _setAlt(title || base.replace(/\.[^.]+$/, ""));
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

      {/* Temel Bilgiler */}
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
              placeholder="Sayfa başlığı"
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
              placeholder="sayfa-slug"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label>Yayında</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={isPublished}
                onCheckedChange={setIsPublished}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Meta Title</Label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Opsiyonel"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label>Meta Description</Label>
            <Textarea
              rows={3}
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              placeholder="Opsiyonel"
            />
          </div>
        </div>
      </Section>

      {/* İçerik */}
      <Section title="İçerik (HTML)">
        <div className="space-y-2">
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>
      </Section>

      {/* Kapak Görseli */}
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
          onSaveAlt={!isNew && !!id ? saveAltOnly : undefined}
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
