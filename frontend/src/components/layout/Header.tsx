"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

type HeaderMenuItem = {
  title: string;
  path: string;
  pageKey?: string;
  type?: "link" | "dropdown" | "cta";
  /** dropdown ise: site_settings içindeki liste key’i (menu_kurumsal vs) */
  itemsKey?: "menu_kurumsal" | "menu_other_services" | string;
};

type DropdownItem = { title: string; path: string; pageKey?: string };

interface HeaderProps {
  /** Eski kullanım varsa bozulmasın diye bıraktım; artık aktiflikte pathname kullanıyoruz. */
  currentPage: string;
  onNavigate: (page: string) => void;
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

const safeParseJson = <T,>(v: unknown, fallback: T): T => {
  try {
    if (v == null) return fallback;

    // bazı BE’ler value’yu string JSON olarak döndürür
    if (typeof v === "string") return JSON.parse(v) as T;

    // bazıları zaten obj/array döndürür
    return v as T;
  } catch {
    return fallback;
  }
};

export function Header({ currentPage: _currentPage, onNavigate, onSearch, searchTerm }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: settings } = useListSiteSettingsQuery({
    keys: [
      "brand_name",
      "brand_tagline",
      "header_info_text",
      "header_cta_label",
      "contact_phone_display",
      "contact_phone_tel",

      // MENÜ
      "header_menu",
      "header_menu_right",
      "menu_kurumsal",
      "menu_other_services",
    ],
  });

  const get = (k: string, d: any) => settings?.find((s) => s.key === k)?.value ?? d;

  const brandName = String(get("brand_name", "X Emlak"));
  const brandTagline = String(get("brand_tagline", "güvenilir gayrimenkul danışmanlığı"));
  const infoText = String(get("header_info_text", "Portföy ve danışmanlık için"));
  const ctaLabel = String(get("header_cta_label", "İLETİŞİME GEÇ"));
  const phoneDisplay = String(get("contact_phone_display", "+49 000 000000"));
  const phoneTel = String(get("contact_phone_tel", "+49000000000"));

  const headerMenu = useMemo(() => {
    const fallback: HeaderMenuItem[] = [
      { title: "ANASAYFA", path: "/", pageKey: "home", type: "link" },
      { title: "EMLAKLAR", path: "/emlaklar", pageKey: "properties", type: "link" },
      { title: "KURUMSAL", path: "#", pageKey: "kurumsal", type: "dropdown", itemsKey: "menu_kurumsal" },
      { title: "HİZMETLER", path: "#", pageKey: "services", type: "dropdown", itemsKey: "menu_other_services" },
      { title: "İLETİŞİM", path: "/iletisim", pageKey: "contact", type: "link" },
    ];
    return safeParseJson<HeaderMenuItem[]>(get("header_menu", fallback), fallback);
  }, [settings]);

  const headerMenuRight = useMemo(() => {
    const fallback: HeaderMenuItem[] = [];
    return safeParseJson<HeaderMenuItem[]>(get("header_menu_right", fallback), fallback);
  }, [settings]);

  const menuKurumsal = useMemo(() => {
    const fallback: DropdownItem[] = [
      { title: "HAKKIMIZDA", path: "/hakkimizda", pageKey: "about" },
      { title: "MİSYONUMUZ - VİZYONUMUZ", path: "/misyon-vizyon", pageKey: "mission" },
      { title: "KALİTE POLİTİKAMIZ", path: "/kalite-politikamiz", pageKey: "quality" },
      { title: "S.S.S.", path: "/sss", pageKey: "faq" },
    ];
    return safeParseJson<DropdownItem[]>(get("menu_kurumsal", fallback), fallback);
  }, [settings]);

  const menuOtherServices = useMemo(() => {
    const fallback: DropdownItem[] = [
      { title: "ÜCRETSİZ ÖN DEĞERLEME", path: "/ucretsiz-degerleme", pageKey: "free_valuation" },
      { title: "PORTFÖY SUNUMU", path: "/emlaklar", pageKey: "properties" },
    ];
    return safeParseJson<DropdownItem[]>(get("menu_other_services", fallback), fallback);
  }, [settings]);

  const dropdownItemsForKey = (key?: string): DropdownItem[] => {
    if (!key) return [];
    if (key === "menu_kurumsal") return menuKurumsal;
    if (key === "menu_other_services") return menuOtherServices;

    // İstersen ileride generic dropdown listeleri de buradan çekebilirsin:
    // return safeParseJson<DropdownItem[]>(get(key, []), []);
    return [];
  };

