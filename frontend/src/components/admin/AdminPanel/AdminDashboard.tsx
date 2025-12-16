// =============================================================
// FILE: src/components/admin/AdminPanel/AdminDashboard.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight, Users, Box, Layers3, Grid2X2, Sparkles,
  FileText, MessageSquare, Images, Tag, Megaphone, Bell, Star
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ===================== DATA HOOKS ===================== */
// Products + cats (bu dosyada toplu tanımlı)
import {
  useAdminListProductsQuery,
  useAdminListCategoriesQuery,
  useAdminListSubcategoriesQuery,
} from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";

// Users
import { useAdminListQuery } from "@/integrations/rtk/endpoints/admin/auth_admin.endpoints";

// Pages
import { useListCustomPagesAdminQuery } from "@/integrations/rtk/endpoints/admin/custom_pages_admin.endpoints";

// Services
import { useListServicesAdminQuery } from "@/integrations/rtk/endpoints/admin/services_admin.endpoints";

// Contacts
import { useListContactsAdminQuery } from "@/integrations/rtk/endpoints/admin/contacts_admin.endpoints";

// Sliders
import { useAdminListSlidesQuery } from "@/integrations/rtk/endpoints/admin/sliders_admin.endpoints";

// Accessories
import { useAdminListAccessoriesQuery } from "@/integrations/rtk/endpoints/admin/accessories_admin.endpoints";

// Campaigns
import { useListCampaignsAdminQuery } from "@/integrations/rtk/endpoints/admin/campaigns_admin.endpoints";

// Announcements
import { useListAnnouncementsAdminQuery } from "@/integrations/rtk/endpoints/admin/announcements_admin.endpoints";

// Reviews (ürün yorumları)
import { useListReviewsAdminQuery } from "@/integrations/rtk/endpoints/admin/reviews_admin.endpoints";

/* ====================================================== */

