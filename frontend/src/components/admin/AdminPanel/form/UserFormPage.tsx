// ======================================================================
// FILE: src/components/admin/AdminPanel/.../UserFormPage.tsx
// ======================================================================
"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  useAdminGetQuery,
  useAdminUpdateUserMutation,
  useAdminSetActiveMutation,
  useAdminSetRolesMutation,
  useAdminSetPasswordMutation,
  useAdminRemoveUserMutation,
  type AdminUpdateUserBody,
} from "@/integrations/rtk/endpoints/admin/auth_admin.endpoints";
import type { UserRoleName } from "@/integrations/rtk/types/users";

type Role = "admin" | "moderator" | "user";
const ALL_ROLES: Role[] = ["admin", "moderator", "user"];

export default function UserFormPage() {
  const navigate = useNavigate();
  const params = useParams();

  const paramId =
    (params as Record<string, string | undefined>)["id"] ??
    (params as Record<string, string | undefined>)["*"] ??
    "";
  const isNew = paramId === "new";
  const id = isNew ? "" : paramId;

  // RTK hooks (YENİ admin endpoints)
  const {
    data: u,
    isFetching,
    refetch: refetchUser,
  } = useAdminGetQuery(
    { id },
    {
      skip: isNew || !id,
    },
  );

  const [updateUser, { isLoading: updating }] =
    useAdminUpdateUserMutation();
  const [setActive, { isLoading: toggling }] =
    useAdminSetActiveMutation();
  const [setRoles, { isLoading: savingRoles }] =
    useAdminSetRolesMutation();
  const [setPassword, { isLoading: settingPassword }] =
    useAdminSetPasswordMutation();
  const [deleteUser, { isLoading: deleting }] =
    useAdminRemoveUserMutation();

  // Local state
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState<string | null>(null);
  const [phone, setPhone] = React.useState<string | null>(null);
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [roles, setRolesState] = React.useState<Role[]>(["user"]);

  const [password, setPasswordValue] = React.useState("");
  const [password2, setPassword2Value] = React.useState("");

  React.useEffect(() => {
    if (u && !isNew) {
      // u tipini çok kasmadan, gelen alanları güvenli biçimde normalize et
      const raw: any = u;
      setEmail((raw.email as string) ?? "");
      setFullName((raw.full_name as string | null) ?? null);
      setPhone((raw.phone as string | null) ?? null);

      const isActiveRaw = raw.is_active;
      const nextActive =
        typeof isActiveRaw === "boolean"
          ? isActiveRaw
          : Number(isActiveRaw ?? 1) === 1;
      setIsActive(nextActive);

      setRolesState((raw.roles as Role[]) ?? ["user"]);
    } else if (isNew) {
      setEmail("");
      setFullName(null);
      setPhone(null);
      setIsActive(true);
      setRolesState(["user"]);
      setPasswordValue("");
      setPassword2Value("");
    }
  }, [u, isNew]);

  const toggleRole = (r: Role) => {
    setRolesState((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );
  };

  /* -------------------- EXISTING USER SAVE -------------------- */

  const onSaveExisting = async () => {
    if (!id) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Email zorunludur.");
      return;
    }

    try {
      // Yeni tip: AdminUpdateUserBody (id + patch alanları)
      const body: AdminUpdateUserBody = {
        id,
        email: trimmedEmail,
        is_active: isActive,
      };

      if (fullName && fullName.trim()) {
        body.full_name = fullName.trim();
      }
      if (phone && phone.trim()) {
        body.phone = phone.trim();
      }

      await updateUser(body).unwrap();

      await setRoles({
        id,
        roles: roles as UserRoleName[],
      }).unwrap();

      await refetchUser();

      toast.success("Kullanıcı güncellendi");
      navigate("/admin/users");
    } catch (err: any) {
      console.error(err);
      toast.error("Kullanıcı güncellenemedi");
    }
  };

  /* -------------------- NEW USER CREATE (backend'de henüz yok) -------------------- */

  const onCreateNew = () => {
    // Şu an için backend'de POST /admin/users olmadığı için
    // sadece uyarı veriyoruz.
    toast.error(
      "Yeni kullanıcı oluşturma endpoint'i (POST /admin/users) backend'de tanımlı değil. Şu an sadece mevcut kullanıcıları düzenleyebilirsiniz.",
    );
  };

  /* -------------------- ACTIVE TOGGLE -------------------- */

  const onToggleActive = async (next: boolean) => {
    if (!id) {
      // yeni user formunda sadece local state'i güncelle
      setIsActive(next);
      return;
    }
    try {
      setIsActive(next);
      await setActive({ id, is_active: next }).unwrap();
      toast.success(
        next
          ? "Kullanıcı aktifleştirildi"
          : "Kullanıcı pasifleştirildi",
      );
    } catch (err: any) {
      console.error(err);
      setIsActive(!next); // revert
      toast.error("Durum güncellenemedi");
    }
  };

  /* -------------------- PASSWORD SET (EXISTING) -------------------- */

  const onSetPassword = async () => {
    if (!id) return;

    if (password.length < 8) {
      toast.error("Şifre en az 8 karakter olmalıdır.");
      return;
    }
    if (password !== password2) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }

    try {
      await setPassword({ id, password }).unwrap();
      toast.success("Şifre güncellendi");
      setPasswordValue("");
      setPassword2Value("");
    } catch (err: any) {
      console.error(err);
      toast.error("Şifre güncellenemedi");
    }
  };

  /* -------------------- DELETE -------------------- */

  const onDelete = async () => {
    if (!id) return;
    if (!window.confirm("Bu kullanıcı silinsin mi?")) return;

    try {
      await deleteUser({ id }).unwrap();
      toast.success("Kullanıcı silindi");
      navigate("/admin/users");
    } catch (err: any) {
      console.error(err);
      toast.error("Silme işlemi başarısız");
    }
  };

  /* -------------------- RENDER -------------------- */

  const busy =
    isFetching ||
    updating ||
    toggling ||
    savingRoles ||
    settingPassword ||
    deleting;

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="border-b border-gray-200 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">
            {isNew ? "Yeni Kullanıcı" : "Kullanıcı Düzenle"}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/users")}
            >
              Listeye Dön
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 p-4 sm:p-6">
        {/* Email */}
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            disabled={busy}
          />
        </div>

        {/* Ad Soyad */}
        <div className="grid gap-2">
          <Label>Ad Soyad</Label>
          <Input
            value={fullName ?? ""}
            onChange={(e) =>
              setFullName(e.target.value ? e.target.value : null)
            }
            placeholder="Ad Soyad"
            disabled={busy}
          />
        </div>

        {/* Telefon */}
        <div className="grid gap-2">
          <Label>Telefon</Label>
          <Input
            value={phone ?? ""}
            onChange={(e) =>
              setPhone(e.target.value ? e.target.value : null)
            }
            placeholder="+90..."
            disabled={busy}
          />
        </div>

        {/* Aktiflik */}
        <div className="flex items-center gap-3">
          <Switch
            checked={isActive}
            onCheckedChange={(value) => onToggleActive(value)}
            disabled={busy}
          />
          <span>{isNew ? "Aktif olarak oluştur" : "Aktif"}</span>
        </div>

        {/* Roller */}
        <div className="grid gap-2">
          <Label>Roller</Label>
          <div className="flex flex-wrap gap-4">
            {ALL_ROLES.map((r) => (
              <label key={r} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={roles.includes(r)}
                  onChange={() => toggleRole(r)}
                  disabled={busy}
                />
                <span className="capitalize">{r}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Şifre alanları (hem yeni, hem mevcut için ortak state) */}
        <div className="grid gap-2">
          <Label>{isNew ? "Şifre" : "Yeni Şifre"}</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPasswordValue(e.target.value)}
            placeholder="********"
            disabled={busy}
          />
        </div>

        <div className="grid gap-2">
          <Label>Şifre (Tekrar)</Label>
          <Input
            type="password"
            value={password2}
            onChange={(e) => setPassword2Value(e.target.value)}
            placeholder="********"
            disabled={busy}
          />
        </div>

        {/* Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {isNew ? (
            <Button onClick={onCreateNew} disabled={busy}>
              Kullanıcı Oluştur
            </Button>
          ) : (
            <>
              <Button onClick={onSaveExisting} disabled={busy}>
                Bilgileri Kaydet
              </Button>
              <Button
                variant="outline"
                onClick={onSetPassword}
                disabled={busy || !password || !password2}
              >
                Şifreyi Güncelle
              </Button>
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={busy}
              >
                Kullanıcıyı Sil
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
