// =============================================================
// FILE: src/components/admin/AdminSecretAccess.tsx   (X Emlak)
// Theme: slate / bg-slate-950
// =============================================================
"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import { toast } from "sonner";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import {
  useAuthStatusQuery,
  useAuthTokenMutation,
} from "@/integrations/rtk/endpoints/auth_public.endpoints";
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

import { tokenStore } from "@/integrations/core/token";

interface AdminSecretAccessProps {
  onNavigate: (page: string) => void;
}

function safeJson<T>(v: any, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === "object") return v as T;
  if (typeof v !== "string") return fallback;

  const s = v.trim();
  if (!s) return fallback;

  try {
    return JSON.parse(s) as T;
  } catch {
    try {
      const unquoted = JSON.parse(s);
      if (typeof unquoted === "string") {
        try {
          return JSON.parse(unquoted) as T;
        } catch {
          return unquoted as unknown as T;
        }
      }
      return unquoted as unknown as T;
    } catch {
      return fallback;
    }
  }
}

function sanitizePhoneDigits(s: string): string {
  return (s || "").replace(/[^\d+]/g, "").replace(/\s+/g, "");
}

function buildTelHref(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "tel:+49000000000";
  if (trimmed.startsWith("tel:")) return trimmed;

  const cleaned = sanitizePhoneDigits(trimmed);
  if (!cleaned) return "tel:+49000000000";
  if (cleaned.startsWith("+")) return `tel:${cleaned}`;
  return `tel:+${cleaned}`;
}

export function AdminSecretAccess({ onNavigate }: AdminSecretAccessProps) {
  const { data: status, isFetching, refetch } = useAuthStatusQuery();
  const [login, { isLoading }] = useAuthTokenMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // site_settings -> value çoğunlukla JSON string (örn: '"...") geliyor
  const { data: phoneDisplaySetting } = useGetSiteSettingByKeyQuery("contact_phone_display");
  const { data: phoneTelSetting } = useGetSiteSettingByKeyQuery("contact_phone_tel");

  const contactPhoneDisplay = useMemo(() => {
    const v = phoneDisplaySetting?.value;
    return safeJson<string>(v, "+49 000 000000");
  }, [phoneDisplaySetting]);

  const contactPhoneRaw = useMemo(() => {
    const v = phoneTelSetting?.value;
    // tel için daha “düz” numara; yoksa display kullan
    return safeJson<string>(v, contactPhoneDisplay);
  }, [phoneTelSetting, contactPhoneDisplay]);

  const telHref = useMemo(() => buildTelHref(contactPhoneRaw), [contactPhoneRaw]);

  // auth ise admin'e yönlendir
  useEffect(() => {
    if (status?.authenticated && status?.is_admin) {
      toast.success("Admin doğrulandı, yönlendiriliyor…");
      onNavigate("admin");
    }
  }, [status, onNavigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("E-posta ve şifre zorunludur.");
      return;
    }

    try {
      const resp = await login({
        email: email.trim(),
        password: password.trim(),
        grant_type: "password",
      }).unwrap();

      if (resp?.access_token) {
        tokenStore.set(resp.access_token);
        localStorage.setItem("mh_access_token", resp.access_token);
      }

      localStorage.removeItem("mh_refresh_token");
      await refetch();
    } catch (err: any) {
      console.error("LOGIN ERROR >>>", err);
      const msg =
        err?.data?.message ||
        err?.data?.error?.message ||
        err?.data?.error ||
        err?.error ||
        "Giriş başarısız. Bilgileri kontrol edin.";
      toast.error(msg);
    }
  }

  const busy = isLoading || isFetching;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center border border-white/10">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <CardTitle className="text-2xl text-slate-950">Admin Giriş</CardTitle>
          <p className="text-slate-600 text-sm">Yetkili kullanıcılar için giriş ekranı</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-800">
                E-posta
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@xemlak.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                disabled={busy}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-800">
                Şifre
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="current-password"
                  disabled={busy}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword((s) => !s)}
                  disabled={busy}
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <Button
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-900 text-white rounded-xl"
                disabled={busy}
              >
                {busy ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                    Giriş Yapılıyor…
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Admin Paneline Giriş
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl border-slate-300 text-slate-900 hover:bg-slate-50"
                onClick={() => onNavigate("home")}
                disabled={busy}
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </form>

          {/* Security notice */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Shield className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Güvenlik Uyarısı</h4>
                <p className="text-sm text-slate-700 mt-1">
                  Bu sayfa yalnızca yetkili personel içindir. Giriş bilgileriniz sunucuda doğrulanır.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Şifremi unuttum? İletişim:
              <a href={telHref} className="text-slate-900 hover:underline ml-1 font-semibold">
                {contactPhoneDisplay}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
