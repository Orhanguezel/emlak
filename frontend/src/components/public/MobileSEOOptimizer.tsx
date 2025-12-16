// =============================================================
// FILE: src/components/seo/MobileSEOOptimizer.tsx   (X Emlak)
// =============================================================
"use client";

import { useEffect, useMemo } from "react";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

type Json = any;

interface MobileSEOOptimizerProps {
  /**
   * App.tsx -> currentPage: "home" | "properties" | "contact" | "about" | "mission" | ...
   * Not: property detail gibi sayfalarda "propertyDetail" gelmeli.
   */
  currentPage: string;

  /**
   * Opsiyonel override’lar (örn. detail sayfasında ilanın başlığını buradan geçir)
   */
  title?: string;
  description?: string;
  keywords?: string;

  /**
   * Eğer canonical’ı zorlamak istersen (nadiren gerekir)
   * Örn: bazı sayfalarda querystring temizlemek vb.
   */
  canonicalUrl?: string;

  /**
   * OG görseli override (absolute veya /relative olabilir)
   */
  ogImage?: string;
}

type SeoDefaults = {
  canonicalBase: string;
  siteName: string;
  ogLocale: string;
  author: string;
  themeColor: string;
  twitterCard: string;
  robots: string;
  googlebot: string;
};

type SeoPage = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;

  /**
   * Template destekli alanlar (özellikle detail için):
   * "titleTemplate": "{{title}} | X Emlak"
   */
  titleTemplate?: string;
  descriptionTemplate?: string;
  keywordsTemplate?: string;
};

function safeParseJson<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw === "object") return raw as T;
  if (typeof raw !== "string") return fallback;

  const s = raw.trim();
  if (!s) return fallback;

  try {
    return JSON.parse(s) as T;
  } catch {
    // Bazı projelerde value zaten "..." şeklinde JSON-string olarak saklanıyor olabilir.
    // Bu durumda tekrar parse etmeyi dene.
    try {
      const unquoted = s.startsWith('"') ? JSON.parse(s) : s;
      if (typeof unquoted === "object") return unquoted as T;
      if (typeof unquoted === "string") return JSON.parse(unquoted) as T;
      return fallback;
    } catch {
      return fallback;
    }
  }
}

function toAbsUrl(canonicalBase: string, maybeUrl?: string) {
  if (!maybeUrl) return undefined;
  const s = String(maybeUrl).trim();
  if (!s) return undefined;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("//")) return `https:${s}`;
  if (s.startsWith("/")) return `${canonicalBase.replace(/\/$/, "")}${s}`;
  return `${canonicalBase.replace(/\/$/, "")}/${s}`;
}

function stripHash(u: string) {
  return u.split("#")[0] || u;
}

function stripQuery(u: string) {
  return u.split("?")[0] || u;
}

function applyTemplate(tpl: string, vars: Record<string, string>) {
  return tpl.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k) => vars[k] ?? "");
}

