// =============================================================
// FILE: src/components/admin/AdminPanel/debug/CoverImageStandaloneTestPage.tsx
// Amaç: CoverImageSection ile aynı pattern, fakat PROPS YOK,
// kendi içinde state ve upload debug var.
// =============================================================
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { ImagePlus, Trash2, X, Save as SaveIcon } from "lucide-react";

export default function CoverImageStandaloneTestPage() {
  const [coverId, setCoverId] = React.useState<string | undefined>(undefined);
  const [stagedCoverId, setStagedCoverId] = React.useState<string | undefined>(
    undefined,
  );

  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [alt, setAlt] = React.useState<string>("");

  const [saving, setSaving] = React.useState(false);

  const hasAnyStorage = Boolean(coverId || stagedCoverId);

  React.useEffect(() => {
    console.log("[CoverImageStandaloneTest] mount / state", {
      coverId,
      stagedCoverId,
      imageUrl,
      alt,
    });
  }, [coverId, stagedCoverId, imageUrl, alt]);

  // Basit debug upload handler – gerçek BE yok; sadece URL.createObjectURL ile önizleme yapıyoruz
  const handlePickFile = async (file: File) => {
    console.log("[CoverImageStandaloneTest] handlePickFile", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    setSaving(true);
    try {
      // Sadece client-side preview – gerçek upload YOK
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);

      // Debug amaçlı sahte ID
      const fakeId = `debug-${Date.now()}`;
      setCoverId(fakeId);
      setStagedCoverId(undefined);

      if (!alt) {
        const base = file.name.replace(/\.[^.]+$/, "");
        setAlt(base);
      }

      console.log("[CoverImageStandaloneTest] file set as preview", {
        localUrl,
        fakeId,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];

    console.log("[CoverImageStandaloneTest] file input change", {
      hasFile: !!f,
      name: f?.name,
      size: f?.size,
      type: f?.type,
    });

    if (f) {
      try {
        const maybe = handlePickFile(f);
        if (maybe && typeof (maybe as any).then === "function") {
          (maybe as Promise<void>).catch((err) => {
            console.error(
              "[CoverImageStandaloneTest] handlePickFile promise ERROR",
              err,
            );
          });
        }
      } catch (err) {
        console.error(
          "[CoverImageStandaloneTest] handlePickFile sync ERROR",
          err,
        );
      }
    }

    // Aynı dosyayı tekrar seçebilelim
    e.currentTarget.value = "";
  };

  const handleRemove = () => {
    console.log("[CoverImageStandaloneTest] remove cover click", {
      coverId,
      stagedCoverId,
    });
    setCoverId(undefined);
    setStagedCoverId(undefined);
    setImageUrl("");
    setAlt("");
  };

  const handleUrlChange = (v: string) => {
    console.log("[CoverImageStandaloneTest] imageUrl change", { value: v });
    setImageUrl(v);
  };

  const handleAltChange = (v: string) => {
    console.log("[CoverImageStandaloneTest] alt change", { value: v });
    setAlt(v);
  };

  const handleSaveAlt = () => {
    console.log("[CoverImageStandaloneTest] saveAltOnly click", { alt });
    // Debug sayfası, gerçek API yok – sadece log atıyoruz.
  };

  const accept = "image/*";

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <h1 className="text-xl font-semibold mb-2">
        Kapak Görseli Standalone Debug
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Bu sayfa, <code>CoverImageSection</code> pattern&apos;ini kendi
        içerisinde kullanır. Gerçek upload yok; sadece file input event&apos;i
        ve önizlemeyi test eder.
      </p>

      <Section
        title="Kapak Görseli (STANDALONE)"
        action={
          <div className="flex items-center gap-2">
            {/* 🔹 SADE PATTERN: label + hidden input (FileUploadTestPage ile aynı mantık) */}
            <label
              className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
              onClick={() => {
                console.log("[CoverImageStandaloneTest] upload label click");
              }}
            >
            </label>

            {hasAnyStorage && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemove}
                className="text-rose-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Görseli Kaldır
              </Button>
            )}
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* External URL + ALT */}
          <div className="space-y-2">
            <Label>Dış Kapak URL (opsiyonel)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://…"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              {imageUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleUrlChange("")}
                  title="Temizle"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={alt || "Kapak"}
                className="mt-2 h-32 w-56 rounded border object-cover"
              />
            ) : (
              <div className="mt-2 h-32 w-56 rounded border bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                Önizleme yok
              </div>
            )}

            <div className="space-y-1">
              <Label>Alt (alt) metin</Label>
              <div className="flex gap-2">
                <Input
                  value={alt}
                  onChange={(e) => handleAltChange(e.target.value)}
                  placeholder="Kapak resmi alternatif metin"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveAlt}
                  title="Sadece ALT bilgisini logla"
                >
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Alt&apos;ı Kaydet
                </Button>
              </div>
            </div>
          </div>

          {/* Storage Kapak Preview (sadece sahte ID gösteriyoruz) */}
          <div className="space-y-2">
            <Label className="block">
              Storage Kapak (ID: {coverId ?? stagedCoverId ?? "—"})
            </Label>
            {hasAnyStorage ? (
              <div className="mt-2 text-xs text-gray-700">
                Burada normalde <code>ThumbById</code> gibi bir bileşen
                çalışırdı. Debug sayfasında sadece ID gösteriyoruz.
              </div>
            ) : (
              <div className="mt-2 text-xs text-gray-500">
                Henüz storage kapak seçilmedi.
              </div>
            )}
            {saving && (
              <div className="mt-2 text-xs text-gray-500">
                Görsel kaydediliyor…
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
