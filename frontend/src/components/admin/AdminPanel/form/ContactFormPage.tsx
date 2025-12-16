// src/components/admin/AdminPanel/form/ContactFormPage.tsx
"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  useGetContactAdminQuery,
  useUpdateContactAdminMutation,
  useRemoveContactAdminMutation,
} from "@/integrations/rtk/endpoints/admin/contacts_admin.endpoints";
import type { ContactUpdateInput, ContactStatus } from "@/integrations/rtk/types/contacts";

export default function ContactFormPage() {
  // ✅ Route tam olarak: /admin/contacts/:id
  const { id } = useParams<{ id?: string }>();
  const isNew = id === "new" || !id; // ileride "yeni" form istersek diye

  const navigate = useNavigate();

  // id yoksa fetch etme
  const { data: row, isFetching, error } = useGetContactAdminQuery(id!, { skip: isNew });
  const [updateContact, { isLoading: saving }] = useUpdateContactAdminMutation();
  const [removeContact, { isLoading: removing }] = useRemoveContactAdminMutation();

  const [status, setStatus] = React.useState<ContactStatus>("new");
  const [resolved, setResolved] = React.useState(false);
  const [adminNote, setAdminNote] = React.useState("");

  React.useEffect(() => {
    if (!row) return;
    setStatus(row.status);
    setResolved(!!row.is_resolved);
    setAdminNote(row.admin_note ?? "");
  }, [row]);

  const onSave = async () => {
    if (!id) return;
    const patch: ContactUpdateInput = {
      status,
      is_resolved: resolved,
      admin_note: adminNote || null,
    };
    try {
      await updateContact({ id, patch }).unwrap();
      toast.success("Güncellendi.");
    } catch {
      toast.error("Güncelleme sırasında hata oluştu.");
    }
  };

  const onDelete = async () => {
    if (!id) return;
    if (!confirm("Bu mesajı silmek istiyor musunuz?")) return;
    try {
      await removeContact(id).unwrap();
      toast.success("Kayıt silindi.");
      navigate("/admin/contacts");
    } catch {
      toast.error("Silme sırasında hata oluştu.");
    }
  };

  // “new” ise şimdilik listeye at
  if (isNew) {
    navigate("/admin/contacts", { replace: true });
    return null;
  }

  // 404 vb. hata görünümü (RTK Query error union’ı olabilir)
  const notFound =
    (error as any)?.status === 404 ||
    ((error as any)?.data && (error as any)?.data?.error === "NOT_FOUND");

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="border-b border-gray-200 py-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">İletişim Mesajı Detayı</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate("/admin/contacts")}>Geri</Button>
            <Button variant="destructive" onClick={onDelete} disabled={removing}>Sil</Button>
            <Button onClick={onSave} disabled={saving}>Kaydet</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {isFetching && <div className="text-sm text-gray-500">Yükleniyor…</div>}

        {notFound && (
          <div className="text-sm text-red-600">Kayıt bulunamadı.</div>
        )}

        {row && !notFound && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* SOL: Kullanıcı bilgileri (readonly) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <Label className="mb-1 block text-sm text-gray-700">Ad Soyad</Label>
                <Input value={row.name} readOnly />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1 block text-sm text-gray-700">E-posta</Label>
                  <Input value={row.email} readOnly />
                </div>
                <div>
                  <Label className="mb-1 block text-sm text-gray-700">Telefon</Label>
                  <Input value={row.phone} readOnly />
                </div>
              </div>
              <div>
                <Label className="mb-1 block text-sm text-gray-700">Konu</Label>
                <Input value={row.subject} readOnly />
              </div>
              <div>
                <Label className="mb-1 block text-sm text-gray-700">Mesaj</Label>
                <Textarea value={row.message} readOnly className="min-h-40" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1 block text-sm text-gray-700">IP</Label>
                  <Input value={row.ip ?? ""} readOnly />
                </div>
                <div>
                  <Label className="mb-1 block text-sm text-gray-700">User Agent</Label>
                  <Input value={row.user_agent ?? ""} readOnly />
                </div>
              </div>
            </div>

            {/* SAĞ: Yönetim alanı */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <Label className="mb-1 block text-sm text-gray-700">Durum</Label>
                <select
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContactStatus)}
                >
                  <option value="new">Yeni</option>
                  <option value="in_progress">İşlemde</option>
                  <option value="closed">Kapalı</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={resolved} onCheckedChange={(v) => setResolved(!!v)} />
                <span className="text-sm text-gray-700">Çözüldü olarak işaretle</span>
              </div>

              <div>
                <Label className="mb-1 block text-sm text-gray-700">Yönetici Notu</Label>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="İç iletişim notu..."
                  className="min-h-28"
                />
              </div>

              <div className="text-xs text-gray-500">
                Oluşturma: {new Date(row.created_at).toLocaleString()} <br />
                Güncelleme: {new Date(row.updated_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
