// =============================================================
// FILE: src/components/admin/AdminPanel/form/SettingFormPage.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Download, UploadCloud } from "lucide-react";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";
import { toast } from "sonner";

import {
  useExportSqlMutation,
  useImportSqlFileMutation,
} from "@/integrations/rtk/endpoints/admin/db_admin.endpoints";

export default function SettingFormPage() {
  const navigate = useNavigate();

  const onBack = (): void => {
    if (window.history.length) {
      window.history.back();
    } else {
      // Artık user ile ilgisi yok; ayarlar sekmesine dönelim
      navigate("/admin/settings");
    }
  };

  // === DB Backup / Restore ===
  const importInputRef = React.useRef<HTMLInputElement | null>(null);

  const [exportSql, { isLoading: exporting }] = useExportSqlMutation();
  const [importSqlFile, { isLoading: importing }] = useImportSqlFileMutation();

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    const ts = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const stamp = `${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(
      ts.getDate()
    )}_${pad(ts.getHours())}${pad(ts.getMinutes())}`;
    const filename = `dump_${stamp}.sql`;

    try {
      toast.loading("SQL dışa aktarılıyor…", { id: "sql-export" });
      const blob = await exportSql().unwrap();
      downloadBlob(blob as unknown as Blob, filename);
      toast.success(`Dışa aktarıldı: ${filename}`, { id: "sql-export" });
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.data?.message ||
        err?.error ||
        "Dışa aktarma başarısız.";
      toast.error(msg, { id: "sql-export" });
    }
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = async (file?: File | null) => {
    if (!file) return;

    if (!/(\.sql|\.gz)$/i.test(file.name)) {
      toast.error("Lütfen .sql veya .gz dosyası seçin.");
      if (importInputRef.current) importInputRef.current.value = "";
      return;
    }

    const ok = window.confirm(
      `Seçilen dosya: ${file.name}\n\nBu işlem geri alınamaz. Veritabanı tamamen bu yedek ile değiştirilecek.\n\nDevam edilsin mi?`
    );
    if (!ok) {
      if (importInputRef.current) importInputRef.current.value = "";
      return;
    }

    try {
      toast.loading("SQL içe aktarılıyor…", { id: "sql-import" });

      // Tam restore: truncateBefore = true
      const res = await importSqlFile({
        file,
        truncateBefore: true,
      }).unwrap();

      toast.success(res?.message || "İçe aktarma tamamlandı.", {
        id: "sql-import",
      });
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.data?.message ||
        err?.error ||
        "İçe aktarma başarısız.";
      toast.error(msg, { id: "sql-import" });
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Database className="h-4 w-4" />
          <span>Veritabanı Yedekleme & Geri Yükleme</span>
        </div>
      </div>

      {/* VERİTABANI YEDEKLEME / GERİ YÜKLEME */}
      <Section title="Veritabanı Yedekleme & Geri Yükleme">
        {/* Açıklama */}
        <p className="mb-3 text-xs sm:text-sm text-gray-500">
          Tüm sitedeki tablo ve verileri <code>.sql</code> olarak yedekleyebilir
          veya daha önce aldığınız bir yedeği geri yükleyebilirsiniz.
        </p>

        {/* Hidden file input */}
        <input
          ref={importInputRef}
          type="file"
          accept=".sql,.gz,text/plain,application/sql,application/x-gzip"
          className="hidden"
          onChange={(e) => handleImportFile(e.target.files?.[0])}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download className="h-4 w-4" />
            {exporting ? "Dışa aktarılıyor…" : "SQL Dışa Aktar"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={handleImportClick}
            disabled={importing}
          >
            <UploadCloud className="h-4 w-4" />
            {importing ? "İçe aktarılıyor…" : "SQL İçe Aktar"}
          </Button>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Database className="h-4 w-4" />
            <span>
              Uyarı: İçe aktarma işlemi{" "}
              <b>truncateBefore = true</b> ile çalışır; mevcut veritabanı
              temizlenip yedekten tekrar oluşturulur.
            </span>
          </div>
        </div>
      </Section>
    </div>
  );
}
