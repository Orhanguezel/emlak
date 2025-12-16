// =============================================================
// FILE: src/pages/admin/Dialogs/KeywordDialog.tsx
// =============================================================
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { KeywordItem } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  initialValue: KeywordItem | null;
  onSave: (payload: Omit<KeywordItem, "id">) => void;
};

export const KeywordDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  initialValue,
  onSave,
}) => {
  const [form, setForm] = useState<Omit<KeywordItem, "id">>({
    text: "",
    images: [],
    status: "Active",
  });

  useEffect(() => {
    if (initialValue) {
      const { id, ...rest } = initialValue;
      setForm(rest);
    } else {
      setForm({ text: "", images: [], status: "Active" });
    }
  }, [initialValue, open]);

  const handleFiles = (files: File[]) => {
    const ok: string[] = [];
    files.forEach((f) => {
      if (!f.type.startsWith("image/")) return;
      if (f.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (e) =>
        setForm((p) => ({
          ...p,
          images: [...p.images, (e.target?.result as string) ?? ""],
        }));
      reader.readAsDataURL(f);
      ok.push(f.name);
    });
    if (ok.length) toast.success(`${ok.length} görsel eklendi`);
  };

  const removeImage = (i: number) =>
    setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  const save = () => {
    if (!form.text.trim()) {
      toast.error("Metin boş olamaz");
      return;
    }
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="keyword-form-description"
        className="w-[min(92vw,48rem)] max-w-2xl overflow-hidden rounded-xl border bg-white p-0 shadow-xl"
      >
        {/* Sticky header */}
        <DialogHeader className="sticky top-0 z-10 bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6">
          <DialogTitle className="text-base sm:text-lg">
            {initialValue ? "Anahtar Kelime Düzenle" : "Yeni Anahtar Kelime Ekle"}
          </DialogTitle>
          <DialogDescription
            id="keyword-form-description"
            className="text-xs sm:text-sm"
          >
            Anahtar kelime bilgilerini doldurun ve kaydedin.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="max-h-[80dvh] overflow-y-auto bg-white px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
          <div className="space-y-5">
            {/* Metin */}
            <div>
              <Label htmlFor="kw-text">Metin *</Label>
              <Textarea
                id="kw-text"
                value={form.text}
                onChange={(e) =>
                  setForm((p) => ({ ...p, text: e.target.value }))
                }
                className="mt-1 min-h-[110px]"
                placeholder="Şile Mezar Yapım İşleri / ..."
              />
            </div>

            {/* Görseller */}
            <div>
              <Label>Görseller</Label>

              {/* Dropzone benzeri alan */}
              <div className="mt-2">
                <input
                  id="kw-images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) =>
                    handleFiles(Array.from(e.target.files ?? []))
                  }
                />
                <label
                  htmlFor="kw-images"
                  className="block cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50/80 p-4 text-center text-sm text-gray-600 transition hover:bg-gray-50"
                >
                  Dosya seç veya görselleri bu alana bırak
                </label>
              </div>

              {!!form.images.length && (
                <div className="mt-3 rounded-lg border bg-white p-4">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Önizleme ({form.images.length})
                  </p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="group relative">
                        <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeImage(idx)}
                          className="absolute right-2 top-2 h-7 w-7 rounded-full p-0 opacity-0 transition group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky footer actions */}
            <div className="sticky bottom-0 z-10 mt-6 flex gap-2 bg-white/95 pb-1 pt-3 backdrop-blur-sm">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
              >
                İptal
              </Button>
              <Button
                type="button"
                onClick={save}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                {initialValue ? "Güncelle" : "Ekle"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
