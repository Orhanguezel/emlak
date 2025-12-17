// src/components/admin/AdminPanel/form/properties/PropertyGallerySection.tsx
"use client";

import * as React from "react";
import { Image as ImageIcon, Star, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { ThumbById } from "@/components/admin/AdminPanel/form/sections/shared/ThumbById";

import type { GalleryAsset } from "@/components/admin/AdminPanel/form/properties/usePropertyForm";

type Props = {
  assets: GalleryAsset[];
  saving?: boolean;

  onPickFiles: (files: FileList) => void | Promise<void>;
  onSetCoverIndex: (idx: number) => void | Promise<void>;
  onRemoveAt: (idx: number) => void | Promise<void>;
};

export function PropertyGallerySection({
  assets,
  saving,
  onPickFiles,
  onSetCoverIndex,
  onRemoveAt,
}: Props) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files && files.length) {
      const maybe = onPickFiles(files);
      if (maybe && typeof (maybe as any).then === "function") {
        (maybe as Promise<void>).catch(console.error);
      }
    }
    e.currentTarget.value = "";
  };

  return (
    <Section
      title="Galeri (Çoklu Görsel)"
      action={
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" disabled={!!saving} asChild className="gap-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <UploadCloud className="h-4 w-4" /> Çoklu Yükle
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="sr-only"
              />
            </label>
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          {assets.length
            ? `${assets.length} medya`
            : "Henüz medya yok. Çoklu görsel yükleyebilirsiniz."}
        </div>

        {assets.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {assets.map((a, idx) => {
              const key = a.id;
              const url = (a.url ?? "").toString();
              const hasStorage = !!a.asset_id;

              return (
                <div key={key} className="rounded-lg border bg-white overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-50 relative">
                    {hasStorage ? (
                      <div className="w-full h-full">
                        <ThumbById id={String(a.asset_id)} isCover={a.is_cover} />
                      </div>
                    ) : url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt={a.alt ?? ""} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}

                    {a.is_cover && (
                      <div className="absolute left-2 top-2 rounded-full bg-black/80 text-white text-xs px-2 py-1 flex items-center gap-1">
                        <Star className="h-3 w-3" /> Kapak
                      </div>
                    )}
                  </div>

                  <div className="p-2 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={a.is_cover ? "default" : "secondary"}
                      disabled={!!saving}
                      onClick={() => onSetCoverIndex(idx)}
                      className="gap-2"
                    >
                      <Star className="h-4 w-4" /> Kapak Yap
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={!!saving}
                      onClick={() => onRemoveAt(idx)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" /> Sil
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-xs text-gray-500">
          Not: Kapak görseli galeriden seçilir. Kaydettiğinde backend cover’ı otomatik senkronlar.
        </div>
      </div>
    </Section>
  );
}
