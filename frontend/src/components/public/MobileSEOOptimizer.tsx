// FILE: src/components/seo/MobileSEOOptimizer.tsx
"use client";

import { useEffect } from "react";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

interface MobileSEOOptimizerProps {
  currentPage: string;
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string; // override
  ogImage?: string;
}

type Json = any;

export function MobileSEOOptimizer({
  currentPage,
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
}: MobileSEOOptimizerProps) {
  // İstenecek key’ler
  const pageKey = currentPage && currentPage !== "home" ? currentPage : "home";
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
    ],
  });

  const getVal = <T = Json,>(k: string, d: T): T =>
    ((settings?.find((s) => s.key === k)?.value as T) ?? d);

  useEffect(() => {
    // ======= DEFAULTS =======
    const defaults = getVal("seo_defaults", {
      canonicalBase: "https://mezarisim.com",
      siteName: "Mezarisim.com - Mezar Taşı Uzmanları",
      ogLocale: "tr_TR",
      author: "Mezarisim.com - Mezar Taşı Uzmanları",
      themeColor: "#14b8a6",
      twitterCard: "summary_large_image",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      googlebot: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    }) as {
      canonicalBase: string;
      siteName: string;
      ogLocale: string;
      author: string;
      themeColor: string;
      twitterCard: string;
      robots: string;
      googlebot: string;
    };

    const pageSEO = getVal(`seo_pages_${pageKey}`, null) || getVal("seo_pages_home", null) || {};
    const lb = getVal("seo_local_business", null) || null;
    const sameAs = getVal<string[]>("seo_social_same_as", []);
    const appIcons = getVal("seo_app_icons", {
      appleTouchIcon: "/apple-touch-icon.png",
    }) as { appleTouchIcon?: string };

    const telRaw = String(getVal("contact_phone_tel", "05334838971"));
    const canonicalBase = canonicalUrl || defaults.canonicalBase;

    const pageTitle = title || "Mezarisim.com";
    const pageDescription =
      description || "İstanbul’da mezar taşı ve yapım hizmetleri.";
    const pageKeywords =
      keywords ||
      "mezar taşı, mezar yapımı, mermer mezar, granit mezar, İstanbul";
    const pageOgImage = ogImage || undefined;

    // ======= DOM HELPERS =======
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
    updateMeta("author", defaults.author);
    updateMeta("robots", defaults.robots);
    updateMeta("googlebot", defaults.googlebot);

    // Mobile / PWA
    updateMeta(
      "viewport",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    );
    updateMeta("mobile-web-app-capable", "yes");
    updateMeta("apple-mobile-web-app-capable", "yes");
    updateMeta("apple-mobile-web-app-status-bar-style", "default");
    updateMeta("theme-color", defaults.themeColor);
    updateMeta("msapplication-TileColor", defaults.themeColor);
    updateMeta("format-detection", "telephone=yes, address=yes");
    const ampClient = String(getVal("seo_amp_google_client_id_api", "googleanalytics"));
    updateMeta("amp-google-client-id-api", ampClient);
    updateMeta("apple-mobile-web-app-title", "Mezarisim");
    updateMeta("application-name", "Mezarisim");

    // Icons
    if (appIcons.appleTouchIcon) {
      updateLink("apple-touch-icon", appIcons.appleTouchIcon, { sizes: "180x180" });
    }

    // ======= OPEN GRAPH =======
    const pageUrl = `${canonicalBase}${pageKey !== "home" ? `/${pageKey}` : ""}`;
    updateMeta("og:type", "website", true);
    updateMeta("og:title", pageTitle, true);
    updateMeta("og:description", pageDescription, true);
    updateMeta("og:url", pageUrl, true);
    updateMeta("og:site_name", defaults.siteName, true);
    updateMeta("og:locale", defaults.ogLocale, true);
    if (pageOgImage) {
      updateMeta("og:image", pageOgImage, true);
      updateMeta("og:image:width", "1200", true);
      updateMeta("og:image:height", "630", true);
      updateMeta("og:image:alt", pageTitle, true);
    }

    // ======= TWITTER =======
    updateMeta("twitter:card", defaults.twitterCard);
    updateMeta("twitter:title", pageTitle);
    updateMeta("twitter:description", pageDescription);
    if (pageOgImage) {
      updateMeta("twitter:image", pageOgImage);
      updateMeta("twitter:image:alt", pageTitle);
    }

    // ======= CANONICAL =======
    updateLink("canonical", pageUrl);

    // ======= JSON-LD (LocalBusiness) =======
    // Önce eski (bizim oluşturduğumuz) script’i temizle
    document.querySelectorAll('script[type="application/ld+json"][data-seo="localbusiness"]').forEach((n) => n.remove());
    const ld = lb || {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Mezarisim.com",
      description: "İstanbul'da kaliteli mezar taşı modelleri ve mezar yapım hizmetleri",
      url: defaults.canonicalBase,
      telephone: `+90-${telRaw.replace(/^0/, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`,
      address: { "@type": "PostalAddress", addressLocality: "İstanbul", addressCountry: "TR" },
      geo: { "@type": "GeoCoordinates", latitude: 41.0082, longitude: 28.9784 },
      sameAs,
      priceRange: "$$",
      serviceArea: {
        "@type": "GeoCircle",
        geoMidpoint: { "@type": "GeoCoordinates", latitude: 41.0082, longitude: 28.9784 },
        geoRadius: 50000,
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "localbusiness");
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);

    // ======= HTML LANG =======
    document.documentElement.lang = "tr";
  }, [settings, currentPage, title, description, keywords, canonicalUrl, ogImage]);

  return null;
}
