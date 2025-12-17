// =============================================================
// FILE: src/components/admin/AdminPanel/index.tsx   (X Emlak)
// Add: properties tab + routes
// =============================================================
"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStatusQuery } from "@/integrations/rtk/endpoints/auth_public.endpoints";

import AdminLayout, { ActiveTab } from "@/components/layout/AdminLayout";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminFooter from "@/components/layout/AdminFooter";

// Forms
import CustomPageFormPage from "@/components/admin/AdminPanel/form/CustomPageFormPage";
import FAQForm from "./form/FAQForm";
import UserFormPage from "./form/UserFormPage";
import ContactFormPage from "./form/ContactFormPage";
import SliderFormPage from "./form/SliderFormPage";
import ReviewFormPage from "./form/ReviewFormPage";
import SettingFormPage from "./form/SettingFormPage";

// ✅ NEW: Property form (opsiyonel ama route için koyuyoruz)
import PropertyFormPage from "./form/PropertyFormPage";

// Tabs
import TabsPages from "./Tabs/PagesTab";
import TabsFAQ from "./Tabs/FAQTab";
import TabsUsers from "./Tabs/TabsUser";
import TabsContacts from "./Tabs/ContactsTab";
import SlidersTab from "./Tabs/SlidersTab";
import ReviewsTab from "./Tabs/ReviewsTab";
import TabsSiteSettings from "./Tabs/sitesettings/SiteSettingsTab";
import TabsSettings from "./Tabs/TabsSettings";

// ✅ NEW: Properties tab
import TabsProperties from "./Tabs/PropertiesTab";

// Dashboard
import AdminDashboard from "./AdminDashboard";

