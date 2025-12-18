// =============================================================
// FILE: src/App.tsx
// =============================================================
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Toaster } from "sonner";

import { Header } from "./components/layout/Header";
import { HeroSection } from "./components/public/homepage/HeroSection";
import { PropertiesGallery } from "./components/public/properties/PropertiesGallery";
import { HomePage } from "./components/public/homepage/HomePage";
import { Footer } from "./components/layout/Footer";
import { FloatingCallButton } from "./components/public/FloatingCallButton";

import AdminPanel from "./components/admin/AdminPanel";
import { AdminSecretAccess } from "./components/admin/AdminSecretAccess";

import { ContactPage } from "./components/public/ContactPage";
import { AboutPage } from "./components/public/AboutPage";
import { MissionVisionPage } from "./components/public/MissionVisionPage";
import { QualityPolicyPage } from "./components/public/QualityPolicyPage";
import { FAQPage } from "./components/public/FAQPage";
import { PropertyDetailPage } from "./components/public/properties/PropertyDetailPage";

/** ------- Yardımcılar ------- */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

type PageKey =
  | "home"
  | "admin"
  | "adminAccess"
  | "contact"
  | "about"
  | "mission"
  | "quality"
  | "faq"
  | "properties"
  | "propertyDetail";

const routeMap: Record<PageKey, string> = {
  home: "/",
  about: "/hakkimizda",
  mission: "/misyon-vizyon",
  quality: "/kalite-politikamiz",
  faq: "/sss",
  properties: "/emlaklar",
  contact: "/iletisim",

  adminAccess: "/adminkontrol",
  admin: "/admin",

  propertyDetail: "/emlak/:slug",
};

function useCurrentPageKey(): PageKey {
  const { pathname } = useLocation();

  if (pathname.startsWith("/adminkontrol")) return "adminAccess";
  if (pathname.startsWith("/admin")) return "admin";

  if (pathname === "/" || pathname.startsWith("/#")) return "home";
  if (pathname.startsWith("/hakkimizda")) return "about";
  if (pathname.startsWith("/misyon-vizyon")) return "mission";
  if (pathname.startsWith("/kalite-politikamiz")) return "quality";
  if (pathname.startsWith("/sss")) return "faq";
  if (pathname.startsWith("/emlaklar")) return "properties";
  if (pathname.startsWith("/iletisim")) return "contact";
  if (pathname.startsWith("/emlak/")) return "propertyDetail";

  return "home";
}

/** Kampanya objesi/slug/id’den string ID üret */
function resolveCampaignId(c: any): string | undefined {
  if (c == null) return undefined;
  if (typeof c === "string") return c.trim() || undefined;
  if (typeof c === "number") return String(c);
  if (typeof c === "object") {
    const possible = c.id ?? c.campaignId ?? c.slug ?? c.uuid ?? c._id ?? c.ID;
    return possible == null ? undefined : String(possible).trim() || undefined;
  }
  return undefined;
}

/** Duyuru objesi/slug/id’den string ID üret */
function resolveAnnouncementId(a: any): string | undefined {
  if (a == null) return undefined;
  if (typeof a === "string") return a.trim() || undefined;
  if (typeof a === "number") return String(a);
  if (typeof a === "object") {
    const possible = a.slug ?? a.uuid ?? a.id ?? a._id ?? a.ID;
    return possible == null ? undefined : String(possible).trim() || undefined;
  }
  return undefined;
}

/** ------- Sayfa Parçaları ------- */
function HomeComposition(props: {
  searchTerm: string;
  showSearchResults: boolean;
  onClearSearch: () => void;
  onPropertyDetail: (slug: string) => void;
  refreshKey: number;
  openRecentWork: (payload: { id: string; slug?: string }) => void;
  openCampaigns: (c?: any) => void;
  openAnnouncement: (a?: any) => void;
  onNavigate: (pageOrPath: string) => void;
}) {
  return (
    <>
      <HeroSection onNavigate={props.onNavigate} />

      <PropertiesGallery
        searchTerm={props.searchTerm}
        showSearchResults={props.showSearchResults}
        onClearSearch={props.onClearSearch}
        onPropertyDetail={props.onPropertyDetail}
        refreshKey={props.refreshKey}
      />

      <HomePage
        onNavigate={props.onNavigate}
        onOpenRecentWorkModal={props.openRecentWork}
        onOpenCampaignsModal={props.openCampaigns}
        onOpenAnnouncementModal={props.openAnnouncement}
      />
    </>
  );
}

function PropertyDetailWrapper(props: { onPropertyDetail: (slug: string) => void; onNavigate: (s: string) => void }) {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to={routeMap.home} replace />;

  return (
    <PropertyDetailPage
      key={`property-${slug}`}
      slug={slug}
      onNavigate={props.onNavigate}
      onPropertyDetail={props.onPropertyDetail}
    />
  );
}