export default function AdminDashboard() {
  const navigate = useNavigate();
  const qopts = { refetchOnFocus: true, refetchOnReconnect: true as const };

  // küçük yardımcı: dizi / {items} / {data} için güvenli uzunluk
  const len = (v: any): number =>
    Array.isArray(v) ? v.length : Array.isArray(v?.items) ? v.items.length : Array.isArray(v?.data) ? v.data.length : 0;

  /* ----- SAYILAR ----- */
  const { data: productsAll } = useAdminListProductsQuery({ limit: 1000 }, qopts);
  const { data: categories } = useAdminListCategoriesQuery(undefined, qopts);
  const { data: subcategories } = useAdminListSubcategoriesQuery(undefined, qopts);
  const { data: usersAll } = useAdminListQuery({ limit: 200 }, qopts);
  const { data: pagesAll } = useListCustomPagesAdminQuery({ limit: 200 }, qopts);
  const { data: servicesAll } = useListServicesAdminQuery({ limit: 200 }, qopts);
  const { data: contactsAll } = useListContactsAdminQuery({ limit: 200 }, qopts);
  const { data: slidersAll } = useAdminListSlidesQuery({ limit: 200 }, qopts);
  const { data: accessoriesAll } = useAdminListAccessoriesQuery({ limit: 200 }, qopts);
  const { data: campaignsAll } = useListCampaignsAdminQuery({ limit: 200 }, qopts);
  const { data: announcementsAll } = useListAnnouncementsAdminQuery({ limit: 200 }, qopts);
  const { data: reviewsAll } = useListReviewsAdminQuery({ limit: 200 }, qopts);

  /* ----- SON KAYITLAR (tablolar) ----- */
  const { data: latestProducts } = useAdminListProductsQuery(
    { limit: 8, sort: "created_at", order: "desc" },
    qopts
  );

  const { data: latestUsers } = useAdminListQuery(
    { limit: 8, sort: "created_at", order: "desc" },
    qopts
  );

  const stats: Array<{ label: string; value: number | string; icon: LucideIcon; onClick: () => void }> = [
    { label: "Ürünler", value: len(productsAll), icon: Box, onClick: () => navigate("/admin/products") },
    { label: "Kategoriler", value: len(categories), icon: Grid2X2, onClick: () => navigate("/admin/categories") },
    { label: "Alt Kategoriler", value: len(subcategories), icon: Layers3, onClick: () => navigate("/admin/subcategories") },
    { label: "Kullanıcılar", value: len(usersAll), icon: Users, onClick: () => navigate("/admin/users") },
    { label: "Sayfalar", value: len(pagesAll), icon: FileText, onClick: () => navigate("/admin/pages") },
    { label: "Hizmetler", value: len(servicesAll), icon: Sparkles, onClick: () => navigate("/admin/services") },
    { label: "İletişim", value: len(contactsAll), icon: MessageSquare, onClick: () => navigate("/admin/contacts") },
    { label: "Slider", value: len(slidersAll), icon: Images, onClick: () => navigate("/admin/sliders") },
    { label: "Aksesuarlar", value: len(accessoriesAll), icon: Tag, onClick: () => navigate("/admin/accessories") },
    { label: "Kampanyalar", value: len(campaignsAll), icon: Megaphone, onClick: () => navigate("/admin/campaigns") },
    { label: "Duyurular", value: len(announcementsAll), icon: Bell, onClick: () => navigate("/admin/announcements") },
    { label: "Yorumlar", value: len(reviewsAll), icon: Star, onClick: () => navigate("/admin/reviews") },
  ];

  return (
    <div className="space-y-6">
      {/* Üst başlık */}
      <div className="flex items-center justify-between">
        <CardTitle className="text-base sm:text-lg">Genel Bakış</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
            Yenile
          </Button>
        </div>
      </div>

      {/* Metrik kartları */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} icon={s.icon} onClick={s.onClick} />
        ))}
      </div>

      {/* Son Ürünler */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="border-b border-gray-200 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg">Son Ürünler</CardTitle>
            <Button size="sm" variant="secondary" onClick={() => navigate("/admin/products")} className="gap-1">
              Tümünü Gör <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={[
              { key: "title", header: "Başlık", className: "min-w-[220px]" },
              { key: "category", header: "Kategori" },
              { key: "price", header: "Fiyat", className: "text-right" },
              { key: "created_at", header: "Oluşturma", className: "hidden md:table-cell text-right" },
            ]}
            rows={(Array.isArray(latestProducts) ? latestProducts : (latestProducts as any)?.items ?? []).map((p: any) => ({
              id: p.id,
              title: p.title,
              category: p.sub_category_id ? "Alt Kategori" : "Kategori",
              price: typeof p.price === "number" ? p.price.toLocaleString("tr-TR") + " ₺" : p.price,
              created_at: (p.created_at ?? "").toString().slice(0, 19).replace("T", " "),
            }))}
            empty="Henüz ürün yok."
          />
        </CardContent>
      </Card>

      {/* Son Kullanıcılar */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="border-b border-gray-200 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg">Son Kullanıcılar</CardTitle>
            <Button size="sm" variant="secondary" onClick={() => navigate("/admin/users")} className="gap-1">
              Tümünü Gör <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={[
              { key: "email", header: "Email", className: "min-w-[240px]" },
              { key: "full_name", header: "Ad Soyad", className: "hidden sm:table-cell" },
              { key: "roles", header: "Roller", className: "hidden md:table-cell" },
              { key: "created_at", header: "Kayıt", className: "text-right" },
            ]}
            rows={(Array.isArray(latestUsers) ? latestUsers : (latestUsers as any)?.items ?? []).map((u: any) => ({
              id: u.id,
              email: u.email,
              full_name: u.full_name ?? "—",
              roles: Array.isArray(u.roles) ? u.roles.join(", ") : "—",
              created_at: (u.created_at ?? "").toString().slice(0, 19).replace("T", " "),
            }))}
            empty="Henüz kullanıcı yok."
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* === Stat Kartı === */
function StatCard({
  label,
  value,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600 group-hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums">{value}</div>
    </button>
  );
}

/* === Basit Tablo === */
function DataTable({
  columns,
  rows,
  empty,
}: {
  columns: Array<{ key: string; header: string; className?: string }>;
  rows: Array<Record<string, any>>;
  empty?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-sm text-gray-600 dark:bg-zinc-900/40 dark:text-zinc-300">
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 font-medium ${c.className ?? ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-sm text-muted-foreground" colSpan={columns.length}>
                {empty ?? "Kayıt yok"}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50/60 dark:hover:bg-zinc-900/30">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 text-sm ${c.className ?? ""}`}>
                    {String(r[c.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
