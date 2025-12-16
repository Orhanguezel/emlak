// =============================================================
// FILE: src/App.tsx
// =============================================================
import { useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Header } from "./components/layout/Header";
import { HeroSection } from "./components/home/HeroSection";
import { ProductGallery } from "./components/public/ProductGallery";
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
import { ProductDetailPage } from "./components/public/ProductDetailPage";
import { CemeteriesPage } from "./components/public/CemeteriesPage";

import CampaignAnnouncementsPage from "./components/public/CampaignAnnouncementsPage";
import { DetailPanel } from "./components/public/CampaignAnnouncementDetailPanel";
import { RecentWorkDetailPage } from "./components/public/RecentWorkDetailPage";
import { ModalWrapper } from "./components/public/ModalWrapper";
import { DataProvider } from "./contexts/DataContext";

import { Toaster } from "sonner";

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
  | "productDetail"
  | "cemetery"
  | "campaigns";

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
  campaigns: "/kampanyalar",

  // admin
  adminAccess: "/adminkontrol",
  admin: "/admin",

  // detail routes
  productDetail: "/emlak/:slug",
  cemetery: "/cemetery",
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
  if (pathname.startsWith("/emlak/")) return "productDetail";
  if (pathname.startsWith("/kampanyalar")) return "campaigns";
  if (pathname.startsWith("/cemetery")) return "cemetery";

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
  onProductDetail: (slug: string) => void;
  refreshKey: number;
  openRecentWork: (payload: { id: string; slug?: string }) => void;
  openCampaigns: (c?: any) => void;
  openAnnouncement: (a?: any) => void;
  onNavigate: (pageOrPath: string) => void;
}) {
  return (
    <>
      <HeroSection onNavigate={props.onNavigate} />

      <ProductGallery
        searchTerm={props.searchTerm}
        showSearchResults={props.showSearchResults}
        onClearSearch={props.onClearSearch}
        onProductDetail={props.onProductDetail}
        refreshKey={props.refreshKey}
      />

      <HomePage
        onNavigate={() => { }}
        onOpenRecentWorkModal={(w) => props.openRecentWork(w)}
        onOpenCampaignsModal={(c) => props.openCampaigns(c)}
        onOpenAnnouncementModal={(a) => props.openAnnouncement(a)}
      />
    </>
  );
}

