// =============================================================
// FILE: src/components/public/CemeteriesPage.tsx
// =============================================================
"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft, MapPin, Phone, Clock, Search, Filter,
  ExternalLink, ChevronDown, ChevronUp
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

import {
  useListCemeteriesQuery,
  useListCemeteryDistrictsQuery,
  useListCemeteryTypesQuery,
} from "@/integrations/rtk/endpoints/cemeteries.endpoints";
import type { ListParams } from "@/integrations/rtk/endpoints/cemeteries.endpoints";
import type { Cemeteries as CemeteryView } from "@/integrations/rtk/types/cemeteries";

import {
  cemeteriesData,
  getAllDistricts,
  type CemeteryData,
} from "@/data/cemeteriesData";

/* ------------ Types for regional static list (prevents 'anadolu' error) ------------ */
type Region = { title: string; districts: { name: string; cemeteries: string[] }[] };
type IstanbulRegions = { anadolu: { regions: Region[] }; avrupa: { regions: Region[] } };

/* ------------ Component ------------ */
type Props = { onNavigate: (page: string) => void };
type Tab = "mudurlukler" | "mezarliklar";
type UCemetery = CemeteryView | CemeteryData;

export function CemeteriesPage({ onNavigate }: Props) {
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState<Tab>("mudurlukler");
  const [openDistricts, setOpenDistricts] = useState<Record<string, boolean>>({});

  // ---- RTK meta (ilçeler / türler) + fallback
  const { data: districtsRtk = [], isLoading: loadingDistricts } = useListCemeteryDistrictsQuery();
  const { data: typesRtk = [], isLoading: loadingTypes } = useListCemeteryTypesQuery();

  const districts = (districtsRtk?.length ? districtsRtk : getAllDistricts()).slice().sort();
  const typesFallback = useMemo(
    () => Array.from(new Set(cemeteriesData.map((c) => c.type))).sort(),
    []
  );
  const types = (typesRtk?.length ? typesRtk : typesFallback).slice().sort();

  // ---- RTK list params (server-side filter) - NO 'undefined' fields!
  const listParams = useMemo<ListParams>(() => {
    const out: ListParams = { active: true, limit: 200, offset: 0 };
    if (searchTerm.trim()) out.search = searchTerm.trim();
    if (selectedDistrict !== "all") out.district = selectedDistrict;
    if (selectedType !== "all") out.type = selectedType;
    return out;
  }, [searchTerm, selectedDistrict, selectedType]);

  const {
    data: rtkList = [],
    isLoading: loadingList,
    isError: errorList,
  } = useListCemeteriesQuery(listParams);

  // ---- Fallback veride client-side filtre
  const fallbackFiltered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return cemeteriesData.filter((cem) => {
      const matchesSearch =
        !q ||
        cem.name.toLowerCase().includes(q) ||
        cem.address.toLowerCase().includes(q) ||
        cem.district.toLowerCase().includes(q);

      const matchesDistrict = selectedDistrict === "all" || cem.district === selectedDistrict;
      const matchesType = selectedType === "all" || cem.type === selectedType;

      return matchesSearch && matchesDistrict && matchesType;
    });
  }, [searchTerm, selectedDistrict, selectedType]);

  // ---- Nihai liste: RTK varsa onu kullan, yoksa fallback
  const cemList: UCemetery[] = (rtkList?.length ? rtkList : fallbackFiltered) as UCemetery[];
  const cemListAny = cemList as any[]; // UI alanları mixed tiplerde olabilir

  const handlePhoneCall = (phone: string) => {
    const clean = (phone || "").replace(/[^\d+]/g, "");
    if (clean) window.open(`tel:${clean}`, "_self");
  };

  const handleMapDirection = (address?: string, name?: string) => {
    const query = encodeURIComponent(`${name ?? ""} ${address ?? ""}`.trim());
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "Bölge Müdürlüğü":
        return "bg-teal-100 text-teal-800 border-teal-300";
      case "Bölge Müdür Yardımcılığı":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Cenaze İşleri Şefliği":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Destek Hizmetleri Müdürlüğü":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Araç İşletme Şefliği":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // ----- İstanbul yakaları statik organizasyon (tipli)
  const mezarliklar: IstanbulRegions = {
    anadolu: {
      regions: [
        {
          title: "İSTANBUL ANADOLU YAKASI 1. BÖLGE MEZARLIKLAR LİSTESİ",
          districts: [
            {
              name: "Üsküdar ilçesine bağlı mezarlıklar",
              cemeteries: [
                "Karaca Ahmet Mezarlığı",
                "Karacaahmet Sultan Mezarlığı",
                "Bülbülderesi Mezarlığı",
                "Duatepe Mezarlığı",
                "Nakkaştepe Mezarlığı",
                "Altunizade Mezarlığı",
                "Acıbadem Mezarlığı",
              ],
            },
            {
              name: "Kadıköy ilçesine bağlı mezarlıklar",
              cemeteries: ["Kadıköy Mezarlığı", "Fenerbahçe Mezarlığı"],
            },
            {
              name: "Beykoz ilçesine bağlı mezarlıklar",
              cemeteries: ["Beykoz Mezarlığı", "Kavacık Mezarlığı"],
            },
            {
              name: "Şile ilçesine bağlı mezarlıklar",
              cemeteries: ["Şile Balibey Mezarlığı", "Şile Merkez Mezarlığı"],
            },
            { name: "Ümraniye ilçesine bağlı mezarlıklar", cemeteries: ["Ümraniye Mezarlığı"] },
            { name: "Ataşehir ilçesine bağlı mezarlıklar", cemeteries: ["Ataşehir Mezarlığı"] },
          ],
        },
        {
          title: "İSTANBUL ANADOLU YAKASI 2. BÖLGE MEZARLIKLAR LİSTESİ",
          districts: [
            { name: "Kartal ilçesine bağlı mezarlıklar", cemeteries: ["Soğanlık Mezarlığı", "Soğanlık Yeni Mezarlığı"] },
            { name: "Pendik ilçesine bağlı mezarlıklar", cemeteries: ["Pendik Mezarlığı"] },
            { name: "Maltepe ilçesine bağlı mezarlıklar", cemeteries: ["Maltepe Mezarlığı"] },
            { name: "Tuzla ilçesine bağlı mezarlıklar", cemeteries: ["Tuzla Mezarlığı"] },
            { name: "Sultanbeyli ilçesine bağlı mezarlıklar", cemeteries: ["Sultanbeyli F.S.M Mezarlığı"] },
            { name: "Sancaktepe ilçesine bağlı mezarlıklar", cemeteries: ["Sancaktepe Mezarlığı"] },
          ],
        },
        {
          title: "İSTANBUL ANADOLU YAKASI 3. BÖLGE MEZARLIKLAR LİSTESİ",
          districts: [{ name: "Çekmeköy ilçesine bağlı mezarlıklar", cemeteries: ["Çekmeköy Mezarlığı", "Yeni Çekmeköy Mezarlığı"] }],
        },
      ],
    },
    avrupa: {
      regions: [
        {
          title: "İSTANBUL AVRUPA YAKASI 1. BÖLGE MEZARLIKLAR LİSTESİ",
          districts: [
            { name: "Eyüp ilçesine bağlı mezarlıklar", cemeteries: ["Eyüp Sultan Mezarlığı"] },
            { name: "Zeytinburnu ilçesine bağlı mezarlıklar", cemeteries: ["Zeytinburnu Mezarlığı"] },
            { name: "Gaziosmanpaşa ilçesine bağlı mezarlıklar", cemeteries: ["Gaziosmanpaşa Mezarlığı"] },
            { name: "Sultangazi ilçesine bağlı mezarlıklar", cemeteries: ["Sultangazi Mezarlığı"] },
            { name: "Bayrampaşa ilçesine bağlı mezarlıklar", cemeteries: ["500 Evler Mezarlığı"] },
            { name: "Esenler ilçesine bağlı mezarlıklar", cemeteries: ["Esenler Mezarlığı"] },
            { name: "Fatih ilçesine bağlı mezarlıklar", cemeteries: ["Edirnekapı Mezarlığı", "Fatih Mezarlığı", "Eminönü Mezarlığı"] },
          ],
        },
        {
          title: "İSTANBUL AVRUPA YAKASI 2. BÖLGE MEZARLIKLAR LİSTESİ",
          districts: [
            { name: "Büyükçekmece ilçesine bağlı mezarlıklar", cemeteries: ["Büyükçekmece Mezarlığı", "Büyükçekmece Yeni Mezarlığı"] },
            { name: "Esenyurt ilçesine bağlı mezarlıklar", cemeteries: ["Esenyurt Mezarlığı"] },
            { name: "Güngören ilçesine bağlı mezarlıklar", cemeteries: ["Güngören Mezarlığı"] },
            { name: "Küçükçekmece ilçesine bağlı mezarlıklar", cemeteries: ["Küçükçekmece Mezarlığı"] },
          ],
        },
        {
          title: "İSTANBUL AVRUPA YAKASI 3. BÖLGE MEZARLIKLAR LİSTESİ",
          districts: [
            { name: "Şişli ilçesine bağlı mezarlıklar", cemeteries: ["Zincirlikuyu Mezarlığı", "Mecidiyeköy Mezarlığı", "Şişli Mezarlığı", "Nişantaşı Mezarlığı"] },
            { name: "Beşiktaş ilçesine bağlı mezarlıklar", cemeteries: ["Beşiktaş Mezarlığı", "Ortaköy Mezarlığı", "Etiler Mezarlığı", "Levent Mezarlığı"] },
            {
              name: "Sarıyer ilçesine bağlı mezarlıklar",
              cemeteries: ["Kilyos Mezarlığı", "Kilyos Ruhi Su Mezarlığı", "Sarıyer Mezarlığı", "Büyükdere Mezarlığı", "Zekeriyaköy Mezarlığı", "Tarabya Mezarlığı"],
            },
            { name: "Kağıthane ilçesine bağlı mezarlıklar", cemeteries: ["Kağıthane Mezarlığı"] },
          ],
        },
        {
          title: "İSTANBUL AVRUPA YAKASI 4. BÖLGE MEZARLIKLAR LİSTESİ",
          districts: [
            { name: "Bahçelievler ilçesine bağlı mezarlıklar", cemeteries: ["Bahçelievler Mezarlığı"] },
            { name: "Bakırköy ilçesine bağlı mezarlıklar", cemeteries: ["Bakırköy Mezarlığı", "Yeşilköy Mezarlığı"] },
            { name: "Avcılar ilçesine bağlı mezarlıklar", cemeteries: ["Avcılar Mezarlığı"] },
            { name: "Beylikdüzü ilçesine bağlı mezarlıklar", cemeteries: ["Beylikdüzü Mezarlığı"] },
            { name: "Başakşehir ilçesine bağlı mezarlıklar", cemeteries: ["Başakşehir Mezarlığı"] },
            { name: "Bağcılar ilçesine bağlı mezarlıklar", cemeteries: ["Bağcılar Mezarlığı"] },
          ],
        },
        {
          title: "İSTANBUL AVRUPA YAKASI 5. BÖLGE MEZARLIKLAR LİSTESİ",
          districts: [
            { name: "Beyoğlu ilçesine bağlı mezarlıklar", cemeteries: ["Beyoğlu Mezarlığı", "Galata Mezarlığı", "Kasımpaşa Mezarlığı"] },
            { name: "Arnavutköy ilçesine bağlı mezarlıklar", cemeteries: ["Arnavutköy Asri Mezarlığı"] },
            { name: "Silivri ilçesine bağlı mezarlıklar", cemeteries: ["Silivri Mezarlığı", "Silivri Yeni Mezarlığı"] },
            { name: "Çatalca ilçesine bağlı mezarlıklar", cemeteries: ["Çatalca Mezarlığı"] },
          ],
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("home")}
                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Ana Sayfa
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {activeTab === "mudurlukler" ? "Mezarlık Müdürlükleri" : "İstanbul Mezarlıkları"}
                </h1>
                <p className="text-sm text-gray-500">
                  {activeTab === "mudurlukler" ? "Adres ve İletişim Bilgileri" : "Anadolu ve Avrupa Yakası"}
                </p>
              </div>
            </div>

            <Badge variant="outline" className="text-teal-700 border-teal-300">
              {activeTab === "mudurlukler"
                ? (loadingList ? "Yükleniyor…" : `${cemList.length} Birim`)
                : `${mezarliklar.anadolu.regions.reduce(
                  (t, r) => t + r.districts.reduce((dt, d) => dt + d.cemeteries.length, 0),
                  0
                ) +
                mezarliklar.avrupa.regions.reduce(
                  (t, r) => t + r.districts.reduce((dt, d) => dt + d.cemeteries.length, 0),
                  0
                )
                } Mezarlık`}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("mudurlukler")}
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === "mudurlukler" ? "bg-teal-600 text-white" : "text-gray-600 hover:text-gray-800"
                }`}
            >
              Mezarlık Müdürlükleri
            </button>
            <button
              onClick={() => setActiveTab("mezarliklar")}
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === "mezarliklar" ? "bg-teal-600 text-white" : "text-gray-600 hover:text-gray-800"
                }`}
            >
              İstanbul Mezarlıkları
            </button>
          </div>
        </div>

        {activeTab === "mudurlukler" && (
          <>
            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Müdürlük, adres veya ilçe ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={loadingDistricts ? "Yükleniyor…" : "İlçe"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm İlçeler</SelectItem>
                      {districts.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={loadingTypes ? "Yükleniyor…" : "Birim Türü"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Birimler</SelectItem>
                      {types.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Error note (fallback) */}
            {errorList && (
              <div className="text-sm text-red-600 mb-4">
                Liste yüklenemedi. Yerel veriden gösteriliyor.
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cemListAny.map((cem) => (
                <Card key={cem.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                          {cem.name}
                        </CardTitle>
                        <Badge className={`text-xs ${getTypeColor(cem.type)}`}>
                          {cem.type}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-teal-700 border-teal-300">
                        {cem.district}
                      </Badge>
                    </div>
                    {cem.description && (
                      <CardDescription className="text-sm text-gray-600 mt-2">
                        {cem.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{cem.address}</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-teal-600 hover:text-teal-700"
                          onClick={() => handleMapDirection(cem.address, cem.name)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Haritada Görüntüle
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-teal-600 flex-shrink-0" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-gray-700">{cem.phone}</span>
                        {cem.phone && (
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 h-auto text-xs"
                            onClick={() => handlePhoneCall(cem.phone)}
                          >
                            Ara
                          </Button>
                        )}
                      </div>
                    </div>

                    {cem.fax && (
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs text-gray-500">Fax: {cem.fax}</span>
                      </div>
                    )}

                    {cem.workingHours && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-teal-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{cem.workingHours}</span>
                      </div>
                    )}

                    {Array.isArray(cem.services) && cem.services.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">Hizmetler:</h4>
                        <div className="flex flex-wrap gap-1">
                          {cem.services.map((s: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(cem.accessibility || cem.transportation) && (
                      <div className="pt-2 border-t space-y-1">
                        {cem.accessibility && (
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Erişim:</span> {cem.accessibility}
                          </p>
                        )}
                        {cem.transportation && (
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Ulaşım:</span> {cem.transportation}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No results */}
            {!loadingList && cemListAny.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sonuç Bulunamadı</h3>
                <p className="text-gray-500">Arama kriterlerinize uygun mezarlık müdürlüğü bulunamadı.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDistrict("all");
                    setSelectedType("all");
                  }}
                  className="mt-4"
                >
                  Filtreleri Temizle
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {rtkList?.length || cemeteriesData.length}
                </div>
                <div className="text-sm text-gray-500">Toplam Birim</div>
              </div>
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-blue-600">{districts.length}</div>
                <div className="text-sm text-gray-500">İlçe</div>
              </div>
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-purple-600">{types.length}</div>
                <div className="text-sm text-gray-500">Birim Türü</div>
              </div>
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-500">Acil Hizmet</div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-8 bg-teal-50 border border-teal-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-teal-900 mb-2">İletişim ve Bilgi</h3>
              <p className="text-sm text-teal-700 mb-4">
                Mezarlık hizmetleri ile ilgili detaylı bilgi almak ve randevu oluşturmak için
                yukarıdaki birimlerle direkt iletişime geçebilirsiniz.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-teal-700">
                <div><span className="font-medium">Acil Durumlar:</span> 24 saat hizmet veren birimler mevcuttur</div>
                <div><span className="font-medium">Mesai Saatleri:</span> Hafta içi 08:00 - 17:00</div>
              </div>
            </div>
          </>
        )}

        {/* --- “İstanbul Mezarlıkları” sekmesi --- */}
        {activeTab === "mezarliklar" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                İstanbul İl Genelinde Bulunan Mezarlıklar
              </h2>
              <p className="text-gray-600 mb-6">
                İstanbul'da ilçelere göre organize edilmiş mezarlık listesi.
                Aşağıdaki bölgelerden ilgili ilçedeki mezarlıkları inceleyebilirsiniz.
              </p>

              {/* Anadolu Yakası */}
              <div className="space-y-4">
                {mezarliklar.anadolu.regions.map((region, regionIndex) => (
                  <div key={`anadolu-${regionIndex}`} className="space-y-2">
                    <div className="bg-teal-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-6 bg-teal-600 rounded-sm" />
                        <h3 className="text-teal-900 font-bold text-sm uppercase">{region.title}</h3>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {region.districts.map((district, districtIndex) => {
                        const districtKey = `anadolu-${regionIndex}-${districtIndex}`;
                        const isOpen = openDistricts[districtKey] || false;

                        return (
                          <div key={districtKey} className="bg-gray-100 rounded-md overflow-hidden">
                            <button
                              onClick={() =>
                                setOpenDistricts(prev => ({ ...prev, [districtKey]: !prev[districtKey] }))
                              }
                              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-150 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                <span className="text-sm text-gray-800">{district.name}</span>
                              </div>
                              {isOpen ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </button>

                            {isOpen && (
                              <div className="px-6 pb-3 space-y-1">
                                {district.cemeteries.map((cemetery, cemeteryIndex) => (
                                  <div key={cemeteryIndex} className="text-sm text-gray-700 pl-4">
                                    • {cemetery}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Avrupa Yakası */}
              <div className="space-y-4 mt-8">
                {mezarliklar.avrupa.regions.map((region, regionIndex) => (
                  <div key={`avrupa-${regionIndex}`} className="space-y-2">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-6 bg-blue-600 rounded-sm" />
                        <h3 className="text-blue-900 font-bold text-sm uppercase">{region.title}</h3>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {region.districts.map((district, districtIndex) => {
                        const districtKey = `avrupa-${regionIndex}-${districtIndex}`;
                        const isOpen = openDistricts[districtKey] || false;

                        return (
                          <div key={districtKey} className="bg-gray-100 rounded-md overflow-hidden">
                            <button
                              onClick={() =>
                                setOpenDistricts(prev => ({ ...prev, [districtKey]: !prev[districtKey] }))
                              }
                              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-150 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                <span className="text-sm text-gray-800">{district.name}</span>
                              </div>
                              {isOpen ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </button>

                            {isOpen && (
                              <div className="px-6 pb-3 space-y-1">
                                {district.cemeteries.map((cemetery, cemeteryIndex) => (
                                  <div key={cemeteryIndex} className="text-sm text-gray-700 pl-4">
                                    • {cemetery}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Özet Bilgiler */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {mezarliklar.anadolu.regions.reduce(
                      (total, region) => total + region.districts.reduce((distTotal, d) => distTotal + d.cemeteries.length, 0),
                      0
                    )}
                  </div>
                  <div className="text-sm text-teal-700">Anadolu Yakası</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {mezarliklar.avrupa.regions.reduce(
                      (total, region) => total + region.districts.reduce((distTotal, d) => distTotal + d.cemeteries.length, 0),
                      0
                    )}
                  </div>
                  <div className="text-sm text-blue-700">Avrupa Yakası</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {mezarliklar.anadolu.regions.reduce(
                      (total, region) => total + region.districts.reduce((distTotal, d) => distTotal + d.cemeteries.length, 0),
                      0
                    ) +
                      mezarliklar.avrupa.regions.reduce(
                        (total, region) => total + region.districts.reduce((distTotal, d) => distTotal + d.cemeteries.length, 0),
                        0
                      )}
                  </div>
                  <div className="text-sm text-gray-700">Toplam</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
