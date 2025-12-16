// =============================================================
// FILE: src/components/admin/.../shared/ThumbById.tsx
// =============================================================
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useGetAssetAdminQuery } from "@/integrations/rtk/endpoints/admin/storage_admin.endpoints";

type ThumbByIdProps = {
  id: string;
  onRemove?: () => void;
  isCover?: boolean;
};

export function ThumbById({ id, onRemove, isCover }: ThumbByIdProps) {
  const { data } = useGetAssetAdminQuery({ id }, { skip: !id });

  // API { item }, { data }, veya direkt obje dönebilir
  const asset = (data as any)?.item ?? (data as any)?.data ?? (data as any) ?? null;

  const url: string =
    asset?.url ||
    asset?.secure_url ||
    asset?.cdn_url ||
    "";

  if (!url) {
    return (
      <div className="group relative flex h-24 w-24 items-center justify-center rounded border bg-gray-100 text-[10px] text-gray-500">
        (görsel yok)
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute bottom-1 right-1 rounded bg-red-600 px-1.5 py-0.5 text-[9px] text-white"
          >
            Sil
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="group relative">
      <img src={url} className="h-24 w-24 rounded border object-cover" alt="" />
      <div className="absolute inset-0 hidden items-center justify-center gap-1 rounded bg-black/40 p-1 group-hover:flex">
        {onRemove && (
          <Button
            size="sm"
            variant="destructive"
            onClick={onRemove}
            className="h-7 px-2"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Sil
          </Button>
        )}
      </div>
      {isCover && (
        <div className="absolute left-1 top-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          Kapak
        </div>
      )}
    </div>
  );
}
