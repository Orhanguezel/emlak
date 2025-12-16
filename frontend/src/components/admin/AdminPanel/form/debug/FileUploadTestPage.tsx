// =============================================================
// FILE: src/components/admin/AdminPanel/debug/FileUploadTestPage.tsx
// =============================================================
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export default function FileUploadTestPage() {
  const [info, setInfo] = React.useState<string>("Henüz dosya seçilmedi.");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];

    console.log("[FileUploadTest] input change", {
      hasFile: !!f,
      name: f?.name,
      size: f?.size,
      type: f?.type,
    });

    if (!f) {
      setInfo("Dosya seçilmedi.");
      return;
    }

    setInfo(
      `Seçilen: ${f.name} (${f.type || "bilinmeyen tür"}, ${f.size} bayt)`
    );
  };

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    console.log("[FileUploadTest] openPicker");
    inputRef.current?.click();
  };

  // input görünür olsun, hiçbir tailwind/hidden yok:
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Basit File Input Testi</h1>

      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        // tamamen düz, gizleme yok:
        style={{ display: "block", marginBottom: "1rem" }}
      />

      <Button type="button" onClick={openPicker} className="gap-2">
        Dosya Seç (programatik click)
      </Button>

      <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">{info}</p>
    </div>
  );
}