function ProductDetailWrapper(props: { onProductDetail: (slug: string) => void }) {
  const params = useParams();
  const slug = params.slug;

  if (!slug) return <Navigate to={routeMap.home} replace />;

  return (
    <ProductDetailPage
      key={`property-${slug}`}
      productId={slug as string}
      onNavigate={() => { }}
      onProductDetail={props.onProductDetail}
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

  const [showCampaignsModal, setShowCampaignsModal] = useState(false);
  const [showRecentWorkModal, setShowRecentWorkModal] = useState(false);
  const [selectedRecentWork, setSelectedRecentWork] = useState<{
    id: string;
    slug?: string;
  } | null>(null);

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

  const hidePublicChrome = useMemo(
    () => location.pathname.startsWith("/admin") || location.pathname.startsWith("/adminkontrol"),
    [location.pathname],
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-app", hidePublicChrome ? "admin" : "site");
    (document.body || document.documentElement).id = "site-root";
  }, [hidePublicChrome]);

  /**
   * X Emlak event isimleri
   * (eski mezarisim-* yerine)
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

    // arama yapınca home yerine emlaklar’a da atabiliriz,
    // ama mevcut akışı bozmayalım: ana sayfada galeri varsa home’a dönsün.
    if (has) navigate(routeMap.home);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
  };

  /**
   * Header/Footer artık site_settings'ten path döndürebilir.
   * Bu yüzden hem PageKey, hem de "/iletisim" gibi path kabul ediyoruz.
   */
  const onNavigateString = (pageOrPath: string) => {
    const s = String(pageOrPath || "").trim();
    if (!s) return;

    // Path geldiyse direkt navigate
    if (s.startsWith("/")) {
      navigate(s);
      return;
    }

    // PageKey geldiyse map'ten çöz
    const key = s as PageKey;
    if (key === "productDetail") return; // detail route param ister
    navigate(routeMap[key] ?? routeMap.home);
  };

  const onProductDetail = (slug: string) => {
    navigate(`/emlak/${slug}`);
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
    <DataProvider>
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
                  onProductDetail={onProductDetail}
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
            <Route path="/kalite-politikamiz" element={<QualityPolicyPage onNavigate={onNavigateString} />} />
            <Route path="/sss" element={<FAQPage onNavigate={onNavigateString} />} />
            <Route path="/iletisim" element={<ContactPage onNavigate={onNavigateString} />} />

            {/* Portföy listesi (şimdilik PricingPage yerine mevcut ProductGallery zaten home’da) */}
            {/* Eğer ayrı sayfa istersen burada PropertiesPage gibi ayrı component bağlarız: */}
            <Route
              path="/emlaklar"
              element={
                <ProductGallery
                  searchTerm={searchTerm}
                  showSearchResults={showSearchResults}
                  onClearSearch={handleClearSearch}
                  onProductDetail={onProductDetail}
                  refreshKey={refreshKey}
                />
              }
            />

            {/* Emlak detay */}
            <Route path="/emlak/:slug" element={<ProductDetailWrapper onProductDetail={onProductDetail} />} />

            {/* Kampanyalar route'u (modal harici ayrı sayfa istersen) */}
            <Route path="/kampanyalar" element={<CampaignAnnouncementsPage onNavigate={onNavigateString} />} />

            {/* Admin akışı — dokunulmadı */}
            <Route path="/adminkontrol" element={<AdminSecretAccess onNavigate={onNavigateString} />} />
            <Route path="/admin" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/products" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/products/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/products/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/headstones" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/headstones/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/headstones/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/categories" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/categories/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/categories/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/subcategories" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/subcategories/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/subcategories/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/pages" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/pages/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/pages/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/faqs" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/faqs/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/faqs/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/recent_works" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/recent_works/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/recent_works/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/settings" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/settings/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/settings/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/sitesettings" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/announcements" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/announcements/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/announcements/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/users" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/users/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/users/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/campaigns" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/campaigns/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/campaigns/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/contacts" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/contacts/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/contacts/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/services" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/services/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/services/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/accessories" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/accessories/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/accessories/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/sliders" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/sliders/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/sliders/:id" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/reviews" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/reviews/new" element={<AdminPanel onNavigate={onNavigateString} />} />
            <Route path="/admin/reviews/:id" element={<AdminPanel onNavigate={onNavigateString} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!hidePublicChrome && <Footer onNavigate={onNavigateString} />}
        {!hidePublicChrome && <FloatingCallButton />}

        {/* Kampanya/Duyuru Modal */}
        <ModalWrapper
          isOpen={showCampaignsModal}
          onClose={() => {
            setShowCampaignsModal(false);
            setSelectedCampaignId(null);
            setSelectedAnnouncementId(null);
          }}
          title={
            selectedCampaignId
              ? "Kampanya Detayı"
              : selectedAnnouncementId
                ? "Duyuru Detayı"
                : "Duyuru / Kampanyalar"
          }
          maxWidth="max-w-3xl"
        >
          {selectedCampaignId ? (
            <DetailPanel kind="campaign" id={selectedCampaignId} />
          ) : selectedAnnouncementId ? (
            <DetailPanel kind="announcement" id={selectedAnnouncementId} />
          ) : (
            <CampaignAnnouncementsPage onNavigate={onNavigateString} />
          )}
        </ModalWrapper>

        {/* Son Çalışmalar Modal */}
        <ModalWrapper
          isOpen={showRecentWorkModal}
          onClose={() => {
            setShowRecentWorkModal(false);
            setSelectedRecentWork(null);
          }}
          title="Son Portföy Çalışmalarımız"
          maxWidth="max-w-7xl"
        >
          {selectedRecentWork && (
            <RecentWorkDetailPage
              id={selectedRecentWork.id}
              slug={selectedRecentWork.slug}
              onBack={() => {
                setShowRecentWorkModal(false);
                setSelectedRecentWork(null);
              }}
            />
          )}
        </ModalWrapper>

        <Toaster position="top-right" richColors closeButton />
      </div>
    </DataProvider>
  );
}
