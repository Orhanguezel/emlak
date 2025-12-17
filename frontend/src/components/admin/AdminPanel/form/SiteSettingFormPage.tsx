// =============================================================
// FILE: src/components/admin/AdminPanel/form/SiteSettingFormPage.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  useGetSiteSettingAdminByKeyQuery,
  useCreateSiteSettingAdminMutation,
  useUpdateSiteSettingAdminMutation,
} from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import { toast } from "sonner";

function tryParseValue(s: string): any {
  const t = s.trim();
  if (!t.length) return "";
  if (
    (t.startsWith("{") && t.endsWith("}")) ||
    (t.startsWith("[") && t.endsWith("]"))
  ) {
    try {
      return JSON.parse(t);
    } catch {
      /* ignore */
    }
  }
  if (t === "true") return true;
  if (t === "false") return false;
  const num = Number(t);
  if (!Number.isNaN(num) && t !== "") return num;
  return t;
}
function toDisplay(v: unknown): string {
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

// SMTP ile ilgili ayar key'leri
const SMTP_KEYS = [
  "smtp_host",
  "smtp_port",
  "smtp_username",
  "smtp_password",
  "smtp_from_email",
  "smtp_from_name",
  "smtp_ssl",
] as const;

export default function SiteSettingFormPage() {
  const params = useParams<{ "*": string }>(); // react-router v6 wildcard
  // Destek: /admin/site_settings/:key veya /admin/site-settings/:key veya /admin/site-settings/smtp
  const path = (params?.["*"] || "").replace(/^site[_-]settings\//, "");
  const isNew = path === "new" || !path;
  const keyFromPath = !isNew ? decodeURIComponent(path) : "";

  const isSmtpGroup = keyFromPath === "smtp";

  const navigate = useNavigate();

  // Tekil ayar (generic mod)
  const {
    data: existing,
    isFetching,
  } = useGetSiteSettingAdminByKeyQuery(keyFromPath, {
    skip: isNew || !keyFromPath || isSmtpGroup, // smtp grup ekranında tekil sorgu gereksiz
  });

  const [createSetting, { isLoading: creating }] =
    useCreateSiteSettingAdminMutation();
  const [updateSetting, { isLoading: updating }] =
    useUpdateSiteSettingAdminMutation();

  const [key, setKey] = React.useState<string>(keyFromPath || "");
  const [valueStr, setValueStr] = React.useState<string>("");

  // SMTP group state
  const [smtpHost, setSmtpHost] = React.useState("");
  const [smtpPort, setSmtpPort] = React.useState("");
  const [smtpUsername, setSmtpUsername] = React.useState("");
  const [smtpPassword, setSmtpPassword] = React.useState("");
  const [smtpFromEmail, setSmtpFromEmail] = React.useState("");
  const [smtpFromName, setSmtpFromName] = React.useState("");
  const [smtpSsl, setSmtpSsl] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // SMTP için tek tek mevcut değerleri çek (sadece smtp ekranında aktif)
  const smtpHostQuery = useGetSiteSettingAdminByKeyQuery("smtp_host", {
    skip: !isSmtpGroup,
  });
  const smtpPortQuery = useGetSiteSettingAdminByKeyQuery("smtp_port", {
    skip: !isSmtpGroup,
  });
  const smtpUsernameQuery = useGetSiteSettingAdminByKeyQuery("smtp_username", {
    skip: !isSmtpGroup,
  });
  const smtpPasswordQuery = useGetSiteSettingAdminByKeyQuery("smtp_password", {
    skip: !isSmtpGroup,
  });
  const smtpFromEmailQuery = useGetSiteSettingAdminByKeyQuery(
    "smtp_from_email",
    { skip: !isSmtpGroup },
  );
  const smtpFromNameQuery = useGetSiteSettingAdminByKeyQuery(
    "smtp_from_name",
    { skip: !isSmtpGroup },
  );
  const smtpSslQuery = useGetSiteSettingAdminByKeyQuery("smtp_ssl", {
    skip: !isSmtpGroup,
  });

  const isSmtpLoading =
    smtpHostQuery.isFetching ||
    smtpPortQuery.isFetching ||
    smtpUsernameQuery.isFetching ||
    smtpPasswordQuery.isFetching ||
    smtpFromEmailQuery.isFetching ||
    smtpFromNameQuery.isFetching ||
    smtpSslQuery.isFetching;

  // Tekil ayar geldiğinde formu doldur
  React.useEffect(() => {
    if (existing && !isNew && !isSmtpGroup) {
      setKey(existing.key);
      setValueStr(toDisplay(existing.value));
    }
  }, [existing, isNew, isSmtpGroup]);

  // SMTP ayarları geldiğinde formu doldur
  React.useEffect(() => {
    if (!isSmtpGroup) return;

    if (smtpHostQuery.data) {
      setSmtpHost(toDisplay(smtpHostQuery.data.value));
    }
    if (smtpPortQuery.data) {
      setSmtpPort(toDisplay(smtpPortQuery.data.value));
    }
    if (smtpUsernameQuery.data) {
      setSmtpUsername(toDisplay(smtpUsernameQuery.data.value));
    }
    if (smtpPasswordQuery.data) {
      setSmtpPassword(toDisplay(smtpPasswordQuery.data.value));
    }
    if (smtpFromEmailQuery.data) {
      setSmtpFromEmail(toDisplay(smtpFromEmailQuery.data.value));
    }
    if (smtpFromNameQuery.data) {
      setSmtpFromName(toDisplay(smtpFromNameQuery.data.value));
    }
    if (smtpSslQuery.data) {
      const raw = toDisplay(smtpSslQuery.data.value).trim().toLowerCase();
      setSmtpSsl(
        raw === "1" || raw === "true" || raw === "yes" || raw === "on",
      );
    }
  }, [
    isSmtpGroup,
    smtpHostQuery.data,
    smtpPortQuery.data,
    smtpUsernameQuery.data,
    smtpPasswordQuery.data,
    smtpFromEmailQuery.data,
    smtpFromNameQuery.data,
    smtpSslQuery.data,
  ]);

  const onSave = async () => {
    // SMTP toplu kayıt modu
    if (isSmtpGroup) {
      try {
        const ops: Promise<unknown>[] = [];

        const enqueue = (
          k: (typeof SMTP_KEYS)[number],
          val: string,
          existingRow: any | undefined,
        ) => {
          // boş değerleri yine de kaydediyoruz ("" olarak)
          const value = val.trim();
          if (existingRow) {
            ops.push(updateSetting({ key: k, value }).unwrap());
          } else {
            ops.push(createSetting({ key: k, value }).unwrap());
          }
        };

        enqueue("smtp_host", smtpHost, smtpHostQuery.data);
        enqueue("smtp_port", smtpPort, smtpPortQuery.data);
        enqueue("smtp_username", smtpUsername, smtpUsernameQuery.data);
        enqueue("smtp_password", smtpPassword, smtpPasswordQuery.data);
        enqueue("smtp_from_email", smtpFromEmail, smtpFromEmailQuery.data);
        enqueue("smtp_from_name", smtpFromName, smtpFromNameQuery.data);
        enqueue(
          "smtp_ssl",
          smtpSsl ? "true" : "false",
          smtpSslQuery.data,
        );

        await Promise.all(ops);

        toast.success("SMTP ayarları güncellendi");
        navigate("/admin/site-settings");
      } catch (e) {
        toast.error("SMTP ayarları kaydedilemedi");
      }
      return;
    }

    // Eski: tekil key/value modu
    const parsed = tryParseValue(valueStr);
    try {
      if (isNew) {
        const k = key.trim();
        if (!k) {
          toast.error("Key zorunludur");
          return;
        }
        await createSetting({ key: k, value: parsed }).unwrap();
        toast.success("Ayar oluşturuldu");
        navigate("/admin/site-settings");
      } else {
        await updateSetting({ key, value: parsed }).unwrap();
        toast.success("Ayar güncellendi");
        navigate("/admin/site-settings");
      }
    } catch (e) {
      toast.error("Kayıt başarısız");
    }
  };

  const title = isSmtpGroup
    ? "E-posta / SMTP Ayarları"
    : isNew
      ? "Yeni Ayar"
      : `Ayar: ${keyFromPath}`;

  const isSaving = creating || updating || isFetching || isSmtpLoading;

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="border-b border-gray-200 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/site-settings")}
            >
              Geri
            </Button>
            <Button onClick={onSave} disabled={isSaving}>
              Kaydet
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {isSmtpGroup ? (
          <div className="space-y-4">
            <p className="text-xs text-gray-600">
              Bu sekmeden tüm <strong>SMTP / e-posta</strong> ayarlarını birlikte
              yönetebilirsin. Host, port, kullanıcı adı, şifre ve gönderen bilgileri.
            </p>

            <Tabs defaultValue="smtp" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="smtp">SMTP / E-posta</TabsTrigger>
              </TabsList>
              <TabsContent value="smtp">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      SMTP Host
                    </label>
                    <Input
                      placeholder="smtp.hostinger.com / smtp.gmail.com"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      SMTP Port
                    </label>
                    <Input
                      placeholder="465 veya 587"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      SMTP Kullanıcı Adı
                    </label>
                    <Input
                      placeholder="info@xemlak.com"
                      value={smtpUsername}
                      onChange={(e) => setSmtpUsername(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      SMTP Şifre
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? "Gizle" : "Göster"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Gönderen E-posta (From)
                    </label>
                    <Input
                      placeholder="info@xemlak.com"
                      value={smtpFromEmail}
                      onChange={(e) => setSmtpFromEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Gönderen İsim
                    </label>
                    <Input
                      placeholder="Xemlak.com"
                      value={smtpFromName}
                      onChange={(e) => setSmtpFromName(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3 md:col-span-2">
                    <Switch
                      checked={smtpSsl}
                      onCheckedChange={(v) => setSmtpSsl(v)}
                    />
                    <div className="text-xs text-gray-700">
                      <div className="font-medium">SSL (secure) bağlantı</div>
                      <div className="text-[11px] text-gray-500">
                        Genelde <strong>465</strong> portu için{" "}
                        <code>secure: true</code> seçilir. 587 kullanıyorsan,
                        çoğu sağlayıcı STARTTLS ister.
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-600">Key</label>
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={!isNew}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-600">
                Value (string/number/boolean/json)
              </label>
              <Textarea
                rows={12}
                value={valueStr}
                onChange={(e) => setValueStr(e.target.value)}
                placeholder={`"Merhaba"\n123\ntrue\n{"a":1}\n["a","b"]`}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
