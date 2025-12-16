"use client";

import React, { useMemo } from "react";
import { ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

type QuickLink = { title: string; path: string; pageKey?: string };

const safeParseJson = <T,>(v: unknown, fallback: T): T => {
  try {
    if (v == null) return fallback;
    if (typeof v === "string") return JSON.parse(v) as T;
    return v as T;
  } catch {
    return fallback;
  }
};

export function Footer({ onNavigate }: FooterProps) {
  const navigate = useNavigate();

  const { data: settings } = useListSiteSettingsQuery({
    keys: [
      "brand_name",
      "brand_tagline",
      "footer_services",
      "footer_quick_links",
      "footer_keywords",
      "contact_phone_display",
      "contact_phone_tel",
      "contact_email",
      "contact_address",
      "site_version",
      "admin_path",
    ],
  });

  const get = (k: string, d: any) => settings?.find((s) => s.key === k)?.value ?? d;

  const brandName = String(get("brand_name", "X Emlak"));
  const brandTagline = String(get("brand_tagline", "güvenilir gayrimenkul danışmanlığı"));

  const services = useMemo(() => {
    const fallback = [
      "Satış Danışmanlığı",
      "Kiralama Danışmanlığı",
      "Ücretsiz Ön Değerleme",
      "Pazarlama ve İlan Yönetimi",
    ];
    return safeParseJson<string[]>(get("footer_services", fallback), fallback);
  }, [settings]);

  const quickLinks = useMemo(() => {
    const fallback: QuickLink[] = [
      { title: "Anasayfa", path: "/", pageKey: "home" },
      { title: "Emlaklar", path: "/emlaklar", pageKey: "properties" },
      { title: "Hakkımızda", path: "/hakkimizda", pageKey: "about" },
      { title: "İletişim", path: "/iletisim", pageKey: "contact" },
    ];
    return safeParseJson<QuickLink[]>(get("footer_quick_links", fallback), fallback);
  }, [settings]);

  const keywords = useMemo(() => {
    const fallback = [
      "Gayrimenkul Danışmanlığı",
      "Satılık Daire",
      "Kiralık Daire",
      "Satılık Arsa",
      "Ticari Gayrimenkul",
      "Emlak Değerleme",
      "Emsal Analizi",
      "Güvenli Alım Satım",
    ];
    return safeParseJson<string[]>(get("footer_keywords", fallback), fallback);
  }, [settings]);

  const phoneDisplay = String(get("contact_phone_display", "+49 000 000000"));
  const phoneTel = String(get("contact_phone_tel", "+49000000000"));
  const email = String(get("contact_email", "info@xemlak.com"));
  const address = String(
    get("contact_address", "Örnek Mah. Örnek Cad. No:1, 41460 Grevenbroich, Almanya"),
  );

  const version = String(get("site_version", "1.0.0"));
  const adminPath = String(get("admin_path", "/adminkontrol"));

  const go = (path: string, pageKey?: string) => {
    if (!path) return;
    if (pageKey && onNavigate) onNavigate(pageKey);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative">
      {/* Scroll to Top */}
      <div className="bg-slate-950 py-4 flex justify-center">
        <button
          onClick={scrollToTop}
          className="bg-white hover:bg-gray-100 border border-slate-300 rounded-full p-3 shadow-sm hover:shadow-md transition-all duration-200 group"
          aria-label="Sayfa başına git"
        >
          <ChevronUp className="w-6 h-6 text-slate-700 group-hover:text-slate-900 transition-colors" />
        </button>
      </div>

      <footer className="bg-slate-900 text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-2">
              <h3 className="text-lg md:text-xl mb-2 text-white font-semibold">{brandName}</h3>
              <p className="text-slate-200 text-sm leading-relaxed font-medium">
                {brandTagline}. Satış/kiralama süreçlerinde şeffaf yönetim, doğru fiyatlama ve profesyonel
                pazarlama desteği.
              </p>

              {/* Opsiyonel Admin link */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => go(adminPath)}
                  className="text-xs text-slate-300 hover:text-white underline underline-offset-4"
                >
                  Admin Panel
                </button>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-base md:text-lg mb-3 text-white font-semibold">Hizmetler</h4>
              <ul className="space-y-1 text-sm text-slate-200">
                {services.map((t) => (
                  <li key={t} className="hover:text-white transition-colors font-medium cursor-default">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base md:text-lg mb-3 text-white font-semibold">Hızlı Linkler</h4>
              <ul className="space-y-1 text-sm text-slate-200">
                {quickLinks.map((l) => (
                  <li key={l.title}>
                    <button
                      type="button"
                      onClick={() => go(l.path, l.pageKey)}
                      className="hover:text-white transition-colors cursor-pointer text-left font-medium"
                    >
                      {l.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-base md:text-lg mb-3 text-white font-semibold">İletişim</h4>
              <div className="text-sm text-slate-200 space-y-2">
                <p className="flex items-center space-x-2">
                  <span>📞</span>
                  <a href={`tel:${phoneTel}`} className="hover:text-white transition-colors font-medium">
                    {phoneDisplay}
                  </a>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📧</span>
                  <a href={`mailto:${email}`} className="font-medium hover:text-white transition-colors">
                    {email}
                  </a>
                </p>
                <p className="flex items-start space-x-2">
                  <span>📍</span>
                  <span className="leading-relaxed font-medium text-slate-200">{address}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <h4 className="text-base md:text-lg mb-3 text-white font-semibold">Anahtar Kelimeler</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-1 text-xs md:text-sm text-slate-200">
              {keywords.map((k) => (
                <p key={k} className="hover:text-white transition-colors font-medium cursor-default">
                  {k}
                </p>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-slate-800 mt-6 pt-6 text-center">
            <p className="text-sm text-slate-200 font-medium">
              &copy; {new Date().getFullYear()} {brandName}. Tüm hakları saklıdır. <span className="text-slate-400">v{version}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
