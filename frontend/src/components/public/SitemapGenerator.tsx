"use client";

import * as React from "react";
import { toast } from "sonner";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

interface SitemapGeneratorProps {
  baseUrl?: string;
}

// replaceAll kullanmadan XML escape (eski target/lib ile uyumlu)
const escapeXml = (input: string): string => {
  const s = String(input ?? "");
  // önce & kaçır (diğerlerini dönüştürmeden önce)
  return s.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return ch;
    }
  });
};

export function SitemapGenerator({ baseUrl = "https://xemlak.com" }: SitemapGeneratorProps) {
  const generateSitemapUrls = React.useCallback((): SitemapUrl[] => {
    const currentDate = new Date().toISOString();

    return [
      // Ana sayfa
      { loc: baseUrl, lastmod: currentDate, changefreq: "daily", priority: 1.0 },

      // İlan keşif
      { loc: `${baseUrl}/ilanlar`, lastmod: currentDate, changefreq: "daily", priority: 0.95 },
      { loc: `${baseUrl}/satilik`, lastmod: currentDate, changefreq: "daily", priority: 0.9 },
      { loc: `${baseUrl}/kiralik`, lastmod: currentDate, changefreq: "daily", priority: 0.9 },

      // Kategori / içerik sayfaları
      { loc: `${baseUrl}/projeler`, lastmod: currentDate, changefreq: "weekly", priority: 0.8 },
      { loc: `${baseUrl}/hizmetler`, lastmod: currentDate, changefreq: "monthly", priority: 0.7 },
      { loc: `${baseUrl}/blog`, lastmod: currentDate, changefreq: "weekly", priority: 0.7 },

      // Kurumsal
      { loc: `${baseUrl}/hakkimizda`, lastmod: currentDate, changefreq: "yearly", priority: 0.6 },
      { loc: `${baseUrl}/iletisim`, lastmod: currentDate, changefreq: "yearly", priority: 0.7 },
      { loc: `${baseUrl}/misyon-vizyon`, lastmod: currentDate, changefreq: "yearly", priority: 0.5 },
      { loc: `${baseUrl}/kalite-politikasi`, lastmod: currentDate, changefreq: "yearly", priority: 0.5 },
      { loc: `${baseUrl}/sss`, lastmod: currentDate, changefreq: "monthly", priority: 0.6 },

      // Yasal
      { loc: `${baseUrl}/kvkk`, lastmod: currentDate, changefreq: "yearly", priority: 0.3 },
      { loc: `${baseUrl}/gizlilik`, lastmod: currentDate, changefreq: "yearly", priority: 0.3 },
      { loc: `${baseUrl}/cerez-politikasi`, lastmod: currentDate, changefreq: "yearly", priority: 0.3 },
    ];
  }, [baseUrl]);

  const generateXmlSitemap = React.useCallback((): string => {
    const urls = generateSitemapUrls();

    const body = urls
      .map((u) => {
        const loc = escapeXml(u.loc);
        const lastmod = u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : "";
        const changefreq = u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : "";
        // 0 gibi değerleri kaçırmamak için != null
        const priority = u.priority != null ? `<priority>${u.priority.toFixed(1)}</priority>` : "";

        return `  <url>
    <loc>${loc}</loc>
    ${lastmod}
    ${changefreq}
    ${priority}
  </url>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
  }, [generateSitemapUrls]);

  const downloadSitemap = React.useCallback(() => {
    const xmlContent = generateXmlSitemap();
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    toast.success("sitemap.xml indirildi.");
  }, [generateXmlSitemap]);

  const copySitemapToClipboard = React.useCallback(async () => {
    const xmlContent = generateXmlSitemap();

    try {
      await navigator.clipboard.writeText(xmlContent);
      toast.success("Sitemap XML kopyalandı. Sunucunun root dizinine sitemap.xml olarak ekleyin.");
    } catch (error) {
      console.error("Clipboard hatası:", error);

      // Fallback: textarea ile manuel kopyalama
      try {
        const textarea = document.createElement("textarea");
        textarea.value = xmlContent;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        toast.success("Sitemap XML kopyalandı. Sunucunun root dizinine sitemap.xml olarak ekleyin.");
      } catch {
        toast.error("Kopyalama başarısız. Konsoldan XML’i almayı deneyin.");
      }
    }
  }, [generateXmlSitemap]);

  // production’da render etme
  if (process.env.NODE_ENV === "production") return null;

  const count = generateSitemapUrls().length;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-950 text-white border border-white/10 rounded-2xl shadow-lg p-4 max-w-sm">
      <div className="text-sm font-semibold mb-1">SEO Sitemap Generator</div>
      <div className="text-xs text-white/70 mb-3">{count} sayfa bulundu</div>

      <div className="flex gap-2">
        <button
          onClick={copySitemapToClipboard}
          className="px-3 py-2 bg-white text-slate-950 text-xs rounded-xl hover:bg-slate-50 transition-colors font-semibold"
        >
          XML Kopyala
        </button>

        <button
          onClick={downloadSitemap}
          className="px-3 py-2 bg-slate-900 text-white text-xs rounded-xl hover:bg-slate-800 transition-colors font-semibold border border-white/10"
        >
          İndir
        </button>
      </div>

      <div className="mt-3 text-[11px] text-white/55">
        Not: Bu araç sadece development ortamında görünür.
      </div>
    </div>
  );
}
