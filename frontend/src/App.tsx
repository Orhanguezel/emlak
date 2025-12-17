// =============================================================
// FILE: src/App.tsx
// =============================================================
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Toaster } from "sonner";

import { Header } from "./components/layout/Header";
import { HeroSection } from "./components/home/HeroSection";
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

/**
 * X Emlak PUBLIC route map
 * Admin rotalarına dokunmuyoruz.
 */
const routeMap: Record<PageKey, string> = {
  home: "/",
  about: "/hakkimizda",
  mission: "/misyon-vizyon",
  quality: "/kalite-politikamiz",
  faq: "/sss",
  properties: "/emlaklar",
  contact: "/iletisim",

  // admin
  adminAccess: "/adminkontrol",
  admin: "/admin",

  // detail routes
  propertyDetail: "/emlak/:slug",
};

function useCurrentPageKey(): PageKey {
  const { pathname } = useLocation();

  // admin
  if (pathname.startsWith("/adminkontrol")) return "adminAccess";
  if (pathname.startsWith("/admin")) return "admin";

  // public
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

/** Bir kampanya objesi/slug/id’den string ID üret – tüm durumları kabul et */
function resolveCampaignId(c: any): string | undefined {
  if (c == null) return undefined;
  if (typeof c === "string") {
    const s = c.trim();
    return s || undefined;
  }
  if (typeof c === "number") return String(c);
  if (typeof c === "object") {
    const possible = c.id ?? c.campaignId ?? c.slug ?? c.uuid ?? c._id ?? c.ID;
    if (possible == null) return undefined;
    return String(possible).trim() || undefined;
  }
  return undefined;
}

/** Bir duyuru objesi/slug/id’den string ID üret – slug/uuid öncelikli */
function resolveAnnouncementId(a: any): string | undefined {
  if (a == null) return undefined;
  if (typeof a === "string") {
    const s = a.trim();
    return s || undefined;
  }
  if (typeof a === "number") return String(a);
  if (typeof a === "object") {
    const possible = a.slug ?? a.uuid ?? a.id ?? a._id ?? a.ID;
    if (possible == null) return undefined;
    return String(possible).trim() || undefined;
  }
  return undefined;
}

/** ------- Sayfa Parçaları ------- */
function HomeComposition(props: {
  searchTerm: string;
  showSearchResults: boolean;
  onClearSearch: () => void;

  /** ✅ emlak kartından detaya gidiş */
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
        onOpenRecentWorkModal={(w) => props.openRecentWork(w)}
        onOpenCampaignsModal={(c) => props.openCampaigns(c)}
        onOpenAnnouncementModal={(a) => props.openAnnouncement(a)}
      />
    </>
  );
}

function PropertyDetailWrapper(props: {
  onPropertyDetail: (slug: string) => void;
  onNavigate: (pageOrPath: string) => void;
}) {
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

  // Modallar (şu an App içinde sadece state var; ilgili modal componentleri ayrı yerde olabilir)
  const [showCampaignsModal, setShowCampaignsModal] = useState(false);
  const [showRecentWorkModal, setShowRecentWorkModal] = useState(false);
  const [selectedRecentWork, setSelectedRecentWork] = useState<{ id: string; slug?: string } | null>(
    null,
  );
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

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

  /**
   * X Emlak event isimleri
   */
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
    setSearchTerm(term);
    const has = term.trim().length > 0;
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
    if (key === "propertyDetail") return; // param ister
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
          <Header
            currentPage={currentPage}
            onNavigate={onNavigateString}
            onSearch={handleSearch}
            searchTerm={searchTerm}
          />
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

            {/* X Emlak public pages */}
            <Route path="/hakkimizda" element={<AboutPage onNavigate={onNavigateString} />} />
            <Route path="/misyon-vizyon" element={<MissionVisionPage onNavigate={onNavigateString} />} />
            <Route
              path="/kalite-politikamiz"
              element={<QualityPolicyPage onNavigate={onNavigateString} />}
            />
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

            {/* ✅ Emlak detay */}
            <Route
              path="/emlak/:slug"
              element={<PropertyDetailWrapper onPropertyDetail={onPropertyDetail} onNavigate={onNavigateString} />}
            />

            {/* Admin akışı — dokunulmadı */}
            <Route path="/adminkontrol" element={<AdminSecretAccess onNavigate={onNavigateString} />} />

            {/* ✅ Admin panel VE tüm form rotaları */}
            <Route path="/admin" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/*" element={<AdminPanel onNavigate={onNavigateString} />} />

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
