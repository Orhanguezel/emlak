import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import type { KeywordItem } from "../types";
import { KeywordDialog } from "../Dialogs/KeywordDialog";

type Props = { keywords: KeywordItem[]; setKeywords: (arr: KeywordItem[]) => void };

export const TabsKeywords: React.FC<Props> = ({ keywords, setKeywords }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<KeywordItem | null>(null);

  return (
    <>
      <div className="flex justify-end mb-3">
        <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Yeni Anahtar Kelime
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 items-center gap-4 px-4 py-3 bg-muted/50 border-b border-border text-[12px] uppercase tracking-wide text-muted-foreground">
          <div className="col-span-6">Anahtar Kelime</div>
          <div className="hidden sm:block sm:col-span-3">Görsel</div>
          <div className="hidden sm:block sm:col-span-2">Durum</div>
          <div className="col-span-6 sm:col-span-1 justify-self-end">İşlemler</div>
        </div>

        <div className="divide-y">
          {keywords.map((k) => (
            <div key={k.id} className="grid grid-cols-12 items-center gap-4 px-4 py-3 hover:bg-muted/30">
              <div className="col-span-12 sm:col-span-6">
                <p className="text-sm">{k.text}</p>
              </div>

              <div className="hidden sm:flex sm:col-span-3 items-center gap-2">
                {k.images?.length ? (
                  <>
                    <div className="flex -space-x-2">
                      {k.images.slice(0, 3).map((img, idx) => (
                        <div key={idx} className="size-8 rounded-full border-2 border-card overflow-hidden bg-muted">
                          <img src={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {k.images.length > 3 && (
                        <div className="size-8 rounded-full border-2 border-card bg-foreground/60 text-background text-[10px] flex items-center justify-center">
                          +{k.images.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-foreground/70">{k.images.length} görsel</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Yok</span>
                )}
              </div>

              <div className="hidden sm:flex sm:col-span-2">
                <Badge variant={k.status === "Active" ? "default" : "secondary"}>
                  <span className={`mr-2 inline-block size-2 rounded-full ${k.status === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
                  {k.status === "Active" ? "Aktif" : "Pasif"}
                </Badge>
              </div>

              <div className="col-span-12 sm:col-span-1 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(k); setOpen(true); }}>
                  <Edit className="w-4 h-4 mr-1" /> Düzenle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setKeywords(keywords.filter(x => x.id !== k.id)); toast.success("Silindi"); }}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Sil
                </Button>
              </div>
            </div>
          ))}

          {keywords.length === 0 && (
            <div className="px-4 py-6 text-sm text-muted-foreground">Kayıt bulunamadı.</div>
          )}
        </div>
      </div>

      <KeywordDialog
        open={open}
        initialValue={editing}
        onOpenChange={setOpen}
        onSave={(payload) => {
          if (editing) {
            setKeywords(keywords.map(x => (x.id === editing.id ? { ...editing, ...payload } : x)));
            toast.success("Güncellendi");
          } else {
            setKeywords([...keywords, { id: Date.now(), ...payload }]);
            toast.success("Eklendi");
          }
        }}
      />
    </>
  );
};
