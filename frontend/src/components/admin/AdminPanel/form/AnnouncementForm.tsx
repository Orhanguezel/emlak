// =============================================================
// FILE: src/components/admin/AdminPanel/form/AnnouncementForm.tsx
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
  useGetAnnouncementAdminByIdQuery,
  useCreateAnnouncementAdminMutation,
  useUpdateAnnouncementAdminMutation,
  useSetAnnouncementImageAdminMutation,
} from "@/integrations/rtk/endpoints/admin/announcements_admin.endpoints";

// 🔸 Yeni public storage pattern
import { useUploadToBucketMutation } from "@/integrations/rtk/endpoints/storage_public.endpoints";

import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { CoverImageSection } from "@/components/admin/AdminPanel/form/sections/CoverImageSection";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AnnouncementForm() {
  const { id } = useParams() as { id?: string };
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const { data: existing, isFetching } = useGetAnnouncementAdminByIdQuery(String(id ?? ""), {
    skip: isNew,
  });

  // ---- form state
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [content, setContent] = React.useState(""); // düz HTML
  const [link, setLink] = React.useState("");

  const [bg, setBg] = React.useState("#F8FAFC");
  const [hoverBg, setHoverBg] = React.useState("#EFF6FF");
  const [iconColor, setIconColor] = React.useState("#0EA5E9");
  const [textColor, setTextColor] = React.useState("#0F172A");
  const [borderColor, setBorderColor] = React.useState("#E2E8F0");

  const [badgeText, setBadgeText] = React.useState<string>("");
  const [badgeColor, setBadgeColor] = React.useState<string>("");
  const [buttonText, setButtonText] = React.useState<string>("");
  const [buttonColor, setButtonColor] = React.useState<string>("");

  const [isActive, setIsActive] = React.useState(true);
  const [isPublished, setIsPublished] = React.useState(true);
  const [displayOrder, setDisplayOrder] = React.useState<number>(1);

  // image state (sadece EDIT’te anlamlı)
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [alt, setAlt] = React.useState<string>("");
  const [coverId, setCoverId] = React.useState<string | undefined>(undefined);
  const [stagedCoverId, setStagedCoverId] = React.useState<string | undefined>(undefined);

  // mutations
  const [createOne, { isLoading: creating }] = useCreateAnnouncementAdminMutation();
  const [updateOne, { isLoading: updating }] = useUpdateAnnouncementAdminMutation();
  const [setImage, { isLoading: settingImg }] = useSetAnnouncementImageAdminMutation();

  // 🔸 Public storage upload (yeni pattern)
  const [uploadToBucket, { isLoading: uploading }] = useUploadToBucketMutation();

  const saving = creating || updating || settingImg || uploading;

  // ---- inline validation
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const setField =
    (key: string, updater: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
        updater(e.target.value);
      };

  // Quill boş mu?
  const isHtmlEmpty = (html: string) => {
    if (!html) return true;
    const stripped = html
      .replace(/<\s*br\s*\/?>/gi, "")
      .replace(/<\s*p[^>]*>\s*<\/\s*p>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;|&#160;/g, "")
      .replace(/\s+/g, "")
      .trim();
    return stripped.length === 0;
  };

  // hydrate (EDIT)
  React.useEffect(() => {
    if (!isNew && existing) {
      setTitle(existing.title ?? "");
      setDescription(existing.description ?? "");
      setContent(existing.html ?? existing.content ?? "");
      setLink(existing.link ?? "");

      setBg(existing.bg_color ?? "#F8FAFC");
      setHoverBg(existing.hover_color ?? "#EFF6FF");
      setIconColor(existing.icon_color ?? "#0EA5E9");
      setTextColor(existing.text_color ?? "#0F172A");
      setBorderColor(existing.border_color ?? "#E2E8F0");

      setBadgeText(existing.badge_text ?? "");
      setBadgeColor(existing.badge_color ?? "");
      setButtonText(existing.button_text ?? "");
      setButtonColor(existing.button_color ?? "");

      setIsActive(!!existing.is_active);
      setIsPublished(!!existing.is_published);
      setDisplayOrder(Number(existing.display_order ?? 1));

      setImageUrl((existing as any).image_url ?? "");
      setAlt((existing as any).alt ?? "");
      setCoverId((existing as any).storage_asset_id ?? undefined);
      setStagedCoverId(undefined);
    }
  }, [existing, isNew]);

  const onBack = () =>
    window.history.length ? window.history.back() : navigate("/admin/announcements");

  // ---- içerik normalizasyonu (POST/PUT uyumluluğu)
  const normalizeContent = (html: string) => {
    try {
      const maybe = JSON.parse(html);
      if (maybe && typeof (maybe as any).html === "string") return html;
    } catch { }
    return JSON.stringify({ html });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Zorunlu alan.";
    if (!description.trim()) errs.description = "Zorunlu alan.";
    if (isHtmlEmpty(content)) errs.content = "Zorunlu alan.";
    if (!link.trim()) errs.link = "Zorunlu alan.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Zorunlu alanları doldurun.");
      return false;
    }
    return true;
  };

  // build body for create/update
  const buildBody = () => ({
    title: title.trim(),
    description: description.trim(),
    content: normalizeContent(content || ""), // BE bazen 'content' JSON-string, bazen 'html' okuyor → ikisini de gönder
    html: content || "",
    link: link.trim(),

    bg_color: bg,
    hover_color: hoverBg,
    icon_color: iconColor,
    text_color: textColor,
    border_color: borderColor,

    badge_text: badgeText || null,
    badge_color: badgeColor || null,
    button_text: buttonText || null,
    button_color: buttonColor || null,

    is_active: !!isActive,
    is_published: !!isPublished,
    display_order: Number(displayOrder) || 1,
  });

  const doCreate = async () => {
    if (!validate()) return;
    try {
      await createOne(buildBody()).unwrap();
      toast.success("Duyuru oluşturuldu");
      navigate("/admin/announcements");
    } catch (e: any) {
      toast.error(e?.data?.message || "Oluşturma başarısız");
    }
  };

  const doUpdate = async () => {
    if (isNew || !id) return;
    if (!validate()) return;
    try {
      await updateOne({ id: String(id), patch: buildBody() }).unwrap();

      // Görsel işlemleri sadece EDIT’te
      const assocId = coverId ?? stagedCoverId;
      if (assocId) {
        // storage_asset_id kullanılıyorsa (diğer modüllerle pattern uyumu)
        await setImage({
          id: String(id),
          body: { storage_asset_id: assocId, alt: alt || null },
        }).unwrap();
      } else if (imageUrl) {
        // Yeni public storage pattern → image_url üzerinden ilişkilendir
        await setImage({
          id: String(id),
          body: { image_url: imageUrl, alt: alt || null },
        }).unwrap();
      }

      toast.success("Duyuru güncellendi");
      navigate("/admin/announcements");
    } catch (e: any) {
      toast.error(e?.data?.message || "Güncelleme başarısız");
    }
  };

  // ---- Edit’te kapak upload (create’de gösterilmiyor)
  const uploadCover = async (file: File) => {
    if (!id) return;
    try {
      const res = await uploadToBucket({
        bucket: "announcements",
        files: file,
        path: `announcements/${id}/cover/${file.name}`,
        upsert: true,
      }).unwrap();

      const item = res.items?.[0];
      if (!item) {
        toast.error("Yükleme sonrası dosya bulunamadı");
        return;
      }

      // Public storage pattern → URL üzerinden çalış
      setImageUrl(item.url);
      // Artık id üzerinden çalışmak zorunlu değil
      setCoverId(undefined);
      setStagedCoverId(undefined);

      await setImage({
        id: String(id),
        body: {
          image_url: item.url,
          alt:
            alt ||
            title ||
            file.name.replace(/\.[^.]+$/, "") ||
            null,
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
      await setImage({ id: String(id), body: { alt: alt || null } }).unwrap();
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
      toast.info("Görsel yerelden kaldırıldı (kayıt yok).");
      return;
    }
    if (!id) return;
    try {
      await setImage({
        id: String(id),
        body: { storage_asset_id: null, image_url: null, alt: alt || null },
      }).unwrap();
      setCoverId(undefined);
      setStagedCoverId(undefined);
      setImageUrl("");
      toast.success("Görsel kaldırıldı");
    } catch (e: any) {
      toast.error(e?.data?.message || "Görsel kaldırılamadı");
    }
  };

  const onUrlChange = (v: string) => {
    setImageUrl(v);
    if (v) {
      setCoverId(undefined);
      setStagedCoverId(undefined);
    }
  };

  if (!isNew && isFetching) {
    return <div className="p-4 text-sm text-gray-500">Yükleniyor…</div>;
  }

  const errCls = (hasErr: boolean) =>
    hasErr ? "border-rose-500 focus-visible:ring-rose-500" : "";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="secondary" onClick={onBack} className="gap-2">
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
          <div className="space-y-1">
            <Label>
              Başlık <span className="text-rose-600">*</span>
            </Label>
            <Input
              value={title}
              onChange={setField("title", setTitle)}
              placeholder="Duyuru başlığı"
              className={errCls(!!errors.title)}
            />
            {errors.title && (
              <p className="text-xs text-rose-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Aktif</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Yayınlandı</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={isPublished}
                onCheckedChange={setIsPublished}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Sıra</Label>
            <Input
              inputMode="numeric"
              value={String(displayOrder)}
              onChange={(e) =>
                setDisplayOrder(Number(e.target.value) || 1)
              }
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <Label>
              Kısa Açıklama <span className="text-rose-600">*</span>
            </Label>
            <Textarea
              rows={2}
              value={description}
              onChange={setField("description", setDescription)}
              className={errCls(!!errors.description)}
            />
            {errors.description && (
              <p className="text-xs text-rose-600">{errors.description}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1">
            <Label>
              İçerik (HTML) <span className="text-rose-600">*</span>
            </Label>
            <div
              className={
                errors.content ? "ring-1 ring-rose-500 rounded" : ""
              }
            >
              <ReactQuill
                theme="snow"
                value={content}
                onChange={(v) => {
                  if (errors.content)
                    setErrors((p) => ({ ...p, content: "" }));
                  setContent(v);
                }}
              />
            </div>
            {errors.content && (
              <p className="text-xs text-rose-600 mt-1">
                {errors.content}
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section title="Link">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <Label>
              Link <span className="text-rose-600">*</span>
            </Label>
            <Input
              value={link}
              onChange={setField("link", setLink)}
              placeholder="/kampanyalar"
              className={errCls(!!errors.link)}
            />
            {errors.link && (
              <p className="text-xs text-rose-600">{errors.link}</p>
            )}
          </div>
        </div>
      </Section>

      <Section title="Renkler">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div className="space-y-1">
            <Label>BG</Label>
            <Input value={bg} onChange={setField("bg_color", setBg)} />
          </div>
          <div className="space-y-1">
            <Label>Hover</Label>
            <Input
              value={hoverBg}
              onChange={setField("hover_color", setHoverBg)}
            />
          </div>
          <div className="space-y-1">
            <Label>Icon</Label>
            <Input
              value={iconColor}
              onChange={setField("icon_color", setIconColor)}
            />
          </div>
          <div className="space-y-1">
            <Label>Text</Label>
            <Input
              value={textColor}
              onChange={setField("text_color", setTextColor)}
            />
          </div>
          <div className="space-y-1">
            <Label>Border</Label>
            <Input
              value={borderColor}
              onChange={setField("border_color", setBorderColor)}
            />
          </div>
        </div>
      </Section>

      <Section title="Badge / Button">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Badge Text</Label>
            <Input
              value={badgeText}
              onChange={setField("badge_text", setBadgeText)}
            />
          </div>
          <div className="space-y-1">
            <Label>Badge Color</Label>
            <Input
              value={badgeColor}
              onChange={setField("badge_color", setBadgeColor)}
            />
          </div>
          <div className="space-y-1">
            <Label>Button Text</Label>
            <Input
              value={buttonText}
              onChange={setField("button_text", setButtonText)}
            />
          </div>
          <div className="space-y-1">
            <Label>Button Color</Label>
            <Input
              value={buttonColor}
              onChange={setField("button_color", setButtonColor)}
            />
          </div>
        </div>
      </Section>

      {/* Görsel bölümü: sadece EDIT modunda göster */}
      {!isNew ? (
        <CoverImageSection
          title="Kapak Görseli"
          coverId={coverId}
          stagedCoverId={stagedCoverId}
          imageUrl={imageUrl}
          alt={alt}
          saving={settingImg || uploading}
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
              İlk olarak <b>zorunlu alanları (*)</b> doldurup duyuruyu
              oluşturun. Kayıt sonrası kapak görselini ekleyebilirsiniz.
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