  // ===== UI state =====
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<Record<string, boolean>>({});
  const [openDesktopDropdownKey, setOpenDesktopDropdownKey] = useState<string | null>(null);

  useEffect(() => setLocalSearchTerm(searchTerm), [searchTerm]);

  const go = (path: string) => {
    if (!path || path === "#") return;
    onNavigate(path);
    navigate(path);
  };

  const handleSearch = () => onSearch(localSearchTerm);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((v) => !v);
    if (isMobileMenuOpen) setOpenMobileDropdowns({});
  };

  const toggleMobileDropdown = (key: string) => {
    setOpenMobileDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDesktopDropdown = (key: string) => {
    setOpenDesktopDropdownKey((prev) => (prev === key ? null : key));
  };

  const closeDesktopDropdowns = () => setOpenDesktopDropdownKey(null);

  const isActivePath = (path: string) => {
    if (!path || path === "#") return false;
    return location.pathname === path;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocalSearchTerm(e.target.value);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // Close dropdowns on outside click + ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const inside = target.closest("[data-dropdown]");
      if (!inside) closeDesktopDropdowns();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDesktopDropdowns();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="bg-white relative">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="bg-slate-900 text-white py-1.5">
          <div className="px-4">
            <div className="flex items-center justify-center space-x-2 text-xs">
              <span className="text-white">{infoText}</span>
              <a href={`tel:${phoneTel}`} className="hover:text-slate-200 transition-colors whitespace-nowrap">
                {phoneDisplay}
              </a>
              <button
                onClick={() => (window.location.href = `tel:${phoneTel}`)}
                className="bg-white text-slate-900 px-2 py-0.5 rounded text-xs hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 font-medium transform active:scale-95 shadow-sm hover:shadow-md whitespace-nowrap"
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-4">
          <div className="flex items-center mb-4 cursor-pointer" onClick={() => go("/")}>
            <div className="w-12 h-8 bg-slate-900 rounded mr-3 flex items-center justify-center">
              <div className="w-8 h-6 bg-white rounded-sm relative">
                <div className="absolute inset-1 bg-slate-900 rounded-sm" />
              </div>
            </div>
            <div>
              <h1 className="text-xl text-slate-900 font-bold">{brandName}</h1>
              <p className="text-xs text-gray-500">{brandTagline}</p>
            </div>
          </div>

          <div className="flex mb-4">
            <input
              type="text"
              value={localSearchTerm}
              onChange={handleInputChange}
              placeholder="Aradığınız ilan başlığını yazınız"
              className="flex-1 px-3 py-2 border-2 border-slate-900 rounded-l focus:outline-none focus:border-slate-800 text-sm"
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSearch}
              className="bg-slate-900 text-white px-4 py-2 rounded-r hover:bg-slate-800 active:bg-slate-950 transition-colors text-sm font-medium"
            >
              ARA
            </button>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="w-full bg-slate-900 text-white py-3 rounded flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="font-medium">{isMobileMenuOpen ? "KAPAT" : "MENÜ"}</span>
          </button>
        </div>

        <div
          className={`bg-slate-900 border-t border-slate-700 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="px-4 py-2">
            {headerMenu.map((item) => {
              const key = item.pageKey || item.title;
              const isDropdown = item.type === "dropdown" && item.itemsKey;
              const items = isDropdown ? dropdownItemsForKey(item.itemsKey) : [];
              const isOpen = !!openMobileDropdowns[key];

              if (!isDropdown) {
                return (
                  <button
                    key={key}
                    onClick={() => {
                      go(item.path);
                      setIsMobileMenuOpen(false);
                      setOpenMobileDropdowns({});
                    }}
                    className={`w-full text-left py-3 px-2 border-b border-slate-700 font-medium text-white hover:bg-slate-800 transition-colors ${isActivePath(item.path) ? "bg-slate-800" : ""
                      }`}
                  >
                    {item.title}
                  </button>
                );
              }

              return (
                <div key={key} className="border-b border-slate-700">
                  <button
                    onClick={() => toggleMobileDropdown(key)}
                    className={`w-full flex items-center justify-between py-3 px-2 font-medium text-white hover:bg-slate-800 transition-colors ${isOpen ? "bg-slate-800" : ""
                      }`}
                  >
                    <span>{item.title}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="pl-4 pb-2">
                      {items.map((c) => (
                        <button
                          key={c.title}
                          onClick={() => {
                            go(c.path);
                            setIsMobileMenuOpen(false);
                            setOpenMobileDropdowns({});
                          }}
                          className={`block w-full text-left py-2 px-2 text-sm text-white hover:bg-slate-800 transition-colors ${isActivePath(c.path) ? "bg-slate-800" : ""
                            }`}
                        >
                          {c.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="bg-slate-900 text-white py-2">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="text-white font-semibold">{infoText}</span>
              <a href={`tel:${phoneTel}`} className="hover:text-slate-200 transition-colors font-bold whitespace-nowrap">
                {phoneDisplay}
              </a>
              <button
                onClick={() => (window.location.href = `tel:${phoneTel}`)}
                className="bg-white text-slate-900 px-4 py-1.5 rounded text-sm font-bold hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 transform active:scale-95 shadow-sm hover:shadow-md whitespace-nowrap"
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white py-6 border-b border-gray-200">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center cursor-pointer" onClick={() => go("/")}>
                <div className="w-16 h-10 bg-slate-900 rounded mr-4 flex items-center justify-center">
                  <div className="w-10 h-7 bg-white rounded-sm relative">
                    <div className="absolute inset-1 bg-slate-900 rounded-sm" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl text-slate-900 font-bold">{brandName}</h1>
                  <p className="text-sm text-gray-500">{brandTagline}</p>
                </div>
              </div>

              <div className="flex-1 max-w-md ml-8">
                <div className="flex">
                  <input
                    type="text"
                    value={localSearchTerm}
                    onChange={handleInputChange}
                    placeholder="Aradığınız ilan başlığını yazınız"
                    className="flex-1 px-4 py-3 border-2 border-slate-900 rounded-l focus:outline-none focus:border-slate-800"
                    onKeyDown={handleKeyPress}
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-slate-900 text-white px-6 py-3 rounded-r hover:bg-slate-800 active:bg-slate-950 transition-colors font-bold"
                  >
                    ARA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="bg-slate-900 text-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1">
                {headerMenu.map((item) => {
                  const key = item.pageKey || item.title;
                  const isDropdown = item.type === "dropdown" && item.itemsKey;
                  const items = isDropdown ? dropdownItemsForKey(item.itemsKey) : [];
                  const isOpen = openDesktopDropdownKey === key;

                  if (!isDropdown) {
                    return (
                      <button
                        key={key}
                        onClick={() => go(item.path)}
                        className={`py-3 px-4 hover:bg-slate-800 transition-colors text-sm uppercase font-bold whitespace-nowrap ${isActivePath(item.path) ? "bg-slate-800" : ""
                          }`}
                      >
                        {item.title}
                      </button>
                    );
                  }

                  return (
                    <div key={key} className="relative" data-dropdown={`dd-${key}`}>
                      <button
                        onClick={() => toggleDesktopDropdown(key)}
                        className={`py-3 px-4 hover:bg-slate-800 transition-colors text-sm uppercase font-bold whitespace-nowrap flex items-center space-x-1 ${isOpen ? "bg-slate-800" : ""
                          }`}
                      >
                        <span>{item.title}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="absolute top-full left-0 bg-slate-900 border-2 border-slate-800 shadow-xl rounded-b-lg min-w-[240px] z-50">
                          {items.map((c, i) => {
                            const isLast = i === items.length - 1;
                            return (
                              <button
                                key={c.title}
                                onClick={() => {
                                  go(c.path);
                                  closeDesktopDropdowns();
                                }}
                                className={`block w-full text-left py-3 px-4 text-white hover:bg-slate-800 ${!isLast ? "border-b border-slate-800" : "rounded-b-lg"
                                  } text-sm font-bold uppercase transition-colors ${isActivePath(c.path) ? "bg-slate-800" : ""}`}
                              >
                                {c.title}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Sağ taraf CTA (opsiyonel) */}
                {headerMenuRight.length > 0 && (
                  <div className="ml-2 flex items-center">
                    {headerMenuRight.map((x) => (
                      <button
                        key={x.pageKey || x.title}
                        onClick={() => go(x.path)}
                        className="py-3 px-4 bg-white text-slate-900 hover:bg-gray-100 transition-colors text-sm uppercase font-extrabold whitespace-nowrap rounded"
                      >
                        {x.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