/** ------- App ------- */
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = useCurrentPageKey();

  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // (İstersen bu modal state’lerini tamamen kaldırabilirsin; şimdilik dokunmuyorum)
  const [_showCampaignsModal, setShowCampaignsModal] = useState(false);
  const [_showRecentWorkModal, setShowRecentWorkModal] = useState(false);
  const [_selectedRecentWork, setSelectedRecentWork] = useState<{ id: string; slug?: string } | null>(null);
  const [_selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [_selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

  const hidePublicChrome = useMemo(
    () => location.pathname.startsWith("/admin") || location.pathname.startsWith("/adminkontrol"),
    [location.pathname],
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-app", hidePublicChrome ? "admin" : "site");
    (document.body || document.documentElement).id = "site-root";

    // index.html spinner’ı kapat
    document.body.classList.add("loaded");
  }, [hidePublicChrome]);

  useEffect(() => {
    const refresh = () => setRefreshKey((k) => k + 1);

    window.addEventListener("xemlak-properties-updated", refresh as any);
    window.addEventListener("xemlak-force-rerender", refresh as any);
    window.addEventListener("xemlak-property-changed", refresh as any);

    return () => {
      window.removeEventListener("xemlak-properties-updated", refresh as any);
      window.removeEventListener("xemlak-force-rerender", refresh as any);
      window.removeEventListener("xemlak-property-changed", refresh as any);
    };
  }, []);

  const handleSearch = (term: string) => {
    const t = String(term ?? "");
    setSearchTerm(t);
    const has = t.trim().length > 0;
    setShowSearchResults(has);
    if (has) navigate(routeMap.home);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const onNavigateString = (pageOrPath: string) => {
    const s = String(pageOrPath || "").trim();
    if (!s) return;

    if (s.startsWith("/")) {
      navigate(s);
      return;
    }

    const key = s as PageKey;
    if (key === "propertyDetail") return;
    navigate(routeMap[key] ?? routeMap.home);
  };

  const onPropertyDetail = (slug: string) => {
    const s = String(slug || "").trim();
    if (!s) return;
    navigate(`/emlak/${encodeURIComponent(s)}`);
  };

  const openRecentWork = (payload: { id: string; slug?: string }) => {
    setSelectedRecentWork(payload);
    setShowRecentWorkModal(true);
  };

  const openCampaigns = (c?: any) => {
    const cid = resolveCampaignId(c);
    setSelectedCampaignId(cid ?? null);
    setSelectedAnnouncementId(null);
    setShowCampaignsModal(true);
  };

  const openAnnouncement = (a?: any) => {
    const aid = resolveAnnouncementId(a);
    setSelectedAnnouncementId(aid ?? null);
    setSelectedCampaignId(null);
    setShowCampaignsModal(true);
  };

  return (
    <div>
      <ScrollToTop />

      <div className="min-h-screen bg-white">
        {!hidePublicChrome && (
          <Header currentPage={currentPage} onNavigate={onNavigateString} onSearch={handleSearch} searchTerm={searchTerm} />
        )}

        <main className="min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                <HomeComposition
                  searchTerm={searchTerm}
                  showSearchResults={showSearchResults}
                  onClearSearch={handleClearSearch}
                  onPropertyDetail={onPropertyDetail}
                  refreshKey={refreshKey}
                  openRecentWork={openRecentWork}
                  openCampaigns={openCampaigns}
                  openAnnouncement={openAnnouncement}
                  onNavigate={onNavigateString}
                />
              }
            />

            {/* Public pages */}
            <Route path="/hakkimizda" element={<AboutPage onNavigate={onNavigateString} />} />
            <Route path="/misyon-vizyon" element={<MissionVisionPage onNavigate={onNavigateString} />} />
            <Route path="/kalite-politikamiz" element={<QualityPolicyPage onNavigate={onNavigateString} />} />
            <Route path="/sss" element={<FAQPage onNavigate={onNavigateString} />} />
            <Route path="/iletisim" element={<ContactPage onNavigate={onNavigateString} />} />

            <Route
              path="/emlaklar"
              element={
                <PropertiesGallery
                  searchTerm={searchTerm}
                  showSearchResults={showSearchResults}
                  onClearSearch={handleClearSearch}
                  onPropertyDetail={onPropertyDetail}
                  refreshKey={refreshKey}
                />
              }
            />

            {/* Public property detail */}
            <Route path="/emlak/:slug" element={<PropertyDetailWrapper onPropertyDetail={onPropertyDetail} onNavigate={onNavigateString} />} />

            {/* Admin access */}
            <Route path="/adminkontrol" element={<AdminSecretAccess onNavigate={onNavigateString} />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminPanel onNavigate={onNavigateString} />} />

            <Route path="/admin/pages" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/pages/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/pages/:id" element={<AdminPanel onNavigate={onNavigateString} />} />

            <Route path="/admin/faqs" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/faqs/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/faqs/:id" element={<AdminPanel onNavigate={onNavigateString} />} />

            <Route path="/admin/settings" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/settings/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/settings/:id" element={<AdminPanel onNavigate={onNavigateString} />} />

            <Route path="/admin/sitesettings" element={<AdminPanel onNavigate={onNavigateString} />} />

            <Route path="/admin/users" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/users/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/users/:id" element={<AdminPanel onNavigate={onNavigateString} />} />

            <Route path="/admin/contacts" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/contacts/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/contacts/:id" element={<AdminPanel onNavigate={onNavigateString} />} />

            <Route path="/admin/sliders" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/sliders/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/sliders/:id" element={<AdminPanel onNavigate={onNavigateString} />} />

            <Route path="/admin/reviews" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/reviews/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/reviews/:id" element={<AdminPanel onNavigate={onNavigateString} />} />

            <Route path="/admin/properties" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/properties/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/properties/:id" element={<AdminPanel onNavigate={onNavigateString} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!hidePublicChrome && <Footer onNavigate={onNavigateString} />}
        {!hidePublicChrome && <FloatingCallButton />}

        <Toaster position="top-right" richColors closeButton />
      </div>
    </div>
  );
}