type AdminPanelProps = { onNavigate: (page: string) => void };

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const {
    data: authStatus,
    isFetching: statusFetching,
    refetch: refetchStatus,
  } = useAuthStatusQuery();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isFormRoute = (segment: string) =>
    pathname === `/admin/${segment}/new` ||
    new RegExp(`^/admin/${segment}/[^/]+$`).test(pathname);

  const isCustomPageFormRoute = isFormRoute("pages");
  const isFAQFormRoute = isFormRoute("faqs");
  const isUserFormRoute = isFormRoute("users");
  const isContactFormRoute = isFormRoute("contacts");
  const isSliderFormRoute = isFormRoute("sliders");
  const isReviewFormRoute = isFormRoute("reviews");

  // ✅ NEW
  const isPropertyFormRoute = isFormRoute("properties");

  const isSiteSettingFormRoute =
    pathname === "/admin/site_settings/new" ||
    pathname === "/admin/site-settings/new" ||
    /^\/admin\/site[_-]settings\/[^/]+$/.test(pathname);

  const isSettingFormRoute = isFormRoute("settings");

  const isAnyFormRoute =
    isCustomPageFormRoute ||
    isFAQFormRoute ||
    isUserFormRoute ||
    isContactFormRoute ||
    isReviewFormRoute ||
    isSliderFormRoute ||
    isSiteSettingFormRoute ||
    isSettingFormRoute ||
    isPropertyFormRoute;

  const isRootAdmin = pathname === "/admin";

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    refetchStatus();
    const onFocus = () => refetchStatus();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetchStatus]);

  useEffect(() => {
    if (!statusFetching) {
      setInitialCheckDone(true);
      setIsAuthorized(!!(authStatus?.authenticated && authStatus.is_admin));
    }
  }, [authStatus, statusFetching]);

  useEffect(() => {
    if (isCustomPageFormRoute && activeTab !== "pages") setActiveTab("pages");
    if (isFAQFormRoute && activeTab !== "faqs") setActiveTab("faqs");
    if (isUserFormRoute && activeTab !== "users") setActiveTab("users");
    if (isContactFormRoute && activeTab !== "contacts") setActiveTab("contacts");
    if (isSliderFormRoute && activeTab !== "sliders") setActiveTab("sliders");
    if (isReviewFormRoute && activeTab !== "reviews") setActiveTab("reviews");
    if (isSiteSettingFormRoute && activeTab !== "sitesettings") setActiveTab("sitesettings");
    if (isSettingFormRoute && activeTab !== "settings") setActiveTab("settings");

    // ✅ NEW
    if (isPropertyFormRoute && activeTab !== "properties") setActiveTab("properties");

    if (isRootAdmin && activeTab !== "dashboard") setActiveTab("dashboard");
  }, [
    isCustomPageFormRoute,
    isFAQFormRoute,
    isUserFormRoute,
    isContactFormRoute,
    isSliderFormRoute,
    isReviewFormRoute,
    isSiteSettingFormRoute,
    isSettingFormRoute,
    isPropertyFormRoute,
    isRootAdmin,
    activeTab,
  ]);

  const handleTabChange = useCallback(
    (t: ActiveTab) => {
      const tabToSeg: Partial<Record<ActiveTab, string>> = {
        dashboard: "",
        properties: "properties", // ✅ NEW
        sliders: "sliders",
        pages: "pages",
        faqs: "faqs",
        reviews: "reviews",
        contacts: "contacts",
        sitesettings: "sitesettings",
        users: "users",
        settings: "settings",
      };

      setActiveTab(t);

      const seg = tabToSeg[t];
      if (seg == null || seg === "") navigate("/admin", { replace: false });
      else navigate(`/admin/${seg}`, { replace: false });
    },
    [navigate],
  );

  useEffect(() => {
    if (isAnyFormRoute) return;

    const m = pathname.match(/^\/admin\/([a-z_-]+)$/);
    if (!m) return;

    const seg = m[1] ?? "";

    const segToTab: Partial<Record<string, ActiveTab>> = {
      dashboard: "dashboard",
      properties: "properties", // ✅ NEW
      sliders: "sliders",
      pages: "pages",
      faqs: "faqs",
      reviews: "reviews",
      contacts: "contacts",
      sitesettings: "sitesettings",
      site_settings: "sitesettings",
      "site-settings": "sitesettings",
      users: "users",
      settings: "settings",
    };

    const next = segToTab[seg];
    if (next && activeTab !== next) setActiveTab(next);
  }, [pathname, isAnyFormRoute, activeTab]);

  if (!initialCheckDone) {
    return <div className="flex min-h-dvh items-center justify-center bg-white text-gray-900" />;
  }

  if (!isAuthorized) {
    return <div className="flex min-h-dvh items-center justify-center bg-white text-gray-900" />;
  }

  const authedUserId: string | undefined =
    (authStatus as any)?.user_id ?? (authStatus as any)?.user?.id ?? (authStatus as any)?.id;

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onNavigateHome={() => onNavigate("home")}
      onNavigateLogin={() => onNavigate("adminAccess")}
      header={
        <AdminHeader
          onBackHome={() => {
            localStorage.removeItem("mh_access_token");
            localStorage.removeItem("mh_refresh_token");
            onNavigate("home");
          }}
        />
      }
      footer={<AdminFooter />}
    >
      {isAnyFormRoute ? (
        isPropertyFormRoute ? (
          <PropertyFormPage />
        ) : isUserFormRoute ? (
          <UserFormPage />
        ) : isCustomPageFormRoute ? (
          <CustomPageFormPage />
        ) : isFAQFormRoute ? (
          <FAQForm />
        ) : isContactFormRoute ? (
          <ContactFormPage />
        ) : isSliderFormRoute ? (
          <SliderFormPage />
        ) : isReviewFormRoute ? (
          <ReviewFormPage />
        ) : isSettingFormRoute ? (
          <SettingFormPage />
        ) : isSiteSettingFormRoute ? (
          <SettingFormPage />
        ) : null
      ) : (
        <>
          {isRootAdmin ? (
            <AdminDashboard />
          ) : (
            <>
              {activeTab === "properties" && (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="border-b border-gray-200 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">Emlaklar</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <TabsProperties />
                  </CardContent>
                </Card>
              )}

              {/* var olan tab renderların aynı şekilde kalsın */}
              {activeTab === "sitesettings" && (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="border-b border-gray-200 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">Sayfa Ayarları</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <TabsSiteSettings />
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && authedUserId && (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="border-b border-gray-200 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">Hesap Ayarları</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <TabsSettings userId={authedUserId} defaultTab="password" />
                  </CardContent>
                </Card>
              )}

              {activeTab === "contacts" && (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="border-b border-gray-200 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">İletişim Mesajları</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <TabsContacts />
                  </CardContent>
                </Card>
              )}

              {activeTab === "sliders" && (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="border-b border-gray-200 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">Slider Yönetimi</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <SlidersTab />
                  </CardContent>
                </Card>
              )}

              {activeTab === "reviews" && (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="border-b border-gray-200 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">Yorumlar</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <ReviewsTab />
                  </CardContent>
                </Card>
              )}

              {activeTab === "users" && (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="border-b border-gray-200 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">Kullanıcılar</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <TabsUsers />
                  </CardContent>
                </Card>
              )}

              {activeTab === "faqs" && (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="border-b border-gray-200 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">SSS (Sık Sorulan Sorular)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <TabsFAQ />
                  </CardContent>
                </Card>
              )}

              {activeTab === "pages" && (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="border-b border-gray-200 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">Sayfalar</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <TabsPages />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </AdminLayout>
  );
}
