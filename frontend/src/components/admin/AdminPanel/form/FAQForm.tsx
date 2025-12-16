"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  useGetFaqAdminQuery,
  useCreateFaqAdminMutation,
  useUpdateFaqAdminMutation,
} from "@/integrations/rtk/endpoints/admin/faqs_admin.endpoints";
import type { UpsertFaqInput } from "@/integrations/rtk/endpoints/admin/faqs_admin.endpoints";

// replaceAll kullanmadan TR uyumlu slugify
function slugifyTR(src: string) {
  const s = (src ?? "").toLowerCase();
  return s
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function FAQForm() {
  const navigate = useNavigate();
  const params = useParams(); // /admin/faqs/:id | /admin/faqs/new
  const guessed = (typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "") || "new";
  const id = (params["id"] as string) || (params["*"] as string) || guessed;
  const isNew = id === "new";

  // edit ise veriyi getir
  const { data: existing, isFetching } = useGetFaqAdminQuery(id!, { skip: isNew });

  const [createFaq, { isLoading: creating }] = useCreateFaqAdminMutation();
  const [updateFaq, { isLoading: updating }] = useUpdateFaqAdminMutation();

  // form state
  const [question, setQuestion] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [category, setCategory] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState(true);
  const [displayOrder, setDisplayOrder] = React.useState<number>(0);

  React.useEffect(() => {
    if (!isNew && existing) {
      setQuestion(existing.question ?? "");
      setSlug(existing.slug ?? "");
      setAnswer(existing.answer ?? "");
      setCategory(existing.category ?? "");
      setIsActive(!!existing.is_active);
      setDisplayOrder(existing.display_order ?? 0);
    }
  }, [isNew, existing]);

  // Ctrl/Cmd + S → kaydet
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mac = navigator.userAgent.includes("Mac");
      if ((mac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        const btn = document.getElementById("faq-save-btn") as HTMLButtonElement | null;
        btn?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleAutoSlug = () => setSlug(slugifyTR(question));

  const slugValid = SLUG_RE.test(slug.trim());
  const questionLeft = 500 - (question?.length ?? 0);

  const canSave =
    !!question.trim() &&
    !!slug.trim() &&
    slugValid &&
    !!answer.trim() &&
    !creating &&
    !updating;

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!canSave) {
      if (!question.trim()) toast.error("Soru gerekli");
      else if (!slug.trim()) toast.error("Slug gerekli");
      else if (!slugValid) toast.error("Slug formatı hatalı (küçük harf, rakam, tire)");
      else if (!answer.trim()) toast.error("Cevap gerekli");
      return;
    }

    const body: UpsertFaqInput = {
      question: question.trim(),
      slug: slug.trim(),
      answer,
      category: category ? category.trim() : null,
      is_active: isActive,
      display_order: Number.isFinite(displayOrder) ? displayOrder : 0,
    };

    try {
      if (isNew) {
        await createFaq(body).unwrap();
        toast.success("SSS oluşturuldu");
      } else {
        await updateFaq({ id: id!, patch: body }).unwrap();
        toast.success("SSS güncellendi");
      }
      navigate("/admin");
    } catch (err: any) {
      if (err?.data?.error?.message === "slug_already_exists") {
        toast.error("Bu slug zaten kullanılıyor");
      } else {
        toast.error("Kaydetme başarısız");
      }
    }
  };

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="border-b border-gray-200 py-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base sm:text-lg">
            {isNew ? "Yeni SSS" : "SSS Düzenle"}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              İptal
            </Button>
            {/* Site yeşili */}
            <Button
              id="faq-save-btn"
              type="submit"
              form="faq-form"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!canSave || (isFetching && !isNew)}
            >
              Kaydet
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <form id="faq-form" onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Soru */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="q">Soru</Label>
              <span className="text-xs text-gray-500">{Math.max(0, questionLeft)} / 500</span>
            </div>
            <Input
              id="q"
              value={question}
              onChange={(e) => {
                const v = e.target.value.slice(0, 500);
                setQuestion(v);
              }}
              required
            />
          </div>

          {/* Slug */}
          <div className="sm:col-span-2 flex items-end gap-2">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">Slug</Label>
                <span
                  className={["text-xs", slug ? (slugValid ? "text-emerald-600" : "text-red-600") : "text-gray-500"].join(" ")}
                >
                  {slug ? (slugValid ? "Geçerli" : "Geçersiz") : "Otomatik oluşturabilirsiniz"}
                </span>
              </div>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="kucuk-harf-rakam-tire"
                required
              />
            </div>
            <Button type="button" variant="outline" onClick={handleAutoSlug}>
              Oluştur
            </Button>
          </div>

          {/* Cevap */}
          <div className="sm:col-span-2">
            <Label htmlFor="answer">Cevap (HTML/metin)</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={8}
              required
            />
            <p className="mt-1 text-xs text-gray-500">İpucu: Basit HTML kullanabilirsiniz (&lt;p&gt;, &lt;strong&gt; vb.).</p>
          </div>

          {/* Kategori + Sıra */}
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              placeholder="Örn: Genel"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="displayOrder">Gösterim Sırası</Label>
            <Input
              id="displayOrder"
              type="number"
              inputMode="numeric"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number.parseInt(e.target.value || "0", 10))}
            />
          </div>

          {/* Aktif/Pasif */}
          <div className="sm:col-span-2 flex items-center gap-3 pt-2">
            <Switch id="active" checked={isActive} onCheckedChange={(v) => setIsActive(!!v)} />
            <Label htmlFor="active" className="mr-2">Aktif</Label>
            <span
              className={[
                "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
                isActive ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-red-50 text-red-700 ring-1 ring-red-200",
              ].join(" ")}
            >
              {isActive ? "Aktif" : "Pasif"}
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