export function MobileSEOOptimizer({
  currentPage,
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
}: MobileSEOOptimizerProps) {
  const pageKey = currentPage && currentPage !== "home" ? currentPage : "home";

  // İstenecek key’ler (X Emlak)
  const { data: settings } = useListSiteSettingsQuery({
    keys: [
      "seo_defaults",
      `seo_pages_${pageKey}`,
      "seo_pages_home",
      "seo_local_business",
      "seo_social_same_as",
      "seo_app_icons",
      "seo_amp_google_client_id_api",
      "brand_name",
      "brand_tagline",
      "contact_phone_tel",
      "contact_phone_display",
      "contact_address",
      "contact_email",
    ],
  });

  const getRaw = (k: string) => settings?.find((s: any) => s.key === k)?.value;

  const defaults = useMemo<SeoDefaults>(() => {
    const d = safeParseJson<SeoDefaults>(getRaw("seo_defaults"), {
      canonicalBase: "https://xemlak.com",
      siteName: "X Emlak | Gayrimenkul Danışmanlığı",
      ogLocale: "tr_TR",
      author: "X Emlak",
      themeColor: "#1e293b",
      twitterCard: "summary_large_image",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      googlebot: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    });
    // canonicalBase boş gelirse koru
    return { ...d, canonicalBase: d.canonicalBase || "https://xemlak.com" };
  }, [settings]);

  const brandName = useMemo(() => {
    const raw = getRaw("brand_name");
    const parsed = safeParseJson<string>(raw, "");
    return parsed || "X Emlak";
  }, [settings]);

  const brandTagline = useMemo(() => {
    const raw = getRaw("brand_tagline");
    return safeParseJson<string>(raw, "") || "";
  }, [settings]);

  const pageSeo = useMemo<SeoPage>(() => {
    const p = safeParseJson<SeoPage>(getRaw(`seo_pages_${pageKey}`), {});
    if (Object.keys(p).length) return p;
    return safeParseJson<SeoPage>(getRaw("seo_pages_home"), {});
  }, [settings, pageKey]);

  const sameAs = useMemo<string[]>(() => {
    return safeParseJson<string[]>(getRaw("seo_social_same_as"), []);
  }, [settings]);

  const appIcons = useMemo(() => {
    return safeParseJson<{ appleTouchIcon?: string; favicon32?: string; favicon16?: string }>(
      getRaw("seo_app_icons"),
      { appleTouchIcon: "/apple-touch-icon.png" },
    );
  }, [settings]);

  const ampClient = useMemo(() => {
    return safeParseJson<string>(getRaw("seo_amp_google_client_id_api"), "googleanalytics");
  }, [settings]);

  const telRaw = useMemo(() => {
    const raw = getRaw("contact_phone_tel");
    return safeParseJson<string>(raw, "+49000000000") || "+49000000000";
  }, [settings]);

  useEffect(() => {
    const canonicalBase = (defaults.canonicalBase || "https://xemlak.com").replace(/\/$/, "");

    // ===== URL (SPA için en doğru canonical/og:url) =====
    const liveHref =
      typeof window !== "undefined" && window.location?.href
        ? window.location.href
        : `${canonicalBase}/`;

    // canonical override varsa onu kullan; yoksa hash ve query’siz gerçek path’i kullan
    const computedCanonical = canonicalUrl
      ? toAbsUrl(canonicalBase, canonicalUrl)!
      : stripQuery(stripHash(liveHref));

    // OG url de canonical ile aynı olsun
    const pageUrl = computedCanonical;

    // ===== TEMPLATE vars =====
    const tplVars: Record<string, string> = {
      brand_name: brandName,
      brand_tagline: brandTagline,
      title: title || "",
      description: description || "",
      keywords: keywords || "",
    };

    // ===== Sayfa başlık/desc/keywords (öncelik: props override -> template -> page json -> fallback) =====
    const pageTitle =
      title ||
      (pageSeo.titleTemplate ? applyTemplate(pageSeo.titleTemplate, tplVars).trim() : "") ||
      pageSeo.title ||
      `${brandName}${brandTagline ? ` | ${brandTagline}` : ""}`;

    const pageDescription =
      description ||
      (pageSeo.descriptionTemplate ? applyTemplate(pageSeo.descriptionTemplate, tplVars).trim() : "") ||
      pageSeo.description ||
      "Satılık/kiralık konut, arsa ve ticari portföy. Şeffaf süreç ve profesyonel danışmanlık.";

    const pageKeywords =
      keywords ||
      (pageSeo.keywordsTemplate ? applyTemplate(pageSeo.keywordsTemplate, tplVars).trim() : "") ||
      pageSeo.keywords ||
      "x emlak, satılık, kiralık, konut, arsa, ticari, gayrimenkul danışmanlığı";

    const pageOgImageAbs =
      toAbsUrl(canonicalBase, ogImage || pageSeo.ogImage || undefined) || undefined;

    // ======= DOM helpers =======
    const updateMeta = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        if (isProperty) tag.setAttribute("property", name);
        else tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const updateLink = (rel: string, href: string, extra?: Record<string, string>) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
      if (extra) Object.entries(extra).forEach(([k, v]) => link!.setAttribute(k, v));
    };

    // ======= TITLE =======
    document.title = pageTitle;

    // ======= BASIC META =======
    updateMeta("description", pageDescription);
    updateMeta("keywords", pageKeywords);
    updateMeta("author", defaults.author || brandName);
    updateMeta("robots", defaults.robots);
    updateMeta("googlebot", defaults.googlebot);

    // Mobile / PWA
    updateMeta(
      "viewport",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
    );
    updateMeta("mobile-web-app-capable", "yes");
    updateMeta("apple-mobile-web-app-capable", "yes");
    updateMeta("apple-mobile-web-app-status-bar-style", "default");
    updateMeta("theme-color", defaults.themeColor);
    updateMeta("msapplication-TileColor", defaults.themeColor);
    updateMeta("format-detection", "telephone=yes, address=yes");
    updateMeta("amp-google-client-id-api", ampClient);
    updateMeta("apple-mobile-web-app-title", brandName);
    updateMeta("application-name", brandName);

    // Icons (apple touch + favicon örnekleri)
    if (appIcons.appleTouchIcon) {
      updateLink("apple-touch-icon", toAbsUrl(canonicalBase, appIcons.appleTouchIcon)!, { sizes: "180x180" });
    }
    if (appIcons.favicon32) updateLink("icon", toAbsUrl(canonicalBase, appIcons.favicon32)!, { sizes: "32x32", type: "image/png" });
    if (appIcons.favicon16) updateLink("icon", toAbsUrl(canonicalBase, appIcons.favicon16)!, { sizes: "16x16", type: "image/png" });

    // ======= OPEN GRAPH =======
    updateMeta("og:type", "website", true);
    updateMeta("og:title", pageTitle, true);
    updateMeta("og:description", pageDescription, true);
    updateMeta("og:url", pageUrl, true);
    updateMeta("og:site_name", defaults.siteName || brandName, true);
    updateMeta("og:locale", defaults.ogLocale || "tr_TR", true);

    if (pageOgImageAbs) {
      updateMeta("og:image", pageOgImageAbs, true);
      updateMeta("og:image:width", "1200", true);
      updateMeta("og:image:height", "630", true);
      updateMeta("og:image:alt", pageTitle, true);
    }

    // ======= TWITTER =======
    updateMeta("twitter:card", defaults.twitterCard || "summary_large_image");
    updateMeta("twitter:title", pageTitle);
    updateMeta("twitter:description", pageDescription);
    if (pageOgImageAbs) {
      updateMeta("twitter:image", pageOgImageAbs);
      updateMeta("twitter:image:alt", pageTitle);
    }

    // ======= CANONICAL =======
    updateLink("canonical", pageUrl);

    // ======= JSON-LD (RealEstateAgent / LocalBusiness) =======
    document
      .querySelectorAll('script[type="application/ld+json"][data-seo="localbusiness"]')
      .forEach((n) => n.remove());

    const lbRaw = getRaw("seo_local_business");
    const lb = safeParseJson<any>(lbRaw, null);

    // Eğer DB’de hazır JSON-LD varsa aynen bas; yoksa minimum RealEstateAgent üret
    const ld =
      lb ||
      ({
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: brandName,
        url: canonicalBase,
        telephone: telRaw,
        sameAs,
      } as const);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "localbusiness");
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);

    // ======= HTML LANG =======
    document.documentElement.lang = "tr";
  }, [
    settings,
    defaults,
    brandName,
    brandTagline,
    pageSeo,
    sameAs,
    appIcons,
    ampClient,
    telRaw,
    currentPage,
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
  ]);

  return null;
}
