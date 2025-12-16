// =============================================================
// FILE: src/components/public/ProductDetailPage.tsx
// =============================================================
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ArrowLeft, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import {
  useGetProductQuery,
  useListProductsQuery,
  useListProductFaqsQuery,
  useListProductSpecsQuery,
  useListProductReviewsQuery,
} from "@/integrations/rtk/endpoints/products.endpoints";

import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";
import { useCreateContactMutation } from "@/integrations/rtk/endpoints/contacts.endpoints";
import type { ContactCreateInput } from "@/integrations/rtk/types/contacts";

import {
  type Product as ApiProduct,
  type ProductReviewRow,
  type ProductSpecRow,
  type ProductFaqRow,
} from "@/integrations/rtk/types/products.rows";

// ---- specs normalize
function normalizeSpecs(specs: unknown): Record<string, string> {
  if (!specs) return {};
  if (typeof specs === "string") {
    try {
      const parsed = JSON.parse(specs);
      return normalizeSpecs(parsed);
    } catch {
      return {};
    }
  }
  if (Array.isArray(specs)) {
    const out: Record<string, string> = {};
    for (const it of specs as any[]) {
      if (it && typeof it === "object" && (it as any).name) {
        const v = (it as any).value;
        out[String((it as any).name)] = Array.isArray(v)
          ? v.join(", ")
          : v != null
          ? String(v)
          : "";
      }
    }
    return out;
  }
  if (typeof specs === "object") {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(specs as Record<string, any>)) {
      if (v == null) continue;
      out[k] = Array.isArray(v) ? v.join(", ") : String(v);
    }
    return out;
  }
  return {};
}

// ---- ApiProduct -> UI
type UiProduct = {
  id: string;
  slug?: string | null;
  title: string;
  productCode?: string | null;
  price: number | string;
  image: string;
  images: string[];
  description: string;
  category_id: string;
  specifications?: Record<string, string>;
};

function toUiProduct(p: ApiProduct): UiProduct {
  const imgs =
    (Array.isArray((p as any).images) ? (p as any).images.filter(Boolean) : null) ?? [];
  const primary = imgs[0] || (p as any).image_url || "";
  return {
    id: String(p.id),
    slug: (p as any).slug ?? null,
    title: String(p.title ?? ""),
    productCode: (p as any).product_code ?? null,
    price: typeof p.price === "number" ? p.price : Number(p.price) || 0,
    image: primary,
    images: imgs.length ? imgs : primary ? [primary] : [],
    description: (p as any).description ?? "",
    category_id: String((p as any).category_id ?? ""),
    specifications: normalizeSpecs((p as any).specifications),
  };
}

/* ---------- helpers: price format ---------- */
function formatPrice(price: number | string | null | undefined): string {
  const num = typeof price === "number" ? price : Number(price);

  // 0 veya geçersizse
  if (!Number.isFinite(num) || num <= 0) {
    return "Fiyat İçin Arayınız";
  }

  // Görseldeki gibi: 26400 TL (tam sayı, ayırıcı yok)
  const rounded = Math.round(num);
  return `${rounded} TL`;
}

interface ProductDetailPageProps {
  /** Route: /product/:slug  → burada gelen değer aslında SLUG */
  productId: string;
  onNavigate: (page: string) => void;
  /** Detaydan başka ürüne geçerken sadece slug ile çağrılır */
  onProductDetail?: (slug: string) => void;
}

/* ---------- helpers: site settings ---------- */
type SiteSettingLike = { key?: string; name?: string; value?: string | null };
function toSettingsMap(data: unknown): Record<string, string> {
  if (!data) return {};
  if (Array.isArray(data)) {
    const m: Record<string, string> = {};
    for (const it of data as SiteSettingLike[]) {
      const k = (it?.key ?? it?.name ?? "").toString();
      const v = (it?.value ?? "").toString();
      if (k) m[k] = v;
    }
    return m;
  }
  if (typeof data === "object") return data as Record<string, string>;
  return {};
}
function sanitizePhoneDigits(s: string): string {
  return (s || "").replace(/[^\d]/g, "");
}
function buildTelHref(raw: string): string {
  const trimmed = (raw || "").replace(/\s+/g, "");
  if (trimmed.startsWith("+")) return `tel:${trimmed}`;
  const digits = sanitizePhoneDigits(trimmed);
  let intl = digits;
  if (digits.startsWith("90")) intl = digits;
  else if (digits.startsWith("0")) intl = `9${digits}`; // -> 90...
  else if (digits.length === 10) intl = `90${digits}`;
  return `tel:+${intl}`;
}
function buildWhatsappHref(raw: string): string {
  const digits = sanitizePhoneDigits(raw);
  let intl = digits;
  if (digits.startsWith("90")) intl = digits;
  else if (digits.startsWith("0")) intl = `9${digits}`;
  else if (digits.length === 10) intl = `90${digits}`;
  return `https://wa.me/${intl}`;
}

/** 🔥 Sadece SLUG varsa detay sayfasına gidilebilir */
const canNavigateToProduct = (p: UiProduct | null | undefined) =>
  !!p?.slug && String(p.slug).trim().length > 0;

export function ProductDetailPage({
  productId,
  onNavigate,
  onProductDetail,
}: ProductDetailPageProps) {
  const routerNavigate = useNavigate();

  // ----- UI state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const [currentPopularIndex, setCurrentPopularIndex] = useState(0);

  // ---- Contact form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "", // honeypot
    cemetery: "", // sadece UI, BE'ye gönderilmiyor
  });
  const [createContact, { isLoading: contactSaving }] = useCreateContactMutation();

  // ----- Site settings
  const { data: siteSettingsData } = useListSiteSettingsQuery(undefined);
  const settings = useMemo(() => toSettingsMap(siteSettingsData), [siteSettingsData]);
  const contactPhoneRaw = settings["contact_phone_tel"] || "0533 483 89 71";
  const telHref = buildTelHref(contactPhoneRaw);
  const waHref = buildWhatsappHref(contactPhoneRaw);

  // ----- Detay verisi (slug string ile)
  const { data: detailData } = useGetProductQuery(productId, {
    skip: !productId,
  });

  const product = useMemo(
    () => (detailData ? toUiProduct(detailData) : null),
    [detailData],
  );

  // --- Ürün geldikten sonra ContactPage ile uyumlu default subject yaz
  useEffect(() => {
    if (product && !formData.subject.trim()) {
      setFormData((p) => ({
        ...p,
        subject: `Ürün bilgi talebi: ${product.title || ""}`.trim(),
      }));
    }
  }, [product]); // eslint-disable-line react-hooks/exhaustive-deps

  // ----- Popüler
  const { data: popularRes } = useListProductsQuery({
    is_active: 1,
    sort: "rating",
    order: "asc",
    limit: 8,
  });
  const popularProducts: UiProduct[] = useMemo(
    () =>
      Array.isArray(popularRes)
        ? (popularRes as ApiProduct[]).map(toUiProduct)
        : [],
    [popularRes],
  );

  // ----- Benzer
  const { data: similarRes } = useListProductsQuery(
    product
      ? { is_active: 1, category_id: product.category_id, limit: 24 }
      : undefined,
    { skip: !product },
  );
  const similarProducts: UiProduct[] = useMemo(() => {
    const arr = Array.isArray(similarRes)
      ? (similarRes as ApiProduct[]).map(toUiProduct)
      : [];
    return product ? arr.filter((p) => p.id !== product.id).slice(0, 8) : [];
  }, [similarRes, product]);

  // ----- Reviews / FAQs / Specs
  const { data: reviewsData = [], isFetching: reviewsLoading } =
    useListProductReviewsQuery(
      product
        ? { product_id: product.id, only_active: 1 }
        : ({ product_id: "" as any, only_active: 1 } as any),
      { skip: !product },
    );
  const { data: faqsData = [], isFetching: faqsLoading } =
    useListProductFaqsQuery(
      product
        ? { product_id: product.id, only_active: 1 }
        : ({ product_id: "" as any, only_active: 1 } as any),
      { skip: !product },
    );
  const { data: specsRows = [], isFetching: specsLoading } =
    useListProductSpecsQuery(
      product ? { product_id: product.id } : ({ product_id: "" as any } as any),
      { skip: !product },
    );

  const reviews: ProductReviewRow[] = Array.isArray(reviewsData)
    ? (reviewsData as ProductReviewRow[])
    : [];
  const faqs: ProductFaqRow[] = Array.isArray(faqsData)
    ? (faqsData as ProductFaqRow[])
    : [];

  const specsFromRows: Record<string, string> = useMemo(() => {
    const out: Record<string, string> = {};
    (specsRows as ProductSpecRow[]).forEach((s) => {
      if (s?.name) out[s.name] = s.value ?? "";
    });
    return out;
  }, [specsRows]);

  const specsMerged = useMemo(() => {
    const base = { ...normalizeSpecs(product?.specifications) };
    return { ...base, ...specsFromRows };
  }, [product?.specifications, specsFromRows]);

  // ----- Autoplay (yorumlar)
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= 1) return;
    const t = setInterval(
      () => setCurrentReviewIndex((i) => (i + 1) % reviews.length),
      5000,
    );
    return () => clearInterval(t);
  }, [isAutoPlaying, reviews.length]);

  // ----- Touch handlers (yorumlar)
  const onTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches?.[0]?.clientX ?? 0);
  const onTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches?.[0]?.clientX ?? 0);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || reviews.length === 0) return;
    const dist = touchStart - touchEnd;
    if (dist > 50) setCurrentReviewIndex((i) => (i + 1) % reviews.length);
    if (dist < -50)
      setCurrentReviewIndex(
        (i) => (i - 1 + reviews.length) % reviews.length,
      );
  };

  // ----- Detay navigasyon – sadece SLUG
  const goDetail = (p: UiProduct) => {
    const slug = (p.slug ?? "").toString().trim();
    if (!slug) return;
    onProductDetail?.(slug);
  };

  const handlePopularClick = () => {
    const item = popularProducts[currentPopularIndex];
    if (!item || !canNavigateToProduct(item)) return;
    goDetail(item);
  };
  const handleSimilarClick = (item: UiProduct) => {
    if (!canNavigateToProduct(item)) return;
    goDetail(item);
  };

  // ----- Contact form
  const onContactInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const canSubmit =
    formData.name.trim().length > 1 &&
    formData.email.trim().length > 5 &&
    formData.phone.trim().length > 5 &&
    formData.subject.trim().length > 0 &&
    formData.message.trim().length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Lütfen tüm gerekli alanları doldurunuz.");
      return;
    }

    const messageFinal = [
      formData.message.trim(),
      formData.cemetery.trim()
        ? `\n\nMezarlık: ${formData.cemetery.trim()}`
        : "",
      product?.title ? `\nİlgili Ürün: ${product.title}` : "",
    ]
      .join("")
      .trim();

    const basePayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: messageFinal,
    };

    const websiteTrim = formData.website.trim();
    const payload: ContactCreateInput = websiteTrim
      ? { ...basePayload, website: websiteTrim }
      : { ...basePayload, website: null };

    try {
      await createContact(payload).unwrap();
      toast.success("Talebiniz alındı! En kısa sürede size dönüş yapacağız.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: product ? `Ürün bilgi talebi: ${product.title}` : "",
        message: "",
        website: "",
        cemetery: "",
      });
    } catch (err: any) {
      toast.error(
        typeof err?.data?.error === "string"
          ? `Hata: ${err.data.error}`
          : "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
      );
    }
  };

  // ----- Ürün bulunamadı
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ürün bulunamadı
          </h2>
        </div>
      </div>
    );
  }

  const images = product.images.length
    ? product.images
    : product.image
    ? [product.image]
    : [];

  const SPEC_MAIN_KEYS = [
    "dimensions",
    "weight",
    "thickness",
    "surfaceFinish",
    "warranty",
    "installationTime",
  ] as const;
  type SpecKey = (typeof SPEC_MAIN_KEYS)[number];
  const SPEC_LABELS: Record<SpecKey, string> = {
    dimensions: "Boyutlar",
    weight: "Ağırlık",
    thickness: "Kalınlık",
    surfaceFinish: "Yüzey İşlemi",
    warranty: "Garanti",
    installationTime: "Kurulum Süresi",
  };

  const hasSpecs =
    Object.values(specsMerged).some(
      (v) => (v ?? "").toString().trim().length > 0,
    ) || specsRows.length > 0;

  const Stars = ({ rating }: { rating: number }) => {
    const r = Math.max(0, Math.min(5, Math.round(rating)));
    return (
      <div className="flex justify-center mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < r ? "text-yellow-400 fill-current" : "text-gray-300"
            } mx-0.5`}
          />
        ))}
      </div>
    );
  };

  const reviewCount = Math.max(1, reviews.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                // Hem router'ı hem de üst layout state'ini güncelle
                routerNavigate("/");
                onNavigate("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-teal-600 hover:text-teal-700 flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfa
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-semibold">Mezar Modelleri</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-bold">
              {product.productCode || product.title}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden shadow-lg">
              <ImageWithFallback
                src={images[currentImageIndex] ?? ""}
                alt={`${product.title} - Görsel ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={`${product.id}-${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? "border-teal-500 ring-2 ring-teal-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.title} küçük görsel ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-500 font-medium">
                {Math.max(1, images.length)} fotoğraf mevcut
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <div className="mb-4">
                {product.productCode && (
                  <Badge
                    variant="outline"
                    className="text-teal-600 border-teal-600 mb-3 font-bold"
                  >
                    {product.productCode}
                  </Badge>
                )}
                <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                  {product.title}
                </h1>
              </div>

              <div className="mb-4">
                <div className="inline-flex items-center bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Ürün Satış Fiyatı:
                </div>
              </div>

              <div className="mb-6">
                <div className="inline-flex items-center justify-center bg-white border-4 border-black rounded-full px-8 py-4 shadow-lg">
                  <span className="text-4xl font-bold text-teal-600 text-center">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ürün Açıklaması
              </h3>
              <p className="text-gray-700 font-semibold leading-snug">
                {product.description}
              </p>
            </div>

            {hasSpecs && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Teknik Özellikler
                </h3>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="space-y-3">
                    {SPEC_MAIN_KEYS.map((k) => {
                      const v = (specsMerged as Record<string, string>)[k];
                      return v ? (
                        <div
                          className="flex items-start gap-3"
                          key={k}
                        >
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-800 font-semibold leading-tight">
                            <strong>{SPEC_LABELS[k]}:</strong> {v}
                          </span>
                        </div>
                      ) : null;
                    })}

                    {Object.entries(specsMerged)
                      .filter(
                        ([k]) =>
                          !SPEC_MAIN_KEYS.includes(
                            k as (typeof SPEC_MAIN_KEYS)[number],
                          ),
                      )
                      .map(([k, v]) => (
                        <div
                          className="flex items-start gap-3"
                          key={k}
                        >
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-800 font-semibold leading-tight">
                            <strong>{k}:</strong> {String(v)}
                          </span>
                        </div>
                      ))}

                    {(specsLoading ||
                      (!Object.keys(specsMerged).length && specsRows.length === 0)) && (
                      <p className="text-sm text-gray-500">
                        Teknik özellikler yükleniyor…
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Accordions */}
        <div className="mt-8 lg:mt-16 bg-white rounded-lg shadow-sm overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {/* Reviews */}
            <AccordionItem value="reviews" className="border-b border-gray-200">
              <AccordionTrigger className="bg-teal-600 text-white px-6 py-4 hover:bg-teal-700 text-left">
                <span className="text-lg font-bold flex items-center gap-2">
                  ⭐ Müşterilerimizden Gelen Görüşler
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 bg-white accordion-content-reviews">
                <div className="relative overflow-hidden">
                  <div
                    className="relative touch-manipulation select-none"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                  >
                    <div className="overflow-hidden rounded-xl">
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          width: `${reviewCount * 100}%`,
                          transform: `translateX(-${
                            (currentReviewIndex * 100) / reviewCount
                          }%)`,
                        }}
                      >
                        {(reviews.length
                          ? reviews
                          : [
                              {
                                id: "placeholder",
                                rating: 5,
                                comment: "Yorumlar yükleniyor…",
                                customer_name: "",
                                is_active: 1,
                              } as any,
                            ]
                        ).map((review: ProductReviewRow | any, i: number) => (
                          <div
                            key={(review as ProductReviewRow).id ?? `rev-${i}`}
                            className="flex-shrink-0"
                            style={{ width: `${100 / reviewCount}%` }}
                          >
                            <div className="bg-gradient-to-br from-teal-50 to-white rounded-lg p-3 md:p-4 shadow-sm border border-teal-100 mx-1">
                              <div className="text-center mb-3">
                                <div className="w-12 h-12 mx-auto mb-2 bg-teal-600 rounded-full flex items-center justify-center shadow-md">
                                  <span className="text-white text-base font-bold">
                                    {(review.customer_name || "M")
                                      .toString()
                                      .trim()
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>
                                </div>
                                <h4 className="text-base font-bold text-teal-600 mb-1">
                                  {review.customer_name || "Anonim Müşteri"}
                                </h4>
                                <Stars rating={Number(review.rating ?? 5)} />
                              </div>
                              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <div className="text-teal-600 text-2xl mb-1 text-center opacity-50">
                                  "
                                </div>
                                <p className="text-gray-700 text-center leading-relaxed text-sm italic">
                                  {review.comment || "—"}
                                </p>
                                <div className="text-teal-600 text-2xl mt-1 text-center rotate-180 opacity-50">
                                  "
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {reviews.length > 1 && (
                    <>
                      <div className="flex justify-between items-center mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentReviewIndex(
                              (i) => (i - 1 + reviews.length) % reviews.length,
                            )
                          }
                          className="border-teal-500 text-teal-600 hover:bg-teal-50 text-xs px-2 py-1"
                        >
                          <ChevronLeft className="w-3 h-3 mr-1" />
                          Önceki
                        </Button>
                        <div className="flex items-center gap-1">
                          {reviews.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentReviewIndex(idx)}
                              className={`transition-all duration-300 rounded-full ${
                                idx === currentReviewIndex
                                  ? "w-6 h-2 bg-teal-500"
                                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                              }`}
                              aria-label={`${idx + 1}. yoruma git`}
                            />
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentReviewIndex(
                              (i) => (i + 1) % reviews.length,
                            )
                          }
                          className="border-teal-500 text-teal-600 hover:bg-teal-50 text-xs px-2 py-1"
                        >
                          Sonraki
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>

                      <div className="text-center mt-2">
                        <p className="text-xs text-gray-500">
                          {currentReviewIndex + 1} / {reviews.length} müşteri
                          yorumu
                        </p>
                      </div>
                    </>
                  )}

                  {reviewsLoading && reviews.length === 0 && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Yorumlar yükleniyor…
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* İletişim */}
            <AccordionItem value="contact" className="border-b border-gray-200">
              <AccordionTrigger className="bg-teal-600 text-white px-6 py-4 hover:bg-teal-700 text-left">
                <span className="text-lg font-bold">
                  Bu Ürün Hakkında Detaylı Görüşmek
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6 bg-white accordion-content-contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold text-teal-600 mb-4">
                      İletişim Bilgileri
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-600 font-bold">📞</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Telefon</p>
                          <p className="text-teal-600 font-bold">
                            {contactPhoneRaw}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">📱</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            WhatsApp
                          </p>
                          <p className="text-green-600 font-bold">
                            {contactPhoneRaw}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-3">
                      <Button
                        onClick={() => window.open(telHref)}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        📞 Hemen Ara
                      </Button>
                      <Button
                        onClick={() => window.open(waHref, "_blank")}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        💬 WhatsApp'tan Yaz
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-teal-600 mb-4">
                      Detaylı Bilgi Formu
                    </h4>
                    <form onSubmit={onSubmit} className="space-y-4">
                      {/* Honeypot (gizli) */}
                      <div className="hidden">
                        <Input
                          id="website"
                          name="website"
                          type="text"
                          value={formData.website}
                          onChange={onContactInput}
                          autoComplete="off"
                          tabIndex={-1}
                        />
                      </div>

                      <Input
                        type="text"
                        name="name"
                        placeholder="Adınız Soyadınız"
                        value={formData.name}
                        onChange={onContactInput}
                        required
                        disabled={contactSaving}
                      />

                      <Input
                        type="email"
                        name="email"
                        placeholder="E-posta Adresiniz"
                        value={formData.email}
                        onChange={onContactInput}
                        required
                        disabled={contactSaving}
                      />

                      <Input
                        type="tel"
                        name="phone"
                        placeholder="Telefon Numaranız"
                        value={formData.phone}
                        onChange={onContactInput}
                        required
                        disabled={contactSaving}
                      />

                      <Input
                        type="text"
                        name="subject"
                        placeholder="Konu"
                        value={formData.subject}
                        onChange={onContactInput}
                        required
                        disabled={contactSaving}
                      />

                      <Input
                        type="text"
                        name="cemetery"
                        placeholder="Mezarlık Adı (opsiyonel)"
                        value={formData.cemetery}
                        onChange={onContactInput}
                        disabled={contactSaving}
                      />

                      <Textarea
                        name="message"
                        placeholder="Mesajınız ve özel istekleriniz..."
                        value={formData.message}
                        onChange={onContactInput}
                        rows={4}
                        required
                        disabled={contactSaving}
                      />

                      <Button
                        type="submit"
                        disabled={!canSubmit || contactSaving}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        {contactSaving ? "Gönderiliyor…" : "📧 Bilgi Talep Et"}
                      </Button>
                    </form>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* DİĞER KONULAR (Popüler) */}
            <AccordionItem value="popular" className="border-b-0">
              <AccordionTrigger className="bg-teal-600 text-white px-6 py-4 hover:bg-teal-700 text-left">
                <span className="text-lg font-bold">DİĞER KONULAR</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-white accordion-content-limited">
                <div className="relative">
                  <div className="bg-gray-50 rounded-lg p-6">
                    {popularProducts.length > 0 && (
                      <div className="text-center">
                        <div className="mb-4">
                          <ImageWithFallback
                            src={popularProducts[currentPopularIndex]?.image ?? ""}
                            alt={
                              popularProducts[currentPopularIndex]?.title ?? "Ürün"
                            }
                            className="w-40 h-32 object-cover rounded-lg mx-auto shadow-md"
                          />
                        </div>
                        <h4 className="text-lg font-bold text-teal-600 mb-2">
                          {popularProducts[currentPopularIndex]?.title ?? ""}
                        </h4>
                        <p className="text-2xl font-bold text-gray-800 mb-4">
                          {formatPrice(popularProducts[currentPopularIndex]?.price)}
                        </p>
                        <Button
                          onClick={handlePopularClick}
                          disabled={
                            !canNavigateToProduct(
                              popularProducts[currentPopularIndex],
                            )
                          }
                          className="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          Detaylı İncele
                        </Button>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPopularIndex(
                            (i) =>
                              (i - 1 + popularProducts.length) %
                              popularProducts.length,
                          )
                        }
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="flex space-x-2">
                        {popularProducts.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx === currentPopularIndex
                                ? "bg-teal-500"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPopularIndex(
                            (i) => (i + 1) % popularProducts.length,
                          )
                        }
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Fiyat İçin Arayınız */}
        <div className="mt-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 md:p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              🔥 Özel Fiyat İçin Hemen Arayın! 🔥
            </h3>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              Bu ürün için en uygun fiyatı almak ve detaylı bilgi için hemen
              bizimle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => window.open(telHref)}
                className="bg-white text-teal-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg"
              >
                📞 {contactPhoneRaw}
              </Button>
              <Button
                onClick={() => window.open(waHref, "_blank")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 text-lg"
              >
                💬 WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* Benzer Ürünler – Carousel + sonsuz döngü */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Benzer Ürünler
            </h2>
            <p className="text-gray-600">Size uygun diğer mezar modelleri</p>
          </div>

          {similarProducts.length > 0 ? (
            <div className="relative">
              <Carousel
                className="w-full"
                opts={{ align: "start", loop: true }}
              >
                <CarouselContent className="-ml-3">
                  {similarProducts.map((sp) => (
                    <CarouselItem
                      key={sp.id}
                      className="pl-3 basis-full sm:basis-1/2 lg:basis-1/4"
                    >
                      <div
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full"
                        onClick={() => handleSimilarClick(sp)}
                      >
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <ImageWithFallback
                            src={sp.image}
                            alt={sp.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                              <div className="bg-white bg-opacity-90 rounded-full p-3">
                                <svg
                                  className="w-6 h-6 text-teal-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-gray-800 mb-3 text-sm leading-tight min-h-[2.5rem] line-clamp-2">
                            {sp.title}
                          </h3>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-teal-600 font-bold text-lg">
                              {formatPrice(sp.price)}
                            </span>
                          </div>
                          <Button
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSimilarClick(sp);
                            }}
                            disabled={!canNavigateToProduct(sp)}
                          >
                            <span className="flex items-center justify-center gap-2">
                              Detaylı İncele
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </span>
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="left-0 -translate-x-4" />
                <CarouselNext className="right-0 translate-x-4" />
              </Carousel>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  {similarProducts.length} benzer ürün listelendi.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500">
              Bu ürüne ait benzer ürün bulunamadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
